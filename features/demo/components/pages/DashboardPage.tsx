"use client";

import { useRef, useState, type ReactNode } from "react";
import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import {
  DEMO_STORE_COUNTS,
  MAP_CLUSTER,
} from "../../constants/demoStores";
import {
  CLAIM_STORES_DETAIL,
  FUNNEL_STAGE_STORES,
  NEW_STORES_DETAIL,
  REVIEW_BREAKDOWN,
  REVIEW_TOP_ONE_STAR,
  SUSPENDED_STORES_DETAIL,
  VERIFY_STORES_DETAIL,
  type PanelStoreRow,
} from "../../constants/demoPanelData";
import { ConversionFunnel } from "../dashboard/ConversionFunnel";
import { EarlyWarningWidget } from "../dashboard/EarlyWarningWidget";
import { ReviewKpiProgress } from "../dashboard/ReviewKpiProgress";
import { DemoStatCard } from "../ui/DemoStatCard";
import { DemoCard } from "../ui/DemoCard";
import { DemoDetailPanel } from "../ui/DemoDetailPanel";
import { DemoStoreRowList } from "../ui/DemoStoreRowList";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoExportMenu, STORE_EXPORT_COLUMNS, panelStoresToRows } from "../ui/DemoExportMenu";
import { StoreMapEmbed } from "../store/StoreMapEmbed";

type PanelKind = "claim" | "suspended" | "new" | "verify" | "funnel" | "reviews";

const STAT_PANELS: Record<
  Exclude<PanelKind, "funnel" | "reviews">,
  { title: string; subtitle: string; rows: PanelStoreRow[]; note: string }
> = {
  claim: {
    title: "Cửa hàng chưa Claim",
    subtitle: `${CLAIM_STORES_DETAIL.length} cửa hàng — ưu tiên flagship Q7`,
    rows: CLAIM_STORES_DETAIL,
    note: "Claim = listing chưa thuộc tài khoản GBP Vinamilk. Manager nộp Claim sau khi Store Manager xác nhận địa chỉ.",
  },
  suspended: {
    title: "Cửa hàng Suspended (24h)",
    subtitle: `${SUSPENDED_STORES_DETAIL.length} cảnh báo — xử lý trước hạn Google`,
    rows: SUSPENDED_STORES_DETAIL,
    note: "Suspended thường do N.A.P lệch giấy phép, video không thấy bảng hiệu, hoặc trùng listing. Mở Verification để duyệt bằng chứng.",
  },
  new: {
    title: "Cửa hàng New (vừa import)",
    subtitle: `${NEW_STORES_DETAIL.length} cửa hàng vừa import — chờ gán tag GBP`,
    rows: NEW_STORES_DETAIL,
    note: "New = vừa ingest từ Google / Excel. Chưa vào funnel Verify cho đến khi Auto-Tag xong.",
  },
  verify: {
    title: "Cửa hàng đang Verify",
    subtitle: `${VERIFY_STORES_DETAIL.length} cửa hàng — thiếu bằng chứng hoặc chờ Google`,
    rows: VERIFY_STORES_DETAIL,
    note: "Verify = đã claim, đang thu thập / nộp bằng chứng. Store Manager tải file; Manager duyệt rồi nộp lên Google.",
  },
};

const FUNNEL_EXPORT_COLUMNS = [
  { key: "stage", header: "Giai đoạn" },
  { key: "count", header: "Số cửa hàng" },
];

const FUNNEL_EXPORT_ROWS = [
  { stage: "Tổng cửa hàng", count: String(DEMO_STORE_COUNTS.total) },
  { stage: "Verify", count: String(DEMO_STORE_COUNTS.verify) },
  { stage: "Đã nộp bằng chứng", count: String(FUNNEL_STAGE_STORES["Đã nộp bằng chứng"].length) },
  { stage: "Verified", count: String(DEMO_STORE_COUNTS.verified) },
];

const REVIEW_KPI_COLUMNS = [
  { key: "region", header: "Khu vực" },
  { key: "current", header: "Hiện tại" },
  { key: "target", header: "Mục tiêu" },
  { key: "oneStar", header: "Sao 1" },
];

export function DashboardPage({ role }: { role: Extract<DemoRole, "admin" | "manager"> }) {
  const base = DEMO_ROLE_META[role].basePath;
  const [panel, setPanel] = useState<{ kind: PanelKind; stage?: string } | null>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);

  const title =
    role === "admin"
      ? "Module 1 — Master Dashboard: cái nhìn toàn cảnh cho Ban Lãnh đạo Vinamilk và PM dự án."
      : "Dashboard vận hành — Agency PM xem tiến độ 5 cửa hàng Giấc Mơ Sữa Việt (Quận 7). Nhấn số liệu hoặc cột biểu đồ để mở chi tiết.";

  const verificationHref = `${base}/verification`;

  let panelTitle = "";
  let panelSubtitle: string | undefined;
  let panelBody: ReactNode = null;
  let panelExportRows: Array<Record<string, string>> = [];
  let panelExportColumns = STORE_EXPORT_COLUMNS;
  let panelFileBase = "vinamilk-gbp-panel";

  if (panel?.kind === "funnel") {
    const stage = panel.stage ?? "Tổng cửa hàng";
    const rows = FUNNEL_STAGE_STORES[stage] ?? [];
    panelTitle = `Funnel — ${stage}`;
    panelSubtitle = `${rows.length} cửa hàng mẫu ở giai đoạn này`;
    panelExportRows = panelStoresToRows(rows);
    panelFileBase = `vinamilk-gbp-funnel-${stage}`;
    panelBody = (
      <div className="space-y-4">
        <DemoCallout variant="info">
          Funnel đo chuyển đổi từ tổng mạng lưới sang Verified. Nhấn cột khác trên biểu đồ để đổi
          giai đoạn.
        </DemoCallout>
        <DemoStoreRowList rows={rows} />
        <DemoActionButton href={verificationHref} variant="primary" className="w-full">
          Mở Xác thực & Bằng chứng
        </DemoActionButton>
      </div>
    );
  } else if (panel?.kind === "reviews") {
    panelTitle = "KPI đánh giá theo khu vực";
    panelSubtitle = "2.180 / 6.500 — top cửa hàng nhiều 1★";
    panelExportColumns = REVIEW_KPI_COLUMNS;
    panelExportRows = REVIEW_BREAKDOWN.map((r) => ({
      region: r.region,
      current: String(r.current),
      target: String(r.target),
      oneStar: String(r.oneStar),
    }));
    panelFileBase = "vinamilk-gbp-review-kpi";
    panelBody = (
      <div className="space-y-5">
        <ul className="space-y-3">
          {REVIEW_BREAKDOWN.map((r) => {
            const pct = Math.round((r.current / r.target) * 100);
            return (
              <li key={r.region}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{r.region}</span>
                  <span className="text-slate-500">
                    {r.current.toLocaleString("vi-VN")} / {r.target.toLocaleString("vi-VN")} · {r.oneStar}{" "}
                    sao 1
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#1a5c3a]" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Top 5 cửa hàng nhiều 1★
          </p>
          <DemoStoreRowList rows={REVIEW_TOP_ONE_STAR} />
        </div>
        <DemoActionButton href={`${base}/reviews`} variant="primary" className="w-full">
          Mở Hộp thư Đánh giá
        </DemoActionButton>
      </div>
    );
  } else if (panel && panel.kind in STAT_PANELS) {
    const meta = STAT_PANELS[panel.kind as keyof typeof STAT_PANELS];
    panelTitle = meta.title;
    panelSubtitle = meta.subtitle;
    panelExportRows = panelStoresToRows(meta.rows);
    panelFileBase = `vinamilk-gbp-${panel.kind}`;
    panelBody = (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{meta.note}</p>
        <DemoStoreRowList rows={meta.rows} />
        <DemoActionButton href={verificationHref} variant="primary" className="w-full">
          Xem chi tiết Verification
        </DemoActionButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">{title}</p>

      <DemoCard title="Bản đồ 5 cửa hàng — cụm Quận 7, TP.HCM">
        <StoreMapEmbed
          lat={MAP_CLUSTER.lat}
          lng={MAP_CLUSTER.lng}
          name="Cụm cửa hàng Vinamilk Quận 7"
          zoom={MAP_CLUSTER.zoom}
          className="h-72 w-full"
        />
        <p className="mt-2 text-xs text-slate-500">
          5 điểm Giấc Mơ Sữa Việt / cửa hàng trải nghiệm quanh Phú Mỹ Hưng — Bùi Bằng Đoàn, Tân Trào,
          Trần Xuân Soạn, Lâm Văn Bền, Tôn Dật Tiên.
        </p>
      </DemoCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DemoStatCard
          label="Claim"
          value={DEMO_STORE_COUNTS.claim}
          onDetail={() => setPanel({ kind: "claim" })}
          hint="Nhấn để xem danh sách"
        />
        <DemoStatCard
          label="Suspended"
          value={DEMO_STORE_COUNTS.suspended}
          onDetail={() => setPanel({ kind: "suspended" })}
          accent="danger"
          hint="Nhấn để xem cảnh báo"
        />
        <DemoStatCard
          label="New"
          value={DEMO_STORE_COUNTS.new}
          onDetail={() => setPanel({ kind: "new" })}
          accent="warning"
          hint="Nhấn để xem danh sách"
        />
        <DemoStatCard
          label="Verify"
          value={DEMO_STORE_COUNTS.verify}
          onDetail={() => setPanel({ kind: "verify" })}
          accent="success"
          hint="Nhấn để xem danh sách"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DemoCard
          title="Funnel Chart — Chuyển đổi sang Verified"
          contentRef={funnelRef}
          action={
            <DemoExportMenu
              title="Funnel chuyển đổi Verified"
              columns={FUNNEL_EXPORT_COLUMNS}
              rows={FUNNEL_EXPORT_ROWS}
              captureRef={funnelRef}
              fileBase="vinamilk-gbp-funnel"
            />
          }
        >
          <ConversionFunnel onBarClick={(stage) => setPanel({ kind: "funnel", stage })} />
        </DemoCard>
        <ReviewKpiProgress
          onDetailClick={() => setPanel({ kind: "reviews" })}
          contentRef={kpiRef}
          extraAction={
            <DemoExportMenu
              title="KPI đánh giá theo khu vực"
              columns={REVIEW_KPI_COLUMNS}
              rows={REVIEW_BREAKDOWN.map((r) => ({
                region: r.region,
                current: String(r.current),
                target: String(r.target),
                oneStar: String(r.oneStar),
              }))}
              captureRef={kpiRef}
              fileBase="vinamilk-gbp-review-tracker"
            />
          }
        />
      </div>

      <EarlyWarningWidget verificationHref={verificationHref} />

      <DemoDetailPanel
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={panelTitle}
        subtitle={panelSubtitle}
        bodyRef={panelBodyRef}
        headerAction={
          <DemoExportMenu
            title={panelTitle}
            subtitle={panelSubtitle}
            columns={panelExportColumns}
            rows={panelExportRows}
            captureRef={panelBodyRef}
            fileBase={panelFileBase}
          />
        }
      >
        {panelBody}
      </DemoDetailPanel>
    </div>
  );
}
