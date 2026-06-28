import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobileDir = resolve(root, "apps/mobile");

process.env.CI = process.env.CI ?? "true";
process.env.EXPO_NO_TELEMETRY = process.env.EXPO_NO_TELEMETRY ?? "1";
process.env.EXPO_PUBLIC_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  "http://localhost:3001";

console.log(`Building Ukrnex web app`);
console.log(`EXPO_PUBLIC_API_URL=${process.env.EXPO_PUBLIC_API_URL}`);

execSync("npx expo export -p web", {
  stdio: "inherit",
  cwd: mobileDir,
  env: process.env,
});
