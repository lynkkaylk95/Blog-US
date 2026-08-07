import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { CookieSettingsButton } from "../components/CookieConsent";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Porchlight Stories uses cookies and similar technologies.", alternates: { canonical: "/cookies" } };

export default function CookiesPage() {
  return <InfoPage eyebrow="Last updated August 7, 2026" title="Cookie policy" intro="Porchlight Stories currently aims to keep browser storage limited and understandable.">
    <h2>Essential technology</h2><p>Hosting and security services may use essential cookies or similar signals to deliver pages, balance traffic, and prevent abuse. These are required for the site to function safely.</p>
    <h2>Preferences</h2><p>Reading preferences and reactions may be stored locally in your browser as features develop. Local information remains on your device unless the site clearly tells you otherwise.</p>
    <h2>Analytics and advertising</h2><p>Cloudflare Web Analytics may measure aggregate traffic and page performance without collecting or using personal data. Optional Google Analytics loads only after you choose “Allow analytics.” We do not currently enable advertising cookies.</p>
    <h2>Your controls</h2><p>You can decline optional analytics or change your choice at any time. You can also remove or block browser storage through your browser settings.</p>{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && <CookieSettingsButton />}
  </InfoPage>;
}
