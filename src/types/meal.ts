export type MealAuthor = "ai" | "manual";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  user_id: string;
  author: MealAuthor;
  source_detail: string;
  eaten_at: string;
  meal_type: MealType;
  title: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: number | null;
  low_confidence: boolean;
  notes: string | null;
  updated_from_dashboard: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailySummary {
  user_id: string;
  day: string;
  meals_count: number;
  kcal_total: number;
  protein_total: number;
  carbs_total: number;
  fat_total: number;
}
