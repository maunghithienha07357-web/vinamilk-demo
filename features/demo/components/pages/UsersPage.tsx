import { DEMO_ROLE_LIST, DEMO_ROLE_META } from "../../constants/demoRoles";
import { DEMO_SAMPLE_USERS } from "../../constants/demoPermissionMatrix";
import { DemoCard } from "../ui/DemoCard";
import { DemoBadge } from "../ui/DemoBadge";
import { DemoActionButton } from "../ui/DemoActionButton";
import { PermissionMatrixTable } from "../roles/PermissionMatrixTable";

export function UsersPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Phân quyền RBAC 3 role. Store Manager dùng magic link upload — không cần tạo 560 account
        thủ công. Gán cửa hàng qua store_assignments.
      </p>

      <DemoCard title="Vai trò trong hệ thống">
        <div className="grid gap-4 md:grid-cols-3">
          {DEMO_ROLE_LIST.map((id) => {
            const r = DEMO_ROLE_META[id];
            return (
              <div key={r.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">{r.label}</p>
                <p className="mt-1 text-xs text-slate-500">{r.actor}</p>
                <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                <DemoActionButton href={r.basePath} variant="outline" className="mt-4 w-full">
                  Vào giao diện {r.label}
                </DemoActionButton>
              </div>
            );
          })}
        </div>
      </DemoCard>

      <PermissionMatrixTable />

      <DemoCard title="Người dùng mẫu">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Vai trò</th>
              <th className="px-3 py-2">Cửa hàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_SAMPLE_USERS.map((u) => (
              <tr key={u.email}>
                <td className="px-3 py-2 font-medium">{u.name}</td>
                <td className="px-3 py-2 text-slate-600">{u.email}</td>
                <td className="px-3 py-2">
                  <DemoBadge>{DEMO_ROLE_META[u.role].label}</DemoBadge>
                </td>
                <td className="px-3 py-2 text-slate-500">{u.stores}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoCard>
    </div>
  );
}
