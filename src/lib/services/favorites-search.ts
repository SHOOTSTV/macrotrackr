import type { FavoriteMeal, Meal, MealSearchResult } from "../../types/meal";

function mealSignature(title: string, kcal: number, protein: number, carbs: number, fat: number): string {
  return `${title.trim().toLowerCase()}|${kcal}|${protein}|${carbs}|${fat}`;
}

interface SearchRows {
  favorites: FavoriteMeal[];
  meals: Meal[];
}

export function buildMealSignature(
  title: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
): string {
  return mealSignature(title, kcal, protein, carbs, fat);
}

export function mergeSearchResults({ favorites, meals }: SearchRows): MealSearchResult[] {
  const mappedFavorites: MealSearchResult[] = favorites.map((favorite) => ({
    id: favorite.id,
    source: "favorite",
    source_meal_id: favorite.source_meal_id,
    title: favorite.title,
    kcal: favorite.kcal,
    protein_g: favorite.protein_g,
    carbs_g: favorite.carbs_g,
    fat_g: favorite.fat_g,
    meal_type: "snack",
    eaten_at: null,
    is_favorite: true,
  }));

  const favoriteSignatures = new Set(
    favorites.map((favorite) =>
      mealSignature(
        favorite.title,
        Number(favorite.kcal),
        Number(favorite.protein_g),
        Number(favorite.carbs_g),
        Number(favorite.fat_g),
      )),
  );

  const mappedHistory: MealSearchResult[] = [];

  for (const meal of meals) {
    const signature = mealSignature(
      meal.title,
      Number(meal.kcal),
      Number(meal.protein_g),
      Number(meal.carbs_g),
      Number(meal.fat_g),
    );

    if (favoriteSignatures.has(signature)) {
      continue;
    }

    mappedHistory.push({
      id: meal.id,
      source: "history",
      source_meal_id: meal.id,
      title: meal.title,
      kcal: meal.kcal,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
      meal_type: meal.meal_type,
      eaten_at: meal.eaten_at,
      is_favorite: false,
    });
  }

  return [...mappedFavorites, ...mappedHistory];
}

