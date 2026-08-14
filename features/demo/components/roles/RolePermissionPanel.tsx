import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import { DemoCard } from "../ui/DemoCard";

export function RolePermissionPanel({ role }: { role: DemoRole }) {
  const meta = DEMO_ROLE_META[role];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DemoCard title="Bạn được phép">
        <ul className="space-y-2 text-sm text-slate-700">
          {meta.capabilities.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DemoCard>
      <DemoCard title="Bạn không được phép">
        <ul className="space-y-2 text-sm text-slate-700">
          {meta.restrictions.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-slate-400">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DemoCard>
    </div>
  );
}
