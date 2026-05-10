# Cycle 17 — Fort Lauderdale ICP Review

**Date:** 2026-05-10
**Method:** Read the live V2 page (`src/components/markets/FortLauderdaleV2.tsx`, 475 lines) against the Ultimate Featured Market Page Standard (`docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md`) and against the 7 ICP profiles. Score each ICP profile and each Standard section. Identify the V3 lift.

## ICP profiles scored (Ultimate Standard §"ICP")

For each ICP profile: does the V2 page deliver what this profile most needs in the first 5 minutes?

| # | ICP profile | V2 fit | What V2 handles well | What V2 leaves on the table |
|---|---|:-:|---|---|
| 1 | **Luxury / waterfront buyer** | **PASS** | 6-card decision framework names the exact variables (dockage, seawall, route-to-inlet, lot orientation, era, flood/elevation); 5-step buyer playbook anchors brief-first. | The "insurance + 4-point inspection sequencing" question — the one HNW buyers ask Mia about most — currently lives in FAQ §6, not in the framework. Promotion to a 7th decision-framework card would put it where the eye actually lands. |
| 2 | **Luxury / waterfront seller** | **PASS** | Editorial photography + dock/seawall documentation language in the 5-step seller playbook; comparable-sales right-cohort framing; pre-market discretion language. | Same anti-pattern callout opportunity as buyer side ("This is not the same as a generic luxury listing"). The seller-side aside box reads slightly soft compared to the buyer-side ask. |
| 3 | **Privacy-conscious client** | **PARTIAL** | Buyer playbook step 5 ("Use private conversations for quiet inventory") + Mia's note aside + the four-CTA strip's "Private consultation" + "Private buyer brief" entries. | The hero subcopy doesn't explicitly anchor "private" or "brief" as the dominant frame — opens on `market.intro` which is more general-tourism-friendly than HNWI-private-conversation-friendly. |
| 4 | **Relocation / second-home buyer** | **PARTIAL** | The market identity section covers the structural geography (165 miles of canal, no-fixed-bridge yachting access). | No explicit thread for "if you're coming from out-of-state" — the buyer playbook reads as if the buyer is already local. Adding a single sentence to playbook step 1 ("if you're relocating, the brief specifies the in-person versus remote stage of diligence") would close the gap. |
| 5 | **HNWI / affluent household** | **PARTIAL** | Substantively present — the decision framework speaks the right language. | The Hero H1 (`market.tagline = "Waterfront, city, and beach living in Mia's home market."`) reads slightly soft. HNWI fingerprint of inauthenticity = generic tagline framing. A V3 hero anchor that names the precision of the decision — "Where deepwater yacht access, a working downtown, and a 165-mile canal system meet" — earns the first read. (Note: tagline lives in `market.tagline` data; V3 hero replaces the heading prop, not the data.) |
| 6 | **Cross-comparison shopper** | **PARTIAL** | The market identity §3 paragraph 3 explicitly names the FL vs Boca/PB/Delray distinction (pedigree, country club, Atlantic Avenue, working city). The comparison section's `comparisonContext` prose handles cohort framing. | What's missing is the **decision-grid view**: for each peer market, a one-line "comes up when..." anchor beside the MarketCard. Without it, the buyer has to read the comparison prose to figure out which peer is for whom. |
| 7 | **Serious seller positioning** | **PASS** | The 5-step seller playbook is the right shape; "Position to one buyer profile" forces the seller to pick a story. | Could surface the "no public estimates" framing more explicitly — there's a related Insights post (POST_10 — "Why automated valuations miss luxury waterfront") that should be more prominently cross-linked from the seller playbook section, not just in the related-insights module at the page's end. |

**Net ICP scoring:** 3 PASS · 4 PARTIAL · 0 FAIL.
**Convergence:** V2 is structurally complete; V3 lift is content-quality + 4 surgical additions.

## Ultimate Standard 12-section audit

| Section | V2 status | Gap toward V3 |
|---|:-:|---|
| 1. Premium hero | **PASS** | H1 reads soft for HNWI ICP (see #5 above). Pure-content fix; no architectural change. |
| 2. AEO answer block (75-125 words) | **PASS** | `market.aeoAnswer` is 124 words; first sentence stands alone. Carry forward verbatim. |
| 3. Market identity | **PASS** | Strong. Comparison paragraph could be tightened with the "decision, not a default" anchor. |
| 4. Waterfront / luxury specifics | **PASS** with gap | 6 cards present; missing the insurance + 4-point card (currently buried in FAQ). |
| 5. Buyer section | **PASS** | 5-step playbook + brief-first emphasis. Add anti-pattern callout. Add relocation thread to step 1. |
| 6. Seller section | **PASS** | 5-step playbook + comparable-cohort emphasis. Add anti-pattern callout. Cross-link POST_10. |
| 7. Comparison section | **PASS** with gap | Comparison prose + 3-col MarketCard grid present; missing per-peer "comes up when..." decision-grid line. |
| 8. FAQ section (4-6 items) | **PASS** | 5 (data) + 2 (V2-specific) = 7 items, all FAQPage-schema-emitting. Could grow to 9 with two new V3 items (private brief vs saved-search alert; route-to-inlet for non-yachters). |
| 9. Internal links | **PASS** | Peers + Buyers + Sellers + Valuation + Contact + Insights all present in data + page. |
| 10. SEO/AEO metadata | **PASS** | Title, description, OG, canonical, schema all clean per Cycle 16 audits. |
| 11. Trust / CTA layer | **PASS** | Four-CTA strip + private conversation language honored. |
| 12. Accuracy requirements (HARD) | **PASS** | No invented stats; no school steering; no MLS overclaim; county is `"Broward County"` enforced. |

**Net Standard scoring:** 12 PASS · 0 FAIL · 4 sections with content lift opportunity.

## ICP gap → V3 implementation plan (mapped)

| ICP gap | V3 implementation |
|---|---|
| HNWI hero H1 reads soft | Hero `heading` prop in V3 replaces `market.tagline` with the precision-framed line "Where deepwater yacht access, a working downtown, and a 165-mile canal system meet." `market.tagline` data stays for the markets-index card and OG fallback. |
| Privacy-conscious framing too late in the page | Hero `eyebrow` already names "Fort Lauderdale · The Venice of America"; V3 adds a 2-paragraph **"Why Fort Lauderdale is a decision, not a default"** prelude section between hero and Executive AEO, anchored in the private-conversation framing. |
| Relocation/second-home thread missing in buyer playbook | Buyer playbook step 1 extends with "If the brief crosses a relocation — Northeast, Midwest, or West Coast — the diligence sequence accounts for remote initial conversations and a defined in-person stage." (~1 added sentence) |
| Insurance + 4-point card missing from decision framework | Decision framework grows to **7 cards** — Anchor / ShieldCheck / Compass / Ship / Building2 / FileSearch + **(new) AlertCircle** "Insurance underwriting and the 4-point sequence." |
| Per-peer "comes up when…" anchor missing | Comparison section grows: above each MarketCard, a one-line italic editorial pointer ("Comes up when…"). Sourced from a new `V3_PEER_POINTERS` const inside the V2 component file. |
| Buyer/seller anti-pattern callout missing | A small `<aside className="...">` at the end of each playbook reading: "What this is not. The brief is not a saved-search alert; it is a written priority hierarchy. Saved-search alerts surface listings; a brief surfaces decisions." |
| FAQ count below ideal | Extend V2's `FORT_LAUDERDALE_V2_FAQS` (currently 2) to **4 items**, total page FAQ to 9 (market.faqs 5 + new 4). New items: (a) Private brief vs saved-search alert; (b) Route-to-inlet for non-yachters; (c) [keep existing] Eastern FL vs Broward; (d) [keep existing] Flood-zone + insurance. |
| Seller playbook should cross-link POST_10 | Inside seller playbook step 1, after "Current comparable sales drawn from the right cohort", inline link to `/insights/why-automated-valuations-miss-luxury-waterfront/` with a 5-word link label. |

## What V3 does NOT change

| Item | Reason |
|---|---|
| Component filename + export | Stays `FortLauderdaleV2.tsx` + `FortLauderdaleV2Page` → no `[slug]/page.tsx` churn; the rollout template stays stable for Boca/Palm Beach/Delray V2 work. |
| `market.tagline` data field | Used by markets-index card and OG image fallback; no churn. V3 overrides only at the hero render site. |
| `market.aeoAnswer` | 124 words, snippet-able, carry forward verbatim. |
| Section count (visible groupings) | 10 → **11** (one new prelude). Sub-modules inside existing sections grow but the visible section count moves only by one. |
| Schema emissions | `RealEstateAgentSchema` + `PlaceSchema` + `BreadcrumbSchema` + `FaqSchema` continue. |
| Footer + header + navigation | Untouched. |
| 4-CTA strip | Strong; unchanged. |
| Color/font system | Per principal lock: no new colors, no new fonts, no glassmorphism. |

## Verdict

**Score:** PARTIAL — V2 is structurally complete; V3 is a content + anchor lift, not a rebuild.

**Recommended action:** Option B from CYCLE_17_DECISION_REGISTER.md Card 4 — content + layout modules + audit/scorecard, edited in-place on `FortLauderdaleV2.tsx`.

**Estimated lift:**
- 1 hero `heading` prop override (overrides `market.tagline` at render only).
- 1 new prelude section (~2 paragraphs).
- 1 new card added to the existing 6-card decision framework grid.
- 1 new sub-module inside the existing comparison section (per-peer "comes up when…" lines).
- 1 new anti-pattern aside inside each playbook (2 asides).
- 2 new FAQ items appended to `FORT_LAUDERDALE_V2_FAQS`.
- 1 inline link inside seller playbook step 1.
- 1 new `audit:fort-lauderdale-v3` script.

Phase 4 implementation follows this list literally.
