import type { PostgrestError } from "@supabase/supabase-js";

import type { CreateMealInput, PatchMealInput } from "@/src/lib/validators/meals";
import { supabaseAdmin } from "@/src/lib/supabase/admin";
import type { Meal } from "@/src/types/meal";

function toServiceError(error: PostgrestError | null, fallback: string) {
  if (!error) {
    return new Error(fallback);
  }

  return new Error(error.message);
}

export async function createMeal(input: CreateMealInput, userId: string): Promise<Meal> {
  const { data: meal, error: mealError } = await supabaseAdmin
    .from("meals")
    .insert({
      ...input,
      user_id: userId,
      notes: input.notes ?? "",
    })
    .select("*")
    .single();

  if (mealError || !meal) {
    throw toServiceError(mealError, "Failed to insert meal");
  }

  return getMealById(meal.id, userId);
}

export async function patchMeal(
  mealId: string,
  userId: string,
  input: PatchMealInput,
): Promise<Meal> {
  const { data: updatedMeal, error: mealError } = await supabaseAdmin
    .from("meals")
    .update({
      ...input,
      updated_from_dashboard: true,
    })
    .eq("id", mealId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (mealError || !updatedMeal) {
    throw toServiceError(mealError, "Meal not found or update failed");
  }

  return getMealById(mealId, userId);
}

export async function getMealById(mealId: string, userId: string): Promise<Meal> {
  const { data, error } = await supabaseAdmin
    .from("meals")
    .select("*")
    .eq("id", mealId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw toServiceError(error, "Meal not found");
  }

  return data as Meal;
}

export async function listMealsForDate(userId: string, date: string): Promise<Meal[]> {
  const from = `${date}T00:00:00.000Z`;
  const to = `${date}T23:59:59.999Z`;

  const { data, error } = await supabaseAdmin
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("eaten_at", from)
    .lte("eaten_at", to)
    .order("eaten_at", { ascending: false });

  if (error) {
    throw toServiceError(error, "Unable to fetch meals");
  }

  return (data ?? []) as Meal[];
}

export async function listMealsForRange(
  userId: string,
  fromDate: string,
  toDate: string,
): Promise<Meal[]> {
  const from = `${fromDate}T00:00:00.000Z`;
  const to = `${toDate}T23:59:59.999Z`;

  const { data, error } = await supabaseAdmin
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("eaten_at", from)
    .lte("eaten_at", to)
    .order("eaten_at", { ascending: false });

  if (error) {
    throw toServiceError(error, "Unable to fetch meals history");
  }

  return (data ?? []) as Meal[];
}
