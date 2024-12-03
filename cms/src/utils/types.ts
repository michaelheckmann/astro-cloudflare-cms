import type { Octokit } from "octokit";

export type OctokitResponse = Awaited<
  ReturnType<Octokit["rest"]["repos"]["getContent"]>
>["data"];

export type OctokitFileResponse = Extract<OctokitResponse, { type: "file" }>;
