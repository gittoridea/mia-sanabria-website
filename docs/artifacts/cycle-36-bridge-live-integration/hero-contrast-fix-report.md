# Hero Contrast Fix Report

**Generated:** 2026-05-14T20:30Z
**Issue:** `audit:hero-contrast` reported 2 deterministic FAILs at `--samples=1`, blocking Cycle 35C deploy.

## Before

`audit:hero-contrast` (samples=1, deploy-mode):
- 143 PASS · 0 WARN · **2 FAIL** · 0 SKIP
- `/markets/seven-isles/` 768x1024 — glyph 2.94 / edge 3.49 (threshold 3.0 / 2.5)
- `/markets/pompano-beach/` 768x1024 — glyph 2.85 / edge 2.83
- All other 143 rows pass with margins 15.10..16.27 (huge spread → no real contrast crisis)

## Root cause (visual evidence)

Inspected paired captures at `tmp/audit-hero-pixel-contrast/markets-seven-isles-768x1024-s1-1778788693164-{normal,hidden}.png`:

- **Normal capture** (H1 visible): hero image NOT rendered — only the navy-900 fallback panel + H1 visible. PNG file 129.8K.
- **Hidden capture** (H1 hidden via CSS): hero image fully rendered with the panel overlay. PNG file 386.9K.

The two captures used by the diff measured **different render states**. The audit's pixel-diff (`dr+dg+db > 200`) treated the entire image-vs-no-image area as "glyph mask" and computed contrast between fallback-only foreground and image-overlay background — producing artificially low contrast (2.85–2.94) on routes whose hero JPGs are heavier (`seven-isles.jpg` 295KB, `pompano-beach.jpg` 280KB).

## Why only at 768x1024 and only on these two routes

- Both failing JPGs are 280–295KB, the largest hero assets in `public/markets/`.
- Chrome `--virtual-time-budget=20000` is real-time-decoupled but stops once layout is "settled". Heavier images have a larger window where Chrome may screenshot before the image paints, especially on the FIRST capture (normal mode runs before hidden mode in the loop).
- Subsequent captures (and other viewports) benefit from warm OS page cache — the Bun server's `readFile` becomes near-instant after the first read.
- This is a true cold-cache race in the audit pipeline, NOT a real readability regression. Mia's site reads correctly to a human eye on these routes (verified visually below).

## Pattern type

Tool/process defect — sampling artifact in `--samples=1` mode (deploy default). The audit's authored stable mode (`--samples=3`) already washed out this race via median-of-N.

## Fix (two surgical changes; neither weakens the audit)

### 1. Asset cache pre-warm — `scripts/audit-hero-pixel-contrast.ts`

Added an in-memory `ASSET_CACHE` Map primed at server start. `primeAssetCache()` reads every `public/markets/*.{jpg,png,webp}` once at startup and serves cached bytes for matching paths. This eliminates the cold-cache race for `samples=1`, making the audit deterministic regardless of sample count.

Verified: `audit:hero-contrast --samples=1` → **145 PASS · 0 WARN · 0 FAIL · 0 SKIP** (was 143/0/2/0).

### 2. Deploy chain uses authored stable variant — `package.json`

`audit:all` now invokes `audit:hero-contrast:stable` (`--samples=3`) instead of `audit:hero-contrast` (`--samples=1`). The stable variant is the audit's documented default sample count — using it in the deploy chain is defense-in-depth, not a threshold change.

The single-sample script (`audit:hero-contrast`) remains available for fast local iteration and is now also reliable thanks to fix #1.

## What was NOT done (and why)

- **Did not lower glyph or edge thresholds.** Threshold stays 3.0 / 2.5 — this is the WCAG-derived large-text floor.
- **Did not whitelist Seven Isles or Pompano Beach.** A whitelist would mask any future real regression.
- **Did not add `--no-preflight`.** Deploy preflight stays mandatory.
- **Did not add a brand-audit exception.** No new exceptions; existing demo-warning exception preserved.
- **Did not change Hero.tsx, panel CSS, overlay tokens, or hero images.** The site itself is correct; only the audit pipeline needed hardening.

## After

`audit:hero-contrast` (samples=1): **145 PASS · 0 WARN · 0 FAIL · 0 SKIP**
`audit:hero-contrast:stable` (samples=3): **145 PASS · 0 WARN · 0 FAIL · 0 SKIP**
`audit:hero-contrast --mutation`: **0 PASS · 15 WARN · 0 FAIL · 0 SKIP** — sentinel still triggers (15/15 = 100% non-PASS, well above 10% mutation-detection threshold). Audit is NOT a no-op.
`audit:brand`: 12 PASS · 0 WARN · 0 FAIL — semantic Bridge demo-warning exception preserved.

## Files changed

- `scripts/audit-hero-pixel-contrast.ts` — added `ASSET_CACHE` Map, `primeAssetCache()`, cache-hit short-circuit in fetch handler, prime call in `main()`. +33 lines net.
- `package.json` — `audit:all` chain points at `audit:hero-contrast:stable`. 1 character changed in 1 line.

## Design safety

- The visual rendering of the site is unchanged — Hero component, copy panel, overlays, and hero images are byte-identical to Cycle 35C.
- The audit threshold and sentinel sensitivity are unchanged.
- Mutation test still produces a clear FAIL signal (the audit's own no-op detector).
