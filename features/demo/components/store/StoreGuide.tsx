"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { STORE_GUIDE_FAQ, STORE_GUIDE_STEPS } from "../../constants/demoPanelData";
import { DemoCard } from "../ui/DemoCard";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoActionButton } from "../ui/DemoActionButton";
import { cn } from "@/utils/cn";

export function StoreGuide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-slate-600">
        Hướng dẫn Store Manager nộp hồ sơ xác thực Google. Làm đúng checklist để Manager duyệt và
        nộp lên Google trong hạn.
      </p>

      <DemoCallout variant="info">
        Video/ảnh lưu Cloudflare R2; metadata (file_path) ghi bảng evidence. Bản demo không ghi file.
      </DemoCallout>

      <DemoCard title="4 bước nộp hồ sơ">
        <ol className="space-y-4">
          {STORE_GUIDE_STEPS.map((s) => (
            <li key={s.step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a5c3a] text-xs font-bold text-white">
                {s.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </DemoCard>

      <DemoCard title="Mẫu video mặt tiền">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-sm text-white/90">
              Placeholder video hướng dẫn
              <br />
              <span className="text-xs text-white/60">
                Quay 15–30 giây: đường phố → bảng hiệu → cửa vào
              </span>
            </p>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Câu hỏi thường gặp">
        <ul className="divide-y divide-slate-100">
          {STORE_GUIDE_FAQ.map((item, idx) => {
            const expanded = open === idx;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : idx)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="text-sm font-medium text-slate-800">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
                {expanded && <p className="pb-3 text-sm text-slate-600">{item.a}</p>}
              </li>
            );
          })}
        </ul>
      </DemoCard>

      <DemoActionButton href="/demo/store-manager/evidence" variant="primary" className="w-full">
        Bắt đầu tải bằng chứng
      </DemoActionButton>
    </div>
  );
}
