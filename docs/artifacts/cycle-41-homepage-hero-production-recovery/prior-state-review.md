---
cycle: 41
artifact: prior-state-review
generated_at: 2026-05-17
---

# Cycle 41 — Prior State Review

## What Cycle 40B/C claimed

- Cycle 40B (`8095c78`): swapped homepage hero asset to the daytime waterfront composition `/hero/mia-home-hero-cycle40b.jpg`, added the floating `HeroSearch` card wired to Bridge params (`city`, `minPrice`, `beds`, `source`), and added the defensive overflow CSS (`overflow-hidden`, `[contain:inline-size]`, `[overflow-wrap:break-word]`).
- Cycle 40C (`d851494`, `4e6f922`, `9a6ab53`): fixed `markets.ts` paths, closed visual recovery with the cycle40b hero retained, and reported the staging ETag flip + final-deploy alignment.
- Cycle 40C red-team verdict: "Mobile hero defect is ruled non-existent in real browsers." Justification used Playwright CDP `setDeviceMetricsOverride` measurements (`docScroll === viewport`, `hasHorizontalScroll === false`).
- Cycle 40C visual QA inspection: declared hero pass-by-route across 11 viewports.

## What the operator screenshot shows is still wrong

The operator-supplied current-live screenshot — and the Cycle 41 live-before captures against `https://miasanabriarealtor.trueidea.com/` — both show that visual-truth issues remain. These are layout / hierarchy issues, not horizontal-overflow issues:

1. The navy copy panel covers ~45–50% of the hero at desktop and ~70% at tablet; the image becomes background filler.
2. The eyebrow `SOUTH FLORIDA LIFESTYLE` sits directly above an H1 whose first line is the same five words verbatim (`South Florida Lifestyle / Home Search`). Reads like a page label, not a homepage promise.
3. The floating search card spans the full `max-w-7xl` width as a 4-column database row at desktop. Sits partially over the hero image bottom and partially over the cream section below — the integration is functional but feels pasted on.
4. After the search card, a `h-16 sm:h-20` spacer + the next section's own `py-*` produces a visible empty cream gap before `MIA'S SERVICE AREAS`.
5. The hero `min-h-[440-500-480]` is short on lg — image and copy compete in a constrained band.

The Cycle 40C "non-existent mobile defect" claim is technically defensible (Playwright measurements were valid), but it answered a different question. **The Cycle 40C closeout proved mobile geometry was correct; it did not certify the hero felt production-grade.** Cycle 41 is about the felt-quality gap, not the measurable-overflow gap.

## Homepage hero source files involved

```yaml
src/components/Hero.tsx:
  active_eyebrow_renderer: lines 163–186 (gold accent line + uppercase eyebrow text)
  active_panel:            lines 154–162 (data-hero-copy-panel="true", bg-navy-900/85→/90→/92)
  active_max_width:        line 153 (max-w-2xl on the panel column)
  active_min_height:       line 149 (min-h-[440px] sm:min-h-[500px] lg:min-h-[480px])
  active_content_scrim:    lines 130–134 (from-navy-900/45 via-/20 to-/10)
  active_cta_scrim:        lines 135–139 (from-navy-900/85 bottom half-overlay)

src/app/page.tsx:
  active_eyebrow_text:    "South Florida Lifestyle"  (line 98)
  active_h1_text:         "South Florida Lifestyle / Home Search" (lines 99–105, ReactNode)
  active_sub:             "Discreet, local guidance for Southeast Florida luxury homeowners, absentee owners, and qualified buyers — from a small, deliberate practice." (line 106)
  active_cta_primary:     { href: /home-search/, label: Search available homes } (line 107)
  active_cta_secondary:   { href: /contact/, label: Talk with Mia } (line 108)
  active_image:           /hero/mia-home-hero-cycle40b.jpg (line 110)
  active_floating_search: <HeroSearch floating />          (line 113)
  active_post_spacer:     <div className="h-16 sm:h-20" /> (line 116)

src/components/HeroSearch.tsx:
  active_float_offset:    -mt-20 sm:-mt-24 (line 148)
  active_grid:            sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.9fr_auto] (line 57)
  active_card_padding:    p-4 sm:p-5 lg:p-6 (line 52)
  active_card_bg:         bg-cream-50/95 (line 52)
  active_card_max_width:  inherits max-w-7xl from container (line 150) — full hero width on desktop
```

## What hero image is currently active

`/hero/mia-home-hero-cycle40b.jpg` (315139 bytes, daytime luxury waterfront). Operator-authorized derivation from the miasanabria.com daytime hero. **Asset is correct and stays.** This cycle is design/layout, not asset.

## What copy is currently active

- Eyebrow: `South Florida Lifestyle`
- H1: `South Florida Lifestyle / Home Search` (two-line ReactNode)
- Sub: `Discreet, local guidance for Southeast Florida luxury homeowners, absentee owners, and qualified buyers — from a small, deliberate practice.`
- CTAs: `Search available homes` (brass primary) + `Talk with Mia` (outlined secondary)

The H1 is Mia-locked in `docs/mia-client-decision-record.md` §Homepage hero (lines 86–88). The H1 text MUST NOT change. The eyebrow is principal-listed in the decision record's same section but the redundancy is now an obvious felt-quality defect. The mission brief permits the smallest tasteful copy improvement.

**Decision:** drop the eyebrow text from the homepage hero. The H1 already contains the exact eyebrow phrase as its first line, so dropping the eyebrow removes the duplication while preserving every locked word. The gold accent line is rendered conditionally on `eyebrow` presence — without eyebrow it goes away too, which is the intended visual simplification.

## What search form wiring is currently active

`HeroSearch` posts `method="get" action="/home-search/"` with hidden `source=home-hero` and `city`, `minPrice`, `beds` from the three selects. Approved-neighborhoods source is `MIA_APPROVED_NEIGHBORHOODS` from `src/lib/mia.ts`. BridgeSearch on `/home-search/` reads URL params on mount. Old IDX iframe was removed in Cycle 37 and remains absent.

Cycle 41 keeps this wiring exactly. Only the wrapper visual shape changes.

## What old IDX safeguards are active

- `audit:no-old-idx` script scans HTML for `sef.mlsmatrix.com`, `mlsmatrix.com`, `idxform`, etc.
- Cycle 37 Caddyfile fix removed `sef.mlsmatrix.com` from CSP `frame-src`.
- No `IdxEmbed` component imported anywhere in `src/`.

Cycle 41 preserves all three.

## What must be fixed now

1. Remove eyebrow text from homepage Hero (`src/app/page.tsx`).
2. Reduce dark copy panel dominance: lighter opacity at desktop, narrower max-width.
3. Reduce content-scrim gradient strength so the image reads as the primary visual.
4. Slim the floating search card on desktop (narrower max-width, refined padding).
5. Reduce the post-hero-search spacer so transition into "Mia's Service Areas" feels intentional.
6. Reduce the float negative-margin so the card doesn't pull as aggressively into the hero image.
7. Hold the H1 word-lock exactly.
8. Hold BridgeSearch wiring exactly.
9. Hold old-IDX absence exactly.
10. Validate, deploy, verify live.
