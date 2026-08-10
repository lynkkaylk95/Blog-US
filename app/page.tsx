import Link from "next/link";
import { Header } from "./components/Header";
import { StoryCard } from "./components/StoryCard";
import { NewsletterForm } from "./components/NewsletterForm";
import { SiteFooter } from "./components/SiteFooter";
import { getPublishedStories } from "./posts-data";
import { categorySlugs } from "./content";
import { FeaturedStoryCard } from "./components/FeaturedStoryCard";
import { collapseSeriesStories } from "./series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const stories = await getPublishedStories();
  const listingStories = collapseSeriesStories(stories);
  const featuredStories = collapseSeriesStories(stories.filter((story) => story.featured)).slice(0, 5);
  const mostRead = collapseSeriesStories([...stories].sort((a, b) => b.views - a.views)).slice(0, 3);
  const categoryGroups = Object.entries(categorySlugs)
    .map(([name, slug]) => ({ name, slug, stories: collapseSeriesStories(stories.filter((story) => story.category === name)).slice(0, 3) }))
    .filter((group) => group.stories.length > 0)
    .slice(0, 4);

  return (
    <main>
      <Header />
      {featuredStories.length > 0 && <section className="featured-stories shell" aria-labelledby="featured-stories-title">
        <div className="featured-stories-heading"><div><span className="eyebrow">Editor&apos;s picks</span><h2 id="featured-stories-title">Featured stories</h2></div><span>{featuredStories.length} selected {featuredStories.length === 1 ? "story" : "stories"}</span></div>
        <div className="featured-stories-list">{featuredStories.map((story) => <FeaturedStoryCard key={story.slug} story={story} />)}</div>
      </section>}
      <section id="popular" className="popular-band popular-band--first">
        <div className="shell">
          <div className="section-heading light"><div><span className="eyebrow">Reader favorites</span><h1>Most read today</h1></div><Link href="#latest">See all stories →</Link></div>
          <div className="popular-grid">{mostRead.map((story, i) => <StoryCard key={story.slug} story={story} rank={i + 1} />)}</div>
        </div>
      </section>

      <section id="latest" className="story-shelf shell">
        <div className="section-heading"><div><span className="eyebrow">Fresh from the porch</span><h2>Latest stories</h2></div><p>A new story, every day at 7 PM</p></div>
        <div className="popular-grid">{listingStories.slice(0, 6).map((story) => <StoryCard key={story.slug} story={story} />)}</div>
      </section>

      {categoryGroups.map((group, index) => (
        <section key={group.slug} className={`story-shelf ${index % 2 ? "story-shelf--tint" : ""}`}>
          <div className="shell">
            <div className="section-heading"><div><span className="eyebrow">Explore by theme</span><h2>{group.name}</h2></div><Link href={`/category/${group.slug}`}>View this category →</Link></div>
            <div className="popular-grid">{group.stories.map((story) => <StoryCard key={story.slug} story={story} />)}</div>
          </div>
        </section>
      ))}

      <section id="newsletter" className="newsletter-band">
        <div className="shell newsletter-band__inner">
          <div><span className="eyebrow">A story for your evening</span><h2>Come sit with us.</h2><p>Receive our most-loved story and a little goodness in your inbox each Sunday.</p></div>
          <aside className="newsletter newsletter--inline"><NewsletterForm /></aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
