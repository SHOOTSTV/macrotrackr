import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import type { NutritionGoalsInput } from "@/src/types/profile";

interface ConsumedMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface GoalsProgressCardProps {
  title: string;
  consumed: ConsumedMacros;
  goals: NutritionGoalsInput | null;
}

interface ProgressRowProps {
  macro: "kcal" | "protein" | "carbs" | "fat";
  label: string;
  consumed: number;
  target: number;
}

interface ProgressStatus {
  textClassName: string;
  badgeClassName: string;
  label: string;
}

interface MacroTone {
  trackClassName: string;
  barClassName: string;
}

function toPercent(consumed: number, target: number): number {
  if (target <= 0) {
    return 0;
  }

  return Math.min((consumed / target) * 100, 100);
}

function getProgressStatus(consumed: number, target: number): ProgressStatus {
  if (target <= 0) {
    return {
      textClassName: "text-red-600",
      badgeClassName: "bg-red-50",
      label: "invalid target",
    };
  }

  const ratio = consumed / target;

  if (ratio > 1.1) {
    return {
      textClassName: "text-red-600",
      badgeClassName: "bg-red-50",
      label: "over",
    };
  }

  if (ratio < 0.6) {
    return {
      textClassName: "text-red-600",
      badgeClassName: "bg-red-50",
      label: "far below",
    };
  }

  if (ratio >= 0.9 && ratio <= 1.1) {
    return {
      textClassName: "text-emerald-600",
      badgeClassName: "bg-emerald-50",
      label: "on track",
    };
  }

  return {
    textClassName: "text-amber-600",
    badgeClassName: "bg-amber-50",
    label: "midway",
  };
}

function getMacroTone(macro: ProgressRowProps["macro"]): MacroTone {
  if (macro === "kcal") {
    return {
      trackClassName: "bg-blue-100/70",
      barClassName: "bg-linear-to-r from-sky-400 to-blue-500",
    };
  }

  if (macro === "protein") {
    return {
      trackClassName: "bg-cyan-100/70",
      barClassName: "bg-linear-to-r from-emerald-400 to-cyan-400",
    };
  }

  if (macro === "carbs") {
    return {
      trackClassName: "bg-amber-100/75",
      barClassName: "bg-linear-to-r from-amber-300 to-orange-400",
    };
  }

  return {
    trackClassName: "bg-violet-100/75",
    barClassName: "bg-linear-to-r from-violet-400 to-fuchsia-400",
  };
}

function ProgressRow({ macro, label, consumed, target }: ProgressRowProps) {
  const percent = toPercent(consumed, target);
  const status = getProgressStatus(consumed, target);
  const tone = getMacroTone(macro);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="flex items-center gap-2">
          <span className="font-medium">
            {consumed.toFixed(1)} / {target.toFixed(1)}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              status.textClassName,
              status.badgeClassName,
            )}
          >
            {status.label}
          </span>
        </span>
      </div>
      <div className={cn("h-2.5 rounded-full", tone.trackClassName)}>
        <div className={cn("h-full rounded-full", tone.barClassName)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function GoalsProgressCard({ title, consumed, goals }: GoalsProgressCardProps) {
  if (!goals) {
    return (
      <Card>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          Set your goals in profile to display progress bars.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <div className="space-y-2.5">
        <ProgressRow
          macro="kcal"
          label="Calories"
          consumed={consumed.kcal}
          target={goals.kcal_target}
        />
        <ProgressRow
          macro="protein"
          label="Protein"
          consumed={consumed.protein}
          target={goals.protein_g_target}
        />
        <ProgressRow
          macro="carbs"
          label="Carbs"
          consumed={consumed.carbs}
          target={goals.carbs_g_target}
        />
        <ProgressRow
          macro="fat"
          label="Fat"
          consumed={consumed.fat}
          target={goals.fat_g_target}
        />
      </div>
    </Card>
  );
}
