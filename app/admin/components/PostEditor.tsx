"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAdminLocale } from "./AdminLocale";
import { AdminIcon } from "./AdminIcon";

const categories = ["Family & Legacy", "Second Chances", "Life Stories", "Justice & Truth", "Love After 50", "Grandparents"];
type EditorPost = { slug: string; title: string; excerpt: string; category: string; imageUrl: string; imageAlt: string; contentHtml: string; readTime: string; status: "draft" | "published"; featured: boolean };
const emptyPost: EditorPost = { slug: "", title: "", excerpt: "", category: categories[0], imageUrl: "", imageAlt: "", contentHtml: "<h2>Chapter title</h2><p>Start writing your story…</p>", readTime: "5 min read", status: "draft", featured: false };

export function PostEditor({ postId }: { postId?: number }) {
  const { t } = useAdminLocale();
  const [post, setPost] = useState<EditorPost>(emptyPost);
  const [loading, setLoading] = useState(Boolean(postId)); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [message, setMessage] = useState("");
  const editor = useRef<HTMLDivElement>(null); const savedRange = useRef<Range | null>(null); const slugTouched = useRef(Boolean(postId));
  const featuredUpload = useRef<HTMLInputElement>(null); const imageUpload = useRef<HTMLInputElement>(null); const videoUpload = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!postId) return; void fetch(`/api/admin/posts/${postId}`).then(async (response) => { const result = await response.json() as { post?: EditorPost; message?: string }; if (response.status === 401) return void (window.location.href = "/admin/login"); if (result.post) setPost(result.post); else setMessage(result.message || t("postNotFound")); setLoading(false); }); }, [postId, t]);
  // Populate an existing post once; later editor changes must not reset the caret.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!loading && postId && editor.current) editor.current.innerHTML = post.contentHtml; }, [loading, postId]);
  function set<K extends keyof EditorPost>(key: K, value: EditorPost[K]) { setPost((current) => ({ ...current, [key]: value })); }
  function titleChanged(title: string) { set("title", title); if (!slugTouched.current) set("slug", title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }
  function rememberSelection() { const selection = window.getSelection(); if (selection?.rangeCount && editor.current?.contains(selection.anchorNode)) savedRange.current = selection.getRangeAt(0).cloneRange(); }
  function syncEditor() { if (editor.current) set("contentHtml", editor.current.innerHTML); rememberSelection(); }
  function command(name: string, value?: string) { editor.current?.focus(); document.execCommand(name, false, value); syncEditor(); }
  function insertEditorHtml(html: string) {
    const root = editor.current; if (!root) return; root.focus(); const selection = window.getSelection(); const range = savedRange.current;
    if (selection && range && root.contains(range.commonAncestorContainer)) { selection.removeAllRanges(); selection.addRange(range); range.deleteContents(); const fragment = range.createContextualFragment(html); const last = fragment.lastChild; range.insertNode(fragment); if (last) { range.setStartAfter(last); range.collapse(true); selection.removeAllRanges(); selection.addRange(range); } }
    else root.insertAdjacentHTML("beforeend", html);
    syncEditor();
  }
  async function uploadLocal(file: File, target: "featured" | "image" | "video") {
    setUploading(true); setMessage(""); const data = new FormData(); data.set("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: data }); const result = await response.json() as { url?: string; message?: string };
      if (!response.ok || !result.url) return setMessage(result.message || t("uploadFailed"));
      const mediaUrl = new URL(result.url, window.location.origin).toString();
      if (target === "featured") set("imageUrl", mediaUrl);
      else if (target === "image") insertEditorHtml(`<figure><img src="${mediaUrl}" alt=""><figcaption></figcaption></figure><p><br></p>`);
      else insertEditorHtml(`<video src="${mediaUrl}" controls preload="metadata"></video><p><br></p>`);
    } catch { setMessage(t("uploadFailed")); }
    finally { setUploading(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); syncEditor(); setSaving(true); setMessage(""); const current = { ...post, contentHtml: editor.current?.innerHTML || post.contentHtml };
    const response = await fetch(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", { method: postId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(current) }); const result = await response.json() as { message?: string };
    if (response.ok) window.location.href = "/admin"; else { setMessage(result.message || t("saveFailed")); setSaving(false); }
  }
  if (loading) return <main className="admin-main"><div className="admin-notice">{t("loadingEditor")}</div></main>;

  return <main className="admin-main">
    <div className="admin-page-title"><div><span>{t("blog")}</span><h1>{postId ? t("editPost") : t("newPost")}</h1><p>{t("editorDescription")}</p></div><Link className="admin-back-link" href="/admin"><AdminIcon name="arrowLeft" />{t("backToPosts")}</Link></div>
    <form className="admin-editor-form" onSubmit={submit}>
      <section className="admin-panel admin-fields">
        <div className="field field--wide"><label>{t("title")} *</label><input value={post.title} onChange={(event) => titleChanged(event.target.value)} required /></div>
        <div className="field"><label>{t("slug")} *</label><input value={post.slug} onChange={(event) => { slugTouched.current = true; set("slug", event.target.value); }} required /></div>
        <div className="field"><label>{t("category")}</label><select value={post.category} onChange={(event) => set("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
        <div className="field field--wide"><label>{t("excerpt")} *</label><textarea rows={3} value={post.excerpt} onChange={(event) => set("excerpt", event.target.value)} required /></div>
        <div className="field"><label>{t("featuredImage")} *</label><div className="media-url-field"><input type="url" value={post.imageUrl} onChange={(event) => set("imageUrl", event.target.value)} required /><button type="button" disabled={uploading} onClick={() => featuredUpload.current?.click()}><AdminIcon name="upload" />{uploading ? t("uploading") : t("chooseLocalImage")}</button><input ref={featuredUpload} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLocal(file, "featured"); event.target.value = ""; }} /></div>{post.imageUrl && <div className="featured-image-preview"><img src={post.imageUrl} alt={post.imageAlt || "Featured image preview"} /></div>}</div>
        <div className="field"><label>{t("imageDescription")} *</label><input value={post.imageAlt} onChange={(event) => set("imageAlt", event.target.value)} required /></div>
        <div className="field"><label>{t("readTime")}</label><input value={post.readTime} onChange={(event) => set("readTime", event.target.value)} /></div>
        <div className="field"><label>{t("status")}</label><select value={post.status} onChange={(event) => set("status", event.target.value as EditorPost["status"])}><option value="draft">{t("draft")}</option><option value="published">{t("published")}</option></select></div>
        <label className="admin-check"><input type="checkbox" checked={post.featured} onChange={(event) => set("featured", event.target.checked)} /> {t("featuredHomepage")}</label>
      </section>
      <section className="admin-panel rich-panel"><div className="rich-label">{t("storyContent")} *</div>
        <div className="rich-toolbar">
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("undo")}>↶</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("redo")}>↷</button>
          <select onChange={(event) => command("formatBlock", event.target.value)} defaultValue="p"><option value="p">{t("paragraph")}</option><option value="h2">{t("heading2")}</option><option value="h3">{t("heading3")}</option><option value="blockquote">{t("quote")}</option></select>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("bold")}><b>B</b></button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("italic")}><i>I</i></button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("underline")}><u>U</u></button>
          <select title="Font" onChange={(event) => command("fontName", event.target.value)} defaultValue="Georgia"><option>Georgia</option><option>Arial</option><option>Verdana</option><option>Times New Roman</option></select><select title="Text size" onChange={(event) => command("fontSize", event.target.value)} defaultValue="3"><option value="2">{t("small")}</option><option value="3">{t("normal")}</option><option value="5">{t("large")}</option><option value="7">{t("extraLarge")}</option></select>
          <label className="color-tool" title="Text color">A<input type="color" onChange={(event) => command("foreColor", event.target.value)} /></label><label className="color-tool" title="Background color">▨<input type="color" onChange={(event) => command("hiliteColor", event.target.value)} /></label>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => command("insertUnorderedList")}><AdminIcon name="list" />{t("list")}</button>
          <button type="button" disabled={uploading} onMouseDown={() => rememberSelection()} onClick={() => imageUpload.current?.click()}><AdminIcon name="image" />{t("uploadImage")}</button><input ref={imageUpload} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLocal(file, "image"); event.target.value = ""; }} />
          <button type="button" disabled={uploading} onMouseDown={() => rememberSelection()} onClick={() => videoUpload.current?.click()}><AdminIcon name="video" />{t("uploadVideo")}</button><input ref={videoUpload} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLocal(file, "video"); event.target.value = ""; }} />
          <button type="button" title="Link" onMouseDown={(event) => event.preventDefault()} onClick={() => { const url = prompt("Link URL:"); if (url) command("createLink", url); }}><AdminIcon name="link" /></button>
        </div>{uploading && <div className="upload-progress" role="status">{t("uploading")}</div>}
        <div ref={editor} className="rich-editor" contentEditable suppressContentEditableWarning onInput={syncEditor} onKeyUp={rememberSelection} onMouseUp={rememberSelection} onBlur={rememberSelection} dangerouslySetInnerHTML={{ __html: postId ? "" : post.contentHtml }} />
      </section>
      {message && <div className="admin-error" role="alert">{message}</div>}<div className="editor-actions"><Link href="/admin">{t("cancel")}</Link><button className="admin-primary" disabled={saving || uploading}>{saving ? t("saving") : post.status === "published" ? t("publishPost") : t("saveDraft")}</button></div>
    </form>
  </main>;
}
