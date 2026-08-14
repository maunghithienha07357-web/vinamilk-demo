import Link from "next/link";
import { DemoActionButton } from "@/features/demo/components/ui/DemoActionButton";
import { DemoCallout } from "@/features/demo/components/ui/DemoCallout";
import { DemoCard } from "@/features/demo/components/ui/DemoCard";

export default function DemoOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/demo" className="text-sm text-slate-500 hover:text-slate-700">
          ← Về trang bìa
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm font-medium text-[#1a5c3a]">Bước 1 / 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Ủy quyền API (OAuth 2.0 Authorization)
        </h1>
        <p className="mt-4 text-slate-600">
          Tích hợp Google Business Profile API. Vinamilk (hoặc Agency) chỉ cần đăng nhập tài khoản
          Google quản trị gốc <strong>1 lần duy nhất</strong>, hệ thống tự động cấp quyền truy cập
          hai chiều.
        </p>

        <DemoCallout title="Backend vận hành" variant="info">
          Route <code className="rounded bg-white/50 px-1">/api/google/oauth/start</code> redirect
          sang Google → callback lưu refresh_token mã hoá vào bảng{" "}
          <code className="rounded bg-white/50 px-1">google_credentials</code> trên Supabase (chỉ
          server đọc được).
        </DemoCallout>

        <DemoCard title="Kết nối tài khoản Google" className="mt-8">
          <p className="mb-6 text-sm text-slate-600">
            Bấm nút bên dưới để mô phỏng luồng OAuth — không thực sự gọi Google API.
          </p>
          <DemoActionButton href="/demo/onboarding/consent" variant="primary" className="w-full py-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </DemoActionButton>
        </DemoCard>

        <div className="mt-8 flex justify-between">
          <DemoActionButton href="/demo" variant="outline">
            Quay lại
          </DemoActionButton>
          <DemoActionButton href="/demo/onboarding/import" variant="secondary">
            Bỏ qua → Bước 2
          </DemoActionButton>
        </div>
      </main>
    </div>
  );
}
