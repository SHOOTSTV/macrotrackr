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
    <Card className="border-blue-200 bg-blue-50/60">
      <h3 className="text-base font-semibold text-blue-900">Smart reminder</h3>
      <p className="mt-1 text-sm text-blue-800">{reminder.message}</p>
      <div className="mt-3">
        <Button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Log {reminder.mealType}
        </Button>
      </div>
    </Card>
  );
}
