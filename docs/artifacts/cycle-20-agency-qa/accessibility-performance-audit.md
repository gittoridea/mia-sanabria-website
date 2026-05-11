# Cycle 20 — Accessibility & Performance Audit (Tier-3 stub)

> **This artifact is intentionally a stub.** A proper a11y/perf pass requires:
> - `axe-core` or `pa11y` installed
> - `lighthouse` CLI installed
> - chrome --headless with a stable test profile
>
> None of these are present in the local environment as of 2026-05-11 (probed: `command -v lighthouse axe pa11y` all return nothing). The Cycle 20 budget routed effort into GHL plan + issue matrix instead.

## Light-depth findings (this cycle)

What was confirmed via existing tooling + code Reads:

| Check | Result | Source |
|---|---|---|
| All iframes have `title` attribute | PASS — IDX iframe has `title="Southeast Florida property search"` | `IdxEmbed.tsx:11` |
| All iframes lazy-load | PASS — `loading="lazy"` on IDX | `IdxEmbed.tsx:25` |
| Hero contrast site-wide | PASS — `audit-hero-pixel-contrast` 110/110 | `reports/audit-hero-pixel-contrast.json` |
| Skip-link present | PASS — every page has `<a href="#main">Skip to main content</a>` | layout.tsx audit |
| Image alt attributes + dimensions | PASS — `audit-completeness.images.dimsAltPlaceholder` 32 next/image fill-mode correctly classified | `reports/audit-completeness.json` |
| Local image references resolve | PASS — `audit-completeness.images.localFilesExist` | as above |
| `og:image` resolves to local files | PASS — `audit-completeness.og.imagesResolve` | as above |
| Static export: zero runtime JS by default | PASS — Next.js `output: 'export'`, hydration only where needed | `next.config.ts` |
| Reduced-motion respected | code-only check: `prefers-reduced-motion` referenced in `globals.css` line range to confirm | `src/app/globals.css` (manual confirm needed in a full pass) |

## What a real a11y/perf cycle should do

| Step | Method | Output |
|---|---|---|
| Install `lighthouse` CLI | `bun add -d lighthouse` (or `npm i -g lighthouse` for global) | available in PATH |
| Install `pa11y` or `axe-core` CLI | `bun add -d pa11y` | available |
| Lighthouse run per route, mobile + desktop | `bunx lighthouse https://miasanabriarealtor.trueidea.com/ --output=json --output-path=reports/lighthouse-mobile-home.json --preset=mobile --headless` × routes | JSON per page |
| Compare LCP / CLS / TBT against target (LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms) | parse Lighthouse JSON | per-page scorecard |
| pa11y per page | `bunx pa11y https://miasanabriarealtor.trueidea.com/ --reporter json` × routes | violation per page |
| Axe browser dev-tools manual run on top-5 routes | Chrome DevTools | manual violation list |

## Risk-of-issue priors (without deeper tooling)

These are unverified suspicions worth a fresh look in the follow-up cycle:

| Topic | Hypothesis | Validation method |
|---|---|---|
| LCP on `/markets/fort-lauderdale/` (large hero + many sections + 3 PDF previews) | likely 2.0–2.8s mobile; close to 2.5s budget | Lighthouse |
| CLS on FeaturedMarketsPager (paginates 6 markets) | suspect — pager interaction may shift layout | Lighthouse + manual |
| Tap targets on mobile nav | header drawer button needs ≥44px touch target verification | pa11y / manual |
| Focus visibility on form inputs | currently relies on default Tailwind ring; verify `focus-visible` styles across forms | manual |
| Cumulative JS payload | small — Next static export + minimal client components | Lighthouse bundle analyzer |
| IDX iframe blocking interaction during load | `loading="lazy"` should defer; verify TBT impact | Lighthouse |

## Named follow-up

**Cycle 21-A11Y-PERF prompt (drop-in):**

> Mission: Install `lighthouse` and `pa11y` (or `axe-core`) as devDeps. Run Lighthouse per route at mobile+desktop preset against `https://miasanabriarealtor.trueidea.com/`. Run pa11y on the same set. Compare CWV against budget (LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms; pa11y zero serious violations). Surface findings as issue-matrix rows tied to ISS-020 / ISS-021. Implement P0 fixes (e.g., add `width`/`height` to any image missing them; ensure tap targets ≥44px on mobile). Re-run for green. Save reports under `docs/artifacts/cycle-21-a11y-perf/`. Note: GHL form wiring (Cycle 21-GHL) should run BEFORE this audit so the form inputs in the audit reflect production state.

## Cross-references

- ISS-020 (a11y) and ISS-021 (perf) in `issue-matrix.md`.
- IDX iframe a11y review: `idx-search-audit.md`.
- Image alt audit: `audit-completeness.images.*`.
