export type UserSex = "male" | "female";
export type UserGoal = "lose" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface UserProfile {
  user_id: string;
  sex: UserSex;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: UserGoal;
  created_at: string;
  updated_at: string;
}

export interface OnboardingInput {
  sex: UserSex;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: UserGoal;
}
