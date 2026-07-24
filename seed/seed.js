const { spawnSync } = require("node:child_process");
const path = require("node:path");

// The PostgreSQL/Prisma seed lives beside the Prisma schema.
const apiDirectory = path.resolve(__dirname, "../api");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["run", "prisma:seed"], {
  cwd: apiDirectory,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
