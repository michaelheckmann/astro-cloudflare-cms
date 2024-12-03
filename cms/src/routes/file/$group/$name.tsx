// biome-ignore lint/style/useNodejsImportProtocol: We want to use the buffer package in the browser
import { Buffer } from "buffer";

import { CONFIG } from "@/config";
import { contentToFile, fileToContent } from "@/lib/file";
import { EditForm } from "@/modules/form";
import type { OctokitResponse } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/file/$group/$name")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { group, name } = params;

    const contentItem = CONFIG.content
      .find((g) => group === g.name)
      ?.items.find((i) => name === i.name);

    if (!contentItem) {
      throw redirect({ to: "/" });
    }
    const response = await fetch(
      `/api/repo/${encodeURIComponent(contentItem.path)}/contents`,
    );
    if (response.status === 404) {
      return { contentItem, fieldValues: {} };
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
    };
  },
  staleTime: 10_000, // 10 seconds
});

function RouteComponent() {
  const { fieldValues, contentItem, sha } = Route.useLoaderData();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const file = contentToFile({ values, contentItem });
      const response = await fetch(
        `/api/repo/${encodeURIComponent(contentItem.path)}/contents`,
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
      router.navigate({});
      if (shouldInvalidate) await router.invalidate();
    },
    onError: async () => {
      toast.error("Failed to save values");
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
