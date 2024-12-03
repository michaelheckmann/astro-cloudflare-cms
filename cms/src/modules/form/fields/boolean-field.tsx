import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToBoolean,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "boolean" }>;
};

export const BooleanField = ({ field, contentItemField }: Props) => {
  const rhfField = coerceRhfFieldToBoolean(field);
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={rhfField.name}
        ref={rhfField.ref}
        name={rhfField.name}
        checked={rhfField.value}
        onCheckedChange={rhfField.onChange}
        onBlur={rhfField.onBlur}
        disabled={rhfField.disabled}
      />
      <Label htmlFor={rhfField.name}>{contentItemField.switchLabel}</Label>
    </div>
  );
};
