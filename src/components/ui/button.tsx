import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/src/lib/utils";

interface ButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          && "bg-[#151515] text-[#f4efe7] hover:-translate-y-0.5 hover:bg-[#222222]",
        variant === "ghost"
          && "border border-black/8 bg-white/72 text-[#151515] hover:bg-black/4",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

