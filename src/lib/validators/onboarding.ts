import { z } from "zod";

export const onboardingSchema = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(16).max(90),
  height_cm: z.number().min(120).max(230),
  weight_kg: z.number().min(35).max(300),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose", "maintain", "gain"]),
});

export type OnboardingPayload = z.infer<typeof onboardingSchema>;

