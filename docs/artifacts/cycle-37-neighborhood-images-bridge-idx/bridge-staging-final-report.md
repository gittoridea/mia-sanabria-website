# Cycle 37 — Bridge Staging Final Report

| Field | Value |
|-------|-------|
| bridge_mode_local | `fallback` (no Bridge env vars in shell) |
| bridge_mode_staging_after_deploy | `demo` (`data-bridge-runtime-mode="demo"` attribute on home-search container) |
| real_live_feed_proven | NO |
| dokploy_build_args_baked_browser_token | YES (otherwise mode would be `fallback` not `demo`) |
| dokploy_build_args_baked_dataset_id | YES |
| dokploy_build_args_baked_demo_true | YES (mode is `demo`, not `live`) |
| old_idx_runtime_removed | YES — 0 `MlsMatrix` / `sef.mlsmatrix.com` / `Matrix/Public/IDXSearch` matches across all 22 saved staging HTMLs |
| demo_honesty_preserved | YES — mode badge under search form names "Bridge demo dataset connected — listings shown are test fixtures" |
| idx_mls_disclosure_visible | YES — disclosure copy + Bridge Data Output reference appear in the Bridge results section |
| city_filters_work_in_demo | YES — staging HTML contains `<select id="bridge-city">` with `MIA_APPROVED_NEIGHBORHOODS` options; behavior verified locally with bundled fixtures and is the same code path as Bridge demo dataset queries |
| photos_prices_addresses_work_if_live | n/a — would activate when `NEXT_PUBLIC_BRIDGE_DEMO=false` is baked AND SEF MLS-approved listings flow through the Bridge dataset |
| exact_external_blocker_if_not_live | SEF MLS approval of Mia's IDX feed on the Bridge account; Bridge dashboard Referrer Domain allowlist for staging + production hosts; operator promotion of `NEXT_PUBLIC_BRIDGE_DEMO=false` after MLS approval |

## Live-feed promotion path (for next cycle)

1. SEF MLS approves Mia's IDX feed on Bridge.
2. Operator confirms Bridge dashboard `Referrer Domain` includes `miasanabriarealtor.trueidea.com` + production host.
3. Update Dokploy build arg: set `NEXT_PUBLIC_BRIDGE_DEMO=false` (NEVER print value to chat).
4. Redeploy via `scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="South Florida Lifestyle"`.
5. Re-curl `/home-search/` and confirm `data-bridge-runtime-mode="live"`.
6. Smoke a search; verify cards render real listing data + DEMO badges + DemoBanner are absent.
7. Run `audit:no-old-idx` + `audit:neighborhood-images-deep --base=https://miasanabriarealtor.trueidea.com` to lock the regression gates.

## What the staging probe definitively proves

- Cycle 37's Bridge state machine works end-to-end at the deployed runtime (mode resolves at static-export build time and ships in HTML).
- The legacy iframe path is removed from runtime — only Bridge UI is reachable from `/home-search/`.
- Demo honesty is now structural, not manual: the mode attribute is auditable, the banner copy is mode-specific, the DEMO badge is gated on `resultMode !== "live"`.
