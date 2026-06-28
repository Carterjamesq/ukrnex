import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { analyzeLotRequestSchema } from "@ukrnex/shared";
import { fetchLotDetails } from "../services/lot-fetcher.js";
import { detectAuction, extractLotId } from "../services/lot-parser.js";

export const analyzeRoutes = new Hono();

analyzeRoutes.post("/", zValidator("json", analyzeLotRequestSchema), async (c) => {
  const { url } = c.req.valid("json");
  const auction = detectAuction(url);
  const lotId = extractLotId(url);

  if (!auction || !lotId) {
    return c.json(
      {
        error: "Не вдалося розпізнати лот за посиланням",
      },
      422
    );
  }

  try {
    const lot = await fetchLotDetails(url);

    return c.json({
      id: `${auction}-${lotId}`,
      status: "completed" as const,
      auction,
      lotUrl: url,
      message: "Дані лоту успішно завантажено",
      lot,
    });
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Не вдалося завантажити дані лоту",
      },
      502
    );
  }
});
