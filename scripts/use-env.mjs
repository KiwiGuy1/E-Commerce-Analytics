import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2];
const allowedModes = new Set(["development", "production"]);

if (!allowedModes.has(mode)) {
  console.error("Usage: npm run env:dev or npm run env:prod");
  process.exit(1);
}

const source = join(root, `.env.${mode}`);
const destination = join(root, ".env");

try {
  await access(source, constants.R_OK);
} catch {
  console.error(`Missing .env.${mode}`);
  process.exit(1);
}

await copyFile(source, destination);
console.log(`Using .env.${mode} -> .env`);
