import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Porchlight Stories — Stories Worth Slowing Down For",
  description: "Original stories about family, second chances, and the moments that stay with us.",
  openGraph: {
    title: "Porchlight Stories",
    description: "Stories worth slowing down for.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Porchlight Stories" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Porchlight Stories",
    description: "Stories worth slowing down for.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
