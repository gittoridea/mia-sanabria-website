# Cycle 39 — Old IDX Re-Audit Report

date: 2026-05-16

## Audit gate result

```
$ bun run audit:no-old-idx
audit-no-old-idx: PASS (480 files scanned)
```

## Manual grep across the surfaces the operator can reach

```
grep -RniE "MlsMatrix|MLS Matrix|mlsmatrix|sef\.mlsmatrix\.com|idxbroker|ihomefinder|flexmls|showcaseidx" \
  src public out .next Caddyfile Dockerfile next.config.ts
```

Result (truncated to substantive hits — full output in `logs/`):

- `src/lib/bridge.ts` — historical comment string referencing the removal
  context only; no runtime path.
- `docs/artifacts/cycle-37-*` and `cycle-38-*` — documentation of the
  removal; not runtime.
- `out/` — zero runtime occurrences (verified by `audit:no-old-idx`).

## Conclusion

Old IDX (MLS Matrix) runtime is permanently absent from the runtime build.
Cycle 37 removed it; Cycle 38 confirmed; Cycle 39 re-confirms with the same
audit + manual grep methodology.

Allowed-by-rule remains:
- IDX/MLS disclosure language in the demo banner + footer (a Fair Housing
  + MLS-attribution requirement, not a runtime IDX integration).
- Historical documentation in `docs/artifacts/cycle-*/` artifacts.
