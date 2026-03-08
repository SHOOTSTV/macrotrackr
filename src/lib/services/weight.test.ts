import { describe, expect, it } from "vitest";

import { buildWeightTrend } from "./weight-trend";
import type { WeightLog } from "../../types/weight";

function log(day: string, weight: number): WeightLog {
  return {
    id: crypto.randomUUID(),
    user_id: "u1",
    logged_at: `${day}T08:00:00.000Z`,
    weight_kg: weight,
    source: "manual",
    created_at: `${day}T08:00:00.000Z`,
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
    expect(trend.summary.trend_direction).toBe("down");
  });

  it("returns unknown direction when there is not enough history", () => {
    const logs = [log("2026-03-09", 79.4), log("2026-03-10", 79.3)];

    const trend = buildWeightTrend(logs, "2026-03-01", "2026-03-10");

    expect(trend.summary.latest_weight_kg).toBe(79.3);
    expect(trend.summary.weekly_change_kg).toBeNull();
    expect(trend.summary.trend_direction).toBe("unknown");
  });
});
