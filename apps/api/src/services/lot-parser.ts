export type SupportedAuction = "copart" | "iaai" | "impactauto";

export function detectAuction(url: string): SupportedAuction | null {
  const normalized = url.toLowerCase();

  if (normalized.includes("copart.com")) {
    return "copart";
  }

  if (normalized.includes("iaai.com")) {
    return "iaai";
  }

  if (normalized.includes("impactauto")) {
    return "impactauto";
  }

  return null;
}

export function extractLotId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const auction = detectAuction(url);

    const copartPathMatch = parsed.pathname.match(/\/lot\/(\d+)/i);
    if (copartPathMatch) {
      return copartPathMatch[1];
    }

    const copartDataMatch = parsed.pathname.match(
      /\/public\/data\/lotdetails\/(?:summary|solr)\/(\d+)/i,
    );
    if (copartDataMatch) {
      return copartDataMatch[1];
    }

    const copartLotId =
      parsed.searchParams.get("lotId") ?? parsed.searchParams.get("lotid");
    if (auction === "copart" && copartLotId && /^\d+$/.test(copartLotId)) {
      return copartLotId;
    }

    const iaaiMatch =
      parsed.pathname.match(/\/VehicleDetails?\/(\d+)/i) ??
      parsed.pathname.match(/\/VehicleDetail\/(\d+)/i);
    if (iaaiMatch) {
      return iaaiMatch[1];
    }

    const iaaiItemId = parsed.searchParams.get("itemID") ?? parsed.searchParams.get("itemId");
    if (iaaiItemId && /^\d+$/.test(iaaiItemId)) {
      return iaaiItemId;
    }

    const impactMatch = parsed.searchParams.get("lot") ?? parsed.pathname.match(/\/(\d{4,})/)?.[1];
    if (impactMatch) {
      return impactMatch;
    }
  } catch {
    return null;
  }

  return null;
}
