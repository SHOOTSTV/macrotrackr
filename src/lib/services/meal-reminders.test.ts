import { describe, expect, it } from "vitest";

import { detectSmartMealReminder } from "./meal-reminders";
import type { Meal } from "../../types/meal";

function meal(partial: Partial<Meal>): Meal {
  return {
    id: partial.id ?? "m1",
    user_id: "u1",
    author: "manual",
    source_detail: "test",
    eaten_at: partial.eaten_at ?? "2026-03-01T12:30:00.000Z",
    meal_type: partial.meal_type ?? "lunch",
    title: partial.title ?? "Test",
    kcal: partial.kcal ?? 500,
    protein_g: partial.protein_g ?? 30,
    carbs_g: partial.carbs_g ?? 40,
    fat_g: partial.fat_g ?? 15,
    confidence: null,
    low_confidence: false,
    notes: "",
    idempotency_key: null,
    updated_from_dashboard: false,
    created_at: "2026-03-01T12:30:00.000Z",
    updated_at: "2026-03-01T12:30:00.000Z",
  };
}

describe("detectSmartMealReminder", () => {
  it("returns habit-based lunch reminder when lunch missing today", () => {
    const recentMeals = [
      meal({ id: "1", meal_type: "lunch", eaten_at: "2026-03-01T12:20:00.000Z" }),
      meal({ id: "2", meal_type: "lunch", eaten_at: "2026-03-02T12:35:00.000Z" }),
      meal({ id: "3", meal_type: "lunch", eaten_at: "2026-03-03T12:40:00.000Z" }),
    ];

    const reminder = detectSmartMealReminder(recentMeals, [], new Date("2026-03-04T13:20:00.000Z"));

    expect(reminder?.mealType).toBe("lunch");
    expect(reminder?.source).toBe("habit");
  });

  it("does not return a reminder for a meal type already logged today", () => {
    const recentMeals = [meal({ meal_type: "dinner", eaten_at: "2026-03-01T19:30:00.000Z" })];
    const todayMeals = [meal({ meal_type: "dinner", eaten_at: "2026-03-04T19:35:00.000Z" })];

    const reminder = detectSmartMealReminder(recentMeals, todayMeals, new Date("2026-03-04T20:30:00.000Z"));

    expect(reminder?.mealType).not.toBe("dinner");
  });

  it("returns an overdue reminder when window passed and meal is still missing", () => {
    const reminder = detectSmartMealReminder([], [], new Date("2026-03-04T22:58:00.000Z"));

    expect(reminder).not.toBeNull();
    expect(reminder?.mealType).toBe("dinner");
  });
});
