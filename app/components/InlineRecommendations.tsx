import Image from "next/image";
import Link from "next/link";

export type InlineRecommendation = {
  slug: string;
  title: string;
  image: string;
  category: string;
  readTime: string;
};

export function InlineRecommendations({ stories, category }: { stories: InlineRecommendation[]; category: string }) {
  if (!stories.length) return null;
  return <aside className="inline-recommendations" aria-label={`More ${category} stories`}>
    <div className="inline-recommendations__head"><span>More in {category}</span><strong>You may also like</strong></div>
    <div className="inline-recommendations__list">{stories.map((story) => <Link href={`/story/${story.slug}`} key={story.slug}>
      <span className="inline-recommendations__image"><Image src={story.image} alt="" fill unoptimized={story.image.includes("/media/")} sizes="112px" /></span>
      <span><b>{story.title}</b><small>{story.readTime} · Continue reading →</small></span>
    </Link>)}</div>
  </aside>;
}
