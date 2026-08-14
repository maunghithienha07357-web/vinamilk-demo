import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinamilk GBP — Demo UI/UX",
  description: "Demo giao diện hệ thống quản lý Google Business Profile cho Vinamilk",
};

export default function DemoRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
}
