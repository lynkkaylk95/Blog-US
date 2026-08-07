import type { ReactNode } from "react";
import { Header } from "./Header";
import { SiteFooter } from "./SiteFooter";

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <main>
      <Header />
      <article className="info-page shell">
        <header><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>
        <div className="info-body">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
