import { handle } from "hono/cloudflare-pages";
import app from "../app";
export const onRequest = handle(app);
