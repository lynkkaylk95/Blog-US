export const siteName = "Porchlight Stories";
export const siteDescription = "Original stories about family, second chances, and the moments that stay with us.";
export const defaultGoogleAnalyticsId = "G-2D0SSCEYRN";

const configuredUrl = process.env.SITE_URL?.trim();
export const siteUrl = (configuredUrl || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}
