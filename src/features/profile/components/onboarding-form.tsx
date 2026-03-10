"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { ActivityLevel, UserGoal, UserSex } from "@/src/types/onboarding";

const SEX_OPTIONS: Array<{ value: UserSex; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const GOAL_OPTIONS: Array<{ value: UserGoal; label: string; description: string }> = [
  { value: "lose", label: "Lose", description: "Create a lighter daily target." },
  { value: "maintain", label: "Maintain", description: "Stay close to your current weight." },
  { value: "gain", label: "Gain", description: "Support a higher intake over time." },
];

const ACTIVITY_OPTIONS: Array<{ value: ActivityLevel; label: string; description: string }> = [
  { value: "sedentary", label: "Sedentary", description: "Mostly seated days." },
  { value: "light", label: "Light", description: "A bit of movement each day." },
  { value: "moderate", label: "Moderate", description: "Regular movement or training." },
  { value: "active", label: "Active", description: "Busy days with frequent activity." },
  { value: "very_active", label: "Very active", description: "High training or physically demanding days." },
];

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
    <Card className="space-y-5 p-6 lg:p-7">
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">Setup</p>
        <h2 className="text-3xl font-medium tracking-[-0.06em] text-[#151515]">Build your starting targets</h2>
        <p className="text-sm leading-7 text-[#6f685f]">
          A few details are enough to generate your first daily calories and macros.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Profile</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Sex</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SEX_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSex(option.value)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      sex === option.value
                        ? "border-[#151515] bg-[#151515] text-[#f4efe7]"
                        : "border-black/8 bg-white text-[#151515] hover:bg-[#f5efe7]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Goal</p>
              <div className="mt-3 grid gap-2">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGoal(option.value)}
                    className={cn(
                      "rounded-[18px] border px-4 py-3 text-left transition",
                      goal === option.value
                        ? "border-[#151515] bg-white text-[#151515] shadow-[0_10px_18px_rgba(21,21,21,0.05)]"
                        : "border-black/8 bg-white/72 text-[#4f4a43] hover:bg-white",
                    )}
                  >
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-1 block text-xs text-[#6f685f]">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Body metrics</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Age</span>
              <Input type="number" min={16} max={90} value={age} onChange={(event) => setAge(event.target.value)} required className="mt-3 bg-white" />
              <span className="mt-3 block text-xs text-[#847c73]">years old</span>
            </label>

            <label className="block rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Height</span>
              <Input
                type="number"
                min={120}
                max={230}
                value={heightCm}
                onChange={(event) => setHeightCm(event.target.value)}
                required
                className="mt-3 bg-white"
              />
              <span className="mt-3 block text-xs text-[#847c73]">cm</span>
            </label>

            <label className="block rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4 text-sm text-[#4f4a43]">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7a736b]">Weight</span>
              <Input
                type="number"
                min={35}
                max={300}
                step="0.1"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                required
                className="mt-3 bg-white"
              />
              <span className="mt-3 block text-xs text-[#847c73]">kg</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7a736b]">Activity</p>
          <div className="grid gap-2">
            {ACTIVITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActivityLevel(option.value)}
                className={cn(
                  "rounded-[20px] border px-4 py-3 text-left transition",
                  activityLevel === option.value
                    ? "border-[#151515] bg-white text-[#151515] shadow-[0_10px_18px_rgba(21,21,21,0.05)]"
                    : "border-black/8 bg-[#f8f4ee] text-[#4f4a43] hover:bg-white",
                )}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="mt-1 block text-xs text-[#6f685f]">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-black/6 bg-[#f8f4ee] px-4 py-3.5">
          <div className="space-y-1 text-sm">
            {error ? <p className="text-[#8a3d30]">{error}</p> : null}
            {!error ? (
              <p className="text-[#6f685f]">You can refine these targets later from your profile page.</p>
            ) : null}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Complete setup"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
