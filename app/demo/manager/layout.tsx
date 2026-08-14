import { DemoShell } from "@/features/demo/components/shell/DemoShell";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell role="manager">{children}</DemoShell>;
}
