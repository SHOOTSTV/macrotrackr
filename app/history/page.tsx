import { formatISO, subDays } from "date-fns";

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { requireServerUserId } from "@/src/lib/auth/server-session";
import { Card } from "@/src/components/ui/card";
import { DayTotals } from "@/src/features/dashboard/components/day-totals";
import { HistoryChart } from "@/src/features/dashboard/components/history-chart";
import { HistoryDayGroups } from "@/src/features/dashboard/components/history-day-groups";
import { ManualMealForm } from "@/src/features/dashboard/components/manual-meal-form";
import { getRangeDashboard } from "@/src/lib/services/dashboard";
import { getNutritionGoals } from "@/src/lib/services/profile-goals";

export default async function HistoryPage() {
  const userId = await requireServerUserId();
  const to = formatISO(new Date(), { representation: "date" });
  const from = formatISO(subDays(new Date(to), 4), { representation: "date" });

  const dashboard = await getRangeDashboard(userId, from, to);
  const goals = await getNutritionGoals(userId);
  const latestDay = dashboard.days[dashboard.days.length - 1];

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              History
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Nutrition Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              User: <span className="font-medium">{userId}</span> - {from} to{" "}
              {to}
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>

      <ManualMealForm />
      <HistoryChart days={dashboard.days} />
      <Card>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Latest day summary
        </h2>
        {latestDay ? <DayTotals summary={latestDay} /> : <p>No data available</p>}
      </Card>
      <HistoryDayGroups meals={dashboard.meals} goals={goals} />
    </main>
  );
}
