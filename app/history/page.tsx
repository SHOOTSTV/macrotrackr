import type { Metadata } from "next";
import { format, formatISO, subDays } from "date-fns";

export const metadata: Metadata = {
  title: "Nutrition history",
  description:
    "Explore your meal and macro history with trends and day-by-day summaries.",
  alternates: {
    canonical: "/history",
  },
  robots: {
    index: false,
    follow: false,
  },
};

import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { requireServerUserIdWithOnboarding } from "@/src/lib/auth/server-session";
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
  const userId = await requireServerUserIdWithOnboarding();
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

  const trackedDays = dashboard.days.length;
  const totalMeals = dashboard.meals.length;
  const averageCalories = trackedDays > 0
    ? Math.round(dashboard.days.reduce((sum, day) => sum + day.kcal_total, 0) / trackedDays)
    : 0;
  const averageProtein = trackedDays > 0
    ? Math.round(dashboard.days.reduce((sum, day) => sum + day.protein_total, 0) / trackedDays)
    : 0;

  const overviewStats = [
    {
      label: "Tracked days",
      value: String(trackedDays),
      note: "inside this range",
      tone: "text-[#151515]",
    },
    {
      label: "Meals logged",
      value: String(totalMeals),
      note: "entries recorded",
      tone: "text-[#365141]",
    },
    {
      label: "Avg calories",
      value: trackedDays > 0 ? `${averageCalories}` : "-",
      note: trackedDays > 0 ? "per tracked day" : "no data yet",
      tone: "text-[#93c5fd]",
    },
    {
      label: "Avg protein",
      value: trackedDays > 0 ? `${averageProtein} g` : "-",
      note: trackedDays > 0 ? "per tracked day" : "no data yet",
      tone: "text-[#7dd3fc]",
    },
  ];

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              History
            </p>
            <h1 className="text-4xl font-medium tracking-[-0.06em] text-[#151515]">
              Nutrition history
            </h1>
            <p className="text-sm leading-7 text-[#6f685f]">
              {format(new Date(from), "MMMM d")} - {format(new Date(to), "MMMM d, yyyy")} - {trackedDays} tracked day{trackedDays === 1 ? "" : "s"}
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px] xl:items-start">
        <section className="rounded-[34px] border border-black/8 bg-white/76 p-6 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-7">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
                Trend overview
              </p>
              <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.06em] text-[#151515] sm:text-[2.15rem]">
                See the pattern, not just the last meal.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#6f685f]">
                Review the range, compare the macro curves, and understand how the week is actually moving before you change anything.
              </p>
            </div>

            <HistoryDatePicker from={from} to={to} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overviewStats.map((item) => (
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
            <HistoryChartLazy days={dashboard.days} embedded title="Macro trend" className="h-[24rem]" />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-black/8 bg-white/72 p-5 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Quick add
            </p>
            <h2 className="mt-3 text-xl font-medium tracking-[-0.05em] text-[#151515]">
              Add something without leaving history.
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#6f685f]">
              Useful when you notice a missing meal while reviewing the range.
            </p>
            <div className="mt-5">
              <ManualMealForm enableCopyPrevious={false} />
            </div>
          </section>

          <StreakWeeklyCard mode="history" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
            Daily log
          </p>
          <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">
            Day-by-day entries
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[#6f685f]">
            Open each day to understand what was logged, how the totals landed, and where the pattern shifts.
          </p>
        </div>
        <HistoryDayGroups meals={dashboard.meals} goals={goals} />
      </section>
    </main>
  );
}
