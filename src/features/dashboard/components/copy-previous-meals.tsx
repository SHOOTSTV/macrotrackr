"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { CopyMealCandidate } from "@/src/types/meal";

interface CopyPreviousMealsProps {
  candidates: CopyMealCandidate[];
}

function sourceLabel(source: CopyMealCandidate["source"]): string {
  if (source === "yesterday") {
    return "Yesterday";
  }

  return "Last week";
}

export function CopyPreviousMeals({ candidates }: CopyPreviousMealsProps) {
  const router = useRouter();
  const [loadingMealId, setLoadingMealId] = useState<string | null>(null);

  async function copyMeal(mealId: string) {
    try {
      setLoadingMealId(mealId);
      const authHeaders = await getAuthHeaders();
      const response = await fetch("/api/meals/copy-previous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ meal_id: mealId }),
      });

      if (!response.ok) {
        throw new Error("Failed to copy meal");
      }

      toast.success("Meal copied");
      router.refresh();
    } catch {
      toast.error("Unable to copy meal");
    } finally {
      setLoadingMealId(null);
    }
  }

  return (
    <div className="space-y-3">
      {candidates.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-black/10 bg-[#f8f4ee] px-4 py-6 text-sm text-[#6f685f]">
          No previous meals available yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {candidates.map((candidate) => (
            <div
              key={`${candidate.source}-${candidate.meal.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-black/8 bg-[#f8f4ee] px-4 py-3.5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-[#151515]">
                    {candidate.meal.title}
                  </p>
                  <Badge>{sourceLabel(candidate.source)}</Badge>
                </div>
                <p className="text-sm text-[#6f685f]">
                  {candidate.meal.meal_type} / {candidate.meal.kcal} kcal
                </p>
              </div>
              <Button
                type="button"
                disabled={loadingMealId === candidate.meal.id}
                className={
                  loadingMealId === candidate.meal.id
                    ? "scale-[0.98] opacity-80"
                    : undefined
                }
                onClick={() => void copyMeal(candidate.meal.id)}
              >
                {loadingMealId === candidate.meal.id ? "Copying..." : "Copy meal"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
