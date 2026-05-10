# Cycle 16 — Fort Lauderdale Market Page V2 Blueprint

**Date:** 2026-05-10
**Implementation:** `src/components/markets/FortLauderdaleV2.tsx`
**Route:** `/markets/fort-lauderdale/`

## Why Fort Lauderdale first

Fort Lauderdale is Mia's home market and the highest-volume search target across `/insights/` and `/markets/` traffic. It's also the market where the existing templated page felt thinnest relative to the surface area of the actual decisions buyers and sellers make. Building it first lets the rollout pattern be the gold standard, not a compromise.

## Page structure (10 sections)

### 1. Hero (image background, Cycle 16 V2 eyebrow)

- Eyebrow: `Fort Lauderdale · The Venice of America`
- Heading: `market.tagline`
- Sub: `market.intro`
- Primary CTA: Begin a Private Buyer Brief
- Secondary CTA: Confidential Valuation
- Background image: `/markets/fort-lauderdale.jpg`
- Hero scrim layers per Hero.tsx (mood + content + cta — Cycle 11 contrast pattern preserved).

### 2. Executive AEO answer (75-125 words)

- Section heading: "The market, in a paragraph."
- Body: `market.aeoAnswer` (currently 124 words — within the AEO target band).
- 18px serif-flavored leading-relaxed prose, max-w-3xl.

### 3. Market identity (Eastern FL vs broader market)

- Section heading: "Why Fort Lauderdale matters in luxury and waterfront real estate."
- Three paragraphs:
  - Paragraph 1: 165-mile inland canal system + no-fixed-bridge yachting access. Factual, sourced from existing aeoAnswer + localContext.
  - Paragraph 2: `market.localContext` verbatim.
  - Paragraph 3: Comparison to Palm Beach County peers — Boca Raton, Palm Beach, Delray Beach — without inventing any specific stats or rankings. Names the distinction in market trade-on terms (pedigree, country club, Atlantic Avenue, etc.).
- Right-rail aside: "Mia's note" — pulls `market.miaQuote` if present (currently the "Venice of America yachting capital" quote), with a private-consultation CTA.

### 4. Waterfront decision framework (six verifiable variables)

- Section heading: "Six verifiable variables before any offer."
- Sub: "On a Fort Lauderdale waterfront parcel, the variables that matter most live in surveys, permits, and inspections — not in listing photographs."
- 6 cards in a 3-col grid:
  1. Dockage capacity (Anchor icon)
  2. Seawall age and inspection (ShieldCheck icon)
  3. Bridge clearance and route-to-inlet (Compass icon)
  4. Lot orientation and canal mouth (Ship icon)
  5. Architectural era and renovation history (Building2 icon)
  6. Flood, elevation, and inspection records (FileSearch icon)
- Bottom italic caveat: "None of the six is a substitute for a licensed inspector, marine contractor, surveyor, or insurance broker."

### 5. Neighborhood comparison module

- Section heading: dynamic, "Related Eastern Fort Lauderdale neighborhoods." or "Continue your tour."
- Sub: "The cohort buyers compare against Fort Lauderdale. Each entry leads to a dedicated market guide."
- Comparison prose: `market.comparisonContext` (already populated for FL).
- 3-column grid of `MarketCard` for each related market (currently: Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera).

### 6. Buyer playbook (5-step ordered list)

- Section heading: "Considering Fort Lauderdale as a buyer."
- Lead paragraph: `market.buyerGuidance`.
- 5-step playbook (numbered, brass-700 eyebrow):
  1. Begin with a brief, not a search.
  2. Narrow to two or three neighborhoods.
  3. Treat the lot as data, not aesthetic.
  4. Sequence diligence before offer.
  5. Use private conversations for quiet inventory.
- Right-rail aside: BUYER NEXT STEPS — Submit a Private Buyer Brief, How Mia Represents Buyers.

### 7. Seller playbook (5-step ordered list)

- Section heading: "Listing in Fort Lauderdale."
- Lead paragraph: `market.sellerGuidance`.
- 5-step playbook (numbered, brass-700 eyebrow):
  1. Begin with a property-specific valuation.
  2. Document the verifiable assets.
  3. Position to one buyer profile.
  4. Editorial photography and positioning.
  5. Discreet pre-market and targeted introductions.
- Left-rail aside (visually balances buyer playbook): SELLER NEXT STEPS — Request a Confidential Valuation, How Mia Represents Sellers.

### 8. Related Insights

- `<RelatedInsightsModule marketSlug={market.slug}>` — pulls posts where `relatedMarkets` or `secondaryMarkets` includes `fort-lauderdale`.
- Heading: "From the Insights library — Fort Lauderdale".

### 9. FAQ (7 items: 5 from data + 2 V2-specific)

- 5 existing FAQs from `market.faqs`.
- 2 V2-specific FAQs (Cycle 16):
  1. "How does Eastern Fort Lauderdale differ from broader Broward County?" — frames the Eastern-FL-as-distinct-market positioning.
  2. "Does Fort Lauderdale's flood-zone overlap make insurance harder?" — addresses a common buyer concern without overclaiming insurance expertise.
- `emitSchema` true → FAQPage schema renders.

### 10. Four-CTA strip (NEW — replaces single CTAStrip)

- Navy background section.
- Heading: "Four ways to begin a Fort Lauderdale conversation."
- 4-column grid (sm:grid-cols-2 lg:grid-cols-4):
  1. **Private consultation** — 30-minute call.
  2. **Confidential valuation** — property-specific comparable review.
  3. **Private buyer brief** — define the search.
  4. **Waterfront review** — property-specific review for a watched address.
- Each links to `/contact/` or `/valuation/` with `?intent=…&market=fort-lauderdale&source=market-v2-cta` URL attribution.

## Accuracy constraints honored

| Constraint | Implementation |
|---|---|
| No invented rankings | No "top luxury market" claims; AEO uses verifiable structural facts (165 miles of canal, no fixed bridges, Port Everglades). |
| No fake stats | No median price, no DOM stats, no sales-volume claims. |
| No private-inventory promises | Buyer playbook step 5 explicitly states "Access varies by market and timing and is not guaranteed." |
| No MLS authorization claims | No reference to MLS membership beyond what PUBLIC_FACT_LEDGER §2 already permits at the data-model level. |
| No school steering | Zero school/family content. |
| No insurance overclaim | FAQ explicitly routes insurance questions to a Florida-licensed insurance broker. |
| No flood-zone overclaim | Decision Framework §6 names variables; relies on FEMA + elevation certificate as ground truth, not Mia's interpretation. |

## Schema emissions

- `RealEstateAgentSchema` — sitewide person+agent emit.
- `PlaceSchema` — Fort Lauderdale lat/lng + county.
- `BreadcrumbSchema` — Home → Markets → Fort Lauderdale.
- `FaqSchema` — emitted by `<Faq emitSchema>` for the 7-item FAQ.

## Why the structure works

- **AEO-friendly:** the 75-125 word executive answer is the snippet-able block.
- **Editorial-luxury:** sections breathe (py-20 lg:py-28), cream/navy alternation, asymmetric grids for buyer/seller playbooks.
- **Conversion-friendly:** every section ends with a CTA or routes naturally into the next; the four-CTA strip caps the page with explicit intent paths.
- **Accessibility-friendly:** all sections use semantic h2/h3, alt text on hero, every CTA is a `<Link>` with discernible label.
- **DRY:** data continues to come from `market.*` fields where possible; new content is the structural scaffolding around them.

## Rollback

Remove `if (market.slug === "fort-lauderdale")` branch in `/markets/[slug]/page.tsx`. FL renders the standard template again. Trivial.
