import { env } from "cloudflare:workers";

export function runtimeEnv(name: string) {
  const workerValue = (env as unknown as Record<string, unknown>)[name];
  if (typeof workerValue === "string" && workerValue) return workerValue;
  return process.env[name];
}
