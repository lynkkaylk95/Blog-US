import Link from "next/link";
import Image from "next/image";
import type { Story } from "../content";

export function StoryCard({ story, rank }: { story: Story; rank?: number }) {
  return (
    <article className={`story-card ${rank ? "story-card--ranked" : ""}`}>
      <Link href={`/story/${story.slug}`} className="story-image-wrap">
        {rank && <span className="rank">{rank}</span>}
        <Image className="story-image" src={story.image} alt={story.title} fill sizes="(max-width: 620px) calc(100vw - 28px), (max-width: 900px) 50vw, 380px" />
      </Link>
      <div className="story-copy">
        <span className="eyebrow">{story.category}</span>
        <h3><Link href={`/story/${story.slug}`}>{story.title}</Link></h3>
        <div className="story-meta"><span>{story.readTime}</span><span>•</span><span>{story.date}</span></div>
      </div>
    </article>
  );
}
