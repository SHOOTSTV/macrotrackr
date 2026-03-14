import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/src/components/public/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Read the simple terms that govern your use of MacroTrackr as a nutrition tracking product.",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "What the service is",
    paragraphs: [
      "MacroTrackr is a web-based product for logging meals, reviewing nutrition history, and tracking calorie and macro goals over time.",
      "The product is offered as a practical tracking tool, not as a medical service or a substitute for professional advice.",
    ],
  },
  {
    title: "Using the product",
    paragraphs: [
      "You may use MacroTrackr for your own nutrition tracking and account management.",
      "You may not abuse the service, attempt to break access controls, interfere with the app, or use the product in a way that harms other users or the platform.",
    ],
  },
  {
    title: "Accounts and availability",
    paragraphs: [
      "You are responsible for the security of your account and for the accuracy of the information you choose to store in it.",
      "MacroTrackr may evolve, change features, or experience downtime while the product continues to develop.",
    ],
  },
  {
    title: "Limits and responsibility",
    paragraphs: [
      "MacroTrackr is provided on an MVP basis, with reasonable effort but without a promise that the service will always be uninterrupted or error-free.",
      "Nutrition information inside the app is for tracking and planning purposes only. It should not be treated as medical advice, diagnosis, or treatment guidance.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="The basic rules for using MacroTrackr."
      description="These terms are intentionally short and readable so the expectations around the product stay clear."
      sections={[...sections]}
    >
      <p>
        Questions about these terms can be routed through{" "}
        <Link href="/contact" className="text-[#151515] underline underline-offset-4">
          /contact
        </Link>
        .
      </p>
    </LegalPage>
  );
}
