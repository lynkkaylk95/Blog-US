"use client";
import { useAdminLocale } from "./AdminLocale";
import { AdminIcon } from "./AdminIcon";
export function LogoutButton() { const { t } = useAdminLocale(); return <button className="admin-nav-button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }}><AdminIcon name="logout" />{t("signOut")}</button>; }
