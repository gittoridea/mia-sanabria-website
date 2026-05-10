# Cycle 15 — LIVE Verification (2026-05-10)

> Post-deploy live verification. Ran after `bun scripts/deploy-and-verify.ts --no-lighthouse` triggered Dokploy deploy (123s) and Caddy ETag flipped.

## Caddy flip evidence

| Probe | Pre-deploy | Post-deploy |
|---|---|---|
| ETag (homepage) | `dif3sciprg8w2vtu` | `dif86vkf7ke838d4` |
| ETag (insights) | `dif3sciprg8w1sli` (legacy 2-article inline) | `dif86vkf7ke8366o` |
| Last-Modified | `Sun, 10 May 2026 15:31:26 GMT` | `Sun, 10 May 2026 18:58:29 GMT` |
| Body grep (`twelve-part evergreen`) | absent | present |

Cache-busting via `?_=$(date +%s)` per `feedback_caddy_dokploy_cache_bust.md`. Caddy flip detected within 2 minutes post-deploy completion.

## HTTP status sweep (26 routes)

```
200  /
200  /insights/
200  /insights/fort-lauderdale-waterfront-buyer-guide/
200  /insights/dockage-seawalls-bridge-clearance-route-to-inlet/
200  /insights/positioning-luxury-waterfront-eastern-fort-lauderdale/
200  /insights/las-olas-vs-seven-isles-vs-harbor-beach/
200  /insights/bay-colony-and-bermuda-riviera-private-waterfront/
200  /insights/coral-ridge-victoria-park-rio-vista/
200  /insights/lighthouse-point-sea-ranch-lakes-hillsboro-mile/
200  /insights/boca-raton-luxury-buyers-club-beach-waterfront/
200  /insights/delray-beach-luxury-buyers-walkability-beach-waterfront/
200  /insights/why-automated-valuations-miss-luxury-waterfront/
200  /insights/preparing-waterfront-residence-private-market-conversations/
200  /insights/private-buyer-brief-defining-the-search/
200  /thank-you/
200  /thank-you/valuation/
200  /thank-you/buyer-brief/
200  /thank-you/market-brief/
200  /markets/
200  /markets/fort-lauderdale/
200  /markets/bay-colony/
200  /markets/boca-raton/
200  /buyers/
200  /sellers/
200  /valuation/
200  /contact/
200  /sitemap.xml

FAIL COUNT: 0
```

## Schema verification (live)

Sample post `/insights/fort-lauderdale-waterfront-buyer-guide/`:

```
1  "@type":"Article"
1  "@type":"BreadcrumbList"
1  "@type":"FAQPage"
```

Article + Breadcrumb + FAQPage all live as expected.

## Sitemap verification

Sitemap.xml contains **13 insights URLs** (12 posts + 1 index) — exactly the expected delta from `getAllInsightRoutes()`.

## Stale residue check

```
Klein Morgan: 0 hits
mia@miasanabriarealtor.com: 0 hits
msanabriarea@gmail.com: 1 hit (canonical, expected)
```

Canonical email preserved. No stale brokerage residue. No non-canonical email introduced.

## Live screenshot capture

`/tmp/mia-cycle15-live-after/` — 15 screenshots at 1280×800 covering:
- `/`
- `/insights/`
- 5 representative insight post pages
- `/markets/` + 2 market pages (fort-lauderdale, bay-colony)
- `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`
- `/thank-you/buyer-brief/`

Compared against `/tmp/mia-cycle15-live-baseline/` (pre-deploy capture of same URLs):
- Insights routes: were 404 / not built pre-cycle → now serve full editorial pages
- Sitewide weaving locations (home, markets, buyers, sellers, valuation, contact): show new RelatedInsightsModule sections without disrupting existing layout
- Hero/Footer: visually identical (regression guard preserved)

## Verdict

**LIVE PASS · DEPLOY CLEAN.** Cycle 15 is shipped, verified, and rendering correctly across all 26 sampled routes with full schema, sitemap inclusion, and zero stale residue.
