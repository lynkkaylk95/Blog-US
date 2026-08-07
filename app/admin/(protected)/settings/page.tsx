"use client";
import { LanguageSwitcher, useAdminLocale } from "../../components/AdminLocale";

export default function SettingsPage() {
  const { t } = useAdminLocale();
  return <main className="admin-main"><div className="admin-page-title"><div><span>{t("system")}</span><h1>{t("settings")}</h1><p>{t("settingsDescription")}</p></div></div><section className="admin-panel settings-list"><h2>{t("requiredConfiguration")}</h2><p><b>{t("d1Binding")}:</b> DB</p><p><b>{t("adminPassword")}:</b> ADMIN_PASSWORD</p><p><b>{t("sessionSecret")}:</b> ADMIN_SESSION_SECRET</p><p><b>{t("canonicalWebsite")}:</b> SITE_URL</p><p><b>{t("language")}:</b> <LanguageSwitcher /></p><small>{t("secretNote")}</small></section></main>;
}
