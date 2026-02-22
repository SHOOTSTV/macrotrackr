import { DashboardNav } from "@/src/components/navigation/dashboard-nav";
import { requireServerUserId } from "@/src/lib/auth/server-session";
import { GoalsForm } from "@/src/features/profile/components/goals-form";
import { getNutritionGoalsOrDefault } from "@/src/lib/services/profile-goals";

export default async function ProfilePage() {
  const userId = await requireServerUserId();
  const goals = await getNutritionGoalsOrDefault(userId);

  return (
    <main className="app-shell space-y-6">
      <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Profile
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Nutrition Goals
            </h1>
            <p className="text-sm text-slate-600">
              User: <span className="font-medium">{userId}</span>
            </p>
          </div>
          <DashboardNav />
        </div>
      </header>

      <GoalsForm initialGoals={goals} />
    </main>
  );
}
