"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { EditMealModal } from "@/src/features/dashboard/components/edit-meal-modal";
import type { Meal } from "@/src/types/meal";

interface MealListProps {
  meals: Meal[];
  embedded?: boolean;
}

function MealContent({
  meal,
  embedded,
  onUpdated,
}: {
  meal: Meal
  embedded: boolean
  onUpdated: () => Promise<void>
}) {
  return (
    <>
      {embedded ? (
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#b8cae6] to-transparent" />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f1ebe2] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6f685f]">
              {meal.meal_type}
            </span>
            <span className="text-sm text-[#7a736b]">{format(new Date(meal.eaten_at), "HH:mm")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p
              className={
                embedded
                  ? "text-[1.15rem] font-medium tracking-[-0.04em] text-[#151515]"
                  : "text-base font-semibold text-[#151515]"
              }
            >
              {meal.title}
            </p>
            <Badge>{meal.author}</Badge>
            {meal.low_confidence ? <Badge variant="warning">low_confidence</Badge> : null}
          </div>
        </div>

        <EditMealModal
          meal={meal}
          onUpdated={onUpdated}
          triggerClassName={embedded ? "bg-[#f6f0e8] hover:bg-[#eee5da]" : undefined}
        />
      </div>

      <div className={embedded ? "mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" : "mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4"}>
        <p className="rounded-xl bg-[#edf1ea] px-3 py-2 text-xs text-[#365141]">
          <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
          <span className="text-sm font-semibold">{meal.kcal}</span>
        </p>
        <p className="rounded-xl bg-[#e4ece9] px-3 py-2 text-xs text-[#44747b]">
          <span className="font-medium uppercase tracking-wide">protein</span>{" "}
          <span className="text-sm font-semibold">{meal.protein_g}g</span>
        </p>
        <p className="rounded-xl bg-[#f2eadb] px-3 py-2 text-xs text-[#7a5b33]">
          <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
          <span className="text-sm font-semibold">{meal.carbs_g}g</span>
        </p>
        <p className="rounded-xl bg-[#ece7f0] px-3 py-2 text-xs text-[#66557e]">
          <span className="font-medium uppercase tracking-wide">fat</span>{" "}
          <span className="text-sm font-semibold">{meal.fat_g}g</span>
        </p>
      </div>

      {meal.notes?.trim() ? (
        <p className="mt-3 rounded-xl border border-black/8 bg-[#ede7de] px-3 py-2.5 text-sm leading-6 text-[#4f4a43]">
          <span className="mr-1 font-semibold text-[#151515]">Description:</span>
          {meal.notes}
        </p>
      ) : null}
    </>
  )
}

export function MealList({ meals, embedded = false }: MealListProps) {
  const router = useRouter();

  if (meals.length === 0) {
    return embedded
      ? <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-5 text-sm text-[#6f685f]">No meals for this period.</div>
      : <Card>No meals for this period.</Card>
  }

  const embeddedItemClassName =
    "relative overflow-hidden rounded-[26px] border border-black/8 bg-white/88 p-5 shadow-[0_14px_28px_rgba(21,21,21,0.05)]"

  return (
    <div className="space-y-3">
      {meals.map((meal) => {
        const onUpdated = async () => router.refresh()

        return embedded ? (
          <div key={meal.id} className={embeddedItemClassName}>
            <MealContent meal={meal} embedded onUpdated={onUpdated} />
          </div>
        ) : (
          <Card key={meal.id} className="border-black/6">
            <MealContent meal={meal} embedded={false} onUpdated={onUpdated} />
          </Card>
        )
      })}
    </div>
  )
}