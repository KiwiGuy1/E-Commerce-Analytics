import { constants } from "node:fs";
import { copyFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const environmentFiles = [
  [".env.example", ".env"],
  ["api/.env.example", "api/.env"],
  ["simulator/.env.example", "simulator/.env"],
  ["web/.env.example", "web/.env.local"],
];

let created = 0;

for (const [example, destination] of environmentFiles) {
  const sourcePath = join(root, example);
  const destinationPath = join(root, destination);

  try {
    await access(destinationPath, constants.F_OK);
    console.log(`kept    ${destination}`);
  } catch {
    await copyFile(sourcePath, destinationPath, constants.COPYFILE_EXCL);
    console.log(`created ${destination}`);
    created += 1;
  }
}

console.log(
  created === 0
    ? "Environment files are already set up."
    : `Created ${created} environment file${created === 1 ? "" : "s"}. Review the values before starting the project.`,
);
