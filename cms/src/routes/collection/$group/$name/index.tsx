// biome-ignore lint/style/useNodejsImportProtocol: We want to use the buffer package in the browser
import { Buffer } from "buffer";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CONFIG } from "@/config";
import { fileToContent } from "@/lib/file";
import { getCollectionEntryDisplayName } from "@/utils/get-collection-entry-display-name";
import { isMatchingPath } from "@/utils/is-matching-path";
import { getFolderPath, removeExtension } from "@/utils/path-utils";
import type { OctokitFileResponse, OctokitResponse } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/collection/$group/$name/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { group, name } = params;

    const contentItem = CONFIG.content
      .find((g) => group === g.name)
      ?.items.find((i) => name === i.name);

    if (!contentItem) {
      throw redirect({ to: "/" });
    }
    const res = await fetch(
      `/api/repo/${encodeURIComponent(getFolderPath(contentItem.path))}/contents`,
    );
    if (res.status === 404) {
      return { group, contentItem, files: [] };
    }
    if (!res.ok) {
      throw new Error("Failed to fetch content");
    }

    const data = (await res.json()) as OctokitResponse | OctokitResponse[];

    if (!Array.isArray(data)) {
      throw new Error("Expected a directory but found a file");
    }

    const files = data.filter(
      (item) =>
        !Array.isArray(item) &&
        item.type === "file" &&
        isMatchingPath(contentItem.path, item.path),
    ) as OctokitFileResponse[];

    const filesWithContent = files.map((file) => {
      const fileContent = Buffer.from(file.content, "base64").toString("utf-8");
      const content = fileToContent({ content: fileContent, contentItem });
      return { ...file, content };
    });

    // console.log(filesWithContent);
    return { group, contentItem, files: filesWithContent };
  },
  staleTime: 10_000, // 10 seconds
});

function RouteComponent() {
  const { group, files, contentItem } = Route.useLoaderData();
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ path, sha }: { path: string; sha: string }) => {
      const res = await fetch(
        `/api/repo/${encodeURIComponent(path)}/contents?sha=${sha}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete file");
      }
    },
    onSuccess: () => {
      toast.success("File deleted successfully");
      router.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Number</TableHead>
          <TableHead>File</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file, i) => (
          <TableRow key={file.sha}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>
              {getCollectionEntryDisplayName(file, contentItem)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-4">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link
                    to={`/collection/${group}/${contentItem.name}/${encodeURIComponent(removeExtension(file.path))}`}
                  >
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  disabled={isPending}
                  onClick={() => mutateAsync(file)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="text-muted-foreground">
            <Link
              to={`/collection/${group}/${contentItem.name}/${`${encodeURIComponent(removeExtension(contentItem.path))}-${new Date().getTime()}`}`}
            >
              Add new file
            </Link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
