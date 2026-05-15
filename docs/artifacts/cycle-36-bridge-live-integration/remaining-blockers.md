# Remaining Blockers — Cycle 36D

**Generated:** 2026-05-15

## Genuinely external (cannot be closed by AI in this codebase)

### Bridge live feed

| Item | Owner | What unblocks |
|---|---|---|
| Provision Bridge production dataset for Southeast Florida MLS | Mia + Bridge support | New dataset ID provisioned in Bridge dashboard (not `test_sf` / `test_sd`) |
| Set `NEXT_PUBLIC_BRIDGE_DATASET_ID` to production dataset ID in Dokploy build args | Torrey + Mia | Dokploy app `XJSRlvH-91ZtUsh0RPGvo` env config |
| Set `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH=idx/Properties` in Dokploy build args | Torrey + Mia | Dokploy build args |
| Set `NEXT_PUBLIC_BRIDGE_DEMO=false` in Dokploy build args | Torrey + Mia | Dokploy build args |
| Set Bridge dashboard Referrer Domain restriction for staging + production hosts | Mia | Bridge dashboard — security tab |
| Trigger Dokploy rebuild after build-arg flip | Torrey | Dokploy redeploy |
| Verify post-flip chunk needles: dataset !== `test_sf`, `BRIDGE_DEMO=false`, `idx/Properties` present | Next-cycle PAI session | Use the Phase 4 probe flow in `bridge-current-truthfulness-report.md` |

### Marketing / ops surfaces

| Item | Owner | Notes |
|---|---|---|
| GHL form/webhook endpoint provisioning | Torrey | Currently mailto fallback. No endpoint URL invented. |
| GA4 / GTM / Search Console / GBP setup | Torrey | Out of scope for Cycle 36D. |
| DNS cutover from staging `trueidea.com` → `miasanabria.com` | Torrey + Mia | Production cutover, not Cycle 36D scope. |
| DBPR license / designations attestation | Mia | Needed before production claims. |
| LPT Realty marketing sign-off | Mia + LPT broker | Needed before production. |
| USCO DMCA registration | Counsel | Currently in-process language live; production cutover gated by completion. |
| Photographic heroes for Cycle 25 Broward cohort | Mia | Optional improvement; current illustrative/brand-tone cards adequate for staging. |

## NOT remaining (closed in Cycle 36D)

- Cycle 35C deploy blocker (`audit:hero-contrast` cold-cache race) — closed at root with the asset-cache prewarm + ArrayBuffer fix.
- Validation chain — closed; `audit:all` green with samples=3 gate.
- Bridge truthfulness QA — closed; demo mode classified, demo honesty preserved, no secret leaks.
- Staging deploy — closed; live at `https://miasanabriarealtor.trueidea.com/` with commit `3a99bc3`.
- Token-bearing chunk JS commit risk — closed; gitignore rules + git ls-files verification.

## AI-closeable next steps (if a future Cycle 37 is invoked)

These are NOT blockers, but they are concrete improvements an AI session could land:

1. Verify Cycle 36D commit landed on Cycle 35 transient log files and clean them up if no longer useful (`docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-20260514-155531.log` + pointers).
2. Delete the locally downloaded `PRE_DEPLOY_home-search_chunk.js` file (gitignored, but consumes disk).
3. Add `audit:bridge-runtime` as a wired audit step in `package.json` (script exists pattern but not wired; documented in `bridge-runtime-guard-report.md`).
4. Diff Cycle 36D staging visual baseline against Cycle 35 staging baseline if/when a regression is suspected.
5. When Mia confirms Bridge live build-args are flipped: re-fetch `/home-search/`, inspect new chunk hash, verify needles (dataset !== test_*, BRIDGE_DEMO=false, idx/Properties present), update Bridge classification from `demo` to `live`, optionally hide demo UI affordances.

None of these are blockers. The site is in a known-good staging state at commit `3a99bc3`.
