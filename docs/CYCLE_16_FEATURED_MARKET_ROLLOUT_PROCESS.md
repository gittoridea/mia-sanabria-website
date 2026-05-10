# Cycle 16 — Featured Market V2 Rollout Process

**Date:** 2026-05-10
**Reference implementation:** `src/components/markets/FortLauderdaleV2.tsx`

## Goal

Apply the Fort Lauderdale gold-standard pattern to each of the remaining featured markets without losing fidelity or fabricating facts.

## Rollout order (recommended)

Per Cycle 16 Decision Register §1, the 12 homepage-featured markets in priority order are:

1. **Fort Lauderdale** — DONE (Cycle 16).
2. Boca Raton — primary service market, Palm Beach County trade-up.
3. Palm Beach — high-pedigree island market.
4. Victoria Park — Eastern FL in-town neighborhood.
5. Lighthouse Point — Broward coastal community.
6. Delray Beach — Atlantic Avenue trade.
7. Las Olas Isles — deepwater Eastern FL.
8. Harbor Beach — private gated Eastern FL.
9. Bay Colony — Eastern FL gated enclave.
10. Bermuda Riviera — mid-century Eastern FL.
11. Coral Ridge — country-club Eastern FL.
12. Rio Vista — historic Eastern FL.

Pace: **one market per cycle**, NOT batch. Each market deserves the same careful per-section work Fort Lauderdale received. Batch rollouts produce template-feeling pages.

## Per-market upgrade recipe

### Step 1 — Open the Market data entry

Read `src/lib/markets.ts` for the target slug. Confirm presence of:
- `aeoAnswer` (75-125 words; expand if shorter, but only with verifiable language)
- `localContext` (factual geographic detail)
- `buyerGuidance` (60-100 words)
- `sellerGuidance` (60-100 words)
- `comparisonContext` (60-120 words; required for V2 — add if missing)
- `internalLinks` (peer markets — ideally 4-6 entries)
- `faqs` (5 entries; V2 will add 2 market-specific)
- `miaQuote` (optional; pulls into Mia's-note aside)

If any of these fields is missing or thin, **block on completing them before V2 upgrade**. Adding scaffolding to thin data produces thin pages.

### Step 2 — Create the V2 component

Copy `src/components/markets/FortLauderdaleV2.tsx` to `src/components/markets/<MarketName>V2.tsx`. Rename the exported function. Then per-section:

**Section 1 (Hero):**
- Adjust the eyebrow to a market-specific tagline (e.g., "Boca Raton · Eastern Palm Beach County").
- Keep the same image-background + scrim pattern.
- Re-target the CTA hrefs with `&market=<slug>&source=market-v2`.

**Section 2 (AEO):**
- Pull from `market.aeoAnswer`. No edit needed if the existing AEO is in band.

**Section 3 (Market identity):**
- 3 paragraphs.
- Paragraph 1: factual structural fact about the market (no rankings; no stats unless drawn from a public source).
- Paragraph 2: `market.localContext` verbatim.
- Paragraph 3: comparison to 2-3 peer markets, written in trade-on terms (architectural era, water access, walkability, gated status) — NOT in invented metrics.
- Right-rail aside: pulls `market.miaQuote` if present; otherwise the market-specific brief language.

**Section 4 (Waterfront decision framework):**
- KEEP the 6-card framework for water-adjacent markets (Boca, Palm Beach, Delray Beach, Lighthouse Point, Las Olas Isles, Harbor Beach, Bay Colony, Bermuda Riviera, Rio Vista).
- For non-waterfront-primary markets (Victoria Park, Coral Ridge), REPLACE with a "Neighborhood decision framework" that names 6 in-town variables (walkability, school zone references kept abstract, renovation history, lot orientation, architectural era, established-block density).
- Never invent variables that don't apply to the market.

**Section 5 (Neighborhood comparison):**
- Pulls from `market.comparisonContext` + `market.internalLinks`.
- No section-specific edits typically needed.

**Section 6 (Buyer playbook):**
- 5 steps, numbered.
- Steps 1, 4, 5 generalize (brief, diligence, quiet inventory) — keep verbatim.
- Steps 2, 3 are market-specific:
  - Step 2: "Narrow to N neighborhoods" — replace with market-specific shortlist logic.
  - Step 3: "Treat the lot as data" — replace for non-waterfront markets with "Treat the block as data" or similar.

**Section 7 (Seller playbook):**
- 5 steps, numbered.
- Steps 1, 4, 5 generalize (valuation, photography, pre-market) — keep verbatim.
- Steps 2, 3 are market-specific:
  - Step 2: "Document the verifiable assets" — adjust the asset list (seawall + dock for waterfront markets; ARCOM history for Palm Beach; renovation permits for in-town markets).
  - Step 3: "Position to one buyer profile" — name the market's actual buyer profiles.

**Section 8 (Related Insights):**
- No edit needed; data-driven.

**Section 9 (FAQ):**
- Keep `market.faqs` (5 existing).
- Add 2 V2-specific FAQs per market:
  - One that frames how the market differs from the broader county/region.
  - One that addresses the most common technical-concern question (insurance, building review, association rules, flood zone, etc.).

**Section 10 (Four-CTA strip):**
- Re-target hrefs with market slug.
- Adjust headings for market context (e.g., "Four ways to begin a Boca Raton conversation").

### Step 3 — Wire into the [slug] page

Add another branch:

```ts
if (market.slug === "boca-raton") {
  return <BocaRatonV2Page market={market} relatedMarkets={relatedMarkets} relatedHeading={relatedHeading} />;
}
```

**OR** — better — refactor to a registry once 3+ markets have V2 pages:

```ts
const V2_PAGES: Record<MarketSlug, React.ComponentType<V2Props>> = {
  "fort-lauderdale": FortLauderdaleV2Page,
  "boca-raton": BocaRatonV2Page,
  // …
};
```

### Step 4 — Verify

- `bun run typecheck`
- `bun run build`
- `bun run audit:featured-markets` (Phase 10).
- Interceptor screenshot at 320 / 375 / 768 / 1280 / 1440 viewports.
- Visual review for:
  - Hero readable at every viewport.
  - 6 framework cards stack cleanly.
  - 5-step playbooks read in order on mobile.
  - 4-CTA strip wraps gracefully on mobile (2×2).

### Step 5 — Document

For each new V2 market, add a `docs/CYCLE_N_<MARKET>_MARKET_PAGE_V2_NOTES.md` capturing:
- What was added.
- Any data-shape changes needed in `MARKETS`.
- Any verified facts that became new render targets.
- Screenshot links.

## Hard constraints (do not violate)

| Constraint | Why |
|---|---|
| No invented stats | Search engines penalize fabricated structured data + Mia is exposed to real-estate-license false-advertising risk. |
| No invented rankings | "Top luxury market in X" claims must be sourced or omitted. |
| No private-inventory promises | "Access varies by market and timing and is not guaranteed" is the canonical disclaimer. |
| No school steering | Federal Fair Housing risk. Omit. |
| No MLS authorization claims | LPT membership ≠ MLS-authorized display of MLS marks. |
| No insurance overclaim | Always route to a Florida-licensed insurance broker. |
| No flood-zone overclaim | Always cite FEMA + elevation certificate as ground truth. |
| Same design tokens | No new colors, fonts, glassmorphism, or shadow primitives. |
| Same hero pattern | All V2 pages must use the same 3-layer scrim Hero, not bespoke per-market hero overlays. |

## Timeline (recommended)

- Cycle 17 (or whenever next BSS / Mia work happens): Boca Raton V2.
- Cycle 18: Palm Beach V2.
- Cycle 19: Victoria Park V2 (Eastern FL in-town pivot — test the non-waterfront framework variant).
- Subsequent cycles: one market per cycle.

The "one per cycle" cadence is intentional — each V2 page gets a full review window for fact accuracy.

## Anti-pattern: batch V2 conversion

Do NOT batch-convert remaining 11 markets in a single cycle. Symptoms of that anti-pattern (which previous cycles avoided):
- Same paragraph templates with different city names.
- FAQ answers that don't actually differ.
- Six-card framework reused unchanged for in-town markets.
- Photography hero images that aren't real to the market.
- Generic-feeling pages that lose the editorial premium.

One market per cycle, done well, is worth more than 11 markets done quickly.
