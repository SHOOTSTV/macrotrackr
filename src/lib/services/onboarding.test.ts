import { describe, expect, it } from "vitest";

import { computeAdaptiveGoals } from "./onboarding-calculator";

describe("computeAdaptiveGoals", () => {
  it("returns coherent positive targets", () => {
    const goals = computeAdaptiveGoals({
      sex: "male",
      age: 30,
      height_cm: 178,
      weight_kg: 80,
      activity_level: "moderate",
      goal: "maintain",
    });

    expect(goals.kcal_target).toBeGreaterThan(1200);
    expect(goals.protein_g_target).toBeGreaterThan(0);
    expect(goals.carbs_g_target).toBeGreaterThan(0);
    expect(goals.fat_g_target).toBeGreaterThan(0);
  });

  it("sets lower kcal for lose than gain with same profile", () => {
    const lose = computeAdaptiveGoals({
      sex: "female",
      age: 29,
      height_cm: 165,
      weight_kg: 62,
      activity_level: "light",
      goal: "lose",
    });

    const gain = computeAdaptiveGoals({
      sex: "female",
      age: 29,
      height_cm: 165,
      weight_kg: 62,
      activity_level: "light",
      goal: "gain",
    });

    expect(lose.kcal_target).toBeLessThan(gain.kcal_target);
  });
});
