import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { AdSlot } from "../../components/AdSlot";
import { StoryCard } from "../../components/StoryCard";
import { chaptersBySlug, stories } from "../../data";
import { Reader } from "./Reader";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find(item => item.slug === slug);

  if (!story) {
    notFound();
  }

  const chapters = chaptersBySlug[story.slug];
  const relatedStories = stories.filter((item) => item.slug !== story.slug).slice(0, 3);
  return <main>
    <Header />
    <article className="article-hero shell">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/#family">{story.category}</Link></div>
      <span className="eyebrow">{story.category}</span>
      <h1>{story.title}</h1>
      <p className="article-deck">{story.excerpt}</p>
      <div className="article-byline"><div className="author-avatar">PS</div><div><b>By Porchlight Editors</b><span>{story.date} · {story.readTime}</span></div><div className="share-row"><button>f Share</button><button>✉ Email</button></div></div>
    </article>
    <div className="article-image"><img src={story.image} alt="A reflective moment at home" /></div>
    <div className="shell"><AdSlot /></div>
    <Reader chapters={chapters} />
    <section className="more-stories shell"><div className="section-heading"><div><span className="eyebrow">Keep reading</span><h2>More stories for you</h2></div></div><div className="popular-grid">{relatedStories.map((story) => <StoryCard key={story.slug} story={story} />)}</div></section>
    <footer className="article-footer"><Link href="/">← Back to Porchlight Stories</Link><span>© 2026 Porchlight Stories</span></footer>
  </main>;
}
