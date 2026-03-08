import { describe, expect, it } from "vitest";

import { applyMealCorrection } from "./meal-correction";

describe("applyMealCorrection", () => {
  const base = {
    kcal: 500,
    protein_g: 30,
    carbs_g: 45,
    fat_g: 18,
  };

  it("applies signed deltas", () => {
    const result = applyMealCorrection("+120 kcal -5 carbs +3 protein", base);

    expect(result.updated).toEqual({
      kcal: 620,
      protein_g: 33,
      carbs_g: 40,
      fat_g: 18,
    });
  });

  it("applies absolute values", () => {
    const result = applyMealCorrection("kcal 640 protein 42 carb 50 fat 20", base);

    expect(result.updated).toEqual({
      kcal: 640,
      protein_g: 42,
      carbs_g: 50,
      fat_g: 20,
    });
  });

  it("applies natural language verbs", () => {
    const result = applyMealCorrection("increase protein by 10 and reduce fat by 4", base);

    expect(result.updated).toEqual({
      kcal: 500,
      protein_g: 40,
      carbs_g: 45,
      fat_g: 14,
    });
  });

  it("clamps values to non-negative", () => {
    const result = applyMealCorrection("-900 kcal -100 carbs", base);

    expect(result.updated.kcal).toBe(0);
    expect(result.updated.carbs_g).toBe(0);
  });

  it("throws when command is not parseable", () => {
    expect(() => applyMealCorrection("make it cleaner", base)).toThrow(/Could not parse correction/i);
  });
});
