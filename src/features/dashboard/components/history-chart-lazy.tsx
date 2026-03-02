"use client";

import dynamic from "next/dynamic";

import type { DailySummary } from "@/src/types/meal";

const HistoryChart = dynamic(
  () =>
    import("@/src/features/dashboard/components/history-chart").then(
      (mod) => mod.HistoryChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-white/70 bg-white/80">
        <p className="text-sm text-slate-400">Loading chart...</p>
      </div>
    ),
  },
);

interface HistoryChartLazyProps {
  days: DailySummary[];
}

export function HistoryChartLazy({ days }: HistoryChartLazyProps) {
  return <HistoryChart days={days} />;
}
