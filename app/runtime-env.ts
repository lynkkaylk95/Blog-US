import { env } from "cloudflare:workers";

export function runtimeEnv(name: string) {
  const injected = (globalThis as typeof globalThis & { __PORCHLIGHT_RUNTIME_ENV__?: Record<string, unknown> }).__PORCHLIGHT_RUNTIME_ENV__;
  const injectedValue = injected?.[name];
  if (typeof injectedValue === "string" && injectedValue) return injectedValue;
  const workerValue = (env as unknown as Record<string, unknown>)[name];
  if (typeof workerValue === "string" && workerValue) return workerValue;
  return process.env[name];
}
