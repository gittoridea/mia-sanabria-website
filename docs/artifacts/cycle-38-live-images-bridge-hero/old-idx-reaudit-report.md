# Cycle 38 — Old IDX Re-audit Report

date: 2026-05-16

## Forbidden runtime markers (from mission brief)

`MlsMatrixFallback`, `MLS Matrix`, `MlsMatrix`, `mlsmatrix`, `sef.mlsmatrix.com`, `Matrix fallback`, `old IDX`, `legacy IDX`, `idxbroker`, `ihomefinder`, `flexmls`, `showcaseidx`, `iframe-based IDX fallback`.

Allowed: IDX/MLS disclosure copy, Bridge Data Output references, historical archived docs/artifacts only.

## Local audit result

```
$ bun run audit:no-old-idx
audit-no-old-idx: PASS (480 files scanned)
```

The repository's existing `scripts/audit-no-old-idx.ts` walks `src/`, `public/`, `out/`, `.next/`, `Caddyfile`, `Dockerfile`, `next.config.ts` and flags any of the forbidden markers outside the allowlisted contexts. It passes after Cycle 38 changes.

## What Cycle 38 changed that is relevant to this audit

- Homepage hero search form action moved from `/markets/#property-search` to `/home-search/`. The destination route already uses `<BridgeSearch />` exclusively (no Matrix iframe). This removes the last user-facing form-submit path that could have plausibly been wired to old IDX in some future regression.
- New `scripts/audit-home-bridge-search.ts` independently enforces "no old IDX markers" on the homepage and on `/home-search/` (HTML-level grep). Audit passes on the new build.

## Allowed references still in the repo

- IDX/MLS disclosure copy (`ListingAttribution`, `FixtureAttribution`, `BridgeListingCard` Equal-Housing-Opportunity disclosure) — required for legal/compliance and explicitly allowed by the audit.
- `Bridge Data Output` mentions — explicitly allowed.
- Historical references inside `docs/artifacts/cycle-3*/…` — historical artifacts, not runtime.

## Staging plan

Post-deploy, `bun run audit:no-old-idx` should be re-run, plus a live HTML scan of the deployed home, /home-search/, /markets/, and each /markets/<slug>/ for the forbidden markers (`bridge-staging-final-report.md` and `staging-live-verification-report.md`).
