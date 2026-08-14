import type { PanelStoreRow } from "../../constants/demoPanelData";
import { DemoBadge } from "./DemoBadge";

function badgeVariant(state?: string): "default" | "danger" | "warning" | "success" {
  if (state === "Suspended") return "danger";
  if (state === "Claim" || state === "New" || state === "Verify") return "warning";
  if (state === "Verified") return "success";
  return "default";
}

export function DemoStoreRowList({
  rows,
  onSelect,
}: {
  rows: PanelStoreRow[];
  onSelect?: (row: PanelStoreRow) => void;
}) {
  return (
    <ul className="divide-y divide-slate-100">
      {rows.map((row) => {
        const inner = (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">{row.name}</p>
              {row.gbpState && (
                <DemoBadge variant={badgeVariant(row.gbpState)}>{row.gbpState}</DemoBadge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {row.region} · {row.address}
            </p>
            {row.reason && <p className="mt-1 text-xs text-slate-600">{row.reason}</p>}
            {row.evidenceStatus && (
              <p className="mt-1 text-xs text-amber-700">{row.evidenceStatus}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-400">
              {row.date && <span>{row.date}</span>}
              {row.priority && <span>Ưu tiên: {row.priority}</span>}
              {row.rating != null && row.reviewCount != null && (
                <span>
                  ★ {row.rating} · {row.reviewCount} đánh giá
                  {row.oneStarCount != null ? ` · ${row.oneStarCount} sao 1` : ""}
                </span>
              )}
            </div>
          </>
        );

        return (
          <li key={row.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(row)}
                className="w-full rounded-lg px-1 py-3 text-left hover:bg-slate-50"
              >
                {inner}
              </button>
            ) : (
              <div className="py-3">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
