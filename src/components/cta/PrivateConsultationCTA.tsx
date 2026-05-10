import { LeadCaptureCTA } from "./LeadCaptureCTA";
import type { InsightCTA } from "@/lib/insights";

/**
 * Cycle 15 — Pre-built PrivateConsultationCTA wrapper for contact/about
 * pages and the home conversion strip.
 */

export function PrivateConsultationCTA({
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
  const params = new URLSearchParams({ intent: "consultation" });
  if (source) params.set("source", source);

  const cta: InsightCTA = {
    variant: "private-consultation",
    heading: heading ?? "Begin a private conversation.",
    body:
      body ??
      "Every engagement starts with a confidential conversation about the residence, timing, and the markets that fit. The first call is the brief.",
    buttonLabel: "Begin a private conversation",
    href: `/contact/?${params.toString()}`,
  };
  return <LeadCaptureCTA cta={cta} accent={accent} />;
}
