import { describe, expect, it } from "vitest";

import {
  computeBestStreak,
  computeCurrentStreak,
  computeWeeklyCompletedDays,
  recalculateProgress,
} from "./progress";

describe("computeCurrentStreak", () => {
  it("returns streak ending today when today is validated", () => {
    const streak = computeCurrentStreak(["2026-03-01", "2026-03-02", "2026-03-03"], "2026-03-03");

    expect(streak).toBe(3);
  });

  it("returns streak ending yesterday when today is not validated yet", () => {
    const streak = computeCurrentStreak(["2026-03-01", "2026-03-02"], "2026-03-03");

    expect(streak).toBe(2);
  });

  it("returns zero when neither today nor yesterday has a validated meal", () => {
    const streak = computeCurrentStreak(["2026-03-01"], "2026-03-03");

    expect(streak).toBe(0);
  });

  it("recalculates correctly after meal deletion and backfill", () => {
    const afterDeletion = computeCurrentStreak(["2026-03-01", "2026-03-03"], "2026-03-03");
    const afterBackfill = computeCurrentStreak(
      ["2026-03-01", "2026-03-02", "2026-03-03"],
      "2026-03-03",
    );

    expect(afterDeletion).toBe(1);
    expect(afterBackfill).toBe(3);
  });
});

describe("computeBestStreak", () => {
  it("tracks the longest run across all validated days", () => {
    const best = computeBestStreak([
      "2026-02-20",
      "2026-02-21",
      "2026-02-24",
      "2026-02-25",
      "2026-02-26",
    ]);

    expect(best).toBe(3);
  });
});

describe("computeWeeklyCompletedDays", () => {
  it("counts unique validated days inside the selected week", () => {
    const days = computeWeeklyCompletedDays(
      ["2026-03-01", "2026-03-01", "2026-03-02", "2026-03-06", "2026-03-08"],
      "2026-03-01",
      "2026-03-07",
    );

    expect(days).toBe(3);
  });
});

describe("recalculateProgress", () => {
  it("returns a stable snapshot for streak and weekly goal", () => {
    const snapshot = recalculateProgress({
      validatedDays: ["2026-03-01", "2026-03-02", "2026-03-03"],
      today: "2026-03-03",
      weekStart: "2026-03-01",
      weekEnd: "2026-03-07",
      weeklyTarget: 3,
    });

    expect(snapshot).toEqual({
      currentStreak: 3,
      bestStreak: 3,
      weeklyCompletedDays: 3,
      weeklyTarget: 3,
      weeklyGoalHit: true,
    });
  });

  it("clamps weekly target to [1..7]", () => {
    const tooLow = recalculateProgress({
      validatedDays: [],
      today: "2026-03-03",
      weekStart: "2026-03-01",
      weekEnd: "2026-03-07",
      weeklyTarget: 0,
    });

    const tooHigh = recalculateProgress({
      validatedDays: ["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04", "2026-03-05"],
      today: "2026-03-05",
      weekStart: "2026-03-01",
      weekEnd: "2026-03-07",
      weeklyTarget: 99,
    });

    expect(tooLow.weeklyTarget).toBe(1);
    expect(tooHigh.weeklyTarget).toBe(7);
    expect(tooHigh.weeklyGoalHit).toBe(false);
  });
});
