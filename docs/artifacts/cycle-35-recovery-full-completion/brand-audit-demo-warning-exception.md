# Cycle 35 — Brand Audit Demo Warning Exception

**Phase 4 deliverable.**

## Before — failure reproduction

`bun run audit:brand` (HEAD `0a00206`):

```
  ✗ brand.noForbiddenColors — 3 off-brand uses
  …
Summary: 11 PASS · 0 WARN · 1 FAIL · 0 SKIP
```

JSON detail (paraphrased):

| File | Line | Token | Reason |
|---|---|---|---|
| `src/components/bridge/BridgeSearch.tsx` | 51 | `text-amber-700` | MlsMatrixFallback error-state warning copy |
| `src/components/bridge/BridgeSearch.tsx` | 120 | `border-amber-400` (+ `bg-amber-50` + `text-amber-900` on same line) | DemoBanner — "Demo data — Southeast Florida MLS feed pending." |
| `src/components/bridge/BridgeListingCard.tsx` | 48 | `bg-amber-500/90` | Per-card DEMO badge in `BRIDGE_DEMO_MODE` |

All three are pre-existing at HEAD `3abbe05` (Cycle 33/33B). None are Cycle 34 regressions.

## Why semantic warning color is required

Bridge demo mode (`BRIDGE_DEMO_MODE=true`) shows non-real listings while the SEF MLS
production feed is pending. Visual differentiation of demo vs. real data is a
**user-facing honesty signal**. `CLAUDE.md` for this repo encodes:

> "Do not hide Bridge demo mode while demo data appears."

Tailwind amber tokens are the conventional warning palette. Re-coloring to
brand-palette navy/brass would either (a) silently soften the warning until users miss
the distinction, or (b) repurpose a brand token in a way that future audits would have
to special-case anyway. Neither is an improvement; both weaken the demo-honesty signal.

The `--no-preflight` deploy escape is explicitly **rejected** by the Cycle 35 brief
unless a semantic fix proves impossible. A semantic fix is straightforward; the brief
default is correct.

## What changed

### `src/components/bridge/BridgeSearch.tsx`

- The MlsMatrixFallback error-state `<p>` (line 51 in pre-edit file) now carries
  `data-brand-exception="demo-warning"` on the element holding the amber class.
- The `DemoBanner` outer `<div>` (line 120 in pre-edit file) now carries
  `data-brand-exception="demo-warning"`.

### `src/components/bridge/BridgeListingCard.tsx`

- The DEMO badge `<span>` (line 48 in pre-edit file) now carries
  `data-brand-exception="demo-warning"`.

### `scripts/audit-brand-consistency.ts`

- New constants `BRAND_EXCEPTION_WINDOW_LINES = 8` and
  `BRAND_EXCEPTION_MARKER = /data-brand-exception\s*=\s*["']demo-warning["']/`.
- New helper `hasBrandExceptionMarkerNearby(lines, hitIdx)` returns true iff the marker
  appears within ±8 lines of the hit (covers JSX where the attribute lives on the
  opening tag and the class is on a sibling line).
- `checkSourceForbiddenPatterns()` now classifies each forbidden hit into either
  `hits` (real failures) or `allowedHits` (marker-justified) and reports both counts
  separately. The audit only FAILs on real `hits`.
- The check description is updated to:
  > "No off-brand color tokens (…) in src/ **unless annotated with
  > data-brand-exception=\"demo-warning\"**"

## Why this exception is narrow

| Property | Implementation |
|---|---|
| Scope | Each forbidden hit is evaluated individually. A line with no marker nearby still fails. |
| Locality | Marker must be within ±8 lines of the hit. JSX with the attribute on the opening tag and the class on the next line passes; cross-component "global allowlist" patterns do not. |
| Category | Only `demo-warning` is recognized today. Adding new categories requires editing the constant and producing a parallel artifact justifying the new category. |
| Reversibility | Remove the attribute from the JSX element, the audit re-FAILs immediately. The marker is the rule. |
| Discoverability | Anyone grepping for `data-brand-exception` finds every site of every brand-rule deviation in one query. |

## Anti-patterns rejected

| Rejected approach | Why |
|---|---|
| Global amber allowlist | Would let any future amber drift slip in unnoticed. |
| File-path allowlist (`src/components/bridge/**`) | Would allow any new off-brand token added anywhere in those files, including non-warning UI. |
| Replace amber with brand brass/navy | Would weaken the demo-honesty signal that the brief and `CLAUDE.md` require to preserve. |
| Default `--no-preflight` in `deploy-and-verify.ts` | Disables the full preflight chain (typecheck, lint, build, audit:all, audit-completeness) for one symptom. The brief explicitly rejects this. |

## After — audit result

`bun run audit:brand` (post-edit):

```
  ✓ brand.noForbiddenColors — no off-brand color tokens (3 allowed by data-brand-exception="demo-warning")
  ✓ brand.noForbiddenFonts
  ✓ brand.noForbiddenInBuilt
  ✓ brand.footerTrustElements
  ✓ brand.siteFooterStructure
  ✓ brand.siteFooterTrustStripAria
  ✓ brand.mobileNavPresent
  ✓ brand.heroH1ContrastTokens
  ✓ brand.heroNoNavyGlowHalo
  ✓ brand.heroNoCycle7WeakOverlay
  ✓ brand.heroOverlayLayers
  ✓ brand.publicEmailConsistency
Summary: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP
```

Allowed-hit detail is preserved in `reports/audit-brand-consistency.json` under
`details.allowedHits` for each result with a non-empty count.

## Acceptance

- `audit:brand` exits 0 without `--no-preflight`.
- The 3 allowed hits are still tracked + visible in the JSON report (so a regression
  audit can revisit them at any time).
- Bridge demo honesty preserved: same visible amber UI for both the warning copy and
  the per-card DEMO badge.
- No unrelated amber/orange/etc. uses elsewhere in `src/` are newly permitted (proven
  by the per-hit marker requirement).
