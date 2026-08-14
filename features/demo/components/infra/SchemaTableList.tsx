import { DEMO_RLS_POLICIES, DEMO_SCHEMA_TABLES, DEMO_SUPABASE_STATS } from "../../constants/demoSchema";
import { DemoCard } from "../ui/DemoCard";
import { DemoBadge } from "../ui/DemoBadge";

export function SchemaTableList() {
  return (
    <div className="space-y-6">
      <DemoCard title="Supabase — lưu gì?">
        <p className="mb-4 text-sm text-slate-600">
          Text, metadata, trạng thái, path file — <strong>không lưu binary video/ảnh</strong> trong
          Postgres. Gói {DEMO_SUPABASE_STATS.plan}: {DEMO_SUPABASE_STATS.storage}.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Bảng</th>
                <th className="px-3 py-2">Mô tả</th>
                <th className="px-3 py-2">Cột chính</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_SCHEMA_TABLES.map((t) => (
                <tr key={t.name}>
                  <td className="px-3 py-2 font-mono text-xs text-[#1a5c3a]">{t.name}</td>
                  <td className="px-3 py-2 text-slate-600">{t.description}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{t.keyColumns.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoCard>

      <DemoCard title="Row Level Security (RLS)">
        <div className="space-y-3">
          {DEMO_RLS_POLICIES.map((p) => (
            <div key={p.table} className="rounded-lg border border-slate-200 p-4">
              <p className="font-mono text-sm font-semibold text-slate-800">{p.table}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <DemoBadge variant="success">Admin: {p.admin}</DemoBadge>
                <DemoBadge variant="warning">Manager: {p.manager}</DemoBadge>
                <DemoBadge>Store Manager: {p.storeManager}</DemoBadge>
              </div>
            </div>
          ))}
        </div>
      </DemoCard>
    </div>
  );
}
