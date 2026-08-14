import { DEMO_R2_STATS, DEMO_STORAGE_FLOW } from "../../constants/demoCosts";
import { DemoCard } from "../ui/DemoCard";
import { CostComparison } from "./CostComparison";

export function StorageSplitPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DemoCard title="Supabase Storage">
          <p className="text-sm text-slate-600">
            <strong>Không dùng cho video</strong> trong phương án tối ưu. Chỉ phù hợp file nhỏ hoặc
            giai đoạn pilot tạm thời.
          </p>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-500">
            <li>Bucket evidence (MVP tạm)</li>
            <li>RLS theo store_id</li>
            <li>Egress có thể phát sinh phí</li>
          </ul>
        </DemoCard>
        <DemoCard title="Cloudflare R2 — Kho bằng chứng">
          <p className="text-sm text-slate-600">
            <strong>Video xác thực + ảnh bằng chứng</strong> lưu tại R2. Tương thích S3 API.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            <li>Storage: {DEMO_R2_STATS.storage}</li>
            <li className="font-semibold text-emerald-700">Egress: {DEMO_R2_STATS.egress}</li>
            <li>CDN: {DEMO_R2_STATS.cdn}</li>
          </ul>
        </DemoCard>
      </div>

      <DemoCard title="Luồng upload 4 bước">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_STORAGE_FLOW.map((step) => (
            <li
              key={step.step}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <span className="text-lg font-bold text-[#1a5c3a]">{step.step}</span>
              <p className="mt-2 font-medium text-slate-800">{step.title}</p>
              <p className="mt-1 text-xs text-slate-500">{step.description}</p>
            </li>
          ))}
        </ol>
      </DemoCard>

      <CostComparison />
    </div>
  );
}
