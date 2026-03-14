import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/src/lib/site";

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
  openGraph: {
    type: "website",
    url: "/auth",
    siteName: siteConfig.name,
    title: "Sign in | MacroTrackr",
    description:
      "Sign in to MacroTrackr to log meals, track macros, and manage nutrition goals.",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Sign in | MacroTrackr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in | MacroTrackr",
    description:
      "Sign in to MacroTrackr to log meals, track macros, and manage nutrition goals.",
    images: [siteConfig.ogImage],
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return children;
}

