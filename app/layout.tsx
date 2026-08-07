import type { Metadata } from "next";
import "./globals.css";
import "./content.css";
import { siteDescription, siteName, siteUrl } from "./site";
import { CloudflareAnalytics, GoogleAnalytics } from "./components/Analytics";
import { CookieConsent } from "./components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Porchlight Stories — Stories Worth Slowing Down For", template: "%s | Porchlight Stories" },
  description: siteDescription,
  applicationName: siteName,
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  alternates: { canonical: "/", types: { "application/rss+xml": [{ url: "/feed.xml", title: "Porchlight Stories RSS" }] } },
  openGraph: {
    title: siteName,
    description: "Stories worth slowing down for.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Porchlight Stories" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Stories worth slowing down for.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const configuredGoogleId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const configuredCloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  const googleAnalyticsId = configuredGoogleId && /^G-[A-Z0-9]+$/i.test(configuredGoogleId) ? configuredGoogleId : undefined;
  const cloudflareToken = configuredCloudflareToken && /^[a-f0-9]{32}$/i.test(configuredCloudflareToken) ? configuredCloudflareToken : undefined;
  return <html lang="en"><body>{children}<GoogleAnalytics measurementId={googleAnalyticsId} /><CloudflareAnalytics token={cloudflareToken} /><CookieConsent enabled={Boolean(googleAnalyticsId)} /></body></html>;
}
