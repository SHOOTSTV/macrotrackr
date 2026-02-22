"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { EditMealModal } from "@/src/features/dashboard/components/edit-meal-modal";
import { GoalsProgressCard } from "@/src/features/dashboard/components/goals-progress-card";
import type { Meal } from "@/src/types/meal";
import type { NutritionGoalsInput } from "@/src/types/profile";

interface HistoryDayGroupsProps {
  meals: Meal[];
  goals: NutritionGoalsInput | null;
}

interface DayGroup {
  dayKey: string;
  meals: Meal[];
  totals: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

function groupMealsByDay(meals: Meal[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  for (const meal of meals) {
    const dayKey = format(new Date(meal.eaten_at), "yyyy-MM-dd");
    const existing = groups.get(dayKey);

    if (!existing) {
      groups.set(dayKey, {
        dayKey,
        meals: [meal],
        totals: {
          kcal: meal.kcal,
          protein: meal.protein_g,
          carbs: meal.carbs_g,
          fat: meal.fat_g,
        },
      });
      continue;
    }

    existing.meals.push(meal);
    existing.totals.kcal += meal.kcal;
    existing.totals.protein += meal.protein_g;
    existing.totals.carbs += meal.carbs_g;
    existing.totals.fat += meal.fat_g;
  }

  return Array.from(groups.values()).sort((a, b) => b.dayKey.localeCompare(a.dayKey));
}

export function HistoryDayGroups({ meals, goals }: HistoryDayGroupsProps) {
  const router = useRouter();
  const dayGroups = groupMealsByDay(meals);

  if (dayGroups.length === 0) {
    return <Card>No meals for this period.</Card>;
  }

  return (
    <div className="space-y-4">
      {dayGroups.map((group) => (
        <Card key={group.dayKey} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {format(new Date(group.dayKey), "dd/MM/yyyy")}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-blue-50 px-2 py-1 text-blue-700">
                <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
                <span className="font-semibold">{group.totals.kcal.toFixed(0)}</span>
              </span>
              <span className="rounded-lg bg-cyan-50 px-2 py-1 text-cyan-700">
                <span className="font-medium uppercase tracking-wide">protein</span>{" "}
                <span className="font-semibold">{group.totals.protein.toFixed(1)}g</span>
              </span>
              <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700">
                <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
                <span className="font-semibold">{group.totals.carbs.toFixed(1)}g</span>
              </span>
              <span className="rounded-lg bg-violet-50 px-2 py-1 text-violet-700">
                <span className="font-medium uppercase tracking-wide">fat</span>{" "}
                <span className="font-semibold">{group.totals.fat.toFixed(1)}g</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <GoalsProgressCard
              title="Goal progress"
              consumed={{
                kcal: group.totals.kcal,
                protein: group.totals.protein,
                carbs: group.totals.carbs,
                fat: group.totals.fat,
              }}
              goals={goals}
            />
            {group.meals.map((meal) => (
              <div key={meal.id} className="rounded-xl border border-slate-100 bg-white/80 p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{meal.title}</p>
                      <Badge>{meal.author}</Badge>
                      {meal.low_confidence ? (
                        <Badge variant="warning">low_confidence</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500">
                      {meal.meal_type} - {format(new Date(meal.eaten_at), "HH:mm")}
                    </p>
                  </div>
                  <EditMealModal
                    meal={meal}
                    onUpdated={async () => router.refresh()}
                  />
                </div>

                <div className="mt-1.5 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                  <p className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
                    <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
                    <span className="text-sm font-semibold">{meal.kcal}</span>
                  </p>
                  <p className="rounded-lg bg-cyan-50 px-2 py-1 text-cyan-700">
                    <span className="font-medium uppercase tracking-wide">protein</span>{" "}
                    <span className="text-sm font-semibold">{meal.protein_g}g</span>
                  </p>
                  <p className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700">
                    <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
                    <span className="text-sm font-semibold">{meal.carbs_g}g</span>
                  </p>
                  <p className="rounded-lg bg-violet-50 px-2 py-1 text-violet-700">
                    <span className="font-medium uppercase tracking-wide">fat</span>{" "}
                    <span className="text-sm font-semibold">{meal.fat_g}g</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
