"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        <p className="text-sm text-slate-500">
          No previous meals available yet.
        </p>
      ) : (
        <div className="space-y-2">
          {candidates.map((candidate) => (
            <div
              key={`${candidate.source}-${candidate.meal.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {candidate.meal.title}
                </p>
                <p className="text-xs text-slate-500">
                  {sourceLabel(candidate.source)} • {candidate.meal.meal_type} •{" "}
                  {candidate.meal.kcal} kcal
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
                {loadingMealId === candidate.meal.id ? "Copying..." : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
