"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { Card } from "@/src/components/ui/card";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { NutritionGoalsInput } from "@/src/types/profile";

interface ConsumedMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface OverrunItem {
  macro: "kcal" | "protein" | "carbs" | "fat";
  overBy: number;
  total: number;
  target: number;
  unit: "kcal" | "g";
  label: string;
}

interface MacroOverrunAlertsProps {
  day: string;
  consumed: ConsumedMacros;
  goals: NutritionGoalsInput | null;
}

function formatValue(value: number): string {
  return Number(value.toFixed(1)).toString();
}

export function MacroOverrunAlerts({ day, consumed, goals }: MacroOverrunAlertsProps) {
  const overruns = useMemo<OverrunItem[]>(() => {
    if (!goals) {
      return [];
    }

    const rows: OverrunItem[] = [
      {
        macro: "kcal",
        label: "Calories",
        total: consumed.kcal,
        target: goals.kcal_target,
        overBy: consumed.kcal - goals.kcal_target,
        unit: "kcal",
      },
      {
        macro: "protein",
        label: "Protein",
        total: consumed.protein,
        target: goals.protein_g_target,
        overBy: consumed.protein - goals.protein_g_target,
        unit: "g",
      },
      {
        macro: "carbs",
        label: "Carbs",
        total: consumed.carbs,
        target: goals.carbs_g_target,
        overBy: consumed.carbs - goals.carbs_g_target,
        unit: "g",
      },
      {
        macro: "fat",
        label: "Fat",
        total: consumed.fat,
        target: goals.fat_g_target,
        overBy: consumed.fat - goals.fat_g_target,
        unit: "g",
      },
    ];

    return rows.filter((row) => row.target > 0 && row.overBy > 0);
  }, [consumed.carbs, consumed.fat, consumed.kcal, consumed.protein, goals]);

  useEffect(() => {
    if (overruns.length === 0) {
      return;
    }

    for (const overrun of overruns) {
      const dedupeKey = `macro-alert:${day}:${overrun.macro}`;
      if (typeof window !== "undefined" && window.sessionStorage.getItem(dedupeKey)) {
        continue;
      }

      toast.warning(
        `${overrun.label} over target by ${formatValue(overrun.overBy)}${overrun.unit}.`,
      );

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(dedupeKey, "1");
      }

      void (async () => {
        try {
          const authHeaders = await getAuthHeaders();
          await fetch("/api/analytics/macro-alert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify({
              day,
              macro: overrun.macro,
              over_by: Number(overrun.overBy.toFixed(2)),
              day_total: Number(overrun.total.toFixed(2)),
              target: Number(overrun.target.toFixed(2)),
            }),
          });
        } catch {
          // Best effort analytics.
        }
      })();
    }
  }, [day, overruns]);

  if (overruns.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <h3 className="text-base font-semibold text-amber-900">Macro budget alert</h3>
      <ul className="mt-2 space-y-1 text-sm text-amber-800">
        {overruns.map((overrun) => (
          <li key={overrun.macro}>
            {overrun.label}: +{formatValue(overrun.overBy)}{overrun.unit} over target
          </li>
        ))}
      </ul>
    </Card>
  );
}
