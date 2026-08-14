"use client";

import type { ReactNode, Ref } from "react";
import { DEMO_REVIEW_KPI } from "../../constants/demoStores";
import { DemoCard } from "../ui/DemoCard";

export function ReviewKpiProgress({
  onDetailClick,
  extraAction,
  contentRef,
}: {
  onDetailClick?: () => void;
  extraAction?: ReactNode;
  contentRef?: Ref<HTMLDivElement>;
}) {
  const pct = Math.round((DEMO_REVIEW_KPI.current / DEMO_REVIEW_KPI.target) * 100);

  return (
    <DemoCard
      title="Review Tracker — KPI 6.500 đánh giá"
      contentRef={contentRef}
      action={
        onDetailClick || extraAction ? (
          <div className="flex items-center gap-2">
            {onDetailClick ? (
              <button
                type="button"
                onClick={onDetailClick}
                className="text-xs font-medium text-[#1a5c3a] hover:underline"
              >
                Xem theo khu vực
              </button>
            ) : null}
            {extraAction}
          </div>
        ) : undefined
      }
    >
      <button
        type="button"
        onClick={onDetailClick}
        className={onDetailClick ? "w-full space-y-3 text-left" : "space-y-3"}
      >
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tiến độ hiện tại</span>
          <span className="font-semibold text-slate-900">
            {DEMO_REVIEW_KPI.current.toLocaleString("vi-VN")} /{" "}
            {DEMO_REVIEW_KPI.target.toLocaleString("vi-VN")}
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#1a5c3a] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">{pct}% hoàn thành mục tiêu</p>
        {onDetailClick && (
          <p className="text-[11px] text-slate-400">Nhấn để xem breakdown theo khu vực và top 1★</p>
        )}
      </button>
    </DemoCard>
  );
}
