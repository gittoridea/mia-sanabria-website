# Page Architecture Standard

> Cycle 34 Phase 6.

Every primary public page must have:

1. **Clear H1** — one per page, declarative, includes the right keyword(s) without keyword-stuffing.
2. **Specific subheading** — 25-45 words; positions the page against a buyer/seller question or decision.
3. **Hero image OR intentional no-image design** — never a placeholder; never an off-topic decorative photo.
4. **Above-fold CTA** — either a primary search action or a "Talk to Mia" inquiry. Visible at 320, 375, 414, 768 viewports without scrolling past the hero panel.
5. **Secondary CTA near bottom** — the same hero CTA, restated near `</main>` so deep readers convert.
6. **Internal links** — at minimum 3 outbound to relevant Mia surfaces (markets, insights, contact, valuation).
7. **Schema** — Breadcrumb on every page; Place on market pages; FAQPage where FAQ is visible; Article on insight posts; ContactPage on `/contact/`; Person/RealEstateAgent on identity surfaces.
8. **Metadata** — title ≤60 chars, description 140-158 chars, canonical URL, OG image with correct width × height (1200 × 630), Twitter card.
9. **No placeholder content** — no lorem ipsum, no "[Mia Confirm]" markers in production HTML, no empty schema blocks.
10. **Mobile readability** — passes `audit:mobile-readability` at 320, 375, 414. Hero text never clips. Hero CTAs reachable.

## Neighborhood detail page architecture (canonical 11-block order)

Every neighborhood detail page should render these blocks in this order. Existing `/markets/[slug]/` pages already implement this via `Market` data model in `src/lib/markets.ts` — Phase 8 is a delta polish, not a refactor.

1. Hero (eyebrow / H1 / image / one-paragraph subheading)
2. Snapshot / quick facts (only sourced facts; no fake stats)
3. Mia's perspective (90-140 words, local-advisor voice)
4. Lifestyle pattern (80-120 words, physical/practical; no protected-class targeting)
5. Housing/property pattern (80-130 words, general property types)
6. Buyer guidance (70-110 words, practical)
7. Seller guidance (70-110 words, positioning)
8. Home Search CTA (link to `/home-search/?city=<city>` with honest demo-state preservation)
9. Nearby neighborhoods (3-5 internal links)
10. FAQ (3-5 Q&A pairs, 30-70 words each)
11. Schema block (BreadcrumbList + WebPage + FAQPage if FAQ visible + Place)

## Anti-patterns (do not ship)

- Two H1s on one page.
- Hero CTA that scrolls to a section that does not exist.
- Schema for content that is not rendered.
- "Updated MONTH YYYY" labels surfaced in user-visible copy.
- Placeholder testimonials.
- IDX iframes without MLS/IDX disclosure on the same page.
