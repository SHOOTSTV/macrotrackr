function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#ddd6ca]/70 ${className ?? ""}`}
    />
  );
}

export default function TodayLoading() {
  return (
    <main className="app-shell space-y-6">
      <header className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur">
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </header>

      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />

      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </main>
  );
}



