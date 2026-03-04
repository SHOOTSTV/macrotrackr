"use client";

import { formatISO, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
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

  async function fetchTrend() {
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
  }

  useEffect(() => {
    void fetchTrend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const chartData = (trend?.points ?? []).filter((point) => point.weight_kg > 0 || point.trend_7d > 0);

  return (
    <Card className={compact ? "" : "space-y-4"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Weight tracking</h3>
          <p className="text-sm text-slate-600">Log in kg and monitor 7-day trend.</p>
        </div>
        {trend?.summary.latest_weight_kg ? (
          <p className="text-sm font-medium text-slate-700">
            Latest: {trend.summary.latest_weight_kg} kg
          </p>
        ) : null}
      </div>

      <form className="flex flex-wrap items-end gap-2" onSubmit={submitWeight}>
        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Weight (kg)</span>
          <Input
            type="number"
            step="0.1"
            min={20}
            max={400}
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
            placeholder="e.g. 78.4"
            required
          />
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Log weight"}
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading trend...</p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-slate-500">No weight data yet.</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="weight_kg" stroke="#6366f1" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="trend_7d" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {trend && trend.summary.weekly_change_kg !== null ? (
        <p className="text-sm text-slate-700">
          Weekly change: {trend.summary.weekly_change_kg} kg ({trend.summary.trend_direction})
        </p>
      ) : null}
    </Card>
  );
}
