import type { OnboardingInput, UserGoal } from "../../types/onboarding";
import type { NutritionGoalsInput } from "../../types/profile";

const ACTIVITY_MULTIPLIERS: Record<OnboardingInput["activity_level"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_MULTIPLIERS: Record<UserGoal, number> = {
  lose: 0.85,
  maintain: 1,
  gain: 1.1,
};

function round1(value: number): number {
  return Number(value.toFixed(1));
}

export function computeAdaptiveGoals(input: OnboardingInput): Omit<NutritionGoalsInput, "user_id" | "weekly_target"> {
  const baseBmr = input.sex === "male"
    ? 10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age + 5
    : 10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age - 161;

  const tdee = baseBmr * ACTIVITY_MULTIPLIERS[input.activity_level];
  const kcalTarget = Math.max(1200, tdee * GOAL_MULTIPLIERS[input.goal]);

  const proteinPerKg = input.goal === "lose" ? 2 : input.goal === "gain" ? 1.8 : 1.7;
  const fatPerKg = input.goal === "lose" ? 0.8 : 0.9;

  const proteinG = input.weight_kg * proteinPerKg;
  const fatG = input.weight_kg * fatPerKg;
  const carbsKcal = Math.max(kcalTarget - proteinG * 4 - fatG * 9, 0);
  const carbsG = carbsKcal / 4;

  return {
    kcal_target: round1(kcalTarget),
    protein_g_target: round1(proteinG),
    carbs_g_target: round1(carbsG),
    fat_g_target: round1(fatG),
  };
}

