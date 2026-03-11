import { describe, expect, it } from "vitest";

import { reminderShownSchema } from "./reminder";

describe("reminderShownSchema", () => {
  it("accepts valid payload", () => {
    const parsed = reminderShownSchema.safeParse({
      day: "2026-03-04",
      meal_type: "lunch",
      source: "habit",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid payload", () => {
    const parsed = reminderShownSchema.safeParse({
      day: "2026/03/04",
      meal_type: "lunch",
      source: "habit",
    });

    expect(parsed.success).toBe(false);
  });
});

