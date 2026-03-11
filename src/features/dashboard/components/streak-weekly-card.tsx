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

function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-[18px] bg-[#ddd6ca]/80 ${className ?? ""}`} />;
}

function StreakWeeklyCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-7 w-40 rounded-[16px]" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] bg-[#e4ece6] p-4">
          <Skeleton className="h-4 w-20 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-12 rounded-[16px] bg-white/65" />
        </div>
        <div className="rounded-[22px] bg-[#e6dfed] p-4">
          <Skeleton className="h-4 w-16 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-14 rounded-[16px] bg-white/65" />
        </div>
        <div className="rounded-[22px] bg-[#e4ece6] p-4">
          <Skeleton className="h-4 w-14 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-16 rounded-[16px] bg-white/65" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full rounded-full bg-[#ddd9d2]" />
      </div>
    </div>
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
      {loading ? (
        <StreakWeeklyCardSkeleton />
      ) : (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-[#151515]">
            {mode === "today" ? "Streak & weekly goal" : "Weekly progress summary"}
          </h2>
          <Button type="button" variant="ghost" onClick={() => void load()}>
            Refresh
          </Button>
        </div>
      )}

      {!loading && error ? (
        <div className="space-y-2">
          <p className="text-sm text-[#8a3d30]">{error}</p>
          <Button type="button" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && progress ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-[#e4ece6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#365141]">Current streak</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.06em] text-[#23352d]">{progress.streak.current_streak}</p>
            </div>
            <div className="rounded-[22px] bg-[#e6dfed] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5f566d]">Best streak</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.06em] text-[#3f3948]">{progress.streak.best_streak}</p>
            </div>
            <div className="rounded-[22px] bg-[#e4ece6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#365141]">Weekly</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.06em] text-[#23352d]">
                {progress.weekly.weekly_completed_days}/{progress.weekly.weekly_target}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[#4f4a43]">
              <span className="font-medium text-[#3e3a34]">Goal completion</span>
              <span>
                {progress.weekly.weekly_goal_hit
                  ? "Goal reached"
                  : `${progress.weekly.remaining_days} day(s) remaining`}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#ddd9d2]">
              <div
                className="h-full rounded-full bg-[#97b08f] shadow-[0_1px_4px_rgba(21,21,21,0.10)]"
                style={{ width: `${weeklyRatio}%` }}
              />
            </div>
          </div>

          {isEmptyProgress(progress) ? (
            <p className="text-sm text-[#7a736b]">No validated day yet. Add meals to start your streak.</p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
