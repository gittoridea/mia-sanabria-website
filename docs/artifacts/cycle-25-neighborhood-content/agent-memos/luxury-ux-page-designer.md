# Luxury UX / Page Designer Memo — Cycle 25 Neighborhood Pages

**Scope:** Seven new approved-neighborhood pages (Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise) on the existing `/markets/[slug]/` template. Audience: $600k–$5M Southeast Florida homeowners and qualified buyers. Tone: local expert + approachable. No new components, no new endpoints, no new tokens.

---

## 1. Reusable page layout

Every new city uses the existing eight-section template in `src/app/markets/[slug]/page.tsx` (the non-FtLaud branch, lines 120–370). No structural changes; we constrain to the Pompano Beach gold-standard shape.

| # | Section | Component | Surface |
|---|---|---|---|
| 0 | Hero (image mode) | `<Hero>` | placeholder JPG, see §7 |
| 1 | AEO answer block — "An honest summary." | inline `<section>` | `cream-50` |
| 2 | Lifestyle 1.4fr / 1fr + Market Brief aside | inline `<section>` | `cream-100` |
| 3 | Property archetypes (3-col card grid) | inline `<section>` | `cream-50` |
| 4 | Buyer guidance + Buyer Next Steps aside | inline `<section>` | `cream-100` |
| 5 | Seller guidance + Seller Next Steps aside | inline `<section>` | `cream-50` |
| 6 | Market FAQ + FaqSchema | `<Faq>` + `<FaqSchema>` | inherits |
| 7 | Related markets w/ `comparisonContext` | `<MarketCard>` grid | `cream-100` |
| 7b | Related Insights (only if any post references the slug) | `<RelatedInsightsModule>` | `cream` |
| 8 | CTA strip | `<CTAStrip>` | navy |

The page renders without modification as soon as the seven `Market` entries are added to `src/lib/markets.ts` with `cluster: "primary"` and the seven OG/hero assets land under `public/markets/` and `public/og-markets/`. The Fort Lauderdale V2 branch (line 110) is untouched.

---

## 2. Per-city design angle

Each city gets one citable, official-source design lever. No school, safety, or family-status claims (CLAUDE.md honesty contracts). Briefs go in `markets.ts` `lifestyle` + `highlights`; this is the *framing* writers should hold.

- **Deerfield Beach** — Atlantic beachfront + Hillsboro Inlet maritime edge; the international Pier (Florida Park) and Quiet Waters Park define the city character.
- **Coral Springs** — master-planned grid laid down by Coral Ridge Properties in 1963; uniform setbacks, a connected parks system, and the Charter Schools / Center for the Arts civic spine.
- **Plantation** — legacy live-oak canopy and the Volunteer Park / Plantation Heritage Park system; central-Broward equidistance between I-95 and the western suburbs.
- **Weston** — Arvida master-planned community incorporated 1996; low-density residential streets, Bonaventure-era roots, Town Center civic hub.
- **Hollywood** — downtown ArtsPark at Young Circle + the 2.5-mile Hollywood Beach Broadwalk; Margaritaville Resort anchor at Johnson Street.
- **Davie** — Town of Davie western-equestrian heritage codified in the Western Theme regulations; Tree City USA designation; low-density agricultural-residential character.
- **Sunrise** — civic and retail spine running Sawgrass Mills → BB&T Center (Florida Panthers) → Sawgrass Corporate Park; Markham Park on the western edge.

Writers must cite municipal sources (city .gov, comprehensive-plan elements, parks department) and avoid superlatives ("best," "top," "premier") per the FREC banned list.

---

## 3. Visual rhythm

The template already alternates cream-50 (sections 1, 3, 5) and cream-100 (sections 2, 4, 7). Keep that breathing pattern — do not invert. Per-section detail:

- **Eyebrow micro-cap** — `font-display text-xs tracking-[0.3em] text-brass-700` for in-section labels (MARKET BRIEF, BUYER NEXT STEPS, SELLER NEXT STEPS) and the numeric counters in §3 (`01`, `02`, …). Section headings use `<SectionHeading>`; do not duplicate.
- **Brass accent rail** — the hero copy panel already uses `border-l-2 border-brass-300` (Hero.tsx line 155). Do not add a second rail on inner sections; the brass dots on `<ul>` highlights (`bg-brass-400`) carry the accent rhythm into §2.
- **Aside-card pattern** — `rounded-sm border border-navy-800/10 bg-cream-{50|100} p-7 shadow-card lg:p-10`. Background alternates with the section background (aside on cream-100 section sits on cream-50, and vice versa). Each aside holds: micro-cap eyebrow → `<h3>` → 1-paragraph prose → primary pill button (navy-800 fill) → secondary pill button (navy-800/30 outline).
- **Card grid** — §3 archetypes use `bg-cream-100` cards on the cream-50 section; §7 uses `<MarketCard>` (image-mode tile) on cream-100. Do not introduce a third card style.

---

## 4. CTAs — exact pairs per surface

All endpoints already exist. **Do not invent endpoints.**

| Surface | Primary | Secondary |
|---|---|---|
| Hero | `/contact/` — `Inquire About {City}` | `/markets/` — `Other Markets` |
| §2 Market Brief aside | `/contact/` — `Request Private Consultation` | `/valuation/` — `Request Valuation` |
| §4 Buyer aside | `/buyers/` — `How Mia Represents Buyers` | `/contact/?intent=buyer` — `Begin a Buyer Conversation` |
| §5 Seller aside | `/sellers/` — `How Mia Represents Sellers` | `/valuation/` — `Request a Valuation` |
| §8 CTA strip | `/contact/` (handled by `<CTAStrip>`) | — |

Hero CTA copy uses the city name verbatim, not "this area" or "this neighborhood."

---

## 5. Mobile considerations (320 / 375 / 414 / 768)

`<Hero>` image-mode (Hero.tsx lines 116–209) is already viewport-tuned through Cycle 9. For these seven pages:

- **320 / 375 / 414** — heading uses `text-[16px]` → `min-[375px]:text-[17px]` → `sm:text-[26px]`, panel padding `p-3 → min-[375px]:p-5 → sm:p-6`. City names *Coral Springs*, *Deerfield Beach*, *Hollywood*, *Plantation*, *Sunrise*, *Davie*, *Weston* all fit single-line at 16px in the `max-w-[27ch]` constraint. No `<wbr>` overrides needed — none of the new cities match the exact `homeHeroHeading` string that triggers the Cycle 9 wbr branch.
- **CTA stacking** — image-mode CTAs are `w-full` then `sm:w-auto` (Hero.tsx line 80). Primary stacks above secondary at 320–639; side-by-side at 640+. Do not override.
- **Neighborhood-rail grid** — `<MarketCard>` aspect `4/5` portrait holds at all widths; §7 grid is `sm:grid-cols-2 lg:grid-cols-3`. At 320–639 the cards single-column at 100% width; 640–1023 they pair; 1024+ they triple. Verified shape via existing Pompano page.
- **Mobile-readability capture** — every page MUST be re-captured at 320 / 375 / 414 / 768 via `bun run audit:mobile-readability:capture` per CLAUDE.md.

**Cycle 24 R2 carry-over (raise before re-capture):** `audit:mobile-readability:capture` hardcodes output to `docs/artifacts/cycle-19A-M/mobile-readability/{before,after}/`. Adding seven cities under cycle-19A-M would silently overwrite Cycle 19A baseline. **Recommendation: add `--outDir=<path>` flag support to the capture script before this cycle's first capture run; default behavior unchanged, but Cycle 25 captures land in `docs/artifacts/cycle-25-neighborhood-content/mobile-readability/{city}/{before,after}/`.** This is a tool-process defect, not a page-design defect — surface to the Mission Commander as a one-line script edit, then proceed.

---

## 6. Continuity with homepage

The seven cities slot cleanly into the existing homepage spine:

- **`<NeighborhoodsRail>`** — driven by `MIA_APPROVED_NEIGHBORHOODS` in `src/lib/mia.ts`. The seven new entries flip from `hasPage: false` to `hasPage: true` once the `Market` records ship; the rail then deep-links to `/markets/<slug>/` instead of anchoring to `/markets/#property-search`. No component change.
- **`<HeroSearch>`** — query-string is inert until Bridge IDX runtime (`src/lib/bridge.ts`). Cycle 25 ships the seven pages without touching the search wiring.
- **`<FeaturedMarketsPager>`** — order is principal-locked via `HOMEPAGE_FEATURED_ORDER`. Cycle 25 should NOT auto-promote the new cities into the homepage pager; they live on `/markets/` index only until Mia explicitly elevates them.

**Defect to flag — `src/app/page.tsx` lines 28–49 (`HOME_FAQ`) and 51–68 (`HOME_VALUE_PROPS`)** still reference "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach." That string is now stale against the Mia-approved-9 Broward service area (Fort Lauderdale, Pompano Beach + the seven Cycle 25 cities). The `<AnswerFirst>` block at line 122 also names Boca/Delray. **Recommendation: defer the homepage copy rewrite to a Mia content review.** Cycle 25 should not rewrite Mia's voice on the home page without her sign-off; flagging this in the Decision Register and shipping the seven city pages on the existing template is the lower-risk move. Mission Commander to confirm.

---

## 7. Placeholder hero image policy

The seven cities have no Mia-licensed photography. Brand-tone placeholders are generated, not photographs. Two assets per city:

- **Portrait hero** — `public/markets/<slug>.jpg`, 1200×1500
- **Open Graph** — `public/og-markets/<slug>.jpg`, 1200×630

**SVG visual contract** (extends the `MARKETS_OG` pattern in `scripts/render-images.ts`):

- **Base** — linear gradient `#0F2A44 → #1D3F66` top-left → bottom-right
- **Glow** — radial `#B89B5E` at 0.22 opacity, centered 50% / 35%
- **Brass hairline** — 120px @ 1px stroke under the eyebrow
- **Eyebrow line** — `MIA SANABRIA` 18px Cinzel letter-spacing 6, brass
- **Sub-eyebrow** — `REALTOR® WITH LPT REALTY` 13px Cinzel letter-spacing 4, cream
- **City name** — 78px Cinzel weight 600 letter-spacing 2, cream-50
- **Tagline (≤ 2 lines wrap @ 52ch)** — 22px Cinzel, cream/gold
- **Footer line** — `BROWARD · SOUTHEAST FLORIDA` 20px letter-spacing 3, brass
- **Footer credit** — `LPT Realty · (954) 540-0358` 15px, cream

**Hard constraints:**

- No photograph imitation, no illustrated buildings, no fabricated landmarks, no map outlines (would imply licensed cartography).
- No banned terms in the SVG text layer. **Existing `render-images.ts` line 85 reads `LUXURY REAL ESTATE CONCIERGE`** — this is adjacent to the "luxury concierge" banned phrase and should be rewritten to `REALTOR® WITH LPT REALTY` when the script is extended for the seven cities. Flag this as the smallest durable fix in the same edit.
- Portrait variant (1200×1500) uses the same SVG with viewBox + element positions rescaled to portrait; no new font or color.
- File size cap: 100,000 bytes per OG (existing `MAX_BYTES` constant). Hero JPG has no cap in the current script — keep it under 200KB to protect mobile LCP.

**Replacement plan:** when Mia licenses photography for any of the seven, the SVG-derived JPG is overwritten by the photograph at the same path; no code change.

---

## Summary

Written `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-25-neighborhood-content/agent-memos/luxury-ux-page-designer.md`. Constrains all seven new city pages to the existing eight-section `[slug]/page.tsx` template, locks per-city design angles to citable municipal facts, fixes exact CTA pairs per section, and defines the SVG placeholder contract by extending `scripts/render-images.ts`. **Unresolved decisions deferred to Mission Commander:** (a) add `--outDir=` flag to `audit:mobile-readability:capture` before capture; (b) defer or schedule homepage `HOME_FAQ` / `HOME_VALUE_PROPS` / `<AnswerFirst>` rewrite to a Mia content review; (c) rename `LUXURY REAL ESTATE CONCIERGE` text in `render-images.ts` to neutral brand line.
