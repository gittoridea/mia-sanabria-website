# Cycle 38 — Local Validation Report

date: 2026-05-16

All local validation gates passed before commit.

## Build pipeline

| Step | Status |
|------|--------|
| `bun run typecheck` | PASS (0 errors after `Bun.file` removal in `probe-live-neighborhood-images.ts` + `Set<string>` cast in `BridgeSearch.tsx`) |
| `bun run lint` | PASS (0 warnings, 0 errors) |
| `bun run build` | PASS (Next 15 static export generated; `out/` populated; 7 new hero images and the new floating-search markup present) |

## Audit suite

| Audit | Status | Detail |
|-------|--------|--------|
| `audit:stale` | PASS | clean across `out/` |
| `audit:images` | PASS | 14/14 (was 14) — all 23 markets have hero+OG asset |
| `audit:brand` | PASS | after removing `backdrop-blur` from floating card (glassmorphism anti-rule); 12 PASS · 0 FAIL |
| `audit:hero-contrast:stable` | PASS | 145 PASS · 0 FAIL across 23 markets × 3 samples × normal+hide variants |
| `audit:route-inventory` | PASS | 48 sitemap routes reconcile to filesystem |
| `audit:no-fabrications` | PASS | 0 hits |
| `audit:no-old-idx` | PASS | 480 files scanned, 0 forbidden markers |
| `audit:neighborhood-images-deep` | PASS | 23/23 markets |
| `audit:home-bridge-search` | PASS | 8/8 findings — homepage form action `/home-search/`, hidden `source=home-hero`, all 3 filter inputs, no legacy `/markets/#property-search`, no old IDX, `/home-search/` exposes BridgeSearch surface, floating-card marker present |
| `audit:mobile-readability` | PASS | 84 PASS · 0 FAIL across iPhone, iPhone-mini, Pixel-7, iPad-portrait viewports × all routes |
| `audit:qa-gate` | PASS | critical = 0 (gate); high = 4, medium = 1, low = 56 (pre-existing carry-overs from prior cycles) |

## Secret hygiene

- `git grep` for literal `<TOKEN>=['"][A-Za-z0-9_+/.-]{16,}['"]` shape — 0 hits in repo source.
- `out/` and `.next/` scan for `Bearer <…>`, `access_token=<…>`, `refresh_token=<…>` shapes — 0 hits.
- No env values printed, logged, or written to any artifact this cycle.

## Visual QA

- `docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/local/` — 20 PNGs captured at 1280×900 and 375×812 across `/`, `/home-search/`, `/markets/`, and each of the 7 named neighborhood detail pages.
- Manual visual review of `/` confirms: new twilight waterfront hero image renders, floating cream search card overlays the hero at both viewports, "South Florida Lifestyle / Home Search" copy panel keeps its position, primary CTA "Search available homes" leads to `/home-search/`.
- Manual visual review of `/markets/<slug>/` for each of the 7 named slugs confirms full-bleed photorealistic hero (Hollywood = palm-shadowed brick promenade, Davie = white-fence pasture, Deerfield Beach = wooden pier on Atlantic, Sunrise = tropical-palm-framed lake, Plantation = royal-palm street, Coral Springs = tree-canopied boulevard, Weston = master-planned landscape).
- No "No photo available" placeholder visible.
- No framed-canvas / large-white-margin defect visible on any of the 7.
- See `visual-qa-local-report.md` for the screenshot inventory.

## Gate summary

All gates green. Cleared for commit + push + staging deploy.
