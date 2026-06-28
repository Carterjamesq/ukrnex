import type { LotDetails } from "@ukrnex/shared";
import {
  fetchVehicleByLotNumber,
  fetchVehicleByUrl,
  searchVehicleByLotNumber,
  type ApibaraVehicle,
} from "./apibara-client.js";
import { mapApibaraVehicleToLotDetails } from "./lot-mapper.js";
import { detectAuction, extractLotId, type SupportedAuction } from "./lot-parser.js";

function matchesAuction(vehicle: ApibaraVehicle, auction: SupportedAuction): boolean {
  const platform = typeof vehicle.platform === "string" ? vehicle.platform.toLowerCase() : "";

  if (!platform) {
    return true;
  }

  return platform === auction;
}

async function tryFetchVehicle(
  fetcher: () => Promise<ApibaraVehicle>,
  auction: SupportedAuction,
): Promise<ApibaraVehicle | null> {
  try {
    const vehicle = await fetcher();
    return matchesAuction(vehicle, auction) ? vehicle : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("ліміт запитів")) {
      throw error;
    }

    return null;
  }
}

export async function fetchLotDetails(url: string): Promise<LotDetails> {
  const auction = detectAuction(url);
  const lotId = extractLotId(url);

  if (!auction || !lotId) {
    throw new Error("Не вдалося розпізнати лот за посиланням");
  }

  if (auction === "impactauto") {
    throw new Error("Impact Auto ще не підтримується для реальних даних. Використайте Copart або IAAI.");
  }

  const vehicle =
    (await tryFetchVehicle(() => fetchVehicleByLotNumber(lotId), auction)) ??
    (await tryFetchVehicle(() => searchVehicleByLotNumber(lotId, auction), auction)) ??
    (await tryFetchVehicle(() => fetchVehicleByUrl(url), auction));

  if (!vehicle) {
    throw new Error(
      `Не вдалося знайти лот #${lotId}. Перевірте, що лот активний на ${auction === "copart" ? "Copart" : "IAAI"}.`,
    );
  }

  return mapApibaraVehicleToLotDetails(vehicle, url, auction as SupportedAuction, lotId);
}
