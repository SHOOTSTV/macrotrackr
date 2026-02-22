import { z } from "zod";

const targetNumber = z.number().finite().nonnegative();

export const nutritionGoalsSchema = z.object({
  kcal_target: targetNumber.max(10000),
  protein_g_target: targetNumber.max(1000),
  carbs_g_target: targetNumber.max(2000),
  fat_g_target: targetNumber.max(1000),
});

export type NutritionGoalsPayload = z.infer<typeof nutritionGoalsSchema>;
