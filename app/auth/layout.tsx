import type { Metadata } from "next";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to MacroTrackr to log meals, track macros, and manage nutrition goals.",
  alternates: {
    canonical: "/auth",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return children;
}
