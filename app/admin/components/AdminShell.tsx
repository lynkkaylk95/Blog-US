"use client";
import Link from "next/link";
import { LanguageSwitcher, useAdminLocale } from "./AdminLocale";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useAdminLocale();
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span>P</span><div><b>Porchlight</b><small>ADMIN</small></div></Link><nav><Link href="/admin">▦ {t("overview")}</Link><Link href="/admin">▤ {t("posts")}</Link><Link href="/admin/posts/new">＋ {t("addStory")}</Link><Link href="/">↗ {t("viewWebsite")}</Link></nav><div className="admin-sidebar-bottom"><Link href="/admin/settings">⚙ {t("settings")}</Link><LogoutButton /></div></aside><div className="admin-workspace"><header className="admin-topbar"><span>{t("contentManagement")}</span><div className="admin-topbar-actions"><LanguageSwitcher /><Link href="/" target="_blank">{t("openSite")} ↗</Link></div></header>{children}</div></div>;
}
