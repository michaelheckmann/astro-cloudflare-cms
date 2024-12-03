import type { Field } from "@/lib/schema";
import { z } from "zod";

const required = (schema: z.ZodString, field: Field) =>
  schema.min(1, { message: `${field.label} is required` });

export const booleanValidation = (
  field: Extract<Field, { type: "boolean" }>,
) => {
  return z.boolean();
};

export const dateValidation = (field: Extract<Field, { type: "date" }>) => {
  let baseType = z.date();

  if (field.min) {
    baseType = baseType.min(new Date(field.min), {
      message: `Date must be after ${field.min}`,
    });
  }

  if (field.max) {
    baseType = baseType.max(new Date(field.max), {
      message: `Date must be before ${field.max}`,
    });
  }

  return baseType.nullable();
};

export const imageValidation = (field: Extract<Field, { type: "image" }>) => {
  let baseType = z.string();

  if (field.required) {
    baseType = required(baseType, field);
  }

  return baseType;
};

export const numberValidation = (field: Extract<Field, { type: "number" }>) => {
  let baseType = z.number();

  if (field.min) {
    baseType = baseType.min(field.min, {
      message: `Number must be greater than ${field.min}`,
    });
  }

  if (field.max) {
    baseType = baseType.max(field.max, {
      message: `Number must be less than ${field.max}`,
    });
  }

  return baseType.nullable();
};

export const selectValidation = (field: Extract<Field, { type: "select" }>) => {
  let baseType = z.string();

  if (field.required) {
    baseType = required(baseType, field);
    baseType = baseType.refine(
      (value) => {
        return field.options?.some((option) => option.value === value);
      },
      {
        message: `Invalid option selected for ${field.label}`,
      },
      // https://github.com/colinhacks/zod/issues/2474
    ) as unknown as z.ZodString;
  }

  return baseType;
};

export const stringValidation = (field: Extract<Field, { type: "string" }>) => {
  let baseType = z.string();

  if (field.required) {
    baseType = required(baseType, field);
  }

  return baseType;
};

export const textValidation = (field: Extract<Field, { type: "text" }>) => {
  let baseType = z.string();

  if (field.required) {
    baseType = required(baseType, field);
  }
  return baseType;
};
