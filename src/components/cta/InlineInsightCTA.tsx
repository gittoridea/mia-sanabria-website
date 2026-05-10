import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Inline mid-article CTA. Smaller, horizontally-oriented panel
 * intended to live between body sections rather than at the article's foot.
 * Renders the InsightPost.softCTA on each insight detail page.
 *
 * Honesty contract: same as LeadCaptureCTA — routes to existing pages or
 * non-GHL thank-you routes; never claims CRM capture or automated follow-up.
 */

export function InlineInsightCTA({ cta }: { cta: InsightCTA }) {
  return (
    <aside
      className="mt-10 rounded-sm border border-brass-400/40 bg-brass-400/5 px-5 py-5 text-[15px] leading-relaxed text-navy-800/90 sm:flex sm:items-center sm:justify-between sm:gap-6"
      aria-label="Insight inline call to action"
    >
      <div className="sm:flex-1">
        <p className="font-display text-lg text-navy-800">{cta.heading}</p>
        <p className="mt-1 text-[14px] text-navy-800/80">{cta.body}</p>
      </div>
      <div className="mt-4 sm:mt-0 sm:flex-none">
        <Link
          href={cta.href}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
        >
          {cta.buttonLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
