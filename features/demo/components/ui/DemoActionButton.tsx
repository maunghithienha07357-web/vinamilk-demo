import Link from "next/link";
import { cn } from "@/utils/cn";

export function DemoActionButton({
  href,
  children,
  variant = "primary",
  className,
  title,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  className?: string;
  title?: string;
}) {
  const variants = {
    primary: "bg-[#1a5c3a] text-white hover:bg-[#247a32]",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const baseClass = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <span
      className={cn(baseClass, "cursor-not-allowed opacity-60")}
      title={title ?? "Bản demo giao diện — thao tác này sẽ hoạt động ở bản production"}
    >
      {children}
    </span>
  );
}
