import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Field } from "@/lib/schema";
import { cn } from "@/lib/utils";
import {
  type UnknownControllerRenderProps,
  coerceRhfFieldToDate,
} from "../rhf-field";

type Props = {
  field: UnknownControllerRenderProps;
  contentItemField: Extract<Field, { type: "date" }>;
};

export const DateField = ({ field, contentItemField }: Props) => {
  const rhfField = coerceRhfFieldToDate(field);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !rhfField.value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {rhfField.value ? (
              format(rhfField.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" onBlur={rhfField.onBlur}>
          <Calendar
            mode="single"
            selected={rhfField.value ?? null}
            onSelect={rhfField.onChange}
            disabled={rhfField.disabled}
            fromDate={contentItemField.min}
            toDate={contentItemField.max}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
