"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { setAccessTokenCookie } from "@/src/lib/auth/client-auth";
import { supabaseBrowser } from "@/src/lib/supabase/browser";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
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
    <nav className="flex w-full gap-2 overflow-x-auto rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:w-auto md:flex-wrap md:overflow-visible">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const href = item.href;

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition",
              isActive
                ? "border-blue-300 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-900 shadow-[0_6px_16px_rgba(59,130,246,0.2)]"
                : "border-slate-200 bg-white/85 text-slate-700 hover:bg-slate-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        className="shrink-0 whitespace-nowrap rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
      >
        Sign out
      </button>
    </nav>
  );
}
