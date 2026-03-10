import { z } from "zod";

export const reminderShownSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  source: z.enum(["habit", "default"]),
});

