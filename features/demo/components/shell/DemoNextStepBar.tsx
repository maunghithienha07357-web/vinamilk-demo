"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { DemoRole } from "../../constants/demoRoles";
import { getDemoNextStep } from "../../constants/demoNav";

export function DemoNextStepBar({ role }: { role: DemoRole }) {
  const pathname = usePathname();
  const next = getDemoNextStep(pathname, role);

  if (!next) return null;

  return (
    <div className="mt-8 flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4">
      <p className="text-sm text-slate-600">Bước tiếp theo trong luồng thuyết trình</p>
      <Link
        href={next.href}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#1a5c3a] hover:underline"
      >
        {next.label}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
