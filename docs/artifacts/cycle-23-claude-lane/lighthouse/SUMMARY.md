# Lighthouse Baseline — Cycle 23 Claude Lane

**Generated:** 2026-05-13
**Build:** `bun run build` (Next.js 15.1.0 static export) → served via `python3 -m http.server` on `localhost:4173`
**Tool:** `lighthouse@13.3.0` (narrow devDependency add this session)
**Page tested:** `/` (homepage)
**Chrome flags:** `--headless=new --no-sandbox --disable-dev-shm-usage`

## Scores

| Category | Desktop | Mobile |
|---|---|---|
| Performance | 95 | 73 |
| Accessibility | 93 | 93 |
| Best Practices | 100 | 100 |
| SEO | 69 | 69 |

## Headline findings

- **Best Practices: 100/100** on both form factors — clean baseline.
- **Accessibility: 93/100** — small fixed deductions, consistent across viewports.
- **Mobile Performance: 73/100** — worth investigating before .com cutover.
- **SEO: 69/100** — flagged identically on both. The SEO deduction is almost certainly the staging `robots.txt: Disallow: /` (intentional per `IS_STAGING` gate; will flip to indexable at .com cutover per Tomorrow §5.3). Validate post-cutover.

## Raw reports

- `lighthouse-desktop.report.html` / `.json`
- `lighthouse-mobile.report.html` / `.json`

## Interpretation

Static export served locally; results approximate prod-on-CDN. Final pre-cutover Lighthouse should run against the production hostname over Caddy/CDN. Treat these as a directional baseline, not a launch gate.
