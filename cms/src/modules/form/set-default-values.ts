import type { ContentItem, Field } from "@/lib/schema";

type SetDefaultValuesParams = {
  fieldValues: Record<string, unknown>;
  contentItem: ContentItem;
};

const defaultValues: Record<Field["type"], unknown> = {
  boolean: false,
  date: null,
  image: "",
  select: "",
  number: null,
  string: "",
  text: "",
};

export const setDefaultValues = ({
  fieldValues,
  contentItem,
}: SetDefaultValuesParams) => {
  return contentItem.fields.reduce(
    (acc, contentItemField) => {
      acc[contentItemField.name] =
        fieldValues[contentItemField.name] ?? // Use the value from the fieldValues if it exists
        contentItemField.default ?? // Use the default value from the content item if it exists
        defaultValues[contentItemField.type]; // Use the default value for the field type if it exists
      return acc;
    },
    {} as Record<string, unknown>,
  );
};
