"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { EditMealModal } from "@/src/features/dashboard/components/edit-meal-modal";
import { GoalsProgressCard } from "@/src/features/dashboard/components/goals-progress-card";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
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

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function HistoryDayGroups({ meals, goals }: HistoryDayGroupsProps) {
  const router = useRouter();
  const [deletingDayKey, setDeletingDayKey] = useState<string | null>(null);
  const [deleteDayError, setDeleteDayError] = useState<string | null>(null);
  const dayGroups = groupMealsByDay(meals);

  async function onDeleteDay(dayKey: string) {
    const confirmed = window.confirm(
      `Delete all meals for ${format(new Date(dayKey), "dd/MM/yyyy")} permanently?`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingDayKey(dayKey);
    setDeleteDayError(null);

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/meals/day?date=${encodeURIComponent(dayKey)}`, {
        method: "DELETE",
        headers: {
          "x-dashboard-ui": "1",
          ...authHeaders,
        },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to delete meals for this day");
      }

      router.refresh();
    } catch (error) {
      setDeleteDayError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setDeletingDayKey(null);
    }
  }

  if (dayGroups.length === 0) {
    return <Card>No meals for this period.</Card>;
  }

  return (
    <div className="space-y-4">
      {dayGroups.map((group, index) => (
        <details
          key={group.dayKey}
          open={index === 0}
          className="group rounded-[28px] border border-black/8 bg-white/72 shadow-[0_18px_36px_rgba(21,21,21,0.05)] backdrop-blur-xl"
        >
          <summary className="list-none cursor-pointer p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">
                  {format(new Date(group.dayKey), "EEEE")}
                </p>
                <h3 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">
                  {format(new Date(group.dayKey), "MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-[#6f685f]">
                  {group.meals.length} meal{group.meals.length === 1 ? "" : "s"} logged
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden flex-wrap gap-2 sm:flex">
                  <span className="rounded-full bg-[#edf1ea] px-3 py-1.5 text-xs text-[#365141]">
                    <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
                    <span className="font-semibold">{group.totals.kcal.toFixed(0)}</span>
                  </span>
                  <span className="rounded-full bg-[#e4ece9] px-3 py-1.5 text-xs text-[#44747b]">
                    <span className="font-medium uppercase tracking-wide">protein</span>{" "}
                    <span className="font-semibold">{group.totals.protein.toFixed(1)}g</span>
                  </span>
                  <span className="rounded-full bg-[#f2eadb] px-3 py-1.5 text-xs text-[#7a5b33]">
                    <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
                    <span className="font-semibold">{group.totals.carbs.toFixed(1)}g</span>
                  </span>
                  <span className="rounded-full bg-[#ece7f0] px-3 py-1.5 text-xs text-[#66557e]">
                    <span className="font-medium uppercase tracking-wide">fat</span>{" "}
                    <span className="font-semibold">{group.totals.fat.toFixed(1)}g</span>
                  </span>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-[#f8f4ee] text-[#5f5a53] transition duration-200 group-open:rotate-180">
                  <ChevronIcon />
                </div>
              </div>
            </div>
          </summary>

          <div className="border-t border-black/6 px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 sm:hidden">
                  <span className="rounded-full bg-[#edf1ea] px-3 py-1.5 text-xs text-[#365141]">
                    <span className="font-medium uppercase tracking-wide">kcal</span>{" "}
                    <span className="font-semibold">{group.totals.kcal.toFixed(0)}</span>
                  </span>
                  <span className="rounded-full bg-[#e4ece9] px-3 py-1.5 text-xs text-[#44747b]">
                    <span className="font-medium uppercase tracking-wide">protein</span>{" "}
                    <span className="font-semibold">{group.totals.protein.toFixed(1)}g</span>
                  </span>
                  <span className="rounded-full bg-[#f2eadb] px-3 py-1.5 text-xs text-[#7a5b33]">
                    <span className="font-medium uppercase tracking-wide">carbs</span>{" "}
                    <span className="font-semibold">{group.totals.carbs.toFixed(1)}g</span>
                  </span>
                  <span className="rounded-full bg-[#ece7f0] px-3 py-1.5 text-xs text-[#66557e]">
                    <span className="font-medium uppercase tracking-wide">fat</span>{" "}
                    <span className="font-semibold">{group.totals.fat.toFixed(1)}g</span>
                  </span>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => onDeleteDay(group.dayKey)}
                  disabled={deletingDayKey === group.dayKey}
                  className="border-[#e9c7bf] text-[#8a3d30] hover:bg-[#f5dfdb] hover:text-[#7d3428]"
                >
                  {deletingDayKey === group.dayKey ? "Deleting..." : "Delete day"}
                </Button>
              </div>

              {deleteDayError && deletingDayKey === null ? (
                <p className="text-sm text-[#8a3d30]">{deleteDayError}</p>
              ) : null}

              <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-5">
                <GoalsProgressCard
                  title="Goal progress"
                  consumed={{
                    kcal: group.totals.kcal,
                    protein: group.totals.protein,
                    carbs: group.totals.carbs,
                    fat: group.totals.fat,
                  }}
                  goals={goals}
                  embedded
                />
              </div>

              <div className="space-y-3">
                {group.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="relative overflow-hidden rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4"
                  >
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#b8cae6] to-transparent" />
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#f1ebe2] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6f685f]">
                            {meal.meal_type}
                          </span>
                          <span className="text-sm text-[#7a736b]">{format(new Date(meal.eaten_at), "HH:mm")}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[1.05rem] font-medium tracking-[-0.04em] text-[#151515]">{meal.title}</p>
                          <Badge>{meal.author}</Badge>
                          {meal.low_confidence ? <Badge variant="warning">low_confidence</Badge> : null}
                        </div>
                      </div>
                      <EditMealModal meal={meal} onUpdated={async () => router.refresh()} triggerClassName="bg-white hover:bg-[#efe7dc]" />
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}