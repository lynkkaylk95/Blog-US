import { AdSlot } from "../../components/AdSlot";
import { InlineRecommendations, type InlineRecommendation } from "../../components/InlineRecommendations";

function splitHtml(html: string) {
  const endings = [...html.matchAll(/<\/p>/gi)];
  if (endings.length < 4) return [html, ""];
  const middle = endings[Math.floor(endings.length / 2)];
  const index = (middle.index || 0) + middle[0].length;
  return [html.slice(0, index), html.slice(index)];
}

export function RichStory({ html, recommendations, category, showEnd = true }: { html: string; recommendations: InlineRecommendation[]; category: string; showEnd?: boolean }) {
  const [firstHalf, secondHalf] = splitHtml(html);
  return <article className="reader reader--paper"><div className="story-body rich-story" dangerouslySetInnerHTML={{ __html: firstHalf }} />{secondHalf && <div className="story-body"><InlineRecommendations stories={recommendations} category={category} /></div>}<div className="story-body rich-story" dangerouslySetInnerHTML={{ __html: secondHalf }} /><div className="story-body"><AdSlot compact />{showEnd && <div className="story-end">THE END</div>}</div></article>;
}
