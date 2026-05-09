=== AUDIT_START ===
# Lane 8 — SEO / AEO Strategic Layer — Cycle 6 Findings

## Finding 1 — Add machine-readable Q&A for each AnswerFirst block
- **Severity:** medium
- **Page/Component:** [src/components/AnswerFirst.tsx](/home/torrey/code/mia-sanabria-website/src/components/AnswerFirst.tsx) (used by [src/app/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/page.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx))
- **Observation:** The 5 Cycle-5 AnswerFirst blocks are rendered as static `<h2> + paragraph` content only, while only `Faq` emits FAQPage JSON-LD. This misses an extra high-confidence extraction vector for AI citations on query-shaped Q&As.
- **Recommended fix:** Add optional `emitSchema` support to `AnswerFirst` and render a `FaqSchema` payload (Question + acceptedAnswer) from each block, with stable IDs and plain-answer strings.
- **Validation:** Add an audit check that each `/buyers/`, `/sellers/`, `/valuation/`, `/about/`, `/` has at least one explicit FAQPage entity tied to the AnswerFirst question.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant style pages consistently pair Q&A copy with machine-readable FAQ schema so high-intent queries pull direct extracts.

## Finding 2 — Tighten AnswerFirst question/answer phrasing for direct AI extraction
- **Severity:** low
- **Page/Component:** [src/app/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/page.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** Several prompts are brand-forward and long-form before answering (multiple clause chains), which can reduce confidence when citation bots prefer an immediate direct answer sentence first.
- **Recommended fix:** Keep each `question` verbatim and concise (query-like), then lead each `answer` with one direct answer sentence before supporting context (2nd sentence max), reducing adverbial framing inside the first 25–40 words.
- **Validation:** Run a query-to-answer smoke test for the five prompt patterns and score first-answer clarity + parseability by a simple extraction script.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group’s FAQ-style editorial rhythm shows cleaner first-sentence answerability for luxury-intent queries.

## Finding 3 — Complete schema saturation on service pages with person/business continuity
- **Severity:** medium
- **Page/Component:** [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** These pages currently emit `ServiceSchema`, `OfferCatalogSchema`, `RealEstateAgentSchema`, `FaqSchema`, `BreadcrumbSchema`, but omit `PersonSchema` and/or `LocalBusiness` on the primary service surfaces, creating weaker identity graph continuity than other pages.
- **Recommended fix:** Add `PersonSchema` consistently across service pages (or introduce explicit service-surface provider schema linking to the same IDs already used in layout/other pages) and add `LocalBusiness` where factual business-entity context is relevant.
- **Validation:** Extend schema audit to assert service routes include `Person`, `Service`, `FAQPage`, and one of `RealEstateAgent`/`LocalBusiness`.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes’ service pages show tighter provider graph alignment between person, agency, service, and FAQ entities.

## Finding 4 — Preserve county truth in Place schema for market pages
- **Severity:** medium
- **Page/Component:** [src/components/schema/PlaceSchema.tsx](/home/torrey/code/mia-sanabria-website/src/components/schema/PlaceSchema.tsx), [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts)
- **Observation:** Market data defines `county` (`Broward County` or `Palm Beach County`), but `PlaceSchema` currently does not emit that county in address payload; `addressRegion` is only `FL` and contained area is also Florida-level. This under-specifies local intent for place-disambiguation.
- **Recommended fix:** Thread `Market.county` into `PlaceSchema` and emit county in `address` and `containedInPlace` so `/boca-raton` and `/delray-beach` pages carry explicit jurisdiction context.
- **Validation:** Parse rendered JSON-LD and confirm `Palm Beach County` appears on both Boca/Delray place entities and `Broward County` on city/neighborhood entities that require it.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s editorial/property hubs are more explicit about locality in structured data and outperform ambiguous region-only entity blocks.

## Finding 5 — Unverified license number is still rendered in public trust surfaces
- **Severity:** high
- **Page/Component:** [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx), [src/app/terms/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/terms/page.tsx)
- **Observation:** `licenseNumber` remains populated and is printed in footer + terms. This intersects the open principal decision and is an unverified public credential surface in production-state copy.
- **Recommended fix:** Keep `licenseNumber` null until explicit principal confirmation per Card 1, and conditionally suppress public rendering in all template surfaces.
- **Validation:** Search/build audit proving no public string pattern `FL License #` appears in rendered legal/trust surfaces.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Ryan Serhant’s public pages are strict on credential surfacing discipline and avoid premature legal assertions.

## Finding 6 — Route-specific Twitter metadata is still missing and under-optimized
- **Severity:** low
- **Page/Component:** [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), route metadata files under [src/app](/home/torrey/code/mia-sanabria-website/src/app)
- **Observation:** Twitter card metadata is mostly inherited from layout defaults; only OpenGraph metadata is fully page-specific. This can flatten SERP/social snippet differentiation for high-intent pages.
- **Recommended fix:** Add route-level `twitter: { title, description, images }` for core pages (especially `/buyers/`, `/sellers/`, `/valuation/`, and `/markets/[slug]/`), derived from each page’s Open Graph values.
- **Validation:** Post-build check that each page’s `<meta name="twitter:title">` contains that page’s route-focused title and that OG/Twitter metadata diverge when expected.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem’s social cards mirror page intent with distinct headlines and descriptions for discovery and shareability.

## Finding 7 — `reports/audit-schema.json` is referenced but absent in repository
- **Severity:** low
- **Page/Component:** [reports](/home/torrey/code/mia-sanabria-website/reports) (expected `audit-schema.json`)
- **Observation:** The requested file path is missing; current outputs show `reports/audit-completeness.json`, `reports/audit-images.json`, and `reports/audit-brand-consistency.json`. This weakens repeatable schema/audit traceability for this lane.
- **Recommended fix:** Restore `reports/audit-schema.json` as the canonical schema saturation artifact (or update all lane docs to the actual canonical filename path) and gate CI/lane handoff on it.
- **Validation:** Add presence assertion + baseline diff check in the lane audit pipeline.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes-style production loops keep explicit audit artifacts for each lane so schema regressions are visible and actionable.

## Finding 8 — Non-market pages need stronger internal-link flow beyond contact/hero paths
- **Severity:** medium
- **Page/Component:** [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)
- **Observation:** The non-market hubs are mostly funnel-style and sparse in contextual crosslinks to other non-market service surfaces; this underuses page-rank transfer to pages like `/buyers/`, `/sellers/`, and `/valuation/` beyond market pages.
- **Recommended fix:** Add 1–2 contextual internal CTAs/links per non-market page to adjacent service intent pages and relevant market articles (e.g., `/markets/lighthouse-point/`, `/buyers/`, `/valuation/`), while keeping editorial hierarchy clean.
- **Validation:** Extend `scripts/audit-links.ts` with a link-depth heuristic (e.g., non-market pages should link at least 2 distinct non-market intent destinations).
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s and Senada Adzem both distribute semantic signal through stronger editorial-to-service linking.

## Finding 9 — `/insights/` has room for explicit topic-cluster expansion
- **Severity:** medium
- **Page/Component:** [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)
- **Observation:** Current implementation is a strong single landing with two heavy article blocks but no published essay pipeline or additional neighborhood-specific entries to build topical authority and freshness signals.
- **Recommended fix:** Add three planned essay candidates (data-backed placeholders now, publish later):
  - **Title:** “Las Olas Isles lot-profile traps for waterfront buyers” — **Target query:** “waterfront homes Las Olas Isles dockage”
  - **Title:** “Palm Beach County waterfront lot types: why no-fixed-bridge access matters” — **Target query:** “Palm Beach County waterfront lot profile checklist”
  - **Title:** “Boca Raton vs Delray Beach waterfront buyer checklist” — **Target query:** “waterfront homes in Boca Raton vs Delray Beach”
  Each should carry `Article` + `FAQPage` entities with `mainEntity` alignment.
- **Validation:** Publish at least 3 posts over the next sprint and validate crawl/structured-data coverage via completeness + schema audits.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group’s cluster strategy succeeds by adding high-intent neighborhood essays tied to service-led search questions.

## Finding 10 — Title/description are valid by length but weak on HNWI micro-intent terms
- **Severity:** low
- **Page/Component:** Route metadata in [src/app/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/page.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/%5Bslug%5D/page.tsx)
- **Observation:** Numeric checks for length/uniqueness likely pass, but several titles/descriptions remain brand/section oriented rather than query-shaped for high-intent queries (“waterfront homes Las Olas Isles,” “waterfront homes Delray Beach,” “private waterfront listing”). Current phrasing may underperform AEO-rich snippets.
- **Recommended fix:** Rewrite titles/descriptions to include one high-value long-tail phrase per route while preserving ≤60/≤160 constraints and uniqueness; keep metadata templates deterministic.
- **Validation:** Run `bun run scripts/audit-seo.ts`, then manual SERP intent spot-check for top 10 high-value micro-queries.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Timelmes’s page titles/descriptions are consistently query-intent optimized while staying concise and luxury-positioned.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"seo-aeo-strategic-layer","verdict":"concerns","completeness":"partial","top_concerns":["Answer-first blocks need explicit FAQ schema and cleaner Q-A extraction structure.","Remove/resolve unverified license rendering before production.","Add missing schema/social/content-cluster hardening on service and insights surfaces."],"findings_count":10,"high_severity_count":1,"safe_now_count":9,"benchmark_references":10}

=== AUDIT_END ===
