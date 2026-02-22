"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { EditMealModal } from "@/src/features/dashboard/components/edit-meal-modal";
import type { Meal } from "@/src/types/meal";

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  const router = useRouter();

  if (meals.length === 0) {
    return <Card>No meals for this period.</Card>;
  }

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <Card key={meal.id} className="border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-slate-900">{meal.title}</p>
                <Badge>{meal.author}</Badge>
                {meal.low_confidence ? <Badge variant="warning">low_confidence</Badge> : null}
              </div>
              <p className="text-sm text-slate-500">
                {meal.meal_type} - {format(new Date(meal.eaten_at), "HH:mm")}
              </p>
            </div>
            <EditMealModal meal={meal} onUpdated={async () => router.refresh()} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <p className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
              <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
              <span className="text-sm font-semibold">{meal.kcal}</span>
            </p>
            <p className="rounded-lg bg-cyan-50 px-2 py-1 text-xs text-cyan-700">
              <span className="font-medium uppercase tracking-wide">protein</span>{" "}
              <span className="text-sm font-semibold">{meal.protein_g}g</span>
            </p>
            <p className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700">
              <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
              <span className="text-sm font-semibold">{meal.carbs_g}g</span>
            </p>
            <p className="rounded-lg bg-violet-50 px-2 py-1 text-xs text-violet-700">
              <span className="font-medium uppercase tracking-wide">fat</span>{" "}
              <span className="text-sm font-semibold">{meal.fat_g}g</span>
            </p>
          </div>
          {meal.notes?.trim() ? (
            <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-700">
              <span className="mr-1 font-semibold text-slate-900">Description:</span>
              {meal.notes}
            </p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
