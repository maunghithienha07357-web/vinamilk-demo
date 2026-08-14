import { StorageSplitPanel } from "../infra/StorageSplitPanel";

export function StoragePage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Cloudflare R2 lưu video/ảnh bằng chứng — Egress Fee = $0. Supabase chỉ lưu file_path trỏ
        tới R2. Chỉ Admin thấy trang kho.
      </p>
      <StorageSplitPanel />
    </div>
  );
}
