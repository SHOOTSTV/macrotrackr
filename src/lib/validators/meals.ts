import { z } from "zod";

const numberMacro = z.number().finite().nonnegative();
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");
const isoDateTimeWithOffsetSchema = z
  .string()
  .datetime({ offset: true, message: "Expected ISO datetime with offset" });

export const mealTypeSchema = z.enum(["breakfast", "lunch", "dinner", "snack"]);
export const mealAuthorSchema = z.enum(["ai", "manual"]);

export const createMealSchema = z.object({
  author: mealAuthorSchema,
  source_detail: z.string().trim().min(1).max(80),
  eaten_at: isoDateTimeWithOffsetSchema,
  meal_type: mealTypeSchema,
  title: z.string().trim().min(1).max(180),
  kcal: numberMacro.max(10000),
  protein_g: numberMacro.max(500),
  carbs_g: numberMacro.max(1000),
  fat_g: numberMacro.max(500),
  confidence: z.number().finite().min(0).max(1).nullable(),
  notes: z.string().max(800).optional().default(""),
});

export const patchMealSchema = z
  .object({
    eaten_at: isoDateTimeWithOffsetSchema.optional(),
    meal_type: mealTypeSchema.optional(),
    title: z.string().trim().min(1).max(180).optional(),
    kcal: numberMacro.max(10000).optional(),
    protein_g: numberMacro.max(500).optional(),
    carbs_g: numberMacro.max(1000).optional(),
    fat_g: numberMacro.max(500).optional(),
    confidence: z.number().finite().min(0).max(1).nullable().optional(),
    notes: z.string().max(800).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const dayQuerySchema = z.object({
  date: isoDateSchema,
});

export const rangeQuerySchema = z
  .object({
    from: isoDateSchema,
    to: isoDateSchema,
  })
  .refine((value) => value.from <= value.to, {
    message: "'from' must be before or equal to 'to'",
    path: ["from"],
  });

export type CreateMealInput = z.infer<typeof createMealSchema>;
export type PatchMealInput = z.infer<typeof patchMealSchema>;
