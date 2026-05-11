import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  LEAD_MAGNET_SLUGS,
  PDF_DISCLAIMER,
  PDF_USE_AGREEMENT,
  getLeadMagnet,
} from "@/data/lead-magnets";
import { MIA } from "@/lib/mia";
import { SITE } from "@/lib/site";

/**
 * Cycle 19B-FL — Print-friendly HTML route for lead-magnet PDFs.
 *
 * The static route at `/downloads/{slug}/` renders a deterministic HTML page
 * that `scripts/render-lead-magnets.ts` then prints to PDF via
 * `google-chrome --headless --no-sandbox --print-to-pdf`. The PDF is saved to
 * both `public/downloads/{slug}.pdf` (for git persistence) and
 * `out/downloads/{slug}.pdf` (so this deploy serves it without a rebuild).
 *
 * Metadata sets `robots.noindex=true` so the HTML source pages do NOT appear
 * in search results — only the PDF deliverable is the intended artifact.
 */

export function generateStaticParams() {
  return LEAD_MAGNET_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) return { robots: { index: false, follow: false } };
  // Cycle 19B-FL — `title` uses the layout template (%s | Mia Sanabria) so we
  // pass just the magnet title; description is intentionally a short PDF-source
  // summary, not the long-form intro. These routes are noindex'd in any case.
  return {
    title: magnet.title,
    description: `${magnet.title} — print-friendly source for the downloadable PDF.`,
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: `${SITE.url}/downloads/${slug}/` },
  };
}

const BUILD_DATE_LABEL = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function LeadMagnetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  const licenseNumber = MIA.unverified.licenseNumber ?? null;

  return (
    <article
      data-testid="lead-magnet-page"
      data-slug={magnet.slug}
      className="print-magnet mx-auto max-w-3xl bg-white px-8 py-12 text-navy-800 print:px-10 print:py-10"
    >
      <header className="border-b border-navy-800/15 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.3em] text-brass-700">
              {MIA.title} · {MIA.brokerage.legal}
              {licenseNumber ? ` · FL License #${licenseNumber}` : null}
            </div>
            <h1 className="mt-2 font-display text-3xl text-navy-800 [text-wrap:balance] sm:text-[34px]">
              {magnet.title}
            </h1>
            <p className="mt-2 text-[14px] uppercase tracking-[0.18em] text-navy-800/70">
              {magnet.subtitle}
            </p>
          </div>
          <div className="text-right text-[10px] uppercase tracking-[0.2em] text-navy-800/60">
            <div>Prepared by</div>
            <div className="font-display text-[13px] text-navy-800">{MIA.name.marketing}</div>
            <div>{MIA.contact.phone}</div>
            <div>Issued {BUILD_DATE_LABEL}</div>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <p className="text-[14px] leading-relaxed text-navy-800/85">{magnet.intro}</p>
      </section>

      <section className="mt-8 space-y-7">
        {magnet.sections.map((section) => (
          <div key={section.heading} className="break-inside-avoid">
            <h2 className="font-display text-[18px] text-navy-800 [text-wrap:balance]">
              {section.heading}
            </h2>
            {section.sub ? (
              <p className="mt-1 text-[12px] italic leading-relaxed text-navy-800/65">
                {section.sub}
              </p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[18px_1fr] gap-2 text-[13px] leading-relaxed text-navy-800/85"
                >
                  <span aria-hidden="true" className="select-none font-display text-brass-700">
                    ☐
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {section.note ? (
              <p className="mt-2 text-[11px] italic text-navy-800/60">{section.note}</p>
            ) : null}
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-sm border border-brass-400/40 bg-cream-50 px-5 py-4 break-inside-avoid">
        <div className="font-display text-[10px] uppercase tracking-[0.28em] text-brass-700">
          Next step
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-navy-800/85">
          The diligence above is a starting list. Mia coordinates the engagement of licensed
          specialists — inspectors, surveyors, marine contractors, insurance brokers, lenders,
          title agents — whose findings are the ground truth for any specific residence.
        </p>
        <a
          href={`${SITE.url}${magnet.nextStep.href}`}
          className="mt-3 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-brass-700"
        >
          {magnet.nextStep.label} →
        </a>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="font-display text-[13px] uppercase tracking-[0.24em] text-navy-800/70">
          Source ledger
        </h2>
        <ul className="mt-2 space-y-1 text-[11px] leading-snug text-navy-800/70">
          {magnet.ledger.map((row) => (
            <li key={row.label}>
              {row.label}
              {row.url ? (
                <>
                  {" "}
                  — <span className="text-navy-800/55">{row.url}</span>
                </>
              ) : null}
              {row.note ? <span className="text-navy-800/55"> ({row.note})</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 break-inside-avoid text-[11px] leading-snug text-navy-800/75">
        <h2 className="font-display text-[12px] uppercase tracking-[0.24em] text-navy-800/70">
          Important: not professional advice
        </h2>
        <p className="mt-2" data-testid="pdf-disclaimer">{PDF_DISCLAIMER}</p>
      </section>

      <section className="mt-5 break-inside-avoid text-[10px] leading-snug text-navy-800/65">
        <h2 className="font-display text-[11px] uppercase tracking-[0.24em] text-navy-800/70">
          Use agreement
        </h2>
        <p className="mt-2" data-testid="pdf-agreement">{PDF_USE_AGREEMENT}</p>
      </section>

      <footer className="mt-10 flex items-end justify-between border-t border-navy-800/10 pt-4 text-[10px] uppercase tracking-[0.22em] text-navy-800/60">
        <div>
          <div className="font-display text-navy-800">{MIA.name.marketing}</div>
          <div>{MIA.title} · {MIA.brokerage.legal}</div>
          {licenseNumber ? <div>{`FL License #${licenseNumber}`}</div> : null}
          <div>{MIA.contact.phone} · {MIA.contact.serviceCore.city}, FL</div>
        </div>
        <div className="text-right">
          <div>{SITE.url.replace(/^https?:\/\//, "")}</div>
          <div>© {new Date().getFullYear()} Mia Sanabria</div>
        </div>
      </footer>
    </article>
  );
}
