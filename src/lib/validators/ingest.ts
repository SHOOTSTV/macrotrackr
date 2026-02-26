import { z } from "zod";

const numberMacro = z.number().finite().nonnegative();
const isoDateTimeWithOffsetSchema = z
  .string()
  .datetime({ offset: true, message: "Expected ISO datetime with offset" });

export const ingestMealSchema = z
  .object({
    user_id: z.string().uuid(),
    title: z.string().trim().min(1).max(180),
    kcal: numberMacro.max(10000),
    protein_g: numberMacro.max(500),
    carbs_g: numberMacro.max(1000),
    fat_g: numberMacro.max(500),
    eaten_at: isoDateTimeWithOffsetSchema.optional(),
    meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
    author: z.enum(["ai", "manual"]).optional(),
    source_detail: z.string().trim().min(1).max(80).optional(),
    confidence: z.number().finite().min(0).max(1).nullable().optional(),
    notes: z.string().max(800).optional(),
  })
  .strict();

export type IngestMealInput = z.infer<typeof ingestMealSchema>;
