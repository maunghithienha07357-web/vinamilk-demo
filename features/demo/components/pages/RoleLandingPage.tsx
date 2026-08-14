import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import { RolePermissionPanel } from "../roles/RolePermissionPanel";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoCallout } from "../ui/DemoCallout";

export function RoleLandingPage({ role }: { role: DemoRole }) {
  const meta = DEMO_ROLE_META[role];
  const firstHref =
    role === "store_manager" ? "/demo/store-manager/evidence" : `${meta.basePath}/dashboard`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">{meta.actor}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{meta.label}</h2>
        <p className="mt-2 text-slate-600">{meta.description}</p>
        <p className="mt-1 text-sm text-slate-500">Phạm vi dữ liệu: {meta.scope}</p>
      </div>

      <DemoCallout variant="info">
        Chế độ demo — không ghi dữ liệu, không gọi Google API. Sidebar bên trái chỉ hiện module
        đúng quyền của {meta.label}.
      </DemoCallout>

      <RolePermissionPanel role={role} />

      <DemoActionButton href={firstHref} variant="primary">
        {role === "store_manager" ? "Bắt đầu tải bằng chứng" : "Vào Dashboard"}
      </DemoActionButton>
    </div>
  );
}
