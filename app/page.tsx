import Link from "next/link";

export default function Home() {
  return (
    <main className="app-shell relative flex min-h-screen max-w-6xl flex-col justify-center gap-5 py-8 md:py-12">
      <div className="pointer-events-none absolute inset-x-0 -top-44 -z-10 h-144" />

      <section className="rounded-4xl bg-linear-to-r from-sky-300/60 via-indigo-300/50 to-fuchsia-300/45 p-px shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
        <div className="rounded-[calc(2rem-1px)] border border-white/65 bg-white/78 p-6 backdrop-blur-2xl md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-blue-400/40 bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]">
              MacroTrackr
            </span>
            <span className="rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
              AI-first tracking
            </span>
            <span className="rounded-full border border-violet-200/70 bg-violet-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
              realtime dashboard
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.08fr_0.92fr]">
            <div>
              <h1 className="text-balance text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                Your nutrition dashboard.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                Direct AI ingestion, instant editing, and macro tracking you can
                read at a glance. A fast, clear experience built for daily use.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  className="rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
                  href="/auth"
                >
                  Get started now
                </Link>
                <Link
                  className="rounded-xl border border-slate-200/90 bg-white/92 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  href="/history"
                >
                  Explore history
                </Link>
                <Link
                  className="rounded-xl border border-slate-200/90 bg-white/92 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  href="/profile"
                >
                  Set my goals
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-slate-950/88 p-4 shadow-[0_22px_48px_rgba(15,23,42,0.35)]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Dashboard preview
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  Today
                </p>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Kcal</span>
                      <span>1760 / 2200</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[80%] rounded-full bg-linear-to-r from-sky-400 to-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Protein</span>
                      <span>122g / 140g</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[87%] rounded-full bg-linear-to-r from-emerald-400 to-cyan-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Carbs</span>
                      <span>186g / 240g</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[78%] rounded-full bg-linear-to-r from-amber-300 to-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Fat</span>
                      <span>58g / 70g</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[83%] rounded-full bg-linear-to-r from-violet-400 to-fuchsia-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/10 bg-white/4 p-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    add
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    &lt; 30 sec
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/4 p-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    edit
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    instant
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/4 p-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    view
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    clear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="group rounded-2xl border border-white/70 bg-white/82 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Step 1
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Add your meals
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            AI or manual, meals are saved instantly for a frictionless flow.
          </p>
        </article>

        <article className="group rounded-2xl border border-white/70 bg-white/82 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Step 2
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Set your goals
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Define calories, protein, carbs, and fat to keep a simple,
            measurable target.
          </p>
        </article>

        <article className="group rounded-2xl border border-white/70 bg-white/82 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
            Step 3
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Track your progress
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            See your history and update each meal from the dashboard in seconds.
          </p>
        </article>
      </section>
    </main>
  );
}
