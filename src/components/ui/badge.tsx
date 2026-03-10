import type { PropsWithChildren } from "react";

import { cn } from "@/src/lib/utils";

interface BadgeProps extends PropsWithChildren {
  className?: string;
  variant?: "default" | "warning";
}

export function Badge({
  className,
  variant = "default",
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        variant === "default" && "border-[#dbe4d7] bg-[#edf1ea] text-[#365141]",
        variant === "warning" && "border-[#ead8b6] bg-[#f2eadb] text-[#7a5b33]",
        className,
      )}
    >
      {children}
    </span>
  );
}
