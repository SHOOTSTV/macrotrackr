import type { InputHTMLAttributes } from "react";

import { cn } from "@/src/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-[18px] border border-black/8 bg-white/82 px-3.5 py-2.5 text-sm text-[#151515] outline-none ring-[#d8e2d6] transition focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}

