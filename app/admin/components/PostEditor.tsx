"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAdminLocale } from "./AdminLocale";
import { AdminIcon } from "./AdminIcon";
import { categorySlug, storyCategories } from "../../categories";

const categoryLabels = [
  { value: "Family & Legacy", label: "Family & Legacy (Gia đình & Di sản)" },
  { value: "Second Chances", label: "Second Chances (Cơ hội thứ hai)" },
  { value: "Life Stories", label: "Life Stories (Những câu chuyện cuộc sống)" },
  { value: "Justice & Truth", label: "Justice & Truth (Công lý & Sự thật)" },
  { value: "Love After 50", label: "Love After 50 (Tình yêu sau tuổi 50)" },
  { value: "Grandparents", label: "Grandparents (Ông bà)" },
  { value: "Mystery", label: "Mystery (Bí ẩn)" },
  { value: "Secrets", label: "Secrets (Bí mật)" },
  { value: "Confessions", label: "Confessions (Lời thú nhận)" },
  { value: "Unbelievable Stories", label: "Unbelievable Stories (Những câu chuyện khó tin)" },
  { value: "Unexpected Encounters", label: "Unexpected Encounters (Những cuộc gặp gỡ bất ngờ)" },
  { value: "Plot Twists", label: "Plot Twists (Những cú ngoặt cốt truyện)" },
  { value: "Strange Stories", label: "Strange Stories (Những câu chuyện kỳ lạ)" },
  { value: "Hidden Truths", label: "Hidden Truths (Sự thật bị che giấu)" },
  { value: "Revenge Stories", label: "Revenge Stories (Những câu chuyện trả thù)" },
  { value: "Karma Stories", label: "Karma Stories (Những câu chuyện nhân quả)" },
  { value: "Cheating", label: "Cheating (Ngoại tình)" },
  { value: "First Love", label: "First Love (Tình đầu)" },
  { value: "Family Stories", label: "Family Stories (Chuyện gia đình)" },
  { value: "Mother & Daughter", label: "Mother & Daughter (Mẹ và con gái)" },
  { value: "Father & Son", label: "Father & Son (Cha và con trai)" },
  { value: "Parenting", label: "Parenting (Nuôi dạy con)" },
  { value: "Family Secrets", label: "Family Secrets (Bí mật gia đình)" },
  { value: "Life & Lifestyle", label: "Life & Lifestyle (Cuộc sống và phong cách sống)" },
  { value: "Life Lessons", label: "Life Lessons (Bài học cuộc sống)" },
  { value: "Everyday Life", label: "Everyday Life (Cuộc sống thường ngày)" },
];
const categories = storyCategories.map((value) => ({ value, label: categoryLabels.find((item) => item.value === value)?.label || value }));
type EditorPost = { slug: string; title: string; excerpt: string; category: string; categories: string[]; seriesTitle: string | null; partNumber: number | null; imageUrl: string; imageAlt: string; contentHtml: string; readTime: string; author: string; status: "draft" | "published"; featured: boolean };
const emptyPost: EditorPost = { slug: "", title: "", excerpt: "", category: categories[0].value, categories: [categories[0].value], seriesTitle: null, partNumber: null, imageUrl: "", imageAlt: "", contentHtml: "<p><br></p>", readTime: "5", author: "Porchlight Editors", status: "published", featured: false };

function createSlug(value: string) {
  return categorySlug(value);
}

function readTimeMinutes(value: string) { return value.match(/\d+/)?.[0] || ""; }

type TinyEditorInstance = {
  getContent(): string;
  setContent(html: string): void;
  undoManager: { clear(): void };
  insertContent(html: string): void;
  uploadImages(): Promise<unknown>;
};
type AnalyzedPart = { partNumber: number; title: string; contentHtml: string; characters: number; words: number; readTime: string; preview: string };

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function PostEditor({ postId, seriesMode = false, manualSeriesPart = false, initialSeriesTitle = "", initialPartNumber = 1, initialCategories = ["Series"], initialAuthor = "Porchlight Editors", initialImageUrl = "" }: { postId?: number; seriesMode?: boolean; manualSeriesPart?: boolean; initialSeriesTitle?: string; initialPartNumber?: number; initialCategories?: string[]; initialAuthor?: string; initialImageUrl?: string }) {
  const { t, locale } = useAdminLocale();
  const [post, setPost] = useState<EditorPost>(() => seriesMode ? { ...emptyPost, category: initialCategories[0] || "Series", categories: initialCategories.includes("Series") ? initialCategories : ["Series", ...initialCategories], seriesTitle: initialSeriesTitle || null, partNumber: Math.max(1, initialPartNumber), author: initialAuthor, imageUrl: initialImageUrl } : emptyPost);
  const [loading, setLoading] = useState(Boolean(postId)); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [removeIntro, setRemoveIntro] = useState(true);
  const [analysis, setAnalysis] = useState<{ parts: AnalyzedPart[] } | null>(null);
  const editor = useRef<TinyEditorInstance | null>(null);
  const featuredUpload = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!postId) return; void fetch(`/api/admin/posts/${postId}`).then(async (response) => { const result = await response.json() as { post?: Omit<EditorPost, "categories"> & { categories?: string | string[] }; message?: string }; if (response.status === 401) return void (window.location.href = "/admin/login"); if (result.post) { let selected: string[] = []; try { selected = Array.isArray(result.post.categories) ? result.post.categories : JSON.parse(result.post.categories || "[]") as string[]; } catch { selected = []; } setPost({ ...result.post, categories: selected.length ? selected : [result.post.category], readTime: readTimeMinutes(result.post.readTime) }); } else setMessage(result.message || t("postNotFound")); setLoading(false); }); }, [postId, t]);
  function set<K extends keyof EditorPost>(key: K, value: EditorPost[K]) { setPost((current) => ({ ...current, [key]: value })); }
  function addCategory(value: string) { if (!value) return; setPost((current) => current.categories.includes(value) ? current : { ...current, category: current.categories[0] || value, categories: [...current.categories, value] }); }
  function removeCategory(value: string) { setPost((current) => { const selected = current.categories.filter((item) => item !== value); return { ...current, category: selected[0] || "", categories: selected }; }); }
  const isSeries = seriesMode || post.categories.includes("Series");
  const isBulkSeries = isSeries && !postId && !manualSeriesPart;
  function titleChanged(title: string) { setPost((current) => ({ ...current, title, slug: createSlug(title) })); }
  function seriesTitleChanged(seriesTitle: string) { set("seriesTitle", seriesTitle); }
  function partNumberChanged(partNumber: number) { set("partNumber", partNumber); }
  async function uploadFile(file: Blob, progress?: (percent: number) => void) {
    const data = new FormData(); data.set("file", file); progress?.(10);
    const response = await fetch("/api/admin/upload", { method: "POST", body: data });
    if (response.status === 401) { window.location.href = "/admin/login"; throw new Error("Unauthorized"); }
    const responseText = await response.text();
    let result: { url?: string; message?: string } = {};
    try { result = JSON.parse(responseText) as { url?: string; message?: string }; }
    catch { if (!response.ok) throw new Error(`Upload failed (${response.status}). Please sign in again and retry.`); }
    if (!response.ok || !result.url) throw new Error(result.message || t("uploadFailed"));
    progress?.(100);
    return new URL(result.url, window.location.origin).toString();
  }
  async function uploadLocal(file: File, target: "featured" | "image" | "video") {
    setUploading(true); setMessage("");
    try {
      const mediaUrl = await uploadFile(file);
      if (target === "featured") set("imageUrl", mediaUrl);
      else if (target === "image") editor.current?.insertContent(`<figure><img src="${mediaUrl}" alt=""><figcaption></figcaption></figure><p></p>`);
      else editor.current?.insertContent(`<video src="${mediaUrl}" controls preload="metadata"></video><p></p>`);
    } catch (error) { setMessage(error instanceof Error ? error.message : t("uploadFailed")); }
    finally { setUploading(false); }
  }
  async function analyzeChapters() {
    if (saving || analyzing || uploading || analysis) return;
    setAnalyzing(true); setMessage("");
    try {
      await editor.current?.uploadImages();
      const source = editor.current?.getContent() ?? post.contentHtml;
      const response = await fetch("/api/admin/series/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentHtml: source }) });
      if (response.status === 401) { window.location.href = "/admin/login"; return; }
      const result = await response.json() as { introHtml?: string; parts?: AnalyzedPart[]; message?: string };
      if (!response.ok || !result.parts?.length || typeof result.introHtml !== "string") throw new Error(result.message || t("analysisFailed"));
      if ((editor.current?.getContent() ?? post.contentHtml) !== source) throw new Error(t("analyzeBeforeSave"));
      replaceSource(result.introHtml);
      setAnalysis({ parts: result.parts });
    } catch (error) { setMessage(error instanceof Error ? error.message : t("analysisFailed")); }
    finally { setAnalyzing(false); }
  }
  function replaceSource(html: string) {
    editor.current?.setContent(html);
    // Undo must not put the extracted chapters back into the intro as duplicates.
    editor.current?.undoManager.clear();
    set("contentHtml", html);
  }
  function restoreChapters() {
    if (!analysis || saving || analyzing || uploading) return;
    const intro = editor.current?.getContent() ?? post.contentHtml;
    const chapters = analysis.parts.map((part) => `<h2>Chapter ${part.partNumber}: ${escapeHtml(part.title)}</h2>${part.contentHtml}`).join("");
    replaceSource(intro + chapters);
    setAnalysis(null);
    setMessage("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving || uploading || analyzing) return;
    setSaving(true); setMessage("");
    const shouldAddNext = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value === "add-next";
    try {
      await editor.current?.uploadImages();
      if (isBulkSeries && !analysis) throw new Error(t("analyzeBeforeSave"));
      const contentHtml = editor.current?.getContent() ?? post.contentHtml;
      const current = { ...post, contentHtml, ...(isBulkSeries ? { removeIntro, introHtml: contentHtml, parts: analysis!.parts } : {}) };
      const endpoint = postId ? `/api/admin/posts/${postId}` : isBulkSeries ? "/api/admin/series" : "/api/admin/posts";
      const response = await fetch(endpoint, { method: postId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(current) });
      if (response.status === 401) { window.location.href = "/admin/login"; return; }
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || t("saveFailed"));
      if (shouldAddNext && isSeries && !isBulkSeries) {
        const query = new URLSearchParams({ mode: "part", seriesTitle: post.seriesTitle || "", partNumber: String((post.partNumber || 1) + 1), categories: JSON.stringify(post.categories), author: post.author, imageUrl: post.imageUrl });
        window.location.href = `/admin/series/new?${query}`;
      } else window.location.href = "/admin";
    } catch (error) { setMessage(error instanceof Error ? error.message : t("saveFailed")); }
    finally { setSaving(false); }
  }
  if (loading) return <main className="admin-main"><div className="admin-notice">{t("loadingEditor")}</div></main>;

  return <main className="admin-main">
    <div className="admin-page-title"><div><span>{isSeries ? t("series") : t("blog")}</span><h1>{postId ? t("editPost") : isBulkSeries ? t("addSeries") : isSeries ? t("newSeriesPart") : t("newPost")}</h1><p>{isBulkSeries ? t("bulkSeriesDescription") : isSeries ? t("seriesEditorDescription") : t("editorDescription")}</p></div><Link className="admin-back-link" href="/admin"><AdminIcon name="arrowLeft" />{t("backToPosts")}</Link></div>
    <form className="admin-editor-form" onSubmit={submit}>
      <section className="admin-panel admin-fields">
        {isSeries && <div className="field field--wide"><label>{t("seriesTitle")} *</label><input value={post.seriesTitle || ""} onChange={(event) => seriesTitleChanged(event.target.value)} required maxLength={160} readOnly={Boolean(initialSeriesTitle && !postId && manualSeriesPart)} /></div>}
        {!isBulkSeries && <div className="field field--wide"><label>{isSeries ? t("partName") : t("title")} *</label><input value={post.title} onChange={(event) => titleChanged(event.target.value)} required /></div>}
        {!isBulkSeries && <div className="field"><label>{t("slug")} *</label><input value={post.slug} readOnly required /></div>}
        {isSeries && !isBulkSeries && <div className="field"><label>{t("partNumber")}</label><input type="number" min="1" step="1" value={post.partNumber || 1} onChange={(event) => partNumberChanged(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} /></div>}
        <div className="field field--wide"><label>{t("category")} *</label><div className="category-picker"><div className="category-chips">{post.categories.map((value) => <span key={value}>#{createSlug(value)}{!(isSeries && value === "Series") && <button type="button" onClick={() => removeCategory(value)} aria-label={`Remove ${value}`}>×</button>}</span>)}</div><select aria-label={t("category")} value="" onChange={(event) => addCategory(event.target.value)}><option value="">+ {t("category")}</option>{categories.filter((item) => !post.categories.includes(item.value)).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></div>
        <div className="field"><label>{t("author")} *</label><input value={post.author} onChange={(event) => set("author", event.target.value)} required maxLength={120} /></div>
        <div className="field"><label>{t("featuredImage")} *</label><div className="media-url-field"><input type="url" value={post.imageUrl} onChange={(event) => set("imageUrl", event.target.value)} required /><button type="button" disabled={uploading} onClick={() => featuredUpload.current?.click()}><AdminIcon name="upload" />{uploading ? t("uploading") : t("chooseLocalImage")}</button><input ref={featuredUpload} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLocal(file, "featured"); event.target.value = ""; }} /></div>{post.imageUrl && <div className="featured-image-preview"><img src={post.imageUrl} alt={post.imageAlt || "Featured image preview"} /></div>}</div>
        {!isBulkSeries && <div className="field"><label>{t("readTime")}</label><input type="number" min="1" step="1" inputMode="numeric" value={post.readTime} onChange={(event) => set("readTime", event.target.value)} required /></div>}
        <div className="field"><label>{t("status")}</label><select value={post.status} onChange={(event) => set("status", event.target.value as EditorPost["status"])}><option value="draft">{t("draft")}</option><option value="published">{t("published")}</option></select></div>
        <label className="admin-check"><input type="checkbox" checked={post.featured} onChange={(event) => set("featured", event.target.checked)} /> {t("featuredHomepage")}</label>
      </section>
      <section className="admin-panel rich-panel"><div className="rich-label">{isBulkSeries ? analysis ? t("introContent") : t("fullStoryContent") : t("storyContent")}{!isBulkSeries || !analysis ? " *" : ""}</div>
        {isBulkSeries && <p className="series-analysis-help">{analysis ? t("chaptersMovedHint") : t("chapterFormatHint")}</p>}
        {uploading && <div className="upload-progress" role="status">{t("uploading")}</div>}
        <Editor
          id="story-source-editor"
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          disabled={saving || analyzing}
          onInit={(_, instance) => { editor.current = instance as TinyEditorInstance; }}
          initialValue={post.contentHtml || "<p></p>"}
          init={{
            height: 650,
            menubar: "file edit view insert format tools table help",
            plugins: "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
            toolbar: "undo redo | blocks | fontfamily fontsize | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image media table | blockquote removeformat | code fullscreen preview",
            toolbar_mode: "wrap",
            block_formats: "Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Quote=blockquote",
            font_family_formats: "Georgia=Georgia,serif;Arial=Arial,sans-serif;Verdana=Verdana,sans-serif;Times New Roman='Times New Roman',serif",
            font_size_formats: "12px 14px 16px 18px 20px 24px 28px 32px",
            content_style: "html,body{direction:ltr;text-align:left}body{font-family:Georgia,serif;font-size:18px;line-height:1.75;max-width:760px;margin:24px auto;padding:0 24px}img,video{max-width:100%;height:auto}h2{font-size:30px}h3{font-size:25px}h4{font-size:21px}",
            directionality: "ltr",
            entity_encoding: "raw",
            automatic_uploads: true,
            paste_data_images: true,
            images_reuse_filename: false,
            images_upload_handler: (blobInfo, progress) => uploadFile(blobInfo.blob(), progress),
            file_picker_types: "image media",
            file_picker_callback: (callback, _value, meta) => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = meta.filetype === "media" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/avif";
              input.onchange = () => { const file = input.files?.[0]; if (file) void uploadFile(file).then((url) => callback(url, { title: file.name })).catch((error) => setMessage(error instanceof Error ? error.message : t("uploadFailed"))); };
              input.click();
            },
            media_live_embeds: true,
            convert_unsafe_embeds: true,
            object_resizing: "img,video",
            relative_urls: false,
            remove_script_host: false,
            promotion: false,
            branding: false,
          }}
        />
      </section>
      {isBulkSeries && <section className="admin-panel series-analysis" aria-busy={analyzing}>
        <label className="admin-check"><input type="checkbox" checked={removeIntro} disabled={saving || uploading || analyzing} onChange={(event) => setRemoveIntro(event.target.checked)} aria-describedby="series-intro-help" />{t("removeIntro")}</label>
        <p id="series-intro-help">{t("removeIntroHint")}</p>
        {analysis ? <button type="button" className="admin-primary" disabled={saving || uploading || analyzing} onClick={restoreChapters}>{t("restoreChapters")}</button> : <button type="button" className="admin-primary" disabled={saving || uploading || analyzing} onClick={analyzeChapters}>{analyzing ? t("analyzingChapters") : t("analyzeChapters")}</button>}
        <p role="status">{analysis ? t("chaptersFound", { count: analysis.parts.length }) : t("analyzeBeforeSave")}</p>
        {analysis && <><p>{t("seriesSharedDetails")}</p><ol className="series-part-preview">{analysis.parts.map((part) => <li key={part.partNumber}>
          <strong>Part {part.partNumber}: {part.title}</strong>
          <label className="series-part-title">{t("partName")}<input aria-label={`${t("partName")} ${part.partNumber}`} required value={part.title} disabled={saving || analyzing} onChange={(event) => setAnalysis((current) => current ? { parts: current.parts.map((item) => item.partNumber === part.partNumber ? { ...item, title: event.target.value } : item) } : null)} /></label>
          <code>/story/{createSlug(part.title)}</code>
          <details className="series-part-details">
            <summary aria-controls={`series-part-content-${part.partNumber}`}>
              <span className="series-part-show">{t("showPartContent")}</span>
              <span className="series-part-hide">{t("hidePartContent")}</span>
              <span className="series-part-characters" title={t("characterCountHint")}>{part.characters.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {t("characters")}</span>
            </summary>
            <div id={`series-part-content-${part.partNumber}`} className="series-part-content" dangerouslySetInnerHTML={{ __html: part.contentHtml }} />
          </details>
        </li>)}</ol></>}
      </section>}
      {message && <div className="admin-error" role="alert">{message}</div>}<div className="editor-actions"><Link href="/admin">{t("cancel")}</Link><button className="admin-primary" disabled={saving || uploading || analyzing || (isBulkSeries && !analysis)}>{saving ? t("saving") : isBulkSeries ? t("saveSeries") : post.status === "published" ? t("publishPost") : t("saveDraft")}</button>{isSeries && !isBulkSeries && <button className="admin-primary admin-primary--next" type="submit" value="add-next" disabled={saving || uploading}>{t("addNextPart", { part: (post.partNumber || 1) + 1 })}</button>}</div>
    </form>
  </main>;
}
