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
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        variant === "default" && "bg-blue-50 text-blue-700",
        variant === "warning" && "bg-amber-100 text-amber-700",
        className
      )}
    >
      {children}
    </span>
  );
}
