"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function ManualMealForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="flex">
        <Button onClick={() => setIsOpen(true)}>Add meal</Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Add a meal manually</h2>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Chicken avocado bowl"
          required
        />

        <div className="grid gap-2 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-600">
            Meal type
            <select
              className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2"
              value={mealType}
              onChange={(event) => setMealType(event.target.value)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-600">
            Date and time
            <Input
              type="datetime-local"
              value={eatenAt}
              onChange={(event) => setEatenAt(event.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Input
            type="number"
            min={0}
            step="1"
            value={kcal}
            onChange={(event) => setKcal(event.target.value)}
            placeholder="kcal"
            required
          />
          <Input
            type="number"
            min={0}
            step="0.1"
            value={protein}
            onChange={(event) => setProtein(event.target.value)}
            placeholder="protein_g"
            required
          />
          <Input
            type="number"
            min={0}
            step="0.1"
            value={carbs}
            onChange={(event) => setCarbs(event.target.value)}
            placeholder="carbs_g"
            required
          />
          <Input
            type="number"
            min={0}
            step="0.1"
            value={fat}
            onChange={(event) => setFat(event.target.value)}
            placeholder="fat_g"
            required
          />
        </div>

        <textarea
          className="min-h-20 w-full rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add meal"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
            Close
          </Button>
        </div>
      </form>
    </Card>
  );
}
