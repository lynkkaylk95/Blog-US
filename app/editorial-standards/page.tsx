import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "Editorial Standards", description: "The writing, review, correction, and disclosure standards used by Porchlight Stories.", alternates: { canonical: "/editorial-standards" } };

export default function EditorialStandardsPage() {
  return <InfoPage eyebrow="How we work" title="Editorial standards" intro="Trust begins with telling readers what they are reading and how it was made.">
    <h2>Fiction and transparency</h2><p>Stories are fictional unless an article is explicitly identified as reported nonfiction. We do not present invented characters or events as verified news.</p>
    <h2>Review and originality</h2><p>Every published story is reviewed for clarity, consistency, harmful stereotypes, accidental similarity, and appropriate attribution. Quotes and factual references are checked before publication.</p>
    <h2>AI-assisted work</h2><p>Technology may assist brainstorming, editing, or production. Human editors remain responsible for the final story, originality review, and publication decision.</p>
    <h2>Corrections</h2><p>Material errors are corrected promptly. When a correction changes the meaning of a published piece, we add a visible editor’s note explaining the update.</p>
  </InfoPage>;
}
