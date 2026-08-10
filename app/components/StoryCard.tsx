import Link from "next/link";
import Image from "next/image";
import type { Story } from "../content";
import { authorSlug } from "../author-utils";
import { CategoryTags } from "./CategoryTags";

export function StoryCard({ story, rank }: { story: Story; rank?: number }) {
  const displayTitle = story.seriesTitle || story.title;
  return (
    <article className={`story-card ${rank ? "story-card--ranked" : ""}`}>
      <Link href={`/story/${story.slug}`} className="story-image-wrap">
        {rank && <span className="rank">{rank}</span>}
        <Image className="story-image" src={story.image} alt={displayTitle} fill unoptimized={story.image.includes("/media/")} sizes="(max-width: 620px) calc(100vw - 28px), (max-width: 900px) 50vw, 380px" />
      </Link>
      <div className="story-copy">
        <h3><Link href={`/story/${story.slug}`}>{displayTitle}</Link></h3>
        <CategoryTags categories={story.categories} />
        <div className="story-author">By <Link href={`/author/${authorSlug(story.author)}`}>{story.author}</Link></div>
        <div className="story-meta"><span>{story.readTime}</span><span>•</span><span>{story.date}</span></div>
        <div className="story-views">{story.views.toLocaleString("en-US")} views</div>
      </div>
    </article>
  );
}
