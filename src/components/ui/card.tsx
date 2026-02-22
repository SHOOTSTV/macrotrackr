import type { PropsWithChildren } from "react";

import { cn } from "@/src/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur",
        className,
      )}
    >
      {children}
    </section>
  );
}
