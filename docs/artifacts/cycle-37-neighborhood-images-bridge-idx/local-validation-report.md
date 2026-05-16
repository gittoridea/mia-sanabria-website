# Cycle 37 — Local Validation Report

All gates run against the post-Cycle-37 source + freshly rebuilt `out/`.

| Gate | Result | Notes |
|------|--------|-------|
| typecheck (`bun run typecheck`) | PASS | tsc --noEmit clean |
| lint (`bun run lint`) | PASS | next lint — no warnings or errors |
| build (`bun run build`) | PASS | static export, 57 routes prerendered |
| audit:stale | PASS | 0 stale terms across out/ |
| audit:schema | PASS | 287 JSON-LD blocks parsed clean |
| audit:links | PASS | 2,845 internal links resolve |
| audit:seo | PASS | 0 warnings, 0 errors |
| audit:completeness | PASS (1 expected WARN) | IDX category now Bridge-shaped (5/5 sentinels on /home-search/); the WARN is the long-standing forms.classification (mailto vs GHL — out-of-cycle decision) |
| audit:images | PASS | 397 `<img>` tags + 57 og:image refs resolve; 23/23 markets card-image present; 23/23 OG asset present |
| audit:brand | PASS | 12/12 — added `data-brand-exception="demo-warning"` annotation on the IDX/MLS disclosure paragraph in ErrorPanel to keep brand audit honest |
| audit:hero-contrast:stable | PASS | 145/145 (3 samples × 29 hero probes) |
| audit:rendered | PASS (1 known WARN) | 0 broken images across 175 probes; the WARN is the chrome `--dump-dom` viewport clamp issue, pre-existing |
| audit:route-inventory | PASS | 48 sitemap routes reconcile to filesystem |
| audit:no-fabrications | PASS | 0 fabrication hits |
| audit:qa-gate | PASS (critical=0) | 56 routes scanned; critical 0, high 4, medium 1, low 56 |
| audit:trust-row | PASS | 59/59 sources clean (HTML routes + PDFs) |
| audit:lead-magnets | PASS | 4/4 checks pass; canvas warnings are pdf.js artifacts, unchanged |
| audit:legal | PASS (1 expected WARN) | 18/19 — the WARN is USCO in-process language acceptable for staging |
| audit:about | PASS | 12/12 |
| audit:fort-lauderdale-standard | PASS | 31/31 |
| audit:featured-markets | PASS | 17/17 |
| audit:insights | PASS | 547/547 |
| audit:mobile-readability | PASS | 84/84 across 7 viewports |
| **audit:no-old-idx (NEW)** | **PASS** | 477 files scanned, 0 forbidden hits |
| **audit:neighborhood-images-deep (NEW)** | **PASS** | 23/23 markets meet thresholds (≥80 KB hero, ≥60 KB OG, ≥1200×1500 hero, ≥1200×630 OG) |

## Visual QA

Captured 20 PNGs (375×812 + 1280×800) for `/`, `/home-search/`, `/markets/`, and the 7 new neighborhoods. All renders succeeded; spot-check of `/markets/davie/` and `/markets/hollywood/` confirmed the new images are visible, on-brand, and free of forbidden content (people / logos / homes / text).

## Gate trends vs Cycle 36D

- Cycle 36D ended with `audit:brand` PASS (only the semantic demo-warning exception). Cycle 37 maintains that PASS while extending the exception to one new disclosure paragraph in `ErrorPanel`.
- `audit:completeness` IDX category swapped from "matrix iframe" sentinel set to "Bridge search" sentinel set — strictly more truthful and locked against regression.
