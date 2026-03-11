import { describe, expect, it } from "vitest";

import { logFromTemplateSchema, mealSearchQuerySchema } from "./favorites";

describe("mealSearchQuerySchema", () => {
  it("parses query defaults", () => {
    const parsed = mealSearchQuerySchema.parse({});

    expect(parsed).toEqual({
      q: "",
      favoritesOnly: false,
      limit: 20,
    });
  });

  it("coerces favoritesOnly from string", () => {
    const parsed = mealSearchQuerySchema.parse({ q: "chicken", favoritesOnly: "true" });

    expect(parsed.favoritesOnly).toBe(true);
  });

  it("parses favoritesOnly=false from query string", () => {
    const parsed = mealSearchQuerySchema.parse({ q: "chicken", favoritesOnly: "false" });

    expect(parsed.favoritesOnly).toBe(false);
  });
});

describe("logFromTemplateSchema", () => {
  it("requires favorite_id when source is favorite", () => {
    const parsed = logFromTemplateSchema.safeParse({
      source: "favorite",
      title: "Salmon bowl",
      kcal: 540,
      protein_g: 38,
      carbs_g: 42,
      fat_g: 20,
      meal_type: "lunch",
    });

    expect(parsed.success).toBe(false);
  });
});

