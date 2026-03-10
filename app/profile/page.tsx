import type { Metadata } from "next";

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";

export const metadata: Metadata = {
  title: "Profile and nutrition goals",
  description:
    "Set your nutrition goals and monitor weight trends in your MacroTrackr profile.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
};
import { requireServerUserIdWithOnboarding } from "@/src/lib/auth/server-session";
import { GoalsForm } from "@/src/features/profile/components/goals-form";
import { WeightTrendCard } from "@/src/features/profile/components/weight-trend-card";
import { getNutritionGoalsOrDefault } from "@/src/lib/services/profile-goals";

export default async function ProfilePage() {
  const userId = await requireServerUserIdWithOnboarding();
  const goals = await getNutritionGoalsOrDefault(userId);

  const goalCards = [
    {
      label: "Calories",
      value: `${goals.kcal_target}`,
      note: "kcal each day",
      tone: "text-[#93c5fd]",
    },
    {
      label: "Protein",
      value: `${goals.protein_g_target} g`,
      note: "daily target",
      tone: "text-[#7dd3fc]",
    },
    {
      label: "Carbs",
      value: `${goals.carbs_g_target} g`,
      note: "daily target",
      tone: "text-[#b6a7e8]",
    },
    {
      label: "Fat",
      value: `${goals.fat_g_target} g`,
      note: "daily target",
      tone: "text-[#97b08f]",
    },
  ];

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Profile
            </p>
            <h1 className="text-4xl font-medium tracking-[-0.06em] text-[#151515]">
              Daily targets
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#6f685f]">
              Set the numbers that guide your day, then keep your weight trend easy to review in one place.
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:items-start">
        <section className="rounded-[34px] border border-black/8 bg-white/76 p-6 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-7">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Nutrition goals
            </p>
            <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.06em] text-[#151515] sm:text-[2.15rem]">
              Keep your targets clear before the day starts.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#6f685f]">
              These targets feed the progress bars you see across the app, so the whole experience stays consistent and easy to read.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {goalCards.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">
                  {item.label}
                </p>
                <p className={`mt-3 text-[1.8rem] font-medium tracking-[-0.06em] ${item.tone}`}>
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-[#6f685f]">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-black/6 bg-[#f8f4ee] p-5 sm:p-6">
            <GoalsForm initialGoals={goals} embedded />
          </div>
        </section>

        <WeightTrendCard />
      </section>
    </main>
  );
}
