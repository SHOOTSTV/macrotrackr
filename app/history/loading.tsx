function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/60 ${className ?? ""}`}
    />
  );
}

export default function HistoryLoading() {
  return (
    <main className="app-shell space-y-6">
      <header className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="h-10 w-72" />
      </header>

      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />

      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </main>
  );
}
