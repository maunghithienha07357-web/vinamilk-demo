import { ArchitectureDiagram } from "../infra/ArchitectureDiagram";
import { RequestFlowSteps } from "../infra/RequestFlowSteps";

export function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Kiến trúc tổng quan: Next.js (Vercel) ↔ Supabase (Postgres/Auth/RLS) ↔ Cloudflare R2 ↔
        Google Business Profile API. Chỉ Admin thấy trang này.
      </p>
      <ArchitectureDiagram />
      <RequestFlowSteps />
    </div>
  );
}
