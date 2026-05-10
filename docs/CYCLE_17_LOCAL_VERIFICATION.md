# Cycle 17 — Local Verification

**Date:** 2026-05-10
**Method:** Run the full audit chain (`audit:all:stable`) plus the two new Cycle 17 audits (`audit:trust-logos`, `audit:fort-lauderdale-v3`) against the fresh local build. Report every gate.

## Build chain

| Gate | Status | Notes |
|---|:-:|---|
| `bun run typecheck` | ✅ PASS | `tsc --noEmit` zero output |
| `bun run lint` | ✅ PASS | `next lint` 0 warnings, 0 errors |
| `bun run build` | ✅ PASS | 45 routes built; 12 Insights articles + 15 markets + legal + core all generated |

## Audit chain (local)

| Audit | PASS | WARN | FAIL | Notes |
|---|---:|---:|---:|---|
| `audit:stale` | clean | 0 | 0 | "off-market" caught during Cycle 17 dev → rewritten before commit |
| `audit:schema` | 235 JSON-LD blocks | 0 | 0 | All blocks parse with @context + @type |
| `audit:links` | 2241 internal links | 0 | 0 | All resolve |
| `audit:seo` | clean | 0 | 0 | No warnings across 45 pages |
| `audit:completeness` | 15 | 1 | 0 | WARN: `forms.classification` (2 mailto — expected pre-GHL) |
| `audit:images` | 14 | 0 | 0 | All 294 `<img>` references resolve, all 45 og:images resolve |
| `audit:brand` | 12 | 0 | 0 | No off-brand colors/fonts; footer trust elements present |
| `audit:insights` | **535** | 0 | 0 | **Cycle 17 — banned-phrase rule for "Evergreen Brief" added, all 12 posts clean** |
| `audit:featured-markets` | 17 | 0 | 0 | 6-pager order locked; 15-market index complete |
| `audit:legal` | 18 | 1 | 0 | WARN: `dmca.uscoFlag` (USCO registration pending — expected) |
| `audit:about` | 12 | 0 | 0 | Sitewide overclaim sweep clean |
| `audit:hero-contrast:stable` | 105 | 0 | 0 | Glyph + edge contrast medians PASS at all 5 viewports, samples=3 |
| `audit:rendered` | 14 | 1 | 0 | WARN: `probe.viewportSanity` (chrome --dump-dom mobile clamp — known limitation, GPT-5.5 visual review covers gap) |
| **`audit:trust-logos`** (NEW Cycle 17) | **30** | 0 | 0 | 3 assets verified RGBA + alpha-visible-content; SiteFooter source verified; built homepage references verified; no REALTOR®+MLS combined mark |
| **`audit:fort-lauderdale-v3`** (NEW Cycle 17) | **11** | 0 | 0 | All V3 markers present in built HTML: precision hero, prelude eyebrow + heading, 7th decision card, emphasized eyebrow, peer pointers (12 matches), anti-pattern asides (4 matches), 2 new FAQs, Insights cross-link, 9 FAQPage Question entries |

**Net (local):** 1067 PASS · 4 WARN · 0 FAIL across 15 audits. Every WARN is structural/expected (mailto pre-GHL, USCO pending, mobile-clamp instrumentation).

## Cycle 17 specific verification gates

| Gate | Status | Evidence |
|---|:-:|---|
| "Evergreen Brief" zero in built `out/` | ✅ PASS | `grep -rn "Evergreen Brief" out/` returns no matches |
| "Market Note · `<Month>`" present | ✅ PASS | 261 occurrences in built output (12 articles × multiple render locations + Insights index + RelatedInsights modules) |
| New trust logos present + alt text + label | ✅ PASS | `audit:trust-logos` 30 PASS |
| Fort Lauderdale V3 hero + prelude + 7-card framework + peer pointers + asides + new FAQs | ✅ PASS | `audit:fort-lauderdale-v3` 11 PASS |
| All 4 legal routes accessible + canonical | ✅ PASS | `audit:legal` 18 PASS / 1 expected WARN |
| About credentials/service-area canonical | ✅ PASS | `audit:about` 12 PASS |
| Existing audit chain stays green | ✅ PASS | No new FAIL introduced |

## Build size + bundle stats

From `bun run build` final output:
- First Load JS shared by all routes: **105 kB** (unchanged from Cycle 16)
- Per-route JS payloads: 190–216 B route-specific JS, +114 kB total first-load
- 45 routes total: 11 core + 12 Insights articles + 15 markets + 4 legal + 3 thank-you variants

No bundle-size regression introduced by Cycle 17.

## Local screenshot evidence

`/tmp/mia-cycle17-after/` — 33 screenshots across 11 routes × 3 viewports + 1 full-page home + 1 about-mobile footer crop + 1 about-desktop footer crop. Inspection confirms:
- Homepage hero unchanged.
- Insights index hero unchanged.
- Insights article hero eyebrow now reads `INSIGHTS · MARKET NOTE · JANUARY` (Cycle 17 label).
- Fort Lauderdale page hero reads "Where deepwater yacht access, a working downtown, and a 165-mile canal system meet." (V3 precision frame).
- Fort Lauderdale "A decision, not a default" prelude + "Fort Lauderdale rewards a written brief" heading rendered between hero and Executive AEO.
- Footer trust strip renders LPT + REALTOR® (NAR canonical) + Equal Housing Opportunity (canonical HUD silhouette + equal sign).
- Mobile footer (375 wide) wraps cleanly; trust marks stack vertically with labels.

## What is NOT verified locally

| Gate | Reason | Closes at |
|---|---|---|
| Live Caddy serve + cache-flip | Local server is Python `http.server`, not the production Caddy chain | Phase 13 deploy |
| Real browser CDP capture | `--headless=new` + `--dump-dom` clamps mobile per known issue (Cycle 12 fix carried) | Phase 13 live screenshots |
| Caddy ETag confirmation | Local has no ETag headers | Phase 13 cache-bust |
| Real DBPR-confirmed REALTOR® member display | Asset is NAR-canonical; principal-legal sign-off pending | Pre-cutover review |

These do not block Cycle 17 closure on staging — they are external/principal/legal gates carried to `.com` cutover.

## Verdict

**Local verification PASS.** No FAIL across any audit. The Cycle 17 deliverables are stable in the build. Ready for Phase 11 (GPT-5.5 / Forge VERIFY review).

## Related artifacts

- Audit reports: `reports/audit-*.json` + `reports/audit-*.md` (regenerated 2026-05-10).
- Screenshots: `/tmp/mia-cycle17-after/`.
- New audit scripts: `scripts/audit-trust-logos.ts`, `scripts/audit-fort-lauderdale-v3.ts`.
- New package.json scripts: `audit:trust-logos`, `audit:fort-lauderdale-v3`.
