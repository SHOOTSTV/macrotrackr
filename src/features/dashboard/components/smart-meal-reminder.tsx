"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { getAuthHeaders } from "@/src/lib/auth/client-auth";
import type { SmartMealReminder } from "@/src/lib/services/meal-reminders";

interface SmartMealReminderProps {
  day: string;
  reminder: SmartMealReminder | null;
}

export function SmartMealReminderCard({ day, reminder }: SmartMealReminderProps) {
  useEffect(() => {
    if (!reminder) {
      return;
    }

    const key = `smart-reminder:${day}:${reminder.mealType}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(key)) {
      return;
    }

    toast.message(reminder.message);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, "shown");
    }

    void (async () => {
      try {
        const authHeaders = await getAuthHeaders();
        await fetch("/api/analytics/reminder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            day,
            meal_type: reminder.mealType,
            source: reminder.source,
          }),
        });
      } catch {
        // Best effort analytics
      }
    })();
  }, [day, reminder]);

  if (!reminder) {
    return null;
  }

  return (
    <Card className="border-[#cfddd1] bg-[#e5eee2]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#5d7361]">
            Smart reminder
          </p>
          <p className="text-sm leading-7 text-[#2f4940]">{reminder.message}</p>
        </div>
        <Button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Log {reminder.mealType}
        </Button>
      </div>
    </Card>
  );
}