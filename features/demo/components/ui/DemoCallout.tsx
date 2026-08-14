import { cn } from "@/utils/cn";
import { Info } from "lucide-react";

export function DemoCallout({
  title,
  children,
  variant = "info",
}: {
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "success";
}) {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };

  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", variants[variant])}>
      <Info className="mt-0.5 h-5 w-5 shrink-0 opacity-70" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className="mt-1 text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
