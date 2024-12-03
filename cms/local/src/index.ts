import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const app = new Hono({ strict: false }).basePath("/api");

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/repo/:path/contents", async (c) => {
  const path = c.req.param("path");

  try {
    const filePath = join(process.cwd(), "..", decodeURIComponent(path));
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      const entries = await fs.readdir(filePath);
      const stats = await Promise.all(
        entries.map((entry) => {
          const entryPath = join(filePath, entry);
          return fs.stat(entryPath);
        }),
      );

      const contents = entries.map((entry, index) => {
        return {
          name: entry,
          path: `${path}/${entry}`,
          type: stats[index].isDirectory() ? "dir" : "file",
          sha: stats[index].mtime.getTime().toString(),
          size: stats[index].size,
        };
      });
      return c.json(contents);
    }

    const content = await fs.readFile(filePath, "utf-8");
    return c.json({
      type: "file",
      content: Buffer.from(content).toString("base64"),
      sha: stats.mtime.getTime().toString(), // using mtime as a simple sha substitute
      size: stats.size,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return c.json({ message: "File not found" }, 404);
    }
    throw error;
  }
});

app.post(
  "/repo/:path/contents",
  zValidator(
    "json",
    z.object({
      file: z.string(),
      sha: z.string().optional(),
    }),
  ),
  async (c) => {
    const path = c.req.param("path");
    const { file } = c.req.valid("json");

    const filePath = join(process.cwd(), "..", decodeURIComponent(path));

    await fs.mkdir(join(filePath, ".."), { recursive: true });
    await fs.writeFile(filePath, file);

    const stats = await fs.stat(filePath);
    return c.json({
      content: {
        sha: stats.mtime.getTime().toString(),
        size: stats.size,
      },
      commit: {
        sha: stats.mtime.getTime().toString(),
      },
    });
  },
);

app.delete("/repo/:path/contents", async (c) => {
  const path = c.req.param("path");

  const filePath = join(process.cwd(), "..", decodeURIComponent(path));

  try {
    await fs.unlink(filePath);
    return c.json({ message: "File deleted" });
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return c.json({ message: "File not found" }, 404);
    }
    throw error;
  }
});

const port = 5172;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
