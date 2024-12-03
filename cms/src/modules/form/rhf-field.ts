import type { ControllerRenderProps, Path } from "react-hook-form";

type CrProps<T> = ControllerRenderProps<
  Record<string, T>,
  Path<Record<string, T>>
>;

export type UnknownControllerRenderProps = CrProps<unknown>;
export type BooleanControllerRenderProps = CrProps<boolean>;
export type DateControllerRenderProps = CrProps<Date>;
export type NumberControllerRenderProps = CrProps<number>;
export type StringControllerRenderProps = CrProps<string>;

export const coerceRhfFieldToBoolean = (
  field: UnknownControllerRenderProps,
) => {
  if (typeof field.value !== "boolean" && field.value !== null) {
    throw new Error("Expected boolean field value");
  }
  return field as BooleanControllerRenderProps;
};

export const coerceRhfFieldToDate = (field: UnknownControllerRenderProps) => {
  if (!(field.value instanceof Date) && field.value !== null) {
    throw new Error("Expected date field value");
  }
  return field as DateControllerRenderProps;
};

export const coerceRhfFieldToNumber = (field: UnknownControllerRenderProps) => {
  if (typeof field.value !== "number" && field.value !== null) {
    throw new Error("Expected number field value");
  }
  return field as NumberControllerRenderProps;
};

export const coerceRhfFieldToString = (field: UnknownControllerRenderProps) => {
  if (typeof field.value !== "string" && field.value !== null) {
    throw new Error("Expected string field value");
  }
  return field as StringControllerRenderProps;
};
