import type { Metadata } from "next";

import { LegalPage } from "@/src/components/public/legal-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Use this page as the reference point for future support, privacy, and legal contact details for MacroTrackr.",
  alternates: {
    canonical: "/contact",
  },
};

const sections = [
  {
    title: "Support",
    paragraphs: [
      "MacroTrackr will publish its official support channel here as the product support workflow becomes formalized.",
      "Until then, treat this page as the reference location for future product contact details.",
    ],
  },
  {
    title: "Privacy",
    paragraphs: [
      "Requests related to account access, correction, or deletion should use the contact channel that will be listed on this page.",
      "The privacy page explains the kinds of account and nutrition data currently used to operate the service.",
    ],
  },
  {
    title: "Legal",
    paragraphs: [
      "Questions about the terms of service or other legal notices should also use the official contact details that will be published here.",
      "MacroTrackr keeps this page public so users always know where product, privacy, and legal communication will live.",
    ],
  },
] as const;

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Contact"
      title="The public home for support, privacy, and legal contact details."
      description="No email address is published yet. This page exists so MacroTrackr has a stable, honest place to point users when contact details are ready."
      sections={[...sections]}
    />
  );
}
