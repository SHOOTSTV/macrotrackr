import { describe, expect, it } from "vitest";

import { buildWeightTrend } from "./weight-trend";
import type { WeightLog } from "../../types/weight";

function log(day: string, weight: number, time = "08:00:00.000Z"): WeightLog {
  return {
    id: crypto.randomUUID(),
    user_id: "u1",
    logged_at: `${day}T${time}`,
    weight_kg: weight,
    source: "manual",
    created_at: `${day}T${time}`,
  };
}

describe("buildWeightTrend", () => {
  it("computes weekly change", () => {
    const logs = [
      log("2026-03-01", 80),
      log("2026-03-03", 79.6),
      log("2026-03-05", 79.4),
      log("2026-03-07", 79.2),
      log("2026-03-08", 79.1),
      log("2026-03-09", 79.0),
      log("2026-03-10", 78.9),
    ];

    const trend = buildWeightTrend(logs, "2026-03-01", "2026-03-10");

    expect(trend.summary.latest_weight_kg).toBe(78.9);
    expect(trend.summary.weekly_change_kg).not.toBeNull();
  });

  it("keeps 7-day trend math unchanged for one value per day", () => {
    const logs = [
      log("2026-03-01", 80),
      log("2026-03-02", 79),
      log("2026-03-03", 78),
    ];

    const trend = buildWeightTrend(logs, "2026-03-01", "2026-03-03");

    expect(trend.points.map((point) => point.trend_7d)).toEqual([80, 79.5, 79]);
  });

  it("uses the latest entry when multiple logs exist on the same day", () => {
    const logs = [
      log("2026-03-05", 78, "08:00:00.000Z"),
      log("2026-03-05", 52, "20:00:00.000Z"),
      log("2026-03-06", 50, "08:00:00.000Z"),
    ];

    const trend = buildWeightTrend(logs, "2026-03-05", "2026-03-06");

    expect(trend.points[0]?.weight_kg).toBe(52);
    expect(trend.points[0]?.trend_7d).toBe(52);
    expect(trend.points[1]?.trend_7d).toBe(51);
    expect(trend.summary.latest_weight_kg).toBe(50);
  });
});
