import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Field } from "@/lib/schema";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToString,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "image" }>;
};

export const ImageField = ({ field, contentItemField }: Props) => {
  const rhfField = coerceRhfFieldToString(field);

  return (
    <div className="flex items-center justify-center gap-4">
      <Input placeholder="https://..." {...rhfField} />
      {rhfField.value && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Preview</Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="size-80">
            <img
              src={rhfField.value}
              alt={contentItemField.label}
              className="object-contain size-full"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
