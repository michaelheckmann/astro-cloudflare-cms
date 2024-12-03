// biome-ignore lint/style/useNodejsImportProtocol: We want to use the buffer package in the browser
import { Buffer } from "buffer";

import { CONFIG } from "@/config";
import { contentToFile, fileToContent } from "@/lib/file";
import { EditForm } from "@/modules/form";
import type { OctokitResponse } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/collection/$group/$name/$entry")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { group, name, entry } = params;

    const contentItem = CONFIG.content
      .find((g) => group === g.name)
      ?.items.find((i) => name === i.name);

    if (!contentItem) {
      throw redirect({ to: "/" });
    }
    const response = await fetch(
      `/api/repo/${encodeURIComponent(`${entry}.${contentItem.fileType}`)}/contents`,
    );
    if (response.status === 404) {
      return { contentItem, fieldValues: {}, entry };
    }
    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    const data = (await response.json()) as OctokitResponse | OctokitResponse[];

    if (Array.isArray(data)) {
      throw new Error("Expected a file but found a directory");
    }
    if (data.type !== "file") {
      throw new Error("Invalid response type");
    }

    const fileContent = Buffer.from(data.content, "base64").toString("utf-8");
    return {
      contentItem,
      fieldValues: fileToContent({ content: fileContent, contentItem }),
      sha: data.sha,
      entry,
    };
  },
  staleTime: 10_000, // 10 seconds
});

function RouteComponent() {
  const { fieldValues, contentItem, sha, entry } = Route.useLoaderData();

  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const file = contentToFile({ values, contentItem });
      console.log("mutationFn: ~ file:", values);
      console.log("mutationFn: ~ file:", file);

      const response = await fetch(
        // We need to use the entry here, because for collection items, the path is dynamic
        `/api/repo/${encodeURIComponent(`${entry}.${contentItem.fileType}`)}/contents`,
        {
          method: "POST",
          body: JSON.stringify({ file, sha }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save values");
      }

      return !sha; // Should invalidate if creating a new file
    },
    onSuccess: async (shouldInvalidate) => {
      toast.success("Values saved successfully");
      if (shouldInvalidate) await router.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <EditForm
      fieldValues={fieldValues}
      contentItem={contentItem}
      isCreating={!sha}
      handleSubmit={mutateAsync}
    />
  );
}
