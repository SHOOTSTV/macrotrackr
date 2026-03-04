"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { ActivityLevel, UserGoal, UserSex } from "@/src/types/onboarding";

export function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sex, setSex] = useState<UserSex>("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("75");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<UserGoal>("maintain");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/profile/onboarding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({
          sex,
          age: Number(age),
          height_cm: Number(heightCm),
          weight_kg: Number(weightKg),
          activity_level: activityLevel,
          goal,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to save onboarding");
      }

      router.replace("/today");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Adaptive onboarding</h1>
      <p className="mb-4 text-sm text-slate-600">
        Complete your profile to auto-generate nutrition targets.
      </p>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid gap-2 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Sex</span>
            <select
              value={sex}
              onChange={(event) => setSex(event.target.value as UserSex)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Goal</span>
            <select
              value={goal}
              onChange={(event) => setGoal(event.target.value as UserGoal)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain mass</option>
            </select>
          </label>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Age</span>
            <Input type="number" min={16} max={90} value={age} onChange={(event) => setAge(event.target.value)} required />
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Height (cm)</span>
            <Input
              type="number"
              min={120}
              max={230}
              value={heightCm}
              onChange={(event) => setHeightCm(event.target.value)}
              required
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Weight (kg)</span>
            <Input
              type="number"
              min={35}
              max={300}
              step="0.1"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              required
            />
          </label>
        </div>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Activity level</span>
          <select
            value={activityLevel}
            onChange={(event) => setActivityLevel(event.target.value as ActivityLevel)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very active</option>
          </select>
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Complete onboarding"}
        </Button>
      </form>
    </Card>
  );
}
