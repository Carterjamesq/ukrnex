export type {
  LotDetails,
  AnalyzeLotResponse,
  DamageSeverity,
  DamageAction,
  LotSpec,
  DamageItem,
  LogisticsLine,
  ReviewedLot,
} from "@ukrnex/shared";

export type LotImageSource = number | string | { uri: string };

export function toImageSource(image: LotImageSource): number | { uri: string } {
  if (typeof image === "number") {
    return image;
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  return image;
}
