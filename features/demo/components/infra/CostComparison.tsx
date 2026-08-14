import { DEMO_COST_COMPARISON } from "../../constants/demoCosts";
import { DemoCard } from "../ui/DemoCard";

export function CostComparison() {
  return (
    <DemoCard title="So sánh chi phí hạ tầng (theo PHƯƠNG ÁN THIẾT KẾ UI)">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Tiêu chí</th>
              <th className="px-3 py-2">AWS Cloud</th>
              <th className="px-3 py-2">Vercel + Supabase + R2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_COST_COMPARISON.map((row) => (
              <tr key={row.criterion}>
                <td className="px-3 py-2 font-medium text-slate-800">{row.criterion}</td>
                <td className="px-3 py-2 text-slate-600">{row.aws}</td>
                <td className="px-3 py-2 text-emerald-700">{row.vercel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm font-medium text-[#1a5c3a]">
        → Chốt phương án 2: ~$85–125/tháng, Egress Fee = $0 với R2
      </p>
    </DemoCard>
  );
}
