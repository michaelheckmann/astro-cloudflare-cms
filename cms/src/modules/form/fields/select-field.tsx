import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToString,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "select" }>;
};

export const SelectField = ({ field, contentItemField }: Props) => {
  const rhfField = coerceRhfFieldToString(field);
  return (
    <Select
      name={rhfField.name}
      value={rhfField.value}
      onValueChange={rhfField.onChange}
      disabled={rhfField.disabled}
    >
      <SelectTrigger className="w-[180px]">
        {rhfField.value ? (
          <SelectValue />
        ) : (
          <span className="text-muted-foreground">Select an option</span>
        )}
      </SelectTrigger>
      <SelectContent onBlur={rhfField.onBlur}>
        {contentItemField.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
