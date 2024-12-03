import { Input } from "@/components/ui/input";
import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToNumber,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "number" }>;
};

export const NumberField = ({ field, contentItemField }: Props) => {
  const rhfField = coerceRhfFieldToNumber(field);
  return (
    <Input
      type="number"
      ref={rhfField.ref}
      name={rhfField.name}
      value={rhfField.value}
      onChange={({ target }) => rhfField.onChange(Number(target.value))}
      onBlur={rhfField.onBlur}
      disabled={rhfField.disabled}
    />
  );
};
