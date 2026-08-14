import type { DemoStore } from "../../constants/demoStores";
import { GBP_STATE_LABELS, KANBAN_STAGE_LABELS } from "../../constants/demoStores";
import { DemoBadge } from "../ui/DemoBadge";

export function VerificationList({
  stores,
  onSelect,
}: {
  stores: DemoStore[];
  onSelect: (store: DemoStore) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Cửa hàng</th>
            <th className="px-4 py-3">Vùng</th>
            <th className="px-4 py-3">Trạng thái GBP</th>
            <th className="px-4 py-3">Kanban</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stores.slice(0, 20).map((store) => (
            <tr key={store.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{store.name}</td>
              <td className="px-4 py-3 text-slate-600">{store.region}</td>
              <td className="px-4 py-3">
                <DemoBadge variant="warning">{GBP_STATE_LABELS[store.gbpState]}</DemoBadge>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {KANBAN_STAGE_LABELS[store.kanbanStage]}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSelect(store)}
                  className="text-[#1a5c3a] hover:underline"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
