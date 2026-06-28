import Constants from "expo-constants";
import { Platform } from "react-native";
import type { AnalyzeLotResponse, LotDetails } from "@ukrnex/shared";

function resolveApiUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiUrl as string | undefined;

  if (Platform.OS === "android") {
    return configured?.replace("localhost", "10.0.2.2") ?? "http://10.0.2.2:3001";
  }

  return configured ?? "http://localhost:3001";
}

export const API_URL = resolveApiUrl();

async function parseJsonResponse<T>(response: Response): Promise<T> {
  let payload: { error?: string } & T;

  try {
    payload = await response.json();
  } catch {
    throw new Error("Сервер повернув некоректну відповідь");
  }

  if (!response.ok) {
    throw new Error(payload.error ?? "Помилка запиту до сервера");
  }

  return payload;
}

export async function analyzeLot(url: string): Promise<AnalyzeLotResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error("Сервер недоступний. Запустіть API: npm run api");
  }

  return parseJsonResponse<AnalyzeLotResponse>(response);
}

export async function getLotDetails(url: string): Promise<LotDetails> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1/lots?url=${encodeURIComponent(url)}`);
  } catch {
    throw new Error("Сервер недоступний. Запустіть API: npm run api");
  }

  const payload = await parseJsonResponse<{ lot: LotDetails }>(response);
  return payload.lot;
}
