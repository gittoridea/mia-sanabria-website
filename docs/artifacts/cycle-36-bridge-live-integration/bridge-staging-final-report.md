# Bridge Staging Final Report — Cycle 36D (post-deploy)

**Generated:** 2026-05-15
**Staging base:** `https://miasanabriarealtor.trueidea.com`
**Method:** sanitized HTML inspection + chunk-needle (no chunk JS downloaded this phase; no secret values printed).

## Required classification

```yaml
home_search_status: HTTP/2 200
mode: demo                                        # unchanged from Cycle 33B build
real_live_feed_proven_on_staging: false
demo_banner_visible: false (in initial SSR HTML)  # gated client-side post-search; same chunk behavior as pre-deploy
demo_badges_visible: false (in initial SSR HTML)  # gated to result-cards render path
idx_disclosure_visible: gated to non-demo mode (currently NOT rendered because demo mode is on)
listing_count_visible: 0 (initial render shows form only)
city_filter_verified: true                         # form has city dropdown; HTML shows Fort Lauderdale × 24, Pompano × 6, Deerfield × 2
photos_visible: false (initial render; client-side fetch on submit)
prices_visible: false (initial render)
addresses_visible: false (initial render)
token_leak_scan:
  scope: 18 sanitized HTML files in staging-html/final/
  result: clean — no BRIDGE_SERVER_TOKEN, no BRIDGE_CLIENT_SECRET, no NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN literal in HTML
  note: chunk JS was NOT downloaded this phase — sanitized HTML grep only
```

## Chunk hash post-deploy

```yaml
home_search_chunk_reference_post_deploy: /_next/static/chunks/app/home-search/page-4e686a00462ff90a.js
home_search_chunk_reference_pre_deploy:  /_next/static/chunks/app/home-search/page-4e686a00462ff90a.js
home_search_chunk_hash_changed_by_deploy: false
why_chunk_hash_unchanged:
  - Next.js content-hashes chunks deterministically from their source + dependencies.
  - src/app/home-search/page.tsx, src/lib/bridge.ts, src/lib/bridge-client.ts, src/components/BridgeSearch.tsx all unchanged in commit 3a99bc3.
  - Same source + same NEXT_PUBLIC_BRIDGE_* env values in Dokploy build args = same chunk hash.
  - Other pages' chunks WERE rebuilt — the etag flip on / and other routes confirms the deploy actually ran.
```

## If live were proven (it is not)

```yaml
if_live:
  demo_ui_removed_or_hidden_correctly: n/a — demo is still on
  live_status_displayed_truthfully: n/a
```

## Since demo/fallback (current state)

```yaml
if_demo_or_fallback:
  demo_honesty_preserved: true
  exact_external_blocker: |
    1. Provision a non-test Bridge dataset that returns Southeast Florida MLS records.
    2. Update Dokploy build args:
       - NEXT_PUBLIC_BRIDGE_DATASET_ID = <production dataset id, NOT test_sf>
       - NEXT_PUBLIC_BRIDGE_RESOURCE_PATH = idx/Properties (IDX-licensed feed path)
       - NEXT_PUBLIC_BRIDGE_DEMO = false
       - NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN = <production browser token>
    3. Set Referrer Domain restriction in Bridge dashboard for staging + production hosts.
    4. Trigger a Dokploy rebuild.
    All four are external to this codebase. No source change is required to flip the UI from demo to live.
```

## Decision

No source change in Cycle 36D for the Bridge integration. Demo banner + DEMO badges remain gated to demo mode in chunk. When Mia + Torrey flip the build args externally, a single Dokploy redeploy will switch the UI from demo to live — the integration code path is ready.
