import { describe, expect, it } from "vitest";

import { mergeSearchResults } from "./favorites-search";

describe("mergeSearchResults", () => {
  it("puts favorites first and removes duplicated history entries", () => {
    const results = mergeSearchResults({
      favorites: [
        {
          id: "fav-1",
          user_id: "u-1",
          source_meal_id: "meal-1",
          title: "Chicken bowl",
          kcal: 500,
          protein_g: 40,
          carbs_g: 45,
          fat_g: 15,
          last_used_at: null,
          created_at: "2026-03-04T00:00:00Z",
        },
      ],
      meals: [
        {
          id: "meal-1",
          user_id: "u-1",
          author: "manual",
          source_detail: "manual_form",
          eaten_at: "2026-03-04T12:00:00Z",
          meal_type: "lunch",
          title: "Chicken bowl",
          kcal: 500,
          protein_g: 40,
          carbs_g: 45,
          fat_g: 15,
          confidence: null,
          low_confidence: false,
          notes: "",
          idempotency_key: null,
          updated_from_dashboard: false,
          created_at: "2026-03-04T12:00:00Z",
          updated_at: "2026-03-04T12:00:00Z",
        },
        {
          id: "meal-2",
          user_id: "u-1",
          author: "manual",
          source_detail: "manual_form",
          eaten_at: "2026-03-04T13:00:00Z",
          meal_type: "dinner",
          title: "Beef wrap",
          kcal: 620,
          protein_g: 35,
          carbs_g: 52,
          fat_g: 26,
          confidence: null,
          low_confidence: false,
          notes: "",
          idempotency_key: null,
          updated_from_dashboard: false,
          created_at: "2026-03-04T13:00:00Z",
          updated_at: "2026-03-04T13:00:00Z",
        },
      ],
    });

    expect(results).toHaveLength(2);
    expect(results[0].source).toBe("favorite");
    expect(results[1].source).toBe("history");
    expect(results[1].title).toBe("Beef wrap");
  });
});
