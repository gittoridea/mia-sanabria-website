---
cycle: 41
artifact: staging-live-verification-report
generated_at: 2026-05-17
staging_base: https://miasanabriarealtor.trueidea.com
---

# Cycle 41 — Staging Live Verification Report

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
deployed_commit: e63a35eb10bb1ebd565ef29767c4bf5f10213648
origin_main_post_deploy: e63a35eb10bb1ebd565ef29767c4bf5f10213648
deployed_commit_equals_origin_main: true

deploy_metadata:
  tmux_session: mia-cycle41-staging-deploy-20260517-102742
  deploy_seconds: 164
  pre_deploy_last_modified: "Sun, 17 May 2026 03:37:29 GMT"   # Caddy cached value, see warn below
  post_deploy_last_modified: "Sun, 17 May 2026 03:37:29 GMT"  # same value reported, see warn
  post_deploy_caddy_warn: |
    "last-modified did not change — Caddy may be caching even with bust headers"
    — same documented variance as Cycle 38/39/40C. ETag flipped + Cycle 41
    DOM markers present in live HTML, so the deploy landed; the Last-Modified
    header is being served from a Caddy cache layer that doesn't bust on
    query string. Independent verification below.
  live_etag_after_deploy: "dikmziraia68541d-gzip" (deploy script wait-for-needle read)
  live_etag_at_verification: "dil18zdpf3eo53sd" (post-deploy curl)
  needle_present_after_seconds: 0

dom_marker_verification:
  data-hero-copy-panel-version: cycle41          ✓
  data-hero-overlay-version: cycle41             ✓
  data-hero-search-version: cycle41              ✓
  data-hero-cta-version: cycle40b                ✓ (preserved from prior cycle; CTAs structurally unchanged in Cycle 41)
  data-home-hero-search: "true"                  ✓
  data-hero-eyebrow: ABSENT                      ✓ (Cycle 41 eyebrow removal landed)
  "South Florida Lifestyle" occurrences: 1 (inside H1, as expected)
  "data-hero-eyebrow" occurrences: 0

homepage:
  hero_production_grade: true
  image_anchor_visible: true
  dark_panel_dominates: false
  search_integrated: true
  search_too_wide_or_utilitarian: false
  vertical_rhythm_pass: true
  320x800:
    pass: true (after fresh-cachebuster recapture)
    visual_description: |
      Dark navy panel inset 16px from edges. H1 "SOUTH FLORIDA LIFESTYLE / HOME SEARCH"
      reads as the first text element. No eyebrow above the H1. Sub-text "Discreet, local
      guidance..." Below it, two CTAs (brass primary + outlined secondary). Search card
      below the hero with three stacked fields.
    note: |
      First capture pass at 14:48 caught Caddy-cached stale HTML showing an eyebrow.
      Re-capture at 14:55 with 20s vtb hit a fresh cache entry and confirms the eyebrow
      is gone. Live HTML curl independently confirms.
  360x800:
    pass: true
    visual_description: same shape as 320 with proportional sizing
  375x812:
    pass: true
    visual_description: |
      H1 + sub + 2 CTAs land cleanly inside the panel. No eyebrow line.
      Panel uses bg-navy-900/90 (small-mobile readability), border-l-2
      border-brass-300 left edge. Search card immediately below.
  390x844:
    pass: true
    visual_description: same as 375 with slightly more breathing room
  414x896:
    pass: true
    visual_description: same as 375 with more horizontal room
  430x932:
    pass: true
    visual_description: same as 414 with slightly larger CTAs
  768x1024:
    pass: true
    visual_description: |
      Hero now ~50% navy panel / ~50% waterfront image. Panel covers the
      top-left ~448px (max-w-md), waterfront house with infinity pool and
      palms clearly visible to the right. Cream search card below.
      Tight transition into "MIA'S SERVICE AREAS" / "WHERE MIA REPRESENTS".
  1024x768:
    pass: true
    visual_description: |
      Image-forward. Navy panel covers ~35% of hero from left. Waterfront
      house, pool, palms occupy the remaining ~65%. Search card narrower
      (max-w-4xl) centered horizontally.
  1280x800:
    pass: true
    visual_description: |
      Image is unambiguously the visual lead. Panel covers ~30% of hero,
      lighter bg-navy-900/68 lets the waterfront read through it.
      Search card ~896px centered, 3 fields + brass button on one row.
      Tight rhythm into "WHERE MIA REPRESENTS".
  1440x1000:
    pass: true
    visual_description: |
      Reference desktop state. Panel ~30% width, image ~70%. H1 is the
      focal point. 2 stacked CTAs in panel. Search card 896px centered.
      ~40px breathing room into "MIA'S SERVICE AREAS" / "WHERE MIA REPRESENTS
      BUYERS AND SELLERS" — tight, intentional.
  1536x864:
    pass: true
    visual_description: |
      Same composition as 1440 with slightly more horizontal room.
      Panel uses xl:max-w-lg (~512px) so it grows minimally; image still
      dominates.

bridge:
  mode: demo
  e2e_pass: true (11/11 PASS)
  audit_home_bridge_search_pass: true (8/8 PASS)
  demo_honesty_correct: true (honest demo banner visible at /home-search/)

old_idx_absent: true
audit_no_old_idx: PASS (481 files scanned)
live_html_secret_scan: clean (no BRIDGE_*_TOKEN/SECRET, no GOOGLE/GEMINI/OPENAI_API_KEY, no Bearer/access_token/refresh_token strings)

final_result: live_verified
```

## Method

1. After EXIT_CODE:0 from the tmux deploy session, ran capture-baseline against `https://miasanabriarealtor.trueidea.com` at 11 viewports × 3 routes (33 screenshots).
2. Inspected key viewports with the Read tool, producing verbal descriptions per row.
3. Caught one Caddy cache-stale capture artifact at 320/375 (stale HTML with eyebrow); confirmed via live HTML curl that the live HTML is clean (0 `data-hero-eyebrow`, 1 `South Florida Lifestyle` inside H1, all Cycle 41 DOM markers present). Re-captured 8 viewports with longer 22s vtb past the Caddy stale-cache window.
4. Ran `bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com` → 11/11 PASS, mode=demo.
5. Ran `bun run audit:no-old-idx` → PASS (481 files).
6. Ran `bun run audit:home-bridge-search -- --base=https://miasanabriarealtor.trueidea.com` → 8/8 PASS.
7. Fetched 3 routes' HTML (no raw chunks downloaded). Secret-shape scan → clean.
8. Cross-checked deployed commit vs origin/main HEAD: `e63a35e == e63a35e`. Aligned.

## Cache-stale observation

The first capture pass at 14:48 (16 min after deploy completion) caught Caddy-cached stale HTML at 320 and 375 — those captures showed the prior `eyebrow="South Florida Lifestyle"` rendered above the H1. Live HTML curl at the same time showed no eyebrow element (`grep -c 'data-hero-eyebrow' = 0`). Re-capture at 14:55 with 20-22s vtb past the next Caddy refresh window confirmed all mobile viewports render the Cycle 41 layout. Same Cycle 38/39/40C documented Caddy behavior — query-string cachebuster doesn't bust at all Caddy cache layers; the staging environment serves stale entries up to ~5 min after each cache refresh. The chrome --headless vtb=18s capture occasionally finishes within a Caddy stale window. The cycle uses the live HTML curl (no Caddy stale issue) as the authoritative state.
