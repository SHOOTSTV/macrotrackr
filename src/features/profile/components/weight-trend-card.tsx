"use client";

import { formatISO, subDays } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { WeightTrendPayload } from "@/src/types/weight";

interface WeightTrendCardProps {
  compact?: boolean;
}

const DEFAULT_DAYS = 30;

export function WeightTrendCard({ compact = false }: WeightTrendCardProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weightKg, setWeightKg] = useState("");
  const [trend, setTrend] = useState<WeightTrendPayload | null>(null);

  const range = useMemo(() => {
    const now = new Date();
    return {
      from: formatISO(subDays(now, DEFAULT_DAYS - 1), { representation: "date" }),
      to: formatISO(now, { representation: "date" }),
    };
  }, []);

  const fetchTrend = useCallback(async () => {
    setLoading(true);
    try {
      const authHeaders = await getAuthHeaders();
      const params = new URLSearchParams(range);
      const response = await fetch(`/api/weight?${params.toString()}`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load weight trend");
      }

      const payload = (await response.json()) as { data: WeightTrendPayload };
      setTrend(payload.data);
    } catch {
      toast.error("Unable to load weight trend");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void fetchTrend();
  }, [fetchTrend]);

  async function submitWeight(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numeric = Number(weightKg);
    if (Number.isNaN(numeric) || numeric <= 0) {
      toast.error("Please enter a valid weight in kg");
      return;
    }

    setSaving(true);
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ weight_kg: numeric }),
      });

      if (!response.ok) {
        throw new Error("Failed to save weight");
      }

      setWeightKg("");
      toast.success("Weight logged");
      await fetchTrend();
    } catch {
      toast.error("Unable to save weight");
    } finally {
      setSaving(false);
    }
  }

  const chartData = (trend?.points ?? [])
    .map((point) => ({
      day: point.day,
      weight_kg: point.weight_kg > 0 ? point.weight_kg : null,
      trend_7d: point.trend_7d > 0 ? point.trend_7d : null,
    }))
    .filter((point) => point.weight_kg !== null || point.trend_7d !== null);

  const loggedPoints = chartData.filter((point) => point.weight_kg !== null).length;
  const latestWeight = trend?.summary.latest_weight_kg;
  const weeklyChange = trend?.summary.weekly_change_kg;

  const stats = [
    {
      label: "Latest",
      value: latestWeight ? `${latestWeight} kg` : "-",
      note: "most recent log",
      tone: "text-[#151515]",
    },
    {
      label: "Weekly change",
      value: weeklyChange !== null && weeklyChange !== undefined
        ? `${weeklyChange > 0 ? "+" : ""}${weeklyChange} kg`
        : "-",
      note: weeklyChange !== null && weeklyChange !== undefined ? "over 7 days" : "not enough data yet",
      tone: weeklyChange !== null && weeklyChange !== undefined
        ? weeklyChange <= 0
          ? "text-[#365141]"
          : "text-[#66557e]"
        : "text-[#6f685f]",
    },
  ];

  return (
    <Card className={compact ? "space-y-4" : "space-y-5 p-6 lg:p-7"}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              Weight trend
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.06em] text-[#151515] sm:text-[2.05rem]">
              Keep the scale in context.
            </h2>
          </div>

          <span className="rounded-full border border-black/6 bg-[#f8f4ee] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-[#6f685f]">
            Last {DEFAULT_DAYS} days
          </span>
        </div>

        <p className="max-w-xl text-sm leading-7 text-[#6f685f]">
          Log a weight whenever you want and focus on the long-term direction instead of reacting to a single number.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">
              {item.label}
            </p>
            <p className={`mt-3 text-[1.75rem] font-medium tracking-[-0.05em] ${item.tone}`}>
              {item.value}
            </p>
            <p className="mt-1 text-sm text-[#6f685f]">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[26px] border border-black/6 bg-[#f8f4ee] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">
              Log weight
            </p>
            <p className="text-sm text-[#6f685f]">
              Add a new entry in kilograms.
            </p>
          </div>

          <form className="flex flex-wrap items-end gap-2" onSubmit={submitWeight}>
            <label className="space-y-1 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Weight</span>
              <Input
                type="number"
                step="0.1"
                min={20}
                max={400}
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                placeholder="78.4"
                required
                className="min-w-[9rem] bg-white"
              />
            </label>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Log weight"}
            </Button>
          </form>
        </div>
      </div>

      <div className="rounded-[28px] border border-black/6 bg-[#f8f4ee] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#151515]">Weight curve</p>
            <p className="text-sm text-[#6f685f]">Actual entries and 7-day trend.</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#6f685f]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#66557e]" />
              Entries
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#365141]" />
              Trend
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[#7a736b]">Loading trend...</p>
        ) : loggedPoints === 0 ? (
          <p className="text-sm text-[#7a736b]">No weight data yet.</p>
        ) : loggedPoints < 2 ? (
          <div className="rounded-[22px] border border-dashed border-black/10 bg-white/60 px-4 py-8 text-sm text-[#6f685f]">
            Add one more weight entry to start seeing a cleaner trend over time.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 4, right: 8, top: 10, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: "#7a736b", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#7a736b", fontSize: 12 }} domain={["auto", "auto"]} tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid rgba(21,21,21,0.08)",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 16px 30px rgba(21,21,21,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight_kg"
                  stroke="#66557e"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: "#66557e", strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="trend_7d"
                  stroke="#365141"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
