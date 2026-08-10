import Image from "next/image";
import Link from "next/link";
import type { Story } from "../content";
import { authorSlug } from "../author-utils";

export function SeriesCard({ story, partCount }: { story: Story; partCount: number }) {
  const title = story.seriesTitle || story.title;
  return <article className="story-card series-card">
    <Link href={`/story/${story.slug}`} className="story-image-wrap" aria-label={`Read ${title} from Part ${story.partNumber || 1}`}>
      <Image className="story-image" src={story.image} alt={title} fill unoptimized={story.image.includes("/media/")} sizes="(max-width: 620px) calc(100vw - 28px), (max-width: 900px) 50vw, 380px" />
    </Link>
    <div className="story-copy">
      <span className="eyebrow">Series · {partCount} {partCount === 1 ? "Part" : "Parts"}</span>
      <h3><Link href={`/story/${story.slug}`}>{title}</Link></h3>
      <div className="story-author">By <Link href={`/author/${authorSlug(story.author)}`}>{story.author}</Link></div>
      <div className="story-meta"><span>Start reading</span><span>→</span></div>
    </div>
  </article>;
}
