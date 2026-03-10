"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { Meal } from "@/src/types/meal";

interface EditMealModalProps {
  meal: Meal;
  onUpdated: () => Promise<void>;
  triggerClassName?: string;
}

const textareaClassName =
  "min-h-24 w-full rounded-[18px] border border-black/8 bg-white px-3.5 py-3 text-sm text-[#151515] outline-none ring-[#d8e2d6] transition focus:ring-2";

export function EditMealModal({ meal, onUpdated, triggerClassName }: EditMealModalProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(meal.title);
  const [kcal, setKcal] = useState(String(meal.kcal));
  const [protein, setProtein] = useState(String(meal.protein_g));
  const [carbs, setCarbs] = useState(String(meal.carbs_g));
  const [fat, setFat] = useState(String(meal.fat_g));
  const [notes, setNotes] = useState(meal.notes ?? "");

  async function onSubmit() {
    setSaving(true);
    setError(null);

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/meals/${meal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-dashboard-ui": "1",
          ...authHeaders,
        },
        body: JSON.stringify({
          title: title.trim(),
          kcal: Number(kcal),
          protein_g: Number(protein),
          carbs_g: Number(carbs),
          fat_g: Number(fat),
          notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to update meal");
      }

      await onUpdated();
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const confirmed = window.confirm("Delete this meal permanently?");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/meals/${meal.id}`, {
        method: "DELETE",
        headers: {
          "x-dashboard-ui": "1",
          ...authHeaders,
        },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to delete meal");
      }

      await onUpdated();
      setOpen(false);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unexpected error");
    } finally {
      setDeleting(false);
    }
  }

  if (!open) {
    return (
      <Button variant="ghost" className={triggerClassName} onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/28 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-black/8 bg-white/92 p-5 shadow-[0_24px_48px_rgba(21,21,21,0.14)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">Edit meal</p>
            <h3 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">Refine this entry</h3>
            <p className="text-sm text-[#6f685f]">Update the title, macros, or notes without leaving the dashboard.</p>
          </div>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving || deleting}>
            Close
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
            <label className="space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Meal title</span>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Meal title" className="bg-white" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Calories</span>
              <Input value={kcal} onChange={(event) => setKcal(event.target.value)} placeholder="kcal" className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Protein</span>
              <Input value={protein} onChange={(event) => setProtein(event.target.value)} placeholder="protein" className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Carbs</span>
              <Input value={carbs} onChange={(event) => setCarbs(event.target.value)} placeholder="carbs" className="bg-white" />
            </label>
            <label className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Fat</span>
              <Input value={fat} onChange={(event) => setFat(event.target.value)} placeholder="fat" className="bg-white" />
            </label>
          </div>

          <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
            <label className="space-y-1.5 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className={textareaClassName}
                placeholder="Meal description"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-black/6 bg-white/62 px-4 py-3.5">
            <div className="space-y-1 text-sm">
              {error ? <p className="text-[#8a3d30]">{error}</p> : null}
              {!error ? <p className="text-[#6f685f]">Changes will appear immediately in Today and History.</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onSubmit} disabled={saving || deleting}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={onDelete}
                disabled={saving || deleting}
                className="border-[#e9c7bf] text-[#8a3d30] hover:bg-[#f5dfdb] hover:text-[#7d3428]"
              >
                {deleting ? "Deleting..." : "Delete meal"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
}
