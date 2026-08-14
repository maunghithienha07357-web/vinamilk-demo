"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Database, KeyRound, Loader2, RefreshCw, Unplug } from "lucide-react";
import { GROQ_MODELS } from "@/lib/ai/groq";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoCard } from "../ui/DemoCard";
import { PermissionMatrixTable } from "../roles/PermissionMatrixTable";

type ConfigResponse = {
  provider: string;
  model: string;
  hasKey: boolean;
  keyHint: string | null;
  maskedKey: string | null;
  temperature: number;
  updatedAt: string | null;
  snapshot: {
    storeCount: number;
    syncedAt: string | null;
    stores: {
      id: string;
      name: string;
      gbp_state: string;
      kanban_stage: string;
      assigned_to_store_manager: boolean;
    }[];
  };
  recentLogs: {
    role: string;
    question: string;
    model: string | null;
    latencyMs: number | null;
    createdAt: string;
  }[];
  error?: string;
};

const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const primary = "bg-[#1a5c3a] text-white hover:bg-[#247a32]";
const outline = "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

function formatWhen(iso: string | null | undefined) {
  if (!iso) return "Chưa có";
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

export function AiConfigPage() {
  const [data, setData] = useState<ConfigResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(GROQ_MODELS[0].id);
  const [busy, setBusy] = useState<"save" | "test" | "sync" | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/ai/config");
    const json = (await res.json()) as ConfigResponse;
    if (!res.ok) {
      setLoadError(json.error ?? "Không tải được cấu hình");
      return;
    }
    setLoadError(null);
    setData(json);
    setModel(json.model || GROQ_MODELS[0].id);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save() {
    setBusy("save");
    setNotice(null);
    try {
      const res = await fetch("/api/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        }),
      });
      const json = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setNotice({ ok: false, text: json.error ?? "Lưu thất bại" });
        return;
      }
      setApiKey("");
      setNotice({ ok: true, text: "Đã lưu cấu hình Groq." });
      await refresh();
    } catch {
      setNotice({ ok: false, text: "Không kết nối được máy chủ." });
    } finally {
      setBusy(null);
    }
  }

  async function test() {
    setBusy("test");
    setNotice(null);
    try {
      const res = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      setNotice({ ok: Boolean(json.ok), text: json.message ?? (res.ok ? "OK" : "Thất bại") });
    } catch {
      setNotice({ ok: false, text: "Không kết nối được máy chủ." });
    } finally {
      setBusy(null);
    }
  }

  async function sync() {
    setBusy("sync");
    setNotice(null);
    try {
      const res = await fetch("/api/ai/sync", { method: "POST" });
      const json = (await res.json()) as { error?: string; storeCount?: number };
      if (!res.ok) {
        setNotice({ ok: false, text: json.error ?? "Đồng bộ thất bại" });
        return;
      }
      setNotice({
        ok: true,
        text: `Đã đồng bộ ${json.storeCount ?? 0} cửa hàng từ vinamilk_demo_stores.`,
      });
      await refresh();
    } catch {
      setNotice({ ok: false, text: "Không kết nối được máy chủ." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Cấu hình Groq cho chatbot trên Admin / Manager / Store Manager. API key được mã hoá AES-256-GCM
        trong Supabase — client không bao giờ nhận key thô. Demo chưa có đăng nhập: role gửi từ giao
        diện đang mở; phân quyền vẫn cắt dữ liệu ở server trước khi gửi cho model.
      </p>

      {loadError && (
        <DemoCallout variant="warning" title="Không tải được cấu hình">
          {loadError}
        </DemoCallout>
      )}

      {notice && (
        <DemoCallout variant={notice.ok ? "success" : "warning"} title={notice.ok ? "Thành công" : "Lỗi"}>
          {notice.text}
        </DemoCallout>
      )}

      <DemoCard
        title="API key Groq"
        action={
          data?.hasKey ? (
            <DemoBadge variant="success">Đã cấu hình</DemoBadge>
          ) : (
            <DemoBadge variant="warning">Chưa có key</DemoBadge>
          )
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <KeyRound className="h-4 w-4" />
            {data?.hasKey ? (
              <span>
                Key hiện tại: <span className="font-mono text-slate-800">{data.maskedKey}</span>
                <span className="ml-2 text-xs text-slate-500">
                  Cập nhật: {formatWhen(data.updatedAt)}
                </span>
              </span>
            ) : (
              <span>Chưa lưu key — chatbot sẽ báo chưa sẵn sàng.</span>
            )}
          </div>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              {data?.hasKey ? "Thay key mới (để trống nếu giữ key cũ)" : "Dán API key"}
            </span>
            <input
              type="password"
              autoComplete="off"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-[#1a5c3a] focus:ring-1 focus:ring-[#1a5c3a]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`${btn} ${primary}`} onClick={() => void save()} disabled={busy !== null}>
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Lưu
            </button>
            <button type="button" className={`${btn} ${outline}`} onClick={() => void test()} disabled={busy !== null}>
              {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unplug className="h-4 w-4" />}
              Kiểm tra kết nối
            </button>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Hướng dẫn lấy API key Groq">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Mở{" "}
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#1a5c3a] underline"
            >
              console.groq.com
            </a>{" "}
            — đăng nhập Google hoặc GitHub. Free tier không cần thẻ.
          </li>
          <li>
            Vào menu <strong>API Keys</strong> → <strong>Create API Key</strong>. Đặt tên (ví dụ{" "}
            <code>vinamilk-demo</code>).
          </li>
          <li>
            Copy chuỗi bắt đầu bằng <code className="rounded bg-slate-100 px-1">gsk_</code>. Groq chỉ hiện
            key một lần.
          </li>
          <li>Dán vào ô phía trên → Lưu → Kiểm tra kết nối. Model mặc định: Llama 3.3 70B Versatile.</li>
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          Docs model:{" "}
          <a href="https://console.groq.com/docs/models" target="_blank" rel="noreferrer" className="underline">
            console.groq.com/docs/models
          </a>
        </p>
      </DemoCard>

      <DemoCard title="Chọn model">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Model production Groq</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1a5c3a]"
          >
            {GROQ_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} — {m.speed} — {m.note}
              </option>
            ))}
          </select>
        </label>
        <ul className="mt-3 space-y-1 text-xs text-slate-500">
          {GROQ_MODELS.map((m) => (
            <li key={m.id}>
              <code className="rounded bg-slate-100 px-1">{m.id}</code> · {m.speed} · context 131k · {m.note}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${btn} ${primary} mt-4`}
          onClick={() => void save()}
          disabled={busy !== null}
        >
          {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Lưu model
        </button>
      </DemoCard>

      <DemoCard
        title="Đồng bộ database Supabase"
        action={
          <button type="button" className={`${btn} ${primary}`} onClick={() => void sync()} disabled={busy !== null}>
            {busy === "sync" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Đồng bộ ngay
          </button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Database className="h-4 w-4" />
          <span>
            Bảng nguồn: <code className="rounded bg-slate-100 px-1">vinamilk_demo_stores</code>
          </span>
          <DemoBadge variant={data?.snapshot.storeCount ? "success" : "warning"}>
            {data?.snapshot.storeCount ?? 0} cửa hàng
          </DemoBadge>
          <span className="text-xs text-slate-500">Lần cuối: {formatWhen(data?.snapshot.syncedAt)}</span>
        </div>
        <p className="mb-3 text-sm text-slate-600">
          Snapshot lưu vào <code className="rounded bg-slate-100 px-1">vinamilk_ai_snapshot</code> để chatbot đọc.
          Phân quyền cắt cột / cắt cửa hàng ở server theo role, không gửi nguyên bảng cho model.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Cửa hàng</th>
                <th className="px-3 py-2">GBP</th>
                <th className="px-3 py-2">Kanban</th>
                <th className="px-3 py-2">Store Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.snapshot.stores ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-slate-500">
                    Chưa đồng bộ — bấm Đồng bộ ngay.
                  </td>
                </tr>
              ) : (
                data!.snapshot.stores.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2 font-medium text-slate-800">{s.name}</td>
                    <td className="px-3 py-2">{s.gbp_state}</td>
                    <td className="px-3 py-2">{s.kanban_stage}</td>
                    <td className="px-3 py-2">
                      {s.assigned_to_store_manager ? (
                        <DemoBadge variant="success">Được gán</DemoBadge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DemoCard>

      <DemoCard title="Phân quyền dữ liệu chatbot theo role">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Cửa hàng</th>
                <th className="px-3 py-2">Được biết</th>
                <th className="px-3 py-2">Bị cắt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 font-medium">Admin</td>
                <td className="px-3 py-2">Cả 5</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  Đủ cột (kể cả google_place_id, lat/lng), schema Supabase, chi phí, user, nhật ký đồng bộ
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">Không hạn chế trên demo</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">Manager</td>
                <td className="px-3 py-2">Cả 5</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  N.A.P, GBP, đánh giá, bằng chứng, thống kê tổng
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  Hạ tầng, chi phí, user, google_place_id
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">Store Manager</td>
                <td className="px-3 py-2">1 (Bùi Bằng Đoàn)</td>
                <td className="px-3 py-2 text-xs text-slate-600">Cửa hàng được gán + đánh giá của cửa hàng đó</td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  4 cửa hàng còn lại, số liệu tổng, Optimizer, hạ tầng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>

      <PermissionMatrixTable />

      {data?.recentLogs?.length ? (
        <DemoCard title="Log chat gần nhất">
          <ul className="space-y-2 text-sm">
            {data.recentLogs.map((log, i) => (
              <li key={`${log.createdAt}-${i}`} className="rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <DemoBadge>{log.role}</DemoBadge>
                  <span>{formatWhen(log.createdAt)}</span>
                  {log.model && <code>{log.model}</code>}
                  {log.latencyMs != null && <span>{log.latencyMs} ms</span>}
                </div>
                <p className="mt-1 text-slate-800">{log.question}</p>
              </li>
            ))}
          </ul>
        </DemoCard>
      ) : null}
    </div>
  );
}
