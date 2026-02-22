import type { InputHTMLAttributes } from "react";

import { cn } from "@/src/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 transition focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
