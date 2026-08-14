"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import { DEMO_ROLE_NAV } from "../../constants/demoNav";
import { DemoBadge } from "../ui/DemoBadge";

export function DemoSidebar({ role }: { role: DemoRole }) {
  const pathname = usePathname();
  const meta = DEMO_ROLE_META[role];
  const groups = DEMO_ROLE_NAV[role];

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a5c3a] text-sm font-bold text-white">
          V
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">Vinamilk GBP</p>
          <p className="truncate text-xs text-slate-500">{meta.label}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.id} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== meta.basePath && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent font-medium text-sidebar-active-text"
                          : "text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <DemoBadge
                          variant={
                            item.badgeVariant === "danger"
                              ? "danger"
                              : item.badgeVariant === "warning"
                                ? "warning"
                                : "default"
                          }
                        >
                          {item.badge}
                        </DemoBadge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3 space-y-2">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {meta.label}
        </p>
        <p className="px-3 text-xs leading-snug text-slate-500">{meta.scope}</p>
        <Link
          href="/demo"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        >
          ← Về trang bìa demo
        </Link>
      </div>
    </aside>
  );
}
