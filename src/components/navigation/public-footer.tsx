import Link from "next/link";

import { siteConfig } from "@/src/lib/site";
import { cn } from "@/src/lib/utils";

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  return (
    <footer className={cn("border-t border-black/8 pt-6 text-sm text-[#6f685f]", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">
            Trust
          </p>
          <p>
            {siteConfig.name} keeps meal logging, targets, and history clear without extra
            noise.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4">
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-[#151515]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
