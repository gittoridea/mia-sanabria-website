import { LeadCaptureCTA } from "./LeadCaptureCTA";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Pre-built SellerValuationCTA wrapper for sellers/valuation/insight
 * surfaces that need a confidential-valuation invitation without composing
 * the InsightCTA shape inline.
 */

export function SellerValuationCTA({
  source,
  accent = "navy",
  heading,
  body,
}: {
  source?: string;
  accent?: "navy" | "cream";
  heading?: string;
  body?: string;
}) {
  const params = new URLSearchParams();
  if (source) params.set("source", source);

  const href = `/valuation/${params.toString() ? `?${params.toString()}` : ""}`;

  const cta: InsightCTA = {
    variant: "seller-valuation",
    heading: heading ?? "Request a confidential valuation.",
    body:
      body ??
      "Mia walks the residence privately, pulls parcel-level comparables, and returns a defensible price band — the work an automated estimate cannot do.",
    buttonLabel: "Request a confidential valuation",
    href,
  };
  return <LeadCaptureCTA cta={cta} accent={accent} />;
}
