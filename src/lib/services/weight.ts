import { supabaseAdmin } from "../supabase/admin";
import type { WeightLog } from "../../types/weight";

export async function createWeightLog(userId: string, weightKg: number, loggedAt?: string): Promise<WeightLog> {
  const { data, error } = await supabaseAdmin
    .from("weight_logs")
    .insert({
      user_id: userId,
      weight_kg: weightKg,
      logged_at: loggedAt ?? new Date().toISOString(),
      source: "manual",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save weight");
  }

  return data as WeightLog;
}

export async function listWeightLogsForRange(userId: string, from: string, to: string): Promise<WeightLog[]> {
  const { data, error } = await supabaseAdmin
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_at", `${from}T00:00:00.000Z`)
    .lte("logged_at", `${to}T23:59:59.999Z`)
    .order("logged_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as WeightLog[];
}

export { buildWeightTrend } from "./weight-trend";
