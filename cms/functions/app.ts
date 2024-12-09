import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { CONFIG } from "../src/config";
import { getOctokit } from "./utils/octokit";

const app = new Hono<{ Bindings: Env }>({ strict: false }).basePath("/api");

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/repo/:path/contents", async (c) => {
  const path = c.req.param("path");

  const octokit = getOctokit(c);
  try {
    const response = await octokit.rest.repos.getContent({
      owner: CONFIG.meta.owner,
      repo: CONFIG.meta.repo,
      ref: CONFIG.meta.branch,
      path: decodeURIComponent(path),
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    // Only retrieved a single file
    if (!Array.isArray(response.data)) {
      return c.json(response.data);
    }

    // Retrieved a directory
    const contents = await Promise.all(
      response.data
        .filter((entry) => entry.type === "file")
        .map((entry) => {
          return octokit.rest.repos.getContent({
            owner: CONFIG.meta.owner,
            repo: CONFIG.meta.repo,
            ref: CONFIG.meta.branch,
            path: entry.path,
          });
        }),
    );

    const data = contents
      .map(({ data }) => data)
      .filter((entry) => !Array.isArray(entry));

    return c.json(data);
  } catch (error) {
    if (error.status === 404) {
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
    const { file, sha } = c.req.valid("json");

    const octokit = getOctokit(c);
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: CONFIG.meta.owner,
      repo: CONFIG.meta.repo,
      ref: CONFIG.meta.branch,
      path: decodeURIComponent(path),
      message: sha ? `Update ${path} (via CMS)` : `Create ${path} (via CMS)`,
      content: Buffer.from(file).toString("base64"),
      sha: sha,
    });

    if (!response.data.commit || !response.data.content) {
      throw new Error("Invalid response");
    }

    return c.json(response.data);
  },
);

app.delete(
  "/repo/:path/contents",
  zValidator(
    "query",
    z.object({
      sha: z.string(),
    }),
  ),
  async (c) => {
    const path = c.req.param("path");
    const { sha } = c.req.valid("query");

    const octokit = getOctokit(c);
    try {
      const response = await octokit.rest.repos.deleteFile({
        owner: CONFIG.meta.owner,
        repo: CONFIG.meta.repo,
        ref: CONFIG.meta.branch,
        path: decodeURIComponent(path),
        message: `Delete ${path} (via CMS)`,
        sha,
      });

      return c.json(response.data);
    } catch (error) {
      if (error.status === 404) {
        return c.json({ message: "File not found" }, 404);
      }
      throw error;
    }
  },
);

export default app;
