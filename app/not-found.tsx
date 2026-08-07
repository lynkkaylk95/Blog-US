import Link from "next/link";
import { Header } from "./components/Header";

export default function NotFound() {
  return (
    <main>
      <Header />
      <section className="article-hero shell">
        <span className="eyebrow">404 — Story not found</span>
        <h1>This story is no longer on the porch.</h1>
        <p>The link may be out of date, but there are more stories waiting for you.</p>
        <Link href="/" className="primary-button">Browse the latest stories <span>→</span></Link>
      </section>
    </main>
  );
}
