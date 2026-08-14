import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getSuspendedStoresRecent } from "../../constants/demoStores";
import { DemoCard } from "../ui/DemoCard";

export function EarlyWarningWidget({ verificationHref }: { verificationHref: string }) {
  const stores = getSuspendedStoresRecent();

  return (
    <DemoCard
      title="Early Warning System — Suspended trong 24h"
      action={
        <span className="flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertTriangle className="h-4 w-4" />
          12 cảnh báo
        </span>
      }
    >
      <ul className="divide-y divide-slate-100">
        {stores.map((store) => (
          <li key={store.id}>
            <Link
              href={verificationHref}
              className="flex items-center justify-between py-3 text-sm hover:bg-red-50/50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <span className="font-medium text-slate-800">{store.name}</span>
              <span className="text-xs text-red-600">Suspended → Xử lý ngay</span>
            </Link>
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}
