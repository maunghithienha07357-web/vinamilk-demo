import {
  STORE_EVIDENCE_ITEMS,
  STORE_GBP_TIMELINE,
  STORE_MANAGER_OVERVIEW,
} from "../../constants/demoPanelData";
import { DemoCard } from "../ui/DemoCard";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoActionButton } from "../ui/DemoActionButton";
import { cn } from "@/utils/cn";

function stepBadge(status: "done" | "current" | "pending") {
  if (status === "done") return { variant: "success" as const, label: "Xong" };
  if (status === "current") return { variant: "warning" as const, label: "Đang làm" };
  return { variant: "default" as const, label: "Chưa tới" };
}

export function StoreGbpStatusTimeline() {
  const s = STORE_MANAGER_OVERVIEW;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-slate-600">
        Timeline hồ sơ Google Business Profile của {s.name}. Store Manager theo dõi tiến độ; chỉ
        Manager mới nộp Claim / Appeal / Verify lên Google.
      </p>

      <DemoCallout variant="warning">
        Đang ở bước Nộp bằng chứng — thiếu video mặt tiền. Hạn {s.deadline}.
      </DemoCallout>

      <DemoCard title="Timeline GBP">
        <ol className="space-y-0">
          {STORE_GBP_TIMELINE.map((step, idx) => {
            const badge = stepBadge(step.status);
            const last = idx === STORE_GBP_TIMELINE.length - 1;
            return (
              <li key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-1 h-3 w-3 rounded-full",
                      step.status === "done" && "bg-emerald-500",
                      step.status === "current" && "bg-amber-500",
                      step.status === "pending" && "bg-slate-300",
                    )}
                  />
                  {!last && <span className="w-px flex-1 bg-slate-200" />}
                </div>
                <div className={cn("pb-6", last && "pb-0")}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                    <DemoBadge variant={badge.variant}>{badge.label}</DemoBadge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{step.date}</p>
                  <p className="mt-1 text-sm text-slate-600">{step.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </DemoCard>

      <DemoCard title="Checklist bằng chứng">
        <ul className="space-y-2 text-sm">
          {STORE_EVIDENCE_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-slate-700">{item.label}</span>
              <DemoBadge variant={item.status === "submitted" ? "success" : "warning"}>
                {item.status === "submitted" ? "Đã nộp" : "Thiếu"}
              </DemoBadge>
            </li>
          ))}
        </ul>
        <DemoActionButton href="/demo/store-manager/evidence" variant="primary" className="mt-5 w-full">
          Tải phần còn thiếu
        </DemoActionButton>
      </DemoCard>
    </div>
  );
}
