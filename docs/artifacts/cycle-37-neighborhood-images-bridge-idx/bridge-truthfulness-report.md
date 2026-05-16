# Cycle 37 — Bridge Truthfulness Report

| Field | Value |
|-------|-------|
| bridge_mode_local | `fallback` (no Bridge env vars in this shell) |
| bridge_mode_staging_before_deploy | n/a — Cycle 36D was demo/fallback |
| bridge_mode_staging_after_deploy | (filled in by `bridge-staging-final-report.md` after Phase 10) |
| real_live_feed_proven | NO |
| old_idx_removed | YES — `audit:no-old-idx` PASS (477 files), `IdxEmbed.tsx` deleted, `MlsMatrixFallback` retired |
| demo_honesty_preserved | YES — DemoBanner + DEMO badges + IDX/MLS disclosure visible whenever mode is not `live` |
| idx_mls_disclosure_visible | YES — FixtureAttribution + ListingAttribution + ErrorPanel disclosure footnote |
| city_filters_work | YES — filterFixtures filters bundled cards by city; same filter shape Bridge accepts on live |
| photos_prices_addresses_work_if_live | n/a — `live` not active; live integration unchanged from Cycle 33B Architecture D |
| exact_external_blocker_if_not_live | SEF MLS approval of Mia's IDX feed on the Bridge account; Bridge dashboard Referrer Domain allowlist for staging + production hosts; operator promotion of `NEXT_PUBLIC_BRIDGE_DEMO=false` after MLS approval |

## Why "live" is not yet provable

1. The current shell holds none of `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `BRIDGE_CLIENT_ID`, `BRIDGE_DATASET_ID`, `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `BRIDGE_BROWSER_TOKEN` — the local build cannot exercise the live path.
2. The Dokploy staging build args may or may not bake the browser token + dataset id; even if they do, the dataset is a **test fixture** (Bridge documents this for SEF integrations pending IDX approval), so a successful Bridge fetch returns demo-shaped data and the UI rightly stays in `demo` mode with banners.
3. `NEXT_PUBLIC_BRIDGE_DEMO=true` remains the default at staging until SEF MLS approval lands on Mia's account; until then the UI must keep the demo warning regardless of fetch outcome.

## How the UI stays honest under each mode

| mode | DemoBanner | DEMO badges | Live attribution | Disclosure |
|------|:----------:|:-----------:|:----------------:|:----------:|
| live | hidden | hidden | shown | shown |
| demo | shown ("test fixture") | shown | hidden | shown |
| fallback | shown ("IDX pending") | shown | hidden | shown |
| error | hidden (ErrorPanel) | n/a | hidden | shown in ErrorPanel |
| unconfigured | hidden (pre-search status badge text) | n/a | hidden | implicit in status badge |

The `data-bridge-runtime-mode` attribute on the search container makes mode externally inspectable for QA + audits without exposing tokens.
