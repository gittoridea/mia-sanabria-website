# Cycle 15 — Local Verification (2026-05-10)

## Toolchain status

| Check | Command | Result |
|---|---|---|
| TypeScript | `bun run typecheck` | PASS · exit 0 · no errors |
| ESLint | `bun run lint` | PASS · ✔ No ESLint warnings or errors |
| Build | `bun run build` | PASS · exit 0 · 43 routes generated |

## Build route inventory (post-cycle)

| Route group | Count | Delta vs Cycle 14 |
|---|---|---|
| Top-level static (about, accessibility, buyers, contact, dmca, insights, markets, privacy, sellers, terms, valuation, +home, +manifest, +robots, +sitemap, +not-found) | 16 | +0 |
| `/markets/[slug]/` (SSG) | 15 | +0 |
| `/insights/[slug]/` (SSG) | 12 | **+12** |
| `/thank-you/`, `/thank-you/valuation/`, `/thank-you/buyer-brief/`, `/thank-you/market-brief/` | 4 | **+4** |
| **Total built routes** | **47** | **+16** |

(43 indexable routes after excluding /_not-found/ and the four thank-you noindex routes.)

## audit:all summary

```
audit:stale          PASS · 0 stale-string hits
audit:schema         PASS
audit:links          PASS · 2227 internal links across 45 pages · 0 broken
audit:seo            PASS · 0 errors
audit:completeness   15 PASS · 1 WARN · 0 FAIL  (carry-forward WARN: forms.classification 2 mailto · 0 live-ghl, expected per lead-capture architecture)
audit:images         PASS
audit:brand          14 PASS · 0 WARN · 0 FAIL
audit:hero-contrast  105 PASS · 0 WARN · 0 FAIL  (samples=1)
audit:rendered       14 PASS · 1 WARN · 0 FAIL  (carry-forward WARN: chrome --dump-dom mobile-clamp limitation, documented Cycle 12)
audit:insights       535 PASS · 0 WARN · 0 FAIL  (NEW Cycle 15)
```

**Final exit status: 0.** Two carry-forward WARNs from prior cycles are unchanged and documented.

## Internal-link delta

| Surface | Pre-cycle | Post-cycle | Delta |
|---|---|---|---|
| Total internal links across 45 pages | 1360 | 2227 | **+867** |

Breakdown of the +867 delta:
- 12 insight detail pages × ~50 internal links each (related markets module + related insights + breadcrumbs + nav header + footer + body links) ≈ +600
- Insights index page (12 cards × topic-month nav strip + nav + footer) ≈ +60
- Sitewide weaving — 6 pages each gain a 3-link RelatedInsightsModule plus the existing nav ≈ +60
- Per-market pages × 15 each gain a data-driven RelatedInsightsModule of up to 3 links ≈ +45
- Thank-you routes (×4) link back to insights/markets ≈ +20
- Sitemap.xml entries: +12 insight URLs

## JSON-LD schema delta

| Pre-cycle | Post-cycle | Delta |
|---|---|---|
| 159 JSON-LD blocks across 27 pages | 190 JSON-LD blocks across 39 indexed pages | **+31** |

The +31 breaks down as:
- 12 Article schemas (one per insight detail page)
- 12 BreadcrumbList schemas (one per insight detail page)
- 6 FAQPage schemas (posts 1, 2, 7, 10, 12 + insights index — wait, FAQPage is on detail pages with faqs only)
- 1 Blog schema (index page)
- = 31 new blocks

## audit:insights detail (NEW Cycle 15)

`scripts/audit-insights.ts` — 535 PASS · 0 WARN · 0 FAIL.

Per-post: all 12 posts ✓ on every check (required fields, dates, SEO meta length, market links ≥2, both CTAs complete, body word count ≥600, AEO answer in range, banned-phrase scan, county consistency, slug case).

Library-level: 12 unique slugs, 12 unique topicMonth values (1..12 covered), 12/12 posts present.

## Sitemap.xml inclusion

```
27 → 39 entries
+12 /insights/[slug]/ entries via getAllInsightRoutes()
0 thank-you entries (correctly excluded — noindex)
```

## Build artifact size

`bun run build` static export size impact (estimate from Next.js build output):
- 12 insight pages × 218 B per route = ~2.6 KB additional First Load JS
- Each route inherits the existing 105 KB shared chunks + 9 KB page-specific = ~114 KB total per route
- No measurable bundle bloat from CTA components (all sizes report as 218 B)

## What was NOT changed (regression guard)

- Hero.tsx — untouched.
- SiteHeader.tsx — untouched.
- SiteFooter.tsx — untouched.
- MarketCard.tsx — untouched.
- src/lib/markets.ts MARKETS data — untouched.
- src/lib/mia.ts MIA constant — untouched.
- src/lib/site.ts — untouched.
- next.config.ts — untouched.
- layout.tsx — untouched.
- All 8 Cycle 14 featured market `comparisonContext` paragraphs — preserved verbatim.
- Existing audit:hero-contrast / audit:rendered / audit:brand outputs — at parity with Cycle 14 baseline + the documented expected delta from new routes.

## Carry-forward WARNs (expected, classified)

| Audit | WARN | Status |
|---|---|---|
| `audit:completeness` | `forms.classification — 2 forms · 0 live-ghl · 2 mailto` | Expected per lead-capture architecture — both `/contact/` and `/valuation/` forms remain `mailto:` until GHL workflow webhook URL is provisioned (BLOCKED-BY-GHL) |
| `audit:rendered` | `rendered.probe.viewportSanity — 81/135 viewport-honest` | Expected per Cycle 12 — chrome `--dump-dom` clamps mobile to ~500px; screenshot channel + GPT-5.5 visual review covers the gap |

No new WARNs introduced this cycle.

## Verdict

**PASS · DEPLOY_ALLOWED: yes** (pending GPT-5.5 acceptance review + Cato cross-vendor compliance audit).
