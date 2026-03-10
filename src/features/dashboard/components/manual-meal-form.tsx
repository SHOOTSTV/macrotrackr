"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { CopyPreviousMeals } from "@/src/features/dashboard/components/copy-previous-meals";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { CopyMealCandidate } from "@/src/types/meal";

function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

const selectClassName =
  "w-full rounded-[18px] border border-black/8 bg-white px-3.5 py-2.5 text-sm text-[#151515] outline-none ring-[#d8e2d6] transition focus:ring-2";
const textareaClassName =
  "min-h-24 w-full rounded-[18px] border border-black/8 bg-white px-3.5 py-3 text-sm text-[#151515] outline-none ring-[#d8e2d6] transition focus:ring-2";

interface ManualMealFormProps {
  copyCandidates?: CopyMealCandidate[];
  enableCopyPrevious?: boolean;
}

export function ManualMealForm({ copyCandidates, enableCopyPrevious = true }: ManualMealFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [mealType, setMealType] = useState("lunch");
  const [eatenAt, setEatenAt] = useState(toDatetimeLocalValue(new Date()));
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [notes, setNotes] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload = {
      author: "manual" as const,
      source_detail: "manual_form",
      eaten_at: new Date(eatenAt).toISOString(),
      meal_type: mealType as "breakfast" | "lunch" | "dinner" | "snack",
      title: title.trim(),
      kcal: Number(kcal),
      protein_g: Number(protein),
      carbs_g: Number(carbs),
      fat_g: Number(fat),
      confidence: null,
      notes,
    };

    if (!payload.title) {
      setError("Title is required.");
      return;
    }

    if (
      [payload.kcal, payload.protein_g, payload.carbs_g, payload.fat_g].some(
        (value) => Number.isNaN(value) || value < 0,
      )
    ) {
      setError("Macros must be positive numbers.");
      return;
    }

    setLoading(true);

    try {
      const authHeaders = await getAuthHeaders();
      const idempotencyKey = `meal:${crypto.randomUUID()}`;
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Failed to create meal");
      }

      setTitle("");
      setKcal("");
      setProtein("");
      setCarbs("");
      setFat("");
      setNotes("");
      setMealType("lunch");
      setEatenAt(toDatetimeLocalValue(new Date()));
      setIsOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  const effectiveCopyCandidates = copyCandidates ?? [];
  const shouldShowCopyPrevious = enableCopyPrevious && effectiveCopyCandidates.length > 0;

  const copyModal = shouldShowCopyPrevious && isCopyModalOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/32 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[30px] border border-black/8 bg-white/92 p-5 shadow-[0_24px_48px_rgba(21,21,21,0.14)] sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">Quick tool</p>
            <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#151515]">Copy a previous meal</h2>
            <p className="text-sm text-[#6f685f]">Start from something you already logged and reuse it in one click.</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => setIsCopyModalOpen(false)}>
            Close
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <CopyPreviousMeals candidates={effectiveCopyCandidates} />
        </div>
      </div>
    </div>
  ) : null;

  if (!isOpen) {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsOpen(true)}>Add meal</Button>
          {shouldShowCopyPrevious ? (
            <Button type="button" variant="ghost" onClick={() => setIsCopyModalOpen(true)}>
              Copy previous meal
            </Button>
          ) : null}
        </div>

        {typeof document !== "undefined" && copyModal ? createPortal(copyModal, document.body) : null}
      </>
    );
  }

  return (
    <>
      <Card className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">Manual entry</p>
            <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">Add a meal manually</h2>
            <p className="text-sm leading-7 text-[#6f685f]">Useful when you want full control over title, macros, and notes.</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
            <label className="space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Meal title</span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Chicken avocado bowl"
                required
                className="bg-white"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Meal type</span>
              <select
                className={selectClassName}
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </label>

            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Date and time</span>
              <Input
                type="datetime-local"
                value={eatenAt}
                onChange={(event) => setEatenAt(event.target.value)}
                required
                className="bg-white"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Calories</span>
              <Input type="number" min={0} step="1" value={kcal} onChange={(event) => setKcal(event.target.value)} placeholder="520" required className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Protein</span>
              <Input type="number" min={0} step="0.1" value={protein} onChange={(event) => setProtein(event.target.value)} placeholder="32" required className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Carbs</span>
              <Input type="number" min={0} step="0.1" value={carbs} onChange={(event) => setCarbs(event.target.value)} placeholder="45" required className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Fat</span>
              <Input type="number" min={0} step="0.1" value={fat} onChange={(event) => setFat(event.target.value)} placeholder="18" required className="bg-white" />
            </label>
          </div>

          <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
            <label className="space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Notes</span>
              <textarea
                className={textareaClassName}
                placeholder="Anything useful to remember about this meal."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-black/6 bg-white/62 px-4 py-3.5">
            <div className="space-y-1 text-sm">
              {error ? <p className="text-[#8a3d30]">{error}</p> : null}
              {!error ? <p className="text-[#6f685f]">Manual meals show up right away in Today and History.</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add meal"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
                Close
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {typeof document !== "undefined" && copyModal ? createPortal(copyModal, document.body) : null}
    </>
  );
}
