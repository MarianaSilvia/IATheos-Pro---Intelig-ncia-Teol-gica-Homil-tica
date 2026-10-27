import express from "express";
import routes from "./routes.ts";
import aiRoutes from "./ai.ts";
import { handleError } from "./http.ts";
export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));
  app.use("/api/theology", aiRoutes);
  app.use("/api", routes);
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
  });
  app.use(handleError);
  return app;
}
