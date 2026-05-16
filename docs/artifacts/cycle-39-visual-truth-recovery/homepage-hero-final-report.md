# Cycle 39 — Homepage Hero Final Report

date: 2026-05-16

## Fields

```yaml
target: https://miasanabriarealtor.trueidea.com/
deploy: 889b2c2 (Cycle 39 staging)
home_http_status: 200
home_etag: "dik4rd71i96o5372-gzip"
home_search_http_status: 200
hero_asset_path_in_dom: /hero/mia-home-hero-cycle39.jpg
hero_asset_unversioned_in_dom: false
hero_asset_http_status: 200
hero_asset_bytes_live_vs_repo: 195246 == 195246 (match)
hero_asset_content_type: image/jpeg
cycle_39_panel_marker_in_dom: "data-hero-copy-panel-version=\"cycle39\""
mobile_panel_opacity_class_in_dom: "bg-navy-900/85"
mobile_panel_overflow_hidden_class_in_dom: true
sub_text_max_w_full_class_in_dom: true (max-w-full mobile, sm:max-w-xl)
heading_max_w_full_class_in_dom: true
locked_h1_preserved:
  line_1: "South Florida Lifestyle"
  line_2: "Home Search"
locked_eyebrow_preserved: "SOUTH FLORIDA LIFESTYLE"
floating_search_visible_at_375: true   # data-floating="true" marker
floating_search_visible_at_768: true
floating_search_visible_at_1280: true
floating_search_visible_at_1440: true
form_action_is_home_search: true        # action="/home-search/"
hidden_source_input_present: true       # name="source" value="home-hero"
filter_inputs_present: city=true minPrice=true beds=true
audit_brand_pass: true                   # 12/0/0
audit_hero_contrast_stable_pass: true    # 145/0/0
audit_home_bridge_search_live_pass: true # 8/8
audit_mobile_readability_pass: true      # 84/0/0
e2e_home_bridge_search_local_pass: true  # 11/11 mode=fallback
e2e_home_bridge_search_staging_pass: true # 11/11 mode=demo
operator_authorized_twilight_hero_preserved: true
actual_reference_hero_swap_deferred_to_operator: true   # see reference-hero-visual-extraction.md
final_result: live_verified
```

## What changed vs Cycle 38

- Hero asset URL versioned: `/hero/mia-home-hero.jpg` → `/hero/mia-home-hero-cycle39.jpg`.
  Bytes identical; URL change defeats cache.
- Mobile panel opacity: `bg-navy-900/95` → `bg-navy-900/85` at the
  smallest viewport, ramped to `/90` at 375px, `/92` at sm, default at
  lg+. Image now bleeds through.
- Mobile sub-text width: `max-w-xl` (576px) → `max-w-full` on mobile,
  `sm:max-w-xl` reactivated at ≥640px. Sub-text can no longer overflow
  panel rightward on mobile.
- Mobile heading width: `max-w-[27ch]` → `max-w-full`. `[overflow-wrap:anywhere]`
  already wrapped gracefully.
- Copy panel: added `overflow-hidden` so even if a future copy edit
  exceeded the wrapper, no visual overflow.
- Added `data-hero-copy-panel-version="cycle39"` DOM attribute as a
  future-regression detection marker.

## What did NOT change

- Locked H1 "South Florida Lifestyle / Home Search" (decision record §Homepage hero).
- Locked eyebrow "South Florida Lifestyle".
- Operator-authorized twilight waterfront composition (Cycle 38
  authorization preserved).
- Floating search card structure (`-mt-20 sm:-mt-24` + `pointer-events-none`
  outer wrapper + `pointer-events-auto` inner).
- Bridge wiring and BridgeSearch URL-param auto-search behavior.

## Operator decisions pending

- Twilight composition (current Cycle 39 state, operator-authorized) vs
  actual visible miasanabria.com daytime composition (a single-file
  replacement at the already-versioned local path; no code change
  needed). See `reference-hero-visual-extraction.md`.
- Mia's visual approval of the deployed staging hero treatment.
- Production-cutover decision (DNS, GHL, branded email) — separate
  mission.
