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
}

export function EditMealModal({ meal, onUpdated }: EditMealModalProps) {
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
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/70 bg-white/95 p-5 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit meal</h3>
        <div className="space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Input value={kcal} onChange={(event) => setKcal(event.target.value)} placeholder="kcal" />
            <Input
              value={protein}
              onChange={(event) => setProtein(event.target.value)}
              placeholder="protein_g"
            />
            <Input value={carbs} onChange={(event) => setCarbs(event.target.value)} placeholder="carbs_g" />
            <Input value={fat} onChange={(event) => setFat(event.target.value)} placeholder="fat_g" />
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-20 w-full rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2"
            placeholder="Meal description"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={onSubmit} disabled={saving || deleting}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="ghost"
            onClick={onDelete}
            disabled={saving || deleting}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {deleting ? "Deleting..." : "Delete meal"}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving || deleting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
}
