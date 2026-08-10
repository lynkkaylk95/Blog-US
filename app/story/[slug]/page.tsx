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
import { ViewTracker } from "./ViewTracker";
import { authorInitials, authorSlug } from "../../author-utils";
import { PartNavigator } from "./PartNavigator";
import { collapseSeriesStories, normalizeSeriesTitle } from "../../series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    authors: [{ name: story.author, url: `/author/${authorSlug(story.author)}` }],
    category: story.category,
    openGraph: {
      type: "article",
      url: path,
      siteName,
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt,
      authors: [story.author],
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

  const allStories = await getPublishedStories();
  const seriesKey = story.seriesTitle ? normalizeSeriesTitle(story.seriesTitle) : "";
  const seriesParts = story.seriesTitle ? allStories.filter((item) => item.seriesTitle && normalizeSeriesTitle(item.seriesTitle) === seriesKey && item.partNumber).sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0)).map((item) => ({ slug: item.slug, title: item.title, partNumber: item.partNumber as number })) : [];
  const isCurrentSeries = (item: typeof story) => Boolean(seriesKey && item.seriesTitle && normalizeSeriesTitle(item.seriesTitle) === seriesKey);
  const sameCategoryStories = collapseSeriesStories(allStories.filter((item) => item.slug !== story.slug && !isCurrentSeries(item) && item.category === story.category)).slice(0, 3);
  const sameCategorySlugs = new Set(sameCategoryStories.map((item) => item.slug));
  const sameAuthorStories = collapseSeriesStories(allStories.filter((item) => item.slug !== story.slug && !isCurrentSeries(item) && item.author.toLowerCase() === story.author.toLowerCase() && !sameCategorySlugs.has(item.slug))).slice(0, 3);
  const usedSlugs = new Set([story.slug, ...sameCategoryStories.map((item) => item.slug), ...sameAuthorStories.map((item) => item.slug)]);
  const relatedStories = collapseSeriesStories(allStories.filter((item) => !usedSlugs.has(item.slug) && !isCurrentSeries(item))).slice(0, 3);
  const inlineStories = (sameCategoryStories.length ? sameCategoryStories : sameAuthorStories.length ? sameAuthorStories : relatedStories).slice(0, 2);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: [story.image],
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    mainEntityOfPage: absoluteUrl(`/story/${story.slug}`),
    author: { "@type": "Person", name: story.author, url: absoluteUrl(`/author/${authorSlug(story.author)}`) },
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/og.png") } },
    articleSection: story.category,
    isAccessibleForFree: true,
  };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <Header />
    <article className="article-hero shell">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href={`/category/${categorySlugs[story.category]}`}>{story.category}</Link></div>
      <span className={`eyebrow${story.seriesTitle ? " series-heading" : ""}`}>{story.seriesTitle ? `${story.seriesTitle} · Part ${story.partNumber} of ${seriesParts.length}` : story.category}</span>
      <h1>{story.title}</h1>
      <div className="article-byline"><div className="author-avatar">{authorInitials(story.author)}</div><div><b>By <Link href={`/author/${authorSlug(story.author)}`}>{story.author}</Link></b><span>{story.date} · {story.readTime} · <ViewTracker slug={story.slug} initialViews={story.views} /></span>{story.updatedDate !== story.date && <span>Updated {story.updatedDate}</span>}</div><ShareButtons title={story.title} /></div>
    </article>
    <div className="article-image"><Image src={story.image} alt={story.title} fill priority unoptimized={story.image.includes("/media/")} sizes="(max-width: 620px) 100vw, 1100px" /></div>
    <div className="shell"><AdSlot /></div>
    {story.contentHtml ? <RichStory html={story.contentHtml} recommendations={inlineStories} category={story.category} showEnd={!story.seriesTitle || seriesParts.at(-1)?.slug === story.slug} /> : <Reader chapters={story.chapters} recommendations={inlineStories} category={story.category} showEnd={!story.seriesTitle || seriesParts.at(-1)?.slug === story.slug} />}
    {story.seriesTitle && seriesParts.length > 0 && <PartNavigator seriesTitle={story.seriesTitle} parts={seriesParts} currentSlug={story.slug} />}
    {sameCategoryStories.length > 0 && <section className="more-stories same-category-stories shell"><div className="section-heading"><div><span className="eyebrow">More in this category</span><h2>More {story.category} stories</h2></div><Link href={`/category/${categorySlugs[story.category]}`}>View category →</Link></div><div className="popular-grid">{sameCategoryStories.map((item) => <StoryCard key={item.slug} story={item} />)}</div></section>}
    {sameAuthorStories.length > 0 && <section className="more-stories author-stories shell"><div className="section-heading"><div><span className="eyebrow">More from this author</span><h2>More stories by {story.author}</h2></div><Link href={`/author/${authorSlug(story.author)}`}>View all →</Link></div><div className="popular-grid">{sameAuthorStories.map((item) => <StoryCard key={item.slug} story={item} />)}</div></section>}
    {relatedStories.length > 0 && <section className="more-stories shell"><div className="section-heading"><div><span className="eyebrow">Keep reading</span><h2>More stories for you</h2></div></div><div className="popular-grid">{relatedStories.map((story) => <StoryCard key={story.slug} story={story} />)}</div></section>}
    <footer className="article-footer"><Link href="/">← Back to Porchlight Stories</Link><span>© 2026 Porchlight Stories</span></footer>
  </main>;
}
