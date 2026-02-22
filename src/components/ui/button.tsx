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
        "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_6px_20px_rgba(59,130,246,0.35)] hover:from-blue-500 hover:to-indigo-500",
        variant === "ghost" &&
          "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100/90 hover:text-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
