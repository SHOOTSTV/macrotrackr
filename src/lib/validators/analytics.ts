import { z } from "zod";

export const macroAlertEventSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  macro: z.enum(["kcal", "protein", "carbs", "fat"]),
  over_by: z.number().finite().nonnegative(),
  day_total: z.number().finite().nonnegative(),
  target: z.number().finite().positive(),
});

export type MacroAlertEventInput = z.infer<typeof macroAlertEventSchema>;
