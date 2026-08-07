import { AdSlot } from "../../components/AdSlot";

export function RichStory({ html }: { html: string }) {
  return <article className="reader reader--paper"><div className="story-body rich-story" dangerouslySetInnerHTML={{ __html: html }} /><div className="story-body"><AdSlot compact /><div className="story-end">THE END</div></div></article>;
}
