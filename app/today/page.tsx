import { formatISO, subDays } from "date-fns";

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { DayTotals } from "@/src/features/dashboard/components/day-totals";
import { GoalsProgressCard } from "@/src/features/dashboard/components/goals-progress-card";
import { MacroOverrunAlerts } from "@/src/features/dashboard/components/macro-overrun-alerts";
import { ManualMealForm } from "@/src/features/dashboard/components/manual-meal-form";
import { MealList } from "@/src/features/dashboard/components/meal-list";
import { MealSearchFavorites } from "@/src/features/dashboard/components/meal-search-favorites";
import { SmartMealReminderCard } from "@/src/features/dashboard/components/smart-meal-reminder";
import { StreakWeeklyCard } from "@/src/features/dashboard/components/streak-weekly-card";
import { WeightTrendCard } from "@/src/features/profile/components/weight-trend-card";
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

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Today
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Nutrition Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              User: <span className="font-medium">{userId}</span> - Date:{" "}
              {dashboard.date}
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>
      <ManualMealForm copyCandidates={copyCandidates} />
      <WeightTrendCard compact />
      <StreakWeeklyCard mode="today" />
      <GoalsProgressCard
        title="Today progress"
        consumed={{
          kcal: dashboard.summary.kcal_total,
          protein: dashboard.summary.protein_total,
          carbs: dashboard.summary.carbs_total,
          fat: dashboard.summary.fat_total,
        }}
        goals={goals}
      />
      <MacroOverrunAlerts
        day={dashboard.date}
        consumed={{
          kcal: dashboard.summary.kcal_total,
          protein: dashboard.summary.protein_total,
          carbs: dashboard.summary.carbs_total,
          fat: dashboard.summary.fat_total,
        }}
        goals={goals}
      />
      <DayTotals summary={dashboard.summary} />
      <MealSearchFavorites />
      <SmartMealReminderCard day={dashboard.date} reminder={smartReminder} />
      <MealList meals={dashboard.meals} />
    </main>
  );
}
