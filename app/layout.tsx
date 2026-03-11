import type { Metadata } from "next";
import { Geist_Mono, Jost } from "next/font/google";

import { SonnerToaster } from "@/src/components/ui/sonner";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macrotrackr.vercel.app"),
  title: {
    default: "AI Macro Tracker for Meal Logging",
    template: "%s | MacroTrackr",
  },
  description:
    "Track macros and calories with an AI macro tracker built for fast meal logging, simple nutrition goals, and clear daily progress.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "MacroTrackr",
    title: "AI Macro Tracker for Meal Logging",
    description:
      "Track macros and calories with an AI macro tracker built for fast meal logging, simple nutrition goals, and clear daily progress.",
    images: [
      {
        url: "/og-image-fallback.jpg",
        width: 1200,
        height: 630,
      },
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Macro Tracker for Meal Logging",
    description:
      "Track macros and calories with an AI macro tracker built for fast meal logging, simple nutrition goals, and clear daily progress.",
    images: ["/og-image-fallback.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${geistMono.variable} antialiased`}>
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}

