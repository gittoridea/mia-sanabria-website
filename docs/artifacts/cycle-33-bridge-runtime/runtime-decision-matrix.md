# Cycle 33 — Bridge IDX Runtime Decision Matrix

**Date:** 2026-05-14
**Decision ID:** MIA-BRIDGE-RUNTIME-001

## Architecture Context

| Question | Answer |
|---|---|
| `next.config.ts` uses `output: "export"`? | **Yes** — pure static export |
| Next Route Handlers deployable? | **No** — static export removes Node runtime |
| Caddy serves only static files? | **Yes** — pure file_server, no proxy |
| Existing server/API runtime in repo? | **No** |
| Can Bridge proxy be hosted in this repo without deployment model change? | **No without architectural change** |
| Worker/sidecar proxy safer than changing from static export? | **Yes — lower blast radius** |

## Options Considered

### Option A — Bridge-hosted iframe / vendor embed

Bridge does not provide a hosted IDX search widget or embeddable search page in their documented platform. The existing MLS Matrix iframe (`https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx`) is a separate MLS-vendor tool, not Bridge's. This option does not apply.

### Option B — Server-side proxy in existing app runtime

Would require dropping `output: "export"` from `next.config.ts` and switching to `output: "standalone"` (SSR) or a separate Next.js API route runtime. Requires Dokploy build-type change, new Caddy→Node runtime swap, and re-architecture of the container. High blast radius for this cycle.

### Option C — External proxy / edge Worker / sidecar

A Cloudflare Worker or Dokploy Node sidecar would hold `BRIDGE_SERVER_TOKEN`, call Bridge at `/idx/Properties`, sanitize the response, and return it as JSON. The static site would fetch from the Worker URL. Keeps static export intact. Requires a separate deployment surface and Torrey-approved deploy step. Valid as a v2 upgrade path.

### Option D — Browser-token direct client

Bridge explicitly documents: "Browser Token — Used for websites that may query the API directly from the browser; be sure to set the Referrer Domain if you use this approach." CORS is reflective (any origin gets `access-control-allow-origin`), so browser fetch works. Referrer Domain restriction in Bridge dashboard limits token abuse to the canonical domain. `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` bakes the token into the static bundle at build time. The IDX endpoint (`/idx/Properties`) automatically filters to IDX-appropriate records. Server token and client secret are never needed in the browser.

### Option E — No live IDX yet / documented launch exception

Current fallback: MLS Matrix iframe (`IdxEmbed` component on homepage). This is acceptable as a v1 launch exception, but does not provide Bridge-powered listing search.

## Scoring Matrix

| Criterion | Weight | A (iframe embed) | B (server proxy) | C (Worker/sidecar) | D (browser token) | E (no IDX) |
|---|---|---|---|---|---|---|
| Secret safety | 5 | 5 (no token) | 5 (server-only) | 5 (server-only) | 4 (browser token by design) | 5 (no token) |
| MLS/Bridge license compliance | 5 | 4 (SEF only) | 5 | 5 | 4 (IDX endpoint filters) | 4 (SEF only) |
| Works with current deployment model | 5 | 5 | 1 (requires rearch) | 3 (separate deploy) | 5 | 5 |
| Minimal cutover risk | 4 | 5 | 1 | 3 | 5 | 5 |
| UX quality | 4 | 2 | 5 | 5 | 4 | 2 |
| Search/filter capability | 4 | 2 | 5 | 5 | 4 | 2 |
| SEO impact | 3 | 1 (iframe, no crawl) | 4 | 4 | 3 | 1 |
| Observability/debuggability | 3 | 2 | 4 | 4 | 3 | 2 |
| Maintenance burden | 3 | 2 | 3 | 3 | 4 | 2 |
| Rollback simplicity | 4 | 5 | 2 | 3 | 5 | 5 |
| Time-to-safe-v1 | 3 | 3 | 1 | 2 | 4 | 5 |

**Weighted scores:**

| Option | Score |
|---|---|
| A | 5(5)+4(5)+5(5)+5(4)+2(4)+2(4)+1(3)+2(3)+2(3)+5(4)+3(3) = 196 |
| B | 5(5)+5(5)+1(5)+1(4)+5(4)+5(4)+4(3)+4(3)+3(3)+2(4)+1(3) = 164 |
| C | 5(5)+5(5)+3(5)+3(4)+5(4)+5(4)+4(3)+4(3)+3(3)+3(4)+2(3) = 206 |
| **D** | **4(5)+4(5)+5(5)+5(4)+4(4)+4(4)+3(3)+3(3)+4(3)+5(4)+4(3) = 213** |
| E | 5(5)+4(5)+5(5)+5(4)+2(4)+2(4)+1(3)+2(3)+2(3)+5(4)+5(3) = 202 |

## Decision

```yaml
bridge_runtime_decision:
  decision_id: MIA-BRIDGE-RUNTIME-001
  date: 2026-05-14
  selected_option: D
  selected_runtime: "Bridge Browser Token — direct client fetch to /idx/Properties"
  reason: >
    Bridge explicitly documents the Browser Token as "used for websites that may
    query the API directly from the browser." CORS is reflective (any origin allowed
    per Bridge's design). The IDX endpoint (/idx/Properties) auto-filters to
    IDX-appropriate records and fields. The static export architecture cannot run
    a server-side proxy without a full deployment re-architecture. The browser token
    bakes into the Next.js static bundle via NEXT_PUBLIC_ prefix, which is the
    intended pattern for client-side env vars. Security relies on Referrer Domain
    restriction (set in Bridge dashboard by Torrey before production use) and the
    inherent read-only nature of the browser token. Server token and client secret
    are never needed in the browser bundle and are excluded from this architecture.
  rejected_options:
    - option: A (iframe embed)
      reason: Bridge does not provide a hosted search embed widget.
    - option: B (server-side proxy)
      reason: Static export has no Node runtime; requires full deployment re-architecture.
    - option: C (external Worker/sidecar)
      reason: Valid v2 path but adds deployment surface and Torrey-approval step; lower priority when browser token is explicitly documented for browser use.
    - option: E (no IDX)
      reason: Does not advance Bridge integration; iframe-only is already the current fallback and is not this cycle's goal.
  secret_policy:
    server_token_ships_to_browser: false
    client_secret_ships_to_browser: false
    browser_token_ships_to_browser: true
    browser_token_basis: "Bridge docs: 'Used for websites that may query the API directly from the browser'"
    browser_token_security_control: "Referrer Domain restriction in Bridge dashboard (Torrey must configure before production)"
  deploy_policy:
    deploy_now: false
    requires_torrey_approval_for_deploy: true
    credential_placement: "NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN and NEXT_PUBLIC_BRIDGE_DATASET_ID as Dokploy build args (not repo, not chat)"
  pre_production_gates:
    - Torrey sets Referrer Domain in Bridge dashboard to https://miasanabria.com (and www.)
    - Torrey places NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN as Dokploy build arg (no value in chat)
    - Torrey places NEXT_PUBLIC_BRIDGE_DATASET_ID as Dokploy build arg (no value in chat)
    - Counsel reviews IDX display rules before BRIDGE_INTEGRATION_LIVE flips to true
    - IDX attribution text confirmed with MLS/counsel
    - Smoke test: one live property search returns real listings with correct attribution
  rollback: >
    Set BRIDGE_INTEGRATION_LIVE = false in src/lib/bridge.ts and redeploy.
    Home Search page falls back to MLS Matrix iframe (IdxEmbed).
    No DNS or Dokploy config change needed for rollback.
```
