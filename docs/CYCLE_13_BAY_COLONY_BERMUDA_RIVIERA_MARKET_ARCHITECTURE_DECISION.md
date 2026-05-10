# Cycle 13 — Bay Colony + Bermuda Riviera · Market Architecture Decision

**Date:** 2026-05-10
**Decision authority:** Algorithm v6.4.0 OBSERVE/THINK/PLAN (Cycle 13)
**Outcome (one sentence):** Add `bay-colony` and `bermuda-riviera` as **full market entities** (data + route + hero image + OG image + metadata + schema + sitemap + internal links + audit coverage), classify both as Eastern Fort Lauderdale **neighborhood**-cluster markets, and expand `FEATURED_SET` from 6 to 8 to surface them on the homepage.

---

## 1. Current state

| Probe | Finding |
|---|---|
| `bay-colony` in `ALL_MARKET_SLUGS` | absent |
| `bermuda-riviera` in `ALL_MARKET_SLUGS` | absent |
| Featured-only non-route card pattern | does not exist |
| Homepage Featured Markets renderer | `FEATURED_MARKETS.map(getMarket)` — requires slug to exist in `MARKETS` |
| `/markets/` index renderer | partitions all `MARKETS` into `PRIMARY_SLUGS` ∪ `NEIGHBORHOOD_SLUGS` Sets |
| `/markets/[slug]/page.tsx` | calls `MARKETS.map((m) => ({ slug: m.slug }))` in `generateStaticParams` — every Market gets its own route |

**Implication:** there is no escape hatch. A featured market must exist in `MARKETS` and must have its own route.

## 2. Recommended implementation

### 2.1 Market entity classification

| Slug | Cluster | Why |
|---|---|---|
| `bay-colony` | Eastern Fort Lauderdale **neighborhood** | Gated single-entry waterfront enclave accessed off Bayview Drive between Sunrise Boulevard and Oakland Park Boulevard, Eastern Fort Lauderdale. Gated, deepwater-dockage, quiet residential. Sits with Harbor Beach, Las Olas Isles, Seven Isles in the deepwater Eastern-FTL cohort. |
| `bermuda-riviera` | Eastern Fort Lauderdale **neighborhood** | Waterfront residential neighborhood east of Bayview Drive between Oakland Park Blvd and the Coral Ridge Country Club, with deepwater canal homes connecting to the Intracoastal. Reads as adjacent to Coral Ridge in the Eastern-FTL canal cohort. |

Both go in `NEIGHBORHOOD_SLUGS` (the `/markets/` index "Eastern Fort Lauderdale neighborhoods" partition) and both are eligible for the `easternBrowardSlugs` cohort treatment in `[slug]/page.tsx` (drives the "Related Eastern Fort Lauderdale neighborhoods" related-section heading).

### 2.2 Featured Markets — 6 → 8

Current: `fort-lauderdale, las-olas-isles, harbor-beach, victoria-park, boca-raton, delray-beach`.

New: add `bay-colony` and `bermuda-riviera`. Final list (in source-array order, which drives card display order):

1. `fort-lauderdale`
2. `coral-ridge` *(no — keep current)*
3. `victoria-park`
4. `boca-raton`
5. `delray-beach`
6. `las-olas-isles`
7. `harbor-beach`
8. `bay-colony` *(new)*
9. `bermuda-riviera` *(new)*

The `FEATURED_SET` is a `Set<MarketSlug>` filter — display order is governed by `ALL_MARKET_SLUGS.filter(...)` so it follows the source array order. The actual final list is the 6 already in `FEATURED_SET` + 2 new = **8 markets**.

`fort-lauderdale, victoria-park, las-olas-isles, harbor-beach, boca-raton, delray-beach, bay-colony, bermuda-riviera` (in `ALL_MARKET_SLUGS` order after appending the new slugs).

**Visual layout impact:** Homepage `lg:grid-cols-3` → 8 cards = 3 + 3 + 2 rows on desktop, 4 × 2 on `sm:grid-cols-2`, 8 × 1 on mobile. No empty trailing rows on the dominant breakpoints.

### 2.3 Affected files

**Add:**
- `public/markets/bay-colony.jpg` (1200×1500, 4:5 hero, AI-generated via established pipeline)
- `public/markets/bermuda-riviera.jpg` (1200×1500)
- `public/og-markets/bay-colony.jpg` (1200×630, 1.91:1 OG-derived from hero)
- `public/og-markets/bermuda-riviera.jpg` (1200×630)
- `/tmp/mia-genimg/run-cycle13.ts` (image-gen batch script for both markets)

**Modify:**
- `src/lib/mia.ts` — append `bay-colony`, `bermuda-riviera` to `ALL_MARKET_SLUGS`; add both to `FEATURED_SET`.
- `src/lib/markets.ts` — append two new Market objects with full content (intro, highlights, lifestyle, priceCharacter, lat/lng, heroImage, localContext, county, aeoAnswer, propertyTypes, buyerGuidance, sellerGuidance, 5 FAQs, 4 internal links).
- `src/app/markets/page.tsx` — add `bay-colony` + `bermuda-riviera` to `NEIGHBORHOOD_SLUGS`.
- `src/app/markets/[slug]/page.tsx` — add both to `easternBrowardSlugs` for related-heading classification.

**Audit script updates (Phase 6):**
- `scripts/audit-completeness.ts` — `MARKET_PAGES` 13 → 15.
- `scripts/audit-images.ts` — `marketSlugs` 13 → 15; `expectedFeatured` 6 → 8; description string `13 market heroes` → `15 market heroes`.
- `scripts/audit-rendered-visual.ts` — add 2 routes.
- `scripts/audit-hero-pixel-contrast.ts` — add 2 routes (the script samples a route subset, so optional but recommended).
- `scripts/capture-baseline.ts` — add 2 routes.

**Auto-pickup (no edit needed) thanks to dynamic generation:**
- `src/app/sitemap.ts` — derives from `MARKETS.map(...)` ✅
- `src/app/markets/[slug]/page.tsx` `generateStaticParams` — derives from `MARKETS.map(...)` ✅
- Homepage Featured Markets — derives from `FEATURED_MARKETS` ✅

## 3. Content strategy

### Bay Colony — content positioning

- **Geography (verifiable):** Eastern Fort Lauderdale 33305; gated single-entry community on Bay Colony Drive accessed via Bayview Drive; sits between the Coral Ridge Country Club and Sunrise Boulevard; deep-water canal homes with Intracoastal access; residences typically face the canal or sit on cul-de-sacs interior to the gate.
- **Positioning:** trophy-estate gated waterfront; private security; deepwater dockage; one of South Florida's most controlled-access enclaves.
- **Related markets:** `harbor-beach` (peer gated waterfront), `las-olas-isles` (peer deepwater finger isles), `coral-ridge` (geographic neighbor), `fort-lauderdale` (anchor city).
- **Cautions:** do NOT claim specific dollar averages, school ratings, gate-staffing details, or HOA fee figures. Do NOT use family/school steering language. Frame around what a buyer/seller should know (privacy, water access, architectural era, dockage diligence).

### Bermuda Riviera — content positioning

- **Geography (verifiable):** Eastern Fort Lauderdale 33308 / 33304 boundary; waterfront residential neighborhood roughly bounded by Bayview Drive (W), Oakland Park Boulevard (S), the Intracoastal Waterway (E), and the Coral Ridge Country Club (N); known for tree-lined streets, mid-century-modern homes, and deepwater canal residences with Intracoastal access. Convenient to Galt Ocean Mile, Lauderdale-by-the-Sea, and the Bonnet House.
- **Positioning:** waterfront luxury with mid-century-modern architectural heritage; quieter and more residential than Las Olas Isles; family of canal homes with deepwater access; tree-canopy and walkable feel.
- **Related markets:** `coral-ridge` (geographic neighbor and architectural cousin), `harbor-beach` (peer gated waterfront), `las-olas-isles` (peer deepwater isles), `fort-lauderdale` (anchor city).
- **Cautions:** the name "Bermuda Riviera" varies in scope across MLS, neighborhood-association, and city-planning sources — keep prose to the verifiable spine (waterfront, mid-century, deepwater canal access, Eastern Fort Lauderdale, near Galt) and avoid prescribing exact street boundaries.

## 4. SEO / AEO implications

| Surface | Adjustment |
|---|---|
| **Sitemap** | +2 URLs; auto-derived from `MARKETS`. New count: 14 static + 15 markets = **29 URLs**. |
| **JSON-LD `Place` schema** | one per new market page; auto-emitted by `<PlaceSchema>` from market data. |
| **JSON-LD `FAQPage` schema** | one per new market page; auto-emitted by `<Faq emitSchema>`. |
| **`BreadcrumbList`** | auto-emitted via `<BreadcrumbSchema>` on each new page. |
| **Canonical** | `${SITE.url}/markets/<slug>/` — auto-built. |
| **OG / Twitter** | metadata generated from market.aeoAnswer first sentence + Mia voice — same pattern as existing 13. |
| **Internal-link graph** | Bay Colony links from Harbor Beach + Las Olas Isles + Coral Ridge (peer cohort); Bermuda Riviera links from Coral Ridge + Harbor Beach + Las Olas Isles. Reverse links — existing markets gain peer-cohort links to the new markets — DEFERRED to Phase 5 case-by-case (only add reciprocal links where geographically/topically appropriate). |
| **AEO matrix** | `docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md` gets +2 rows. |
| **Market completion scorecard** | `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` gets +2 rows. |

## 5. Audit implications

Every audit script that hardcodes market slugs (Phase 0 §7) must be updated. Net effect: audit:images expects 15 market heroes + 15 OG images; audit:completeness validates 15 market pages; audit:rendered captures 2 new routes.

## 6. Content uncertainty (REVIEW markers)

| Topic | Treatment |
|---|---|
| Bay Colony exact HOA / gate-staffing details | OMIT (no claim) |
| Bermuda Riviera precise street boundaries | OMIT specific boundary streets; use "near", "west of the Intracoastal", "east of Bayview Drive" |
| Median sale price / specific year-over-year stats | OMIT — same pattern as existing 13 markets (priceCharacter is qualitative, not numeric) |
| School quality / family-friendly steering | NOT INCLUDED (Fair Housing) |
| Specific brokerage relationships | NOT CLAIMED at the market level |

If any of these are needed later, add as REVIEW-marker prose with `[Mia Confirm]` per the established `data/` ledger pattern.

## 7. Risk & rollback

- **Risk:** Image generation may produce unsuitable imagery (off-brand, generic, or geographically wrong). **Mitigation:** review each image before commit; regenerate via prompt iteration if needed.
- **Risk:** `nano-banana-pro` model rate-limit or transient failure. **Mitigation:** the existing `run.ts` pattern ran 7 markets in parallel successfully; for 2 markets, sequential re-run is trivial.
- **Risk:** `FEATURED_SET` going from 6 to 8 cards may visually unbalance the homepage at certain breakpoints. **Mitigation:** Phase 7 visual QA captures before/after at 6 viewports; if the 8-card layout reads worse, fall back to 7 (drop one current featured) or stay at 6 + new ones not featured (revisit decision).
- **Rollback path:** Each phase commits to git separately. Reverting 1-2 commits restores Cycle-12 close state. No DNS, GHL, or external-system changes — rollback is local + redeploy.

## 8. Decision

**APPROVED** within the Algorithm OBSERVE/THINK/PLAN gate. Proceeding to Phase 2 (data) → Phase 3 (images) → Phase 4 (featured) → Phase 5 (SEO/schema) → Phase 6 (audits) → Phase 7 (visual QA) → Phase 8 (local verification).

→ **Next phase:** `Phase 2 — Add / upgrade Market Data` (modify `src/lib/markets.ts` + `src/lib/mia.ts`).
