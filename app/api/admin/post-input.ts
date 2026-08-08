import sanitizeHtml from "sanitize-html";
import { categorySlugs } from "../../content";

export type PostInput = {
  slug: string; title: string; excerpt: string; category: string; imageUrl: string; imageAlt: string;
  contentHtml: string; readTime: string; author: string; status: "draft" | "published"; featured: boolean;
  seriesTitle: string | null; partNumber: number | null;
};

export function validatePostInput(value: unknown): { data?: PostInput; message?: string } {
  if (!value || typeof value !== "object") return { message: "Invalid post data." };
  const input = value as Record<string, unknown>;
  const stringFields = ["slug", "title", "category", "imageUrl", "contentHtml", "readTime", "author"] as const;
  for (const field of stringFields) if (typeof input[field] !== "string" || !input[field].trim()) return { message: `${field} is required.` };
  const slug = String(input.slug).trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { message: "Slug must use lowercase letters, numbers, and hyphens." };
  if (!(String(input.category) in categorySlugs)) return { message: "Unsupported category." };
  const isSeries = String(input.category) === "Series";
  const seriesTitle = typeof input.seriesTitle === "string" ? input.seriesTitle.trim() : "";
  const partNumber = Number(input.partNumber);
  if (isSeries && !seriesTitle) return { message: "Series title is required for a series post." };
  if (isSeries && (!Number.isInteger(partNumber) || partNumber < 1)) return { message: "Part number must be a positive whole number." };
  try { new URL(String(input.imageUrl)); } catch { return { message: "Image URL is invalid." }; }
  const minutes = Number.parseInt(String(input.readTime), 10);
  if (!Number.isInteger(minutes) || minutes < 1) return { message: "Read time must be a positive number of minutes." };
  const status = input.status === "published" ? "published" : "draft";
  const contentHtml = sanitizeHtml(String(input.contentHtml), {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "em", "u", "s", "blockquote", "ul", "ol", "li", "a", "img", "figure", "figcaption", "video", "source", "iframe", "span", "div"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"], video: ["src", "controls", "poster"], source: ["src", "type"], iframe: ["src", "title", "allow", "allowfullscreen", "loading"], span: ["style"], p: ["style"], div: ["style"] },
    allowedStyles: { "*": { color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(/], "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(/], "font-family": [/^[\w\s,'-]+$/], "font-size": [/^\d{1,3}(px|rem|em|%)$/], "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["http", "https"], allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true), iframe: sanitizeHtml.simpleTransform("iframe", { loading: "lazy" }, true) },
  });
  if (!sanitizeHtml(contentHtml, { allowedTags: [] }).trim()) return { message: "Post content is empty." };
  return { data: { slug, title: String(input.title).trim(), excerpt: "", category: String(input.category), imageUrl: String(input.imageUrl), imageAlt: "", contentHtml, readTime: `${minutes} min read`, author: String(input.author).trim(), status, featured: input.featured === true, seriesTitle: isSeries ? seriesTitle : null, partNumber: isSeries ? partNumber : null } };
}
