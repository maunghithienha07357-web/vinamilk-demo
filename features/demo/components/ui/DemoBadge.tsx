import { cn } from "@/utils/cn";

export function DemoBadge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success";
  className?: string;
}) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-800",
    success: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
