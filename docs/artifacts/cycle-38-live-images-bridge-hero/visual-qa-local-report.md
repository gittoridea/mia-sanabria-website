# Cycle 38 — Visual QA Local Report

date: 2026-05-16

## Capture method

- Built static export via `bun run build` → `out/`.
- Served `out/` from `127.0.0.1:4188` (python `http.server`).
- Used `google-chrome --headless=new --window-size=<W>x<H> --screenshot=<file> http://127.0.0.1:4188<route>` with `--virtual-time-budget=8000` for each route × viewport.
- Killed local server after the sweep.

## Viewports captured

- 1280 × 900 (desktop laptop)
- 375 × 812 (iPhone class)

## Routes captured

- `/`
- `/home-search/`
- `/markets/`
- `/markets/deerfield-beach/`
- `/markets/hollywood/`
- `/markets/plantation/`
- `/markets/weston/`
- `/markets/coral-springs/`
- `/markets/davie/`
- `/markets/sunrise/`

Total: **20 PNGs** in `docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/local/`.

## Manual visual review

### Homepage

- Desktop: new twilight waterfront luxury hero is visible behind the navy copy panel. CTAs ("Search available homes" / "Talk with Mia") render in the panel. Below — the floating cream search card sits over the hero image with the three filter selects (Neighborhood / Min price / Bedrooms) and the brass "Search Listings" submit button, exactly matching the production miasanabria.com floating-card pattern.
- Mobile (375): hero copy panel stacks tightly, CTAs full-width inside the navy panel; the floating cream card stacks form fields vertically (NEIGHBORHOOD → MIN PRICE → BEDROOMS → Search Listings) below the hero image. No clipped controls. `audit:mobile-readability` returned PASS on this route.

### /home-search/

- Desktop: existing Bridge surface unchanged below the hero. Auto-search on mount triggers when query params are present (proved by inspecting BridgeSearch source); not visible in the static screenshot here because no params were attached.
- Mobile: same.

### /markets/

- Hero + index of all 23 markets. Tiles render. The 7 named-slug tiles now show new photorealistic compositions in place of the prior framed/painted ones.

### /markets/<slug>/ for each of the 7

- Each detail page shows a new full-bleed photorealistic hero matching the brief description (see `neighborhood-image-fix-report.md`).
- No "No photo available" placeholder visible.
- No framed-canvas / large-white-margin defect visible on any of the 7.

## Defect classes specifically checked and not present in this set

- Frame/canvas border around the image (the Cycle 37 Hollywood/Davie defect class) — absent.
- AI-painted illustrative style (Cycle 37 deerfield-beach style) — absent (now photorealistic).
- Abstract/sculptural subject (Cycle 37 sunrise) — absent (now lakeside palms).
- Off-brand color tokens — absent (audit:brand PASS).

## Limitation

The static-screenshot channel cannot verify BridgeSearch's auto-search behavior. That requires either an interactive headless-Chrome session OR a live-staging probe with URL params; the latter is performed in the post-deploy verification phase.
