import Image from "next/image";
import Link from "next/link";
import type { Story } from "../content";

export function FeaturedStoryCard({ story }: { story: Story }) {
  const displayTitle = story.seriesTitle || story.title;
  return <article className="featured-story-card">
    <Link href={`/story/${story.slug}`} className="featured-story-image">
      <Image src={story.image} alt={displayTitle} fill unoptimized={story.image.includes("/media/")} sizes="(max-width: 620px) 110px, 150px" />
    </Link>
    <div>
      <span>{story.seriesTitle ? "Series" : story.category}</span>
      <h3><Link href={`/story/${story.slug}`}>{displayTitle}</Link></h3>
      <small>{story.readTime} · {story.date}</small>
    </div>
  </article>;
}
