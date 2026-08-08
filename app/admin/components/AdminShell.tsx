"use client";
import Link from "next/link";
import { LanguageSwitcher, useAdminLocale } from "./AdminLocale";
import { LogoutButton } from "./LogoutButton";
import { AdminIcon } from "./AdminIcon";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useAdminLocale();
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span>P</span><div><b>Porchlight</b><small>ADMIN</small></div></Link><nav><Link href="/admin"><AdminIcon name="dashboard" />{t("overview")}</Link><Link href="/admin"><AdminIcon name="posts" />{t("posts")}</Link><Link href="/admin/posts/new"><AdminIcon name="plus" />{t("addStory")}</Link><Link href="/admin/series/new"><AdminIcon name="list" />{t("addSeries")}</Link><Link href="/admin/users"><AdminIcon name="users" />{t("users")}</Link><Link href="/"><AdminIcon name="external" />{t("viewWebsite")}</Link></nav><div className="admin-sidebar-bottom"><Link href="/admin/settings"><AdminIcon name="settings" />{t("settings")}</Link><LogoutButton /></div></aside><div className="admin-workspace"><header className="admin-topbar"><span>{t("contentManagement")}</span><div className="admin-topbar-actions"><LanguageSwitcher /><Link href="/" target="_blank">{t("openSite")} <AdminIcon name="external" size={16} /></Link></div></header>{children}</div></div>;
}
