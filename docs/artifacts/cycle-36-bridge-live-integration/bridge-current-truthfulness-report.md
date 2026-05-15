# Bridge Current Truthfulness Report

**Generated:** 2026-05-14T22:05Z
**Staging base:** `https://miasanabriarealtor.trueidea.com`
**Method:** secret-safe re-probe of current staging HTML + chunk-needle cross-check (no token values printed or persisted)
**Companion to:** `bridge-staging-before-deploy-report.md`, `bridge-architecture-audit.md`

## Local credential presence (post-resume re-check)

```yaml
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN: missing
NEXT_PUBLIC_BRIDGE_DATASET_ID:    missing
NEXT_PUBLIC_BRIDGE_RESOURCE_PATH: missing
NEXT_PUBLIC_BRIDGE_DEMO:          missing
BRIDGE_SERVER_TOKEN:              missing
BRIDGE_CLIENT_SECRET:             missing
BRIDGE_CLIENT_ID:                 missing
BRIDGE_DATASET_ID:                missing
DOKPLOY_API_URL:                  missing (in default shell; present only when ~/.claude/.env is sourced)
DOKPLOY_API_TOKEN:                missing (in default shell; present only when ~/.claude/.env is sourced)
```

Local Bridge env vars remain missing. This is expected per Cycle 33B credential policy — Bridge values live in Dokploy build args, not on this dev host.

## Probe run

`bun run scripts/probe-bridge-live.ts` short-circuited with `endpointConfigured=false` and `requestAttempted=false` (per `bridge-live-probe-result.json`). The probe correctly refused to fabricate evidence and returned `nextAction: "Probe staging site directly"`.

## Current staging probe (no secrets printed)

`curl -L https://miasanabriarealtor.trueidea.com/home-search/` → HTTP/2 200 (verified twice, cache-busted via no-store header). Saved to `docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/_home-search_.html` (50,788 bytes for cache-busted query path; 69,370 bytes for the city-filter variants).

```yaml
home_search_chunk_reference: /_next/static/chunks/app/home-search/page-4e686a00462ff90a.js
home_search_chunk_unchanged_since_cycle_36_initial_probe: true
home_search_http_200: true
home_search_h1: "Home Search"
home_search_hero_eyebrow: "South Florida Lifestyle"   # × 2 in HTML (hero + meta)
section_heading: "Search available Southeast Florida listings."  # × 4 in HTML
lpt_realty_present: true (× 19 across page chrome)
mia_sanabria_present: true (× 18)
mlsmatrix_fallback_rendered: false   # no `sef.mlsmatrix` or "Bridge listing search is being activated" in initial HTML
bridge_form_rendered: true            # `City / Min price / Bedrooms / Search listings` form expected per chunk
```

## Why no DEMO banner in the initial HTML

`<BridgeSearch>` renders a `<DemoBanner />` ONLY after a search executes and returns results (`searched && listings.length > 0`). The static export ships the form without pre-rendered results, so neither the DemoBanner nor the per-card DEMO pill appears in the SSR HTML. This matches the previously documented chunk behavior. **It does NOT mean demo mode is off** — the chunk still has `BRIDGE_DEMO=true` and `demoMode:true` baked in, both gating these UI elements on the client side post-search.

## Mode classification

```yaml
bridge_mode_current: demo
real_live_feed_proven: false
evidence:
  local_probe: endpointConfigured=false (credentials absent locally)
  current_staging_html:
    chunk_reference_unchanged: page-4e686a00462ff90a.js (Cycle 33B build)
    initial_render_shows_form: true
    initial_render_shows_demo_banner: false (only renders client-side post-search per design)
    initial_render_shows_mls_iframe_fallback: false (BRIDGE_AVAILABLE=true on staging)
  chunk_needle_inspection_from_cycle_36_initial:
    NEXT_PUBLIC_BRIDGE_DATASET_ID_literal: test_sf
    NEXT_PUBLIC_BRIDGE_DEMO_literal: true
    BridgeListingCard_demoMode_prop_literal: true
    DemoBanner_rendered_unconditionally_in_results_branch: true
  demo_banner_visible: gated until post-search (chunk has it on)
  demo_badges_visible: gated until post-search (chunk has them on)
  idx_disclosure_visible: gated to non-demo mode (currently NOT rendered because demo mode is on)
  city_filter_visible: yes (form is in initial HTML)
  listings_visible: not in initial HTML (client-side fetch on submit)
exact_external_blocker_if_not_live: |
  Mia + Bridge dashboard must:
    1. Provision a non-test (production) dataset that returns SE Florida MLS records.
    2. Update Dokploy build args:
       - NEXT_PUBLIC_BRIDGE_DATASET_ID = <production dataset id, NOT test_sf>
       - NEXT_PUBLIC_BRIDGE_RESOURCE_PATH = idx/Properties (IDX-licensed feed path)
       - NEXT_PUBLIC_BRIDGE_DEMO = false
       - NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN = <production browser token>
    3. Set Referrer Domain restriction in Bridge dashboard for staging + production hosts.
    4. Trigger a Dokploy rebuild so the new env values bake into the chunk.
  Until (1)-(4) happen externally, this codebase has no way to make the staging chunk
  query Mia inventory — the dataset id is build-frozen and currently points at the
  Bridge San-Francisco TEST fixture.
```

## What "Mia says Bridge should be working" means right now

Mia's statement is consistent with what is deployed: the Bridge **integration code path** works (form renders, would execute a search, would render result cards with DEMO badges, would gracefully fall back to MLS Matrix iframe on credential failure). What is NOT working is the **data path** — the dataset literal `test_sf` returns San Francisco fixtures, not Mia's Southeast Florida inventory. This is a Dokploy-build-arg / Bridge-dashboard issue, not a code issue.

## Decision

Do not remove demo UI. Demo honesty is preserved. No source changes proposed in this cycle for the Bridge integration.

If/when the production dataset is provisioned and Mia + Torrey confirm the build args are flipped, a single Dokploy redeploy is sufficient — no codebase change is required to switch the UI from demo to live mode.

## Cycle 36D resume revalidation (2026-05-15)

Re-run after SSH crash recovery:

```yaml
local_credential_presence_re_check:
  all_BRIDGE_*_vars: missing   # unchanged from 2026-05-14 probe
  all_NEXT_PUBLIC_BRIDGE_*_vars: missing
probe_re_run:
  timestamp: 2026-05-15T20:45:35.667Z
  endpointConfigured: false
  requestAttempted: false
  recordCount: 0
  sampleClassification: unknown
  next_action: same as prior run — Bridge dataset/values live in Dokploy build args
staging_html_re_fetch:
  url: https://miasanabriarealtor.trueidea.com/home-search/
  http_status: 200
  etag: "diijwdedso3k1hiy"
  last_modified: "Thu, 14 May 2026 16:46:59 GMT"   # Cycle 33B build still on staging
  bytes: 69370
  chunk_reference: /_next/static/chunks/app/home-search/page-4e686a00462ff90a.js
  chunk_reference_changed_since_cycle_36_initial: false
  hero_eyebrow_present: true   # "South Florida Lifestyle" × 2
  h1_present: true             # "Home Search" × 13
  southeast_florida_phrase_count: 14
  mia_sanabria_phrase_count: 18
  lpt_realty_phrase_count: 19
  bridge_phrase_count_lowercase: 6   # form labels, demo banner copy variants
  bridge_phrase_count_titlecase: 1
  mls_keyword_count: 2
  mlsmatrix_iframe_fallback_rendered: false   # BRIDGE_AVAILABLE=true on this build
classification_after_resume:
  bridge_mode_current: demo     # unchanged
  real_live_feed_proven: false  # unchanged
  decision: preserve demo honesty; no Bridge UI changes in Cycle 36D
post_phase_10_expectation:
  staging_chunk_hash_will_change: true       # Phase 10 deploy will rebuild
  bridge_mode_will_change: false             # Dokploy build args unchanged
  demo_honesty_remains_correct: true
  external_blocker_for_live_mode: unchanged — Mia + Bridge dashboard must provision non-test dataset and flip Dokploy build args
```

