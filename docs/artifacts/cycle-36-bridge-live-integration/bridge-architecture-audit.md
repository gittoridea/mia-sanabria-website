# Bridge Architecture Audit

**Generated:** 2026-05-14T20:35Z
**Source files inspected:** `src/lib/bridge.ts`, `src/lib/bridge-client.ts`, `src/lib/bridge-schema.ts`, `src/components/bridge/BridgeSearch.tsx`, `src/components/bridge/BridgeListingCard.tsx`, `src/app/home-search/page.tsx`, `Dockerfile`, `package.json`, `next.config.ts`, `docs/artifacts/cycle-30b-expert-gap-closure/bridge-runtime-readiness-dossier.md`, `docs/artifacts/cycle-33-bridge-runtime/cycle-33b-live-credentials-report.md`, `docs/mia-client-decision-record.md`.

## Architecture topology

| Aspect | Answer |
|---|---|
| bridge_files | `src/lib/bridge.ts` (scaffold/contract), `src/lib/bridge-client.ts` (active fetch + sanitization), `src/lib/bridge-schema.ts` (response types), `src/components/bridge/BridgeSearch.tsx`, `src/components/bridge/BridgeListingCard.tsx`, `src/app/home-search/page.tsx` |
| api_routes | **NONE.** Static export (`next.config.ts` `output: "export"`). No `/api/*`, no Server Actions, no Node middleware. |
| server_side_fetch_path | Not present. Architecture is Option D — Browser Token direct client. |
| client_side_fetch_path | `src/lib/bridge-client.ts` `searchListings()` → `fetch("https://api.bridgedataoutput.com/api/v2/OData/{datasetId}/{idx/Properties|Property}?...&access_token=...")` from the browser. |
| demo_mode_detection | Build-time env-driven: `BRIDGE_DEMO_MODE = (process.env.NEXT_PUBLIC_BRIDGE_DEMO ?? "").toLowerCase() === "true"` (`src/lib/bridge-client.ts:48-49`). Baked into chunk at `next build`. |
| fixture_source | **No local fixture exists.** "Demo data" means Bridge `test_*` datasets pointed at by `NEXT_PUBLIC_BRIDGE_DATASET_ID` + the resource path override `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH=Property` (vs the production `idx/Properties` IDX-licensed feed). |
| live_mode_detection | `BRIDGE_AVAILABLE = !!(BROWSER_TOKEN && DATASET_ID)` (`src/lib/bridge-client.ts:52`). If true → render `<BridgeSearch />`; if false → render `<MlsMatrixFallback reason="no-credentials" />` (a SEF MLS Matrix iframe). |
| env_vars_required | `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `NEXT_PUBLIC_BRIDGE_DATASET_ID`. If both missing → MLS Matrix iframe. |
| env_vars_public_safe | All `NEXT_PUBLIC_BRIDGE_*` (browser-token architecture explicitly authorized by Bridge for client-side use; security defense via Bridge dashboard's Referrer Domain restriction). |
| env_vars_server_only | `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `BRIDGE_SECRET_ID`, `BRIDGE_CLIENT_ID` — referenced ONLY in scaffold doc-strings + reserved env-name registry. **They are not read by any runtime code.** Static export has no place to safely consume them; their presence in scaffold is for the future-server-runtime fork only. |
| credential_values_printed | **false** (this audit cited names only). |
| current_default_mode | Determined by Dokploy build args at deploy time. Locally: ALL `NEXT_PUBLIC_BRIDGE_*` are missing → BRIDGE_AVAILABLE=false → MlsMatrixFallback iframe. On staging chunks `app/home-search/page-9cfe8e93c112cd0c…` (Cycle 33B) the `test_sf` dataset + browser token were baked in → BridgeSearch is live + DEMO badge surfaces. |
| how_home_search_decides_demo_vs_live | Build time only. The values of `NEXT_PUBLIC_BRIDGE_*` at `next build` decide the chunk's behavior. Once shipped, the chunk is immutable until next build/deploy. |
| how_listing_card_marks_demo | `BridgeListingCard` receives `demoMode` prop from `BridgeSearch`. When `demoMode=true`, an amber "DEMO" pill renders absolute-positioned top-right of the card image (`data-brand-exception="demo-warning"`). |
| how_errors_surfaced | `searchListings` returns `{ error: "search-unavailable" \| "search-error" \| null }`. UI maps both to `MlsMatrixFallback` with `reason="no-credentials" \| "error"`. The "error" path uses an amber demo-warning paragraph above the iframe. No raw Bridge error bodies are surfaced. |
| how_city_filters_work | `<select>` options come from `MIA_APPROVED_NEIGHBORHOODS` (`src/lib/mia.ts`). Server-side allow-list filter in `bridge-client.ts:54-56` checks the city against the same set before building the OData `City eq '...'` filter. |
| how_pagination_works | Client computes `$skip = (page - 1) * MAX_PAGE_SIZE` (12). State holds first page only (no UI control to page beyond first 12). `total` shown in header, but no Next/Prev controls. |
| how_photos_render | `sanitizeListing` walks `raw.Media[]`, picks the `Order=0` cover, validates URL extension against `/\.(jpe?g\|png\|webp\|avif)(\?\|$)/i`, validates host against `ALLOWED_MEDIA_HOST_SUFFIXES` (cloudfront.net, amazonaws.com, bridgedataoutput.com, plus operator-extended via `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS`). HTTPS-only. |
| how_idx_disclosure_rendered | `<ListingAttribution>` paragraph below the listings grid renders ONLY in non-demo mode. Text: "Listing information is deemed reliable but not guaranteed. Data provided by Bridge Data Output via Southeast Florida MLS. … Equal Housing Opportunity." In demo mode the `<DemoBanner>` replaces the disclosure with the demo warning. |
| risk_of_token_leak | Browser token IS in the client bundle by design (Option D). The risk surface is that the dashboard Referrer Domain restriction is what enforces "only this site may use this token." If the Referrer Domain is unset in the Bridge dashboard, the token is a public credential. Mitigation: Mia/Torrey set the Referrer Domain to staging + production hosts. |
| risk_of_fake_live_claim | Demo mode is correct as long as `NEXT_PUBLIC_BRIDGE_DEMO=true` is set at build time when the dataset is a `test_*` dataset. If the build args drift (DEMO=false but dataset stays `test_sf`), the site would present test-fixture rows as real. The current Cycle 33B chunk has DEMO=true baked in for `test_sf`. |
| risk_of_mixing_demo_and_live | Bundle is single-source per build — the deployed chunk is either "live IDX" or "demo test feed", not both. There is no per-card determination of demo-vs-live; the entire `<BridgeSearch>` instance is one mode. |

## Mode flow

```
Dockerfile build args (from Dokploy)
  │
  ▼
NEXT_PUBLIC_BRIDGE_* env at `next build`
  │
  ▼
Statically baked into out/_next/static/chunks/app/home-search/page-*.js
  │
  ▼
BRIDGE_AVAILABLE branches:
  • true  → <BridgeSearch />
              ├─ BRIDGE_DEMO_MODE=true  → <DemoBanner /> + DEMO pill on cards (no IDX disclosure)
              └─ BRIDGE_DEMO_MODE=false → <ListingAttribution /> below cards (IDX-compliant)
  • false → <MlsMatrixFallback reason="no-credentials" /> (SEF MLS Matrix iframe; no Bridge call)

On searchListings() returning error:
  • result.error="search-unavailable" → <MlsMatrixFallback reason="no-credentials" />
  • result.error="search-error"        → <MlsMatrixFallback reason="error" /> (amber warning)
```

## What this means for "Mia says Bridge should be working"

- The local repo cannot reach Bridge — no credentials in shell or `~/.claude/.env`.
- The deployed bundle's behavior is fixed at the time of the most recent `next build`.
- The most recent shipped commit (`985f704` Cycle 33B + Dockerfile fix `3abbe05`) baked in the `test_sf` test dataset with DEMO=true and a browser token.
- Mia's "Bridge should be working" message most likely refers to **external Bridge dashboard provisioning** — Mia's IDX feed approval, Referrer Domain configuration, or production dataset access — not to a code change on this side.
- To verify whether real (non-demo) Bridge data is now available we need either:
  1. New Dokploy build args that point at Mia's production dataset (with DEMO=false), then re-deploy.
  2. Direct staging-site inspection to determine current rendered mode.
- A code change is appropriate ONLY if the staging probe reveals concrete UI defects (e.g., DEMO badge missing in demo mode, IDX disclosure missing in live mode, real listings rendering with DEMO badge by mistake).

## Risk summary

- **Token in client bundle is by design** — security model relies on Bridge's Referrer Domain restriction. (Operational risk; not a code defect.)
- **No server-side runtime path exists** — switching to Option A (proxy) or Option B (server components on listing routes) is a substantial architecture change that the current decision record explicitly defers (`docs/mia-client-decision-record.md` "Production canonical").
- **Demo-vs-live state is build-time only** — operator must set `NEXT_PUBLIC_BRIDGE_DEMO=false` AND swap dataset_id to a real IDX dataset in a single re-deploy to flip to live.
