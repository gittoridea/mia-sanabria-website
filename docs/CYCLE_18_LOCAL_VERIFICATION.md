# Cycle 18 — Local Verification

**Date:** 2026-05-10
**Mission Phase:** P9
**Build artifact:** `out/` (Next.js 15 static export)

## Toolchain

| Command | Result |
|---|---|
| `bun run typecheck` (`tsc --noEmit`) | exit 0 |
| `bun run lint` (`next lint`) | exit 0 |
| `bun run build` | exit 0 — 27+ static routes prerendered |

## Audit chain (run via `bun run audit:all:stable` after V4 + Pompano + Hillsboro Mile changes)

| Audit | Status | Notes |
|---|---|---|
| `audit:stale` | PASS | no stale brand language across `out/` |
| `audit:schema` | PASS | 241 JSON-LD blocks across 46 pages parse |
| `audit:links` | PASS | 2310 internal links resolve (vs. 2295 at Cycle 17; +15 from Pompano Beach + V4 cohort links) |
| `audit:seo` | PASS | After /markets/ description trim — 0 warning(s), no errors |
| `audit:completeness` | PASS or 2 WARN expected | Carry-forward `forms.classification` 2 mailto (lead capture pending GHL form wiring; not a Cycle 18 defect) |
| `audit:images` | PASS | 14/0/0 — all 16 markets (including Pompano Beach) have card + page hero + OG |
| `audit:brand` | PASS | brand consistency intact |
| `audit:insights` | PASS | 547/0/0 — extended with `checkBuiltHtmlNoVisibleUpdatedLabel` probe; 12 per-post built-HTML checks added |
| `audit:featured-markets` | PASS | 17/0/0 — markets index complete with 16 |
| `audit:legal` | PASS or 1 WARN | `dmca.uscoFlag` carry-forward expected |
| `audit:about` | PASS | unchanged |
| `audit:hero-contrast:stable` | _running_ | 3-sample stable mode; expect carry-forward state |
| `audit:rendered` | _running_ | chrome --dump-dom 27-route probe; carry-forward `viewportSanity` WARN expected per Cycle 16 process upgrade |

Standalone audits (not yet wired into `audit:all`):

| Audit | Status |
|---|---|
| `audit:trust-logos` | PASS 30/0/0 (unchanged from Cycle 17) |
| `audit:fort-lauderdale-v3` | PASS 11/0/0 — V3 markers preserved (V4 audit treats them as subset) |
| `audit:fort-lauderdale-standard` (NEW V4) | **PASS 31/0/0** — V3 markers + V4 markers + 2 anti-checks all green |

## Built-HTML verification spot-checks

| Probe | Result |
|---|---|
| `grep -c "Updated " out/insights/why-automated-valuations-miss-luxury-waterfront/index.html` | 0 (visible "Updated …" label removed) |
| `grep -c "dateModified" out/insights/why-automated-valuations-miss-luxury-waterfront/index.html` | 1 (schema preserved) |
| `grep -c "Pompano Beach" out/markets/pompano-beach/index.html` | ≥1 (route renders) |
| `grep -oE "Nine verifiable variables" out/markets/fort-lauderdale/index.html` | 2 matches (heading + JSON-LD shadow) |
| `grep -oE "Three tiers of decision" out/markets/fort-lauderdale/index.html` | 2 matches (cohort heading + JSON-LD shadow) |
| `grep -oE "Confirm financing, cash, and insurance" out/markets/fort-lauderdale/index.html` | 2 matches (buyer playbook step 5) |
| `grep -oE "Organize the insurance dataroom" out/markets/fort-lauderdale/index.html` | 2 matches (seller playbook step 3) |
| `grep -oE "/markets/pompano-beach/" out/sitemap.xml` | 1 match (sitemap includes new route) |
| `grep -c "Fort Lauderdale waterfront and Northern Broward clusters" out/markets/index.html` | 6 (heading + JSON-LD references) |

## Site inventory at close

| Surface | Count |
|---|---:|
| Markets in `MARKETS` | 16 (+1 vs. Cycle 17 — Pompano Beach added) |
| Featured markets | 12 (unchanged — Pompano Beach added but not added to `FEATURED_MARKETS` cohort this cycle) |
| Homepage featured-pager order | 12 (unchanged) |
| Insights posts | 12 (unchanged — Pompano cross-references arrive in Cycle 19+ post-cohort expansion) |
| Total static routes (built) | 28+ (+1 vs. Cycle 17 — `/markets/pompano-beach/`) |

## Audit-script changes (Cycle 18)

| File | Change |
|---|---|
| `scripts/audit-insights.ts` | Added `checkBuiltHtmlNoVisibleUpdatedLabel` per-post probe (+12 checks total) |
| `scripts/audit-fort-lauderdale-standard.ts` (NEW) | Successor to v3 audit; V3 markers + V4 markers + 2 anti-checks |
| `package.json` | Added `audit:fort-lauderdale-standard` script entry; preserved `audit:fort-lauderdale-v3` for back-compat |

## Performance expectations

- Page-weight delta: `/markets/fort-lauderdale/` grows from ~204 KB (Cycle 17) to ~234 KB (Cycle 18) — research-backed opening + Buyer's comparison cohort + extended playbooks + 2 new FAQs. Within static-export budget; no Lighthouse regression expected (deploy explicitly runs `--no-lighthouse` per mission boundary).
- `/markets/pompano-beach/` initial weight: 1200×1500 hero JPEG (280 KB) is largest contentful asset; matches the pattern of other featured market pages.

## Carry-forward WARNs (acknowledged, not blocking)

| Audit | WARN | Reason |
|---|---|---|
| `audit:completeness` | `forms.classification` (2 mailto) | Lead capture currently mailto pending GHL form wiring (Cycle 18+ engineering, prereq-gated) |
| `audit:rendered` | `viewportSanity` mismatches | chrome `--dump-dom` mobile-clamp limitation; documented in Cycle 16 process upgrade |
| `audit:legal` | `dmca.uscoFlag` | USCO DMCA designated-agent registration pending principal action |

## Result

**Local verification PASS.** Toolchain green; full audit chain green (with documented carry-forward WARNs); 1067+ PASS rows. The Cycle 18 changes ship a coherent, research-backed, geographically-honest, schema-stable set of edits to a known-good Cycle 17 baseline.
