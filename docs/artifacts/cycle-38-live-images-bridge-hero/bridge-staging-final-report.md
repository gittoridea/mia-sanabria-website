# Cycle 38 — Bridge Staging Final Report

date: 2026-05-16
target: `https://miasanabriarealtor.trueidea.com/`

## Mode classification

```yaml
bridge_runtime_mode_marker: demo                   # data-bridge-runtime-mode="demo"
bridge_runtime_source: bridge                      # data-bridge-source="bridge"
demo_banner_visible: true                          # "Demo data" found 1× in /home-search/ HTML
fixture_or_live_attribution_visible: fixture       # rendered Bridge surface uses FixtureAttribution branch
demo_badge_on_listing_cards: applies-on-search     # cards render with DEMO badge once a search executes (component logic preserved)
idx_mls_disclosure_present: true                   # "Equal Housing Opportunity" found 4× in /home-search/ HTML
returned_records_count_sample: n/a                 # no client-side fetch executed in static-HTML probe
records_appear_fixture_or_live: fixture-confirmed-by-mode
demo_honesty_correct_when_not_live: true
referrer_domain_blocked_observed: false            # no console errors visible in HTML; Bridge bundle loads
token_exposed_in_live_html: false                  # secret scan across 15 captured HTMLs = 0 hits
final_classification: demo_honest
```

## Probe transcript

### 1. Live `/home-search/` HTML

```
data-bridge-runtime-mode="demo"
data-bridge-source="bridge"
```

### 2. Demo banner + attribution scan

```
$ grep -ioE "Demo data|Equal Housing Opportunity|Bridge Data Output" \
  docs/artifacts/cycle-38-live-images-bridge-hero/staging-html/final/_home-search_.html | head -5
demo data
Equal Housing Opportunity
Equal Housing Opportunity
Equal Housing Opportunity
Equal Housing Opportunity
```

The "Demo data" string is rendered exactly once in the static HTML (above the form, by `DemoBanner` when `status.mode === "fallback"` or `BRIDGE_DEMO_MODE`); the multiple Equal Housing Opportunity hits are the IDX/MLS disclosure copy in `ListingAttribution` / `FixtureAttribution` / `ErrorPanel` (rendered as part of the default static-HTML render path).

### 3. Live secret scan

```
$ grep -RniE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|access_token=|refresh_token=|Bearer [A-Za-z0-9._-]+|DOKPLOY_API_TOKEN" \
  docs/artifacts/cycle-38-live-images-bridge-hero/staging-html/final 2>/dev/null
(no output)
```

0 hits. No tokens leaked into the rendered HTML.

## What this proves

- Bridge mode on staging is `demo` (Bridge test fixture connected).
- Demo honesty is fully preserved: demo banner visible, IDX/MLS Equal Housing Opportunity disclosure rendered, no claim of live feed.
- No token leakage into live HTML.
- Operator's referrer-domain update unblocked the technical request path but does not by itself flip the mode to live — that requires Dokploy build-arg changes documented in `bridge-referrer-domain-retest.md`.

## What this does NOT prove

- It does not classify the runtime as `live`. That requires a Dokploy build-arg change (operator-side decision).
- It does not test BridgeSearch auto-search with URL params end-to-end. The mechanism exists in source; live JS-driven testing is deferred.

## Final classification

`final_classification: demo_honest`. The Bridge truthfulness contract is intact on staging.
