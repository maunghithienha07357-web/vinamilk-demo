import { DemoCard } from "../ui/DemoCard";

const STEPS = [
  "User bấm nút trên UI (Next.js Client Component)",
  "Server Action nhận request — đọc session Supabase Auth",
  "RLS kiểm tra quyền theo role + store_id",
  "Ghi metadata vào Postgres (Supabase) hoặc lấy signed URL từ R2",
  "Gọi Google Business Profile API (server-side, refresh token từ google_credentials)",
];

export function RequestFlowSteps() {
  return (
    <DemoCard title="Một request đi qua đâu? (5 bước)">
      <ol className="space-y-4">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a5c3a] text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="pt-1 text-sm text-slate-700">{step}</p>
          </li>
        ))}
      </ol>
    </DemoCard>
  );
}
