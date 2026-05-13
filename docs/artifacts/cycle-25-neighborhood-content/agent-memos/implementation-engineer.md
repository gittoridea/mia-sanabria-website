# Cycle 25 — Implementation Engineer Memo

**Scope:** Add seven Broward `cluster: "primary"` market pages: Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise. Placeholder heroes rendered by `sharp` from inline SVG; no Mia-licensed photography. No GHL/Dokploy/DNS writes. No Mia-voice additions.

---

## 1. Files to create / change (exhaustive, in apply order)

### a. `scripts/render-images.ts` — extend image generation

Two edits:

1. Append seven entries to the `MARKETS_OG` seed (`{ slug, name, tagline }`, tagline ≤ 90 chars, matches the new `Market.tagline` exactly). The existing OG loop iterates `MARKETS_OG` and writes `public/og-markets/<slug>.jpg` automatically.
2. Add a parallel **1200×1500 portrait hero** render block under the OG block: copy the OG loop, swap dimensions to `1200, 1500`, write to `public/markets/<slug>.jpg`, use a portrait-tuned variant of `renderMarketOgSvg` (name text at y≈600, tagline at y≈770, footer line at y≈1330). Drop the `MAX_BYTES = 100_000` cap on heroes — existing heroes are 238 KB to 600 KB by design.

Run `bun scripts/render-images.ts`. Expect 14 new files (7 hero + 7 OG). Idempotent — re-run overwrites.

### b. `src/lib/mia.ts` — register the seven in the type system

Append to `ALL_MARKET_SLUGS` after `"pompano-beach"`, preserving the `as const` tuple:

```
"deerfield-beach",
"coral-springs",
"plantation",
"weston",
"hollywood",
"davie",
"sunrise",
```

In `MIA_APPROVED_NEIGHBORHOODS`, flip `hasPage: false` → `hasPage: true` for the same seven entries (slug strings already match `ALL_MARKET_SLUGS` exactly).

Do **not** add the seven to `FEATURED_SET` or `HOMEPAGE_FEATURED_ORDER` — the homepage pager is principal-locked (Cycle 16 §1).

### c. `src/lib/markets.ts` — append seven `Market` entries to `MARKETS`

Append in this order (coastal cohort first — shares buyers with Pompano Beach / Lighthouse Point and is easier content surface): **Deerfield Beach, Hollywood, Plantation, Weston, Coral Springs, Davie, Sunrise.**

Each entry MUST conform to the `Market` type (`markets.ts` lines 30-104) with every required field: `slug`, `cluster: "primary"`, `name`, `tagline` (≤ 90 chars, no superlatives), `intro`, `highlights[5]`, `lifestyle`, `priceCharacter`, `latitude`, `longitude`, `heroImage: "/markets/<slug>.jpg"`, `localContext`, `county: "Broward County"`, `aeoAnswer`, `propertyTypes[5]`, `buyerGuidance`, `sellerGuidance`, `faqs[5]`, `internalLinks[3-6]`, `comparisonContext` (recommended, 60-120 words).

**Omit** `miaQuote` (no Mia-voice quote on file for these cities; optional field, also absent on Coral Ridge etc.) and `cardObjectPosition` (default center is fine for placeholder hero art).

**Centroids** (U.S. Census / GNIS, factual — do not invent):

- Deerfield Beach — `26.3184, -80.0998`
- Hollywood — `26.0112, -80.1495`
- Plantation — `26.1275, -80.2331`
- Weston — `26.1003, -80.3997`
- Coral Springs — `26.2710, -80.2706`
- Davie — `26.0628, -80.2331`
- Sunrise — `26.1670, -80.2566`

**`internalLinks` rule:** every target slug must already exist in `MARKETS` at iteration time. Append-order backward links are safe (Deerfield → Pompano/Lighthouse/Fort Lauderdale). A second cross-link pass between the new seven is allowed once all are appended (Hollywood ↔ Davie, Plantation ↔ Sunrise). Unresolved slugs are silently dropped by the `[slug]/page.tsx` resolver, but the build will not compile if the `slug` field fails the `MarketSlug` union.

**Copy honesty contracts (audited against `out/`, not source):**

- Forbidden phrases from `audit-stale-terms`: `luxury concierge`, `white-glove`, `bespoke`, `high-net-worth`, `off-market`, `since 2017`, `within two hours`, `as seen in/on`.
- Forbidden Fair Housing steering: `best/good/safe schools`, `family-friendly`, `kid-friendly`, `bachelor pad`, `safe neighborhood`.
- Forbidden FREC superlatives: `#1 realtor`, `top realtor`, `best realtor`, `guaranteed sale/price`.
- No fabricated population, median price, school ratings, crime stats, or "best places to live" claims (`audit-no-fabrications`).
- No `..` at sentence boundaries (concatenation defect class).
- No language-service claims beyond `MIA.unverified.languages = ["English"]`.

Cohort framing per city (factual, non-steering): Deerfield Beach = beach + Hillsboro Inlet; Hollywood = Broadwalk + A1A; Plantation/Sunrise/Coral Springs = master-planned inland; Weston = Bonaventure / Town Center; Davie = equestrian-overlay + Nova Southeastern University adjacency.

### d. `src/app/page.tsx` — review only

`HOME_FAQ` (line 28) and `HOME_VALUE_PROPS` (line 51) still reference the pre-Cycle-24 "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach" frame and do not match the nine-city `MIA_APPROVED_NEIGHBORHOODS` working set. **Defer to Mia continuity workstream — flag in §Summary, do not auto-edit.**

### e. `src/app/markets/[slug]/page.tsx` — no edits

`generateStaticParams` reads `MARKETS` directly. The V2 component is hard-gated to `slug === "fort-lauderdale"` (line 110); the seven new pages route through the generic template.

### f. `src/app/sitemap.ts` — no edits

Reads `MARKETS` automatically.

### g. `src/components/NeighborhoodsRail.tsx` and `HeroSearch.tsx` — no edits

Both consume `MIA_APPROVED_NEIGHBORHOODS.hasPage` reactively. Flipping in §b changes link target (`/markets/#property-search` → `/markets/<slug>/`) and label suffix (`Search` → `Guide`) with no component change.

---

## 2. Component / data structure rules

- Every new entry MUST satisfy the `Market` type. TypeScript strict + `noUncheckedIndexedAccess` refuses missing or mistyped fields.
- `internalLinks` references only existing slugs at iteration time. Append-order backwards-only linking is safe.
- `latitude`/`longitude` are factual Census/GNIS centroids — used by `PlaceSchema` and consumed in `aeoAnswer`; do not invent.
- `audit-no-fabrications.ts` and `audit-stale-terms.ts` scan `out/`. Comments in source are not scanned; rendered HTML is.
- Hero alt text on `Hero` (`${market.name} luxury real estate`) is non-attributive — safe with placeholder JPGs.

---

## 3. Exact implementation order

1. Edit `scripts/render-images.ts` per §1a. Run `bun scripts/render-images.ts`. Confirm 14 new JPGs on disk.
2. Append the seven slugs to `ALL_MARKET_SLUGS` and flip the seven `hasPage` flags in `src/lib/mia.ts`.
3. Append the seven `Market` entries to `MARKETS` in `src/lib/markets.ts` in the order in §1c. Cross-link `internalLinks` only to slugs already present.
4. `bun run typecheck` → exits 0. Errors here are almost always a missing required field, a `MarketSlug` mismatch in `internalLinks`, or a stray comma.
5. `bun run build` → exits 0. Confirm `out/markets/<slug>/index.html` exists for all seven (23 markets total).
6. `bun run audit:images` standalone → PASS on `images.requiredAssetsExist`, `images.everyMarketCardImagePresent`, `images.everyMarketPageHeroImagePresent`, `images.everyMarketOgImageExists` across all 23.
7. `bun run audit:all` → 0 FAIL. Legal/DMCA WARN carry-over from Cycle 24 acceptable per readiness register.
8. `bun run audit:no-fabrications` → 0 hits.
9. `bun run audit:mobile-readability:capture` against one new page at 320/375/414/768; archive under `docs/artifacts/cycle-25-neighborhood-content/mobile-readability/after/`.

---

## 4. Rollback notes

- Image generation is idempotent — re-run overwrites. Placeholder JPGs ship in `public/markets/` and `public/og-markets/` (not in `.gitignore`; `public/` is checked in).
- Revert = `git revert <commit>`. No DB, no Dokploy, no external state.
- `ALL_MARKET_SLUGS` is a `const` tuple. Appending widens the `MarketSlug` union and is non-breaking. Removing a slug later narrows the union and breaks every back-reference — requires explicit Mia + Torrey approval and a full back-reference sweep before removal.

---

## 5. What this work explicitly does NOT touch

- Bridge IDX runtime (scaffold-only per `src/lib/bridge.ts`).
- GoHighLevel endpoints, Google services, DNS, Dokploy, the live `miasanabriarealtor.com` host.
- Mia's voice — no testimonials, no `miaQuote` on the seven, no language claims beyond English, no MLS reciprocity statement, no school/safety/protected-class language.
- Route slug renames (`/markets/`, `/insights/` stay).
- Branded email, Search Console, Google Business Profile, GA4 property.
- `HOME_FAQ` / `HOME_VALUE_PROPS` copy on `src/app/page.tsx` — flagged for Mia continuity workstream, not edited.
- Cycle 24 legal/DMCA WARN carry-over (left in place per readiness baseline).

---

## Summary

Written: `docs/artifacts/cycle-25-neighborhood-content/agent-memos/implementation-engineer.md`. Defines the contract for seven Broward `primary` market pages — `render-images.ts` extension, `ALL_MARKET_SLUGS` append, `MIA_APPROVED_NEIGHBORHOODS` hasPage flips, seven `Market` entries with cited Census/GNIS centroids. Next handoff: Mission Commander routes Content Writer to draft the seven `Market` entries under §1c constraints, then Engineer applies §3.
