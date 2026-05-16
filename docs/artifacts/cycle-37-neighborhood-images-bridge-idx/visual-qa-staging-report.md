# Cycle 37 — Staging Visual QA Report

Captured 20 PNGs against `https://miasanabriarealtor.trueidea.com` at 375×812 + 1280×800.

Routes: `/`, `/home-search/`, `/markets/`, `/markets/{coral-springs,davie,deerfield-beach,hollywood,plantation,sunrise,weston}/`.

| Route | 375×812 | 1280×800 | Result |
|-------|---------|----------|--------|
| `/` | OK | OK | hero + Mia + featured markets visible |
| `/home-search/` | OK | OK | Bridge form + status badge visible; mode=demo |
| `/markets/` | OK | OK | 23 cards present, all images render |
| `/markets/coral-springs/` | OK | OK | new editorial hero visible |
| `/markets/davie/` | OK | OK | new editorial hero visible |
| `/markets/deerfield-beach/` | OK | OK | new editorial hero visible |
| `/markets/hollywood/` | OK | OK | new editorial hero visible |
| `/markets/plantation/` | OK | OK | new editorial hero visible |
| `/markets/sunrise/` | OK | OK | new editorial hero visible |
| `/markets/weston/` | OK | OK | new editorial hero visible |

20/20 captures succeeded · 0 failed · ~16 s total via `capture-baseline.ts` (concurrency 4).

PNG paths (gitignored, reproducible):
`docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/staging/<slug>__<viewport>.png`
Summary index: `docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/staging/_capture-summary.json`.
