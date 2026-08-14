import Link from "next/link";
import { DemoActionButton } from "@/features/demo/components/ui/DemoActionButton";
import { DemoCard } from "@/features/demo/components/ui/DemoCard";

const SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
  "Xem và quản lý thông tin doanh nghiệp trên Google",
  "Đọc và trả lời đánh giá khách hàng",
  "Cập nhật giờ hoạt động, địa chỉ, danh mục",
];

export default function DemoConsentPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <Link href="/demo/onboarding" className="text-sm text-slate-500 hover:text-slate-700">
          ← Quay lại
        </Link>
      </header>
      <main className="mx-auto max-w-md px-6 py-12">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="text-2xl">G</span>
          </div>
          <h1 className="mt-6 text-xl font-semibold text-slate-900">
            Vinamilk GBP Platform muốn truy cập tài khoản Google của bạn
          </h1>
          <p className="mt-2 text-sm text-slate-500">admin@vinamilk.com.vn</p>
        </div>

        <DemoCard title="Quyền được yêu cầu (scope)" className="mt-8">
          <ul className="space-y-3">
            {SCOPES.map((scope, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-600">✓</span>
                {scope}
              </li>
            ))}
          </ul>
        </DemoCard>

        <p className="mt-6 text-center text-xs text-slate-500">
          Mock màn hình Google OAuth — bản production redirect thật qua /api/google/oauth/callback
        </p>

        <div className="mt-8 flex gap-3">
          <DemoActionButton href="/demo/onboarding" variant="outline" className="flex-1">
            Hủy
          </DemoActionButton>
          <DemoActionButton href="/demo/onboarding/import" variant="primary" className="flex-1">
            Cho phép
          </DemoActionButton>
        </div>
      </main>
    </div>
  );
}
