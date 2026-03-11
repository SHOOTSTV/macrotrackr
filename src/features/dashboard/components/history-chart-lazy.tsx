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
      <div className="flex h-[22rem] items-center justify-center rounded-[24px] border border-black/8 bg-[#f8f4ee]">
        <p className="text-sm text-[#8b847d]">Loading chart...</p>
      </div>
    ),
  },
);

interface HistoryChartLazyProps {
  days: DailySummary[];
  embedded?: boolean;
  title?: string;
  className?: string;
}

export function HistoryChartLazy({ days, embedded, title, className }: HistoryChartLazyProps) {
  return <HistoryChart days={days} embedded={embedded} title={title} className={className} />;
}