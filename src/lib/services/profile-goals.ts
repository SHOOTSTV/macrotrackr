import { supabaseAdmin } from "@/src/lib/supabase/admin";
import type { NutritionGoals, NutritionGoalsInput } from "@/src/types/profile";

const DEFAULT_GOALS: Omit<NutritionGoalsInput, "user_id"> = {
  kcal_target: 2200,
  protein_g_target: 140,
  carbs_g_target: 250,
  fat_g_target: 70,
};

export async function getNutritionGoals(userId: string): Promise<NutritionGoals | null> {
  const { data, error } = await supabaseAdmin
    .from("nutrition_goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as NutritionGoals | null) ?? null;
}

export async function getNutritionGoalsOrDefault(userId: string): Promise<NutritionGoalsInput> {
  const goals = await getNutritionGoals(userId);
  if (!goals) {
    return {
      user_id: userId,
      ...DEFAULT_GOALS,
    };
  }

  return {
    user_id: goals.user_id,
    kcal_target: goals.kcal_target,
    protein_g_target: goals.protein_g_target,
    carbs_g_target: goals.carbs_g_target,
    fat_g_target: goals.fat_g_target,
  };
}

export async function upsertNutritionGoals(
  input: Omit<NutritionGoalsInput, "user_id">,
  userId: string,
): Promise<NutritionGoals> {
  const { data, error } = await supabaseAdmin
    .from("nutrition_goals")
    .upsert(
      {
        user_id: userId,
        ...input,
      },
      {
      onConflict: "user_id",
      },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save nutrition goals");
  }

  return data as NutritionGoals;
}
