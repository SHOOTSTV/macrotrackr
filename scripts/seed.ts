import { formatISO, setHours, setMinutes, subDays } from "date-fns";

import { env } from "@/src/lib/env";
import { supabaseAdmin } from "@/src/lib/supabase/admin";

interface SeedMealInput {
  user_id: string;
  author: "ai" | "manual";
  source_detail: string;
  eaten_at: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: number | null;
  notes: string;
}

function timeAt(daysAgo: number, hour: number, minute: number) {
  const date = setMinutes(setHours(subDays(new Date(), daysAgo), hour), minute);
  return formatISO(date);
}

const USER_ID = "axel";

const seedMeals: SeedMealInput[] = [
  {
    user_id: USER_ID,
    author: "ai",
    source_detail: "photo_ai",
    eaten_at: timeAt(0, 12, 35),
    meal_type: "lunch",
    title: "Poulet riz legumes",
    kcal: 680,
    protein_g: 48,
    carbs_g: 72,
    fat_g: 18,
    confidence: 0.78,
    notes: "Estimation visuelle",
  },
  {
    user_id: USER_ID,
    author: "manual",
    source_detail: "manual_form",
    eaten_at: timeAt(0, 20, 0),
    meal_type: "dinner",
    title: "Omelette et salade",
    kcal: 520,
    protein_g: 30,
    carbs_g: 12,
    fat_g: 34,
    confidence: null,
    notes: "",
  },
  {
    user_id: USER_ID,
    author: "ai",
    source_detail: "photo_ai",
    eaten_at: timeAt(1, 8, 10),
    meal_type: "breakfast",
    title: "Yaourt granola fruits",
    kcal: 460,
    protein_g: 21,
    carbs_g: 58,
    fat_g: 14,
    confidence: 0.67,
    notes: "Photo prise en lumiere faible",
  },
  {
    user_id: USER_ID,
    author: "manual",
    source_detail: "manual_form",
    eaten_at: timeAt(2, 13, 20),
    meal_type: "lunch",
    title: "Saumon quinoa brocoli",
    kcal: 710,
    protein_g: 44,
    carbs_g: 55,
    fat_g: 31,
    confidence: null,
    notes: "Repas maison",
  },
  {
    user_id: USER_ID,
    author: "ai",
    source_detail: "photo_ai",
    eaten_at: timeAt(3, 19, 45),
    meal_type: "dinner",
    title: "Burger frites",
    kcal: 980,
    protein_g: 34,
    carbs_g: 96,
    fat_g: 49,
    confidence: 0.52,
    notes: "Portion estimee",
  },
  {
    user_id: USER_ID,
    author: "manual",
    source_detail: "manual_form",
    eaten_at: timeAt(4, 12, 50),
    meal_type: "lunch",
    title: "Pates bolognaise",
    kcal: 760,
    protein_g: 39,
    carbs_g: 88,
    fat_g: 24,
    confidence: null,
    notes: "",
  },
];

async function runSeed() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing Supabase environment variables");
  }

  const { data: existingMeals, error: existingError } = await supabaseAdmin
    .from("meals")
    .select("id")
    .eq("user_id", USER_ID);

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingMeals && existingMeals.length > 0) {
    const ids = existingMeals.map((meal) => meal.id);
    const { error: deleteError } = await supabaseAdmin.from("meals").delete().in("id", ids);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  for (const mealPayload of seedMeals) {
    const { data: insertedMeal, error: mealError } = await supabaseAdmin
      .from("meals")
      .insert(mealPayload)
      .select("id")
      .single();

    if (mealError || !insertedMeal) {
      throw new Error(mealError?.message ?? "Meal insertion failed");
    }
  }

  console.log(`Seed complete: ${seedMeals.length} meals inserted for user '${USER_ID}'.`);
}

runSeed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
