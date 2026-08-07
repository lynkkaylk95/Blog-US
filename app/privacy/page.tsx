import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Porchlight Stories handles reader information.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <InfoPage eyebrow="Last updated August 7, 2026" title="Privacy policy" intro="This policy explains what information Porchlight Stories may collect and how it is used.">
    <h2>Information you provide</h2><p>If you subscribe, contact us, or respond to a story, we may receive information you choose to provide, such as your email address and message.</p>
    <h2>Information collected automatically</h2><p>Our hosting and security providers may process basic technical information such as IP address, browser type, requested pages, and security events to deliver and protect the site. Cloudflare Web Analytics measures aggregate traffic and performance. Optional Google Analytics is activated only after consent.</p>
    <h2>How information is used</h2><p>We use information to operate the site, deliver requested newsletters, answer messages, prevent abuse, and understand aggregate site performance. We do not sell personal information.</p>
    <h2>Retention and choices</h2><p>Newsletter messages will include an unsubscribe option. Retention depends on the purpose for which information was collected and applicable legal obligations.</p>
    <h2>Service providers and changes</h2><p>We may use hosting, email, analytics, and security providers that process information on our behalf. This policy will be updated when those services are activated or materially changed.</p>
  </InfoPage>;
}
