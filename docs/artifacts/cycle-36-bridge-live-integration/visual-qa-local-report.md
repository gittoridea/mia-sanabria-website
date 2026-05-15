# Visual QA — Local

**Generated:** 2026-05-14T22:08Z
**Capture source:** local Next.js static export served via `python3 -m http.server 4176 --directory out` (port 4176 used to avoid the audit:rendered / deploy-and-verify reservation on 4173).
**Capture tool:** `scripts/capture-baseline.ts` with `google-chrome --headless=new`.
**Output dir:** `docs/artifacts/cycle-36-bridge-live-integration/visual-qa/local/`
**Summary:** `_capture-summary.json`

## Capture results

```yaml
base: http://127.0.0.1:4176
routes: 13
viewports: 3   # 375x812, 768x1024, 1280x800
jobs: 39
ok: 39
fail: 0
duration_seconds: 44
```

Routes captured (each × 3 viewports):

```
/                  (home)
/home-search/
/markets/
/markets/seven-isles/
/markets/pompano-beach/
/markets/fort-lauderdale/
/about/
/insights/
/buyers/
/sellers/
/contact/
/privacy/
/terms/
```

## Visual checks (Cycle 36C focus areas)

| Question | Answer | Source |
|---|---|---|
| Seven Isles hero contrast clean at 768x1024? | **YES** — `markets_seven-isles__768x1024.png` shows the navy panel + brass-300 left edge + bold H1 with no glyph/edge race artifacts | `markets_seven-isles__768x1024.png` |
| Pompano Beach hero contrast clean at 768x1024? | **YES** — same panel architecture renders cleanly | `markets_pompano-beach__768x1024.png` |
| Fort Lauderdale hero contrast clean at 768x1024? | YES | `markets_fort-lauderdale__768x1024.png` |
| Does home-search reflect mode honestly on local build? | YES — local build has no Bridge credentials → `MlsMatrixFallback reason="no-credentials"` renders the SEF MLS Matrix iframe with the "Bridge listing search is being activated" copy (NOT a fake-live UI) | `home-search__1280x800.png` / `home-search__768x1024.png` |
| Are demo warning / DEMO badges visible? | Not on local build — `BRIDGE_AVAILABLE=false` locally → no Bridge UI to attach DEMO badges to. (On staging where the test_sf chunk is shipped, the badges appear in the client search-results render.) | local home-search PNGs |
| Is IDX/MLS disclosure visible? | On local build it is replaced by the MLS Matrix iframe fallback (correct for `no-credentials` mode). The disclosure paragraph itself renders only in live (non-demo, BRIDGE_AVAILABLE=true) mode. | n/a in local mode |
| Token-like strings visible in any screenshot? | NO — no Bridge tokens or secrets render to any screen at any viewport | all 39 PNGs |
| Mobile (375x812) regressions across the site? | NONE — all 13 routes render their hero + nav + footer trust strip cleanly | all 13 `*__375x812.png` |
| Tablet (768x1024) regressions across the site? | NONE — including the previously-failing Seven Isles + Pompano routes | all 13 `*__768x1024.png` |
| Desktop (1280x800) regressions? | NONE | all 13 `*__1280x800.png` |

## Notes

- The 13-route capture set covers all production routes that visually changed surfaces touched in Cycle 35–36 and the Bridge surfaces. Market individual pages beyond Seven Isles / Pompano / Fort Lauderdale were not re-captured because no per-market change occurred in this cycle; `audit:hero-contrast:stable` covers the full 23-market matrix programmatically.
- The local build of `/home-search/` is intentionally in `no-credentials` mode (vs the staging build which has the Cycle 33B `test_sf` credentials baked in). This is the correct honesty behavior for a credential-less dev environment.
- Final pixel-level pass/fail is enforced by `audit:hero-contrast:stable` (samples=3 + asset-cache prewarm), not by these screenshots; this report is the human-eyeball cross-check.
