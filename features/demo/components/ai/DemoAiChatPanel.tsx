"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send, X } from "lucide-react";
import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const SUGGESTIONS: Record<DemoRole, string[]> = {
  admin: [
    "Cửa hàng nào đang Suspended?",
    "Tóm tắt trạng thái GBP 5 cửa hàng",
    "Chi phí hạ tầng Vercel so với AWS?",
  ],
  manager: [
    "Cửa hàng nào cần thu thập bằng chứng?",
    "Đánh giá 1 sao còn bao nhiêu?",
    "N.A.P cửa hàng Tân Trào đang thế nào?",
  ],
  store_manager: [
    "Cửa hàng tôi còn thiếu bằng chứng gì?",
    "Trạng thái hồ sơ Google của tôi?",
    "Số điện thoại và giờ mở cửa cửa hàng của tôi",
  ],
};

async function readSse(
  res: Response,
  onToken: (token: string) => void,
): Promise<{ error?: string }> {
  const reader = res.body?.getReader();
  if (!reader) return { error: "Không nhận được stream" };
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as { token?: string; error?: string };
        if (json.error) return { error: json.error };
        if (json.token) onToken(json.token);
      } catch {
        /* skip */
      }
    }
  }
  return {};
}

export function DemoAiChatPanel({
  role,
  onClose,
  anchorY,
}: {
  role: DemoRole;
  onClose: () => void;
  anchorY: number;
}) {
  const meta = DEMO_ROLE_META[role];
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || sending) return;
    setInput("");
    setSending(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string; code?: string };
        const extra =
          json.code === "NOT_CONFIGURED" && role === "admin"
            ? " Vào trang Cấu hình AI để nhập key."
            : "";
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: (json.error ?? "Không gửi được câu hỏi.") + extra,
            error: true,
          };
          return next;
        });
        return;
      }

      const { error } = await readSse(res, (token) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + token };
          return next;
        });
      });

      if (error) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = {
            role: "assistant",
            content: last.content || error,
            error: true,
          };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Mất kết nối tới máy chủ.",
          error: true,
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  const panelH = typeof window === "undefined" ? 520 : Math.min(520, window.innerHeight - 32);
  let top = anchorY + 28 - panelH / 2;
  if (typeof window !== "undefined") {
    top = Math.max(16, Math.min(top, window.innerHeight - panelH - 16));
  }

  return (
    <div
      className="fixed z-50 flex w-[min(380px,calc(100vw-6rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      style={{ top, right: 92, height: panelH }}
    >
      <header className="flex items-start justify-between gap-2 border-b border-slate-100 bg-[#1a5c3a] px-4 py-3 text-white">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4" />
            Chatbot GBP · {meta.label}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-white/80">{meta.scope}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-white/10" aria-label="Đóng">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Gợi ý câu hỏi cho {meta.label}:</p>
            {SUGGESTIONS[role].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void send(q)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100"
              >
                {q}
              </button>
            ))}
            {role === "admin" && (
              <Link href="/demo/admin/ai" className="block text-xs text-[#1a5c3a] underline">
                Cấu hình API key & đồng bộ database
              </Link>
            )}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-xl bg-[#1a5c3a] px-3 py-2 text-sm text-white"
                : m.error
                  ? "mr-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  : "mr-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 whitespace-pre-wrap"
            }
          >
            {m.content || (sending && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-slate-100 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi về cửa hàng…"
          maxLength={1500}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1a5c3a]"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a5c3a] text-white disabled:opacity-40"
          aria-label="Gửi"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
