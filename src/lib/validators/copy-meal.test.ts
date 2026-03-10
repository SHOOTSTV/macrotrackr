import { describe, expect, it } from "vitest";

import { copyPreviousMealSchema } from "./copy-meal";

describe("copyPreviousMealSchema", () => {
  it("accepts a valid meal_id", () => {
    const parsed = copyPreviousMealSchema.safeParse({
      meal_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid meal_id", () => {
    const parsed = copyPreviousMealSchema.safeParse({
      meal_id: "invalid",
    });

    expect(parsed.success).toBe(false);
  });
});

