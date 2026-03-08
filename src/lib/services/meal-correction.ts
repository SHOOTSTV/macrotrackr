export interface MealMacroValues {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface MealCorrectionResult {
  updated: MealMacroValues;
  touchedFields: Array<keyof MealMacroValues>;
}

const NUTRIENT_PATTERNS: Array<{ field: keyof MealMacroValues; pattern: RegExp }> = [
  { field: "kcal", pattern: /kcal|calories?|cal\b/ },
  { field: "protein_g", pattern: /proteins?|prot\b|p\b/ },
  { field: "carbs_g", pattern: /carbs?|carb\b|c\b/ },
  { field: "fat_g", pattern: /fats?|lipids?|f\b/ },
];

function resolveField(raw: string): keyof MealMacroValues | null {
  const value = raw.trim().toLowerCase();
  const match = NUTRIENT_PATTERNS.find(({ pattern }) => pattern.test(value));
  return match?.field ?? null;
}

function clampMacro(field: keyof MealMacroValues, value: number): number {
  const nonNegative = Math.max(0, value);

  if (field === "kcal") {
    return Math.round(nonNegative);
  }

  return Math.round(nonNegative * 10) / 10;
}

export function applyMealCorrection(input: string, current: MealMacroValues): MealCorrectionResult {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Enter a correction command.");
  }

  const updated: MealMacroValues = { ...current };
  const touched = new Set<keyof MealMacroValues>();

  const absolutePattern = /(kcal|calories?|cal|proteins?|prot|carbs?|carb|fats?|lipids?)\s*[:=]?\s*(\d+(?:\.\d+)?)/g;
  for (const match of normalized.matchAll(absolutePattern)) {
    const field = resolveField(match[1]);
    const value = Number(match[2]);
    if (!field || Number.isNaN(value)) {
      continue;
    }

    updated[field] = clampMacro(field, value);
    touched.add(field);
  }

  const deltaPattern = /([+-]\d+(?:\.\d+)?)\s*(kcal|calories?|cal|proteins?|prot|carbs?|carb|fats?|lipids?)/g;
  for (const match of normalized.matchAll(deltaPattern)) {
    const field = resolveField(match[2]);
    const value = Number(match[1]);
    if (!field || Number.isNaN(value)) {
      continue;
    }

    updated[field] = clampMacro(field, updated[field] + value);
    touched.add(field);
  }

  const verbPattern = /(increase|add|decrease|reduce|remove)\s+(kcal|calories?|cal|proteins?|prot|carbs?|carb|fats?|lipids?)\s*(?:by)?\s*(\d+(?:\.\d+)?)/g;
  for (const match of normalized.matchAll(verbPattern)) {
    const field = resolveField(match[2]);
    const value = Number(match[3]);
    if (!field || Number.isNaN(value)) {
      continue;
    }

    const isPositive = match[1] === "increase" || match[1] === "add";
    updated[field] = clampMacro(field, updated[field] + (isPositive ? value : -value));
    touched.add(field);
  }

  if (touched.size === 0) {
    throw new Error("Could not parse correction. Example: '+10 protein -5 carbs' or 'kcal 620'.");
  }

  return {
    updated,
    touchedFields: [...touched],
  };
}
