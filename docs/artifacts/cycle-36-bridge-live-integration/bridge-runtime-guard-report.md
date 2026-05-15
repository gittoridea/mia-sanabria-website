# Bridge Runtime Guard Report

**Generated:** 2026-05-14T22:06Z
**Decision:** Do NOT introduce an `audit:bridge-runtime` script in this cycle.

## Rationale

The Bridge truthfulness audit surface this cycle would need to enforce belongs in two places that already exist:

| Property to enforce | Already enforced by |
|---|---|
| no raw Bridge secret values in source/output | `audit:no-fabrications`, repo-wide secret scan, project `.gitignore` rules for `.env*` (existing) |
| downloaded staging chunk JS files are gitignored | `.gitignore:62-63` plus this cycle's `token-bearing-artifact-safety.md` verification |
| demo banner is controlled by demo/fallback mode (no fake-live UI) | `audit:brand` data-brand-exception="demo-warning" gate (Cycle 35 fix) |
| DEMO badge is controlled by listing/card demo mode | same `audit:brand` exception + manual chunk-needle inspection |
| IDX/MLS disclosure exists where BridgeSearch/Listings render | implicit in component code; verified by chunk-needle inspection + visual QA |
| probe script is secret-safe by design | `scripts/probe-bridge-live.ts` written with documented SECURITY CONTRACT comment + sanitized JSON output schema |

Adding an `audit:bridge-runtime` script that re-checks the same predicates would:
- Duplicate `audit:brand`'s data-attribute gate.
- Require either parsing chunk JS (which means re-downloading staging chunks — exactly what we want to avoid) or parsing source (which is what existing audits do).
- Surface no new invariant that isn't already proven by `bridge-current-truthfulness-report.md`'s manual chunk-needle method.

This decision is consistent with the project rule "Don't add abstractions beyond what the task requires" (global CLAUDE.md).

## Manual checks that DID run this cycle (in lieu of a new audit script)

1. `bun run audit:brand` → 12 PASS · 0 FAIL — confirms `data-brand-exception="demo-warning"` is the only path to ship demo-warning amber colors. Any non-exempted off-brand color would fail the audit.
2. `bun run audit:no-fabrications` → run as part of Phase 7 full validation — prevents fake real-listings copy from being shipped.
3. `git diff --cached` secret-shape scan — run pre-commit, blocks token-shaped strings in the staged patch.
4. `.gitignore` rule verification — `staging-html/**/*chunk*.js` and `staging-html/**/*page-*.js` confirmed via `git check-ignore -v` against the actual downloaded chunk file.
5. `scripts/probe-bridge-live.ts` — short-circuits with `endpointConfigured=false` when credentials are absent; never persists raw bodies; sanitized JSON output schema.

## Future hook (if needed in a later cycle)

If a future cycle proves a need (e.g., Mia provisions a real dataset and wants a smoke-test before any deploy), this would be the right shape:

```yaml
audit:bridge-runtime:
  reads: out/_next/static/chunks/app/home-search/page-*.js   # built locally with deploy env
  enforces:
    - no NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN literal in chunk (only baked-in evaluated value)
    - NEXT_PUBLIC_BRIDGE_DATASET_ID literal !== test_sf and !== test_sd
    - NEXT_PUBLIC_BRIDGE_RESOURCE_PATH literal === idx/Properties when DEMO=false
    - DemoBanner JSX path retained (graceful fallback still possible)
    - ListingAttribution JSX path retained (IDX disclosure renders in non-demo mode)
  emits: reports/audit-bridge-runtime.{json,md}
```

This is documented here as a recipe; not implemented this cycle.

## Verdict

```yaml
audit_bridge_runtime_added_this_cycle: false
existing_audits_sufficient_for_current_state: true
demo_honesty_preserved: true
no_token_values_printed: true
no_token_values_committed: true
recipe_for_future_audit_documented: true
```
