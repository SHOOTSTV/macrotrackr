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

  const today = toISODate(new Date());
  const isAtToday = to >= today;

  return (
    <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">
            Range
          </p>
          <div className="inline-flex items-center rounded-full border border-black/6 bg-white/78 px-4 py-2 text-sm font-medium text-[#3e3a34] shadow-[0_8px_18px_rgba(21,21,21,0.03)]">
            {format(new Date(from), "MMM d")} - {format(new Date(to), "MMM d, yyyy")}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            onClick={onPrev}
            aria-label="Previous period"
            className="h-10 w-10 rounded-full bg-white/78 p-0 hover:bg-white"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={isAtToday}
            aria-label="Next period"
            className="h-10 w-10 rounded-full bg-white/78 p-0 hover:bg-white"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const isActive = span === preset.days && to >= today;

            return (
              <Button
                key={preset.days}
                variant="ghost"
                onClick={() => onPreset(preset.days)}
                className={cn(
                  "rounded-full bg-white/72 px-3.5 py-2 text-xs hover:bg-white",
                  isActive && "border-[#cfddd1] bg-[#edf1ea] text-[#365141]",
                )}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[360px]">
          <label className="space-y-1 text-sm text-[#6f685f]">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">From</span>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => onFromChange(e.target.value)}
              className="w-full rounded-[16px] border border-black/8 bg-white px-3 py-2.5 text-sm text-[#151515] outline-none focus:border-[#c6d3c4] focus:ring-1 focus:ring-[#d8e2d6]"
            />
          </label>
          <label className="space-y-1 text-sm text-[#6f685f]">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">To</span>
            <input
              type="date"
              value={to}
              min={from}
              max={today}
              onChange={(e) => onToChange(e.target.value)}
              className="w-full rounded-[16px] border border-black/8 bg-white px-3 py-2.5 text-sm text-[#151515] outline-none focus:border-[#c6d3c4] focus:ring-1 focus:ring-[#d8e2d6]"
            />
          </label>
        </div>
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
