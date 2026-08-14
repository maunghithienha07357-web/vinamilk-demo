import type { DemoRole } from "../../constants/demoRoles";
import { DEMO_ROLE_META } from "../../constants/demoRoles";
import { NapDataGrid } from "../optimizer/NapDataGrid";
import { DemoCallout } from "../ui/DemoCallout";

export function OptimizerPage({ role }: { role: Extract<DemoRole, "admin" | "manager"> }) {
  const syncLogHref = `${DEMO_ROLE_META[role].basePath}/sync-log`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Module 3 — Bulk N.A.P & SEO Optimizer: Data Grid 5 cửa hàng Q7, Mass Update, 1-Click Sync.
        Thay đổi ghi vào bảng nap_change_sets trên Supabase.
      </p>

      <DemoCallout variant="info">
        Nút &quot;1-Click Sync&quot; tạo nhiều dòng trong bảng sync_jobs → Server Action gọi Google
        API theo batch nhỏ. {DEMO_ROLE_META[role].label} được đẩy dữ liệu lên Google. Xem nhật ký
        đồng bộ.
      </DemoCallout>

      <NapDataGrid syncLogHref={syncLogHref} />
    </div>
  );
}
