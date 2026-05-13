# Cycle 28 — Davie rendered-visual failure analysis

**Generated:** 2026-05-13T20:17:00Z
**Status:** REPRODUCED via cached `reports/audit-rendered-visual.{json,md}` (Cycle 27 run at 2026-05-13T20:00:31.995Z)

## Command run

```
bun run audit:rendered  # cached output read; not re-run yet (Phase 2 reruns after fix)
```

## Failure

| Field | Value |
|-------|-------|
| ISC | `rendered.hero.primaryCtaAboveFoldDesktop` |
| Route | `/markets/davie/` |
| Viewport | `1280x800` (Chrome dump-DOM reports `viewport.h = 713` after browser-chrome subtraction) |
| Status | ❌ FAIL |
| Evidence | `1 desktop probes push primary CTA below fold` |

## Fold logic (authoritative)

`scripts/audit-rendered-visual.ts:446-447`:

```ts
var FOLD_BUFFER = 88 + 24; // header + breathing room
var primaryBelowFold = primaryBox ? (primaryBox.bottom > vh - FOLD_BUFFER) : false;
```

Threshold: `vh - 112 = 713 - 112 = 601px`. CTA `bottom` must be **≤ 601** to pass.

## Actual measurement (Davie at 1280×800)

```json
"hero": {
  "panelBox":    { "y": 101,   "h": 546.5, "bottom": 647.5 },
  "headingBox":  { "y": 182,   "h": 155.5, "bottom": 337.5 },
  "subBox":      { "y": 353.5, "h": 192,   "bottom": 545.5 },
  "primaryCtaBox": { "y": 570.5, "h": 44,  "bottom": 614.5 },
  "primaryCtaBelowFold": true
}
```

CTA bottom **614.5 > 601** → fails by 13.5px.

## Cross-market comparison at 1280×800

| Market | subH | subBot | ctaBot | Threshold (601) | Status |
|---|---|---|---|---|---|
| coral-springs | 168 | 521.5 | 590.5 | -10.5 | ✅ |
| deerfield-beach | 168 | 521.5 | 590.5 | -10.5 | ✅ |
| weston | 168 | 521.5 | 590.5 | -10.5 | ✅ |
| sunrise | 168 | 521.5 | 590.5 | -10.5 | ✅ |
| **davie** | **192** | **545.5** | **614.5** | **+13.5** | ❌ |

Davie's `subBox` is **24px taller** than the next-largest passing market (Coral Springs/Deerfield/Weston/Sunrise at 168px), and is the **only** market in this cohort with an 8-line sub-paragraph at 1280px.

## Likely cause

`market.intro` for Davie is **71 words across two sentences**. Other markets in the same tagline-height cohort (Coral Springs, Sunrise, Weston, Deerfield) use ~60-word intros. The extra ~12-16 words push the wrap to an 8th line, adding 24px and breaching the fold buffer.

The Davie intro contains the phrase `"— first incorporated in 1925 and re-established as a municipal corporation in 1961 —"` (16 words) which is **already duplicated in three other places on the same page**:

1. `market.aeoAnswer` (rendered in Section 1, "An honest summary.")
2. `market.localContext` (used for schema only, but identical phrasing)
3. `market.faqs[0].answer` (rendered in Section 6, Davie FAQ)

## Safe fix possible?

**Yes.** Remove the inline date phrase from `market.intro` only. Word count drops to ~55 (in line with peer markets). No factual content lost — granular incorporation dates remain on the page via AEO answer and FAQ-1.

## Action

Edit `src/lib/markets.ts` line 1707 (Davie `intro` field). Rerun `audit:rendered`. Verify CTA bottom drops to ~590 and FAIL flips to PASS.

## Not chosen (alternative fixes considered)

- **Audit threshold weakening** — explicitly forbidden by mission ("not allowed: weakening the audit just to pass"). FOLD_BUFFER value (112px = header 88 + breathing 24) is a real header + safety budget.
- **Hero component layout change** — would affect every market route. Higher risk; out of scope.
- **Tighten gap between sub and CTA in Hero.tsx** — global layout change for one-market problem; cross-market regression risk.
- **Remove a highlight or rework heading** — Davie tagline is already cohort-standard; intro is the natural lever.

## Verdict

Real layout regression, not a flake. Root cause = content length. Fix scope = one field edit. Cross-market regression risk = zero (single market, single field).
