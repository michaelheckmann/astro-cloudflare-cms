import type { ContentItem } from "@/lib/schema";
import { z } from "zod";
import {
  booleanValidation,
  dateValidation,
  imageValidation,
  numberValidation,
  selectValidation,
  stringValidation,
  textValidation,
} from "./field-schema-validation";

export const useFormSchema = (contentItem: ContentItem) => {
  return z.object(
    contentItem.fields.reduce(
      (acc, field) => {
        let zodType: z.ZodTypeAny = z.any();

        switch (field.type) {
          case "boolean":
            zodType = booleanValidation(field);
            break;
          case "date":
            zodType = dateValidation(field);
            break;
          case "image":
            zodType = imageValidation(field);
            break;
          case "number":
            zodType = numberValidation(field);
            break;
          case "select":
            zodType = selectValidation(field);
            break;
          case "string":
            zodType = stringValidation(field);
            break;
          case "text":
            zodType = textValidation(field);
            break;
        }

        acc[field.name] = zodType;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>,
    ),
  );
};
