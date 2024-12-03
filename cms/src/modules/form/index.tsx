import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ContentItem } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BooleanField } from "./fields/boolean-field";
import { DateField } from "./fields/date-field";
import { ImageField } from "./fields/image-field";
import { NumberField } from "./fields/number-field";
import { SelectField } from "./fields/select-field";
import { StringField } from "./fields/string-field";
import { TextField } from "./fields/text-field";
import { setDefaultValues } from "./set-default-values";
import { useFormSchema } from "./use-form-schema";

type Props = {
  fieldValues: Record<string, unknown>;
  contentItem: ContentItem;
  isCreating: boolean;
  handleSubmit: (values: Record<string, unknown>) => void;
};

export const EditForm = ({
  fieldValues,
  contentItem,
  isCreating,
  handleSubmit,
}: Props) => {
  const formSchema = useFormSchema(contentItem);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setDefaultValues({ fieldValues, contentItem }),
  });

  useEffect(() => {
    form.reset(setDefaultValues({ fieldValues, contentItem }));
  }, [fieldValues, contentItem, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col w-full max-w-3xl gap-8 pb-12 mx-auto">
          {/* Header */}
          <h2 className="text-lg font-semibold">
            {isCreating ? "Creating" : "Editing"} {contentItem.label}
          </h2>

          {/* Fields */}
          <div className="space-y-8">
            {Object.entries(form.formState.defaultValues ?? {}).map(([key]) => {
              const contentItemField = contentItem.fields.find(
                ({ name }) => name === key,
              );
              if (!contentItemField) {
                return null;
              }
              return (
                <FormField
                  key={contentItemField.name}
                  control={form.control}
                  name={contentItemField.name}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        <span>{contentItemField.label}</span>
                        {contentItemField.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <>
                          {contentItemField.type === "boolean" && (
                            <BooleanField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "date" && (
                            <DateField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "image" && (
                            <ImageField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "number" && (
                            <NumberField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "select" && (
                            <SelectField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "string" && (
                            <StringField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                          {contentItemField.type === "text" && (
                            <TextField
                              field={field}
                              contentItemField={contentItemField}
                            />
                          )}
                        </>
                      </FormControl>
                      <FormDescription>
                        {contentItemField?.description}
                      </FormDescription>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed top-3.5 right-3.5">
          <Button
            type="submit"
            className="px-8"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
