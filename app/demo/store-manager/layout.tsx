import { DemoShell } from "@/features/demo/components/shell/DemoShell";

export default function StoreManagerLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell role="store_manager">{children}</DemoShell>;
}
