"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/src/components/ui/card";
import type { DailySummary } from "@/src/types/meal";

interface HistoryChartProps {
  days: DailySummary[];
}

export function HistoryChart({ days }: HistoryChartProps) {
  return (
    <Card className="h-80">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Nutrition history</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={days}>
          <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis yAxisId="kcal" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis yAxisId="grams" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              background: "rgba(255,255,255,0.95)",
            }}
          />
          <Line yAxisId="kcal" type="monotone" dataKey="kcal_total" stroke="#3b82f6" strokeWidth={3} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="protein_total" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="carbs_total" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
          <Line yAxisId="grams" type="monotone" dataKey="fat_total" stroke="#c084fc" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
