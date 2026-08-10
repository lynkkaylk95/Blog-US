import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../components/Header";
import { SiteFooter } from "../../components/SiteFooter";
import { StoryCard } from "../../components/StoryCard";
import { getPublishedStories } from "../../posts-data";
import { categorySlugs } from "../../content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categories = Object.fromEntries(Object.entries(categorySlugs).map(([name, slug]) => [slug, name]));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];
  return category ? { title: `${category} Stories`, description: `Original ${category.toLowerCase()} stories from Porchlight Stories.`, alternates: { canonical: `/category/${slug}` } } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories[slug];
  if (!category) notFound();
  const stories = await getPublishedStories();
  const categoryStories = stories.filter((story) => story.category === category);

  return <main><Header /><section className="category-page shell"><span className="eyebrow">Browse by theme</span><h1>{category}</h1><p>Thoughtful stories about the moments that shape a life.</p><div className="latest-grid">{categoryStories.map((story) => <StoryCard key={story.slug} story={story} />)}</div></section><SiteFooter /></main>;
}
