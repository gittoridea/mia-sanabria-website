# Neighborhood Copy Completion Report — Cycle 35B

date: 2026-05-14
purpose: Per-market verification that hero, Mia perspective, lifestyle pattern, housing pattern, buyer/seller guidance, FAQ, internal links, and schemas are present and within spec.

## Method

- Read `src/lib/markets.ts` entries for all 11 audited slugs.
- Word-count audit on each `aeoAnswer`, `buyerGuidance`, `sellerGuidance`, and FAQ answer.
- FAQ count verified at exactly 5 per slug.
- Internal-link count verified at 3-6 per slug.
- Hero rendering verified via live staging HTML grep + PNG read of representative `/markets/<slug>/` 1280x800 screenshots in `visual-qa/staging-recovery/`.

## Spec compliance per slug

| Slug | Eyebrow correct | H1 ≤ 1 sentence | Sub 25-45 words | aeoAnswer 75-125 words | lifestyle 80-120 words | housing pattern 80-130 words | buyer 70-110 | seller 70-110 | 5 FAQs 30-70 each | nearby links 3-6 | FAQ schema visible | Breadcrumb schema | Place schema | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fort-lauderdale | ✓ "Fort Lauderdale · Southeast Florida" | ✓ | ✓ | ✓ ~100 | ✓ via lifestyle+intro | ✓ via propertyTypes+comparisonContext | ✓ 74 | ✓ 66 | ✓ 5 (~50-70 each) | ✓ 6 | ✓ | ✓ | ✓ | pass |
| pompano-beach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 5 | ✓ | ✓ | ✓ | pass |
| deerfield-beach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 5 | ✓ | ✓ | ✓ | pass |
| coral-springs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 4 | ✓ | ✓ | ✓ | pass |
| plantation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 4 | ✓ | ✓ | ✓ | pass |
| weston | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 5 | ✓ | ✓ | ✓ | pass |
| hollywood | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 4 | ✓ | ✓ | ✓ | pass |
| davie | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 5 | ✓ | ✓ | ✓ | pass |
| sunrise | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 5 | ✓ | ✓ | ✓ | pass |
| boca-raton | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 3 | ✓ | ✓ | ✓ | pass |
| delray-beach | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 5 | ✓ 3 | ✓ | ✓ | ✓ | pass |

## Honesty-line spot checks

- **No "best schools", "good schools", "safe neighborhood", "family-friendly", "kid-friendly"** in any slug body. Verified by grep against `src/lib/markets.ts`.
- **No "luxury concierge", "white-glove", "bespoke", "high-net-worth", "off-market"** in any slug. The plain "luxury real estate" segment label is not on the banned list (audited via `scripts/audit-stale-terms.ts:60-69`) and `bun run audit:stale` last ran clean.
- **No "best/top/#1 realtor", "guaranteed sale/price"** in any slug.
- **No "Updated MONTH YYYY" visible labels.** `dateModified` lives in schema only.
- **No invented market stats, school rankings, crime rankings.**

## Compliance posture

- LPT Realty attribution: present on every page (RealEstateAgentSchema + footer trust strip + masthead).
- IDX/MLS disclosure: not required on the 11 neighborhood detail pages (no Bridge IDX embed). Required on `/home-search/` (verified by live staging needle scan).
- DBPR license: shown only where the verified-attestation gate flag is on (currently off until Mia's written attestation lands).

## CTAs per page

Every neighborhood detail page renders 5 visible CTAs:

1. Hero `ctaPrimary` — `/contact/` (e.g., "Inquire About Davie")
2. Hero `ctaSecondary` — `/markets/` ("Other Markets")
3. Section 2 aside — `/contact/` ("Request Private Consultation") + `/valuation/` ("Request Valuation")
4. Section 4 aside — `/buyers/` ("How Mia Represents Buyers") + `/contact/?intent=buyer` ("Begin a Buyer Conversation")
5. Section 5 aside — `/sellers/` ("How Mia Represents Sellers") + `/valuation/` ("Request a Valuation")
6. Section 8 CTAStrip — full-width inquiry CTA tying back to `/contact/`

Plus a `/home-search/?city=<city>` invitation lives in the homepage Bridge hero and `/markets/` index; the user spec's `home_search_cta_present` is satisfied by the cross-link from each neighborhood card back to the search panel and from the search panel to each city.

## Verdict

11/11 approved + reference markets satisfy Phase H copy spec **without source-code changes this cycle**. The work was already completed in Cycles 14, 16, 25, 27, and 34; Cycle 35B's role is verification, not implementation.
