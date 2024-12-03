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
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/file/$group/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { group } = Route.useParams();
  const items = CONFIG.content.find((g) => group === g.name)?.items;

  if (!items) {
    return <div>Group {group} not found</div>;
  }

  if (items.length === 0) {
    return <div>No files found in the {group} group</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(({ name, label, type }) => (
          <TableRow key={name}>
            <TableCell className="font-medium">
              {type === "file" ? "File" : "Collection"}
            </TableCell>
            <TableCell>{label}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <Link to={`/${type}/${group}/${name}`}>
                  {type === "file" ? "Edit" : "View"}
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
