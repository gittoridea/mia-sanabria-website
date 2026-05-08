# Team F — QA / Regression Engineer Audit

## Verdict (one sentence)
`concerns` — the chain mostly works and catches most content/SEO drift, but there are high-risk coverage holes (especially market-route undercoverage and deploy-gate mis-read logic) plus an environment-level blocker for full command validation in this run.

## Current audit chain coverage map
- `bun run typecheck` (`package.json:11`) validates TypeScript types only; no runtime or runtime-SEO checks.
- `bun run lint` (`package.json:10`) checks ESLint rules but writes `.next/cache` and failed under read-only FS.
- `bun run build` (`package.json:8`, `next.config.ts:3-6`) produces static export and build artifacts (`output: "export"`).
- `bun run audit:all` (`package.json:17`) runs:  
  - `scripts/audit-stale-terms.ts` term hygiene scan of `out/`.
  - `scripts/audit-schema.ts` JSON-LD parse + `@context` + `@type`.
  - `scripts/audit-links.ts` internal href existence check in built HTML.
  - `scripts/audit-seo.ts` page-level SEO/AEO checks via regex (h1/title/description/canonical/og/twitter/html lang/hreflang + word floor).
  - `scripts/audit-completeness.ts` structural drift checks (16 checks across 9 categories).
- `scripts/audit-completeness.ts` adds the “hardening” layer: route↔sitemap consistency, legal pages, per-page metadata, footer trust sentinels, images, forms, blog/sitemap/schema presence.
- `scripts/audit-mobile.ts` is separate and not part of `audit:all`/deploy preflight.
- `scripts/deploy-and-verify.ts` chains preflight, Dokploy trigger, cache-bust HEAD check, and optional Lighthouse run.

## Coverage gaps (high → low priority)
1. High: Market-route undercoverage in completeness checks — `MARKET_PAGES` is hardcoded to 8 routes in [scripts/audit-completeness.ts:53-62](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts), but actual `out/` and sitemap routes are 25 total with 13 market routes; this leaves 6 market pages outside several checks.
2. High: Deploy gate reads wrong field — [scripts/deploy-and-verify.ts:112-120](file:///home/torrey/code/mia-sanabria-website/scripts/deploy-and-verify.ts#L112) expects `reports/audit-completeness.json.summary`, but current report shape uses `counts`, so the FAIL gate can be bypassed by malformed JSON shape.
3. High: No hard performance threshold enforcement — `deploy-and-verify` runs Lighthouse but never fails on score regressions; it only prints a scoreboard.
4. Medium: Screenshot coverage is limited and detached from gate — default script captures 5×5 (`5 viewports × 5 routes`) in [scripts/audit-mobile.ts:20-34](file:///home/torrey/code/mia-sanabria-website/scripts/audit-mobile.ts#L20) and is not run in `audit:all` or required preflight.
5. Medium: Broken-link checks miss runtime/JS links and some valid href patterns — [scripts/audit-links.ts:27-55](file:///home/torrey/code/mia-sanabria-website/scripts/audit-links.ts#L27) only scans `href="..."` matches, misses single-quoted hrefs, protocol-relative/JS-generated links, and anchor-only interactions.
6. Medium: Schema type integrity is shallow — [scripts/audit-schema.ts:17-34](file:///home/torrey/code/mia-sanabria-website/scripts/audit-schema.ts#L17) validates parseability and keys, but not schema semantics or per-route expected schema type contracts.
7. Medium: Image health checks still produce false-positive-prone warnings for `next/image` fill patterns while not validating intrinsic dimensions, file-size budgets, or alt quality [scripts/audit-completeness.ts:353-383](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L353).

## Coverage gaps — audit-completeness (16 checks across 9 categories)
- Categories present: Sitemap (2), Compliance (2), SEO/AEO (4), Local Authority (1), Design/Display (2), Forms/CTAs (1), Blog (3), Schema (1).
- Current run output: 14 PASS, 2 WARN, 0 FAIL, but not trusted for long-term storage because `audit:all` exits non-zero when report write fails on read-only FS.
- Missing check classes not covered:
  - perf/a11y budget thresholds by route
  - route manifest drift vs source-of-truth (`src/app` and `src/lib/markets.ts`)
  - live staging smoke validation (200 on all routes)
  - artifact size/budget regressions
  - accessibility runtime checks (focus order, contrast, landmarks, forms)

## Recommended new automated checks (specific scripts to add)
1. Add [scripts/audit-route-contract.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-route-contract.ts): compare source route contracts (`src/app` + `src/lib/markets.ts`) to built routes and sitemap routes, fail on missing/extra critical routes.
2. Add [scripts/audit-lighthouse-drift.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-lighthouse-drift.ts): persist baseline JSON and fail if Perf/SEO/Accessibility delta exceeds threshold.
3. Add [scripts/audit-image-health.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-image-health.ts): validate width/height where required, intrinsic dimensions, mime, and oversized image budgets, and skip known Next `fill`/`layout` edge patterns explicitly.
4. Add [scripts/audit-runtime-links.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-runtime-links.ts): smoke-check live staging `a[href]` and JS-generated route transitions for 404s and broken internal API endpoints.
5. Add [scripts/audit-route-snapshot.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-route-snapshot.ts): fetch/render 25+ key routes from staging and assert canonical/OG consistency + 200 status.
6. Add Playwright smoke script [scripts/smoke-critical-flows.ts](/home/torrey/code/mia-sanabria-website/scripts/smoke-critical-flows.ts) for nav, contact path, valuation CTA, and market page CTA on 25 route set.

## Recommended improvements to existing scripts (file/line)
1. [scripts/audit-completeness.ts:53-62](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L53): replace hardcoded `MARKET_PAGES` with dynamic route list from `src/lib/markets.ts` so all 13 market routes are covered.
2. [scripts/audit-completeness.ts:74,297-314](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L74): remove hardcoded “all 7 market pages” text and compute word-floor assertions dynamically.
3. [scripts/audit-completeness.ts:353-383](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L353): replace sample-only image checks with full-route image quality pass or explicitly mark expected coverage intent.
4. [scripts/audit-completeness.ts:534-563](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L534): validate JSON-LD on all built routes (or all routes from sitemap), not only current hardcoded page subset.
5. [scripts/audit-completeness.ts:622,657-659](file:///home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts#L622): make report writes resilient (`.tmp` write then move, optional path override) to avoid breaking in constrained FS.
6. [scripts/deploy-and-verify.ts:112-120](file:///home/torrey/code/mia-sanabria-website/scripts/deploy-and-verify.ts#L112): read `counts` instead of `summary`, or support both keys.
7. [scripts/deploy-and-verify.ts:178-211](file:///home/torrey/code/mia-sanabria-website/scripts/deploy-and-verify.ts#L178): add post-deploy 200 checks for all critical routes plus mandatory Lighthouse threshold assertions.

## Recommended new test surface (if any — minimum useful)
1. Minimal unit: [Bun + Vitest] for route constants and schema-builder helpers (`src/lib/markets.ts`, any shared metadata/schema helpers), no browser needed.
2. Minimal e2e: Playwright smoke across 25 core routes for `status 200`, nav links, CTA clickability, and no JS console errors.
3. Minimal a11y/perf: axe-core smoke on 10 highest-value routes and Lighthouse score guard on 4 critical routes (`/`, `/about/`, `/sellers/`, `/markets/fort-lauderdale/`).

## Process improvements (deploy + dev workflow)
- Gate `audit:all` artifacts with `--fail-if-artifact-stale` behavior so preflight cannot silently continue with stale/missing JSON.
- Treat `bun run audit:all` as mandatory in CI before any Dokploy trigger, and add a separate `bun scripts/deploy-and-verify.ts --no-lighthouse` branch for quick hotfixes.
- Add a dedicated `npm`-free (`bun`) preflight profile for CI and another for local (`audit:mobile`) that stores screenshots under workspace artifacts.
- Track baseline audit JSON versions in `reports/baselines/` and gate on regression deltas.

## What we should NOT add (over-engineering risks)
1. No full visual pixel-diff suite across all 25 routes every commit; use focused smoke + drift thresholds first.
2. No external language/runtime dependency stack rewrite (no Python validation layer).
3. No route-by-route Playwright DOM snapshot goldens before source-of-truth route manifest is stable.
4. No shift away from `bun` or from `output: "export"`.

## Anti-criteria check
- ❌ Do not suggest npm/npx: not proposed.
- ❌ Do not suggest Python: not proposed.
- ❌ Do not suggest removing static export: not proposed; `next.config.ts` keeps `output: "export"` and `images.unoptimized: true`.
- ✅ Command chain captured with explicit tool-call outputs and concrete numbers.
- ✅ Current known anti-risk remains unchanged: no DNS or production cutover implied.

## Evidence appendix
- Model used: gpt-5.3-codex-spark
- Reasoning: xhigh / Sandbox: read-only
- Audit chain results captured during run
  - `bun run typecheck` passed (exit 0).
  - `bun run lint` failed with read-only FS cache write error at `.next/cache/eslint`.
  - `bun run build` failed with read-only FS cache write error at `.next/trace`.
  - `bun run audit:all` produced:
    - stale: clean, schema: `148` blocks across `27` pages, links: `0` broken on `1220` checked, seo: `0` warnings, completeness: `14 PASS · 2 WARN · 0 FAIL`, but command failed while writing `reports/audit-completeness.json` due read-only FS.
  - Route evidence: `out/` contains 25 public routes (plus 404 variants/assets) and sitemap check in completeness reports `25 built · 25 in sitemap · 0 missing`.
  - Screenshot evidence in repo: `audit-mobile` defaults to 5×5, while prior artifact directory contains additional market snapshots (`/tmp/mia-markets-v3-shots`) with limited coverage.
  - Preflight/deploy gaps evidenced in [scripts/deploy-and-verify.ts](/home/torrey/code/mia-sanabria-website/scripts/deploy-and-verify.ts) and completeness gating behavior in [scripts/audit-completeness.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts).
  - Current report snapshot: [reports/audit-completeness.md](/home/torrey/code/mia-sanabria-website/reports/audit-completeness.md).

{"verdict":"concerns","completeness":"partial","top_concerns":["audit-completeness hardcodes only 7 market routes despite 13 built market pages","deploy preflight reads wrong `summary` field from audit-completeness JSON","performance thresholds are not enforced during deploy despite Lighthouse sweep","read-only FS currently blocks full lint/build/audit artifact writes",""],"new_checks_recommended":6,"existing_script_improvements":7,"high_severity_gaps":4}
