export const siteName = "Porchlight Stories";
export const siteDescription = "Original stories about family, second chances, and the moments that stay with us.";

const configuredUrl = process.env.SITE_URL?.trim();
export const siteUrl = (configuredUrl || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}
