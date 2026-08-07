import sanitizeHtml from "sanitize-html";
import { categorySlugs } from "../../content";

export type PostInput = {
  slug: string; title: string; excerpt: string; category: string; imageUrl: string; imageAlt: string;
  contentHtml: string; readTime: string; status: "draft" | "published"; featured: boolean;
};

export function validatePostInput(value: unknown): { data?: PostInput; message?: string } {
  if (!value || typeof value !== "object") return { message: "Invalid post data." };
  const input = value as Record<string, unknown>;
  const stringFields = ["slug", "title", "excerpt", "category", "imageUrl", "imageAlt", "contentHtml", "readTime"] as const;
  for (const field of stringFields) if (typeof input[field] !== "string" || !input[field].trim()) return { message: `${field} is required.` };
  const slug = String(input.slug).trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { message: "Slug must use lowercase letters, numbers, and hyphens." };
  if (!(String(input.category) in categorySlugs)) return { message: "Unsupported category." };
  try { new URL(String(input.imageUrl)); } catch { return { message: "Image URL is invalid." }; }
  const status = input.status === "published" ? "published" : "draft";
  const contentHtml = sanitizeHtml(String(input.contentHtml), {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "em", "u", "s", "blockquote", "ul", "ol", "li", "a", "img", "figure", "figcaption", "video", "source", "iframe", "span", "div"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"], video: ["src", "controls", "poster"], source: ["src", "type"], iframe: ["src", "title", "allow", "allowfullscreen", "loading"], span: ["style"], p: ["style"], div: ["style"] },
    allowedStyles: { "*": { color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(/], "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(/], "font-family": [/^[\w\s,'-]+$/], "font-size": [/^\d{1,3}(px|rem|em|%)$/], "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["http", "https"], allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true), iframe: sanitizeHtml.simpleTransform("iframe", { loading: "lazy" }, true) },
  });
  if (!sanitizeHtml(contentHtml, { allowedTags: [] }).trim()) return { message: "Post content is empty." };
  return { data: { slug, title: String(input.title).trim(), excerpt: String(input.excerpt).trim(), category: String(input.category), imageUrl: String(input.imageUrl), imageAlt: String(input.imageAlt).trim(), contentHtml, readTime: String(input.readTime).trim(), status, featured: input.featured === true } };
}
