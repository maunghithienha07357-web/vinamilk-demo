import { STORE_MANAGER_OVERVIEW } from "../../constants/demoPanelData";
import { DemoCard } from "../ui/DemoCard";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoCallout } from "../ui/DemoCallout";

export function StoreEvidenceUpload() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <DemoCallout variant="info">
        Upload trực tiếp lên Cloudflare R2 qua presigned URL. Metadata (file_path) lưu bảng evidence
        trên Supabase. Bản demo không ghi file.
      </DemoCallout>

      <DemoCard title={`Evidence Checklist — ${STORE_MANAGER_OVERVIEW.name}`}>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <input type="checkbox" readOnly className="h-4 w-4" />
            Video mặt tiền cửa hàng (bắt buộc)
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" readOnly className="h-4 w-4" />
            Giấy phép kinh doanh
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" readOnly className="h-4 w-4" />
            Ảnh bảng hiệu
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" readOnly className="h-4 w-4" />
            Ảnh nội thất
          </li>
        </ul>
        <div className="mt-6 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">
            Kéo thả video/ảnh vào đây
            <br />
            <span className="text-xs">evidence/{STORE_MANAGER_OVERVIEW.id}/storefront.mp4 → Cloudflare R2</span>
          </p>
        </div>
        <DemoActionButton href="/demo/store-manager" variant="primary" className="mt-6 w-full">
          Gửi bằng chứng
        </DemoActionButton>
      </DemoCard>
    </div>
  );
}
