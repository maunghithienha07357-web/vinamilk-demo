import Link from "next/link";
import { DemoActionButton } from "@/features/demo/components/ui/DemoActionButton";
import { DemoCard } from "@/features/demo/components/ui/DemoCard";
import { DemoStatCard } from "@/features/demo/components/ui/DemoStatCard";
import { DEMO_STORE_COUNTS } from "@/features/demo/constants/demoStores";

export default function DemoImportPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/demo/onboarding/consent" className="text-sm text-slate-500 hover:text-slate-700">
          ← Quay lại
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium text-[#1a5c3a]">Bước 2 / 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Data Ingestion — Nhập liệu & Phân loại tự động
        </h1>
        <p className="mt-4 text-slate-600">
          Import toàn bộ danh sách 560 cửa hàng vào Supabase Postgres. Hệ thống quét qua Google API
          và dán nhãn (Tagging) phân loại vào 4 nhóm trạng thái.
        </p>

        <DemoCard title="Tiến trình import" className="mt-8">
          <div className="space-y-4">
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full rounded-full bg-[#1a5c3a]" />
            </div>
            <p className="text-sm text-slate-600">
              Đã import <strong>560 / 560</strong> cửa hàng — lưu vào bảng{" "}
              <code className="rounded bg-slate-100 px-1">stores</code> + batch log{" "}
              <code className="rounded bg-slate-100 px-1">store_import_batches</code>
            </p>
          </div>
        </DemoCard>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DemoStatCard label="Claim" value={DEMO_STORE_COUNTS.claim} />
          <DemoStatCard label="Suspended" value={DEMO_STORE_COUNTS.suspended} accent="danger" />
          <DemoStatCard label="New" value={DEMO_STORE_COUNTS.new} accent="warning" />
          <DemoStatCard label="Verify" value={DEMO_STORE_COUNTS.verify} accent="success" />
        </div>

        <div className="mt-8 flex justify-between">
          <DemoActionButton href="/demo/onboarding" variant="outline">
            Quay lại
          </DemoActionButton>
          <DemoActionButton href="/demo/onboarding/roles" variant="primary">
            Tiếp tục → Bước 3
          </DemoActionButton>
        </div>
      </main>
    </div>
  );
}
