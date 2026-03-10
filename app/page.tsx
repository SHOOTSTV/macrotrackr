import type { Metadata } from "next"
import { Jost } from "next/font/google"
import Link from "next/link"

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "MacroTrackr | Clear macro tracking, every day",
  description:
    "MacroTrackr helps you log meals quickly, stay on target, and keep your nutrition routine clear without extra noise.",
  alternates: {
    canonical: "/",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MacroTrackr",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://macrotrackr.vercel.app",
  description:
    "A clear nutrition dashboard for calories, protein, carbs, and fats.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

const navLinks = [{ href: "#features", label: "Features" }]

const features = [
  {
    label: "Capture",
    title: "Log meals without slowing down",
    body: "Use the fastest input for the moment, then get back to your day.",
  },
  {
    label: "Targets",
    title: "Keep macros readable at a glance",
    body: "Calories, protein, carbs, and fats stay visible while you log.",
  },
  {
    label: "History",
    title: "Review the day without the clutter",
    body: "Your entries stay easy to scan, adjust, and trust over time.",
  },
]

const heroHighlights = [
  { value: "Targets", label: "Visible all day" },
  { value: "Meals", label: "Quick to update" },
  { value: "History", label: "Easy to review" },
]

const previewRows = [
  { label: "Calories", value: "1,760 / 2,200", width: "80%", color: "#93c5fd" },
  { label: "Protein", value: "122 g / 140 g", width: "87%", color: "#7dd3fc" },
  { label: "Carbs", value: "186 g / 240 g", width: "78%", color: "#b6a7e8" },
  { label: "Fat", value: "58 g / 70 g", width: "83%", color: "#97b08f" },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={`${jost.className} min-h-screen bg-[#f4efe7] text-[#151515]`}>
        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between border-b border-black/8 pb-5">
            <Link href="/" className="text-lg font-medium tracking-[-0.04em] text-[#151515]">
              MacroTrackr
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-[#5f5a53] md:flex">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition-colors duration-200 hover:text-[#151515]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Link
              href="/auth"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#151515] transition-colors duration-200 hover:bg-black/4"
            >
              Sign in
            </Link>
          </header>

          <section className="grid min-h-[calc(100svh-110px)] gap-14 py-14 lg:grid-cols-[1fr_420px] lg:items-center lg:py-16">
            <div className="space-y-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#6f685f]">
                Clear macro tracking
              </p>

              <div className="space-y-5">
                <h1 className="max-w-2xl text-balance text-4xl font-medium leading-[0.92] tracking-[-0.07em] text-[#151515] sm:text-5xl lg:text-[4.4rem]">
                  A simpler way to stay on top of your nutrition.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#5f5a53]">
                  Log meals quickly, stay on target, and keep calories, protein,
                  carbs, and fats easy to read every day.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-[#f4efe7] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Start free
                </Link>
                <Link
                  href="/today"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-[#151515] transition-colors duration-200 hover:bg-black/4"
                >
                  See dashboard
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <StatCard key={item.label} value={item.value} label={item.label} />
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_24px_60px_rgba(21,21,21,0.08)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#7a736b]">
                    Daily dashboard
                  </p>
                  <p className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#151515]">
                    Today
                  </p>
                </div>
                <div className="rounded-full bg-[#dde7d9] px-3 py-1 text-xs font-medium text-[#365141]">
                  On track
                </div>
              </div>

              <div className="space-y-5 pt-5">
                {previewRows.map((row) => (
                  <div key={row.label} className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm text-[#5f5a53]">
                      <span>{row.label}</span>
                      <span className="text-[#151515]">{row.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-black/6">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: row.width, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="border-t border-black/8 py-20 sm:py-24">
            <div className="space-y-10">
              <div className="max-w-2xl space-y-4">
                <SectionLabel>Features</SectionLabel>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.05em] text-[#151515] sm:text-4xl">
                  Everything important stays clear.
                </h2>
                <p className="text-base leading-8 text-[#5f5a53]">
                  MacroTrackr is designed to help you move faster, stay oriented, and keep the habit light enough to repeat every day.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    label={feature.label}
                    title={feature.title}
                    body={feature.body}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-black/8 py-20">
            <div className="flex flex-col gap-8 rounded-[30px] border border-black/8 bg-white/72 px-6 py-8 shadow-[0_20px_40px_rgba(21,21,21,0.06)] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl space-y-4">
                <SectionLabel>Start now</SectionLabel>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.05em] text-[#151515] sm:text-4xl">
                  Keep your nutrition routine clear from the first meal to the last.
                </h2>
                <p className="text-base leading-8 text-[#5f5a53]">
                  Set your targets, log quickly, and stay on top of the day without adding more noise.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-[#f4efe7] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create account
                </Link>
                <Link
                  href="/today"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-[#151515] transition-colors duration-200 hover:bg-black/4"
                >
                  View product
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
      {children}
    </p>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white/60 p-4 backdrop-blur-xl">
      <p className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f5a53]">{label}</p>
    </div>
  )
}

function FeatureCard({
  label,
  title,
  body,
}: {
  label: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-[28px] border border-black/8 bg-white/64 p-6 backdrop-blur-xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#7a736b]">
        {label}
      </p>
      <h3 className="mt-5 max-w-[16ch] text-2xl font-medium leading-[1.05] tracking-[-0.05em] text-[#151515]">
        {title}
      </h3>
      <p className="mt-4 max-w-[28ch] text-sm leading-7 text-[#5f5a53]">{body}</p>
    </div>
  )
}

