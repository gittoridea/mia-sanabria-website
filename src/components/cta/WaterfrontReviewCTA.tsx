import { LeadCaptureCTA } from "./LeadCaptureCTA";
import type { MarketSlug } from "@/lib/mia";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Pre-built WaterfrontReviewCTA wrapper for waterfront-specific
 * insight pages and waterfront market pages.
 */

export function WaterfrontReviewCTA({
  market,
  source,
  accent = "cream",
  heading,
  body,
}: {
  market?: MarketSlug;
  source?: string;
  accent?: "navy" | "cream";
  heading?: string;
  body?: string;
}) {
  const params = new URLSearchParams({ intent: "dockage-review" });
  if (market) params.set("market", market);
  if (source) params.set("source", source);

  const cta: InsightCTA = {
    variant: "waterfront-review",
    heading: heading ?? "Request a property-specific waterfront review.",
    body:
      body ??
      "On a specific waterfront address, Mia coordinates the dockage, route-to-inlet, and seawall pre-offer pass — the variables a survey and a public listing rarely answer together.",
    buttonLabel: "Request a waterfront review",
    href: `/contact/?${params.toString()}`,
  };
  return <LeadCaptureCTA cta={cta} accent={accent} />;
}
