import type { Context } from "hono";
import { Octokit } from "octokit";

export const getOctokit = (c: Context<{ Bindings: Env }>) => {
  if (!c.env._GITHUB_PAT) {
    throw new Error("_GITHUB_PAT not set");
  }
  return new Octokit({ auth: c.env._GITHUB_PAT });
};
