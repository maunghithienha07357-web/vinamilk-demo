import type { ReactNode, Ref } from "react";
import { cn } from "@/utils/cn";

export function DemoCard({
  title,
  children,
  className,
  action,
  contentRef,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  contentRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={contentRef}
      className={cn("rounded-xl border border-slate-200 bg-white shadow-card", className)}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
