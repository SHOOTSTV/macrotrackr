import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Macro Tracker with AI Meal Logging",
  description:
    "A refined macro tracker for fast AI meal logging, clear calorie totals, and daily nutrition goals that stay in view.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MacroTrackr",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://macrotrackr.vercel.app",
  description:
    "A refined macro tracker with AI meal logging, calorie tracking, and visible daily nutrition goals.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI meal logging",
    "Macro tracking",
    "Calorie tracking",
    "Daily nutrition goals",
    "Quick meal edits",
  ],
};

const meals = [
  { name: "Greek yogurt bowl", kcal: "420", time: "08:10" },
  { name: "Chicken rice plate", kcal: "610", time: "12:45" },
  { name: "Salmon and potatoes", kcal: "530", time: "19:20" },
] as const;

const microStats = [
  { label: "Logging", value: "AI or manual" },
  { label: "Focus", value: "Calories and macros" },
  { label: "Rhythm", value: "Goals stay visible" },
] as const;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="app-shell flex min-h-screen items-center py-6 md:py-8 lg:h-screen lg:overflow-hidden lg:py-6">
        <div className="relative w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-4 -z-10 h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.14),transparent_64%)] blur-3xl"
          />

          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.92fr] lg:items-center">
              <div className="p-6 md:p-8 lg:p-10 xl:p-11">
                <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/88 px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                    MacroTrackr
                  </span>
                </div>

                <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Calm performance
                </p>
                <h1 className="mt-3 max-w-xl text-balance text-4xl font-semibold leading-[0.94] tracking-[-0.055em] text-slate-950 md:text-6xl xl:text-[5.25rem]">
                  A macro tracker that keeps up with real meals.
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 md:text-[1.05rem]">
                  Log meals with AI, keep calories and macros readable, and stay close to your nutrition goals without the usual clutter.
                </p>

                <div className="mt-7">
                  <Link
                    className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    href="/auth"
                  >
                    Start free
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {microStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200/80 bg-white/72 px-4 py-3.5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative border-t border-white/60 bg-[linear-gradient(180deg,rgba(15,23,42,0.03),rgba(15,23,42,0.01))] p-4 md:p-6 lg:border-t-0 lg:border-l lg:border-white/60 lg:p-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-10 top-8 h-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_68%)] blur-3xl"
                />

                <div className="relative mx-auto max-w-sm rounded-[1.8rem] border border-slate-200/70 bg-[#f7f8fb] p-3.5 shadow-[0_24px_64px_rgba(15,23,42,0.12)] md:max-w-md md:p-4">
                  <div className="rounded-[1.35rem] bg-slate-950 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Today
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] md:text-3xl">
                          1,760 kcal
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Goal
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          2,200
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                          <span>Protein</span>
                          <span>122g / 140g</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[87%] rounded-full bg-[#7dd3fc]" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                          <span>Carbs</span>
                          <span>186g / 240g</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[78%] rounded-full bg-[#c4b5fd]" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                          <span>Fat</span>
                          <span>58g / 70g</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[83%] rounded-full bg-[#f9a8d4]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3.5 md:p-4">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Meal log
                      </p>
                      <p className="text-xs text-slate-500">3 entries</p>
                    </div>

                    <div className="space-y-2">
                      {meals.map((meal) => (
                        <div
                          key={meal.name}
                          className="flex items-center justify-between rounded-2xl border border-slate-200/80 px-3 py-2.5"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {meal.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {meal.time}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            {meal.kcal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
