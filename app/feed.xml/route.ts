import { getPublishedStories } from "../posts-data";
import { absoluteUrl, siteDescription, siteName } from "../site";
import { collapseSeriesStories } from "../series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  })[character] || character);
}

export async function GET() {
  const allStories = await getPublishedStories();
  const stories = collapseSeriesStories(allStories);
  const items = stories.map((story) => {
    const url = absoluteUrl(`/story/${story.slug}`);
    return `<item>
      <title>${escapeXml(story.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(story.excerpt)}</description>
      <category>${escapeXml(story.category)}</category>
      <dc:creator>Porchlight Editors</dc:creator>
      <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
      <media:content url="${escapeXml(story.image)}" medium="image" />
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(Math.max(...stories.map((story) => Date.parse(story.updatedAt)))).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=3600" } });
}
