import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/src/components/public/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Learn what MacroTrackr stores, why it is used, and how to request changes to your account data.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "What MacroTrackr stores",
    paragraphs: [
      "MacroTrackr stores the account details you use to sign in, along with the meal entries, nutrition goals, and history you create inside the app.",
      "That can include your email address, calories, protein, carbs, fats, and other notes you choose to save while tracking your routine.",
    ],
  },
  {
    title: "Why this data is used",
    paragraphs: [
      "This information is used to authenticate your account, save your progress, and show the dashboards, history views, and goal tracking features that make the product work.",
      "MacroTrackr uses this data to operate the service. It is not collected to be sold as a standalone product.",
    ],
  },
  {
    title: "Infrastructure and providers",
    paragraphs: [
      "MacroTrackr relies on core infrastructure providers to run the service. That includes Supabase for authentication and database storage, plus hosting and delivery providers required to serve the app securely.",
      "These providers only receive the data needed to help MacroTrackr function and are not intended to use it for unrelated marketing purposes.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "If you need your information corrected or want your account data removed, you can use the contact route below to make that request.",
      "MacroTrackr will continue refining this page as the product and support process become more formal.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="A simple explanation of what MacroTrackr stores and why."
      description="This page is written to be clear, practical, and honest about how the product handles account and nutrition data."
      sections={[...sections]}
    >
      <p>
        For privacy-related requests, visit{" "}
        <Link href="/contact" className="text-[#151515] underline underline-offset-4">
          /contact
        </Link>
        .
      </p>
    </LegalPage>
  );
}
