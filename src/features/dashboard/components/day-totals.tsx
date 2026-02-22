import { Card } from "@/src/components/ui/card";
import type { DailySummary } from "@/src/types/meal";

interface DayTotalsProps {
  summary: DailySummary;
}

export function DayTotals({ summary }: DayTotalsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <p className="text-sm text-slate-500">Meals</p>
        <p className="text-2xl font-semibold text-slate-900">{summary.meals_count}</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">kcal</p>
        <p className="text-2xl font-semibold text-blue-700">{summary.kcal_total}</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Protein</p>
        <p className="text-2xl font-semibold text-cyan-700">{summary.protein_total} g</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Carbs</p>
        <p className="text-2xl font-semibold text-amber-700">{summary.carbs_total} g</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Fat</p>
        <p className="text-2xl font-semibold text-violet-700">{summary.fat_total} g</p>
      </Card>
    </div>
  );
}
