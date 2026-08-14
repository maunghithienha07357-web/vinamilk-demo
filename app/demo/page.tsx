import Link from "next/link";
import { DEMO_ONBOARDING_FLOW } from "@/features/demo/constants/demoNav";
import { DEMO_ROLE_LIST, DEMO_ROLE_META } from "@/features/demo/constants/demoRoles";
import { DemoActionButton } from "@/features/demo/components/ui/DemoActionButton";
import { DemoModeBadge } from "@/features/demo/components/shell/DemoModeBadge";

export default function DemoCoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8f6] to-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a5c3a] text-lg font-bold text-white">
              V
            </div>
            <div>
              <p className="font-bold text-slate-900">Vinamilk GBP Platform</p>
              <p className="text-xs text-slate-500">Demo UI/UX — 560 cửa hàng — không ghi dữ liệu</p>
            </div>
          </div>
          <DemoModeBadge />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Hệ thống Quản lý Google Business Profile
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Chọn vai trò để vào giao diện tương ứng. Sidebar và quyền khác nhau theo Admin / Manager
            / Store Manager. Không gọi backend.
          </p>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {DEMO_ROLE_LIST.map((id) => {
            const role = DEMO_ROLE_META[id];
            return (
              <div
                key={role.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">
                  {role.actor}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{role.label}</h2>
                <p className="mt-2 flex-1 text-sm text-slate-600">{role.description}</p>
                <p className="mt-3 text-xs text-slate-500">{role.scope}</p>
                <DemoActionButton href={role.basePath} variant="primary" className="mt-6 w-full">
                  Vào {role.label}
                </DemoActionButton>
              </div>
            );
          })}
        </section>

        <div className="mt-10 text-center">
          <DemoActionButton href="/demo/onboarding" variant="outline">
            Hoặc đi luồng onboarding (OAuth → Import → Phân quyền)
          </DemoActionButton>
        </div>

        <section className="mt-16">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
            Luồng thiết lập ban đầu
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {DEMO_ONBOARDING_FLOW.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <Link
                  href={step.href}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-shadow hover:border-[#1a5c3a] hover:shadow-md"
                >
                  {step.label}
                </Link>
                {i < DEMO_ONBOARDING_FLOW.length - 1 && (
                  <span className="text-slate-300">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            Hạ tầng (chỉ Admin): Vercel + Supabase + Cloudflare R2 —{" "}
            <Link href="/demo/admin/architecture" className="font-medium text-[#1a5c3a] hover:underline">
              Kiến trúc hệ thống
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
