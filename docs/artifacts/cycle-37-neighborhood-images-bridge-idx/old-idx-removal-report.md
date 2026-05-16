# Cycle 37 — Old-IDX Removal Report

## Before (Cycle 36D head)

| Location | Surface | Match |
|----------|---------|-------|
| `src/components/IdxEmbed.tsx` | runtime React component | `sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx` iframe |
| `src/app/page.tsx:12,165` | homepage imports + renders | `<IdxEmbed />` |
| `src/components/bridge/BridgeSearch.tsx:35` | constant | `MLS_MATRIX_URL = "https://sef.mlsmatrix.com/..."` |
| `src/components/bridge/BridgeSearch.tsx:37` | component | `function MlsMatrixFallback({ reason })` |
| `src/components/bridge/BridgeSearch.tsx:154,276,280` | usages | `MlsMatrixFallback` rendered when no credentials or on error |
| `src/lib/bridge.ts:68` | doc comment | "MLS Matrix iframe fallback renders instead" |
| `src/lib/site.ts:78` | doc comment | "MLS Matrix fallback" |
| `scripts/audit-completeness.ts:382-386` | audit sentinel | required `matrixHost` + `iframeTitle` regex hits on `/` |

## Action taken

1. **Deleted** `src/components/IdxEmbed.tsx`.
2. **Removed** import + render in `src/app/page.tsx` (replaced with a Cycle 37 explanatory comment block; `/home-search/` is now the sole property-search surface).
3. **Replaced** `MlsMatrixFallback` in `src/components/bridge/BridgeSearch.tsx` with two clean states:
   - **fallback (no credentials)**: bundled `FIXTURE_LISTINGS` rendered with `DemoBanner` (`mode="fallback"`) + `DEMO` badges on every card + `FixtureAttribution` (IDX/MLS disclosure copy preserved).
   - **error (search-error)**: `ErrorPanel` with brand-exception annotated amber styling + a "contact Mia" CTA + IDX/MLS disclosure footnote. No iframe. No third-party host.
4. **Updated comment** in `src/lib/bridge.ts` from "MLS Matrix iframe fallback renders instead" to a Cycle-37-accurate description.
5. **Updated comment** in `src/lib/site.ts` `SEARCH_ICON_HREF` doc.
6. **Updated** `scripts/audit-completeness.ts` IDX sentinel from "5/5 IDX iframe sentinels on `/`" to "5/5 Bridge search sentinels on `/home-search/`": form aria-label, city filter `<label>`, IDX/MLS disclosure copy, `source=home-search` attribution, `data-bridge-runtime-mode` attribute. The previous audit would have failed on a Bridge-only build; the new audit passes on the Bridge-only build and would FAIL if the Bridge UI regressed.
7. **Added** `scripts/audit-no-old-idx.ts`. Scans `src/`, `public/`, `out/`, `.next/` for `MlsMatrix`, `MatrixFallback`, `sef.mlsmatrix.com`, `Matrix/Public/IDXSearch`, `idxbroker`, `ihomefinder`, `flexmls`, `showcaseidx`, and legacy `<iframe ... matrix>` patterns. Allowlist: `docs/artifacts/cycle-1*`, `docs/artifacts/cycle-2*`, `docs/artifacts/cycle-3[0-7]*`, `docs/CYCLE_*`, `ISA.md`, `docs/mia-client-decision-record.md` (historical references survive).
8. **Wired** `audit:no-old-idx` into `package.json` scripts + appended to `audit:all` and `audit:all:stable`.

## After

`audit:no-old-idx` PASS — 477 files scanned in `src/`, `public/`, `out/`, `.next/` after rebuild, zero forbidden hits.
`audit:completeness` — IDX category PASS (Bridge-shaped sentinels: form, city filter, disclosure, source attribution, runtime-mode attribute).

The remaining `MLS Matrix` strings in source are explanatory comments (Cycle 37) documenting the removal decision; they do not represent runtime fallback.
