import { DomUtils, parseDocument } from "htmlparser2";
import { Element, Text, isTag, isText, type ChildNode } from "domhandler";
import { categorySlug } from "../../categories";
import { sanitizePostHtml, validatePostInput, type PostInput } from "./post-input";

const blockTags = new Set(["p", "div", "h2", "h3", "h4", "blockquote", "ul", "ol", "li", "figure", "figcaption"]);
const chapterPattern = /^Chapter\s+(\d+)\s*:\s*(.+)$/i;
export type SeriesPart = { partNumber: number; title: string; contentHtml: string; words: number; readTime: string; preview: string };

function copyElement(node: Element, children: ChildNode[]) {
  return new Element(node.name, { ...node.attribs }, children);
}

// TinyMCE may paste headings as paragraphs, nested spans, or lines separated by <br>.
// Split those lines while retaining their inline formatting and outer containers.
function inlineLines(nodes: ChildNode[], splitNewlines = /(?:^|\n)\s*Chapter\s+\d+\s*:/i.test(DomUtils.textContent(nodes))): ChildNode[][] {
  const lines: ChildNode[][] = [[]];
  for (const node of nodes) {
    let fragments: ChildNode[][];
    if (isText(node)) fragments = (splitNewlines ? node.data.split(/\r?\n/) : [node.data]).map((text) => [new Text(text)]);
    else if (isTag(node) && node.name === "br") fragments = [[], []];
    else if (isTag(node) && node.children.length) fragments = inlineLines(node.children, splitNewlines).map((children) => [copyElement(node, children)]);
    else fragments = [[node]];
    fragments.forEach((fragment, index) => {
      if (index) lines.push([]);
      lines[lines.length - 1].push(...fragment);
    });
  }
  return lines;
}

function containsBlock(node: ChildNode): boolean {
  return isTag(node) && (blockTags.has(node.name) || node.children.some(containsBlock));
}

function normalizeLines(nodes: ChildNode[]): ChildNode[] {
  return nodes.flatMap((node): ChildNode[] => {
    if (isTag(node)) {
      if (node.children.some(containsBlock)) return [copyElement(node, normalizeLines(node.children))];
      if (blockTags.has(node.name)) return inlineLines(node.children).map((children) => copyElement(node, children));
    }
    if (isText(node) && /(?:^|\n)\s*Chapter\s+\d+\s*:/i.test(node.data)) {
      return inlineLines([node]).map((children) => new Element("p", {}, children));
    }
    return [node];
  });
}

export function analyzeSeries(content: unknown, { removeIntro = true }: { removeIntro?: boolean } = {}): SeriesPart[] {
  if (typeof content !== "string" || !content.trim()) throw new Error("Nhập toàn bộ truyện trước khi phân tích. / Enter the full story first.");
  const nodes = normalizeLines(parseDocument(sanitizePostHtml(content)).children);
  const parts: SeriesPart[] = [];
  let current = -1;

  function divide(items: ChildNode[]): Map<number, ChildNode[]> {
    const groups = new Map<number, ChildNode[]>();
    const append = (index: number, node: ChildNode) => {
      const group = groups.get(index);
      if (group) group.push(node);
      else groups.set(index, [node]);
    };
    for (const node of items) {
      const leaf = isTag(node) && blockTags.has(node.name) && !node.children.some(containsBlock);
      const text = leaf ? DomUtils.textContent(node).replace(/\s+/g, " ").trim() : "";
      const match = text.match(chapterPattern);
      if (match) {
        const partNumber = Number(match[1]);
        if (!Number.isSafeInteger(partNumber) || partNumber !== parts.length + 1) {
          throw new Error(`Sai thứ tự chương: cần Chapter ${parts.length + 1}, gặp Chapter ${match[1]}. / Chapters must be consecutive, starting at 1.`);
        }
        current = parts.length;
        parts.push({ partNumber, title: match[2].trim(), contentHtml: "", words: 0, readTime: "", preview: "" });
      } else if (leaf && /^Chapter\s+\d+\s*:/i.test(text)) {
        throw new Error(`Chapter ${parts.length + 1} thiếu tên chương. / A chapter title is required after the colon.`);
      } else if (isTag(node) && node.children.some(containsBlock)) {
        for (const [index, children] of divide(node.children)) append(index, copyElement(node, children));
      } else {
        append(current, node);
      }
    }
    return groups;
  }

  const groups = divide(nodes);
  if (!parts.length) throw new Error("Không tìm thấy chương. Mỗi tiêu đề cần ở dòng riêng: Chapter 1: Tên chương. / No chapter headings found.");
  for (const [index, children] of groups) {
    if (index >= 0) parts[index].contentHtml = DomUtils.getOuterHTML(children);
  }
  // Everything before Chapter 1 is the intro; keep it only when requested.
  const introduction = DomUtils.getOuterHTML(groups.get(-1) || []);
  for (const part of parts) {
    const text = DomUtils.innerText(parseDocument(part.contentHtml).children).replace(/\s+/g, " ").trim();
    if (!text) throw new Error(`Chapter ${part.partNumber} chưa có nội dung. / Chapter ${part.partNumber} has no content.`);
  }
  if (!removeIntro) parts[0].contentHtml = introduction + parts[0].contentHtml;
  for (const part of parts) {
    const text = DomUtils.innerText(parseDocument(part.contentHtml).children).replace(/\s+/g, " ").trim();
    part.words = text.split(/\s+/).length;
    part.readTime = `${Math.max(1, Math.ceil(part.words / 200))} min read`;
    part.preview = text.slice(0, 180);
  }
  return parts;
}

export function prepareSeries(value: unknown): PostInput[] {
  if (!value || typeof value !== "object") throw new Error("Invalid series data.");
  const input = value as Record<string, unknown>;
  const seriesTitle = typeof input.seriesTitle === "string" ? input.seriesTitle.trim() : "";
  if (!seriesTitle || seriesTitle.length > 160) throw new Error("Tên series phải có 1–160 ký tự. / Series title must contain 1–160 characters.");
  const categories = Array.isArray(input.categories) ? [...new Set(["Series", ...input.categories])] : ["Series"];
  return analyzeSeries(input.contentHtml, { removeIntro: input.removeIntro !== false }).map((part) => {
    const result = validatePostInput({
      ...input, ...part, seriesTitle, categories, category: "Series",
      slug: categorySlug(`${seriesTitle}-part-${part.partNumber}-${part.title}`),
    });
    if (!result.data) throw new Error(`Chapter ${part.partNumber}: ${result.message}`);
    return result.data;
  });
}
