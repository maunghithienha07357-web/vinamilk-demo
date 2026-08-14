import type { DemoStore } from "../../constants/demoStores";
import { GBP_STATE_LABELS } from "../../constants/demoStores";
import { DemoBadge } from "../ui/DemoBadge";

export function VerificationCards({
  stores,
  onSelect,
}: {
  stores: DemoStore[];
  onSelect: (store: DemoStore) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stores.slice(0, 12).map((store) => (
        <button
          key={store.id}
          type="button"
          onClick={() => onSelect(store)}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="font-semibold text-slate-800">{store.name}</p>
          <p className="mt-1 text-xs text-slate-500">{store.address}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <DemoBadge>{GBP_STATE_LABELS[store.gbpState]}</DemoBadge>
            <DemoBadge variant="default">{store.region}</DemoBadge>
          </div>
        </button>
      ))}
    </div>
  );
}
