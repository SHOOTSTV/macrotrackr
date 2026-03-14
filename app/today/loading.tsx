function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-[18px] bg-[#ddd6ca]/80 ${className ?? ""}`} />;
}

function Surface({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={`rounded-[30px] border border-black/8 bg-white/72 p-5 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

function HeaderSkeleton() {
  return (
    <header className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-10 w-60 rounded-[20px]" />
          <Skeleton className="h-5 w-52 rounded-full" />
        </div>

        <div className="flex w-full items-center gap-2 overflow-hidden rounded-[26px] border border-black/8 bg-[#f8f4ee]/92 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_36px_rgba(21,21,21,0.05)] md:w-[30rem]">
          <Skeleton className="h-10 w-20 rounded-full bg-white/90" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="ml-auto hidden h-10 w-24 rounded-full bg-[#f7e7e1] sm:block" />
        </div>
      </div>
    </header>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-4">
      <Skeleton className="h-3.5 w-20 rounded-full" />
      <Skeleton className="mt-3 h-9 w-24 rounded-[16px]" />
      <Skeleton className="mt-2 h-4 w-24 rounded-full" />
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <Surface>
      <Skeleton className="h-3.5 w-24 rounded-full" />
      <Skeleton className="mt-3 h-7 w-56 rounded-[18px]" />
      <Skeleton className="mt-2 h-4 w-full max-w-[18rem] rounded-full" />
      <Skeleton className="mt-2 h-4 w-48 rounded-full" />
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-11 w-28 rounded-full bg-white/90" />
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
    </Surface>
  );
}

function StreakCardSkeleton() {
  return (
    <Surface>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-44 rounded-[16px]" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <div className="rounded-[22px] bg-[#e4ece6] p-4">
          <Skeleton className="h-3.5 w-24 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-16 rounded-[16px] bg-white/65" />
        </div>
        <div className="rounded-[22px] bg-[#e6dfed] p-4">
          <Skeleton className="h-3.5 w-20 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-16 rounded-[16px] bg-white/65" />
        </div>
        <div className="rounded-[22px] bg-[#e4ece6] p-4">
          <Skeleton className="h-3.5 w-16 rounded-full bg-white/55" />
          <Skeleton className="mt-3 h-10 w-24 rounded-[16px] bg-white/65" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-36 rounded-full" />
      <Skeleton className="mt-3 h-3 w-full rounded-full" />
    </Surface>
  );
}

function ReminderSkeleton() {
  return (
    <section className="rounded-[28px] border border-[#cfddd1] bg-[#e5eee2] p-5 shadow-[0_20px_40px_rgba(21,21,21,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24 rounded-full bg-white/45" />
          <Skeleton className="h-4 w-full max-w-[15rem] rounded-full bg-white/55" />
          <Skeleton className="h-4 w-44 rounded-full bg-white/55" />
        </div>
        <Skeleton className="h-11 w-28 rounded-full bg-white/70" />
      </div>
    </section>
  );
}

function MealRowSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white/88 p-5 shadow-[0_14px_28px_rgba(21,21,21,0.05)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#b8cae6] to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-20 rounded-full bg-[#f1ebe2]" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-40 rounded-[14px]" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-20 rounded-full bg-[#f6f0e8]" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-10 w-full rounded-xl bg-[#edf1ea]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#e4ece9]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#f2eadb]" />
        <Skeleton className="h-10 w-full rounded-xl bg-[#ece7f0]" />
      </div>
    </div>
  );
}

function SearchPanelSkeleton() {
  return (
    <Surface className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20 rounded-full" />
        <Skeleton className="h-8 w-56 rounded-[18px]" />
        <Skeleton className="h-4 w-full max-w-[20rem] rounded-full" />
        <Skeleton className="h-4 w-56 rounded-full" />
      </div>

      <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
        <Skeleton className="h-12 w-full rounded-[18px] bg-[#f8f4ee]" />
        <Skeleton className="h-12 w-36 rounded-[18px]" />
      </div>

      <div className="space-y-2.5">
        <div className="rounded-[22px] border border-black/8 bg-[#f8f4ee] p-4">
          <Skeleton className="h-6 w-40 rounded-[14px]" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-24 rounded-full bg-white/80" />
            <Skeleton className="h-9 w-20 rounded-full bg-white/80" />
          </div>
        </div>
        <div className="rounded-[22px] border border-black/8 bg-[#f8f4ee] p-4">
          <Skeleton className="h-6 w-44 rounded-[14px]" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
            <Skeleton className="h-10 w-full rounded-xl bg-white/75" />
          </div>
        </div>
      </div>
    </Surface>
  );
}

export default function TodayLoading() {
  return (
    <main className="app-shell space-y-6">
      <HeaderSkeleton />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_360px] xl:items-start">
        <section className="rounded-[34px] border border-black/8 bg-white/76 p-6 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <Skeleton className="h-3.5 w-24 rounded-full" />
              <Skeleton className="h-10 w-72 rounded-[20px]" />
              <Skeleton className="h-4 w-full max-w-[30rem] rounded-full" />
              <Skeleton className="h-4 w-80 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <div className="mt-6 rounded-[28px] border border-black/6 bg-[#f8f4ee] p-5 sm:p-6">
            <Skeleton className="h-4 w-28 rounded-full" />
            <div className="mt-5 space-y-4">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-[92%] rounded-full" />
              <Skeleton className="h-4 w-[85%] rounded-full" />
              <Skeleton className="h-32 w-full rounded-[24px]" />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <QuickActionsSkeleton />
          <StreakCardSkeleton />
          <ReminderSkeleton />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
        <SearchPanelSkeleton />

        <Surface>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-16 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-[18px]" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full bg-[#f8f4ee]" />
          </div>
          <div className="mt-5 space-y-3">
            <MealRowSkeleton />
            <MealRowSkeleton />
            <MealRowSkeleton />
          </div>
        </Surface>
      </section>
    </main>
  );
}
