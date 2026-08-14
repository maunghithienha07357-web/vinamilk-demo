import Link from "next/link";
import { DemoActionButton } from "@/features/demo/components/ui/DemoActionButton";
import { DEMO_ROLE_LIST, DEMO_ROLE_META } from "@/features/demo/constants/demoRoles";

export default function DemoRolesPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/demo/onboarding/import" className="text-sm text-slate-500 hover:text-slate-700">
          ← Quay lại
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-medium text-[#1a5c3a]">Bước 3 / 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Phân quyền UI (Role-based Access Control)
        </h1>
        <p className="mt-4 text-slate-600">
          Ba vai trò, ba URL riêng. Chọn vai trò để vào giao diện — sidebar chỉ hiện đúng module
          được phép. Có thể đổi role bằng 3 nút trên header.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DEMO_ROLE_LIST.map((id) => {
            const role = DEMO_ROLE_META[id];
            return (
              <div
                key={role.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#1a5c3a]">
                  {role.actor}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900">{role.label}</h3>
                <p className="mt-2 text-sm text-slate-600">{role.description}</p>
                <p className="mt-2 text-xs text-slate-500">{role.scope}</p>
                <DemoActionButton href={role.basePath} variant="primary" className="mt-6 w-full">
                  Vào {role.label}
                </DemoActionButton>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
