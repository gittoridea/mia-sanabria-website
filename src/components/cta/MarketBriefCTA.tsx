import { LeadCaptureCTA } from "./LeadCaptureCTA";
import type { MarketSlug } from "@/lib/mia";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Pre-built MarketBriefCTA wrapper for the markets index, market
 * pages, and insight surfaces that need a market-brief invitation.
 */

export function MarketBriefCTA({
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
  const params = new URLSearchParams({ intent: "market-brief" });
  if (market) params.set("market", market);
  if (source) params.set("source", source);

  const cta: InsightCTA = {
    variant: "market-brief",
    heading: heading ?? "Request the private market brief.",
    body:
      body ??
      "An infrequent dispatch on the markets you actually care about — written by Mia, sent only when there is something specific worth saying.",
    buttonLabel: "Request the private market brief",
    href: `/contact/?${params.toString()}`,
  };
  return <LeadCaptureCTA cta={cta} accent={accent} />;
}
