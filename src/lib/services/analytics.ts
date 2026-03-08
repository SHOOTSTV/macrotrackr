import { supabaseAdmin } from "@/src/lib/supabase/admin";

export type AnalyticsEventName =
  | "streak_day_completed"
  | "weekly_goal_hit"
  | "weight_logged"
  | "meal_reminder_shown"
  | "onboarding_completed"
  | "favorite_added"
  | "meal_logged"
  | "search_used"
  | "macro_alert_triggered"
  | "meal_copied"
  | "signup_completed"
  | "first_meal_logged"
  | "day2_active"
  | "day7_active";

function toIsoDay(value: string): string {
  return value.slice(0, 10);
}

function diffDays(fromDay: string, toDay: string): number {
  const from = new Date(`${fromDay}T00:00:00.000Z`).getTime();
  const to = new Date(`${toDay}T00:00:00.000Z`).getTime();
  return Math.floor((to - from) / (24 * 60 * 60 * 1000));
}

export async function trackAnalyticsEvent(
  userId: string,
  eventName: AnalyticsEventName,
  payload: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabaseAdmin.from("analytics_events").insert({
    user_id: userId,
    event_name: eventName,
    payload,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function hasAnalyticsEvent(userId: string, eventName: AnalyticsEventName): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("analytics_events")
    .select("id")
    .eq("user_id", userId)
    .eq("event_name", eventName)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function trackAnalyticsEventOnce(
  userId: string,
  eventName: AnalyticsEventName,
  payload: Record<string, unknown>,
): Promise<void> {
  if (await hasAnalyticsEvent(userId, eventName)) {
    return;
  }

  await trackAnalyticsEvent(userId, eventName, payload);
}

export async function trackFunnelProgressOnMealLogged(userId: string, eatenAtIso: string): Promise<void> {
  const currentDay = toIsoDay(eatenAtIso);

  await trackAnalyticsEvent(userId, "meal_logged", { eaten_at: eatenAtIso });

  const { data: firstMealEvent, error } = await supabaseAdmin
    .from("analytics_events")
    .select("payload, created_at")
    .eq("user_id", userId)
    .eq("event_name", "first_meal_logged")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!firstMealEvent) {
    await trackAnalyticsEvent(userId, "first_meal_logged", {
      first_meal_day: currentDay,
      eaten_at: eatenAtIso,
    });
    return;
  }

  const firstMealDay = typeof firstMealEvent.payload?.first_meal_day === "string"
    ? firstMealEvent.payload.first_meal_day
    : toIsoDay(firstMealEvent.created_at);

  const dayOffset = diffDays(firstMealDay, currentDay);

  if (dayOffset >= 1) {
    await trackAnalyticsEventOnce(userId, "day2_active", {
      first_meal_day: firstMealDay,
      active_day: currentDay,
      day_offset: dayOffset,
    });
  }

  if (dayOffset >= 6) {
    await trackAnalyticsEventOnce(userId, "day7_active", {
      first_meal_day: firstMealDay,
      active_day: currentDay,
      day_offset: dayOffset,
    });
  }
}
