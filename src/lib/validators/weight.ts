import { z } from "zod";

export const createWeightLogSchema = z.object({
  weight_kg: z.number().finite().min(20).max(400),
  logged_at: z.string().datetime({ offset: true }).optional(),
});

export const weightRangeQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine((value) => value.from <= value.to, {
  path: ["from"],
  message: "'from' must be before or equal to 'to'",
});
