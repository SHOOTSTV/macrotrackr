import { describe, expect, it } from "vitest";

import { dayQuerySchema, rangeQuerySchema } from "./meals";

describe("dayQuerySchema", () => {
  it("accepts a valid YYYY-MM-DD date", () => {
    const parsed = dayQuerySchema.safeParse({ date: "2026-02-22" });

    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid date format", () => {
    const parsed = dayQuerySchema.safeParse({ date: "22-02-2026" });

    expect(parsed.success).toBe(false);
  });
});

describe("rangeQuerySchema", () => {
  it("accepts a range where from <= to", () => {
    const parsed = rangeQuerySchema.safeParse({ from: "2026-02-20", to: "2026-02-22" });

    expect(parsed.success).toBe(true);
  });

  it("rejects a range where from > to", () => {
    const parsed = rangeQuerySchema.safeParse({ from: "2026-02-23", to: "2026-02-22" });

    expect(parsed.success).toBe(false);
  });
});
