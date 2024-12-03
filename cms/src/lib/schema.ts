import { z } from "zod";

const sharedFieldSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9-_]+$/, {
    message: "'name' must be alphanumeric with dashes and underscores.",
  }),
  label: z.string(),
  description: z.string().optional(),
  required: z.boolean().optional(),
});

export const booleanFieldSchema = z
  .object({
    type: z.literal("boolean"),
    switchLabel: z.string(),
    default: z.boolean().optional(),
  })
  .merge(sharedFieldSchema);

export const dateFieldSchema = z
  .object({
    type: z.literal("date"),
    default: z.date().optional(),
    min: z
      .date()
      .optional()
      .describe(
        "The earliest date to accept. If undefined, there is no min date. This must be formatted as a standard min value for a date input (i.e. yyyy-mm-dd) or min value for a datetime input (i.e. YYYY-MM-DDThh:mm).",
      ),
    max: z
      .date()
      .optional()
      .describe(
        "The latest date to accept. If undefined, there is no max date. This must be formatted as a standard max value for a date input (i.e. yyyy-mm-dd) or max value for a datetime input (i.e. YYYY-MM-DDThh:mm).",
      ),
  })
  .merge(sharedFieldSchema);

export const imageFieldSchema = z
  .object({
    type: z.literal("image"),
    default: z.string().optional(),
  })
  .merge(sharedFieldSchema);

export const numberFieldSchema = z
  .object({
    type: z.literal("number"),
    default: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .merge(sharedFieldSchema);

export const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const selectFieldSchema = z
  .object({
    type: z.literal("select"),
    default: z.string().optional(),
    options: z.array(selectOptionSchema),
  })
  .merge(sharedFieldSchema);

export const stringFieldSchema = z
  .object({
    type: z.literal("string"),
    default: z.string().optional(),
    pattern: z
      .string()
      .optional()
      .describe(
        "A regex pattern to validate the input against. This should be a valid regex pattern.",
      ),
  })
  .merge(sharedFieldSchema);

export const textFieldSchema = z
  .object({ type: z.literal("text"), default: z.string().optional() })
  .merge(sharedFieldSchema);

export type Field = z.infer<typeof fieldSchema>;
export const fieldSchema = z.discriminatedUnion("type", [
  booleanFieldSchema,
  dateFieldSchema,
  imageFieldSchema,
  numberFieldSchema,
  selectFieldSchema,
  stringFieldSchema,
  textFieldSchema,
]);

export const baseContentItemSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: "'name' must be alphanumeric with dashes and underscores.",
    })
    .describe(
      "Must be unique across the content array. Machine name for the content entry.",
    ),
  label: z.string().describe("The human-readable name of the content entry."),
  path: z
    .string()
    .regex(/^[^/].*[^/]$|^$/, {
      message:
        "'path' must be a valid relative path (no leading or trailing slash).",
    })
    .describe(
      "Path to the folder where the files are stored if it's a collection, otherwise the path to the single file",
    ),
  fields: z.array(fieldSchema),
});

export const mdContentItemSchema = z
  .object({ fileType: z.literal("md"), bodyKey: z.string() })
  .and(baseContentItemSchema)
  .refine(
    ({ fields, bodyKey }) => fields.some(({ name }) => name === bodyKey),
    { message: "The bodyKey must be a valid field name" },
  );

export const jsonContentItemSchema = z
  .object({ fileType: z.literal("json") })
  .and(baseContentItemSchema);

export const baseContentItemWithFileTypeSchema = z.union([
  mdContentItemSchema,
  jsonContentItemSchema,
]);

const fileContentItemSchema = z
  .object({ type: z.literal("file") })
  .and(baseContentItemWithFileTypeSchema);

export const collectionContentItemSchema = z
  .object({ type: z.literal("collection"), displayKey: z.string() })
  .and(baseContentItemWithFileTypeSchema)
  .refine(
    ({ fields, displayKey }) => fields.some(({ name }) => name === displayKey),
    { message: "The displayKey must be a valid field name" },
  );

export type ContentItem = z.infer<typeof contentItemSchema>;
export const contentItemSchema = z
  .union([fileContentItemSchema, collectionContentItemSchema])
  .superRefine((item, ctx) => {
    if (!item.path.endsWith(`.${item.fileType}`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The path must end with the file type",
      });
    }

    if (item.type === "collection") {
      const slashes = item.path.match(/\//g);
      if (!slashes || slashes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The path must contain a folder",
        });
      }
      if (slashes?.length === 1 && item.path.startsWith("/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The path must contain a folder and not be at the root",
        });
      }
    }
  });

export const contentGroupSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: "'name' must be alphanumeric with dashes and underscores.",
    })
    .describe(
      "Must be unique across the content array. Machine name for the content group.",
    ),
  label: z.string().describe("The human-readable name of the content entry."),
  items: z.array(contentItemSchema),
});

export type Content = z.infer<typeof contentSchema>;
export const contentSchema = z
  .array(contentGroupSchema)
  .superRefine((groups, ctx) => {
    const groupNames = groups.map((item) => item.name);
    if (new Set(groupNames).size !== groupNames.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Group names must be unique",
      });
    }

    groups.forEach((group) => {
      const itemNames = group.items.map((item) => item.name);
      if (new Set(itemNames).size !== itemNames.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Item names must be unique within a group",
        });
      }
    });

    const allPaths = groups.flatMap((item) =>
      item.items.map((item) => item.path),
    );
    if (new Set(allPaths).size !== allPaths.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paths must be unique",
      });
    }
  });

export type Meta = z.infer<typeof metaSchema>;
export const metaSchema = z.object({
  repo: z.string(),
  owner: z.string(),
  branch: z.string(),
});

export type Config = z.infer<typeof configSchema>;
export const configSchema = z.object({
  meta: metaSchema,
  content: contentSchema,
});
