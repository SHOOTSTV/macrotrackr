import { redirect } from "next/navigation";

import { OnboardingForm } from "@/src/features/profile/components/onboarding-form";
import { requireServerUserId } from "@/src/lib/auth/server-session";
import { getUserProfile } from "@/src/lib/services/onboarding";

export default async function OnboardingPage() {
  const userId = await requireServerUserId();
  const profile = await getUserProfile(userId);

  if (profile) {
    redirect("/today");
  }

  return (
    <main className="app-shell min-h-screen py-10">
      <OnboardingForm />
    </main>
  );
}
