import { disconnectPrisma } from "./prisma";
import { runSimulationTick } from "./simulator";

const configuredInterval = Number(process.env.SIMULATOR_INTERVAL_MS ?? 30000);
const intervalMs =
  Number.isFinite(configuredInterval) && configuredInterval > 0
    ? configuredInterval
    : 30000;

let running = false;

async function tick() {
  if (running) return;
  running = true;
  try {
    await runSimulationTick();
  } catch (error) {
    console.error("[simulator] tick failed", error);
  } finally {
    running = false;
  }
}

async function shutdown(signal: string) {
  console.log(`[simulator] received ${signal}, shutting down`);
  clearInterval(timer);
  await disconnectPrisma();
  process.exit(0);
}

console.log(`[simulator] running every ${intervalMs}ms`);
void tick();
const timer = setInterval(() => void tick(), intervalMs);

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
