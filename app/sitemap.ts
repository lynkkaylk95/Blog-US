import type { MetadataRoute } from "next";
import { categorySlugs } from "./content";
import { getPublishedStories } from "./posts-data";
import { absoluteUrl } from "./site";
import { authorSlug } from "./author-utils";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getPublishedStories();
  const latestStoryDate = new Date(Math.max(...stories.map((story) => Date.parse(story.updatedAt))));
  const staticPages = ["", "/about", "/editorial-standards", "/contact", "/privacy", "/terms", "/cookies"];
  const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: latestStoryDate,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.4,
  }));
  const categoryPages: MetadataRoute.Sitemap = [...new Set(Object.values(categorySlugs))].map((slug) => ({
    url: absoluteUrl(`/category/${slug}`),
    lastModified: latestStoryDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: absoluteUrl(`/story/${story.slug}`),
    lastModified: new Date(story.updatedAt),
    changeFrequency: "monthly",
    priority: story.featured ? 0.9 : 0.8,
    images: [story.image],
  }));
  const authorPages: MetadataRoute.Sitemap = [...new Set(stories.map((story) => story.author))].map((author) => ({
    url: absoluteUrl(`/author/${authorSlug(author)}`),
    lastModified: latestStoryDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  return [...pages, ...categoryPages, ...authorPages, ...storyPages];
}
