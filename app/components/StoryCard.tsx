import Link from "next/link";
import type { Story } from "../data";

export function StoryCard({ story, rank }: { story: Story; rank?: number }) {
  return (
    <article className={`story-card ${rank ? "story-card--ranked" : ""}`}>
      <Link href={`/story/${story.slug}`} className="story-image-wrap">
        {rank && <span className="rank">{rank}</span>}
        <img className="story-image" src={story.image} alt="" />
      </Link>
      <div className="story-copy">
        <span className="eyebrow">{story.category}</span>
        <h3><Link href={`/story/${story.slug}`}>{story.title}</Link></h3>
        <p>{story.excerpt}</p>
        <div className="story-meta"><span>{story.readTime}</span><span>•</span><span>{story.date}</span></div>
      </div>
    </article>
  );
}
