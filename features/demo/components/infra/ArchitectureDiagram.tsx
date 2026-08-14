import { DemoCard } from "../ui/DemoCard";

const NODES = [
  { id: "vercel", label: "Next.js on Vercel", sub: "App Router + Server Actions" },
  { id: "supabase", label: "Supabase", sub: "Postgres + Auth + RLS" },
  { id: "r2", label: "Cloudflare R2", sub: "Video & ảnh bằng chứng" },
  { id: "google", label: "Google Business Profile API", sub: "OAuth2 + Claim/Appeal/Verify" },
];

export function ArchitectureDiagram() {
  return (
    <DemoCard title="Kiến trúc tổng quan">
      <div className="flex flex-col items-center gap-4 py-6 md:flex-row md:justify-center md:gap-6">
        {NODES.map((node, i) => (
          <div key={node.id} className="flex items-center gap-4">
            <div className="rounded-xl border-2 border-[#1a5c3a] bg-white px-6 py-4 text-center shadow-sm min-w-[160px]">
              <p className="font-semibold text-slate-900">{node.label}</p>
              <p className="mt-1 text-xs text-slate-500">{node.sub}</p>
            </div>
            {i < NODES.length - 1 && (
              <span className="hidden text-2xl text-slate-400 md:inline">→</span>
            )}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}
