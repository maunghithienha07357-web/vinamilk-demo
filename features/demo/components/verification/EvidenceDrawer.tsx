"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { DemoStore } from "../../constants/demoStores";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoCard } from "../ui/DemoCard";

const CHECKLIST_ITEMS = [
  { id: "license", label: "Giấy phép kinh doanh" },
  { id: "signage", label: "Ảnh bảng hiệu" },
  { id: "video", label: "Video mặt tiền" },
  { id: "interior", label: "Ảnh nội thất" },
];

export function EvidenceDrawer({
  store,
  onClose,
  submitHref,
}: {
  store: DemoStore | null;
  onClose: () => void;
  submitHref: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    license: true,
    signage: true,
    video: false,
    interior: false,
  });

  if (!store) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Đóng"
      />
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">{store.name}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <DemoCard title="In-app Video Player">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-sm text-white/90 px-4">
                  Video phát từ Cloudflare R2 qua signed URL
                  <br />
                  <span className="text-xs text-white/60">evidence/{store.id}/storefront.mp4</span>
                </p>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Evidence Checklist">
            <ul className="space-y-3">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked[item.id] ?? false}
                    onChange={(e) =>
                      setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </DemoCard>

          <DemoActionButton href={submitHref} variant="primary" className="w-full">
            Nộp lên Google
          </DemoActionButton>
        </div>
      </div>
    </div>
  );
}
