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
    <main className="app-shell flex min-h-screen items-center py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.96fr)] lg:items-center">
        <section className="rounded-[34px] border border-black/8 bg-white/76 p-7 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-8">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-black/8 bg-[#f8f4ee] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Onboarding
            </div>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-medium tracking-[-0.065em] text-[#151515] sm:text-[3.2rem]">
                Set your baseline once, then let the app stay clear every day.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-[#6f685f]">
                We use a few profile details to generate starting nutrition targets. You can always fine-tune them later in your profile.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">1. Profile</p>
                <p className="mt-2 text-sm leading-6 text-[#4f4a43]">Age, height, weight, and sex build your starting point.</p>
              </div>
              <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">2. Activity</p>
                <p className="mt-2 text-sm leading-6 text-[#4f4a43]">Your routine helps estimate realistic daily needs.</p>
              </div>
              <div className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">3. Goal</p>
                <p className="mt-2 text-sm leading-6 text-[#4f4a43]">We turn that into daily calorie and macro targets.</p>
              </div>
            </div>
          </div>
        </section>

        <OnboardingForm />
      </div>
    </main>
  );
}
