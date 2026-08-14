"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, FileImage, FileSpreadsheet, FileText } from "lucide-react";
import { exportSurveyExcel } from "@/features/survey/utils/exportSurveyExcel";
import { exportElementAsPng } from "@/features/analytics/utils/exportElementAsPng";
import { exportElementAsPdf } from "@/features/analytics/utils/exportElementAsPdf";

type ExportKind = "excel" | "image" | "pdf";

type Props = {
  title: string;
  subtitle?: string;
  columns: Array<{ key: string; header: string }>;
  rows: Array<Record<string, string>>;
  captureRef: React.RefObject<HTMLElement | null>;
  fileBase: string;
  disabled?: boolean;
  iconOnly?: boolean | "mobile";
};

export function SurveyExportMenu({
  title,
  subtitle,
  columns,
  rows,
  captureRef,
  fileBase,
  disabled = false,
  iconOnly = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const runExport = useCallback(
    async (kind: ExportKind) => {
      if (disabled || exporting) return;
      setExporting(true);
      try {
        if (kind === "excel") {
          await exportSurveyExcel({ title, subtitle, columns, rows, fileBase });
        } else if (kind === "image") {
          const el = captureRef.current;
          if (!el) return;
          await exportElementAsPng(el, fileBase);
        } else {
          const el = captureRef.current;
          if (!el) return;
          await exportElementAsPdf(el, fileBase);
        }
        setOpen(false);
      } finally {
        setExporting(false);
      }
    },
    [captureRef, columns, disabled, exporting, fileBase, rows, subtitle, title],
  );

  const showLabel = iconOnly !== true && iconOnly !== "mobile";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={disabled || exporting}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
      >
        <FileSpreadsheet size={16} />
        {showLabel ? <span>Xuất</span> : null}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {(["excel", "image", "pdf"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={exporting}
              onClick={() => void runExport(kind)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {kind === "excel" ? <FileSpreadsheet size={16} /> : null}
              {kind === "image" ? <FileImage size={16} /> : null}
              {kind === "pdf" ? <FileText size={16} /> : null}
              {kind === "excel" ? "Excel" : kind === "image" ? "Ảnh PNG" : "PDF"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
