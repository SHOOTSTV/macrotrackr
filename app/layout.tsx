import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SonnerToaster } from "@/src/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macrotrackr.vercel.app"),
  title: {
    default: "MacroTrackr",
    template: "%s | MacroTrackr",
  },
  description:
    "Track calories and macros fast with AI meal logging and dashboard editing.",
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
    title: "MacroTrackr | AI Nutrition Tracker",
    description:
      "Track calories and macros fast with AI meal logging and dashboard editing.",
    images: [
      {
        url: "/og-image-fallback.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MacroTrackr | AI Nutrition Tracker",
    description:
      "Track calories and macros fast with AI meal logging and dashboard editing.",
    images: ["/og-image-fallback.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}
