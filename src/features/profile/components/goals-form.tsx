"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type { NutritionGoalsInput } from "@/src/types/profile";

interface GoalsFormProps {
  initialGoals: NutritionGoalsInput;
}

export function GoalsForm({ initialGoals }: GoalsFormProps) {
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

  return (
    <Card className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Nutrition goals</h1>
      <p className="mb-4 text-sm text-slate-600">
        Define daily targets to display progress bars for each day.
      </p>

      <form className="space-y-3" onSubmit={onSubmit}>
        {loadingGoals ? (
          <p className="text-sm text-slate-500">Loading goals...</p>
        ) : null}

        <label htmlFor="kcal-target" className="block space-y-1 text-sm text-slate-700">
          <span className="font-medium">Calorie target (kcal / day)</span>
          <Input
            id="kcal-target"
            type="number"
            min={0}
            step="1"
            value={kcalTarget}
            onChange={(event) => setKcalTarget(event.target.value)}
            placeholder="Ex: 2200"
            required
          />
        </label>
        <div className="grid gap-2 md:grid-cols-3">
          <label htmlFor="protein-target" className="block space-y-1 text-sm text-slate-700">
            <span className="font-medium">Protein target (g / day)</span>
            <Input
              id="protein-target"
              type="number"
              min={0}
              step="0.1"
              value={proteinTarget}
              onChange={(event) => setProteinTarget(event.target.value)}
              placeholder="Ex: 140"
              required
            />
          </label>
          <label htmlFor="carbs-target" className="block space-y-1 text-sm text-slate-700">
            <span className="font-medium">Carbs target (g / day)</span>
            <Input
              id="carbs-target"
              type="number"
              min={0}
              step="0.1"
              value={carbsTarget}
              onChange={(event) => setCarbsTarget(event.target.value)}
              placeholder="Ex: 250"
              required
            />
          </label>
          <label htmlFor="fat-target" className="block space-y-1 text-sm text-slate-700">
            <span className="font-medium">Fat target (g / day)</span>
            <Input
              id="fat-target"
              type="number"
              min={0}
              step="0.1"
              value={fatTarget}
              onChange={(event) => setFatTarget(event.target.value)}
              placeholder="Ex: 70"
              required
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save my goals"}
        </Button>
      </form>
    </Card>
  );
}
