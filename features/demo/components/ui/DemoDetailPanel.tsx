"use client";

import type { ReactNode, Ref } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function DemoDetailPanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "md",
  headerAction,
  bodyRef,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: "md" | "lg";
  headerAction?: ReactNode;
  bodyRef?: Ref<HTMLDivElement>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Đóng panel"
      />
      <div
        className={cn(
          "relative flex h-full w-full flex-col bg-white shadow-xl",
          width === "lg" ? "max-w-xl" : "max-w-[420px]",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {headerAction}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-slate-100"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
