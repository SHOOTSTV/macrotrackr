import { describe, expect, it } from "vitest";

import { createWeightLogSchema, weightRangeQuerySchema } from "./weight";

describe("createWeightLogSchema", () => {
  it("accepts valid payload", () => {
    const parsed = createWeightLogSchema.safeParse({ weight_kg: 78.4 });
    expect(parsed.success).toBe(true);
  });
});

describe("weightRangeQuerySchema", () => {
  it("rejects reversed dates", () => {
    const parsed = weightRangeQuerySchema.safeParse({ from: "2026-03-10", to: "2026-03-01" });
    expect(parsed.success).toBe(false);
  });
});

