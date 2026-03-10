import type { PropsWithChildren } from "react";

import { cn } from "@/src/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-black/8 bg-white/72 p-5 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

