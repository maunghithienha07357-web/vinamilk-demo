import { DEMO_PERMISSION_MATRIX, PERMISSION_LEVEL_LABELS } from "../../constants/demoPermissionMatrix";
import type { PermissionLevel } from "../../constants/demoPermissionMatrix";
import { DemoCard } from "../ui/DemoCard";
import { DemoBadge } from "../ui/DemoBadge";

function levelVariant(level: PermissionLevel) {
  if (level === "full") return "success" as const;
  if (level === "read" || level === "own") return "warning" as const;
  return "default" as const;
}

export function PermissionMatrixTable() {
  return (
    <DemoCard title="Ma trận phân quyền 3 role">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Module</th>
              <th className="px-3 py-2">Admin</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Store Manager</th>
              <th className="px-3 py-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_PERMISSION_MATRIX.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 font-medium text-slate-800">{row.module}</td>
                {(["admin", "manager", "store_manager"] as const).map((role) => (
                  <td key={role} className="px-3 py-2">
                    <DemoBadge variant={levelVariant(row.levels[role])}>
                      {PERMISSION_LEVEL_LABELS[row.levels[role]]}
                    </DemoBadge>
                  </td>
                ))}
                <td className="px-3 py-2 text-xs text-slate-500">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoCard>
  );
}
