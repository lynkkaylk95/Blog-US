"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAdminLocale } from "./AdminLocale";
import { AdminIcon } from "./AdminIcon";

const categories = [
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
type EditorPost = { slug: string; title: string; excerpt: string; category: string; seriesTitle: string | null; partNumber: number | null; imageUrl: string; imageAlt: string; contentHtml: string; readTime: string; author: string; status: "draft" | "published"; featured: boolean };
const emptyPost: EditorPost = { slug: "", title: "", excerpt: "", category: categories[0].value, seriesTitle: null, partNumber: null, imageUrl: "", imageAlt: "", contentHtml: "<p><br></p>", readTime: "5", author: "Porchlight Editors", status: "draft", featured: false };

function createSlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readTimeMinutes(value: string) { return value.match(/\d+/)?.[0] || ""; }

type TinyEditorInstance = {
  getContent(): string;
  insertContent(html: string): void;
  uploadImages(): Promise<unknown>;
};

export function PostEditor({ postId, seriesMode = false, initialSeriesTitle = "", initialPartNumber = 1 }: { postId?: number; seriesMode?: boolean; initialSeriesTitle?: string; initialPartNumber?: number }) {
  const { t } = useAdminLocale();
  const [post, setPost] = useState<EditorPost>(() => seriesMode ? { ...emptyPost, category: "Series", seriesTitle: initialSeriesTitle || null, partNumber: Math.max(1, initialPartNumber) } : emptyPost);
  const [loading, setLoading] = useState(Boolean(postId)); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [message, setMessage] = useState("");
  const editor = useRef<TinyEditorInstance | null>(null);
  const featuredUpload = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!postId) return; void fetch(`/api/admin/posts/${postId}`).then(async (response) => { const result = await response.json() as { post?: EditorPost; message?: string }; if (response.status === 401) return void (window.location.href = "/admin/login"); if (result.post) setPost({ ...result.post, readTime: readTimeMinutes(result.post.readTime) }); else setMessage(result.message || t("postNotFound")); setLoading(false); }); }, [postId, t]);
  function set<K extends keyof EditorPost>(key: K, value: EditorPost[K]) { setPost((current) => ({ ...current, [key]: value })); }
  const isSeries = seriesMode || post.category === "Series";
  function seriesSlug(current: EditorPost, title: string) { return createSlug(`${current.seriesTitle || "series"}-part-${current.partNumber || 1}-${title}`); }
  function titleChanged(title: string) { setPost((current) => ({ ...current, title, slug: isSeries ? seriesSlug(current, title) : createSlug(title) })); }
  function seriesTitleChanged(seriesTitle: string) { setPost((current) => ({ ...current, seriesTitle, slug: seriesSlug({ ...current, seriesTitle }, current.title) })); }
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
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const shouldAddNext = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value === "add-next";
    try { await editor.current?.uploadImages(); }
    catch (error) { setMessage(error instanceof Error ? error.message : t("uploadFailed")); setSaving(false); return; }
    const current = { ...post, contentHtml: editor.current?.getContent() || post.contentHtml };
    const response = await fetch(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", { method: postId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(current) }); const result = await response.json() as { message?: string };
    if (response.ok && shouldAddNext && isSeries) { const query = new URLSearchParams({ seriesTitle: post.seriesTitle || "", partNumber: String((post.partNumber || 1) + 1) }); window.location.href = `/admin/series/new?${query}`; }
    else if (response.ok) window.location.href = "/admin"; else { setMessage(result.message || t("saveFailed")); setSaving(false); }
  }
  if (loading) return <main className="admin-main"><div className="admin-notice">{t("loadingEditor")}</div></main>;

  return <main className="admin-main">
    <div className="admin-page-title"><div><span>{isSeries ? t("series") : t("blog")}</span><h1>{postId ? t("editPost") : isSeries ? t("newSeriesPart") : t("newPost")}</h1><p>{isSeries ? t("seriesEditorDescription") : t("editorDescription")}</p></div><Link className="admin-back-link" href="/admin"><AdminIcon name="arrowLeft" />{t("backToPosts")}</Link></div>
    <form className="admin-editor-form" onSubmit={submit}>
      <section className="admin-panel admin-fields">
        {isSeries && <div className="field field--wide"><label>{t("seriesTitle")} *</label><input value={post.seriesTitle || ""} onChange={(event) => seriesTitleChanged(event.target.value)} required maxLength={160} readOnly={Boolean(initialSeriesTitle && !postId)} /></div>}
        <div className="field field--wide"><label>{isSeries ? t("partName") : t("title")} *</label><input value={post.title} onChange={(event) => titleChanged(event.target.value)} required /></div>
        <div className="field"><label>{t("slug")} *</label><input value={post.slug} readOnly required /></div>
        {isSeries ? <div className="field"><label>{t("currentPart")}</label><input value={`Part ${post.partNumber || 1}`} readOnly /></div> : <div className="field"><label>{t("category")}</label><select value={post.category} onChange={(event) => set("category", event.target.value)}>{categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></div>}
        <div className="field"><label>{t("author")} *</label><input value={post.author} onChange={(event) => set("author", event.target.value)} required maxLength={120} /></div>
        <div className="field"><label>{t("featuredImage")} *</label><div className="media-url-field"><input type="url" value={post.imageUrl} onChange={(event) => set("imageUrl", event.target.value)} required /><button type="button" disabled={uploading} onClick={() => featuredUpload.current?.click()}><AdminIcon name="upload" />{uploading ? t("uploading") : t("chooseLocalImage")}</button><input ref={featuredUpload} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLocal(file, "featured"); event.target.value = ""; }} /></div>{post.imageUrl && <div className="featured-image-preview"><img src={post.imageUrl} alt={post.imageAlt || "Featured image preview"} /></div>}</div>
        <div className="field"><label>{t("readTime")}</label><input type="number" min="1" step="1" inputMode="numeric" value={post.readTime} onChange={(event) => set("readTime", event.target.value)} required /></div>
        <div className="field"><label>{t("status")}</label><select value={post.status} onChange={(event) => set("status", event.target.value as EditorPost["status"])}><option value="draft">{t("draft")}</option><option value="published">{t("published")}</option></select></div>
        <label className="admin-check"><input type="checkbox" checked={post.featured} onChange={(event) => set("featured", event.target.checked)} /> {t("featuredHomepage")}</label>
      </section>
      <section className="admin-panel rich-panel"><div className="rich-label">{t("storyContent")} *</div>
        {uploading && <div className="upload-progress" role="status">{t("uploading")}</div>}
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_, instance) => { editor.current = instance as TinyEditorInstance; }}
          initialValue={post.contentHtml || "<p></p>"}
          init={{
            license_key: "gpl",
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
      {message && <div className="admin-error" role="alert">{message}</div>}<div className="editor-actions"><Link href="/admin">{t("cancel")}</Link><button className="admin-primary" disabled={saving || uploading}>{saving ? t("saving") : post.status === "published" ? t("publishPost") : t("saveDraft")}</button>{isSeries && <button className="admin-primary admin-primary--next" type="submit" value="add-next" disabled={saving || uploading}>{t("addNextPart", { part: (post.partNumber || 1) + 1 })}</button>}</div>
    </form>
  </main>;
}
