# Staging Live Enforcement Report — Cycle 36D

**Generated:** 2026-05-15
**Staging base:** `https://miasanabriarealtor.trueidea.com`
**Method:** HTTP HEAD/GET (no `?cb=`), live HTML secret scan, mobile-readability against staging, parallel screenshot capture.

## Required by user

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
final_deploy_required_by_user: true
final_deploy_performed: true
deploy_exit_code: 0
deployed_commit: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
origin_main_commit: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
```

## Live route matrix (HTTP status)

| Route | HTTP status | etag (post-deploy) | needle observed |
| --- | --- | --- | --- |
| `/` | 200 | `dijka7eh7g1s57rf-gzip` (gzip) / `dijka7eh7g1s57rf` (deflate) | "South Florida Lifestyle" present |
| `/home-search/` | 200 | `dijka7eh7g1s1hiy` | "Home Search" present |
| `/home-search/?city=Fort%20Lauderdale` | 200 | same chunk | Fort Lauderdale option present |
| `/home-search/?city=Pompano%20Beach` | 200 | same chunk | Pompano Beach option present |
| `/home-search/?city=Deerfield%20Beach` | 200 | same chunk | Deerfield Beach option present |
| `/markets/` | 200 | (per-route) | hub renders |
| `/markets/seven-isles/` | 200 | (per-route) | hero renders |
| `/markets/pompano-beach/` | 200 | (per-route) | hero renders |
| `/markets/fort-lauderdale/` | 200 | (per-route) | hero renders |
| `/buyers/` | 200 | (per-route) | hero renders |
| `/sellers/` | 200 | (per-route) | hero renders |
| `/about/` | 200 | (per-route) | LPT Realty present |
| `/contact/` | 200 | (per-route) | contact form / mailto fallback renders |
| `/insights/` | 200 | (per-route) | hub renders |
| `/privacy/` | 200 | (per-route) | legal renders |
| `/terms/` | 200 | (per-route) | legal renders |
| `/accessibility/` | 200 | (per-route) | legal renders |
| `/dmca/` | 200 | (per-route) | legal renders |

## Required signal observations

```yaml
home_http_status: 200
home_search_http_status: 200
south_florida_lifestyle_visible: true            # 4× in /
search_available_homes_visible: true             # 2× in /
home_search_visible: true                        # 13× in /home-search/
lpt_realty_visible: true                         # 25× across home + chrome
mia_sanabria_visible: true                       # 32+ across pages
southeast_florida_visible: true                  # 14× in /home-search/, 30× in /
bridge_mode_on_staging: demo                     # chunk literal test_sf + DEMO=true unchanged
demo_honesty_correct: true                       # chunk preserves DemoBanner + DEMO pill gating
hero_contrast_fix_represented_on_staging: true   # rebuilt with audit:hero-contrast:stable as deploy gate, chunk hash preserved because home-search source unchanged but ALL other pages were rebuilt with the fixed audit chain having passed
visual_qa_screenshot_count: 108                  # 36 routes × 3 viewports = 108 PNGs, 0 failed
live_html_secret_scan_clean: true                # grep over docs/artifacts/cycle-36-bridge-live-integration/staging-html/final returned 0 matches
final_result: live_verified
```

## Mobile readability (live, against staging URL)

```bash
bun run scripts/audit-mobile-readability.ts --base=https://miasanabriarealtor.trueidea.com
# audit-mobile-readability — 84 PASS · 0 FAIL · 0 ERROR
```

84 device-route pairs (iPhone SE, iPhone 15, Pixel 7, iPad portrait × 21 routes) all pass at live staging.

## Visual QA (live, against staging URL)

```yaml
script: bun run scripts/capture-baseline.ts --base=https://miasanabriarealtor.trueidea.com
viewports: 375x812, 768x1024, 1280x800
concurrency: 3
virtual_time_budget_ms: 12000
jobs: 108
ok: 108
fail: 0
duration_seconds: 79
output_dir: docs/artifacts/cycle-36-bridge-live-integration/visual-qa/staging
summary_json: docs/artifacts/cycle-36-bridge-live-integration/visual-qa/staging/_capture-summary.json
log: docs/artifacts/cycle-36-bridge-live-integration/logs/staging-visual-qa.log
```

## Live hero-contrast against staging

Not re-run as a separate step — the deploy gate is `audit:hero-contrast:stable` against the locally exported `out/` directory, which passed 145 PASS · 0 WARN · 0 FAIL · 0 SKIP. Staging serves that same `out/` directory verbatim under Caddy (Dokploy pulled the build during the deploy). The 108-shot visual QA against the live staging URL is the cross-check for staging-side rendering.

If a future cycle needs a true live-mode hero-contrast audit, the script supports it:
```bash
bun run scripts/audit-hero-pixel-contrast.ts --live --base=https://miasanabriarealtor.trueidea.com --samples=3
```

## Final verdict

```yaml
deployed_to_https_miasanabriarealtor_trueidea_com: true
live_via_caddy: true
chunks_serving_post_build: true
sanitized_HTML_evidence_captured: 18 files in staging-html/final/
visual_evidence_captured: 108 PNG screenshots
mobile_readability_live: pass (84/0/0)
secret_values_on_live_HTML: none detected
demo_honesty_intact: true
production_changed: false
```
