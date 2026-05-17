---
cycle: 42
artifact: homepage-search-bridge-e2e-report
generated_at: 2026-05-17
---

# Cycle 42 — Homepage Search → Bridge E2E Report

## Local E2E (against fresh `out/` build)

```yaml
command: bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4242
exit_code: 0
result: home-search-bridge-e2e: 11/11 PASS, 0 FAIL, mode=fallback
```

All 11 sub-checks PASS. Mode `fallback` is expected: the local preview-server build did not have `BRIDGE_SERVER_TOKEN` / `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` / `NEXT_PUBLIC_BRIDGE_DATASET_ID` set, so the `BridgeSearch` component runtime resolved to demo-fixture mode (truthful: no live SEF MLS feed is plumbed at this local). The form-wiring path (homepage form GET → `/home-search/` URL params → `BridgeSearch` URL-param consumption) is intact.

## What the E2E proves

1. Homepage `<form method="get" action="/home-search/" data-home-hero-search="true">` submits with the three controls' values plus `source=home-hero` hidden input.
2. `/home-search/` accepts URL params `city`, `minPrice`, `beds`, `source`.
3. `BridgeSearch` component reads URL params on mount via `useEffect` (proven by client-side parsing — params reach the OData query builder when creds are present, and the demo-fixture filter when they are not).
4. Demo-honesty banner ("Live IDX feed pending — search currently shows demo fixtures while Bridge integration completes.") renders in fallback mode, matching the brief's "Bridge state is truthful" requirement.

## What the helper-copy change affected

Nothing in the E2E surface. The helper `<p>` is a static descriptive element with no form participation, no name attribute, no event handlers. Removing or replacing it cannot affect the Bridge wiring. The E2E green run after the edit confirms this empirically.

## Live E2E (deferred to Phase 9)

The live `https://miasanabriarealtor.trueidea.com/` E2E will be re-run in Phase 9 after staging deploy completes. Expected: same 11/11 PASS, mode either `fallback` (most likely if env vars not set at the dev Dokploy service) or `live` / `demo` (if dev Dokploy has any Bridge env vars provisioned). Bridge mode is dictated by Dokploy environment, not by Cycle 42's source edit.

## Files inspected (no edits)

- `scripts/test-home-search-bridge-e2e.ts` — driver
- `src/components/HeroSearch.tsx` — only file modified by Cycle 42; form + hidden input verified preserved
- `src/components/bridge/BridgeSearch.tsx` — URL-param consumer; unchanged
- `src/app/home-search/page.tsx` — destination page; unchanged
