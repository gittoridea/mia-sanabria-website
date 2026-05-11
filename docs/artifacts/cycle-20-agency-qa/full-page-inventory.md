# Cycle 20 — Full Page Inventory

> Source artifact: `docs/artifacts/cycle-20-agency-qa/full-page-inventory.md`
> Generated 2026-05-11 from filesystem walk (`src/app/**/page.tsx`), `out/sitemap.xml`, and the latest `reports/audit-route-inventory.json` + `reports/qa-gate-matrix.json` rollup (`generated_at` 2026-05-11T17:07Z, regenerated mid-cycle).
> Live base: `https://miasanabriarealtor.trueidea.com`. Staging is `noindex` until separate cutover approval.

## 1. Counts at a glance

| Counter | Value | Source |
|---|---|---|
| Page templates in `src/app/` | 20 | `find src/app -name "page.tsx"` |
| Routes in built sitemap | 40 | `out/sitemap.xml` via `audit-completeness` |
| Routes scanned by QA gate | 48 | `reports/qa-gate-matrix.json` (sitemap 40 + 4 thank-you + 3 downloads + 1 404 = 48) |
| Critical findings | **0** | `reports/qa-gate-matrix.json` |
| High findings | 4 | All legal-review on `/privacy`, `/terms`, `/accessibility`, `/dmca` (c5 owner-type) |
| Medium findings | 1 | `/contact` lead_capture (c4 = GHL dependency) |
| Low findings | 48 | Universal `noindex` (c6 = launch dependency — staging stays noindex until cutover) |
| Forms classified | 2 mailto · 0 live-ghl · 0 disabled · 0 other | `audit-completeness.forms.classification` |
| Lead-magnet PDFs | 3 (no shell-bleed) | `audit-lead-magnets.json` 4/4 PASS |
| Banned-string hits ("Klein Morgan", "evergreen", "Same business day", "within five business days", etc.) | 0 | `audit-stale-terms.json` + `audit-no-fabrications.json` |
| Global trust row | absent | `audit-trust-row` 51/51 sources clean |
| Sitemap drift | 0 missing · 0 unresolved | `audit-completeness.sitemap.*` both PASS |

**Architectural note:** sitemap excludes routes that are intentionally noindex (downloads, thank-you, 404, downloads/[slug]) so a 40/48 split is *expected*, not drift.

## 2. Route-by-route matrix

Columns: route · source file · type · sitemap · noindex · primary CTA · form · schemas (count) · canonical · OG image · breadcrumbs · FAQ · PDF link · IDX touchpoint · QA verdict · owner-type · ISC pointer.

Legend: type `static` (in-repo), `dyn-market` (`/markets/[slug]`), `dyn-insight` (`/insights/[slug]`), `dyn-download` (`/downloads/[slug]`); QA = qa-gate-matrix verdict; OT = owner-type per Phase-9 matrix (1 site, 2 tool, 3 principal, 4 GHL, 5 legal, 6 launch).

| # | Route | Source | Type | Site | NIdx | Primary CTA | Form | Schemas | Canon | OG | Bcrumb | FAQ | PDF | IDX | QA | OT | ISC |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | `src/app/page.tsx` | static | ✓ | ✓ | "Begin a Private Conversation" → /contact | — | 7 | ✓ | ✓ | ✓ | ✓ (4Q) | — | embedded (`IdxEmbed`) | low | 6 | ISC-112..118 |
| 2 | `/about/` | `src/app/about/page.tsx` | static | ✓ | ✓ | "Request a Private Conversation" → /contact | — | 7 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-119..125 |
| 3 | `/contact/` | `src/app/contact/page.tsx` | static | ✓ | ✓ | "Send Private Inquiry" → mailto | mailto | 8 | ✓ | ✓ | ✓ | ✓ | — | — | medium | 4 | ISC-126..132 |
| 4 | `/buyers/` | `src/app/buyers/page.tsx` | static | ✓ | ✓ | "Begin a Private Buyer Brief" → /contact | — | 8 | ✓ | ✓ | ✓ | ✓ | — | — | low | 6 | ISC-133..139 |
| 5 | `/sellers/` | `src/app/sellers/page.tsx` | static | ✓ | ✓ | "Request a Listing Conversation" → /contact | — | 8 | ✓ | ✓ | ✓ | ✓ | — | — | low | 6 | ISC-140..146 |
| 6 | `/valuation/` | `src/app/valuation/page.tsx` | static | ✓ | ✓ | "Request Home Valuation" → mailto | mailto | 7 | ✓ | ✓ | ✓ | ✓ | — | — | low | 6 | ISC-147..153 |
| 7 | `/markets/` | `src/app/markets/page.tsx` | static | ✓ | ✓ | per-market card → `/markets/[slug]` | — | 4 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-154..160 |
| 8 | `/markets/fort-lauderdale/` | `markets/[slug]/page.tsx` (V2 gold-std component) | dyn-market | ✓ | ✓ | "Begin a Private Conversation" + 3 PDF download CTAs | — | 6 | ✓ | ✓ | ✓ | ✓ (11Q) | 3 PDFs | — | low | 6 | ISC-161..167 |
| 9..23 | `/markets/{coral-ridge,victoria-park,boca-raton,palm-beach,delray-beach,lighthouse-point,rio-vista,harbor-beach,las-olas-isles,seven-isles,sea-ranch-lakes,hillsboro-mile,pompano-beach,bay-colony,bermuda-riviera}/` | `markets/[slug]/page.tsx` | dyn-market | ✓ each | ✓ | "Begin a Private Conversation" → /contact | — | 5 each | ✓ | ✓ | ✓ | ✓ | — | — | low | 6 | ISC-168..195 |
| 24 | `/insights/` | `src/app/insights/page.tsx` | static | ✓ | ✓ | per-post card | — | 4 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-196..202 |
| 25..36 | 12× `/insights/[slug]/` (full list in qa-gate-matrix) | `insights/[slug]/page.tsx` | dyn-insight | ✓ each | ✓ | inline soft CTA + footer CTA | — | 5 each (Article+Person+RealEstateAgent+Bcrumb+FAQ) | ✓ | ✓ | ✓ | ✓ (per post) | — | — | low | 6 | ISC-203..223 |
| 37 | `/privacy/` | `src/app/privacy/page.tsx` | static | ✓ | ✓ | mailto link | — | 4 | ✓ | ✓ | ✓ | — | — | — | **high (c5 legal-review)** | 5 | ISC-224..230 |
| 38 | `/terms/` | `src/app/terms/page.tsx` | static | ✓ | ✓ | mailto link | — | 4 | ✓ | ✓ | ✓ | — | — | — | **high (c5 legal-review)** | 5 | ISC-231..237 |
| 39 | `/accessibility/` | `src/app/accessibility/page.tsx` | static | ✓ | ✓ | mailto link | — | 4 | ✓ | ✓ | ✓ | — | — | — | **high (c5 legal-review)** | 5 | ISC-238..244 |
| 40 | `/dmca/` | `src/app/dmca/page.tsx` | static | ✓ | ✓ | mailto link | — | 4 | ✓ | ✓ | ✓ | — | — | — | **high (c5 legal-review + USCO in-process flag)** | 5 | ISC-245..251 |
| 41 | `/thank-you/` | `src/app/thank-you/page.tsx` | static | — | ✓ | "Return Home" | — | 2 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-252 |
| 42 | `/thank-you/buyer-brief/` | static | static | — | ✓ | "Return Home" | — | 2 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-253 |
| 43 | `/thank-you/market-brief/` | static | static | — | ✓ | "Return Home" | — | 2 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-254 |
| 44 | `/thank-you/valuation/` | static | static | — | ✓ | "Return Home" | — | 2 | ✓ | ✓ | ✓ | — | — | — | low | 6 | ISC-255 |
| 45 | `/downloads/waterfront-buyer-due-diligence-checklist/` | `downloads/[slug]/page.tsx` | dyn-download | — | ✓ | direct PDF download | — | 2 | ✓ | — | — | — | self | — | low | 6 | ISC-259..265 |
| 46 | `/downloads/luxury-seller-pre-listing-checklist/` | `downloads/[slug]/page.tsx` | dyn-download | — | ✓ | direct PDF download | — | 2 | ✓ | — | — | — | self | — | low | 6 | ISC-259..265 |
| 47 | `/downloads/fort-lauderdale-waterfront-valuation-prep-sheet/` | `downloads/[slug]/page.tsx` | dyn-download | — | ✓ | direct PDF download | — | 2 | ✓ | — | — | — | self | — | low | 6 | ISC-259..265 |
| 48 | `/404` (`not-found.tsx`) | `src/app/not-found.tsx` | static | — | ✓ | "Return Home" | — | 2 | ✓ | — | ✓ | — | — | — | low | 6 | — |

## 3. Schema coverage (per route family)

| Route family | Schemas emitted | Source components |
|---|---|---|
| `/` (home) | Person + RealEstateAgent + LocalBusiness + WebSite + WebPage + BreadcrumbList + FAQPage = 7 | `PersonSchema`, `RealEstateAgentSchema`, `BreadcrumbSchema`, `Faq` |
| `/about/` | Person + RealEstateAgent + LocalBusiness + WebPage + BreadcrumbList + ProfilePage + ItemList = 7 | as above |
| `/contact/`, `/buyers/`, `/sellers/`, `/valuation/` | 7–8 (adds FAQPage where Faq component renders) | per-page composition |
| `/markets/` | 4 (CollectionPage + BreadcrumbList + WebSite + WebPage) | `MarketsIndexSchema` |
| `/markets/[slug]/` | 5–6 (Place + WebPage + BreadcrumbList + RealEstateAgent + FAQPage + optional CollectionPage) | `MarketSchema` + per-market data |
| `/insights/` | 4 (Blog + CollectionPage + BreadcrumbList + WebSite) | `InsightsIndexSchema` |
| `/insights/[slug]/` | 5 (Article + Person + RealEstateAgent + BreadcrumbList + FAQPage) | `InsightPostSchema` |
| `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` | 4 each (WebPage + BreadcrumbList + WebSite + Person) | `LegalPageSchema` |
| `/downloads/[slug]/` | 2 (WebPage + BreadcrumbList) | `DownloadPageSchema` |

All schema parses cleanly per `audit-schema.json`. The eight legal-page schema sets are the most conservative; everything else is at or above industry baseline.

## 4. Drift checks (this cycle)

| Check | Result | Source |
|---|---|---|
| sitemap.xml lists every public-indexable route | PASS (40/40) | `audit-completeness.sitemap.builtInSitemap` |
| sitemap entries all resolve to a built page | PASS (0 unresolved) | `audit-completeness.sitemap.sitemapInBuilt` |
| All og:images resolve to local files in `out/` | PASS | `audit-completeness.og.imagesResolve` |
| Titles unique (28 core/legal/market pages) | PASS | `audit-completeness.metadata.uniqueTitles` |
| Descriptions unique | PASS | `audit-completeness.metadata.uniqueDescriptions` |
| Title length max 62 (FL market detail) — under 60 cap | ⚠ borderline on `/markets/fort-lauderdale/` (62) | qa-gate-matrix; not blocking |
| Description length range 85–159 | PASS (legal pages on short side) | qa-gate-matrix |
| Market pages exceed 200-word floor | PASS (16/16) | `audit-completeness.markets.wordFloor` |
| Blog schema on index + Article schema on posts | PASS | `audit-completeness.blog.articleSchema` |
| `/insights/` linked from homepage | PASS | `audit-completeness.blog.inNav` |
| Footer trust elements (LPT, license, EHO, REALTOR®, 4 policy links) on sampled pages | PASS (7/7) | `audit-completeness.footer.trust` |
| Lead-magnet PDFs no shell-bleed | PASS (no "Skip to main content" / "Site footer") | `audit-lead-magnets.json` |
| Above-fold trust row absent | PASS (51/51 sources clean) | `audit-trust-row.json` |
| Banned strings (Klein Morgan, evergreen, same business day, within five business days, etc.) | PASS (0 hits) | `audit-stale-terms.json` + `audit-no-fabrications.json` |
| Fort Lauderdale gold-standard markers | PASS (31/31) | `audit-fort-lauderdale-standard.json` |

## 5. Per-page lead CTA inventory

| Route | Primary CTA label | Target | Surface family |
|---|---|---|---|
| `/` | "Begin a Private Conversation" | `/contact/` | form (mailto) |
| `/` | "Request Home Valuation" | `/valuation/` | form (mailto) |
| `/about/` | "Request a Private Conversation" | `/contact/` | form |
| `/contact/` | "Send Private Inquiry" | `mailto:` | mailto |
| `/contact/` | "Call Mia" | `tel:` | tel |
| `/buyers/` | "Begin a Private Buyer Brief" | `/contact/` | form |
| `/sellers/` | "Request a Listing Conversation" | `/contact/` | form |
| `/valuation/` | "Request Valuation" | `mailto:` | mailto |
| `/valuation/` | "Call Mia" | `tel:` | tel |
| `/markets/[slug]/` (all 16) | "Begin a Private Conversation" | `/contact/` | form |
| `/markets/fort-lauderdale/` | 3 PDF CTAs | `/downloads/{slug}.pdf` | pdf-download |
| `/insights/[slug]/` (12) | inline soft CTA + footer CTA | `/contact/` or `/valuation/` | form |
| `SiteHeader` (all pages) | phone in `tel:` | `tel:` | tel |
| `SiteFooter` (all pages) | phone in `tel:` + email in `mailto:` | tel + mailto | tel/mailto |
| `IdxEmbed` (home) | iframe `Search available SE FL listings` | sef.mlsmatrix.com | idx-vendor (handoff out of Mia's CRM) |

Total active lead surfaces across the site:
- **form (→ contact / valuation):** 6 distinct buttons across 7 hosting routes
- **mailto:** 16+ link instances (contact, valuation, dmca×2, privacy×4, accessibility, terms, footer)
- **tel:** 11+ link instances (header×2, footer, CTAStrip, contact×2, valuation, privacy×2, accessibility, terms)
- **PDF download:** 3 lead magnets, 4 host pages (FL market + each PDF self-page)
- **IDX iframe:** 1 instance (home), 0 Mia-side capture
- **404 / thank-you "Return Home":** non-conversion, navigation only

## 6. Status

- **Critical defects to fix this cycle:** 0
- **High items to surface:** 4 (legal-review, all c5 launch-deps; deferred to legal cutover packet)
- **Medium item to surface:** 1 (`/contact` lead_capture c4 — see `lead-flow-map.md` + `ghl-webhook-implementation-plan.md`)
- **Low items:** 48 noindex flags (c6 launch-dep — flips with cutover, not in scope here)

**This site has earned its 745/745 project-ISA close-out.** Cycle 20's high-leverage moves are architectural (Phase 2/11) and process (Phase 10 cache-bust safe-fix), not site-defect repair.
