import { supabaseAdmin } from "@/src/lib/supabase/admin";

export type AnalyticsEventName = "streak_day_completed" | "weekly_goal_hit";

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
