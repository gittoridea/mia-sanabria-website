import { MIA } from "@/lib/mia";

/**
 * Cycle 19B-FL — global compliance trust strip rendered between SiteHeader and
 * main content on every route. Closes Cato F6 / TP-13 (trust proof not satisfied
 * solely by the shared footer) by making the brokerage + license identity
 * visible above the fold on every page.
 *
 * Principal directive (Cycle 19B-FL Q1): ship the full string with FL Sales
 * Associate License #SL3405877, omit "Same-business-day response" until vetted
 * (Q2 directive).
 *
 * Mobile policy: the strip stacks the brokerage line above the license + city
 * line at <sm so the entire trust set remains visible above the fold at 320px
 * without the hero CTA being pushed below the first viewport. The strip is
 * ≤32px at desktop and ≤56px at 320px.
 */
export function TrustRow({ variant = "global" }: { variant?: "global" | "page" }) {
  const licenseNumber = MIA.unverified.licenseNumber ?? null;
  const brokerage = MIA.brokerage.legal;
  const realtorMark = MIA.title;
  const cityAnchor = `${MIA.contact.serviceCore.city}-based`;

  const containerClass =
    variant === "global"
      ? "border-b border-navy-800/10 bg-cream-50 text-navy-800"
      : "border-y border-navy-800/10 bg-cream-100 text-navy-800";

  // Vertical-space contract (Cycle 19B-FL premortem item):
  // ≤24px total height at desktop so the hero primary CTA stays above the fold
  // at 1280×800 across the 6 market pages flagged by audit:rendered
  // (fort-lauderdale, victoria-park, las-olas-isles, bay-colony, bermuda-riviera,
  // pompano-beach). At mobile, the strip wraps into 2 lines but mobile hero
  // viewports do not constrain CTA above-fold.
  return (
    <aside
      role="complementary"
      aria-label="Brokerage identity"
      data-testid="trust-row"
      className={containerClass}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0 px-4 py-[3px] text-center text-[10px] uppercase tracking-[0.18em] leading-tight text-navy-800/85 sm:gap-x-3 sm:py-1 lg:px-8 lg:text-[11px]">
        <span className="font-display text-brass-700">{realtorMark}</span>
        <span aria-hidden="true" className="text-navy-800/40">
          ·
        </span>
        <span>{brokerage}</span>
        {licenseNumber ? (
          <>
            <span aria-hidden="true" className="text-navy-800/40">
              ·
            </span>
            <span className="whitespace-nowrap">{`FL License #${licenseNumber}`}</span>
          </>
        ) : null}
        <span aria-hidden="true" className="text-navy-800/40">
          ·
        </span>
        <span className="whitespace-nowrap">{cityAnchor}</span>
      </div>
    </aside>
  );
}
