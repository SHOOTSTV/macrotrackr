"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addDays,
  differenceInCalendarDays,
  format,
  formatISO,
  subDays,
} from "date-fns";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

const PRESETS = [
  { label: "7 d", days: 7 },
  { label: "14 d", days: 14 },
  { label: "30 d", days: 30 },
] as const;

interface HistoryDatePickerProps {
  from: string;
  to: string;
}

function toISODate(date: Date): string {
  return formatISO(date, { representation: "date" });
}

export function HistoryDatePicker({ from, to }: HistoryDatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (nextFrom: string, nextTo: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", nextFrom);
      params.set("to", nextTo);
      router.push(`/history?${params.toString()}`);
    },
    [router, searchParams],
  );

  const span = differenceInCalendarDays(new Date(to), new Date(from)) + 1;

  function onPrev() {
    const newTo = toISODate(subDays(new Date(from), 1));
    const newFrom = toISODate(subDays(new Date(newTo), span - 1));
    navigate(newFrom, newTo);
  }

  function onNext() {
    const today = toISODate(new Date());
    const newFrom = toISODate(addDays(new Date(to), 1));
    const newTo = toISODate(addDays(new Date(newFrom), span - 1));
    const clampedTo = newTo > today ? today : newTo;
    const clampedFrom =
      clampedTo < newFrom
        ? toISODate(subDays(new Date(clampedTo), span - 1))
        : newFrom;
    navigate(clampedFrom, clampedTo);
  }

  function onPreset(days: number) {
    const today = toISODate(new Date());
    navigate(toISODate(subDays(new Date(today), days - 1)), today);
  }

  function onFromChange(value: string) {
    if (!value) return;
    const clamped = value > to ? to : value;
    navigate(clamped, to);
  }

  function onToChange(value: string) {
    if (!value) return;
    const today = toISODate(new Date());
    const clamped = value > today ? today : value < from ? from : value;
    navigate(from, clamped);
  }

  const isAtToday = to >= toISODate(new Date());

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" onClick={onPrev} aria-label="Previous period">
          <ChevronLeftIcon />
        </Button>

        <span className="min-w-[10rem] text-center text-sm font-medium text-slate-700">
          {format(new Date(from), "MMM d")} – {format(new Date(to), "MMM d, yyyy")}
        </span>

        <Button
          variant="ghost"
          onClick={onNext}
          disabled={isAtToday}
          aria-label="Next period"
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.days}
            variant="ghost"
            onClick={() => onPreset(p.days)}
            className={cn(
              "px-3 py-1.5 text-xs",
              span === p.days && to >= toISODate(new Date()) &&
                "border-blue-300 bg-blue-50 text-blue-700",
            )}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-1.5 text-slate-600">
          From
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => onFromChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </label>
        <label className="flex items-center gap-1.5 text-slate-600">
          To
          <input
            type="date"
            value={to}
            min={from}
            max={toISODate(new Date())}
            onChange={(e) => onToChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </label>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
