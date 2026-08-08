import { env } from "cloudflare:workers";

export function runtimeEnv(name: string) {
  const processValue = process.env[name];
  if (typeof processValue === "string" && processValue) return processValue;
  const workerValue = (env as unknown as Record<string, unknown>)[name];
  if (typeof workerValue === "string" && workerValue) return workerValue;
  return undefined;
}
