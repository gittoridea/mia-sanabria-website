# Cycle 37 — Claim vs Reality

| Claim | Reality |
|-------|---------|
| Cycle 37 started from Cycle 36D head | TRUE — `git rev-parse HEAD == 772cc5e` at preflight |
| New neighborhoods had real images | FALSE before; TRUE after — 7 placeholder JPGs replaced with Gemini 2.5 Flash Image generations |
| Old IDX runtime removed | TRUE — `IdxEmbed.tsx` deleted, `MlsMatrixFallback` retired, `audit:no-old-idx` PASS 477 files |
| Bridge integration is now Bridge-only | TRUE — `/home-search/` renders Bridge form/grid/state-badge with no third-party iframe |
| Bridge live feed is proven | FALSE — no Bridge credentials in this shell, demo honesty preserved |
| Demo banner + DEMO badges shown when not live | TRUE — driven by typed `BridgeRuntimeMode` + `getBridgeRuntimeStatus()` |
| IDX/MLS disclosure visible where Bridge listings render | TRUE — `FixtureAttribution`, `ListingAttribution`, `ErrorPanel` disclosure footnote |
| All 14 critical audits pass | TRUE — typecheck, lint, build, brand, hero-contrast, completeness, images, route-inventory, no-fabrications, qa-gate (critical=0), no-old-idx, neighborhood-images-deep, mobile-readability, rendered |
| No secrets printed/committed/exposed | TRUE — source/out/.next scans clean; presence-only env probes; staged patch secret check clean |
| Deploy ran in tmux/logged mode | (filled in by `staging-deploy-report.md`) |
| Live staging verified after deploy | (filled in by `staging-live-verification-report.md`) |
| Final deployed commit equals origin/main HEAD | (filled in by `final-deploy-alignment-report.md`) |
| No production/DNS/GHL/Google writes performed | TRUE — none initiated this session |
| No Bridge token refresh/rotation | TRUE — credentials unchanged |
