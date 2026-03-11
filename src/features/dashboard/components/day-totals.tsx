import { Card } from "@/src/components/ui/card";
import type { DailySummary } from "@/src/types/meal";

interface DayTotalsProps {
  summary: DailySummary;
  embedded?: boolean;
}

export function DayTotals({ summary, embedded = false }: DayTotalsProps) {
  const itemClassName = embedded
    ? "rounded-[22px] border border-black/6 bg-[#f8f4ee] p-4"
    : "";

  const content = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {[
        { label: "Meals", value: summary.meals_count, tone: "text-[#151515]", suffix: "" },
        { label: "kcal", value: summary.kcal_total, tone: "text-[#365141]", suffix: "" },
        { label: "Protein", value: summary.protein_total, tone: "text-[#44747b]", suffix: " g" },
        { label: "Carbs", value: summary.carbs_total, tone: "text-[#7a5b33]", suffix: " g" },
        { label: "Fat", value: summary.fat_total, tone: "text-[#66557e]", suffix: " g" },
      ].map((item) => {
        const block = (
          <>
            <p className="text-sm text-[#7a736b]">{item.label}</p>
            <p className={`text-2xl font-semibold ${item.tone}`}>
              {item.value}
              {item.suffix}
            </p>
          </>
        )

        return embedded ? (
          <div key={item.label} className={itemClassName}>
            {block}
          </div>
        ) : (
          <Card key={item.label}>
            {block}
          </Card>
        )
      })}
    </div>
  )

  return content
}