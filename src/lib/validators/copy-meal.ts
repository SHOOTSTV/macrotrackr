import { z } from "zod";

export const copyPreviousMealSchema = z.object({
  meal_id: z.string().uuid(),
});

export type CopyPreviousMealInput = z.infer<typeof copyPreviousMealSchema>;

