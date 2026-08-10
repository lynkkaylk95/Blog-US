import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { SiteFooter } from "../../components/SiteFooter";
import { StoryCard } from "../../components/StoryCard";
import { getPublishedStories } from "../../posts-data";
import { authorSlug } from "../../author-utils";
import { collapseSeriesStories } from "../../series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AuthorPageProps = { params: Promise<{ slug: string }> };

async function getAuthor(slug: string) {
  const stories = await getPublishedStories();
  const author = stories.find((story) => authorSlug(story.author) === slug)?.author;
  return author ? { author, stories: stories.filter((story) => story.author.toLowerCase() === author.toLowerCase()) } : null;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const result = await getAuthor((await params).slug);
  return result ? { title: `${result.author} — Author`, description: `Read stories by ${result.author}.`, alternates: { canonical: `/author/${authorSlug(result.author)}` } } : {};
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const result = await getAuthor((await params).slug);
  if (!result) notFound();
  const listingStories = collapseSeriesStories(result.stories);
  return <main><Header /><section className="category-page shell"><span className="eyebrow">Author</span><h1>{result.author}</h1><p>{listingStories.length} {listingStories.length === 1 ? "story" : "stories"} published</p><div className="latest-grid">{listingStories.map((story) => <StoryCard key={story.slug} story={story} />)}</div></section><SiteFooter /></main>;
}
