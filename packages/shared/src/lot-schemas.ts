import { z } from "zod";

export const damageSeveritySchema = z.enum(["light", "medium", "heavy"]);
export const damageActionSchema = z.enum(["replacement", "repair"]);

export const lotSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.enum(["speed", "engine", "drivetrain", "location"]),
});

export const damageItemSchema = z.object({
  part: z.string(),
  action: damageActionSchema,
});

export const logisticsLineSchema = z.object({
  label: z.string(),
  value: z.string(),
  sublabel: z.string().optional(),
});

export const reviewedLotSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.string(),
  imageUrl: z.string().url().optional(),
});

export const lotDetailsSchema = z.object({
  id: z.string(),
  lotUrl: z.string().url(),
  lotNumber: z.string(),
  title: z.string(),
  year: z.number(),
  images: z.array(z.string().url()),
  specs: z.array(lotSpecSchema),
  nextAuctionDate: z.string(),
  sellerType: z.string(),
  sellerDescription: z.string(),
  documentType: z.string(),
  exportEligible: z.boolean(),
  damageSeverity: damageSeveritySchema,
  damageItems: z.array(damageItemSchema),
  logistics: z.array(logisticsLineSchema),
  totalPrice: z.string(),
  totalPriceLabel: z.string(),
  repairNote: z.string(),
  marketPrice: z.string(),
  savings: z.string(),
  savingsPercent: z.string(),
  reviewedLots: z.array(reviewedLotSchema),
});

export const analyzeLotResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["queued", "processing", "completed", "failed"]),
  auction: z.enum(["copart", "iaai", "impactauto"]),
  lotUrl: z.string().url(),
  message: z.string(),
  lot: lotDetailsSchema.optional(),
});

export type DamageSeverity = z.infer<typeof damageSeveritySchema>;
export type DamageAction = z.infer<typeof damageActionSchema>;
export type LotSpec = z.infer<typeof lotSpecSchema>;
export type DamageItem = z.infer<typeof damageItemSchema>;
export type LogisticsLine = z.infer<typeof logisticsLineSchema>;
export type ReviewedLot = z.infer<typeof reviewedLotSchema>;
export type LotDetails = z.infer<typeof lotDetailsSchema>;
export type AnalyzeLotResponse = z.infer<typeof analyzeLotResponseSchema>;
