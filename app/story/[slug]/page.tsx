import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { AdSlot } from "../../components/AdSlot";
import { StoryCard } from "../../components/StoryCard";
import { categorySlugs, stories as markdownStories } from "../../content";
import { getPublishedStories, getPublishedStory } from "../../posts-data";
import { Reader } from "./Reader";
import { ShareButtons } from "../../components/ShareButtons";
import { absoluteUrl, siteName } from "../../site";
import { RichStory } from "./RichStory";

type StoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return markdownStories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedStory(slug);
  if (!story) return {};
  const path = `/story/${story.slug}`;

  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: path },
    authors: [{ name: "Porchlight Editors" }],
    category: story.category,
    openGraph: {
      type: "article",
      url: path,
      siteName,
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt,
      authors: ["Porchlight Editors"],
      images: [{ url: story.image, alt: story.title }],
    },
    twitter: { card: "summary_large_image", title: story.title, description: story.excerpt, images: [story.image] },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getPublishedStory(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = (await getPublishedStories()).filter((item) => item.slug !== story.slug).slice(0, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: [story.image],
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    mainEntityOfPage: absoluteUrl(`/story/${story.slug}`),
    author: { "@type": "Organization", name: "Porchlight Editors", url: absoluteUrl("/editorial-standards") },
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/og.png") } },
    articleSection: story.category,
    isAccessibleForFree: true,
  };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <Header />
    <article className="article-hero shell">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href={`/category/${categorySlugs[story.category]}`}>{story.category}</Link></div>
      <span className="eyebrow">{story.category}</span>
      <h1>{story.title}</h1>
      <p className="article-deck">{story.excerpt}</p>
      <div className="article-byline"><div className="author-avatar">PS</div><div><b>By Porchlight Editors</b><span>{story.date} · {story.readTime}</span>{story.updatedDate !== story.date && <span>Updated {story.updatedDate}</span>}</div><ShareButtons title={story.title} /></div>
    </article>
    <div className="article-image"><Image src={story.image} alt={story.imageAlt} fill priority sizes="(max-width: 620px) 100vw, 1100px" /></div>
    <div className="shell"><AdSlot /></div>
    {story.contentHtml ? <RichStory html={story.contentHtml} /> : <Reader chapters={story.chapters} />}
    <section className="more-stories shell"><div className="section-heading"><div><span className="eyebrow">Keep reading</span><h2>More stories for you</h2></div></div><div className="popular-grid">{relatedStories.map((story) => <StoryCard key={story.slug} story={story} />)}</div></section>
    <footer className="article-footer"><Link href="/">← Back to Porchlight Stories</Link><span>© 2026 Porchlight Stories</span></footer>
  </main>;
}
