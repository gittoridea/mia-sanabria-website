# Cycle 17 — Fort Lauderdale V3 Implementation

**Date:** 2026-05-10
**Component:** `src/components/markets/FortLauderdaleV2.tsx` (filename + export preserved per Decision Card 4)
**Route:** `/markets/fort-lauderdale/` (unchanged; `[slug]/page.tsx` slug-guard still triggers `FortLauderdaleV2Page`)
**Decision binding:** CYCLE_17_DECISION_REGISTER.md Card 4 (Option B).

## Approach

Cycle 16 shipped a structurally complete V2 page. Cycle 17 lifts the **content quality** without churning the component filename, the export, or the rollout-template architecture. The result is V3 content in a V2-stable shell — the next markets (Boca Raton, Palm Beach, Delray Beach) clone the same component pattern with their own data; only `FortLauderdaleV2.tsx` gets the V3 content.

## What V3 ships

| # | Improvement | Where | Source intent |
|---|---|---|---|
| 1 | Hero `heading` override — HNWI-precision frame | `<Hero heading="Where deepwater yacht access, a working downtown, and a 165-mile canal system meet."/>` | Replaces `market.tagline` at the page render site only; data field stays intact for markets-index card + OG fallback. |
| 2 | New prelude section — "A decision, not a default" | New `<section>` between Hero and Executive AEO | 2 paragraphs anchored in private-conversation / brief-first framing for the privacy-conscious ICP. |
| 3 | Decision framework grows 6 → 7 cards | `WATERFRONT_VARIABLES` array + render-loop emphasize handling | New card: **Insurance underwriting and the 4-point sequence**. `emphasize: true` triggers full-width `lg:col-span-3` treatment below the 6-card grid + 2-col interior layout + brass-accent border. Eyebrow: "THE QUESTION BUYERS ASK MOST OFTEN." |
| 4 | Per-peer "Comes up when…" pointer in comparison section | `V3_PEER_POINTERS` const + map render | 6 peers registered (Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera) — each gets a 1-line italic decision-context anchor above its MarketCard. |
| 5 | Buyer playbook step 1 relocation thread | `BUYER_PLAYBOOK[0].body` | One added sentence covering the relocation/second-home ICP. |
| 6 | Buyer playbook anti-pattern aside | New `<aside>` after the ordered list | "What this is not. The brief is not a saved-search alert; it is a written priority hierarchy." |
| 7 | Seller playbook step 1 cross-link to POST_10 | `SELLER_PLAYBOOK[0].body` + the anti-pattern aside's Insights link | Routes Insights traffic from market page into the why-public-estimates-miss-luxury-waterfront brief. |
| 8 | Seller playbook anti-pattern aside | New `<aside>` after the ordered list | "What this is not. Pricing is not a number drawn from a public estimate, and positioning is not a slogan." Inline `<Link>` to `/insights/why-automated-valuations-miss-luxury-waterfront/`. |
| 9 | FAQ count grows 2 → 4 V2-specific (page total 5+4=9) | `FORT_LAUDERDALE_V2_FAQS` | New: "How is a private buyer brief different from a saved-search alert?" + "Why does route-to-inlet matter for a buyer who isn't a serious yachter?" Existing 2 carry forward verbatim. |

## Visible section count

10 (V2) → **11** (V3). Only one new visible section (the prelude); the other lifts are sub-modules inside existing sections.

## What V3 does NOT change

| Item | Reason |
|---|---|
| Component filename + export | `FortLauderdaleV2.tsx` + `FortLauderdaleV2Page` — no `[slug]/page.tsx` churn. |
| `market.tagline` data | Used by markets-index card + OG fallback; preserved verbatim. |
| `market.aeoAnswer` | 124 words; snippet-able for AEO. Verbatim. |
| Schema emissions | `RealEstateAgentSchema` + `PlaceSchema` + `BreadcrumbSchema` + `FaqSchema` continue. |
| Four-CTA strip | Strong; unchanged. |
| Colors / fonts / glassmorphism | Per principal lock. Brass accent border on the emphasized card uses existing `border-brass-400/30` token. |

## Accuracy constraints (HARD) honored

| Constraint | Implementation |
|---|---|
| No invented stats | Only structural facts (165 miles of canal, no fixed bridges, Port Everglades). |
| No fake rankings | None added. |
| No private-inventory promise | New FAQ #3 explicitly frames "where the brokerage relationships surface a fit" — conditional language, not promise. |
| No MLS authorization claim | None added. |
| No school steering | None added. |
| No insurance overclaim | New 7th decision card routes to a Florida-licensed insurance broker as ground truth. |
| No `off-market` term | Initial draft used "off-market introductions" — caught by `audit:stale`, rewritten to "pre-market introductions where the brokerage relationships surface a fit." Final FAQ uses audit-compliant language only. |

## Validation

- `bun run typecheck` → clean.
- `bun run lint` → no warnings/errors.
- `bun run build` → exit 0; all 39 routes built.
- `bun run audit:stale` → 0 hits.
- Built HTML contains all 8 V3 markers:
  - "Where deepwater yacht" (hero override)
  - "A decision, not a default" (prelude eyebrow)
  - "Fort Lauderdale rewards a written brief" (prelude H2)
  - "Insurance underwriting" (7th card title)
  - "THE QUESTION BUYERS" (7th card eyebrow)
  - "Comes up when" (peer pointers)
  - "What this is not" (anti-pattern asides — buyer + seller)
  - "route-to-inlet matter for a buyer who" (FAQ #4)

## Rollback

```bash
cd ~/code/mia-sanabria-website
git checkout HEAD -- src/components/markets/FortLauderdaleV2.tsx
```

The V3 lift lives in a single file; no other component or page changed. Rollback is a one-file checkout.

## Rollout pattern for Boca Raton / Palm Beach / Delray Beach V2 work

The V3-lifted FortLauderdaleV2.tsx remains the rollout template. When the next featured market V2 is built (Cycle 18 or beyond), clone the structural pattern (prelude → AEO → identity → decision framework with peer-relevant cards → per-peer pointers → buyer playbook with anti-pattern aside → seller playbook with anti-pattern aside → Related Insights → FAQ → 4-CTA strip). The 7th decision card concept ("question buyers ask most often") generalizes: each market has one. The per-peer pointer concept generalizes: each market's peers get one-line decision anchors.

## Related artifacts

- Decision binding: `docs/CYCLE_17_DECISION_REGISTER.md` Card 4.
- Source delta: `src/components/markets/FortLauderdaleV2.tsx` (single file).
- ICP review: `docs/CYCLE_17_FORT_LAUDERDALE_ICP_REVIEW.md`.
- Standard reference: `docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md`.
- Cycle 16 lineage: `docs/CYCLE_16_FORT_LAUDERDALE_MARKET_PAGE_V2_BLUEPRINT.md`.
- Cycle 16 rollout doc: `docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md`.
