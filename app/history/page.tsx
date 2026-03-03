import { formatISO, subDays } from "date-fns";

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { requireServerUserId } from "@/src/lib/auth/server-session";
import { Card } from "@/src/components/ui/card";
import { DayTotals } from "@/src/features/dashboard/components/day-totals";
import { HistoryChartLazy } from "@/src/features/dashboard/components/history-chart-lazy";
import { HistoryDatePicker } from "@/src/features/dashboard/components/history-date-picker";
import { HistoryDayGroups } from "@/src/features/dashboard/components/history-day-groups";
import { ManualMealForm } from "@/src/features/dashboard/components/manual-meal-form";
import { StreakWeeklyCard } from "@/src/features/dashboard/components/streak-weekly-card";
import { getRangeDashboard } from "@/src/lib/services/dashboard";
import { getNutritionGoals } from "@/src/lib/services/profile-goals";

const DEFAULT_DAYS = 7;

interface HistoryPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

function clampDate(date: string, max: string): string {
  return date > max ? max : date;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const userId = await requireServerUserId();
  const params = await searchParams;

  const today = formatISO(new Date(), { representation: "date" });
  const to = params.to ? clampDate(params.to, today) : today;
  const from = params.from && params.from <= to
    ? params.from
    : formatISO(subDays(new Date(to), DEFAULT_DAYS - 1), { representation: "date" });

  const [dashboard, goals] = await Promise.all([
    getRangeDashboard(userId, from, to),
    getNutritionGoals(userId),
  ]);
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
          </div>
          <DashboardNav />
        </div>
        <div className="mt-4">
          <HistoryDatePicker from={from} to={to} />
        </div>
      </header>

      <ManualMealForm />
      <StreakWeeklyCard mode="history" />
      <HistoryChartLazy days={dashboard.days} />
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
