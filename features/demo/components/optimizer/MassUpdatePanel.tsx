import { DemoCard } from "../ui/DemoCard";

export function MassUpdatePanel({ selectedCount }: { selectedCount: number }) {
  if (selectedCount === 0) return null;

  return (
    <DemoCard title={`Mass Update — ${selectedCount} cửa hàng đã chọn`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-500">Mô tả doanh nghiệp</label>
          <textarea
            readOnly
            defaultValue="Vinamilk — Thương hiệu sữa hàng đầu Việt Nam từ 1976..."
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Ảnh nhận diện thương hiệu</label>
          <div className="mt-1 flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
            logo-vinamilk.png (demo)
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500">Liên kết mạng xã hội</label>
          <input
            readOnly
            defaultValue="https://facebook.com/vinamilk | https://instagram.com/vinamilk"
            className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Bản demo — áp dụng Mass Update sẽ ghi vào bảng nap_change_sets trên Supabase ở bản production.
      </p>
    </DemoCard>
  );
}
