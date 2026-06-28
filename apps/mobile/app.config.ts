import type { ExpoConfig } from "expo/config";
import appJson from "./app.json";

const expo = appJson.expo as ExpoConfig;

const config: ExpoConfig = {
  ...expo,
  extra: {
    ...expo.extra,
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL ??
      (expo.extra as { apiUrl?: string } | undefined)?.apiUrl ??
      "http://localhost:3001",
  },
};

export default config;
