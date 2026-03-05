import { z } from "zod";

import { mealTypeSchema } from "./meals";

const numberMacro = z.number().finite().nonnegative();
const booleanQuerySchema = z
  .union([z.boolean(), z.string()])
  .transform((value, context) => {
    if (typeof value === "boolean") {
      return value;
    }

    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "true") {
      return true;
    }

    if (normalizedValue === "false") {
      return false;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expected boolean value (true or false)",
    });

    return z.NEVER;
  });

export const createFavoriteSchema = z.object({
  meal_id: z.string().uuid(),
});

export const mealSearchQuerySchema = z.object({
  q: z.string().trim().max(120).default(""),
  favoritesOnly: booleanQuerySchema.default(false),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const logFromTemplateSchema = z.object({
  source: z.enum(["favorite", "history"]),
  favorite_id: z.string().uuid().optional(),
  source_meal_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).max(180),
  kcal: numberMacro.max(10000),
  protein_g: numberMacro.max(500),
  carbs_g: numberMacro.max(1000),
  fat_g: numberMacro.max(500),
  meal_type: mealTypeSchema,
}).superRefine((value, context) => {
  if (value.source === "favorite" && !value.favorite_id) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "favorite_id is required when source is favorite",
      path: ["favorite_id"],
    });
  }
});

export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
export type MealSearchQueryInput = z.infer<typeof mealSearchQuerySchema>;
export type LogFromTemplateInput = z.infer<typeof logFromTemplateSchema>;
