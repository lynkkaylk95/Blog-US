import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "Contact", description: "Contact the Porchlight Stories editorial team.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <InfoPage eyebrow="Get in touch" title="We’d like to hear from you." intro="Questions, corrections, rights inquiries, and thoughtful reader notes are welcome.">
    <h2>Contact details</h2><p>Our public editorial email will appear here once the publication’s domain mailbox is active. Until then, please do not send personal or sensitive information through third-party channels claiming to represent Porchlight Stories.</p>
    <h2>Corrections</h2><p>When reporting an error, include the story title, URL, and a short explanation. We review correction requests under our Editorial Standards.</p>
    <h2>Response times</h2><p>As a small publication, we may not answer every submission. Rights, privacy, and correction requests receive priority.</p>
  </InfoPage>;
}
