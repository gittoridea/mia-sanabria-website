# Neighborhood Model Report — Cycle 35B

date: 2026-05-14
purpose: Prove the existing `Market` shape in `src/lib/markets.ts` satisfies every Phase G required capability without introducing parallel types (avoid churn per user rule).

## Required-capabilities ⇄ existing-model mapping

| Required field | Existing source | Notes |
|---|---|---|
| `slug` | `Market.slug: MarketSlug` (`src/lib/markets.ts:22`) | Cycle 14 helper `getMarketRoute(slug)` |
| `name` | `Market.name: string` | rendered in Hero eyebrow + Place schema |
| `status` (approved/reference/future) | `MIA_APPROVED_NEIGHBORHOODS` in `src/lib/mia.ts:174-187` (approved set, `hasPage` flag) + `MarketCluster: "primary" \| "neighborhood" \| "northern-broward-waterfront"` for taxonomy | Cycle 25 expansion already typed; "reference" markets are those present in `MARKETS` but absent from `MIA_APPROVED_NEIGHBORHOODS` |
| seo title | `app/markets/[slug]/page.tsx:52` — `\`${market.name} Luxury Real Estate \| Mia Sanabria\`` | uniform across slugs |
| seo description | `buildMetaDescription(market)` (`page.tsx:33-42`) — first AEO sentence clamped to ≤158 chars + Mia voice tail | 140-160 char target |
| hero heading | `Market.tagline` (rendered as Hero `heading` prop) | one-sentence tagline per slug |
| hero subheading | `Market.intro` (rendered as Hero `sub` prop) | |
| hero image | `Market.heroImage: string` (path `/markets/<slug>.jpg`) | Cycle 14 helper `getMarketImagePath(slug)` |
| hero alt | `\`${market.name} luxury real estate\`` (`page.tsx:147`) | uniform alt |
| hero provenance | repo-existing-approved (photographic for fort-lauderdale, pompano-beach, boca-raton, delray-beach; brand-tone placeholder for the seven Cycle 25 Broward cities — see `image-manifest.md`) | not encoded as a typed enum; encoded by repo convention + mia.ts comment |
| quick facts | `Market.highlights: ReadonlyArray<string>` + `Market.priceCharacter` + `Market.propertyTypes` | 5 highlights per market |
| Mia perspective | `Market.miaQuote?: string` (Fort Lauderdale-tier) + `Market.aeoAnswer: string` (all markets, 75-125 words) | aside "Considering ${name}?" + Section 1 AEO answer |
| lifestyle pattern | `Market.lifestyle: string` + `Market.localContext: string` | rendered Section 2 |
| housing/property pattern | `Market.propertyTypes: ReadonlyArray<string>` (3-5) + `Market.comparisonContext?: string` | rendered Section 3 |
| buyer guidance | `Market.buyerGuidance: string` (60-100 words) | rendered Section 4 with CTA aside |
| seller guidance | `Market.sellerGuidance: string` (60-100 words) | rendered Section 5 with CTA aside |
| search CTA | Hero `ctaPrimary` + Section 2 aside `Request Private Consultation` + Section 4 aside `Begin a Buyer Conversation` + Section 5 aside `Request a Valuation` + Section 8 CTAStrip | five visible CTAs per page |
| nearby internal links | `Market.internalLinks: ReadonlyArray<MarketInternalLink>` (2-6 with `{slug, label}`) | rendered Section 7 `MarketCard` grid |
| FAQ | `Market.faqs: ReadonlyArray<MarketFaq>` (exactly 5, 30-80 words per answer) | rendered Section 6 visible accordion |
| FAQ schema | `<FaqSchema items={[{question: \`What is ${name} known for in luxury real estate?\`, answer: market.aeoAnswer}, ...market.faqs]}/>` (`page.tsx:320-328`) | single FAQPage entity per page; unifies AEO + FAQ |
| breadcrumb schema | `<BreadcrumbSchema items=[Home, Markets, name]/>` (`page.tsx:131-137`) | |
| place schema | `<PlaceSchema name/description/region/county/lat/lon/>` (`page.tsx:123-130`) | factual; no demographics |
| real-estate-agent schema | `<RealEstateAgentSchema/>` (`page.tsx:122`) | reads from `MIA` in `src/lib/mia.ts` |
| compliance / source notes | factual content sourced from `Market.localContext` + `Market.miaQuote` + `Market.aeoAnswer`; PUBLIC_FACT_LEDGER v2 referenced in `mia.ts:1-5` docstring; IDX/MLS disclosure rendered only where Bridge IDX is embedded (home-search + future Bridge pages), so neighborhood detail pages do not require an IDX disclosure block | see `neighborhood-source-ledger.md` |

## Decision: do not introduce parallel `NeighborhoodStatus` / `ImageProvenance` / `SourceType` types

The user-required Phase G capability list is satisfied by the existing shape and rendering. Introducing parallel enums would:

- Duplicate information already carried in `MIA_APPROVED_NEIGHBORHOODS` (status) and the repo convention `public/markets/<slug>.jpg → existing-approved` (provenance).
- Create churn the user explicitly warned against ("If the existing canonical model already satisfies the required shape, prove it with a field mapping artifact and avoid churn").
- Risk drift: a typed `ImageProvenance` enum that isn't validated against actual file contents adds maintenance cost without preventing a bad image swap. A separate `image-manifest.md` artifact is the better invariant carrier and is shipped this cycle.

## What is *not* in the current model and is correctly **operator-needed**, not AI-closeable

- Mia-supplied licensed photographic hero images for the seven Cycle 25 Broward cities (deerfield-beach, coral-springs, plantation, weston, hollywood, davie, sunrise). The brand-tone placeholder cards rendered in the existing JPGs are deliberate, brand-consistent, and not a defect.
- DBPR-verified license-number written attestation (currently `unverified.licenseNumber` in `mia.ts:54`). Site components gate visible display on a separate verified flag.
- Mia-confirmed years-licensed / display-office strings (`mia.ts:57-58`, both null).
- Mia retain/redirect/deprecate decision for legacy Palm Beach County reference markets (boca-raton, delray-beach) outside her canonical Broward working set.

## Verdict

`src/lib/markets.ts` and `src/app/markets/[slug]/page.tsx` are **fit for purpose at staging**. No model enhancement is required for Cycle 35B closure. The canonical neighborhood model is proven complete.
