"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { StreakProgressPayload, WeeklyProgressPayload } from "@/src/types/progress";

interface StreakWeeklyCardProps {
  mode?: "today" | "history";
}

interface ProgressState {
  streak: StreakProgressPayload;
  weekly: WeeklyProgressPayload;
}

async function fetchJson<T>(url: string): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...authHeaders,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Failed to fetch ${url}`);
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

function isEmptyProgress(state: ProgressState): boolean {
  return (
    state.streak.current_streak === 0
    && state.streak.best_streak === 0
    && state.weekly.weekly_completed_days === 0
  );
}

export function StreakWeeklyCard({ mode = "today" }: StreakWeeklyCardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [streak, weekly] = await Promise.all([
        fetchJson<StreakProgressPayload>("/api/progress/streak"),
        fetchJson<WeeklyProgressPayload>("/api/progress/weekly"),
      ]);

      setProgress({ streak, weekly });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load progress");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const weeklyRatio = useMemo(() => {
    if (!progress) {
      return 0;
    }

    if (progress.weekly.weekly_target <= 0) {
      return 0;
    }

    return Math.min(100, (progress.weekly.weekly_completed_days / progress.weekly.weekly_target) * 100);
  }, [progress]);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">
          {mode === "today" ? "Streak & weekly goal" : "Weekly progress summary"}
        </h2>
        {!loading ? (
          <Button type="button" variant="ghost" onClick={() => void load()}>
            Refresh
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading streak and weekly progress...</p>
      ) : null}

      {!loading && error ? (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <Button type="button" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && progress ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Current streak</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">{progress.streak.current_streak}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Best streak</p>
              <p className="mt-1 text-2xl font-bold text-indigo-900">{progress.streak.best_streak}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Weekly</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">
                {progress.weekly.weekly_completed_days}/{progress.weekly.weekly_target}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Goal completion</span>
              <span>
                {progress.weekly.weekly_goal_hit
                  ? "Goal reached"
                  : `${progress.weekly.remaining_days} day(s) remaining`}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400"
                style={{ width: `${weeklyRatio}%` }}
              />
            </div>
          </div>

          {isEmptyProgress(progress) ? (
            <p className="text-sm text-slate-500">No validated day yet. Add meals to start your streak.</p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
