# Cycle 25 — Canonical Page Model

**Audience:** the engineer implementing the seven new approved-neighborhood pages (Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise).

**Contract:** each new page is a `Market` entry pushed to `src/lib/markets.ts` and a slug pushed to `ALL_MARKET_SLUGS` in `src/lib/mia.ts`. `[slug]/page.tsx` is untouched — `generateStaticParams` iterates `MARKETS`, so a new entry produces a new route automatically. Reuse, not reinvention.

**Source of truth:**
- `src/lib/markets.ts:30-104` — `Market` type.
- `src/lib/markets.ts:1100-1174` — Pompano Beach gold-standard reference.
- `src/lib/mia.ts:66-84` — `ALL_MARKET_SLUGS` (append new slug with Cycle 25 comment).
- `src/app/markets/[slug]/page.tsx:120-371` — template; not modified this cycle.

---

## 1. Section-by-section schema

Order matches `[slug]/page.tsx:120-371`:

| # | Section | Source field(s) |
|---|---|---|
| 0 | Schema heads (`RealEstateAgentSchema` + `PlaceSchema` + `BreadcrumbSchema`) | `name`, `intro`, `county`, `latitude`, `longitude`, `slug` |
| 1 | Hero | `tagline`, `intro`, `heroImage` |
| 2 | AEO answer block | `aeoAnswer` |
| 3 | Lifestyle + brief aside | `lifestyle`, `highlights`, `priceCharacter` |
| 4 | Property archetypes grid (5, numbered 01–05) | `propertyTypes` |
| 5 | Buyer guidance | `buyerGuidance` |
| 6 | Seller guidance | `sellerGuidance` |
| 7 | FAQ + `FaqSchema` (visible 5; schema emits AEO + 5 = 6 entities) | `faqs`, `aeoAnswer` |
| 8 | Related markets (heading "Continue your tour." for Cycle 25 entries) | `internalLinks`, `comparisonContext` |
| 9 | `RelatedInsightsModule` (silent-empty if no brief references the slug) | derived from `slug` |
| 10 | CTA strip ("Inquire about {name}.") | template-built |

---

## 2. Field-level contracts

Reference Pompano Beach gold standard at `markets.ts:1100-1174` for every shape below. Word counts: numerals count as one word; commas/periods do not.

| Field | Type | Constraint |
|---|---|---|
| `slug` | `MarketSlug` | Must appear in `ALL_MARKET_SLUGS` (`mia.ts:66-84`); kebab-case; matches `MIA_APPROVED_NEIGHBORHOODS[].slug` |
| `cluster` | `"primary"` | All seven Cycle 25 entries |
| `name` | `string` | Civic display name; matches `MIA_APPROVED_NEIGHBORHOODS` label exactly |
| `tagline` | `string` | **≤ 90 chars**, sentence-case, no period, no superlatives |
| `intro` | `string` | **40–70 words**, 2 sentences; used as `PlaceSchema.description` + Hero `sub` |
| `highlights` | `ReadonlyArray<string>` | **Exactly 5**, each 8–18 words; concrete civic/geographic facts (square mileage, borders, named CRA / district / parks / inlet). No "vibrant," "thriving," "premier" |
| `lifestyle` | `string` | **60–100 words**, 1–2 sentences; who the city suits, daily-life vector; may name a peer ("at relative value to X") |
| `priceCharacter` | `string` | **30–60 words**; names price-driving variables (corridor segment, dock, HOA tier, milestone-inspection). No dollar figures, no "trending up" |
| `latitude` | `number` | Civic centroid, 4 decimals; source: Broward GeoHub or US Census place centroid |
| `longitude` | `number` | Civic centroid, 4 decimals; same source |
| `heroImage` | `string` | `"/markets/{slug}.jpg"` — sharp-generated placeholder this cycle (§5) |
| `localContext` | `string` | **60–120 words**; compass-named borders + civic features (CRA, inlet, parks, university, sawgrass corridor, equestrian overlay). Every claim source-traceable |
| `county` | `"Broward County"` | All seven entries |
| `aeoAnswer` | `string` | **90–150 words**, single dense paragraph. **First sentence must read cleanly as a standalone meta description** (clamped at `[slug]/page.tsx:33-42`). No superlatives |
| `propertyTypes` | `ReadonlyArray<string>` | **Exactly 5**, each 6–14 words; named archetypes, not generic |
| `buyerGuidance` | `string` | **75–110 words**; 3–4 buyer-brief patterns + diligence vectors (seawall, dock, milestone-inspection, HOA, deed restrictions, flood zone, equestrian overlay). No filler |
| `sellerGuidance` | `string` | **75–110 words**; buyer-cohort segmentation + pre-list prep + why local representation matters here. No "top dollar" filler |
| `faqs` | `ReadonlyArray<MarketFaq>` | **Exactly 5**, each `answer` **30–80 words**. FAQ 1 = geography / civic identity; one FAQ = cohort comparison. No school / safety / demographics / "best neighborhoods within {city}" |
| `comparisonContext` | `string` | **80–130 words**; names the cohort of approved-slug peers + buyer-decision logic. Only links to slugs in `ALL_MARKET_SLUGS`; non-slug neighbors (Parkland, Cooper City) may appear unlinked in prose |
| `internalLinks` | `ReadonlyArray<MarketInternalLink>` | **3–6 entries**, all pointing at slugs in `ALL_MARKET_SLUGS` (no forward references unless shipped same PR) |
| `miaQuote` | `string?` | Cycle 25 default: **omit** — no verified Mia quotes for these seven |
| `cardObjectPosition` | `string?` | Cycle 25 default: **omit** — placeholder JPGs are centered by design |

---

## 3. CTA pattern

Reuse the template's existing hrefs only. **No new endpoints, no GHL webhooks, no Bridge URLs.** Hero → `/contact/` + `/markets/`. Lifestyle aside → `/contact/` + `/valuation/`. Buyer aside → `/buyers/` + `/contact/?intent=buyer`. Seller aside → `/sellers/` + `/valuation/`. CTA strip → `/contact/` + `/valuation/`. Search affordance → `/markets/#property-search` (global header icon, untouched). `mailto:msanabriarea@gmail.com` fallback on `/contact/` and `/valuation/` is preserved; GHL endpoint wiring blocked per decision record §"CTAs / forms / lead capture."

---

## 4. IDX / search strategy

- No inline Bridge search on any new page.
- Only search affordance: global header icon (locked `Home Search` per decision record §"Navigation") anchoring to `/markets/#property-search`.
- `src/lib/bridge.ts` stays scaffold-only — no `BRIDGE_*` env consumption, no fetch, no SDK init, no client-side token reference.
- No "live MLS," "real-time inventory," or "MLS feed" copy. Buyer / seller guidance describes Mia's representation, not a data feed.

---

## 5. Image strategy

`/public/markets/{slug}.jpg` (1600×900) + `/public/og-markets/{slug}.jpg` (1200×630). Source: placeholder JPG via sharp from inline brand-tone SVG; palette navy-800 + cream-50 + brass-400; city name in `font-display`. No photography, no stock, no scraping. `heroImage` field always `/markets/{slug}.jpg` (matches `getMarketImagePath()` at `mia.ts:209-211`). `audit:images` enforces presence of both files. When Mia supplies licensed photography, swap the file in place — no `Market` entry change. Photography upload **out of scope this cycle**.

---

## 6. Schema / meta expectations

All emitted by the template at `[slug]/page.tsx`. Author actions only where named:

- **`RealEstateAgentSchema`** (`:122`) — sourced from `mia.ts`. No action.
- **`PlaceSchema`** (`:123-130`) — consumes `name`, `intro`, `county`, `latitude`, `longitude`. **Author action:** civic centroid lat/long, 4 decimals.
- **`BreadcrumbSchema`** (`:131-137`) — `Home → Markets → {name}`. No action.
- **`FaqSchema`** (`:320-328`) — 6 entities: synthesized `"What is {name} known for in luxury real estate?"` + 5 `faqs`. **Single `FAQPage` per page** — the visible `Faq` accordion is passed `emitSchema={false}` to avoid duplication; do not flip this.
- **`<title>` / `<meta description>`** — built by `generateMetadata` at `:44-72`. Title: `"{name} Luxury Real Estate | Mia Sanabria"`. Description: first sentence of `aeoAnswer` + Mia tail, clamped to ~158 chars. **Author contract:** first sentence of `aeoAnswer` must read cleanly as a standalone meta description.
- **Canonical + OG image** — auto-built from `SITE.url` + slug + `og-markets/{slug}.jpg`. No action.

---

## 7. "Good enough to publish locally" bar

All exit 0 against the latest `bun run build` output in `out/`: `bun run typecheck`, `bun run lint`, `bun run build`, `bun run audit:all` (chains stale, schema, links, seo, completeness, images, brand, insights, featured-markets, legal, about, hero-contrast, rendered, route-inventory, qa-gate), `bun run audit:images` (placeholder + OG resolve), `bun run audit:no-fabrications`, `bun run audit:stale`, `bun run audit:qa-gate` (`critical = 0`; `high` requires readiness-register classification), `bun run audit:route-inventory`. Run `bun run audit:mobile-readability:capture` only if a visual surface changed — copy-only this cycle; capture if `heroImage` placeholder is regenerated.

---

## 8. Remains blocked (do not attempt this cycle)

Photos (no Mia upload — placeholder JPG only), testimonials (no quote import; only path is `docs/mia-testimonial-capture-plan.md`), language-service claims (`languages: ["English"]` locked), broker reciprocity / MLS feed claims (Bridge scaffold-only), schools / safety / demographics / "best neighborhoods within {city}" (Fair Housing catalog), route slug rename (`/markets/` → `/neighborhoods/` deferred), GHL endpoint wiring (mailto fallback only), homepage Featured Markets pager swap (unchanged), legacy-market retain-vs-redirect (unchanged).

---

*Page-model authored Cycle 25, 2026-05-13. Engineer implementation order per `agent-memos/mission-commander.md` §4. Per-city briefs land in `city-briefs/{slug}.md` before the corresponding `Market` entry is added to `src/lib/markets.ts`.*
