/**
 * Vercel Node.js Function entrypoint.
 *
 * The Express app remains the single source of truth for API routes. Vercel
 * invokes this catch-all function for /api/* requests and supplies the native
 * Node request/response objects that Express expects.
 */
import { createApp } from "../src/server/app.ts";

const app = createApp();

export default app;
