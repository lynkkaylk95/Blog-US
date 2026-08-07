"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { LanguageSwitcher, useAdminLocale } from "../components/AdminLocale";

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useAdminLocale();
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false); const [complete, setComplete] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const data = new FormData(event.currentTarget); const password = String(data.get("password") || ""); const confirmation = String(data.get("confirmation") || "");
    if (password !== confirmation) { setMessage(t("passwordMismatch")); setLoading(false); return; }
    const response = await fetch("/api/admin/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, password }) });
    const result = await response.json() as { message?: string };
    if (response.ok) { setComplete(true); setMessage(t("resetSuccess")); } else setMessage(result.message || t("resetFailed"));
    setLoading(false);
  }
  return <form className="admin-login-card" onSubmit={submit}><div className="admin-login-head"><div className="admin-logo">P</div><LanguageSwitcher /></div><h1>{t("resetTitle")}</h1><p>{t("resetDescription")}</p>{complete ? <Link className="admin-login-link" href="/admin/login">{t("continueSignIn")}</Link> : <><label htmlFor="new-password">{t("newPassword")}</label><input id="new-password" name="password" type="password" minLength={8} autoComplete="new-password" required autoFocus /><label htmlFor="confirm-password">{t("confirmPassword")}</label><input id="confirm-password" name="confirmation" type="password" minLength={8} autoComplete="new-password" required /><button disabled={loading || !token}>{loading ? t("updating") : t("updatePassword")}</button></>}{message && <div className="admin-message" role="status">{message}</div>}</form>;
}
