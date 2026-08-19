"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChevronRight, FileText, ImagePlus, Upload, Video, X } from "lucide-react";
import {
  STORE_EVIDENCE_GOOGLE_ITEMS,
  STORE_EVIDENCE_INTERNAL_ITEMS,
  STORE_EVIDENCE_PROCESS_STEPS,
  STORE_MANAGER_OVERVIEW,
  type EvidenceUploadItem,
} from "../../constants/demoPanelData";
import { DemoActionButton } from "../ui/DemoActionButton";
import { cn } from "@/utils/cn";

type LocalFile = { name: string; url: string; type: string };
type EvidenceTab = "google" | "internal";

export function StoreEvidenceUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingIdRef = useRef<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const [localFiles, setLocalFiles] = useState<Record<string, LocalFile>>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [tab, setTab] = useState<EvidenceTab>("google");

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!popupOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPopupOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [popupOpen]);

  function openPopup(nextTab: EvidenceTab = "google") {
    setTab(nextTab);
    setPopupOpen(true);
  }

  function openPicker(item: EvidenceUploadItem) {
    const input = inputRef.current;
    if (!input) return;
    pendingIdRef.current = item.id;
    input.accept = item.accept;
    input.value = "";
    input.click();
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const id = pendingIdRef.current;
    if (!file || !id) return;

    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    const previous = localFiles[id];
    if (previous) {
      URL.revokeObjectURL(previous.url);
      objectUrlsRef.current = objectUrlsRef.current.filter((item) => item !== previous.url);
    }
    setLocalFiles((prev) => ({ ...prev, [id]: { name: file.name, url, type: file.type } }));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <input ref={inputRef} type="file" className="hidden" onChange={onFileChange} />

      <p className="text-sm text-slate-500">
        Không để bằng chứng nằm rải rác trong Zalo, Drive hay email. Chuẩn hóa và kiểm định trước,
        nộp sau.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <CategoryCard
          letter="A"
          title="Minh chứng theo yêu cầu của Google"
          items={STORE_EVIDENCE_GOOGLE_ITEMS.map((item) => item.title)}
          variant="primary"
        />
        <CategoryCard
          letter="B"
          title="Minh chứng nội bộ hỗ trợ"
          items={STORE_EVIDENCE_INTERNAL_ITEMS.map((item) => item.title)}
          variant="soft"
        />
      </div>

      <EvidenceProcessStepper />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => openPopup("google")}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1a5c3a] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#247a32]"
        >
          <Upload className="h-3.5 w-3.5" />
          Tải minh chứng
        </button>
        <DemoActionButton href="/demo/store-manager" variant="outline" className="rounded-lg px-3 py-1.5 text-xs">
          Gửi bằng chứng
        </DemoActionButton>
      </div>

      <p className="text-center text-xs text-slate-400">
        Bản demo không ghi file — chọn ảnh/video chỉ xem trước trên máy.
      </p>

      {popupOpen && (
        <EvidenceUploadPopup
          tab={tab}
          onTabChange={setTab}
          onClose={() => setPopupOpen(false)}
          localFiles={localFiles}
          onAdd={openPicker}
        />
      )}
    </div>
  );
}

function EvidenceUploadPopup({
  tab,
  onTabChange,
  onClose,
  localFiles,
  onAdd,
}: {
  tab: EvidenceTab;
  onTabChange: (tab: EvidenceTab) => void;
  onClose: () => void;
  localFiles: Record<string, LocalFile>;
  onAdd: (item: EvidenceUploadItem) => void;
}) {
  const items = tab === "google" ? STORE_EVIDENCE_GOOGLE_ITEMS : STORE_EVIDENCE_INTERNAL_ITEMS;
  const optional = tab === "internal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Đóng popup"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-popup-title"
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id="evidence-popup-title" className="font-semibold text-slate-900">
              Tải minh chứng
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Bạn có thể quản lý ảnh, video và tài liệu do cửa hàng tải lên.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-5 py-3">
          <p className="text-sm font-medium text-slate-800">{STORE_MANAGER_OVERVIEW.name}</p>
          <div className="mt-2 flex justify-start gap-2">
            <button
              type="button"
              onClick={() => onTabChange("google")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                tab === "google"
                  ? "bg-[#1a5c3a] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              Thu thập minh chứng
            </button>
            <button
              type="button"
              onClick={() => onTabChange("internal")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                tab === "internal"
                  ? "bg-[#1a5c3a] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              Minh chứng nội bộ hỗ trợ
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="mb-4 text-sm text-slate-500">
            {tab === "google"
              ? "Ưu tiên hoàn tất nhóm A theo yêu cầu của Google trước khi gửi."
              : "Tùy chọn — nộp khi Manager hoặc Google yêu cầu bổ sung."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <UploadCard
                key={item.id}
                item={item}
                localFile={localFiles[item.id]}
                onAdd={() => onAdd(item)}
                optional={optional}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-3">
          <DemoActionButton href="/demo/store-manager" variant="primary" className="rounded-lg px-3 py-1.5 text-xs">
            Gửi bằng chứng
          </DemoActionButton>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  letter,
  title,
  items,
  variant,
}: {
  letter: string;
  title: string;
  items: string[];
  variant: "primary" | "soft";
}) {
  const primary = variant === "primary";

  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        primary ? "bg-[#1a5c3a] text-white" : "bg-brand-leaf-softer text-brand-leaf-text",
      )}
    >
      <h3 className="text-sm font-bold uppercase tracking-wide">
        {letter}. {title}
      </h3>
      <div className={cn("mt-3 h-px", primary ? "bg-white/40" : "bg-brand-leaf-border-strong")} />
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", primary ? "bg-white" : "bg-[#1a5c3a]")} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EvidenceProcessStepper() {
  const { steps, currentIndex } = STORE_EVIDENCE_PROCESS_STEPS;

  return (
    <ol className="flex flex-wrap items-center justify-center gap-2">
      {steps.map((label, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const last = index === steps.length - 1;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wide",
                current && "bg-[#1a5c3a] text-white",
                done && "bg-brand-leaf-soft text-brand-leaf-text",
                !done && !current && "bg-brand-leaf-softer text-brand-leaf-text/70",
              )}
            >
              {label}
            </span>
            {!last && <ChevronRight className="h-4 w-4 shrink-0 text-[#1a5c3a]" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function UploadCard({
  item,
  localFile,
  onAdd,
  optional = false,
}: {
  item: EvidenceUploadItem;
  localFile?: LocalFile;
  onAdd: () => void;
  optional?: boolean;
}) {
  const hasLocal = Boolean(localFile);
  const submitted = item.status === "submitted";
  const filled = hasLocal || submitted;
  const Icon = item.kind === "video" ? Video : item.kind === "file" ? FileText : ImagePlus;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border bg-white p-5 shadow-card",
        optional ? "border-dashed border-brand-leaf-border" : "border-dashed border-slate-300",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
        {filled ? (
          <span className="shrink-0 rounded-full bg-brand-leaf-soft px-2 py-0.5 text-[11px] font-medium text-brand-leaf-text">
            Đã tải
          </span>
        ) : item.required ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
            Bắt buộc
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            Tùy chọn
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{item.description}</p>

      {localFile && <LocalPreview file={localFile} kind={item.kind} />}
      {!localFile && submitted && item.file && (
        <p className="mt-3 truncate rounded-lg bg-brand-leaf-softer px-3 py-2 text-xs text-brand-leaf-text">
          {item.file}
        </p>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a5c3a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#247a32]"
      >
        <Icon className="h-4 w-4" />
        {filled ? "Thay thế" : item.actionLabel}
      </button>
    </article>
  );
}

function LocalPreview({ file, kind }: { file: LocalFile; kind: EvidenceUploadItem["kind"] }) {
  if (kind === "image" || file.type.startsWith("image/")) {
    return (
      <div className="mt-3 overflow-hidden rounded-lg bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={file.name} className="h-28 w-full object-cover" />
      </div>
    );
  }

  if (kind === "video" || file.type.startsWith("video/")) {
    return (
      <video src={file.url} className="mt-3 h-28 w-full rounded-lg bg-slate-900 object-cover" controls />
    );
  }

  return (
    <p className="mt-3 truncate rounded-lg bg-brand-leaf-softer px-3 py-2 text-xs text-brand-leaf-text">
      {file.name}
    </p>
  );
}
