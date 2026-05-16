# Cycle 38 — Staging Live Verification Report

date: 2026-05-16
staging_base: https://miasanabriarealtor.trueidea.com

## Live verification outcome

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
final_deploy_performed: true
deploy_exit_code: 0                  # from EXIT_CODE:0 in staging-deploy log
deployed_commit: 8eaf986c411d08db8c443387b74da72bdcc02293
needle_observed: "South Florida Lifestyle"
new_etag_observed: dijsfozvzncw52w9-gzip
deploy_duration_seconds: 164
home_http_status: 200
markets_http_status: 200
home_search_http_status: 200
homepage_hero_uses_reference_image: true     # src="/hero/mia-home-hero.jpg" rendered live
homepage_floating_search_visible: true       # at 375 / 768 / 1280 / 1440 — staging screenshots confirm
homepage_search_wires_to_bridge: true        # form action="/home-search/", hidden source=home-hero present
bridge_mode_on_staging: demo
real_live_feed_proven: false                 # Bridge test fixture (data-bridge-runtime-mode="demo")
demo_honesty_correct: true                   # demo banner ("Demo data") rendered; Equal Housing Opportunity disclosure rendered (4×)
old_idx_runtime_absent: true                 # 0 MlsMatrix/sef.mlsmatrix.com/IDXSearch hits across 15 captured live HTMLs
seven_named_neighborhoods:
  deerfield-beach:
    card_image_visible: true                 # img tag with src="/markets/deerfield-beach.jpg" present in chrome dump-dom of /markets/
    detail_hero_visible: true                # img tag with src="/markets/deerfield-beach.jpg" present in chrome dump-dom of /markets/deerfield-beach/
    live_asset_http_200: true
    natural_width_gt_0: true                 # asset 200 with 199686 bytes (matches repo) — JPEG decodes
    live_bytes_match_repo: true              # 199686 = 199686
    no_photo_available_in_dom: false
  hollywood:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 271516 = 271516
    no_photo_available_in_dom: false
  plantation:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 379393 = 379393
    no_photo_available_in_dom: false
  weston:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 405135 = 405135
    no_photo_available_in_dom: false
  coral-springs:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 394510 = 394510
    no_photo_available_in_dom: false
  davie:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 263928 = 263928
    no_photo_available_in_dom: false
  sunrise:
    card_image_visible: true
    detail_hero_visible: true
    live_asset_http_200: true
    natural_width_gt_0: true
    live_bytes_match_repo: true              # 222571 = 222571
    no_photo_available_in_dom: false
no_photo_available_count: 0
broken_images_count: 0
visual_qa_screenshot_count: 40              # 4 viewports × 10 routes captured under visual-qa/staging/
live_html_secret_scan_clean: true           # 0 hits across 15 captured live HTMLs
audit_home_bridge_search_live_pass: true    # 8/8 PASS against staging base
audit_neighborhood_images_deep_live_pass: true   # 23/23 PASS against staging base
final_result: live_verified
```

## Probe details

### Live HTTP/asset checks

All 14 image assets (7 hero × 7 OG) on staging returned HTTP 200 and exactly the byte count of the repo file — confirming the deployed assets match the Cycle 38 commit byte-for-byte. The homepage hero asset `/hero/mia-home-hero.jpg` also returned 200 (~191 KB).

### Live raw HTML scan

All 7 neighborhood detail HTMLs contain `<img … src="/markets/<slug>.jpg" …>` for their slug. `/markets/` index contains src refs for all 23 markets including the 7 newly regenerated. Homepage HTML contains `src="/hero/mia-home-hero.jpg"`, `<form … action="/home-search/">`, and `<input type="hidden" name="source" value="home-hero">`. /home-search/ contains `data-bridge-runtime-mode="demo"` and `data-bridge-source="bridge"`.

### Live Chrome dump-dom

`google-chrome --headless=new --dump-dom` against each `/markets/<slug>/` URL renders the expected `<img>` element. The `/markets/` index Chrome-rendered DOM contains all 7 slug card images. No "No photo available" placeholder appears anywhere.

### Live audits

- `bun run audit:home-bridge-search --base=https://miasanabriarealtor.trueidea.com` — 8/8 PASS.
- `bun run audit:neighborhood-images-deep --base=https://miasanabriarealtor.trueidea.com` — 23/23 PASS.

### Live secret scan

Grep for `BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|access_token=|refresh_token=|Bearer [A-Za-z0-9._-]+|DOKPLOY_API_TOKEN` across all 15 captured live HTMLs — 0 hits.

### Old IDX scan

Grep for `MlsMatrix|sef\.mlsmatrix\.com|idxbroker|ihomefinder|flexmls|showcaseidx|Matrix/Public/IDXSearch` across all 15 captured live HTMLs — 0 hits.

## Bridge mode classification

`data-bridge-runtime-mode="demo"` — Bridge test fixture connected. The visible UI on `/home-search/` shows a "Demo data" banner and renders Equal Housing Opportunity disclosure copy. **Demo honesty is correct**. No live feed claim, no removal of the demo banner.

The operator's referrer-domain update (this cycle's external change) does not by itself flip mode to live — that additionally requires Dokploy `NEXT_PUBLIC_BRIDGE_DEMO=false`, `NEXT_PUBLIC_BRIDGE_DATASET_ID` pointing at a live dataset (not `test_sf`), and `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` at an IDX path. None of those were changed this cycle. See `bridge-staging-final-report.md` and `bridge-truthfulness-report.md`.

## Visual QA staging

40 screenshots captured at 4 viewports (375×812, 768×1024, 1280×800, 1440×1000) across 10 live routes. Stored under `visual-qa/staging/`. See `visual-qa-staging-report.md`.

Manual visual review confirmed:

- Homepage: twilight waterfront hero renders behind navy copy panel; floating cream search card overlays the hero; CTAs route to `/home-search/` and `/contact/`.
- /home-search/: existing Bridge surface intact; demo banner visible; IDX/MLS disclosure present.
- /markets/: index renders 23 cards including all 7 newly regenerated.
- /markets/<slug>/ for each of the 7: full-bleed photorealistic hero, no frame, no white margin.

## Final result

`final_result: live_verified`. Cycle 38's hard completion standard is met for AI-closeable scope. Bridge live activation, production cutover, and Mia's visual approval remain external.
