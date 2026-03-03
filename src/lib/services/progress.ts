import { addDays, formatISO, parseISO, subDays } from "date-fns";

export interface RecalculateProgressInput {
  validatedDays: string[];
  today: string;
  weekStart: string;
  weekEnd: string;
  weeklyTarget: number;
}

export interface ProgressSnapshot {
  currentStreak: number;
  bestStreak: number;
  weeklyCompletedDays: number;
  weeklyTarget: number;
  weeklyGoalHit: boolean;
}

function normalizeDays(days: string[]): string[] {
  return [...new Set(days)].sort((a, b) => a.localeCompare(b));
}

function previousDate(date: string): string {
  return formatISO(subDays(parseISO(date), 1), { representation: "date" });
}

function nextDate(date: string): string {
  return formatISO(addDays(parseISO(date), 1), { representation: "date" });
}

export function computeBestStreak(validatedDays: string[]): number {
  const days = normalizeDays(validatedDays);
  if (days.length === 0) {
    return 0;
  }

  let best = 1;
  let running = 1;

  for (let index = 1; index < days.length; index += 1) {
    const previous = days[index - 1];
    const current = days[index];

    if (nextDate(previous) === current) {
      running += 1;
      if (running > best) {
        best = running;
      }
      continue;
    }

    running = 1;
  }

  return best;
}

export function computeCurrentStreak(validatedDays: string[], today: string): number {
  const daySet = new Set(normalizeDays(validatedDays));
  if (daySet.size === 0) {
    return 0;
  }

  const yesterday = previousDate(today);
  let anchor = "";

  if (daySet.has(today)) {
    anchor = today;
  } else if (daySet.has(yesterday)) {
    anchor = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  let cursor = anchor;

  while (daySet.has(cursor)) {
    streak += 1;
    cursor = previousDate(cursor);
  }

  return streak;
}

export function computeWeeklyCompletedDays(
  validatedDays: string[],
  weekStart: string,
  weekEnd: string,
): number {
  const days = normalizeDays(validatedDays);

  return days.filter((day) => day >= weekStart && day <= weekEnd).length;
}

export function recalculateProgress(input: RecalculateProgressInput): ProgressSnapshot {
  const weeklyTarget = Math.min(7, Math.max(1, Math.floor(input.weeklyTarget)));
  const weeklyCompletedDays = computeWeeklyCompletedDays(
    input.validatedDays,
    input.weekStart,
    input.weekEnd,
  );

  return {
    currentStreak: computeCurrentStreak(input.validatedDays, input.today),
    bestStreak: computeBestStreak(input.validatedDays),
    weeklyCompletedDays,
    weeklyTarget,
    weeklyGoalHit: weeklyCompletedDays >= weeklyTarget,
  };
}
