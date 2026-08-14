import { DemoShell } from "@/features/demo/components/shell/DemoShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell role="admin">{children}</DemoShell>;
}
