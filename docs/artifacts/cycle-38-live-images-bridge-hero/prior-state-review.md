# Cycle 38 — Prior State Review

date: 2026-05-16

## Cycle 37 claim vs Cycle 38 reality

| Cycle 37 claim | Cycle 38 reality |
|----------------|-------------------|
| 7 placeholder neighborhoods replaced (coral-springs, davie, deerfield-beach, hollywood, plantation, sunrise, weston) | Operator reports those 7 are still "not displaying" on live. Reproduced (HTML+HTTP+asset bytes prove they *render* technically; visual content has framed-canvas defects on Hollywood and Davie + AI-painted/illustrative style on the rest, dominantly white tiles in the rendered UI) — see `live-neighborhood-image-reproduction.md`. |
| Old IDX runtime removed (Matrix iframe gone) | Still true at Cycle 38 baseline. `audit:no-old-idx` continues to pass. Cycle 38 additionally enforces the homepage form action points at `/home-search/` not the legacy anchor. |
| Bridge mode on staging remained demo | Cycle 38 retests after operator's referrer-domain update. **Does not flip demo flag** — see `bridge-truthfulness-report.md`. |
| Staging deep image audit passed 23/23 | Audit gate-checked only file existence + size + dimensions; missed the framed-canvas pixel-content defect. Cycle 38 adds perimeter-whiteness validator in the generator + visual inspection — gap explanation in `neighborhood-image-root-cause.md`. |
| Staging live verified | Operator reports otherwise for the 7 named slugs. Cycle 38 supersedes that verification with `live-neighborhood-image-reproduction.md` + `neighborhood-image-fix-report.md`. |

## Seven affected slugs (confirmed)

`deerfield-beach`, `hollywood`, `plantation`, `weston`, `coral-springs`, `davie`, `sunrise`.

## Baseline at Cycle 38 entry

- branch: `main`
- HEAD: `e7635840b64fd9366e690f437dcfe09cc3a71a5f` (`e763584`)
- origin/main: identical
- Cycle 37 commits on main:
  - `ed24e69` — feat: complete neighborhood images + Bridge fallback
  - `52a33db` — docs: staging deploy + live verification + ISA log
  - `240c2c7` — fix: remove sef.mlsmatrix.com from Caddyfile CSP frame-src
  - `e763584` — docs: final-deploy alignment report + post-deploy logs

## Image assets at Cycle 38 entry

All 14 expected files (`public/markets/<slug>.jpg`, `public/og-markets/<slug>.jpg` for the 7 slugs) **were tracked** in git, **served 200 OK** from staging, with non-zero plausible byte sizes. The defect was in the pixel content, not in delivery.

## Bridge state at Cycle 38 entry

- Local env: only `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `DOKPLOY_API_URL`, `DOKPLOY_API_TOKEN` present.
- Bridge tokens: missing locally, present in Dokploy build args.
- Operator update for Cycle 38: referrer-domain restrictions now include all 3 domains.

## Homepage state at Cycle 38 entry

- `src/app/page.tsx` rendered `<Hero imageSrc="/markets/fort-lauderdale.jpg">` followed by a non-floating `<HeroSearch />` that posted to `/markets/#property-search`.
- miasanabria.com production hero is a twilight luxury waterfront composition published as the OG asset; HTML hero section uses CSS-styled background-image divs (no `<img>` element) so the OG meta is the authoritative pointer.

## What Cycle 38 changes

- 7 neighborhood images regenerated with hardened Gemini prompts + perimeter-whiteness validator.
- Homepage hero swapped to the operator-authorized miasanabria.com hero composition (copied locally to `/hero/mia-home-hero.jpg`).
- `<HeroSearch floating />` floats over the hero image, posts to `/home-search/` with `city/minPrice/beds/source` params.
- `<BridgeSearch />` reads URL params on mount and auto-runs search.
- New `scripts/audit-home-bridge-search.ts` audit and `package.json` script.
- New `scripts/generate-neighborhood-images-v2.ts` generator with retry + validator.
- New `scripts/probe-live-neighborhood-images.ts` headless-Chrome DOM probe.
- Bridge truthfulness and runtime mode logic **unchanged**.
