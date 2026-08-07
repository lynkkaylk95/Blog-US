"use client";
import { FormEvent, useState } from "react";
import { LanguageSwitcher, useAdminLocale } from "../components/AdminLocale";

export function LoginForm() {
  const { t } = useAdminLocale();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json() as { message?: string };
    if (response.ok) window.location.href = "/admin";
    else { setMessage(result.message || t("loginFailed")); setLoading(false); }
  }

  async function forgotPassword() {
    setResetting(true); setMessage("");
    const response = await fetch("/api/admin/forgot-password", { method: "POST" });
    const result = await response.json() as { message?: string };
    setMessage(response.ok ? t("checkEmail") : result.message || t("resetFailed")); setResetting(false);
  }

  return <form className="admin-login-card" onSubmit={submit}><div className="admin-login-head"><div className="admin-logo">P</div><LanguageSwitcher /></div><h1>{t("signInTitle")}</h1><p>{t("signInDescription")}</p><label htmlFor="admin-password">{t("adminPassword")}</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus /><button disabled={loading}>{loading ? t("signingIn") : t("signIn")}</button><button className="admin-link-button" type="button" disabled={resetting} onClick={forgotPassword}>{resetting ? t("sendingReset") : t("forgotPassword")}</button>{message && <div className="admin-message" role="status">{message}</div>}</form>;
}
