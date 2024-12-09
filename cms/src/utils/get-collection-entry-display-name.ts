import type { ContentItem } from "@/lib/schema";

type File = {
  name: string;
  content: Record<string, unknown>;
};

/**
 * Retrieves the display name for a collection entry.
 *
 * @param file - The file object containing content and metadata.
 * @param contentItem - The content item object containing type and display key information.
 * @returns The display name for the collection entry. If the content item type is "file",
 *          it returns the content item's label. If the display name is not found or is not a string,
 *          it returns the file's name.
 */
export const getCollectionEntryDisplayName = (
  file: File,
  contentItem: ContentItem,
) => {
  if (contentItem.type === "file") {
    return contentItem.label;
  }

  const displayName = file.content[contentItem.displayKey];

  if (!displayName || typeof displayName !== "string") {
    return file.name;
  }

  return displayName;
};
