import Link from "next/link";
import { Header } from "./components/Header";
import { StoryCard } from "./components/StoryCard";
import { AdSlot } from "./components/AdSlot";
import { stories } from "./data";

export default function Home() {
  const featured = stories[0];
  return (
    <main>
      <Header />
      <section className="hero shell">
        <div className="hero-image"><img src={featured.image} alt="An older woman reflecting at home" /><span className="photo-label">TODAY'S FEATURED STORY</span></div>
        <div className="hero-copy">
          <span className="eyebrow">{featured.category}</span>
          <h1>{featured.title}</h1>
          <p>{featured.excerpt}</p>
          <div className="story-meta"><span>{featured.readTime}</span><span>•</span><span>{featured.date}</span></div>
          <Link href={`/story/${featured.slug}`} className="primary-button">Read the story <span>→</span></Link>
        </div>
      </section>

      <section id="popular" className="popular-band">
        <div className="shell">
          <div className="section-heading light"><div><span className="eyebrow">Reader favorites</span><h2>Most read today</h2></div><Link href="#latest">See all stories →</Link></div>
          <div className="popular-grid">{stories.slice(1,4).map((story, i) => <StoryCard key={story.slug} story={story} rank={i + 1} />)}</div>
        </div>
      </section>

      <div className="shell"><AdSlot /></div>

      <section id="latest" className="latest shell">
        <div className="section-heading"><div><span className="eyebrow">Fresh from the porch</span><h2>Latest stories</h2></div><p>A new story, every day at 7 PM</p></div>
        <div className="latest-layout">
          <div className="latest-grid">{stories.slice(1).map(story => <StoryCard key={story.slug} story={story} />)}</div>
          <aside className="newsletter">
            <span className="newsletter-icon">✉</span>
            <span className="eyebrow">A story for your evening</span>
            <h2>Come sit with us.</h2>
            <p>Receive our most-loved story and a little goodness in your inbox each Sunday.</p>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" />
            <button>Join the porch</button>
            <small>No noise. Just one good story a week.</small>
          </aside>
        </div>
      </section>

      <section className="quote-band"><blockquote>“There is no greater agony than bearing an untold story inside you.”<cite>— Maya Angelou</cite></blockquote></section>
      <Footer />
    </main>
  );
}

function Footer() {
  return <footer><div className="shell footer-grid"><div><div className="brand brand--footer"><span className="brand-mark">P</span><span><strong>Porchlight</strong><small>STORIES</small></span></div><p>Original stories about family, second chances, and the moments that stay with us.</p></div><div><b>Explore</b><Link href="/#latest">Latest Stories</Link><Link href="/#popular">Most Read</Link><Link href="/#family">Family & Legacy</Link></div><div><b>About</b><Link href="#">Our Story</Link><Link href="#">Editorial Standards</Link><Link href="#">Contact</Link></div><div><b>Legal</b><Link href="#">Privacy Policy</Link><Link href="#">Terms of Use</Link><Link href="#">Cookie Settings</Link></div></div><div className="shell copyright">© 2026 Porchlight Stories. Stories are works of fiction unless otherwise noted.<span>Made for readers who still believe in a good story.</span></div></footer>;
}
