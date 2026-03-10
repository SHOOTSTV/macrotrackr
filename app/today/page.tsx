import type { Metadata } from "next";
import { format, formatISO, subDays } from "date-fns";

export const metadata: Metadata = {
  title: "Today dashboard",
  description: "View today's calories and macros, log meals, and stay on target.",
  alternates: {
    canonical: "/today",
  },
};

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { GoalsProgressCard } from "@/src/features/dashboard/components/goals-progress-card";
import { MacroOverrunAlerts } from "@/src/features/dashboard/components/macro-overrun-alerts";
import { ManualMealForm } from "@/src/features/dashboard/components/manual-meal-form";
import { MealList } from "@/src/features/dashboard/components/meal-list";
import { MealSearchFavorites } from "@/src/features/dashboard/components/meal-search-favorites";
import { SmartMealReminderCard } from "@/src/features/dashboard/components/smart-meal-reminder";
import { StreakWeeklyCard } from "@/src/features/dashboard/components/streak-weekly-card";
import { requireServerUserIdWithOnboarding } from "@/src/lib/auth/server-session";
import { getDayDashboard } from "@/src/lib/services/dashboard";
import { detectSmartMealReminder } from "@/src/lib/services/meal-reminders";
import { listMealsForCopyCandidates, listMealsForRange } from "@/src/lib/services/meals";
import { getNutritionGoals } from "@/src/lib/services/profile-goals";

export default async function TodayPage() {
  const userId = await requireServerUserIdWithOnboarding();
  const now = new Date();
  const date = formatISO(now, { representation: "date" });
  const yesterdayDate = formatISO(subDays(now, 1), { representation: "date" });
  const lastWeekDate = formatISO(subDays(now, 7), { representation: "date" });
  const recentFromDate = formatISO(subDays(now, 14), { representation: "date" });

  const [dashboard, goals, copyCandidates, recentMeals] = await Promise.all([
    getDayDashboard(userId, date),
    getNutritionGoals(userId),
    listMealsForCopyCandidates(userId, yesterdayDate, lastWeekDate),
    listMealsForRange(userId, recentFromDate, date),
  ]);

  const smartReminder = detectSmartMealReminder(recentMeals, dashboard.meals, now);
  const consumed = {
    kcal: dashboard.summary.kcal_total,
    protein: dashboard.summary.protein_total,
    carbs: dashboard.summary.carbs_total,
    fat: dashboard.summary.fat_total,
  };

  const hasOverrun = goals
    ? (
      consumed.kcal > goals.kcal_target
      || consumed.protein > goals.protein_g_target
      || consumed.carbs > goals.carbs_g_target
      || consumed.fat > goals.fat_g_target
    )
    : false;

  const statusTone = hasOverrun
    ? {
        label: "Adjusting",
        className: "bg-[#f5dfdb] text-[#8a3d30]",
      }
    : dashboard.summary.meals_count > 0
      ? {
          label: "On track",
          className: "bg-[#dde7d9] text-[#365141]",
        }
      : {
          label: "Ready",
          className: "bg-[#ede7de] text-[#5f5a53]",
        };

  const summaryStats = [
    {
      label: "Meals",
      value: String(dashboard.summary.meals_count),
      note: "logged today",
      tone: "text-[#151515]",
    },
    {
      label: "Calories",
      value: `${consumed.kcal}`,
      note: goals ? `${Math.max(goals.kcal_target - consumed.kcal, 0).toFixed(0)} left` : "consumed",
      tone: "text-[#93c5fd]",
    },
    {
      label: "Protein",
      value: `${consumed.protein} g`,
      note: goals ? `${Math.max(goals.protein_g_target - consumed.protein, 0).toFixed(0)} g left` : "consumed",
      tone: "text-[#7dd3fc]",
    },
    {
      label: "Carbs",
      value: `${consumed.carbs} g`,
      note: goals ? `${Math.max(goals.carbs_g_target - consumed.carbs, 0).toFixed(0)} g left` : "consumed",
      tone: "text-[#b6a7e8]",
    },
    {
      label: "Fat",
      value: `${consumed.fat} g`,
      note: goals ? `${Math.max(goals.fat_g_target - consumed.fat, 0).toFixed(0)} g left` : "consumed",
      tone: "text-[#97b08f]",
    },
  ];

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Today
            </p>
            <h1 className="text-4xl font-medium tracking-[-0.06em] text-[#151515]">
              Nutrition dashboard
            </h1>
            <p className="text-sm leading-7 text-[#6f685f]">
              {format(now, "EEEE, MMMM d")} - {dashboard.summary.meals_count} meal{dashboard.summary.meals_count === 1 ? "" : "s"} logged
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_360px] xl:items-start">
        <section className="rounded-[34px] border border-black/8 bg-white/76 p-6 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
                Daily overview
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.06em] text-[#151515] sm:text-[2.15rem]">
                Stay oriented through the day.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-[#6f685f]">
                Everything important stays in one place: what you logged, what is left, and whether the day still feels on track.
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone.className}`}>
              {statusTone.label}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {summaryStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4"
              >
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
            <GoalsProgressCard
              title="Today progress"
              consumed={consumed}
              goals={goals}
              embedded
            />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-black/8 bg-white/72 p-5 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Quick actions
            </p>
            <h2 className="mt-3 text-xl font-medium tracking-[-0.05em] text-[#151515]">
              Log or reuse a meal quickly.
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#6f685f]">
              Keep momentum with the fastest path back into your routine.
            </p>
            <div className="mt-5">
              <ManualMealForm copyCandidates={copyCandidates} />
            </div>
          </section>

          <StreakWeeklyCard mode="today" />
          <SmartMealReminderCard day={dashboard.date} reminder={smartReminder} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
        <MealSearchFavorites />

        <section className="rounded-[30px] border border-black/8 bg-white/72 p-5 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
                Meals
              </p>
              <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">
                Recent meals
              </h2>
            </div>
            <div className="rounded-full border border-black/8 bg-[#f8f4ee] px-4 py-2 text-sm text-[#5f5a53]">
              {dashboard.meals.length} entr{dashboard.meals.length === 1 ? "y" : "ies"} today
            </div>
          </div>
          <div className="mt-5">
            <MealList meals={dashboard.meals} embedded />
          </div>
        </section>
      </section>

      <MacroOverrunAlerts day={dashboard.date} consumed={consumed} goals={goals} />
    </main>
  );
}