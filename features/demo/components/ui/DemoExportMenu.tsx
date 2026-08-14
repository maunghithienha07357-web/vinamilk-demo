"use client";

import type { RefObject } from "react";
import { SurveyExportMenu } from "@/features/survey/components/SurveyExportMenu";
import type { PanelStoreRow } from "../../constants/demoPanelData";

export const STORE_EXPORT_COLUMNS = [
  { key: "name", header: "Cửa hàng" },
  { key: "region", header: "Khu vực" },
  { key: "address", header: "Địa chỉ" },
  { key: "gbpState", header: "GBP" },
  { key: "evidenceStatus", header: "Bằng chứng" },
  { key: "reason", header: "Ghi chú" },
  { key: "rating", header: "Rating" },
];

export function panelStoresToRows(rows: PanelStoreRow[]): Array<Record<string, string>> {
  return rows.map((r) => ({
    name: r.name,
    region: r.region,
    address: r.address,
    gbpState: r.gbpState ?? "",
    evidenceStatus: r.evidenceStatus ?? "",
    reason: r.reason ?? r.date ?? "",
    rating: r.rating != null ? String(r.rating) : "",
  }));
}

export function DemoExportMenu({
  title,
  subtitle,
  columns = [],
  rows = [],
  captureRef,
  fileBase,
  iconOnly = true,
}: {
  title: string;
  subtitle?: string;
  columns?: Array<{ key: string; header: string }>;
  rows?: Array<Record<string, string>>;
  captureRef: RefObject<HTMLElement | null> | RefObject<HTMLDivElement | null>;
  fileBase: string;
  iconOnly?: boolean | "mobile";
}) {
  return (
    <SurveyExportMenu
      title={title}
      subtitle={subtitle}
      columns={columns}
      rows={rows}
      captureRef={captureRef as RefObject<HTMLElement | null>}
      fileBase={fileBase}
      iconOnly={iconOnly}
    />
  );
}
