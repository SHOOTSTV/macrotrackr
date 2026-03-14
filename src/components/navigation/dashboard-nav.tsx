"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { setAccessTokenCookie } from "@/src/lib/auth/client-auth";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/today", label: "Today" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    setAccessTokenCookie(null);
    router.replace("/auth");
  }

  return (
    <nav className="flex w-full items-center gap-2 overflow-x-auto rounded-[26px] border border-black/8 bg-[#f8f4ee]/92 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_36px_rgba(21,21,21,0.05)] backdrop-blur-xl md:w-auto md:flex-wrap md:overflow-visible">
      <div className="flex min-w-max items-center gap-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition duration-200",
                isActive
                  ? "bg-white text-[#151515] shadow-[0_10px_22px_rgba(21,21,21,0.08)]"
                  : "text-[#6a645d] hover:bg-white/70 hover:text-[#151515]",
              )}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-[#151515]" /> : null}
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="hidden h-6 w-px bg-black/8 md:block" />

      <button
        type="button"
        onClick={handleLogout}
        className="shrink-0 whitespace-nowrap rounded-full border border-[#ead4ce] bg-[#fbf3f0] px-4 py-2.5 text-sm font-medium text-[#a55443] transition duration-200 hover:bg-[#f7e7e1]"
      >
        Sign out
      </button>
    </nav>
  );
}
