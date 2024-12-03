import type { Context } from "hono";
import { Octokit } from "octokit";

export const getOctokit = (c: Context<{ Bindings: Env }>) => {
  if (!c.env.GITHUB_PAT) {
    throw new Error("GITHUB_PAT not set");
  }
  return new Octokit({ auth: c.env.GITHUB_PAT });
};
