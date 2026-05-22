# Home Search → Bridge LIVE Activation

generated: 2026-05-22T13:46:36.582Z
base: http://127.0.0.1:4190
target: http://127.0.0.1:4190/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_mode: fallback
proven_live: NO
classification: Env vars missing at build time, or a stale static bundle is served. Fix Dokploy build args (NEXT_PUBLIC_BRIDGE_*) and REBUILD.
passed: 18/25 | failed: 7

## Sanitized sample (IDX-safe fields only)
```json
{
  "sample_mls_ids": [],
  "sample_prices": [
    "$2,950,000"
  ],
  "showing_count": 1,
  "card_count": 0,
  "geography_plausible": true,
  "status_plausible": true
}
```

| Check | Result | Detail |
|-------|:------:|--------|
| home.form.action | PASS | homepage form action must be /home-search/ |
| home.form.source | PASS | hidden source=home-hero input must be present |
| home.form.city | PASS | homepage form must have city input |
| home.form.minPrice | PASS | homepage form must have minPrice input |
| home.form.beds | PASS | homepage form must have beds input |
| home.form.floating | PASS | homepage form must carry floating-card marker for layout-regression detection |
| search.bridge-mode-marker | PASS | data-bridge-runtime-mode must be live|demo|fallback|ready|error (got fallback) |
| search.no-old-idx-runtime | PASS | no old IDX runtime in rendered DOM |
| search.results-region-rendered | PASS | search results / demo banner / loading / error must render after JS executes |
| search.bridge-surface-present | PASS | BridgeSearch form must be rendered on /home-search/ |
| search.idx-disclosure-rendered | PASS | IDX/MLS disclosure copy must render under fixture or live results |
| live.mode-is-live | FAIL | EXPECTED live, GOT fallback — Env vars missing at build time, or a stale static bundle is served. Fix Dokploy build args (NEXT_PUBLIC_BRIDGE_*) and REBUILD. |
| live.no-demo-banner | FAIL | no 'Demo data' banner may appear in live mode |
| live.no-feed-pending-copy | FAIL | no 'Live IDX feed pending' copy in live mode |
| live.no-demo-dataset-copy | PASS | no 'Bridge demo dataset connected' copy in live mode |
| live.no-demo-badge | FAIL | no DEMO badge / demo-disabled CTA on listing cards |
| live.no-fixtures | FAIL | no FIXTURE-* keys or 'Demo fixture' copy in rendered DOM |
| live.at-least-one-result | PASS | at least one live listing must render (cards=0, showing=1) |
| live.inquiry-enabled | FAIL | 'Inquire About This Property' CTA must be enabled on live cards |
| live.nonfixture-listing-key | FAIL | at least one plausible non-fixture MLS id (found 0) |
| live.plausible-price | PASS | at least one plausible price rendered (found 1) |
| live.plausible-status | PASS | at least one plausible listing status (Active / Coming Soon) |
| live.plausible-geography | PASS | at least one South Florida city or 33xxx/34xxx ZIP |
| live.idx-disclosure | PASS | IDX/MLS disclosure must remain visible in live mode |
| live.no-old-idx | PASS | no legacy MLS Matrix / IDX markers in live DOM |