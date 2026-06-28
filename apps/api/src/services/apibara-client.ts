const DEFAULT_BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

type ApibaraVehicle = Record<string, unknown>;

function readApiKey(): string {
  const apiKey = process.env.APIBARA_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Не налаштовано APIBARA_API_KEY. Додайте ключ у apps/api/.env (безкоштовний план: apibara.tech).",
    );
  }

  return apiKey;
}

function baseUrl(): string {
  return process.env.APIBARA_API_URL?.trim() || DEFAULT_BASE_URL;
}

async function apibaraGet(
  path: string,
  query: Record<string, string> = {},
): Promise<unknown> {
  const url = new URL(`${baseUrl()}${path}`);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-API-Key": readApiKey(),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Apibara API error (${response.status})`;

    if (response.status === 429) {
      throw new Error("Перевищено ліміт запитів. Спробуйте пізніше.");
    }

    throw new Error(message);
  }

  return payload;
}

function unwrapVehicle(payload: unknown): ApibaraVehicle | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  if (
    record.data &&
    typeof record.data === "object" &&
    !Array.isArray(record.data)
  ) {
    return record.data as ApibaraVehicle;
  }

  if (
    Array.isArray(record.data) &&
    record.data[0] &&
    typeof record.data[0] === "object"
  ) {
    return record.data[0] as ApibaraVehicle;
  }

  if ("lot_number" in record || "platform" in record || "vin" in record) {
    return record;
  }

  return null;
}

export async function fetchVehicleByUrl(url: string): Promise<ApibaraVehicle> {
  const payload = await apibaraGet("/vehicles/urltodetails", { url });
  const vehicle = unwrapVehicle(payload);

  if (!vehicle) {
    throw new Error("Не вдалося знайти лот за цим посиланням");
  }

  return vehicle;
}

export async function fetchVehicleByLotNumber(
  lotNumber: string,
): Promise<ApibaraVehicle> {
  const payload = await apibaraGet(
    `/vehicles/${encodeURIComponent(lotNumber)}`,
  );
  const vehicle = unwrapVehicle(payload);

  if (!vehicle) {
    throw new Error(`Не вдалося знайти лот #${lotNumber}`);
  }

  return vehicle;
}

const AUCTION_TYPE_BY_PLATFORM: Record<string, string> = {
  copart: "1",
  iaai: "2",
};

export async function searchVehicleByLotNumber(
  lotNumber: string,
  platform?: string,
): Promise<ApibaraVehicle> {
  const query: Record<string, string> = { s: lotNumber, per_page: "1" };

  if (platform && AUCTION_TYPE_BY_PLATFORM[platform]) {
    query.auction_type = AUCTION_TYPE_BY_PLATFORM[platform];
  }

  const payload = await apibaraGet("/vehicles", query);
  const vehicle = unwrapVehicle(payload);

  if (!vehicle) {
    throw new Error(`Не вдалося знайти лот #${lotNumber}`);
  }

  return vehicle;
}

export type { ApibaraVehicle };
