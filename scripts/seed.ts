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

function resolveUserId(): string {
  const arg = process.argv[2];
  if (arg) return arg;

  console.error(
    "Usage: pnpm seed <user_id>\n\n" +
      "Pass your Supabase Auth user UUID as argument.\n" +
      "Find it in Supabase Dashboard → Authentication → Users.",
  );
  process.exit(1);
}

function buildMeals(userId: string): SeedMealInput[] {
  return [
    // --- Day 0 (today) ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(0, 8, 15), meal_type: "breakfast", title: "Oatmeal with banana and honey", kcal: 380, protein_g: 12, carbs_g: 62, fat_g: 8, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(0, 12, 40), meal_type: "lunch", title: "Grilled chicken rice and vegetables", kcal: 680, protein_g: 48, carbs_g: 72, fat_g: 18, confidence: 0.82, notes: "Photo analysis" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(0, 16, 0), meal_type: "snack", title: "Greek yogurt with almonds", kcal: 220, protein_g: 18, carbs_g: 12, fat_g: 11, confidence: null, notes: "" },

    // --- Day 1 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(1, 7, 45), meal_type: "breakfast", title: "Scrambled eggs on toast", kcal: 420, protein_g: 24, carbs_g: 32, fat_g: 22, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(1, 13, 0), meal_type: "lunch", title: "Salmon quinoa broccoli", kcal: 710, protein_g: 44, carbs_g: 55, fat_g: 31, confidence: 0.88, notes: "High confidence estimate" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(1, 19, 30), meal_type: "dinner", title: "Steak with sweet potato", kcal: 620, protein_g: 42, carbs_g: 48, fat_g: 22, confidence: null, notes: "" },

    // --- Day 2 ---
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(2, 8, 30), meal_type: "breakfast", title: "Smoothie bowl with berries", kcal: 350, protein_g: 14, carbs_g: 52, fat_g: 10, confidence: 0.74, notes: "Toppings estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(2, 12, 15), meal_type: "lunch", title: "Turkey wrap with avocado", kcal: 540, protein_g: 32, carbs_g: 44, fat_g: 24, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(2, 20, 0), meal_type: "dinner", title: "Pasta bolognese", kcal: 760, protein_g: 39, carbs_g: 88, fat_g: 24, confidence: null, notes: "Homemade" },

    // --- Day 3 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(3, 7, 30), meal_type: "breakfast", title: "Protein pancakes", kcal: 440, protein_g: 30, carbs_g: 48, fat_g: 14, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(3, 13, 10), meal_type: "lunch", title: "Poke bowl with tuna", kcal: 590, protein_g: 36, carbs_g: 64, fat_g: 18, confidence: 0.79, notes: "Rice portion estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(3, 19, 45), meal_type: "dinner", title: "Burger and fries", kcal: 980, protein_g: 34, carbs_g: 96, fat_g: 49, confidence: null, notes: "Cheat meal" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(3, 15, 30), meal_type: "snack", title: "Protein bar", kcal: 210, protein_g: 20, carbs_g: 22, fat_g: 8, confidence: null, notes: "" },

    // --- Day 4 ---
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(4, 8, 0), meal_type: "breakfast", title: "Yogurt granola and fruit", kcal: 460, protein_g: 21, carbs_g: 58, fat_g: 14, confidence: 0.67, notes: "Low light photo" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(4, 12, 50), meal_type: "lunch", title: "Chicken Caesar salad", kcal: 480, protein_g: 38, carbs_g: 18, fat_g: 28, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(4, 20, 15), meal_type: "dinner", title: "Omelette and mixed salad", kcal: 520, protein_g: 30, carbs_g: 12, fat_g: 34, confidence: null, notes: "" },

    // --- Day 5 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(5, 9, 0), meal_type: "breakfast", title: "Avocado toast with egg", kcal: 390, protein_g: 16, carbs_g: 30, fat_g: 24, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(5, 12, 30), meal_type: "lunch", title: "Sushi platter (12 pieces)", kcal: 620, protein_g: 28, carbs_g: 80, fat_g: 14, confidence: 0.71, notes: "Piece count estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(5, 19, 0), meal_type: "dinner", title: "Grilled fish with vegetables", kcal: 450, protein_g: 40, carbs_g: 22, fat_g: 18, confidence: null, notes: "" },

    // --- Day 6 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(6, 8, 20), meal_type: "breakfast", title: "Overnight oats with chia", kcal: 360, protein_g: 14, carbs_g: 50, fat_g: 12, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(6, 13, 15), meal_type: "lunch", title: "Chicken tikka with naan", kcal: 750, protein_g: 42, carbs_g: 68, fat_g: 32, confidence: 0.55, notes: "Sauce amount uncertain" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(6, 20, 30), meal_type: "dinner", title: "Lentil soup with bread", kcal: 480, protein_g: 24, carbs_g: 66, fat_g: 10, confidence: null, notes: "" },

    // --- Day 7 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(7, 7, 50), meal_type: "breakfast", title: "Banana protein smoothie", kcal: 320, protein_g: 28, carbs_g: 38, fat_g: 6, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(7, 12, 45), meal_type: "lunch", title: "Tuna nicoise salad", kcal: 510, protein_g: 36, carbs_g: 28, fat_g: 26, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(7, 19, 20), meal_type: "dinner", title: "Pizza margherita (3 slices)", kcal: 840, protein_g: 30, carbs_g: 96, fat_g: 36, confidence: 0.73, notes: "Slice size estimated" },

    // --- Day 8 ---
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(8, 8, 10), meal_type: "breakfast", title: "French toast with maple syrup", kcal: 480, protein_g: 14, carbs_g: 64, fat_g: 18, confidence: 0.81, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(8, 13, 0), meal_type: "lunch", title: "Beef stir-fry with noodles", kcal: 660, protein_g: 38, carbs_g: 72, fat_g: 22, confidence: null, notes: "" },

    // --- Day 9 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(9, 8, 30), meal_type: "breakfast", title: "Cottage cheese with pineapple", kcal: 280, protein_g: 24, carbs_g: 28, fat_g: 6, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(9, 12, 20), meal_type: "lunch", title: "Falafel plate with hummus", kcal: 580, protein_g: 22, carbs_g: 62, fat_g: 28, confidence: 0.69, notes: "Hummus portion estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(9, 19, 40), meal_type: "dinner", title: "Roast chicken with potatoes", kcal: 700, protein_g: 46, carbs_g: 52, fat_g: 28, confidence: null, notes: "Sunday roast" },

    // --- Day 10 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(10, 7, 40), meal_type: "breakfast", title: "Muesli with milk", kcal: 340, protein_g: 12, carbs_g: 54, fat_g: 8, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(10, 13, 30), meal_type: "lunch", title: "Grilled shrimp tacos", kcal: 520, protein_g: 30, carbs_g: 48, fat_g: 22, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(10, 20, 0), meal_type: "dinner", title: "Risotto with mushrooms", kcal: 620, protein_g: 18, carbs_g: 78, fat_g: 26, confidence: 0.76, notes: "Parmesan amount estimated" },

    // --- Day 11 ---
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(11, 8, 0), meal_type: "breakfast", title: "Acai bowl", kcal: 410, protein_g: 8, carbs_g: 68, fat_g: 14, confidence: 0.64, notes: "Granola topping estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(11, 12, 10), meal_type: "lunch", title: "Ham and cheese sandwich", kcal: 440, protein_g: 26, carbs_g: 40, fat_g: 20, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(11, 19, 15), meal_type: "dinner", title: "Salmon with asparagus", kcal: 520, protein_g: 42, carbs_g: 14, fat_g: 32, confidence: null, notes: "" },

    // --- Day 12 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(12, 9, 10), meal_type: "breakfast", title: "Boiled eggs and toast", kcal: 350, protein_g: 22, carbs_g: 28, fat_g: 16, confidence: null, notes: "" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(12, 12, 50), meal_type: "lunch", title: "Pad thai with tofu", kcal: 640, protein_g: 24, carbs_g: 82, fat_g: 24, confidence: 0.72, notes: "Noodle portion estimated" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(12, 16, 0), meal_type: "snack", title: "Apple with peanut butter", kcal: 260, protein_g: 8, carbs_g: 30, fat_g: 14, confidence: null, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(12, 20, 20), meal_type: "dinner", title: "Chicken curry with rice", kcal: 720, protein_g: 38, carbs_g: 80, fat_g: 26, confidence: null, notes: "" },

    // --- Day 13 ---
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(13, 8, 0), meal_type: "breakfast", title: "Crêpes with Nutella", kcal: 520, protein_g: 10, carbs_g: 72, fat_g: 22, confidence: null, notes: "Cheat breakfast" },
    { user_id: userId, author: "ai", source_detail: "photo_ai", eaten_at: timeAt(13, 13, 20), meal_type: "lunch", title: "Vietnamese pho", kcal: 480, protein_g: 30, carbs_g: 54, fat_g: 12, confidence: 0.83, notes: "" },
    { user_id: userId, author: "manual", source_detail: "manual_form", eaten_at: timeAt(13, 19, 50), meal_type: "dinner", title: "Grilled lamb chops with couscous", kcal: 680, protein_g: 44, carbs_g: 50, fat_g: 30, confidence: null, notes: "" },
  ];
}

async function runSeed() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing Supabase environment variables");
  }

  const userId = resolveUserId();
  const seedMeals = buildMeals(userId);

  console.log(`Seeding data for user: ${userId}`);

  const { data: existingMeals, error: existingError } = await supabaseAdmin
    .from("meals")
    .select("id")
    .eq("user_id", userId);

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingMeals && existingMeals.length > 0) {
    const ids = existingMeals.map((meal) => meal.id);
    const { error: deleteError } = await supabaseAdmin.from("meals").delete().in("id", ids);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    console.log(`Deleted ${ids.length} existing meals.`);
  }

  const { error: insertError } = await supabaseAdmin.from("meals").insert(seedMeals);
  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: goalsError } = await supabaseAdmin
    .from("nutrition_goals")
    .upsert({
      user_id: userId,
      kcal_target: 2200,
      protein_g_target: 140,
      carbs_g_target: 250,
      fat_g_target: 70,
    });

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  console.log(
    `Seed complete: ${seedMeals.length} meals across 14 days + nutrition goals inserted.`,
  );
}

runSeed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
