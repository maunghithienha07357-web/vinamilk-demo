"use client";

import { useState } from "react";
import type { DemoStore } from "../../constants/demoStores";
import {
  DEMO_STORES,
  GBP_STATE_LABELS,
  SYNC_STATUS_LABELS,
} from "../../constants/demoStores";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoActionButton } from "../ui/DemoActionButton";
import { MassUpdatePanel } from "./MassUpdatePanel";

const PAGE_SIZE = 25;

export function NapDataGrid({ syncLogHref }: { syncLogHref: string }) {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(DEMO_STORES.length / PAGE_SIZE);
  const pageStores = DEMO_STORES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      setSelected(new Set(DEMO_STORES.map((s) => s.id)));
      setSelectAll(true);
    }
  };

  const syncVariant = (status: DemoStore["syncStatus"]) => {
    if (status === "success") return "success" as const;
    if (status === "failed") return "danger" as const;
    if (status === "processing" || status === "queued") return "warning" as const;
    return "default" as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleSelectAll}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả 560"}
        </button>
        {selected.size > 0 && (
          <span className="text-sm text-slate-600">Đã chọn {selected.size} cửa hàng</span>
        )}
        <DemoActionButton href={syncLogHref} variant="primary">
          1-Click Sync lên Google
        </DemoActionButton>
      </div>

      <MassUpdatePanel selectedCount={selected.size} />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <th className="px-3 py-3">Tên</th>
              <th className="px-3 py-3">Danh mục</th>
              <th className="px-3 py-3">Địa chỉ</th>
              <th className="px-3 py-3">Hotline</th>
              <th className="px-3 py-3">Giờ hoạt động</th>
              <th className="px-3 py-3">Trạng thái GBP</th>
              <th className="px-3 py-3">Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageStores.map((store) => (
              <tr key={store.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(store.id)}
                    onChange={() => toggleSelect(store.id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="px-3 py-2 font-medium text-slate-800">{store.name}</td>
                <td className="px-3 py-2 text-slate-600">{store.category}</td>
                <td className="max-w-[200px] truncate px-3 py-2 text-slate-600">{store.address}</td>
                <td className="px-3 py-2 text-slate-600">{store.phone}</td>
                <td className="px-3 py-2 text-slate-600">{store.hours}</td>
                <td className="px-3 py-2">
                  <DemoBadge>{GBP_STATE_LABELS[store.gbpState]}</DemoBadge>
                </td>
                <td className="px-3 py-2">
                  <DemoBadge variant={syncVariant(store.syncStatus)}>
                    {SYNC_STATUS_LABELS[store.syncStatus]}
                  </DemoBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Trang {page + 1} / {totalPages} — {DEMO_STORES.length} cửa hàng
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
