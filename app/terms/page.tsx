import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms governing use of Porchlight Stories.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <InfoPage eyebrow="Last updated August 7, 2026" title="Terms of use" intro="By using Porchlight Stories, you agree to these terms.">
    <h2>Our content</h2><p>Unless otherwise stated, stories and site materials are owned by Porchlight Stories or used with permission. Personal reading and sharing of links are welcome; republication, scraping, or commercial reuse requires written permission.</p>
    <h2>Fictional material</h2><p>Stories are works of fiction unless clearly labeled otherwise. Similarities to real people, places, or events may be coincidental.</p>
    <h2>Acceptable use</h2><p>You may not interfere with the site, attempt unauthorized access, submit malicious material, or use the service in violation of applicable law.</p>
    <h2>No professional advice</h2><p>Stories are provided for reading and entertainment. They are not legal, medical, financial, or other professional advice.</p>
    <h2>Availability</h2><p>We may update, remove, or suspend content and features. These terms may change as the publication develops.</p>
  </InfoPage>;
}
