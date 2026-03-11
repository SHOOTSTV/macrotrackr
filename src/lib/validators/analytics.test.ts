import { describe, expect, it } from "vitest";

import { macroAlertEventSchema } from "./analytics";

describe("macroAlertEventSchema", () => {
  it("accepts valid macro alert payload", () => {
    const parsed = macroAlertEventSchema.safeParse({
      day: "2026-03-04",
      macro: "carbs",
      over_by: 14.2,
      day_total: 264.2,
      target: 250,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid day format", () => {
    const parsed = macroAlertEventSchema.safeParse({
      day: "04-03-2026",
      macro: "fat",
      over_by: 5,
      day_total: 75,
      target: 70,
    });

    expect(parsed.success).toBe(false);
  });
});

