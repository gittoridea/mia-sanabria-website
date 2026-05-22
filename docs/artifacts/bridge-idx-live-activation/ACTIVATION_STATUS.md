# Bridge IDX Live Activation — Status

- generated: 2026-05-22
- branch: `activate-bridge-idx-live`
- base tested (local): `http://127.0.0.1:4190` (static `out/` build)
- mode observed locally: **fallback** (no Bridge env vars at local build time)
- proven live: **NO — not yet** (cannot be proven without build-time Bridge env
  vars + a confirmed Bridge dashboard; both are off-repo human/Dokploy actions)

## What this branch changed (code is ready; activation is an env/dashboard step)

1. **Runtime truthfulness** — `data-bridge-runtime-mode` now reflects the PROVEN
   runtime (`resultMode`), not build-time config. It can only read `live` after a
   Bridge fetch returns 2xx in the browser. A configured-but-unfetched build reads
   `ready`; a failed fetch reads `error`. (`getBridgeRuntimeStatus()` no longer
   returns `live` from credentials alone — it returns `ready`.)
2. **Deployment propagation** — `docker-compose.yml` now passes all five
   `NEXT_PUBLIC_BRIDGE_*` build args through to the Docker build (the Dockerfile
   already declared the ARG/ENV; compose was dropping all but `NEXT_PUBLIC_SITE_URL`).
3. **Strict live audit** — `--require-live` gate added to
   `scripts/test-home-search-bridge-e2e.ts` (real-browser DOM dump). Exposed as
   `bun run test:home-bridge-e2e:live` and `bun run audit:bridge-live`.
4. **Safety** — token redaction on every report write; raw DOM never persisted;
   `.env.example` documents variable NAMES only (no values).

## Negative control (proves the gate is real)

Running the strict gate against the LOCAL fallback build correctly returned
`proven_live: NO`, classified `fallback`, and failed the 7 live-only checks
(mode-is-live, no-demo-banner, no-feed-pending-copy, no-demo-badge, no-fixtures,
inquiry-enabled, nonfixture-listing-key). Evidence:
`negative-control-localhost-fallback/report.md`. This demonstrates the audit
rejects non-live builds rather than rubber-stamping them.

## Remaining blockers (human / Dokploy — see OPERATOR_CHECKLIST.md)

- [ ] Confirm Bridge dashboard: data access approved, Browser Token enabled,
      exact dataset code, `idx/Properties` path, referrer allowlist.
- [ ] Set the five `NEXT_PUBLIC_BRIDGE_*` build vars in Dokploy (redacted).
- [ ] Trigger a **fresh rebuild** (NEXT_PUBLIC_* bake at build time).
- [ ] Run `bun run test:home-bridge-e2e:live` and confirm `proven_live: YES`,
      then overwrite this folder's `report.md`/`report.json` with the staging run.
