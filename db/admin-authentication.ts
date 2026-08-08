import { passwordsMatch } from "../app/admin-auth";
import { runtimeEnv } from "../app/runtime-env";
import { setStoredAdminPassword, verifyAdminUser, verifyStoredAdminPassword } from "./admin-credentials";

export const primaryAdminUsername = "Admin";

export async function authenticateAdmin(identifier: string, password: string) {
  const normalized = identifier.trim();

  if (normalized.toLowerCase() === primaryAdminUsername.toLowerCase()) {
    const storedMatch = await verifyStoredAdminPassword(password);
    if (storedMatch !== null) return storedMatch;

    const bootstrapPassword = runtimeEnv("ADMIN_PASSWORD");
    if (!bootstrapPassword || !passwordsMatch(password, bootstrapPassword)) return false;
    await setStoredAdminPassword(password);
    return true;
  }

  if (!/^\S+@\S+\.\S+$/.test(normalized)) return false;
  return verifyAdminUser(normalized.toLowerCase(), password);
}
