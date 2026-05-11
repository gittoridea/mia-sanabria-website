# Cycle 20 — SEO / AEO / Schema / Social Audit

> Source: `docs/artifacts/cycle-20-agency-qa/seo-aeo-schema-audit.md`
> Authoritative inputs: `reports/audit-schema.json`, `reports/audit-seo.json`, `reports/audit-completeness.json`, `reports/audit-insights.json`, `reports/audit-featured-markets.json`, `reports/qa-gate-matrix.json`.
> Live base: `https://miasanabriarealtor.trueidea.com` (staging; **noindex** until cutover).

## 1. Core SEO hygiene — current state

| Check | Result | Source | Notes |
|---|---|---|---|
| Every page has `<title>` | PASS (28/28 core/legal/market) | audit-completeness.metadata.allPresent | descriptions + canonical + og:* all present |
| Titles unique | PASS (28/28) | audit-completeness.metadata.uniqueTitles | no duplicates |
| Descriptions unique | PASS | audit-completeness.metadata.uniqueDescriptions | |
| Title length ≤60 chars | mostly PASS; `/markets/fort-lauderdale/` at 62 | qa-gate-matrix | borderline, not blocking |
| Description length 85–160 | PASS | qa-gate-matrix | legal pages on short side (117–141) |
| Canonical present per page | PASS (28/28) | audit-completeness.metadata.allPresent | |
| OG image referenced exists in `out/` | PASS (28/28) | audit-completeness.og.imagesResolve | |
| Twitter card meta present | PASS | site lib `SITE.twitter.card` → summary_large_image | |
| robots.txt strategy | staging = `noindex,nofollow` (IS_STAGING gate) | `src/app/robots.ts` + `src/lib/site.ts` | flips at cutover to allow-all |
| Sitemap built routes coverage | 40/40 | audit-completeness.sitemap.builtInSitemap | excludes intentionally-noindex routes |
| Sitemap → built page resolution | 0 unresolved | audit-completeness.sitemap.sitemapInBuilt | |

## 2. Schema graph — per route family

| Route family | Schemas | Status | Source |
|---|---|---|---|
| `/` (home) | Person + RealEstateAgent + LocalBusiness + WebSite + WebPage + BreadcrumbList + FAQPage (7) | parses clean | audit-schema |
| `/about/` | Person + RealEstateAgent + LocalBusiness + WebPage + BreadcrumbList + ProfilePage + ItemList (7) | parses clean | audit-schema |
| `/contact/` | + ContactPage + FAQPage (8) | parses clean | audit-schema |
| `/buyers/`, `/sellers/` | Person + RealEstateAgent + LocalBusiness + WebPage + BreadcrumbList + Service + FAQPage + ItemList (8) | parses clean | audit-schema |
| `/valuation/` | + Service (7) | parses clean | audit-schema |
| `/markets/` | WebSite + WebPage + CollectionPage + BreadcrumbList (4) | parses clean | audit-schema |
| `/markets/[slug]/` | Place + WebPage + BreadcrumbList + RealEstateAgent + FAQPage (+ CollectionPage where applicable) | parses clean (5–6) | audit-schema |
| `/insights/` | WebSite + Blog + CollectionPage + BreadcrumbList (4) | parses clean | audit-schema |
| `/insights/[slug]/` | Article + Person + RealEstateAgent + BreadcrumbList + FAQPage (5) | parses clean | audit-insights |
| Legal pages × 4 | WebSite + WebPage + BreadcrumbList + Person (4 each) | parses clean | audit-schema |
| `/downloads/[slug]/` | WebPage + BreadcrumbList (2) | parses clean | audit-schema |
| `/404` | WebPage + BreadcrumbList (2) | parses clean | audit-schema |

**Coverage verdict:** SCHEMA-SATURATED at the level a top-quartile luxury realtor site needs. The 28 indexable pages collectively emit ~120 schema entities. No empty schema components on pages without the underlying content.

## 3. AEO direct-answer review

The AEO question: when a generative answer engine quotes a page, does the page open with a sourced sentence the engine can use verbatim?

| Route | Opening AEO surface | Verdict |
|---|---|---|
| `/` | `AnswerFirst` component answers "What kind of real estate does Mia Sanabria specialize in?" with a specific paragraph naming Eastern Fort Lauderdale, Las Olas Isles, Harbor Beach, Rio Vista, Coral Ridge, Victoria Park, Boca Raton, Delray Beach | **PASS** — direct, sourced, citable |
| `/about/` | First paragraph names brokerage (LPT Realty), service area, work-style; uses third-person ("Mia Sanabria represents…") | **PASS** |
| `/markets/[slug]/` | Each market page opens with a specific, neighborhood-level statement | **PASS** (16/16 word-count floor met) |
| `/insights/[slug]/` | Each post opens with a thesis sentence + author attribution (Article schema) | **PASS** (12/12) |
| `/buyers/`, `/sellers/`, `/valuation/` | Each opens with a single-sentence framing of who the page is for | **PASS** |
| `/contact/`, legal pages | conversational/legalese; not AEO targets | **N/A** (not the format) |

**AEO verdict:** Strong. The `AnswerFirst` component is doing exactly the work it was designed for. The insights library is structured for direct-answer extraction.

## 4. FAQ schema visible-content alignment

Spot-check across pages with FAQPage schema:

| Route | Visible FAQ count | Schema Question count | Match | Source |
|---|---|---|---|---|
| `/` | 4 | 4 | ✓ | `HOME_FAQ` array + `Faq` component |
| `/contact/` | rendered | rendered | ✓ | audit-completeness.faq |
| `/buyers/` | rendered | rendered | ✓ | |
| `/sellers/` | rendered | rendered | ✓ | |
| `/valuation/` | rendered | rendered | ✓ | |
| `/markets/fort-lauderdale/` | 11 (5 market FAQs + 6 V2 specifics) | 11 | ✓ | audit-fort-lauderdale-standard v4.faqPageCountIs11 PASS |
| `/markets/[other]/` | 5 each | 5 | ✓ | per-market data |
| `/insights/[slug]/` | per-post FAQ | matches | ✓ | audit-insights |

**FAQPage doctrine compliance:** every page that emits FAQPage schema renders the corresponding Q&A in visible text. No phantom schema.

## 5. Article date honesty (per CLAUDE.md "no visible `Updated MONTH YYYY` labels" rule)

| Check | Result |
|---|---|
| `datePublished` in Article schema | PASS — present on all 12 insight posts |
| `dateModified` schema field honest | PASS — auto-tied to file mtime via build; no manual override drift |
| Visible "Updated MONTH YYYY" labels | PASS — 0 hits across insights pages |

## 6. BreadcrumbList integrity

| Route family | Breadcrumb chain |
|---|---|
| `/` | Home |
| `/about/`, `/contact/`, `/buyers/`, `/sellers/`, `/valuation/` | Home → {Page} |
| `/markets/` | Home → Markets |
| `/markets/[slug]/` | Home → Markets → {Market} |
| `/insights/` | Home → Insights |
| `/insights/[slug]/` | Home → Insights → {Post} |
| Legal pages | Home → {Legal Page} |
| `/downloads/[slug]/` | Home → Downloads → {Resource} |

All BreadcrumbList `itemListElement[].item` URLs match the actual route. audit-completeness + audit-legal both PASS.

## 7. Anti-checklist (no fabricated SEO/AEO claims)

| Anti | Result | Source |
|---|---|---|
| No fake `aggregateRating` | PASS — 0 emitted | audit-no-fabrications |
| No fake `review` schema | PASS | audit-no-fabrications |
| No fake `award` schema | PASS | audit-no-fabrications |
| No fake `priceRange` schema | PASS | audit-no-fabrications |
| No fake `knowsLanguage` schema | PASS | audit-about |
| License # emitted only on footer + `/terms/` (not body of about) | PASS | audit-about.license.notOnAbout |
| Brokerage = LPT Realty (not Klein Morgan) | PASS | audit-about.brokerage.lpt |
| No off-market / private-MLS inventory claims | PASS | audit-stale-terms + audit-no-fabrications |
| No response-time guarantees in schema | PASS | audit-stale-terms |
| No fabricated `sameAs` social links | PASS — only verified profiles emitted | audit-schema |

## 8. Local SEO specificity

| Market | Specificity hooks present in content + schema |
|---|---|
| Fort Lauderdale | Las Olas Isles, Harbor Beach, Rio Vista, Coral Ridge, Victoria Park, Bay Colony, Bermuda Riviera, Seven Isles named; route-to-inlet / fixed-bridges / dockage / insurance-dataroom specifics; 11-Q FAQ |
| Coral Ridge | named explicitly on home AEO + market detail |
| Victoria Park | same |
| Boca Raton | Mediterranean Revival + Atlantic Avenue specifics on home AEO |
| Delray Beach | walkability + Atlantic Avenue beach corridor specifics |
| Pompano Beach | included in 16-market set + Fort Lauderdale cohort comparison |
| Lighthouse Point / Sea Ranch Lakes / Hillsboro Mile | dedicated market page + cross-link from FL V2 |
| Bay Colony / Bermuda Riviera | dedicated market page + private-waterfront framing |

**Local SEO verdict:** Specific. The site has done the neighborhood-level work that generic luxury-realtor templates skip.

## 9. Social card sanity

| Check | Result |
|---|---|
| `og:title` per page | PASS |
| `og:description` per page | PASS |
| `og:image` per page resolves in `out/` | PASS (audit-completeness.og.imagesResolve) |
| `og:url` per page | PASS |
| Twitter card type = `summary_large_image` | PASS (via `SITE.twitter.card`) |
| Twitter handles | absent (Mia not yet on Twitter) — intentionally omitted, not fake |

## 10. Findings summary

| ID | Title | Severity | Owner | Notes |
|---|---|---|---|---|
| SEO-1 | `/markets/fort-lauderdale/` title at 62 chars (over 60 cap) | P3 | 1 site | one-character trim would resolve; defer |
| SEO-2 | All schemas parse clean; no fake aggregateRating/review/award/priceRange | n/a | n/a | this is the regression guard; preserve |
| SEO-3 | AEO direct-answer surfaces present site-wide via `AnswerFirst` + post intros | n/a | n/a | preserve |
| SEO-4 | Staging noindex strategy correct; flips at cutover | n/a | 6 launch | preserve until cutover |
| SEO-5 | No social `sameAs` claims for unverified accounts | n/a | n/a | correct posture |

**Net:** the SEO/AEO/schema surface is in an exceptionally strong state. Only one P3 (title length on FL detail page) surfaces as candidate for a future tightening cycle.

## 11. Cross-references

- ISS-018 (P3) in `issue-matrix.md`: `/markets/fort-lauderdale/` title length trim.
- All schema validation passes feed into `qa-gate-matrix.md` baseline.
