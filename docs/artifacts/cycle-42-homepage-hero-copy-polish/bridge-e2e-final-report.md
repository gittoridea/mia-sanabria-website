---
cycle: 42
artifact: bridge-e2e-final-report
generated_at: 2026-05-17
---

# Cycle 42 — Bridge E2E Final Report

## Local (against fresh `out/` build, port 4242)

```
$ bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4242
home-search-bridge-e2e: 11/11 PASS, 0 FAIL, mode=fallback
exit 0
```

## Live (against https://miasanabriarealtor.trueidea.com)

```
$ bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
home-search-bridge-e2e: 11/11 PASS, 0 FAIL, mode=demo
exit 0
```

## Sub-checks (live)

The driver runs 11 binary probes that together prove the homepage→Bridge wire is intact:

1. Homepage form has `action="/home-search/"`.
2. Homepage form has hidden `source=home-hero` input.
3. Homepage form has `city` select.
4. Homepage form has `minPrice` select.
5. Homepage form has `beds` select.
6. Homepage form carries the floating-card marker for layout-regression detection.
7. `/home-search/` exposes a `data-bridge-runtime-mode` attribute with one of `live|demo|fallback|error` (got `demo`).
8. `/home-search/` runtime DOM contains no old IDX markers.
9. `/home-search/` renders results region OR demo banner OR loading state OR error state after JS executes.
10. `/home-search/` renders the BridgeSearch form.
11. URL-param round-trip works (city, minPrice, beds, source all consumed on `/home-search/?…` arrival).

All 11 PASS on both local and live.

## Mode delta (local → live)

```yaml
local_mode:  fallback   # local shell has no Bridge env vars
live_mode:   demo       # dev Dokploy provisioned with Bridge test dataset + DEMO=true
```

The mode delta is normal and expected. The cycle's source change is text-only; the runtime mode is decided by the deployed environment, not by the code.

## Demo honesty

At mode=demo, the `BridgeSearch` component renders the demo-data callout: "Demo data — Bridge test fixture connected. This staging page is connected to a Bridge Data Output test fixture so we can verify the integration end-to-end. Listings shown below are placeholder data — not real Southeast Florida inventory. Real listings will appear automatically once SEF MLS approves Mia's IDX feed on this Bridge account." Visible on the staging `/home-search/` view at 1280 and 1440 capture.

This satisfies the brief's "demo honesty preserved when needed" requirement. No live MLS feed claim is made.

## What did NOT change

- `src/components/bridge/BridgeSearch.tsx` — unchanged. URL-param consumption logic, OData query builder, fallback-fixture filter, demo-banner copy — all unchanged.
- `src/lib/bridge-client.ts` — unchanged. Public API hostname constant preserved.
- `src/lib/bridge.ts` — unchanged. Public docs URL + resource path preserved.
- `src/app/home-search/page.tsx` — unchanged. Page-body copy intact.
- Dokploy environment — untouched. AI does not rotate credentials.

## Verdict

Bridge wiring intact local and live. Mode reporting is truthful. Demo banner renders when appropriate. 11/11 PASS confirmed twice (local with fresh `out/`, live with cache-busted fetch).
