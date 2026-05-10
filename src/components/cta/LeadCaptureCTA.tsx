import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightCTA, InsightCTAVariant } from "@/lib/insights";

/**
 * Cycle 15 — Base lead-capture CTA component. Renders the post-attached
 * primary or soft CTA defined on each InsightPost (slug-specific copy and href).
 *
 * Honesty contract: routes ONLY to existing pages (/contact/, /valuation/,
 * /markets/...) or non-GHL thank-you routes. Never claims CRM capture,
 * automated follow-up, or guaranteed response time. Uses existing brand
 * tokens — no new colors, fonts, or glassmorphism (preserves Cycle 14 brand
 * contract).
 */

type Accent = "navy" | "cream";

const accentToContainer: Record<Accent, string> = {
  navy: "bg-navy-800 text-cream-50",
  cream: "border border-navy-800/10 bg-cream-50 text-navy-800",
};

const accentToHeading: Record<Accent, string> = {
  navy: "text-cream-50",
  cream: "text-navy-800",
};

const accentToBody: Record<Accent, string> = {
  navy: "text-cream-200/90",
  cream: "text-navy-800/85",
};

const accentToButton: Record<Accent, string> = {
  navy: "bg-brass-400 text-navy-900 hover:bg-brass-300",
  cream: "bg-navy-800 text-cream-50 hover:bg-navy-700",
};

const variantLabel: Record<InsightCTAVariant, string> = {
  "buyer-brief": "Buyer Brief",
  "seller-valuation": "Confidential Valuation",
  "market-brief": "Market Brief",
  "private-consultation": "Private Conversation",
  "waterfront-review": "Waterfront Review",
  "listing-strategy": "Listing Strategy",
};

export function LeadCaptureCTA({
  cta,
  accent = "navy",
  showVariantTag = true,
}: {
  cta: InsightCTA;
  accent?: Accent;
  showVariantTag?: boolean;
}) {
  return (
    <section
      className={`mt-12 rounded-sm px-6 py-8 lg:px-10 lg:py-12 ${accentToContainer[accent]}`}
    >
      {showVariantTag && (
        <div
          className={`text-xs uppercase tracking-[0.3em] ${
            accent === "navy" ? "text-brass-400" : "text-brass-700"
          }`}
        >
          {variantLabel[cta.variant]}
        </div>
      )}
      <h3 className={`mt-3 font-display text-2xl sm:text-3xl ${accentToHeading[accent]}`}>
        {cta.heading}
      </h3>
      <p
        className={`mt-3 max-w-2xl text-[15px] leading-relaxed ${accentToBody[accent]}`}
      >
        {cta.body}
      </p>
      <div className="mt-6">
        <Link
          href={cta.href}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${accentToButton[accent]}`}
        >
          {cta.buttonLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
