---
cycle: 42
artifact: local-validation-report
generated_at: 2026-05-17
---

# Cycle 42 — Local Validation Report

## Gate results (verbatim exit codes from commands run after the helper-copy edit + fresh build)

```yaml
typecheck:                exit 0  PASS  (tsc --noEmit, no output)
lint:                     exit 0  PASS  (next lint — "No ESLint warnings or errors")
build:                    exit 0  PASS  (next build, static export produced, 56 static pages)
audit:brand:              exit 0  PASS  (12 PASS · 0 WARN · 0 FAIL · 0 SKIP)
audit:hero-contrast:stable exit 0  PASS  (145 PASS · 0 WARN · 0 FAIL · 0 SKIP)
audit:route-inventory:    exit 0  PASS  (48 sitemap routes reconcile to filesystem)
audit:no-fabrications:    exit 0  PASS  (0 hits)
audit:no-old-idx:         exit 0  PASS  (481 files scanned)
audit:home-bridge-search: exit 0  PASS  (all 7 sub-checks PASS, including home_form_filter_inputs city/minPrice/beds)
audit:home-hero-copy:     exit 0  PASS  (new scoped audit — source clean, out/ clean after fresh build)
audit:mobile-readability: exit 0  PASS  (84 PASS · 0 FAIL · 0 ERROR)
audit:qa-gate:            exit 0  PASS  (56 routes — critical 0, high 4, medium 1, low 56)
```

## qa-gate matrix breakdown

- `critical: 0` — gate is green per the brief's qa_gate_critical=0 requirement.
- `high: 4` — unchanged from Cycle 41 baseline; flagged as the readiness register (production cutover scope), not Cycle 42 work.
- `medium: 1` — baseline.

Cycle 42 introduced no new critical/high/medium findings.

## Audit:home-hero-copy first runs

| Run | When | Source | out/index.html | Result |
|---|---|---|---|---|
| Initial (after source edit, before rebuild) | Phase 3 | clean | flagged stale Cycle 41 build | exit 1 (expected) |
| Post-rebuild | Phase 4 | clean | clean | exit 0 |

The Phase 3 finding was the stale `out/` from Cycle 41's build; Phase 4's fresh `bun run build` refreshed `out/index.html` to contain the new copy, and the audit passes across both surfaces.

## Local build vs source: bad-copy scan

```bash
$ grep -oF "Begin with an area" out/index.html | wc -l   # new copy in build
2

$ grep -oF "Bridge-backed" out/index.html | wc -l        # old copy gone
0

$ grep -oF "Search routes" out/index.html | wc -l
0

$ grep -oF "listings alone cannot tell you" out/index.html | wc -l
0
```

The x2 count on the new copy is the standard Next.js SSR + RSC inline-payload pattern (same as the live-before bad-copy count of x2). Confirms one logical paragraph emission.

## What is NOT changing

- `src/app/page.tsx` — unchanged. The page composes `<HeroSearch floating />` as before.
- `src/components/Hero.tsx` — unchanged. Cycle 41 hero geometry preserved.
- `src/components/bridge/BridgeSearch.tsx` — unchanged. URL-param consumption on `/home-search/` unchanged.
- `src/app/home-search/page.tsx` — unchanged. Out-of-scope body content (different surface).
- `src/lib/site.ts`, `src/lib/mia.ts`, `src/lib/bridge.ts` — unchanged.

## Verdict

All required local gates are green after the helper-copy edit. Cycle 42's local surface is ready for commit, push, and staging deploy.
