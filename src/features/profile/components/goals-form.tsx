"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import type { NutritionGoalsInput } from "@/src/types/profile";

interface GoalsFormProps {
  initialGoals: NutritionGoalsInput;
  embedded?: boolean;
}

const FIELD_STYLES = {
  calories: {
    accent: "bg-[#93c5fd]",
    note: "kcal per day",
  },
  protein: {
    accent: "bg-[#7dd3fc]",
    note: "grams per day",
  },
  carbs: {
    accent: "bg-[#b6a7e8]",
    note: "grams per day",
  },
  fat: {
    accent: "bg-[#97b08f]",
    note: "grams per day",
  },
} as const;

export function GoalsForm({ initialGoals, embedded = false }: GoalsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [kcalTarget, setKcalTarget] = useState(String(initialGoals.kcal_target));
  const [proteinTarget, setProteinTarget] = useState(String(initialGoals.protein_g_target));
  const [carbsTarget, setCarbsTarget] = useState(String(initialGoals.carbs_g_target));
  const [fatTarget, setFatTarget] = useState(String(initialGoals.fat_g_target));

  useEffect(() => {
    let mounted = true;

    async function loadGoalsFromAuthenticatedSession() {
      try {
        const response = await fetch("/api/profile/goals", {
          headers: {
            ...(await getAuthHeaders()),
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load goals");
        }

        const payload = (await response.json()) as {
          data: {
            kcal_target: number;
            protein_g_target: number;
            carbs_g_target: number;
            fat_g_target: number;
          } | null;
        };

        if (mounted && payload.data) {
          setKcalTarget(String(payload.data.kcal_target));
          setProteinTarget(String(payload.data.protein_g_target));
          setCarbsTarget(String(payload.data.carbs_g_target));
          setFatTarget(String(payload.data.fat_g_target));
        }
      } catch {
        // Keep initial fallback values from server render.
      } finally {
        if (mounted) {
          setLoadingGoals(false);
        }
      }
    }

    void loadGoalsFromAuthenticatedSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        kcal_target: Number(kcalTarget),
        protein_g_target: Number(proteinTarget),
        carbs_g_target: Number(carbsTarget),
        fat_g_target: Number(fatTarget),
      };

      if (
        [payload.kcal_target, payload.protein_g_target, payload.carbs_g_target, payload.fat_g_target]
          .some((value) => Number.isNaN(value) || value < 0)
      ) {
        throw new Error("Goals must be positive numbers.");
      }

      const response = await fetch("/api/profile/goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Failed to save goals");
      }

      const savedPayload = (await response.json()) as {
        data: {
          kcal_target: number;
          protein_g_target: number;
          carbs_g_target: number;
          fat_g_target: number;
        };
      };

      setKcalTarget(String(savedPayload.data.kcal_target));
      setProteinTarget(String(savedPayload.data.protein_g_target));
      setCarbsTarget(String(savedPayload.data.carbs_g_target));
      setFatTarget(String(savedPayload.data.fat_g_target));
      setSuccess("Goals saved successfully.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const content = (
    <div className={cn("space-y-5", embedded ? "" : "max-w-2xl")}>
      {!embedded ? (
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">Nutrition goals</h1>
          <p className="text-sm leading-7 text-[#6f685f]">
            Define daily targets to keep your dashboard progress bars accurate and readable.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">
            Edit targets
          </p>
          <p className="text-sm leading-7 text-[#6f685f]">
            Adjust your daily calories and macro targets here. Changes update the rest of the app right away.
          </p>
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        {loadingGoals ? (
          <p className="text-sm text-[#7a736b]">Loading goals...</p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label htmlFor="kcal-target" className="block rounded-[22px] border border-black/6 bg-white/76 p-4 text-sm text-[#4f4a43]">
            <span className={`mb-3 block h-1.5 w-14 rounded-full ${FIELD_STYLES.calories.accent}`} />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">
              Calories
            </span>
            <Input
              id="kcal-target"
              type="number"
              min={0}
              step="1"
              value={kcalTarget}
              onChange={(event) => setKcalTarget(event.target.value)}
              placeholder="2200"
              required
              className="mt-3 bg-white"
            />
            <p className="mt-3 text-xs text-[#847c73]">{FIELD_STYLES.calories.note}</p>
          </label>

          <label htmlFor="protein-target" className="block rounded-[22px] border border-black/6 bg-white/76 p-4 text-sm text-[#4f4a43]">
            <span className={`mb-3 block h-1.5 w-14 rounded-full ${FIELD_STYLES.protein.accent}`} />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">
              Protein
            </span>
            <Input
              id="protein-target"
              type="number"
              min={0}
              step="0.1"
              value={proteinTarget}
              onChange={(event) => setProteinTarget(event.target.value)}
              placeholder="140"
              required
              className="mt-3 bg-white"
            />
            <p className="mt-3 text-xs text-[#847c73]">{FIELD_STYLES.protein.note}</p>
          </label>

          <label htmlFor="carbs-target" className="block rounded-[22px] border border-black/6 bg-white/76 p-4 text-sm text-[#4f4a43]">
            <span className={`mb-3 block h-1.5 w-14 rounded-full ${FIELD_STYLES.carbs.accent}`} />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">
              Carbs
            </span>
            <Input
              id="carbs-target"
              type="number"
              min={0}
              step="0.1"
              value={carbsTarget}
              onChange={(event) => setCarbsTarget(event.target.value)}
              placeholder="250"
              required
              className="mt-3 bg-white"
            />
            <p className="mt-3 text-xs text-[#847c73]">{FIELD_STYLES.carbs.note}</p>
          </label>

          <label htmlFor="fat-target" className="block rounded-[22px] border border-black/6 bg-white/76 p-4 text-sm text-[#4f4a43]">
            <span className={`mb-3 block h-1.5 w-14 rounded-full ${FIELD_STYLES.fat.accent}`} />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">
              Fat
            </span>
            <Input
              id="fat-target"
              type="number"
              min={0}
              step="0.1"
              value={fatTarget}
              onChange={(event) => setFatTarget(event.target.value)}
              placeholder="70"
              required
              className="mt-3 bg-white"
            />
            <p className="mt-3 text-xs text-[#847c73]">{FIELD_STYLES.fat.note}</p>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-black/6 bg-white/62 px-4 py-3.5">
          <div className="space-y-1 text-sm">
            {error ? <p className="text-[#8a3d30]">{error}</p> : null}
            {success ? <p className="text-[#365141]">{success}</p> : null}
            {!error && !success ? (
              <p className="text-[#6f685f]">Use targets that are realistic enough to follow every day.</p>
            ) : null}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save targets"}
          </Button>
        </div>
      </form>
    </div>
  );

  if (embedded) {
    return content;
  }

  return <Card>{content}</Card>;
}
