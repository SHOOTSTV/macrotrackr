import type { ReactNode } from "react";
import Link from "next/link";

import { PublicFooter } from "@/src/components/navigation/public-footer";

interface LegalSection {
  title: string;
  paragraphs: readonly string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly LegalSection[];
  children?: ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
  children,
}: LegalPageProps) {
  return (
    <main className="app-shell py-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-[34px] border border-black/8 bg-white/76 p-7 shadow-[0_22px_44px_rgba(21,21,21,0.06)] backdrop-blur-xl sm:p-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5f5a53] transition-colors duration-200 hover:text-[#151515]"
            >
              <span aria-hidden="true">←</span>
              <span>Back to homepage</span>
            </Link>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7a736b]">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.065em] text-[#151515] sm:text-[3.15rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#6f685f]">{description}</p>
          </div>
        </header>

        <section className="rounded-[30px] border border-black/8 bg-white/72 p-6 shadow-[0_20px_40px_rgba(21,21,21,0.06)] backdrop-blur-xl sm:p-7">
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-2xl font-medium tracking-[-0.05em] text-[#151515]">
                  {section.title}
                </h2>
                <div className="space-y-3 text-sm leading-7 text-[#5f5a53]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {children ? (
              <section className="rounded-[24px] border border-black/6 bg-[#f8f4ee] p-5 text-sm leading-7 text-[#5f5a53]">
                {children}
              </section>
            ) : null}
          </div>
        </section>

        <PublicFooter />
      </div>
    </main>
  );
}
