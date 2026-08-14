import Link from "next/link";
import { cn } from "@/utils/cn";

export function DemoStatCard({
  label,
  value,
  href,
  onDetail,
  hint,
  accent = "default",
}: {
  label: string;
  value: string | number;
  href?: string;
  onDetail?: () => void;
  hint?: string;
  accent?: "default" | "danger" | "warning" | "success";
}) {
  const accentClasses = {
    default: "border-slate-200 bg-white",
    danger: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    success: "border-emerald-200 bg-emerald-50",
  };

  const clickable = Boolean(href || onDetail);

  const content = (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow hover:shadow-card-hover",
        accentClasses[accent],
        clickable && "cursor-pointer",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );

  if (onDetail) {
    return (
      <button type="button" onClick={onDetail} className="w-full text-left">
        {content}
      </button>
    );
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
