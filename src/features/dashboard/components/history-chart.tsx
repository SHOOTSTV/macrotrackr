"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/src/components/ui/card";
import type { DailySummary } from "@/src/types/meal";

interface HistoryChartProps {
  days: DailySummary[];
  embedded?: boolean;
  title?: string;
  className?: string;
}

export function HistoryChart({
  days,
  embedded = false,
  title = "Nutrition history",
  className,
}: HistoryChartProps) {
  const content = (
    <>
      <h2 className="mb-4 text-lg font-medium tracking-[-0.04em] text-[#151515]">{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={days}>
          <XAxis dataKey="day" tick={{ fill: "#7a736b", fontSize: 12 }} />
          <YAxis yAxisId="kcal" tick={{ fill: "#7a736b", fontSize: 12 }} />
          <YAxis yAxisId="grams" orientation="right" tick={{ fill: "#7a736b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "1px solid rgba(21,21,21,0.08)",
              background: "rgba(255,255,255,0.88)",
            }}
          />
          <Line yAxisId="kcal" type="monotone" dataKey="kcal_total" stroke="#93c5fd" strokeWidth={3} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="protein_total" stroke="#7dd3fc" strokeWidth={2.5} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="carbs_total" stroke="#b6a7e8" strokeWidth={2.5} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="fat_total" stroke="#97b08f" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </>
  )

  if (embedded) {
    return <div className={className ?? "h-[22rem]"}>{content}</div>
  }

  return <Card className={className ?? "h-80"}>{content}</Card>
}