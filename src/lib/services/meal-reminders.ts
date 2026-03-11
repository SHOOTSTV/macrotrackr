import type { Meal, MealType } from "../../types/meal";

interface ReminderCandidate {
  mealType: MealType;
  targetMinute: number;
  source: "habit" | "default";
}

export interface SmartMealReminder {
  mealType: MealType;
  message: string;
  source: "habit" | "default";
  targetMinute: number;
}

const DEFAULT_MINUTES: Record<MealType, number> = {
  breakfast: 8 * 60,
  lunch: 13 * 60,
  dinner: 20 * 60,
  snack: 16 * 60,
};

function toMinuteOfDay(isoDate: string): number {
  const date = new Date(isoDate);
  return date.getHours() * 60 + date.getMinutes();
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  return sorted[mid];
}

function buildCandidate(mealType: MealType, recentMeals: Meal[]): ReminderCandidate {
  const values = recentMeals
    .filter((meal) => meal.meal_type === mealType)
    .map((meal) => toMinuteOfDay(meal.eaten_at));

  if (values.length >= 3) {
    return {
      mealType,
      targetMinute: median(values),
      source: "habit",
    };
  }

  return {
    mealType,
    targetMinute: DEFAULT_MINUTES[mealType],
    source: "default",
  };
}

export function detectSmartMealReminder(
  recentMeals: Meal[],
  todayMeals: Meal[],
  now: Date,
): SmartMealReminder | null {
  const nowMinute = now.getHours() * 60 + now.getMinutes();

  const candidates = (Object.keys(DEFAULT_MINUTES) as MealType[])
    .map((mealType) => buildCandidate(mealType, recentMeals))
    .filter((candidate) => !todayMeals.some((meal) => meal.meal_type === candidate.mealType));

  const inWindowMatch = candidates
    .filter((candidate) => nowMinute >= candidate.targetMinute + 30 && nowMinute <= candidate.targetMinute + 180)
    .sort((a, b) => b.targetMinute - a.targetMinute)[0];

  if (inWindowMatch) {
    return {
      mealType: inWindowMatch.mealType,
      source: inWindowMatch.source,
      targetMinute: inWindowMatch.targetMinute,
      message: `You usually log ${inWindowMatch.mealType} around this time. Want to add it now?`,
    };
  }

  // Keep one reminder visible even if the initial 3-hour window has passed.
  const overdueMatch = candidates
    .filter((candidate) => nowMinute >= candidate.targetMinute + 30)
    .sort((a, b) => b.targetMinute - a.targetMinute)[0];

  if (!overdueMatch) {
    return null;
  }

  return {
    mealType: overdueMatch.mealType,
    source: overdueMatch.source,
    targetMinute: overdueMatch.targetMinute,
    message: `You usually log ${overdueMatch.mealType} around this time. Want to add it now?`,
  };
}

