"use client";

import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import type { DemoRole } from "../../constants/demoRoles";
import { DemoAiChatPanel } from "./DemoAiChatPanel";

const SIZE = 56;
const RIGHT = 24;
const MARGIN = 16;
const STORAGE_KEY = "vinamilk-ai-bubble-y";

function clampY(y: number) {
  if (typeof window === "undefined") return y;
  const max = window.innerHeight - SIZE - MARGIN;
  return Math.min(max, Math.max(MARGIN, y));
}

export function DemoAiChatBubble({ role }: { role: DemoRole }) {
  const [open, setOpen] = useState(false);
  const [y, setY] = useState(MARGIN);
  const [ready, setReady] = useState(false);
  const drag = useRef<{ startY: number; orig: number; moved: boolean } | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    const fallback = window.innerHeight - SIZE - 24;
    setY(clampY(Number.isFinite(saved) && saved > 0 ? saved : fallback));
    setReady(true);
    const onResize = () => setY((prev) => clampY(prev));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, orig: y, moved: false };
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dy) > 5) drag.current.moved = true;
    if (drag.current.moved) {
      e.preventDefault();
      setY(clampY(drag.current.orig + dy));
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const wasClick = !drag.current.moved;
    const finalY = drag.current.moved
      ? clampY(drag.current.orig + (e.clientY - drag.current.startY))
      : y;
    setY(finalY);
    localStorage.setItem(STORAGE_KEY, String(finalY));
    drag.current = null;
    if (wasClick) setOpen((v) => !v);
  }

  if (!ready) return null;

  return (
    <>
      {open && <DemoAiChatPanel role={role} onClose={() => setOpen(false)} anchorY={y} />}
      <button
        type="button"
        aria-label={open ? "Đóng chatbot AI" : "Mở chatbot AI"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="fixed z-50 flex cursor-grab items-center justify-center rounded-full bg-[#1a5c3a] text-white shadow-lg ring-4 ring-white/80 hover:bg-[#247a32] active:cursor-grabbing"
        style={{ top: y, right: RIGHT, width: SIZE, height: SIZE, touchAction: "none" }}
      >
        <Bot className="h-6 w-6 pointer-events-none" />
      </button>
    </>
  );
}
