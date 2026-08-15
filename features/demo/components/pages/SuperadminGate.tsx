"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, LogOut } from "lucide-react";
import { AiConfigPage } from "./AiConfigPage";

export function SuperadminGate() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/superadmin/session");
        const json = (await res.json()) as { ok?: boolean };
        setAuthed(Boolean(json.ok));
      } catch {
        setAuthed(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(json.error ?? "Đăng nhập thất bại");
        return;
      }
      setPassword("");
      setAuthed(true);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/superadmin/logout", { method: "POST" });
    setAuthed(false);
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={(e) => void login(e)}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">Superadmin</p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">Cấu hình AI</h1>
          <p className="mt-2 text-sm text-slate-500">Nhập mật khẩu để quản lý API key và đồng bộ dữ liệu chatbot.</p>
          <label className="mt-5 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Mật khẩu</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1a5c3a] focus:ring-1 focus:ring-[#1a5c3a]"
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password.trim()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a5c3a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#247a32] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Vào trang cấu hình
          </button>
          <Link href="/demo" className="mt-4 block text-center text-xs text-slate-500 underline">
            Về trang demo
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">Superadmin</p>
          <h1 className="text-xl font-semibold text-slate-900">Cấu hình AI</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/demo/admin" className="text-sm text-slate-600 underline">
            Về Admin
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>
      <AiConfigPage />
    </div>
  );
}
