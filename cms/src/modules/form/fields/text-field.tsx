import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToString,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "text" }>;
};

export const TextField = ({ field }: Props) => {
  return (
    <AutosizeTextarea maxHeight={500} {...coerceRhfFieldToString(field)} />
  );
};
