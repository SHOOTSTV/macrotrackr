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
  className?: string;
  embedded?: boolean;
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
  dotClassName: string;
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
      textClassName: "text-[#8a3d30]",
      badgeClassName: "bg-[#f5dfdb]",
      label: "invalid target",
    };
  }

  const ratio = consumed / target;

  if (ratio > 1.1) {
    return {
      textClassName: "text-[#8a3d30]",
      badgeClassName: "bg-[#f5dfdb]",
      label: "over",
    };
  }

  if (ratio < 0.6) {
    return {
      textClassName: "text-[#8a3d30]",
      badgeClassName: "bg-[#f5dfdb]",
      label: "far below",
    };
  }

  if (ratio >= 0.9 && ratio <= 1.1) {
    return {
      textClassName: "text-[#365141]",
      badgeClassName: "bg-[#edf1ea]",
      label: "on track",
    };
  }

  return {
    textClassName: "text-[#7a5b33]",
    badgeClassName: "bg-[#f2eadb]",
    label: "midway",
  };
}

function getMacroTone(macro: ProgressRowProps["macro"]): MacroTone {
  if (macro === "kcal") {
    return {
      dotClassName: "bg-[#93c5fd]",
      trackClassName: "bg-[#ddd9d2]",
      barClassName: "bg-[#93c5fd]",
    };
  }

  if (macro === "protein") {
    return {
      dotClassName: "bg-[#7dd3fc]",
      trackClassName: "bg-[#ddd9d2]",
      barClassName: "bg-[#7dd3fc]",
    };
  }

  if (macro === "carbs") {
    return {
      dotClassName: "bg-[#b6a7e8]",
      trackClassName: "bg-[#ddd9d2]",
      barClassName: "bg-[#b6a7e8]",
    };
  }

  return {
    dotClassName: "bg-[#97b08f]",
    trackClassName: "bg-[#ddd9d2]",
    barClassName: "bg-[#97b08f]",
  };
}

function ProgressRow({ macro, label, consumed, target }: ProgressRowProps) {
  const percent = toPercent(consumed, target);
  const status = getProgressStatus(consumed, target);
  const tone = getMacroTone(macro);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm text-[#4f4a43]">
        <span className="flex items-center gap-2 font-medium text-[#3e3a34]">
          <span className={cn("h-2.5 w-2.5 rounded-full", tone.dotClassName)} />
          {label}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-medium text-[#5b554e]">
            {consumed.toFixed(1)} / {target.toFixed(1)}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
              status.textClassName,
              status.badgeClassName,
            )}
          >
            {status.label}
          </span>
        </span>
      </div>
      <div className={cn("h-3 overflow-hidden rounded-full", tone.trackClassName)}>
        <div
          className={cn("h-full rounded-full shadow-[0_1px_4px_rgba(21,21,21,0.10)]", tone.barClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function GoalsProgressCard({
  title,
  consumed,
  goals,
  className,
  embedded = false,
}: GoalsProgressCardProps) {
  const content = goals ? (
    <>
      <h3 className="mb-4 text-lg font-medium tracking-[-0.04em] text-[#151515]">{title}</h3>
      <div className="space-y-4">
        <ProgressRow macro="kcal" label="Calories" consumed={consumed.kcal} target={goals.kcal_target} />
        <ProgressRow macro="protein" label="Protein" consumed={consumed.protein} target={goals.protein_g_target} />
        <ProgressRow macro="carbs" label="Carbs" consumed={consumed.carbs} target={goals.carbs_g_target} />
        <ProgressRow macro="fat" label="Fat" consumed={consumed.fat} target={goals.fat_g_target} />
      </div>
    </>
  ) : (
    <>
      <h3 className="text-lg font-medium tracking-[-0.04em] text-[#151515]">{title}</h3>
      <p className="mt-2 text-sm text-[#6f685f]">
        Set your goals in profile to display progress bars.
      </p>
    </>
  );

  if (embedded) {
    return <div className={className}>{content}</div>;
  }

  return <Card className={className}>{content}</Card>;
}