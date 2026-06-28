import { Hono } from "hono";
import { cors } from "hono/cors";
import { analyzeRoutes } from "./routes/analyze.js";
import { lotRoutes } from "./routes/lots.js";

export function createApp() {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
    }),
  );

  app.get("/health", (c) => c.json({ status: "ok", service: "ukrnex-api" }));

  app.route("/api/v1/analyze", analyzeRoutes);
  app.route("/api/v1/lots", lotRoutes);

  return app;
}

export const app = createApp();
