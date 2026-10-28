/**
 * Single Vercel Node.js Function entrypoint for the Express API.
 * The vercel.json rewrite forwards every /api/* request here while preserving
 * the original URL so the Express router can match nested routes.
 */
import { createApp } from "../src/server/app.ts";

const app = createApp();

export default app;
