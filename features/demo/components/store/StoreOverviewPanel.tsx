"use client";

import { useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Star,
  Upload,
} from "lucide-react";
import {
  STORE_EVIDENCE_ITEMS,
  STORE_GBP_TIMELINE,
  STORE_MANAGER_OVERVIEW,
  STORE_NAP,
  STORE_PENDING_TASKS,
} from "../../constants/demoPanelData";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoDetailPanel } from "../ui/DemoDetailPanel";
import { DemoExportMenu } from "../ui/DemoExportMenu";
import { StoreMapEmbed } from "./StoreMapEmbed";
import { cn } from "@/utils/cn";

type PanelKind = "store" | "progress" | "rating" | "evidence" | "deadline" | "status";

export function StoreOverviewPanel() {
  const s = STORE_MANAGER_OVERVIEW;
  const [panel, setPanel] = useState<PanelKind | null>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const deadlineRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const tiles = [
    {
      id: "status" as const,
      label: "Trạng thái GBP",
      value: s.gbpState,
      hint: s.kanban,
      icon: Shield,
      accent: "warning" as const,
    },
    {
      id: "rating" as const,
      label: "Đánh giá",
      value: `★ ${s.rating}`,
      hint: `${s.reviewCount} đánh giá · ${s.oneStarCount} sao 1`,
      icon: Star,
      accent: "warning" as const,
    },
    {
      id: "evidence" as const,
      label: "Bằng chứng",
      value: `${s.evidenceSubmitted}/${s.evidenceRequired}`,
      hint: "Thiếu video mặt tiền",
      icon: Camera,
      accent: "default" as const,
    },
    {
      id: "deadline" as const,
      label: "Hạn nộp",
      value: s.deadline,
      hint: "3 việc còn lại",
      icon: Clock,
      accent: "danger" as const,
    },
  ];

  const accentClass = {
    default: "border-slate-200 bg-white hover:border-[#1a5c3a]/40",
    warning: "border-amber-200 bg-amber-50 hover:border-amber-400",
    danger: "border-red-200 bg-red-50 hover:border-red-400",
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setPanel("store")}
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-card transition-shadow hover:shadow-card-hover"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">
              Cửa hàng của tôi
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{s.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 shrink-0" />
              {s.address}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DemoBadge variant="warning">{s.gbpState}</DemoBadge>
              <DemoBadge variant="danger">{s.kanban}</DemoBadge>
            </div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setPanel("progress");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setPanel("progress");
              }
            }}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-8 border-[#1a5c3a]/20"
            style={{
              background: `conic-gradient(#1a5c3a ${s.progress * 3.6}deg, #e2e8f0 0deg)`,
            }}
            title="Nhấn để xem tiến độ"
          >
            <span className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-lg font-bold text-slate-900">
              {s.progress}%
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">Nhấn vào thẻ để xem thông tin N.A.P</p>
      </button>

      {s.lat != null && s.lng != null && (
        <StoreMapEmbed lat={s.lat} lng={s.lng} name={s.name} className="h-64 w-full" />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => setPanel(tile.id)}
              className={cn(
                "rounded-xl border p-5 text-left transition-shadow hover:shadow-card-hover",
                accentClass[tile.accent],
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {tile.label}
                </p>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{tile.value}</p>
              <p className="mt-1 text-xs text-slate-500">{tile.hint}</p>
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-800">Hành trình hồ sơ GBP</p>
        <div className="grid gap-3 sm:grid-cols-4">
          {STORE_GBP_TIMELINE.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setPanel("status")}
              className={cn(
                "rounded-xl border p-4 text-left transition-shadow hover:shadow-card-hover",
                step.status === "done" && "border-emerald-200 bg-emerald-50",
                step.status === "current" && "border-amber-300 bg-amber-50 ring-2 ring-amber-200",
                step.status === "pending" && "border-slate-200 bg-white",
              )}
            >
              <div className="flex items-center gap-2">
                {step.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : step.status === "current" ? (
                  <Upload className="h-4 w-4 text-amber-600" />
                ) : (
                  <span className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
                <span className="text-sm font-semibold text-slate-800">{step.label}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{step.date}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">Việc cần làm</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {STORE_PENDING_TASKS.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setPanel(task.id === "t3" ? "rating" : "deadline")}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50"
              >
                <span className="text-sm text-slate-800">{task.title}</span>
                <span
                  className={
                    task.urgent ? "text-xs font-medium text-red-600" : "text-xs text-slate-400"
                  }
                >
                  {task.due}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <DemoDetailPanel
        open={panel === "store"}
        onClose={() => setPanel(null)}
        title={s.name}
        subtitle={s.address}
        bodyRef={storeRef}
        headerAction={
          <DemoExportMenu
            title={s.name}
            columns={[
              { key: "field", header: "Trường" },
              { key: "value", header: "Giá trị" },
            ]}
            rows={[
              { field: "Name", value: STORE_NAP.name },
              { field: "Address", value: STORE_NAP.address },
              { field: "Phone", value: STORE_NAP.phone },
              { field: "Hours", value: STORE_NAP.hours },
              { field: "GBP", value: s.gbpState },
            ]}
            captureRef={storeRef}
            fileBase="vinamilk-ch42-nap"
          />
        }
      >
        <dl className="space-y-3 text-sm">
          {(
            [
              ["Name", STORE_NAP.name],
              ["Address", STORE_NAP.address],
              ["Phone", STORE_NAP.phone],
              ["Hours", STORE_NAP.hours],
              ["Category", STORE_NAP.category],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-slate-400">{k}</dt>
              <dd className="mt-0.5 text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
        <DemoActionButton href="/demo/store-manager/nap" variant="primary" className="mt-5 w-full">
          Mở thông tin N.A.P
        </DemoActionButton>
      </DemoDetailPanel>

      <DemoDetailPanel
        open={panel === "progress"}
        onClose={() => setPanel(null)}
        title="Tiến độ hồ sơ GBP"
        subtitle={`${s.progress}% hoàn thành`}
        bodyRef={progressRef}
        headerAction={
          <DemoExportMenu
            title="Tiến độ hồ sơ Bùi Bằng Đoàn"
            columns={[
              { key: "item", header: "Hạng mục" },
              { key: "status", header: "Trạng thái" },
            ]}
            rows={STORE_EVIDENCE_ITEMS.map((i) => ({
              item: i.label,
              status: i.status === "submitted" ? "Xong" : "Thiếu",
            }))}
            captureRef={progressRef}
            fileBase="vinamilk-ch42-progress"
          />
        }
      >
        <div className="space-y-4 text-sm">
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#1a5c3a]" style={{ width: `${s.progress}%` }} />
          </div>
          <p className="text-slate-600">
            Thiếu video mặt tiền — hoàn thành checklist để Manager nộp lên Google.
          </p>
          <ul className="space-y-2">
            {STORE_EVIDENCE_ITEMS.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.label}</span>
                <DemoBadge variant={item.status === "submitted" ? "success" : "warning"}>
                  {item.status === "submitted" ? "Xong" : "Thiếu"}
                </DemoBadge>
              </li>
            ))}
          </ul>
        </div>
      </DemoDetailPanel>

      <DemoDetailPanel
        open={panel === "status"}
        onClose={() => setPanel(null)}
        title="Hành trình hồ sơ GBP"
        subtitle={s.kanban}
        bodyRef={statusRef}
        headerAction={
          <DemoExportMenu
            title="Timeline GBP Bùi Bằng Đoàn"
            columns={[
              { key: "label", header: "Bước" },
              { key: "status", header: "Trạng thái" },
              { key: "date", header: "Thời điểm" },
            ]}
            rows={STORE_GBP_TIMELINE.map((t) => ({
              label: t.label,
              status: t.status,
              date: t.date,
            }))}
            captureRef={statusRef}
            fileBase="vinamilk-ch42-timeline"
          />
        }
      >
        <ol className="space-y-4 text-sm">
          {STORE_GBP_TIMELINE.map((step) => (
            <li key={step.id}>
              <p className="font-semibold text-slate-800">{step.label}</p>
              <p className="text-xs text-slate-400">{step.date}</p>
              <p className="mt-1 text-slate-600">{step.note}</p>
            </li>
          ))}
        </ol>
        <DemoActionButton href="/demo/store-manager/status" variant="primary" className="mt-5 w-full">
          Xem trạng thái hồ sơ
        </DemoActionButton>
      </DemoDetailPanel>

      <DemoDetailPanel
        open={panel === "rating"}
        onClose={() => setPanel(null)}
        title="Đánh giá cửa hàng"
        subtitle={`${s.reviewCount} đánh giá · ★ ${s.rating}`}
        bodyRef={ratingRef}
        headerAction={
          <DemoExportMenu
            title="Đánh giá Bùi Bằng Đoàn"
            columns={[
              { key: "stars", header: "Sao" },
              { key: "count", header: "Số đánh giá" },
            ]}
            rows={[
              { stars: "5", count: "8" },
              { stars: "4", count: "12" },
              { stars: "3", count: "6" },
              { stars: "2", count: "3" },
              { stars: "1", count: String(s.oneStarCount) },
            ]}
            captureRef={ratingRef}
            fileBase="vinamilk-ch42-reviews"
          />
        }
      >
        <ul className="space-y-2 text-sm text-slate-700">
          <li>★ 5 — 8 đánh giá</li>
          <li>★ 4 — 12 đánh giá</li>
          <li>★ 3 — 6 đánh giá</li>
          <li>★ 2 — 3 đánh giá</li>
          <li>★ 1 — {s.oneStarCount} đánh giá (chưa phản hồi)</li>
        </ul>
        <DemoActionButton href="/demo/store-manager/reviews" variant="primary" className="mt-5 w-full">
          Mở trang đánh giá
        </DemoActionButton>
      </DemoDetailPanel>

      <DemoDetailPanel
        open={panel === "evidence"}
        onClose={() => setPanel(null)}
        title="Bằng chứng đã nộp"
        subtitle={`${s.evidenceSubmitted}/${s.evidenceRequired} checklist`}
        bodyRef={evidenceRef}
        headerAction={
          <DemoExportMenu
            title="Checklist bằng chứng Bùi Bằng Đoàn"
            columns={[
              { key: "label", header: "Hạng mục" },
              { key: "status", header: "Trạng thái" },
              { key: "file", header: "File" },
            ]}
            rows={STORE_EVIDENCE_ITEMS.map((item) => ({
              label: item.label,
              status: item.status === "submitted" ? "Đã nộp" : "Thiếu",
              file: item.file ?? "",
            }))}
            captureRef={evidenceRef}
            fileBase="vinamilk-ch42-evidence"
          />
        }
      >
        <ul className="space-y-3 text-sm">
          {STORE_EVIDENCE_ITEMS.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-800">{item.label}</span>
                <DemoBadge variant={item.status === "submitted" ? "success" : "warning"}>
                  {item.status === "submitted" ? "Đã nộp" : "Thiếu"}
                </DemoBadge>
              </div>
              {item.file && (
                <p className="mt-1 text-xs text-slate-500">
                  {item.file}
                  {item.uploadedAt ? ` · ${item.uploadedAt}` : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
        <DemoActionButton href="/demo/store-manager/evidence" variant="primary" className="mt-4 w-full">
          Tải video mặt tiền
        </DemoActionButton>
      </DemoDetailPanel>

      <DemoDetailPanel
        open={panel === "deadline"}
        onClose={() => setPanel(null)}
        title="Hạn nộp hồ sơ"
        subtitle={`Hạn ${s.deadline}`}
        bodyRef={deadlineRef}
        headerAction={
          <DemoExportMenu
            title="Việc cần làm Bùi Bằng Đoàn"
            columns={[
              { key: "title", header: "Việc" },
              { key: "due", header: "Hạn" },
            ]}
            rows={STORE_PENDING_TASKS.map((t) => ({ title: t.title, due: t.due }))}
            captureRef={deadlineRef}
            fileBase="vinamilk-ch42-deadline"
          />
        }
      >
        <ul className="space-y-2 text-sm">
          {STORE_PENDING_TASKS.map((task) => (
            <li key={task.id} className="flex justify-between gap-2">
              <span>{task.title}</span>
              <span className={task.urgent ? "text-red-600" : "text-slate-400"}>{task.due}</span>
            </li>
          ))}
        </ul>
        <DemoActionButton href="/demo/store-manager/status" variant="primary" className="mt-5 w-full">
          Xem trạng thái hồ sơ
        </DemoActionButton>
      </DemoDetailPanel>
    </div>
  );
}
