import type { Metadata } from "next";
import { Header } from "../components/Header";
import { SiteFooter } from "../components/SiteFooter";
import { StoryCard } from "../components/StoryCard";
import { getPublishedStories } from "../posts-data";
import { collapseSeriesStories } from "../series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Search Stories",
  description: "Search original stories from Porchlight Stories.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 120);
  const terms = query.toLocaleLowerCase("en-US").split(/\s+/).filter(Boolean);
  const stories = await getPublishedStories();
  const results = terms.length ? collapseSeriesStories(stories.filter((story) => {
    const searchable = [story.title, story.excerpt, story.author, ...story.categories, story.seriesTitle || ""].join(" ").toLocaleLowerCase("en-US");
    return terms.every((term) => searchable.includes(term));
  })) : [];

  return (
    <main>
      <Header />
      <section className="search-page shell">
        <span className="eyebrow">Find your next story</span>
        <h1>Search Porchlight Stories</h1>
        <form className="search-form" action="/search" method="get" role="search">
          <label htmlFor="story-search">Search by title, theme, or author</label>
          <div><input id="story-search" name="q" type="search" defaultValue={query} placeholder="Try “second chances” or “family”" maxLength={120} autoFocus /><button type="submit">Search</button></div>
        </form>
        {query && <div className="search-summary"><b>{results.length}</b> {results.length === 1 ? "story" : "stories"} found for “{query}”</div>}
        {query && results.length > 0 && <div className="latest-grid search-results">{results.map((story) => <StoryCard key={story.slug} story={story} />)}</div>}
        {query && results.length === 0 && <div className="search-empty"><h2>No stories found</h2><p>Try fewer words or search for a broader theme such as family, love, mystery, or second chances.</p></div>}
      </section>
      <SiteFooter />
    </main>
  );
}
