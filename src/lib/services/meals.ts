import type { PostgrestError } from "@supabase/supabase-js";

import type { CreateMealInput, PatchMealInput } from "@/src/lib/validators/meals";
import { supabaseAdmin } from "@/src/lib/supabase/admin";
import type { Meal } from "@/src/types/meal";

const APP_TIME_ZONE = process.env.APP_TIME_ZONE ?? "Europe/Paris";

function toServiceError(error: PostgrestError | null, fallback: string) {
  if (!error) {
    return new Error(fallback);
  }

  return new Error(error.message);
}

function getOffsetForTimeZone(instantIso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(new Date(instantIso));

  const offsetPart = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+0";
  if (offsetPart === "GMT") {
    return "+00:00";
  }

  const match = offsetPart.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    return "+00:00";
  }

  const [, sign, hours, minutes] = match;
  return `${sign}${hours.padStart(2, "0")}:${minutes ?? "00"}`;
}

function getDateBoundsInAppTimeZone(date: string): { from: string; to: string } {
  const startOffset = getOffsetForTimeZone(`${date}T00:00:00.000Z`, APP_TIME_ZONE);
  const endOffset = getOffsetForTimeZone(`${date}T23:59:59.999Z`, APP_TIME_ZONE);

  return {
    from: `${date}T00:00:00.000${startOffset}`,
    to: `${date}T23:59:59.999${endOffset}`,
  };
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

export async function deleteMealById(mealId: string, userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw toServiceError(error, "Unable to delete meal");
  }

  if (!data) {
    throw new Error("Meal not found");
  }
}

export async function deleteMealsForDate(userId: string, date: string): Promise<number> {
  const { from, to } = getDateBoundsInAppTimeZone(date);

  const { data, error } = await supabaseAdmin
    .from("meals")
    .delete()
    .eq("user_id", userId)
    .gte("eaten_at", from)
    .lte("eaten_at", to)
    .select("id");

  if (error) {
    throw toServiceError(error, "Unable to delete meals for date");
  }

  return data?.length ?? 0;
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
  const { from, to } = getDateBoundsInAppTimeZone(date);

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
  const { from } = getDateBoundsInAppTimeZone(fromDate);
  const { to } = getDateBoundsInAppTimeZone(toDate);

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
