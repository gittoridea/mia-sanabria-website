# Team C — SEO / AEO / Schema Audit

## Verdict (one sentence)
The site is broadly compliant and well-structured, but concerns remain around `/404` canonical integrity and legal-page OG-image metadata completeness, which are the highest-priority fixes before final cutover.

## Current numbers (verified by running audit scripts)
- routes built / sitemap routes / JSON-LD blocks / unique titles / unique descriptions
- 26 / 25 / 148 / 25 / 25

## Route-by-route punch list
| Route | SEO | AEO | Schema | H-hierarchy | Internal links | Issues |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Pass | Pass | Pass (`WebSite`, `RealEstateAgent`, `Person`, `ImageObject`, `FAQPage`, `Answer`) | Pass (1x H1) | Pass (18 total, 13 topical) | None |
| `/about` | Pass | Partial (no explicit AEO answer block) | Pass (`Organization`, `Person`, `RealEstateAgent`, `FAQPage`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 7 topical) | Add a concise answer-first AEO block near lead section |
| `/buyers` | Pass | Warn (FAQ-only pattern, no markets-style lead answer block) | Pass (`Service`, `OfferCatalog`, `FAQPage`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 7 topical) | Add `aeoAnswer`-style answer block + evidence line |
| `/sellers` | Pass | Warn (FAQ-only pattern, no markets-style lead answer block) | Pass (`Service`, `OfferCatalog`, `FAQPage`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 7 topical) | Add `aeoAnswer`-style answer block + evidence line |
| `/valuation` | Pass | Warn (FAQ-only pattern, no markets-style lead answer block) | Pass (`Service`, `FAQPage`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 7 topical) | Add `aeoAnswer`-style answer block + evidence line |
| `/contact` | Pass | Partial | Pass (`ContactPage`, `Person`, `RealEstateAgent`, `LocalBusiness`, `GeoCoordinates`, `ContactPoint`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 7 topical) | Keep as is; this is a low-priority copy refinement area |
| `/markets` | Pass | Partial (listing hub, not single-intent answer) | Partial (`AdministrativeArea`, `RealEstateAgent`, `ContactPoint`, `ImageObject`, `BreadcrumbList`, `Organization`) | Pass (1x H1) | Pass (25 total, 20 topical) | Add “entry to related market” CTA group for topical clustering |
| `/markets/boca-raton` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/coral-ridge` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/delray-beach` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/fort-lauderdale` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (16 total, 12 topical) | None |
| `/markets/harbor-beach` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/hillsboro-mile` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (14 total, 10 topical) | None |
| `/markets/las-olas-isles` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (16 total, 12 topical) | None |
| `/markets/lighthouse-point` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/palm-beach` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (14 total, 10 topical) | None |
| `/markets/rio-vista` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (16 total, 12 topical) | None |
| `/markets/sea-ranch-lakes` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (14 total, 10 topical) | None |
| `/markets/seven-isles` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (15 total, 11 topical) | None |
| `/markets/victoria-park` | Pass | Pass | Pass (`Place`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | Pass (1x H1) | Pass (16 total, 12 topical) | None |
| `/insights` | Pass | Partial (`Article` + `FAQPage`, no dedicated market-style answer-first block) | Pass (`Article`, `FAQPage`, `BreadcrumbList`, `Place`) | Pass (1x H1) | Pass (13 total, 8 topical) | Add first-answer blocks for each insight cluster |
| `/privacy` | Pass | N/A | Pass (`WebPage`, `Organization`, `ContactPoint`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 8 topical) | Missing `og:image:width` / `og:image:height` |
| `/terms` | Pass | N/A | Pass (`WebPage`, `Organization`, `ContactPoint`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 8 topical) | Missing `og:image:width` / `og:image:height` |
| `/accessibility` | Pass | N/A | Pass (`WebPage`, `Organization`, `ContactPoint`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 8 topical) | Missing `og:image:width` / `og:image:height` |
| `/dmca` | Pass | N/A | Pass (`WebPage`, `Organization`, `ContactPoint`, `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 8 topical) | Missing `og:image:width` / `og:image:height` |
| `/404` | WARN (canonical collision with `/`, duplicate title/description with `/`, missing from sitemap) | N/A | Partial (`WebPage` + `WebSite` present; no `BreadcrumbList`) | Pass (1x H1) | Pass (12 total, 8 topical) | Set dedicated canonical and unique title/description; decide if 404 should be represented in sitemap policy |

## Schema improvements (specific @type / property additions, with file references)
- Add local canonical and metadata fixes for `/404` in [`src/app/not-found.tsx`](/home/torrey/code/mia-sanabria-website/src/app/not-found.tsx): explicit route-local `canonical`, unique title/description, and optional dedicated `BreadcrumbList`.
- Add missing OG dimensions to legal pages:
  - [`src/app/privacy/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/privacy/page.tsx)
  - [`src/app/terms/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/terms/page.tsx)
  - [`src/app/accessibility/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/accessibility/page.tsx)
  - [`src/app/dmca/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/dmca/page.tsx)
- For `/buyers`, `/sellers`, `/valuation`, add explicit `FAQPage` + `Question`/`Answer` answer-first blocks that mirror market-page `aeoAnswer` style where high-intent prompts are answered directly in prose, then supported.
- Keep and retain `@context` + `@type` + stable `@id` references; do not add unverified numeric facts as schema literals.

## Internal-linking improvements (specific from→to recommendations)
- From `/insights` → `/buyers`, `/sellers`, `/valuation`, and `/markets` for conversion transition.
- From `/buyers` → `/sellers` and `/valuation` (and reverse links back to the partner funnel pages).
- From `/contact` → `/markets` and `/insights` to reduce informational dead-end exits.
- From legal pages (`/privacy`, `/terms`, `/accessibility`, `/dmca`) → `/contact` + `/buyers`/`/sellers` as low-friction help pathways.

## AEO answer-block extension recommendations (which non-market pages should adopt the markets aeoAnswer pattern)
- `/buyers`: add one 80–125 word direct-answer block for buyer onboarding, off-market access, and search workflow.
- `/sellers`: add one 80–125 word direct-answer block for pricing strategy, list structure, and expected process.
- `/valuation`: add one direct-answer block defining what is included/excluded in valuation and expected next step.
- `/insights`: add answer blocks per insight cluster in direct-answer-first format, each ending with evidence context.
- `/about`: optional single-brand-answer block connecting Mia + brokerage clarity before long-form narrative.

## What we should NOT change (existing strengths to preserve)
- Keep each market object in [`src/lib/markets.ts`](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts) at 13 entries with exactly 5 FAQ items apiece.
- Preserve the current metadata host behavior in [`src/app/layout.tsx`](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx).
- Preserve robots/host gating in [`src/app/robots.ts`](/home/torrey/code/mia-sanabria-website/src/app/robots.ts) for staging.
- Preserve current schema component usage for Person / RealEstateAgent / LocalBusiness / WebSite / BreadcrumbList / Article / FAQPage / Place / ContactPage where they are already correctly emitted.

## Anti-criteria check
- No license, designation, MLS number, or sales claim additions recommended.
- No forced correction of county labels (`Boca Raton`, `Delray`, `Palm Beach`) to Broward introduced.
- No hard-coded facts beyond already-present null-guarded values.
- No suggestions conflict with Brand System Contract restrictions.

## Evidence appendix
- Model used: gpt-5.3-codex-spark
- Reasoning: xhigh / Sandbox: read-only
- Audit script outputs captured
  - `bun run audit:schema` → `audit-schema: scanned 27 pages, found 148 JSON-LD blocks (22ms).`
  - `bun run audit:seo` → `0 warning(s)`
  - `ls out/sitemap.xml` + parse → 25 `<loc>` entries, 0 duplicates, 0 stale entries vs public canonical paths, 0.000? no 404 entry
  - `ls out/markets` → 13 market directories in build output
  - `wc -l out/sitemap.xml` and `lastmod` scan → 25 entries, uniform timestamp `2026-05-08T20:35:57.955Z`


{"verdict":"concerns","completeness":"full","top_concerns":["Canonical collision between / and /404 (same canonical + duplicate title/description)","Legal pages are missing og:image:width/height values","Non-market funnel pages lack the market-style AEO answer-first blocks"],"routes_audited":26,"schema_blocks_total":148,"high_severity_count":2}
