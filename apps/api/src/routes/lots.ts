import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { fetchLotDetails } from "../services/lot-fetcher.js";

const lotQuerySchema = z.object({
  url: z.string().url(),
});

export const lotRoutes = new Hono();

lotRoutes.get("/", zValidator("query", lotQuerySchema), async (c) => {
  const { url } = c.req.valid("query");

  try {
    const lot = await fetchLotDetails(url);
    return c.json({ lot });
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Не вдалося завантажити дані лоту",
      },
      502
    );
  }
});
