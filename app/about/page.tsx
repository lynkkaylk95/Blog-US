import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "About Porchlight Stories", description: "Why Porchlight Stories publishes thoughtful fiction about family, hope, and second chances.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <InfoPage eyebrow="Our story" title="Stories worth slowing down for." intro="Porchlight Stories is an independent home for original, emotionally grounded fiction made for readers who still enjoy sitting with a good story.">
    <h2>Why we publish</h2><p>We believe ordinary lives contain extraordinary turning points. Our stories explore family, aging, forgiveness, resilience, and the choices that bring people back to one another.</p>
    <h2>What you can expect</h2><p>Our stories are works of fiction unless clearly labeled otherwise. We aim for warm, accessible writing without disguising fiction as reported news or exploiting real people’s experiences.</p>
    <h2>Who makes Porchlight</h2><p>Porchlight Stories is currently an early-stage publication edited under the Porchlight Editors byline. Individual contributor biographies will be added as the publication grows.</p>
  </InfoPage>;
}
