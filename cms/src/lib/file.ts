import { convertToIsoWithTz } from "@/utils/convert-to-iso-with-tz";
import { z } from "zod";
import type { ContentItem } from "./schema";

type ContentToFileParams = {
  values: Record<string, unknown>;
  contentItem: ContentItem;
};

export const contentToFile = ({ values, contentItem }: ContentToFileParams) => {
  // Convert date fields to strings
  const convertedValues = Object.entries(values).reduce(
    (acc, [key, value]) => {
      if (value instanceof Date) {
        acc[key] = convertToIsoWithTz(value);
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  if (contentItem.fileType === "md") {
    let content = "";

    // If there is more than one field, we need to add frontmatter
    // If there is only one field, it necessarily has to be the body
    if (contentItem.fields.length > 1) {
      content += "---\n";
      content += Object.entries(convertedValues)
        .filter(([key]) => key !== contentItem.bodyKey)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      content += "\n---\n\n";
    }

    content += convertedValues[contentItem.bodyKey];
    return content;
  }

  if (contentItem.fileType === "json") {
    return JSON.stringify(convertedValues, null, 2);
  }

  throw new Error("Unsupported file type");
};

type FileToContentParams = {
  content: string;
  contentItem: ContentItem;
};

type ParseContentParams = {
  content: Record<string, unknown>;
  contentItem: ContentItem;
};

const parseContent = ({ content, contentItem }: ParseContentParams) => {
  return Object.entries(content).reduce(
    (acc, [key, value]) => {
      const field = contentItem.fields.find(({ name }) => name === key);

      if (!field) {
        throw new Error(`Field ${key} not found`);
      }

      if (field.type === "boolean") {
        if (typeof value !== "boolean") {
          acc[key] = value === "true";
        } else {
          acc[key] = value;
        }
      } else if (field.type === "date") {
        if (value === null) {
          acc[key] = null;
        } else if (typeof value !== "string") {
          throw new Error("Date field must be a string");
        } else if (value === "null") {
          acc[key] = null;
        } else {
          acc[key] = new Date(value as string);
        }
      } else if (field.type === "number") {
        if (typeof value === "string") {
          acc[key] = Number.parseFloat(value);
        } else if (typeof value === "number") {
          acc[key] = value;
        } else {
          throw new Error("Number field must be a string or a number");
        }
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const fileToContent = ({
  content,
  contentItem,
}: FileToContentParams) => {
  if (contentItem.fileType === "md") {
    // TODO: Use proper frontmatter parsing
    const match = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);

    if (!match) {
      return {
        [contentItem.bodyKey]: content,
      };
    }

    const [, frontmatter, body] = match;
    const values = frontmatter
      .split("\n")
      .map((line) => line.split(": "))
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, unknown>,
      );

    values[contentItem.bodyKey] = body;

    return parseContent({ content: values, contentItem });
  }

  if (contentItem.fileType === "json") {
    const jsonSchema = z.record(z.string(), z.unknown());
    return parseContent({
      content: jsonSchema.parse(JSON.parse(content)),
      contentItem,
    });
  }

  throw new Error("Unsupported file type");
};
