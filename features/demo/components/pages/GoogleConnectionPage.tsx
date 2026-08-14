import { DemoCard } from "../ui/DemoCard";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoBadge } from "../ui/DemoBadge";

export function GoogleConnectionPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Trạng thái kết nối OAuth2 với Google Business Profile API. Refresh token mã hoá trong bảng
        google_credentials — chỉ Server Action / Admin đọc được. Manager không truy cập bảng này.
      </p>

      <DemoCard title="Trạng thái kết nối">
        <div className="flex flex-wrap items-center gap-4">
          <DemoBadge variant="success">Đã kết nối</DemoBadge>
          <span className="text-sm text-slate-600">admin@vinamilk.com.vn</span>
          <span className="text-xs text-slate-500">Cập nhật lần cuối: 12/08/2026 08:30</span>
        </div>
      </DemoCard>

      <DemoCard title="Scope đã cấp">
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• business.manage — Quản lý thông tin doanh nghiệp</li>
          <li>• Đọc/trả lời review</li>
          <li>• Claim / Appeal / Verify</li>
        </ul>
      </DemoCard>

      <DemoCard title="Quota API">
        <p className="text-sm text-slate-600">
          Xử lý sync_jobs theo lô 5 request/lần, nghỉ giữa các lô để tránh vượt quota Google.
        </p>
      </DemoCard>

      <DemoActionButton href="/demo/admin/sync-log" variant="primary">
        Đồng bộ ngay → Xem nhật ký
      </DemoActionButton>
    </div>
  );
}
