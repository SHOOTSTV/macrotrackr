import { eachDayOfInterval, formatISO } from "date-fns";

import type { WeightTrendPayload, WeightTrendPoint, WeightLog } from "../../types/weight";

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pickLatestEntry(entries: WeightLog[]): WeightLog | null {
  return entries.reduce<WeightLog | null>((latest, current) => {
    if (!latest) {
      return current;
    }

    return new Date(current.logged_at).getTime() > new Date(latest.logged_at).getTime() ? current : latest;
  }, null);
}

export function buildWeightTrend(logs: WeightLog[], from: string, to: string): WeightTrendPayload {
  const byDay = new Map<string, WeightLog[]>();

  for (const log of logs) {
    const day = formatISO(new Date(log.logged_at), { representation: "date" });
    const existing = byDay.get(day) ?? [];
    existing.push(log);
    byDay.set(day, existing);
  }

  const days = eachDayOfInterval({ start: new Date(from), end: new Date(to) });
  const points: WeightTrendPoint[] = [];

  for (const dayValue of days) {
    const day = formatISO(dayValue, { representation: "date" });
    const entries = byDay.get(day) ?? [];
    const latestEntry = pickLatestEntry(entries);
    const dayWeight = latestEntry ? Number(latestEntry.weight_kg) : 0;
    points.push({ day, weight_kg: Number(dayWeight.toFixed(2)), trend_7d: 0 });
  }

  const trendPoints = points.map((point, index) => {
    const window = points
      .slice(Math.max(0, index - 6), index + 1)
      .map((value) => value.weight_kg)
      .filter((value) => value > 0);

    const trend = window.length > 0 ? Number(mean(window).toFixed(2)) : 0;
    return {
      ...point,
      trend_7d: trend,
    };
  });

  const nonZero = trendPoints.filter((point) => point.weight_kg > 0);
  const latest = nonZero[nonZero.length - 1]?.weight_kg ?? null;
  const weekAgo = nonZero.length >= 7 ? nonZero[nonZero.length - 7].weight_kg : null;
  const weeklyChange = latest !== null && weekAgo !== null ? Number((latest - weekAgo).toFixed(2)) : null;

  const trendDirection = weeklyChange === null
    ? "unknown"
    : weeklyChange > 0.2
      ? "up"
      : weeklyChange < -0.2
        ? "down"
        : "stable";

  return {
    points: trendPoints,
    summary: {
      latest_weight_kg: latest,
      weekly_change_kg: weeklyChange,
      trend_direction: trendDirection,
    },
  };
}
