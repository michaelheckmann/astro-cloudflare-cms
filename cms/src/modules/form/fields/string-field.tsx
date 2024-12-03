import { Input } from "@/components/ui/input";
import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToString,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "string" }>;
};

export const StringField = ({ field }: Props) => {
  return <Input {...coerceRhfFieldToString(field)} />;
};
