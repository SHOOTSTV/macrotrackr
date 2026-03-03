import { supabaseAdmin } from "@/src/lib/supabase/admin";
import { getNutritionGoalsOrDefault } from "@/src/lib/services/profile-goals";
import type { StreakProgressPayload, UserProgress, WeeklyProgressPayload } from "@/src/types/progress";

const DEFAULT_TIMEZONE = "UTC";
const DEFAULT_WEEK_START_DATE = "1970-01-01";

function toUserProgressDefaults(userId: string): UserProgress {
  return {
    user_id: userId,
    timezone: DEFAULT_TIMEZONE,
    current_streak: 0,
    best_streak: 0,
    weekly_completed_days: 0,
    week_start_date: DEFAULT_WEEK_START_DATE,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

export async function getUserProgressOrDefault(userId: string): Promise<UserProgress> {
  const { data, error } = await supabaseAdmin
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserProgress | null) ?? toUserProgressDefaults(userId);
}

export async function getStreakProgress(userId: string): Promise<StreakProgressPayload> {
  const progress = await getUserProgressOrDefault(userId);

  return {
    timezone: progress.timezone,
    current_streak: progress.current_streak,
    best_streak: progress.best_streak,
    weekly_completed_days: progress.weekly_completed_days,
    week_start_date: progress.week_start_date,
  };
}

export async function getWeeklyProgress(userId: string): Promise<WeeklyProgressPayload> {
  const [progress, goals] = await Promise.all([
    getUserProgressOrDefault(userId),
    getNutritionGoalsOrDefault(userId),
  ]);

  const weeklyTarget = Math.min(7, Math.max(1, Math.round(goals.weekly_target)));
  const completed = Math.max(0, Math.min(7, progress.weekly_completed_days));

  return {
    timezone: progress.timezone,
    week_start_date: progress.week_start_date,
    weekly_completed_days: completed,
    weekly_target: weeklyTarget,
    remaining_days: Math.max(0, weeklyTarget - completed),
    weekly_goal_hit: completed >= weeklyTarget,
  };
}
