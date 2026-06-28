import type { LotDetails } from "@ukrnex/shared";
import type { SupportedAuction } from "./lot-parser.js";
import type { ApibaraVehicle } from "./apibara-client.js";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function formatUsd(value: unknown): string {
  const amount = asNumber(value, 0);
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatDate(value: unknown): string {
  const raw = asString(value);
  if (!raw) {
    return "—";
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function inferDamageSeverity(
  primaryDamage: string,
): LotDetails["damageSeverity"] {
  const normalized = primaryDamage.toLowerCase();

  if (
    /(hail|water|fire|rollover|all over|total|frame|structural)/.test(
      normalized,
    )
  ) {
    return "heavy";
  }

  if (/(front|rear|side|collision|minor|dent|scratch)/.test(normalized)) {
    return "medium";
  }

  return normalized ? "medium" : "light";
}

function collectImages(vehicle: ApibaraVehicle): string[] {
  const media = asRecord(vehicle.media);
  const urls: string[] = [];
  const seen = new Set<string>();

  const push = (value: unknown) => {
    if (typeof value !== "string" || !value.startsWith("http")) {
      return;
    }

    if (seen.has(value)) {
      return;
    }

    seen.add(value);
    urls.push(value);
  };

  const pushImageRecord = (image: unknown) => {
    if (typeof image === "string") {
      push(image);
      return;
    }

    const imageRecord = asRecord(image);
    if (!imageRecord) {
      return;
    }

    const type = asString(imageRecord.type).toLowerCase();
    if (type && type !== "image") {
      return;
    }

    push(imageRecord.large);
    push(imageRecord.full);
    push(imageRecord.url);
    push(imageRecord.hd);

    if (
      !imageRecord.large &&
      !imageRecord.full &&
      !imageRecord.url &&
      !imageRecord.hd
    ) {
      push(imageRecord.thumb);
      push(imageRecord.thumbnail);
    }
  };

  if (media) {
    const items = media.items;
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        pushImageRecord(item);
      }
    } else {
      const images = media.images;
      if (Array.isArray(images)) {
        for (const image of images) {
          pushImageRecord(image);
        }
      }

      const thumbs = media.thumbs;
      if (Array.isArray(thumbs)) {
        for (const thumb of thumbs) {
          push(thumb);
        }
      }
    }

    push(media.thumbnail);
    push(media.thumbnail_url);
    push(media.image);
    push(media.primary_image);
    push(media.main_image);
  }

  push(vehicle.image);
  push(vehicle.thumbnail_url);
  push(vehicle.imageUrl);

  return urls;
}

function buildTitle(vehicle: ApibaraVehicle): { title: string; year: number } {
  const year = asNumber(vehicle.year);
  const make = asString(vehicle.make);
  const model = asString(vehicle.model);
  const trim = asString(vehicle.trim);

  const titleFromFields = [make, model, trim].filter(Boolean).join(" ").trim();
  const title = asString(vehicle.title, titleFromFields || "Unknown vehicle");

  return { title, year };
}

function formatEngine(
  vehicle: ApibaraVehicle,
  specs: Record<string, unknown> | null,
): string {
  const engineValue = specs?.engine;
  const engineRecord = asRecord(engineValue);

  if (engineRecord) {
    const raw = asString(engineRecord.raw);
    if (raw) {
      return raw;
    }

    const built = [
      engineRecord.size_l ? `${asString(engineRecord.size_l)}L` : "",
      engineRecord.cylinders ? `${asString(engineRecord.cylinders)}-cyl` : "",
      engineRecord.layout ? `${asString(engineRecord.layout)}` : "",
      engineRecord.hp ? `${asString(engineRecord.hp)}HP` : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (built) {
      return built;
    }
  }

  const engineString = asString(engineValue);
  if (engineString) {
    return engineString;
  }

  const fromSpecs = [
    asString(specs?.engine_size),
    asString(specs?.engine_type),
    asString(specs?.fuel_type ?? specs?.fuel),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fromSpecs) {
    return fromSpecs;
  }

  const details = asRecord(vehicle.details);
  const auctionInfo = asRecord(details?.auction_information);
  const fromDetails = asString(
    auctionInfo?.EngineSize ??
      auctionInfo?.EngineInformation ??
      auctionInfo?.Engine ??
      vehicle.engine_size ??
      vehicle.engine,
  );

  return fromDetails;
}

function buildSpecs(vehicle: ApibaraVehicle): LotDetails["specs"] {
  const specs = asRecord(vehicle.vehicle_specs);
  const odometer = asRecord(vehicle.odometer);
  const location = asRecord(vehicle.location);

  const mileageValue = asString(
    odometer?.mi ?? odometer?.miles ?? odometer?.value,
  );
  const mileageUnit = asString(odometer?.unit, "mi");
  const mileage = mileageValue ? `${mileageValue} ${mileageUnit}`.trim() : "—";

  const engine = formatEngine(vehicle, specs);

  return [
    { label: "Пробіг", value: mileage, icon: "speed" },
    { label: "Двигун", value: engine || "—", icon: "engine" },
    {
      label: "Привід",
      value: asString(specs?.drive_type ?? specs?.drive, "—"),
      icon: "drivetrain",
    },
    {
      label: "Локація",
      value: asString(location?.display ?? location?.state, "—"),
      icon: "location",
    },
  ];
}

function buildDamageItems(vehicle: ApibaraVehicle): LotDetails["damageItems"] {
  const condition = asRecord(vehicle.condition);
  const primary = asString(
    condition?.primary_damage ?? condition?.damage ?? vehicle.primary_damage,
  );
  const secondary = asString(
    condition?.secondary_damage ?? vehicle.secondary_damage,
  );
  const loss = asString(condition?.loss_type ?? vehicle.loss_type);

  const items: LotDetails["damageItems"] = [];

  if (primary) {
    items.push({ part: primary, action: "replacement" });
  }

  if (secondary) {
    items.push({ part: secondary, action: "replacement" });
  }

  if (loss) {
    items.push({ part: loss, action: "repair" });
  }

  if (items.length === 0) {
    items.push({ part: "Пошкодження", action: "repair" });
  }

  return items;
}

function buildLogistics(vehicle: ApibaraVehicle): LotDetails["logistics"] {
  const pricing = asRecord(vehicle.pricing);
  const currentBid =
    pricing?.current_bid_usd ?? pricing?.current_bid ?? vehicle.current_bid;
  const buyNow = pricing?.buy_now_usd ?? pricing?.buy_now_price;
  const retail =
    pricing?.estimated_retail_value ?? vehicle.estimated_retail_value;

  const lines: LotDetails["logistics"] = [];

  if (currentBid != null) {
    lines.push({ label: "Поточна ставка", value: formatUsd(currentBid) });
  }

  if (buyNow != null) {
    lines.push({ label: "Buy It Now", value: formatUsd(buyNow) });
  }

  if (retail != null) {
    lines.push({ label: "Оціночна вартість", value: formatUsd(retail) });
  }

  if (lines.length === 0) {
    lines.push({ label: "Поточна ставка", value: "—" });
  }

  return lines;
}

function buildPricingSummary(vehicle: ApibaraVehicle): {
  totalPrice: string;
  marketPrice: string;
  savings: string;
  savingsPercent: string;
} {
  const pricing = asRecord(vehicle.pricing);
  const currentBid = asNumber(
    pricing?.current_bid_usd ?? pricing?.current_bid ?? vehicle.current_bid,
  );
  const retail = asNumber(
    pricing?.estimated_retail_value ?? vehicle.estimated_retail_value,
  );
  const estimatedTotal = currentBid > 0 ? currentBid + 4500 : retail;
  const savings = retail > estimatedTotal ? retail - estimatedTotal : 0;
  const savingsPercent =
    retail > 0 && savings > 0 ? Math.round((savings / retail) * 100) : 0;

  return {
    totalPrice: formatUsd(estimatedTotal),
    marketPrice: retail > 0 ? formatUsd(retail) : "—",
    savings: savings > 0 ? formatUsd(savings) : "—",
    savingsPercent:
      savingsPercent > 0 ? `На ${savingsPercent}% дешевше, ніж в Україні` : "—",
  };
}

export function mapApibaraVehicleToLotDetails(
  vehicle: ApibaraVehicle,
  lotUrl: string,
  auction: SupportedAuction,
  lotId: string,
): LotDetails {
  const { title, year } = buildTitle(vehicle);
  const condition = asRecord(vehicle.condition);
  const auctionInfo = asRecord(vehicle.auction);
  const seller = asRecord(vehicle.seller);
  const saleDocument = asRecord(vehicle.sale_document);
  const primaryDamage = asString(
    condition?.primary_damage ?? condition?.damage ?? vehicle.primary_damage,
  );
  const pricing = buildPricingSummary(vehicle);
  const images = collectImages(vehicle);

  const lotNumberRaw = asString(vehicle.lot_number, lotId);
  const lotNumber = lotNumberRaw.startsWith("#")
    ? lotNumberRaw
    : `#${lotNumberRaw}`;

  const sellerType = asString(
    seller?.type ?? seller?.name,
    "Продавець аукціону",
  );
  const sellerDescription = asString(
    seller?.description,
    asString(seller?.name, "Дані з аукціону Copart/IAAI."),
  );

  const documentType = asString(
    saleDocument?.name ?? saleDocument?.type ?? vehicle.title_code,
    "—",
  );

  const exportEligible =
    saleDocument?.export === true ||
    asString(saleDocument?.export).toLowerCase() === "yes" ||
    asString(saleDocument?.export).toLowerCase() === "true";

  return {
    id: `${auction}-${lotNumberRaw}`,
    lotUrl,
    lotNumber,
    title,
    year,
    images,
    specs: buildSpecs(vehicle),
    nextAuctionDate: formatDate(
      auctionInfo?.auction_at ?? vehicle.auction_date,
    ),
    sellerType,
    sellerDescription,
    documentType,
    exportEligible,
    damageSeverity: inferDamageSeverity(primaryDamage),
    damageItems: buildDamageItems(vehicle),
    logistics: buildLogistics(vehicle),
    totalPrice: pricing.totalPrice,
    totalPriceLabel: "Доставка та ремонт",
    repairNote: "* Орієнтовний розрахунок на основі поточної ставки та ремонту",
    marketPrice: pricing.marketPrice,
    savings: pricing.savings,
    savingsPercent: pricing.savingsPercent,
    reviewedLots: [],
  };
}
