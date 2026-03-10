import { formatISO, subDays, addDays } from "date-fns";

import { trackAnalyticsEvent } from "@/src/lib/services/analytics";
import { recalculateProgress } from "@/src/lib/services/progress";
import { getNutritionGoalsOrDefault } from "@/src/lib/services/profile-goals";
import { supabaseAdmin } from "@/src/lib/supabase/admin";
import type { UserProgress } from "@/src/types/progress";

const DEFAULT_TIMEZONE = "UTC";

function formatDayInTimeZone(value: string | Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof value === "string" ? new Date(value) : value);
}

function weekRangeFromDay(day: string): { weekStart: string; weekEnd: string } {
  const current = new Date(`${day}T00:00:00.000Z`);
  const isoWeekday = (current.getUTCDay() + 6) % 7;
  const start = subDays(current, isoWeekday);
  const end = addDays(start, 6);

  return {
    weekStart: formatISO(start, { representation: "date" }),
    weekEnd: formatISO(end, { representation: "date" }),
  };
}

async function getUserProgressRecord(userId: string): Promise<UserProgress | null> {
  const { data, error } = await supabaseAdmin
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserProgress | null) ?? null;
}

async function listValidatedDays(userId: string, timeZone: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin.from("meals").select("eaten_at").eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return [...new Set((data ?? []).map((row) => formatDayInTimeZone(row.eaten_at, timeZone)))];
}

export async function synchronizeUserProgress(userId: string): Promise<void> {
  const [progressRecord, goals] = await Promise.all([
    getUserProgressRecord(userId),
    getNutritionGoalsOrDefault(userId),
  ]);

  const timeZone = progressRecord?.timezone ?? DEFAULT_TIMEZONE;
  const today = formatDayInTimeZone(new Date(), timeZone);
  const { weekStart, weekEnd } = weekRangeFromDay(today);
  const validatedDays = await listValidatedDays(userId, timeZone);

  const snapshot = recalculateProgress({
    validatedDays,
    today,
    weekStart,
    weekEnd,
    weeklyTarget: goals.weekly_target,
  });

  const { error } = await supabaseAdmin.from("user_progress").upsert(
    {
      user_id: userId,
      timezone: timeZone,
      current_streak: snapshot.currentStreak,
      best_streak: snapshot.bestStreak,
      weekly_completed_days: snapshot.weeklyCompletedDays,
      week_start_date: weekStart,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  const previousCurrentStreak = progressRecord?.current_streak ?? 0;
  const previousWeeklyCompletedDays = progressRecord?.weekly_completed_days ?? 0;

  const analyticsTasks: Promise<void>[] = [];

  if (snapshot.currentStreak > previousCurrentStreak) {
    analyticsTasks.push(
      trackAnalyticsEvent(userId, "streak_day_completed", {
        date: today,
        current_streak: snapshot.currentStreak,
        best_streak: snapshot.bestStreak,
      }),
    );
  }

  if (snapshot.weeklyGoalHit && previousWeeklyCompletedDays < snapshot.weeklyTarget) {
    analyticsTasks.push(
      trackAnalyticsEvent(userId, "weekly_goal_hit", {
        week_start_date: weekStart,
        weekly_completed_days: snapshot.weeklyCompletedDays,
        weekly_target: snapshot.weeklyTarget,
      }),
    );
  }

  await Promise.all(analyticsTasks);
}

