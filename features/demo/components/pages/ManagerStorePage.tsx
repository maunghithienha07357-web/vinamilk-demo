"use client";

import { useEffect, useRef, useState } from "react";
import { STORE_LIST_MANAGER, storeToPanelRow, type PanelStoreRow } from "../../constants/demoPanelData";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoDetailPanel } from "../ui/DemoDetailPanel";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoExportMenu, STORE_EXPORT_COLUMNS, panelStoresToRows } from "../ui/DemoExportMenu";
import { StoreMapEmbed } from "../store/StoreMapEmbed";
import { MAP_CLUSTER } from "../../constants/demoStores";
import { fetchVinamilkDemoStores } from "@/lib/supabase/vinamilkStores";

function gbpBadge(state?: string): "default" | "danger" | "warning" | "success" {
  if (state === "Suspended") return "danger";
  if (state === "Verified") return "success";
  if (state === "Claim" || state === "New" || state === "Verify") return "warning";
  return "default";
}

export function ManagerStorePage() {
  const [selected, setSelected] = useState<PanelStoreRow | null>(null);
  const [stores, setStores] = useState<PanelStoreRow[]>(STORE_LIST_MANAGER);
  const tableRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetchVinamilkDemoStores().then((rows) => setStores(rows.map((s) => storeToPanelRow(s))));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-600">
          Danh sách 5 cửa hàng Giấc Mơ Sữa Việt cụm Quận 7. Nhấn một hàng để xem bản đồ, trạng thái
          GBP, bằng chứng và đánh giá.
        </p>
        <DemoExportMenu
          title="Danh sách cửa hàng vận hành"
          columns={STORE_EXPORT_COLUMNS}
          rows={panelStoresToRows(stores)}
          captureRef={tableRef}
          fileBase="vinamilk-gbp-stores"
          iconOnly={false}
        />
      </div>

      <DemoCallout variant="info">
        Manager thấy 5 cửa hàng Q7 (cùng bảng vinamilk_demo_stores trên Supabase). Không gồm hạ tầng R2 / OAuth.
      </DemoCallout>

      <StoreMapEmbed
        lat={MAP_CLUSTER.lat}
        lng={MAP_CLUSTER.lng}
        name="Cụm cửa hàng Vinamilk Quận 7"
        zoom={MAP_CLUSTER.zoom}
        className="h-64 w-full"
      />

      <div ref={tableRef} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Cửa hàng</th>
              <th className="px-4 py-3 font-medium">Khu vực</th>
              <th className="px-4 py-3 font-medium">GBP</th>
              <th className="px-4 py-3 font-medium">Bằng chứng</th>
              <th className="px-4 py-3 font-medium">Đánh giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stores.map((store) => (
              <tr
                key={store.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => setSelected(store)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{store.name}</p>
                  <p className="text-xs text-slate-500">{store.address}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{store.region}</td>
                <td className="px-4 py-3">
                  <DemoBadge variant={gbpBadge(store.gbpState)}>{store.gbpState}</DemoBadge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{store.evidenceStatus}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {store.reviewCount
                    ? `★ ${store.rating} · ${store.reviewCount}`
                    : "Chưa có"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DemoDetailPanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected?.address}
        bodyRef={panelRef}
        headerAction={
          <DemoExportMenu
            title={selected?.name ?? "Chi tiết cửa hàng"}
            columns={STORE_EXPORT_COLUMNS}
            rows={selected ? panelStoresToRows([selected]) : []}
            captureRef={panelRef}
            fileBase={selected ? `vinamilk-${selected.id}` : "vinamilk-store"}
          />
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-slate-400">GBP</dt>
                <dd className="mt-1">
                  <DemoBadge variant={gbpBadge(selected.gbpState)}>{selected.gbpState}</DemoBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Kanban</dt>
                <dd className="mt-1 text-slate-800">{selected.kanban}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">SĐT</dt>
                <dd className="mt-1 text-slate-800">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Khu vực</dt>
                <dd className="mt-1 text-slate-800">{selected.region}</dd>
              </div>
            </dl>
            {selected.lat != null && selected.lng != null && (
              <StoreMapEmbed lat={selected.lat} lng={selected.lng} name={selected.name} />
            )}
            <div>
              <p className="text-xs text-slate-400">Bằng chứng</p>
              <p className="mt-1 text-slate-800">{selected.evidenceStatus}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Đánh giá</p>
              <p className="mt-1 text-slate-800">
                {selected.reviewCount
                  ? `★ ${selected.rating} · ${selected.reviewCount} đánh giá`
                  : "Chưa có đánh giá (listing chưa public)"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <DemoActionButton href="/demo/manager/verification" variant="primary" className="w-full">
                Mở Verification
              </DemoActionButton>
              <DemoActionButton href="/demo/manager/reviews" variant="outline" className="w-full">
                Xem đánh giá
              </DemoActionButton>
            </div>
          </div>
        )}
      </DemoDetailPanel>
    </div>
  );
}
