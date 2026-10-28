import { config } from "./src/server/config.ts";
import { createApp } from "./src/server/app.ts";
import express from "express";
import path from "node:path";
const app = createApp();
if (process.env.NODE_ENV !== "production") {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve("dist")));
  app.get("*", (_req, res) => res.sendFile(path.resolve("dist/index.html")));
}
const server = app.listen(config.port, config.host, () =>
  console.log(
    `QI Store Pro: http://${config.host}:${config.port} (Supabase ${config.local ? "local" : "remoto"})`,
  ),
);
process.on("SIGTERM", () => server.close());
