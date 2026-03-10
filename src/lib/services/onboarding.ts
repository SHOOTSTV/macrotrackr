import { supabaseAdmin } from "../supabase/admin";
import type { OnboardingInput, UserProfile } from "../../types/onboarding";
import { computeAdaptiveGoals } from "./onboarding-calculator";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("user_profile")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserProfile | null) ?? null;
}

export async function completeOnboarding(userId: string, input: OnboardingInput) {
  const goals = computeAdaptiveGoals(input);

  const { error: profileError } = await supabaseAdmin
    .from("user_profile")
    .upsert(
      {
        user_id: userId,
        ...input,
      },
      { onConflict: "user_id" },
    );

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: nutritionGoals, error: goalsError } = await supabaseAdmin
    .from("nutrition_goals")
    .upsert(
      {
        user_id: userId,
        ...goals,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (goalsError || !nutritionGoals) {
    throw new Error(goalsError?.message ?? "Unable to save adaptive goals");
  }

  return nutritionGoals;
}

