"use client";

import { useState } from "react";
import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import type { DemoStore } from "../../constants/demoStores";
import { DEMO_STORES } from "../../constants/demoStores";
import { VerificationKanban } from "../verification/VerificationKanban";
import { VerificationList } from "../verification/VerificationList";
import { VerificationCards } from "../verification/VerificationCards";
import { EvidenceDrawer } from "../verification/EvidenceDrawer";

type ViewMode = "kanban" | "list" | "card";

export function VerificationPage({ role }: { role: Extract<DemoRole, "admin" | "manager"> }) {
  const [view, setView] = useState<ViewMode>("kanban");
  const [selectedStore, setSelectedStore] = useState<DemoStore | null>(null);
  const submitHref = `${DEMO_ROLE_META[role].basePath}/sync-log`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Module 2 — Evidence & Verification Workspace: Kanban + List + Card. {DEMO_ROLE_META[role].label}{" "}
        được duyệt bằng chứng và nộp lên Google. Video lưu Cloudflare R2, metadata trên Supabase.
      </p>

      <div className="flex gap-2">
        {(
          [
            ["kanban", "Kanban"],
            ["list", "List"],
            ["card", "Card"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              view === key ? "bg-[#1a5c3a] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "kanban" && <VerificationKanban onSelectStore={setSelectedStore} />}
      {view === "list" && <VerificationList stores={DEMO_STORES} onSelect={setSelectedStore} />}
      {view === "card" && <VerificationCards stores={DEMO_STORES} onSelect={setSelectedStore} />}

      <EvidenceDrawer
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        submitHref={submitHref}
      />
    </div>
  );
}
