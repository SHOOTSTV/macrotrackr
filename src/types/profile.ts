export interface NutritionGoals {
  user_id: string;
  kcal_target: number;
  protein_g_target: number;
  carbs_g_target: number;
  fat_g_target: number;
  created_at: string;
  updated_at: string;
}

export interface NutritionGoalsInput {
  user_id: string;
  kcal_target: number;
  protein_g_target: number;
  carbs_g_target: number;
  fat_g_target: number;
}
