import { LeadCaptureCTA } from "./LeadCaptureCTA";
import type { MarketSlug } from "@/lib/mia";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Pre-built BuyerBriefCTA wrapper for use on non-insight pages
 * (homepage, markets index, buyer page, market pages). Composes a default
 * InsightCTA shape and passes through to LeadCaptureCTA.
 *
 * Used where the page does not own a post-specific CTA but needs a
 * consistent buyer-brief invitation.
 */

export function BuyerBriefCTA({
  market,
  source,
  accent = "navy",
  heading,
  body,
}: {
  market?: MarketSlug;
  source?: string;
  accent?: "navy" | "cream";
  heading?: string;
  body?: string;
}) {
  const params = new URLSearchParams({ intent: "buyer-brief" });
  if (market) params.set("market", market);
  if (source) params.set("source", source);

  const cta: InsightCTA = {
    variant: "buyer-brief",
    heading: heading ?? "Submit a private buyer brief.",
    body:
      body ??
      "A clearly written brief is the access. Mia takes the brief privately, identifies the right neighborhoods, and returns introductions sized to it — typically within the first conversation.",
    buttonLabel: "Submit a private buyer brief",
    href: `/contact/?${params.toString()}`,
  };
  return <LeadCaptureCTA cta={cta} accent={accent} />;
}
