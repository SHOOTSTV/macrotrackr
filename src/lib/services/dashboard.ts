import { eachDayOfInterval, formatISO } from "date-fns";

import { supabaseAdmin } from "@/src/lib/supabase/admin";
import { listMealsForDate, listMealsForRange } from "@/src/lib/services/meals";
import type { DailySummary, Meal } from "@/src/types/meal";

interface DayDashboardPayload {
  date: string;
  summary: DailySummary;
  meals: Meal[];
}

interface RangeDashboardPayload {
  from: string;
  to: string;
  days: DailySummary[];
  meals: Meal[];
}

const emptySummary = (userId: string, date: string): DailySummary => ({
  user_id: userId,
  day: date,
  meals_count: 0,
  kcal_total: 0,
  protein_total: 0,
  carbs_total: 0,
  fat_total: 0,
});

export async function getDayDashboard(userId: string, date: string): Promise<DayDashboardPayload> {
  const meals = await listMealsForDate(userId, date);
  const { data, error } = await supabaseAdmin
    .from("daily_summary")
    .select("*")
    .eq("user_id", userId)
    .eq("day", date)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    date,
    summary: (data as DailySummary | null) ?? emptySummary(userId, date),
    meals,
  };
}

export async function getRangeDashboard(
  userId: string,
  from: string,
  to: string,
): Promise<RangeDashboardPayload> {
  const meals = await listMealsForRange(userId, from, to);
  const { data, error } = await supabaseAdmin
    .from("daily_summary")
    .select("*")
    .eq("user_id", userId)
    .gte("day", from)
    .lte("day", to)
    .order("day", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const byDate = new Map<string, DailySummary>(
    ((data ?? []) as DailySummary[]).map((day) => [day.day, day]),
  );
  const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) });

  const days = dates.map((dateValue) => {
    const isoDate = formatISO(dateValue, { representation: "date" });
    return byDate.get(isoDate) ?? emptySummary(userId, isoDate);
  });

  return { from, to, days, meals };
}
