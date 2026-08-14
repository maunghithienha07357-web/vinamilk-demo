"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_LIST, DEMO_ROLE_META } from "../../constants/demoRoles";
import { getDemoPageTitle } from "../../constants/demoNav";
import { DemoModeBadge } from "./DemoModeBadge";

export function DemoHeader({ role }: { role: DemoRole }) {
  const pathname = usePathname();
  const title = getDemoPageTitle(pathname, role);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs text-slate-500">Vinamilk GBP Platform</p>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {DEMO_ROLE_LIST.map((id) => {
            const meta = DEMO_ROLE_META[id];
            const active = id === role;
            return (
              <Link
                key={id}
                href={meta.basePath}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                {meta.label}
              </Link>
            );
          })}
        </div>
        <DemoModeBadge />
      </div>
    </header>
  );
}
