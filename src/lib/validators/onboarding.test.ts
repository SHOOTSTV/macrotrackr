import { describe, expect, it } from "vitest";

import { onboardingSchema } from "./onboarding";

describe("onboardingSchema", () => {
  it("accepts valid payload", () => {
    const parsed = onboardingSchema.safeParse({
      sex: "male",
      age: 34,
      height_cm: 180,
      weight_kg: 79.5,
      activity_level: "moderate",
      goal: "maintain",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects out-of-bound age", () => {
    const parsed = onboardingSchema.safeParse({
      sex: "male",
      age: 12,
      height_cm: 180,
      weight_kg: 79.5,
      activity_level: "moderate",
      goal: "maintain",
    });

    expect(parsed.success).toBe(false);
  });
});
