import type { Metadata } from "next";
import "./globals.css";
import "./content.css";
import { siteDescription, siteName, siteUrl } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Porchlight Stories — Stories Worth Slowing Down For", template: "%s | Porchlight Stories" },
  description: siteDescription,
  applicationName: siteName,
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
  return <html lang="en"><body>{children}</body></html>;
}
