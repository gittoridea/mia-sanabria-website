# Cycle 17 — Decision Register

**Date:** 2026-05-10
**Cycle:** 17 — Blog Label Cleanup + FL V3 + Trust Logos + Production-Readiness
**Format:** four decision cards. Each card states the question, current state, options, recommendation, rationale, and binding effect.

---

## Card 1 — Blog visible date label

### Question

The Cycle 16 governance settled on `Evergreen Brief · <Month>` as the visible label on Insights cards and article headers. Principal feedback this cycle: the phrase reads as artificial. What replaces it?

### Current state

- 12 `editorialMonthLabel` strings in `src/data/insights/*.ts` of the form `"Evergreen Brief · <Month>"`.
- 3 JSDoc comments in `src/lib/insights.ts` referencing the old label.
- 1 JSDoc comment in `src/components/insights/InsightCard.tsx`.
- Schema-side `datePublished` stays honest at `2026-05-10`; visible label is purely editorial.

### Options

| Option | Visible card label | Article header label | Tradeoffs |
|---|---|---|---|
| **A — Market Note · `<Month>`** | `Market Note · May` | `Insights · Market Note · May` | Editorial-luxury fit; "note" implies considered short-form writing; pairs with `Market Brief` CTA language already on site. **No "evergreen" mention.** |
| **B — Waterfront Brief · `<Month>`** | `Waterfront Brief · May` | `Insights · Waterfront Brief · May` | Strong topical anchor; risks being narrow on posts that aren't strictly waterfront (e.g. Boca Raton country-club post 8 isn't a waterfront brief). |
| **C — Updated `<Month YYYY>`** | `Updated May 2026` | `Updated May 2026` | Maximally honest; reads as a maintenance signal more than an editorial signal; loses the "library" feeling Cycle 15 built. |
| **D — No visible month on cards; article pages keep `Updated <Month YYYY>`** | (no editorial label) | `Updated May 2026` (existing secondary line stays) | Cleanest; visually quieter; surfaces title + excerpt as the primary read; aligns with the "read in any order" library framing already on the index page. |

### Recommendation — **Option A (Market Note · `<Month>`)** + adopt **Option D**'s "Updated `<Month YYYY>`" as the secondary line on article pages

**Card label:** `Market Note · <Month>` — replaces `Evergreen Brief · <Month>` in `editorialMonthLabel`.
**Article hero eyebrow:** `Insights · Market Note · <Month>`.
**Article body secondary line:** unchanged from Cycle 16 — `Updated <Month YYYY>` from `dateModified`.

### Rationale

1. **Editorial seriousness without overclaiming frequency.** "Market Note" reads like the editorial deliveries Mia's ICP actually values (Christie's notes, Sotheby's market reports). It does NOT promise a cadence (vs "monthly brief" which would).
2. **Voice consistency.** "Brief" is already the canonical CTA word ("Begin a private buyer brief", "Submit a private brief"). "Note" is a sibling — short-form editorial, parallel rather than colliding.
3. **Topic-agnostic.** Each of the 12 posts can be a Market Note — buyer-guide, market-comparison, valuation, positioning. "Waterfront Brief" would mis-frame three or four of them.
4. **No "evergreen" disclosure visible to the reader.** The library's evergreen architecture is real and is correctly captured in `datePublished` honesty and schema; it does not need to be advertised in plain reader-facing prose.
5. **Lowest churn.** Single-token change in the data files: `Evergreen Brief` → `Market Note`. Audit can permanently reject the old phrase.

### Anti-options surfaced but rejected

- "Market Update" — implies recency / breaking news; the briefs are evergreen.
- "Editorial · `<Month>`" — too generic; "Editorial" without a noun reads incomplete.
- "Mia's Note · `<Month>`" — possessive framing is too personal for the library framing; "From the desk of" energy.

### Binding effect (Phase 2)

- 12 `editorialMonthLabel` fields rewritten: `"Evergreen Brief · January"` → `"Market Note · January"`, etc.
- 4 JSDoc comments updated to reference the new phrase.
- `audit:insights` extended with a banned-phrase rule that fails on any visible `Evergreen Brief` in the body / metadata / labels.
- Built output grep returns 0 for `Evergreen Brief` after Phase 10 verification.

---

## Card 2 — Footer Equal Housing Opportunity (EHO) logo source

### Question

The Cycle 16 EHO asset is an SVG-rendered HUD-style house silhouette + equal sign, rasterized to a 512×512 black-on-transparent PNG, then inverted to white via the footer's `brightness-0 invert opacity-90` filter chain. Principal still reports the trust marks as visually wrong. Which source for the production-ready EHO?

### Current state

- `public/logos/equal-housing.png` — 512×512 RGBA, Cycle 16 SVG-derived silhouette.
- Rendered at `h-10 w-10` in `SiteFooter.tsx` trust strip on navy.
- Visible label `Equal Housing Opportunity` (text `<span>`) sits adjacent.

### Options

| Option | Source | License posture | Tradeoffs |
|---|---|---|---|
| **A — NAR EHO download** | `https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo` | NAR-member-context distribution of the canonical HUD mark | Need to extract from the page; principal-mission prompt prefers `equalhousinglogo.com` per explicit naming. |
| **B — equalhousinglogo.com white asset (principal-named)** | `https://equalhousinglogo.com/wp-content/uploads/2019/03/equal-housing-logowhite-1000.png` | Third-party-curated public-domain HUD mark (white-on-transparent variant) | Direct white-on-transparent — no filter chain needed; principal-explicitly-named source; 1000×1000 native. |
| **C — Text-only EHO treatment, icon hidden pending legal review** | (no image) | Most conservative; loses visual signal | Drops a visible trust marker. Not recommended unless principal/legal blocks the icon. |

### Recommendation — **Option B (equalhousinglogo.com white asset)**

**File:** `public/logos/equal-housing.png` replaced with the 1000×1000 white-on-transparent PNG downloaded from `equalhousinglogo.com`.
**Filter chain in footer:** REMOVE `brightness-0 invert opacity-90` for this asset — the source is already white-on-transparent, so the inversion step would turn the visible glyph black. Replace with `opacity-90` only (matches the LPT visual cadence).

### Rationale

1. **Explicit principal direction.** Mission prompt: "Use a white EHO asset from `https://equalhousinglogo.com/` if visually correct and documented as third-party/principal-requested."
2. **No rendering uncertainty.** The asset arrives already in the target visual state. No SVG-rasterization-then-invert chain to break under future filter changes.
3. **Public-domain HUD mark.** The Equal Housing Opportunity mark is in the public domain when used to indicate Fair Housing compliance by a brokerage. equalhousinglogo.com is a curated third-party redistribution of that public-domain asset.
4. **Cleaner alt + label semantics.** Adjacent `<span>Equal Housing Opportunity</span>` already supplies the wordmark; the icon stays icon-only, which the white asset gives us natively (vs. the Cycle 11 file which had wordmark embedded in the icon).

### Provenance documentation

A note in `scripts/download-trust-logos.ts` (Phase 5) and in the Phase 5 doc records:
- Source URL.
- Date downloaded.
- License classification: "public-domain HUD Equal Housing Opportunity mark; redistribution via equalhousinglogo.com per principal direction; suitable for brokerage Fair-Housing-compliance signaling."

### REVIEW gates carried (not blocking Cycle 17 staging deploy)

- **Principal-legal-counsel sign-off** for `.com` cutover. The redistribution source is third-party; the mark itself is public-domain HUD; the specific rendition's compliance with HUD style guidelines remains the principal/legal final-read item.

### Binding effect (Phase 5)

- Download asset to `public/logos/equal-housing.png` (overwrites Cycle 16 SVG rendition).
- Update `SiteFooter.tsx` filter for this specific asset only: drop the inversion; preserve the `opacity-90` for visual cohesion with LPT's white circle.
- Keep alt text `"Equal Housing Opportunity"` and the adjacent `<span>` label.

---

## Card 3 — Footer REALTOR® logo source

### Question

The Cycle 16 REALTOR® R-mark is also an SVG-derived rendition (single-color black-on-transparent + monochrome filter). Principal still reports it as wrong. Which source?

### Current state

- `public/logos/realtor-r.png` — 512×512 RGBA, Cycle 16 SVG-derived R-only mark.
- Rendered at `h-10 w-10` under the same `brightness-0 invert opacity-90` filter chain.

### Options

| Option | Source | License posture | Tradeoffs |
|---|---|---|---|
| **A — NAR official transparent/reversed REALTOR® PNG** | `https://www.nar.realtor/sites/default/files/2025-07/nar_membershipmark_white.png` | NAR member-permitted; NAR Membership Marks Manual governs use | Public download, no member login required per webpage inspection. White-on-transparent variant. |
| **B — Generated silhouette based on current mark, kept as REVIEW** | Cycle 16 SVG rendition retained | Self-rendered; not NAR-canonical | Principal already rejects this on visual grounds. |
| **C — Text-only REALTOR® treatment until official use confirmed** | (no image) | Most conservative | Drops a visible trust marker; we lose the NAR membership signal entirely. |

### Recommendation — **Option A (NAR official transparent/reversed REALTOR® PNG)**

**File:** `public/logos/realtor-r.png` replaced with the official NAR transparent/reversed PNG downloaded from the NAR Logos & Trademark Rules page.
**Filter chain in footer:** REMOVE `brightness-0 invert opacity-90` for this asset — the source is already white-on-transparent. Replace with `opacity-90` only.

### Rationale

1. **NAR-canonical source.** The asset is downloaded directly from the National Association of REALTORS® public-access logo distribution page. No member login required (confirmed by inspecting the download page metadata).
2. **NAR Membership Marks Manual coverage.** The NAR REALTOR® mark is licensed to NAR members for use indicating REALTOR® status. PUBLIC_FACT_LEDGER §2 cites Mia's NAR member status (LPT/Realtor.com/Klein Morgan legacy pages reference); the REVIEW gate before `.com` cutover remains principal-legal verification of active NAR membership.
3. **No MLS overclaim.** The NAR `nar_membershipmark_white.png` is the R-block + REALTOR® wordmark; it does **not** carry the MLS wordmark that the original `realtor-r.png` (pre-Cycle-16) inadvertently included. The Cycle 14 OFFICIAL_GRAPHICS_REVIEW concern is resolved at the source.
4. **Lower rendering uncertainty.** Same reasoning as EHO: the asset arrives in target visual state; no filter chain dependency to break.

### Provenance documentation

`scripts/download-trust-logos.ts` (Phase 5) records:
- Source URL.
- Download date.
- License classification: "NAR REALTOR® membership mark; member-permitted use per NAR Membership Marks Manual."

### REVIEW gates carried (not blocking Cycle 17 staging deploy)

- **Principal-legal-counsel sign-off** for `.com` cutover — confirm Mia's active NAR membership (currently PUBLIC_FACT_LEDGER §2 candidate; DBPR + NAR primary-source confirmation pending).
- **NAR Membership Marks Manual rendition compliance** — minimum sizing, clearspace, color treatment. The downloaded asset is the canonical NAR file so the rendition complies by construction; the live footer treatment (40×40 at navy background) is the specific deployment that principal/legal should sign off on.

### Binding effect (Phase 5)

- Download asset to `public/logos/realtor-r.png` (overwrites Cycle 16 SVG rendition).
- Update `SiteFooter.tsx` filter for this specific asset only: drop the inversion; preserve the `opacity-90`.
- Keep alt text `"REALTOR®"` and the adjacent `<span>` label.

---

## Card 4 — Fort Lauderdale V3 scope

### Question

The Cycle 16 V2 page at `src/components/markets/FortLauderdaleV2.tsx` ships 10 sections, AEO answer, decision framework, related insights, FAQ, four-CTA strip. Principal's Cycle 17 ask: "Review, refine, and deeply improve the Fort Lauderdale market page so it delivers what Mia's ICP most wants from that page." What is the V3 scope?

### Current V2 audit against the Ultimate Featured Market Page Standard

| Section | V2 status | Gap toward ideal V3 |
|---|---|---|
| Hero (image-mode + V2 eyebrow) | shipped | H1 reads slightly soft; missing explicit anchor for the "private brief" framing on the first paint above the fold. |
| Executive AEO answer | shipped (124 words) | Strong. Carry forward. |
| Market identity (3 paragraphs) | shipped | Comparison paragraph (FtL vs Boca/PB/Delray) reads well; could add a tighter "what makes Fort Lauderdale a decision, not a default" frame. |
| Waterfront decision framework (6 cards) | shipped (Anchor / ShieldCheck / Compass / Ship / Building2 / FileSearch) | Strong substantively. Could surface a more specific seventh consideration around **insurance + 4-point inspection sequencing** — this is the single decision HNW buyers ask Mia about most often per principal context, and currently lives in the FAQ. |
| Neighborhood comparison module | shipped (3-col MarketCard grid + comparisonContext prose) | The prose paragraph is good; what's missing is a **decision-grid view** — for each peer market, a one-line "comes up when…" pointer. |
| Buyer playbook (5-step) | shipped | Strong. Could add an explicit **"What this is NOT"** anti-pattern callout (e.g. "Not the same as scrolling Zillow with a saved search") — keeps the page editorial vs. lead-gen. |
| Seller playbook (5-step) | shipped | Strong. Same anti-pattern callout opportunity. |
| Related Insights | shipped via `RelatedInsightsModule` | Good — data-driven. |
| FAQ (5 from data + 2 V2-specific) | shipped, FAQPage schema emits | Could grow to 7-8 by adding: **"How is a private buyer brief actually different from a saved-search alert?"**, **"Why does the route-to-inlet matter for a buyer who isn't a serious yachter?"**. |
| Four-CTA strip | shipped (Private consultation / Confidential valuation / Private buyer brief / Waterfront review) | Strong; the four buckets cover the actual intent funnel. Keep. |

### ICP refinement (per Cycle 17 mission and Ultimate Standard)

The page is read by 7 ICP profiles per Ultimate Standard §"ICP". V2 covers most of them. V3 sharpens for:
- **HNWI / affluent household** (recognize language inauthenticity instantly) — V2 reads slightly soft in the hero; V3 hardens H1 and adds an explicit pedigree/precision anchor.
- **Cross-comparison shopper** — V2 has comparison prose; V3 adds the decision-grid view of peer markets.
- **Privacy-conscious client** — V2 mentions private brief; V3 makes the private-conversation framing more explicit, including in the buyer/seller playbook callouts.
- **Relocation/second-home buyer** — V2 covers the lifestyle anchor; V3 adds an explicit "if you're coming from out-of-state" thread woven into buyer-playbook step 1.

### Options

| Option | Scope | Tradeoffs |
|---|---|---|
| **A — Content-only improvement** | Edit `FortLauderdaleV2.tsx` in place; tighten H1 / add insurance card / add anti-pattern callout / extend FAQ to 8 / extend comparison prose with decision-grid | Lowest churn; preserves the V2 file as the rollout template for other featured markets; lowest visual/regression risk. |
| **B — Content + layout modules + audit/scorecard** | A plus: add a new "Why Fort Lauderdale is a decision, not a default" prelude section between hero and Executive AEO; add a peer-market decision-grid as a layout module; add `audit:fort-lauderdale-v3` enforcing the new section count | Mid churn; adds one new section; carries a per-page audit; layout still feels evolutionary not revolutionary. |
| **C — Full V3 gold-standard rebuild** | New `FortLauderdaleV3.tsx` file; full redesign with hero, executive answer, prelude, decision framework with 7 cards, decision-grid peer comparison, buyer playbook + anti-pattern callout, seller playbook + anti-pattern callout, expanded FAQ to 8, four-CTA strip; new `audit:fort-lauderdale-v3` | High churn; risks regression in adjacent markets that haven't moved to the new template yet; one-cycle build of a new file. |

### Recommendation — **Option B (Content + layout modules + audit/scorecard)**

**Rationale path:** the V2 file is structurally sound; the deficit is content quality, not architecture. Option B keeps the rollout template stable for Boca Raton V2 / Palm Beach V2 / Delray Beach V2 work, while making the substantive V3 improvements the principal asked for. Option C re-litigates Cycle 16's rollout-template decision; Option A leaves opportunity on the table.

**Implementation pattern:**
- Edit `src/components/markets/FortLauderdaleV2.tsx` in place (rename internally / keep export name stable to avoid `[slug]/page.tsx` churn).
- Add one new section: "Why Fort Lauderdale is a decision, not a default" — 2 short paragraphs between hero and Executive AEO.
- Add 1 new card to the decision framework (insurance + 4-point sequencing) — now 7 cards in `lg:grid-cols-3` grid (becomes a 3-3-1 layout; or rebalance to `sm:grid-cols-2 lg:grid-cols-4` for 7 cards as 4-3 — visual call during build).
- Add the peer-market decision-grid module — for each peer in `market.internalLinks`, a one-line "comes up when…" beside the MarketCard.
- Add a small anti-pattern callout at the bottom of each playbook ("What this is not.") — 1-2 sentences each.
- Extend `FORT_LAUDERDALE_V2_FAQS` from 2 to 4 items (`market.faqs` still contributes 5, total = 9 — within editorial budget).
- Add `audit:fort-lauderdale-v3` script that grep-verifies the new prelude section heading, 7-card framework, decision-grid markers, anti-pattern callouts, and 9 FAQ items in built HTML.

### Binding effect (Phase 4)

- Component file remains `FortLauderdaleV2.tsx`; export name `FortLauderdaleV2Page` unchanged (so `[slug]/page.tsx` doesn't need an update).
- Internal section count grows from 10 → 11 (one new prelude section).
- Decision framework grows from 6 → 7 cards.
- New decision-grid mini-layout inside the existing comparison section (no new section).
- FAQ grows from 7 to 9.
- New `scripts/audit-fort-lauderdale-v3.ts` registered as `audit:fort-lauderdale-v3`; wired into `audit:all` after the existing `audit:featured-markets` gate.

### Anti-pattern guarded

- Not creating a parallel `FortLauderdaleV3.tsx` file (no name churn; no second template to maintain).
- Not regressing the rollout pattern for Boca/Palm Beach/Delray V2 work.
- Not adding new colors / fonts / glassmorphism / accent treatments.
- Not fabricating market statistics or rankings.

---

## Cross-card constraints applied

Every card honors the Cycle 17 mission boundaries:
- No GHL writes, no TCPA claims, no DNS / `.com` / Cloudflare / GHL production modification.
- No Payload/Postgres install; no CMS migration; no lead-magnet build.
- Legal page copy untouched except low-risk metadata/link/email corrections.
- No fabricated credentials, license details, MLS membership, awards, reviews, sales volume, languages, testimonials, or market statistics.
- No new colors / fonts; no glassmorphism.
- Boca / Palm Beach / Delray correctly attributed to Palm Beach County.
- No `.com` launch-ready claim while blockers remain.

## Approval status

Decisions are **operator-recommended for autonomous execution under Cycle 17 max-effort instruction.** Cycle 17 mission prompt explicitly permits the implementation paths recommended (label change, EHO source from `equalhousinglogo.com`, REALTOR® source from NAR official, FL page deep improvement). Decisions are recorded in this register for audit; live `## Decisions` entries in the project ISA follow at each phase transition.
