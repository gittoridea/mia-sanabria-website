# Cycle 39 — Staging Live Verification Report

date: 2026-05-16
staging_base: https://miasanabriarealtor.trueidea.com

## Live verification outcome

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
final_deploy_performed: true
deploy_exit_code: 0
deployed_commit: 889b2c2b117c9bc5fd5bcfc8b97f82e21bae0978
origin_main_at_verify: 889b2c2b117c9bc5fd5bcfc8b97f82e21bae0978
deployed_commit_equals_origin_main: true
needle_observed: "South Florida Lifestyle"
new_etag_observed: dik4rd71i96o5372-gzip
deploy_duration_seconds: 106

home_http_status: 200
home_search_http_status: 200
markets_http_status: 200

homepage_hero_uses_versioned_path: true       # /hero/mia-home-hero-cycle39.jpg
homepage_hero_unversioned_path_absent: true   # 0 src="/hero/mia-home-hero.jpg" refs
homepage_floating_search_visible: true        # data-floating="true" marker present
homepage_search_wires_to_bridge: true         # form action=/home-search/, hidden source=home-hero, filter inputs

bridge_mode_on_staging: demo
real_live_feed_proven: false
demo_honesty_correct: true
old_idx_runtime_absent: true                  # audit:no-old-idx PASS + live HTML scan clean

seven_named_neighborhoods:
  deerfield-beach:
    versioned_card_path: /markets/deerfield-beach-cycle39.jpg
    versioned_detail_path: /markets/deerfield-beach-cycle39.jpg
    live_card_in_index_html: true       # 2 ref(s) found
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 199686
  hollywood:
    versioned_card_path: /markets/hollywood-cycle39.jpg
    versioned_detail_path: /markets/hollywood-cycle39.jpg
    live_card_in_index_html: true       # 3 ref(s)
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 271516
  plantation:
    versioned_card_path: /markets/plantation-cycle39.jpg
    versioned_detail_path: /markets/plantation-cycle39.jpg
    live_card_in_index_html: true       # 7 ref(s) — many related-markets links
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 379393
  weston:
    versioned_card_path: /markets/weston-cycle39.jpg
    versioned_detail_path: /markets/weston-cycle39.jpg
    live_card_in_index_html: true       # 5 ref(s)
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 405135
  coral-springs:
    versioned_card_path: /markets/coral-springs-cycle39.jpg
    versioned_detail_path: /markets/coral-springs-cycle39.jpg
    live_card_in_index_html: true       # 5 ref(s)
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 394510
  davie:
    versioned_card_path: /markets/davie-cycle39.jpg
    versioned_detail_path: /markets/davie-cycle39.jpg
    live_card_in_index_html: true       # 6 ref(s)
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 263928
  sunrise:
    versioned_card_path: /markets/sunrise-cycle39.jpg
    versioned_detail_path: /markets/sunrise-cycle39.jpg
    live_card_in_index_html: true       # 6 ref(s)
    live_detail_in_detail_html: true
    unversioned_src_in_live_html: false
    live_asset_http_200: true
    live_bytes_match_repo: true         # 222571

bridge:
  mode: demo
  banner_visible: true
  data_bridge_runtime_mode_attribute: demo
  data_bridge_source_attribute: bridge
  idx_disclosure_visible: true
  e2e_pass_local: true                  # 11/11 mode=fallback (no token local)
  e2e_pass_staging: true                # 11/11 mode=demo

audits_against_live_base:
  audit_neighborhood_images_deep_live_pass: true   # 23/23
  audit_home_bridge_search_live_pass: true         # 8/8
  audit_no_old_idx: true                            # 480 files scanned

live_html_secret_scan_clean: true       # see secret-safety-report.md
final_result: live_verified
```

## Probe details

### Live HTTP HEAD checks for 14 versioned assets + homepage hero

All 14 assets returned HTTP 200 with content-length matching the repo
file byte count exactly. Homepage hero asset
`/hero/mia-home-hero-cycle39.jpg` returned 200, 195246 bytes (matches
repo).

### Live raw HTML scan

All 7 neighborhood detail HTMLs and the `/markets/` index HTML contain
`/markets/<slug>-cycle39.jpg` for each versioned slug. ZERO occurrences
of the unversioned `src="/markets/<slug>.jpg"` for any of the seven
versioned slugs across the 10 captured live HTML files. Homepage HTML
contains `src="/hero/mia-home-hero-cycle39.jpg"` and `<form
action="/home-search/">` with `<input type="hidden" name="source"
value="home-hero">`. `/home-search/` contains `data-bridge-runtime-mode="demo"`
and `data-bridge-source="bridge"`.

### Live audits

- `bun run audit:home-bridge-search --base=https://miasanabriarealtor.trueidea.com` — 8/8 PASS.
- `bun run audit:neighborhood-images-deep --base=https://miasanabriarealtor.trueidea.com` — 23/23 PASS (Cycle 39 versioned-path enforcement active and PASSED for all 7 versioned slugs).
- `bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com` — 11/11 PASS with mode=demo.

### Old IDX scan

Manual grep across 10 captured live HTMLs for
`MlsMatrix|sef\.mlsmatrix\.com|idxbroker|ihomefinder|flexmls|showcaseidx`
returns 0 runtime hits. Same grep across `src public out` returns only
historical/comment references; no runtime code path.

## Bridge mode classification

`data-bridge-runtime-mode="demo"` — Bridge test fixture connected. The
visible UI on `/home-search/` renders a "Demo data" banner and the Equal
Housing Opportunity / IDX-MLS disclosure copy. **Demo honesty correct**.
No live feed claim, no removal of the demo banner.

The operator's referrer-domain update (acknowledged in Cycle 38) does
not by itself flip mode to live — that additionally requires Dokploy
`NEXT_PUBLIC_BRIDGE_DEMO=false`, `NEXT_PUBLIC_BRIDGE_DATASET_ID`
pointing at a live dataset (not `test_sf`), and Bridge IDX feed approval
finalized. None of those changed this cycle. See
`bridge-truthfulness-report.md`.

## Visual QA staging

Live-after capture session: `mia-c39-live-after-20260516-105702`
(in-flight at write time). Will produce up to 144 screenshots across 4
viewports under
`docs/artifacts/cycle-39-visual-truth-recovery/live-after/screenshots/`.
See `live-visual-qa-report.md` for vision-grade review when capture
completes.

## Final result

`final_result: live_verified`. Cycle 39's hard completion standard
(versioned-path republish + JS-path E2E proof + reference-hero divergence
documentation) is met for AI-closeable scope. Bridge live activation,
production cutover, Mia's visual approval, and the operator's
twilight-vs-daytime hero decision remain external.
