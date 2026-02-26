import { formatISO } from "date-fns";

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { DayTotals } from "@/src/features/dashboard/components/day-totals";
import { GoalsProgressCard } from "@/src/features/dashboard/components/goals-progress-card";
import { ManualMealForm } from "@/src/features/dashboard/components/manual-meal-form";
import { MealList } from "@/src/features/dashboard/components/meal-list";
import { requireServerUserId } from "@/src/lib/auth/server-session";
import { getDayDashboard } from "@/src/lib/services/dashboard";
import { getNutritionGoals } from "@/src/lib/services/profile-goals";

export default async function TodayPage() {
  const userId = await requireServerUserId();
  const date = formatISO(new Date(), { representation: "date" });

  const dashboard = await getDayDashboard(userId, date);
  const goals = await getNutritionGoals(userId);

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
      <ManualMealForm />
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
      <DayTotals summary={dashboard.summary} />
      <MealList meals={dashboard.meals} />
    </main>
  );
}
