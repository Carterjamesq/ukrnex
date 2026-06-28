import { z } from "zod";

export const SUPPORTED_AUCTIONS = ["copart", "iaai", "impactauto"] as const;

export const analyzeLotRequestSchema = z.object({
  url: z
    .string()
    .url("Невірне посилання")
    .refine(
      (url) =>
        SUPPORTED_AUCTIONS.some((auction) =>
          url.toLowerCase().includes(auction),
        ),
      "Підтримуються лише Copart та IAAI",
    ),
});

export type AnalyzeLotRequest = z.infer<typeof analyzeLotRequestSchema>;
