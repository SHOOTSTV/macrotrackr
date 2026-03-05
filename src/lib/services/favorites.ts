import type { PostgrestError } from "@supabase/supabase-js";

import { createMeal } from "./meals";
import { buildMealSignature, mergeSearchResults } from "./favorites-search";
import { supabaseAdmin } from "../supabase/admin";
import type { LogFromTemplateInput, MealSearchQueryInput } from "../validators/favorites";
import type { FavoriteMeal, Meal, MealSearchResult } from "../../types/meal";

function toServiceError(error: PostgrestError | null, fallback: string) {
  if (!error) {
    return new Error(fallback);
  }

  return new Error(error.message);
}


export async function addFavoriteFromMeal(userId: string, mealId: string): Promise<FavoriteMeal> {
  const { data: meal, error: mealError } = await supabaseAdmin
    .from("meals")
    .select("id,title,kcal,protein_g,carbs_g,fat_g")
    .eq("id", mealId)
    .eq("user_id", userId)
    .single();

  if (mealError || !meal) {
    throw toServiceError(mealError, "Meal not found");
  }

  const { data: favorite, error } = await supabaseAdmin
    .from("favorite_meals")
    .upsert(
      {
        user_id: userId,
        source_meal_id: meal.id,
        title: meal.title,
        kcal: meal.kcal,
        protein_g: meal.protein_g,
        carbs_g: meal.carbs_g,
        fat_g: meal.fat_g,
        signature: buildMealSignature(
          meal.title,
          Number(meal.kcal),
          Number(meal.protein_g),
          Number(meal.carbs_g),
          Number(meal.fat_g),
        ),
      },
      { onConflict: "user_id,signature" },
    )
    .select("*")
    .single();

  if (error || !favorite) {
    throw toServiceError(error, "Failed to create favorite");
  }

  return favorite as FavoriteMeal;
}

export async function removeFavorite(userId: string, favoriteId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("favorite_meals")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw toServiceError(error, "Failed to remove favorite");
  }

  if (!data) {
    throw new Error("Favorite not found");
  }
}

export async function searchMeals(
  userId: string,
  query: MealSearchQueryInput,
): Promise<MealSearchResult[]> {
  const hasQuery = query.q.length > 0;

  let favoritesQuery = supabaseAdmin
    .from("favorite_meals")
    .select("*")
    .eq("user_id", userId)
    .order("last_used_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (hasQuery) {
    favoritesQuery = favoritesQuery.ilike("title", `%${query.q}%`);
  }

  favoritesQuery = favoritesQuery.limit(query.limit);

  const favoritesPromise = favoritesQuery;

  const mealsPromise = query.favoritesOnly
    ? Promise.resolve({ data: [], error: null })
    : (() => {
      let mealsQuery = supabaseAdmin
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .order("eaten_at", { ascending: false });

      if (hasQuery) {
        mealsQuery = mealsQuery.ilike("title", `%${query.q}%`);
      }

      return mealsQuery.limit(query.limit);
    })();

  const [{ data: favoriteRows, error: favoriteError }, { data: mealRows, error: mealError }] =
    await Promise.all([favoritesPromise, mealsPromise]);

  if (favoriteError) {
    throw toServiceError(favoriteError, "Failed to fetch favorites");
  }

  if (mealError) {
    throw toServiceError(mealError, "Failed to fetch meals");
  }

  const favorites = (favoriteRows ?? []) as FavoriteMeal[];
  const meals = (mealRows ?? []) as Meal[];

  return mergeSearchResults({ favorites, meals }).slice(
    0,
    query.limit,
  );
}

export async function logFromTemplate(userId: string, input: LogFromTemplateInput) {
  const mealPayload = {
    author: "manual" as const,
    source_detail: input.source === "favorite" ? "quick_log_favorite" : "quick_log_history",
    eaten_at: new Date().toISOString(),
    meal_type: input.meal_type,
    title: input.title,
    kcal: input.kcal,
    protein_g: input.protein_g,
    carbs_g: input.carbs_g,
    fat_g: input.fat_g,
    confidence: null,
    notes: "",
  };

  const { meal } = await createMeal(mealPayload, userId);

  if (input.favorite_id) {
    const { error } = await supabaseAdmin
      .from("favorite_meals")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", input.favorite_id)
      .eq("user_id", userId);

    if (error) {
      throw toServiceError(error, "Failed to update favorite usage");
    }
  }

  return meal;
}
