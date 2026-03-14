"use client";

import dynamic from "next/dynamic";

import type { DailySummary } from "@/src/types/meal";

function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-[18px] bg-[#ddd6ca]/80 ${className ?? ""}`} />;
}

function HistoryChartSkeleton() {
  return (
    <div className="rounded-[24px] border border-black/8 bg-[#f8f4ee] p-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>
        <div className="hidden items-end gap-2 sm:flex">
          <Skeleton className="h-20 w-8 rounded-[12px] bg-[#e4ece9]" />
          <Skeleton className="h-28 w-8 rounded-[12px] bg-[#edf1ea]" />
          <Skeleton className="h-16 w-8 rounded-[12px] bg-[#f2eadb]" />
          <Skeleton className="h-24 w-8 rounded-[12px] bg-[#ece7f0]" />
        </div>
      </div>

      <div className="mt-6 flex h-[16rem] items-end gap-3 sm:gap-4">
        <Skeleton className="h-[42%] flex-1 rounded-[20px] bg-[#edf1ea]" />
        <Skeleton className="h-[58%] flex-1 rounded-[20px] bg-[#e4ece9]" />
        <Skeleton className="h-[36%] flex-1 rounded-[20px] bg-[#f2eadb]" />
        <Skeleton className="h-[70%] flex-1 rounded-[20px] bg-[#ece7f0]" />
        <Skeleton className="hidden h-[52%] flex-1 rounded-[20px] bg-[#edf1ea] sm:block" />
        <Skeleton className="hidden h-[78%] flex-1 rounded-[20px] bg-[#e4ece9] sm:block" />
        <Skeleton className="hidden h-[47%] flex-1 rounded-[20px] bg-[#f2eadb] sm:block" />
      </div>
    </div>
  );
}

const HistoryChart = dynamic(
  () =>
    import("@/src/features/dashboard/components/history-chart").then(
      (mod) => mod.HistoryChart,
    ),
  {
    ssr: false,
    loading: () => <HistoryChartSkeleton />,
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
