"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAdminLocale } from "./AdminLocale";
import { AdminIcon } from "./AdminIcon";

type Post = { id: number; slug: string; title: string; imageUrl: string; status: "draft" | "published"; updatedAt: string; category: string; author: string; views: number };

export function AdminDashboard() {
  const { locale, t } = useAdminLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/posts");
    const result = await response.json() as { posts?: Post[]; message?: string };
    if (response.status === 401) return void (window.location.href = "/admin/login");
    setPosts(result.posts || []);
    setMessage(response.ok ? "" : result.message || t("couldNotLoad"));
  }

  // The initial request intentionally runs once; language changes only affect labels.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  const visible = useMemo(() => posts.filter((post) => (filter === "all" || post.status === filter) && `${post.title} ${post.slug}`.toLowerCase().includes(query.toLowerCase())), [posts, query, filter]);
  const pageCount = Math.max(1, Math.ceil(visible.length / perPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedPosts = visible.slice((currentPage - 1) * perPage, currentPage * perPage);
  const published = posts.filter((post) => post.status === "published").length;

  async function remove(post: Post) {
    if (!confirm(t("deleteConfirm", { title: post.title }))) return;
    const response = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    if (response.ok) setPosts((items) => items.filter((item) => item.id !== post.id));
    else alert(t("deleteFailed"));
  }
  async function copy(post: Post) {
    await navigator.clipboard.writeText(`${window.location.origin}/story/${post.slug}`);
    setMessage(t("linkCopied")); window.setTimeout(() => setMessage(""), 1800);
  }
  async function importStories() {
    setMessage(t("importing"));
    const response = await fetch("/api/admin/import-markdown", { method: "POST" });
    const result = await response.json() as { imported?: number; message?: string };
    if (!response.ok) return setMessage(result.message || t("importFailed"));
    setMessage(t("imported", { count: result.imported || 0 }));
    await load();
  }

  return <main className="admin-main">
    <div className="admin-page-title"><div><span>{t("blog")}</span><h1>{t("managePosts")}</h1><p>{t("managePostsDescription")}</p></div><div className="admin-title-actions"><button type="button" onClick={importStories}><AdminIcon name="upload" />{t("importStories")}</button><Link className="admin-primary" href="/admin/posts/new"><AdminIcon name="plus" />{t("addPost")}</Link></div></div>
    <section className="admin-stats"><article><span>{t("totalPosts")}</span><b>{posts.length}</b></article><article><span>{t("published")}</span><b>{published}</b></article><article><span>{t("drafts")}</span><b>{posts.length - published}</b></article></section>
    <section className="admin-panel"><div className="admin-filters"><input type="search" placeholder={t("searchPlaceholder")} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /><select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option value="all">{t("allStatuses")}</option><option value="published">{t("published")}</option><option value="draft">{t("draft")}</option></select><label className="admin-page-size"><span>{t("show")}</span><select value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }}>{[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}</select><span>{t("perPage")}</span></label><span>{visible.length} {t("posts").toLowerCase()}</span></div>{message && <div className="admin-notice" role="status">{message}</div>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t("story")}</th><th>{t("author")}</th><th>{t("views")}</th><th>{t("category")}</th><th>{t("updated")}</th><th>{t("status")}</th><th>{t("actions")}</th></tr></thead><tbody>{paginatedPosts.map((post) => <tr key={post.id}><td><div className="admin-post-title"><img src={post.imageUrl} alt="" /><div><b>{post.title}</b><small>/{post.slug}</small></div></div></td><td>{post.author}</td><td>{post.views.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}</td><td>{post.category}</td><td>{new Date(post.updatedAt).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US")}</td><td><span className={`status status--${post.status}`}>{t(post.status)}</span></td><td><div className="admin-actions">{post.status === "published" && <Link title={t("view")} href={`/story/${post.slug}`} target="_blank"><AdminIcon name="eye" /></Link>}<button title={t("copyLink")} onClick={() => copy(post)}><AdminIcon name="copy" /></button><Link title={t("edit")} href={`/admin/posts/${post.id}`}><AdminIcon name="edit" /></Link><button className="danger" title={t("delete")} onClick={() => remove(post)}><AdminIcon name="trash" /></button></div></td></tr>)}</tbody></table>{!message && !visible.length && <div className="admin-empty">{t("noPosts")}</div>}</div>{visible.length > 0 && <nav className="admin-pagination" aria-label={t("pagination")}><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>{t("previous")}</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={number === currentPage ? "active" : ""} aria-current={number === currentPage ? "page" : undefined} onClick={() => setPage(number)}>{number}</button>)}<button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>{t("next")}</button></nav>}</section>
  </main>;
}
