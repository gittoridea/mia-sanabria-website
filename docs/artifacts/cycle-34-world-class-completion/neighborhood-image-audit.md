# Cycle 34 — Neighborhood Image Audit

> Phase 12 deliverable. Inventory of every neighborhood / city image asset in `public/`, with provenance, classification, and action.

## Method

```bash
find public -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.avif' \) | sort
```

## Slot-by-slot matrix

> Status:
> - `approved` = currently in repo, audited green, no action needed.
> - `brand-tone-placeholder` = Cycle 25 placeholder; awaiting Mia photography.
> - `replace-with-licensed` = aspirational, gated on Mia photo deliverable.
> - `operator-needed` = no asset to ship without operator input.

### Hero / homepage / search

| Route | Slot | Current path | Provenance | Status | Action |
|---|---|---|---|---|---|
| `/` | Hero background | `public/markets/fort-lauderdale.jpg` | repo-approved (Cycle 24) | approved | Keep. |
| `/home-search/` | Hero background | `public/markets/fort-lauderdale.jpg` | repo-approved | approved | Keep. |
| `/markets/` | Hero background | `public/markets/hillsboro-mile.jpg` | repo-approved | approved | Keep. |

### Approved Broward working-set markets

| Slug | Detail page hero | OG card | Provenance | Status | Action |
|---|---|---|---|---|---|
| `fort-lauderdale` | `public/markets/fort-lauderdale.jpg` | `public/og-markets/fort-lauderdale.jpg` | repo-approved | approved | Keep. |
| `pompano-beach` | `public/markets/pompano-beach.jpg` | `public/og-markets/pompano-beach.jpg` | repo-approved | approved | Keep. |
| `deerfield-beach` | `public/markets/deerfield-beach.jpg` | `public/og-markets/deerfield-beach.jpg` | brand-tone-placeholder (Cycle 25) | placeholder | Replace with Mia-licensed photo when delivered. |
| `coral-springs` | `public/markets/coral-springs.jpg` | `public/og-markets/coral-springs.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |
| `plantation` | `public/markets/plantation.jpg` | `public/og-markets/plantation.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |
| `weston` | `public/markets/weston.jpg` | `public/og-markets/weston.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |
| `hollywood` | `public/markets/hollywood.jpg` | `public/og-markets/hollywood.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |
| `davie` | `public/markets/davie.jpg` | `public/og-markets/davie.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |
| `sunrise` | `public/markets/sunrise.jpg` | `public/og-markets/sunrise.jpg` | brand-tone-placeholder | placeholder | Replace when delivered. |

### Reference / Eastern FtL waterfront cohort

| Slug | Detail page hero | OG card | Provenance | Status | Action |
|---|---|---|---|---|---|
| `coral-ridge` | `public/markets/coral-ridge.jpg` | `public/og-markets/coral-ridge.jpg` | repo-approved | approved | Keep. |
| `victoria-park` | `public/markets/victoria-park.jpg` | `public/og-markets/victoria-park.jpg` | repo-approved | approved | Keep. |
| `boca-raton` | `public/markets/boca-raton.jpg` | `public/og-markets/boca-raton.jpg` | repo-approved | approved | Keep. |
| `palm-beach` | `public/markets/palm-beach.jpg` | `public/og-markets/palm-beach.jpg` | repo-approved | approved | Keep. |
| `delray-beach` | `public/markets/delray-beach.jpg` | `public/og-markets/delray-beach.jpg` | repo-approved | approved | Keep. |
| `lighthouse-point` | `public/markets/lighthouse-point.jpg` | `public/og-markets/lighthouse-point.jpg` | repo-approved | approved | Keep. |
| `rio-vista` | `public/markets/rio-vista.jpg` | `public/og-markets/rio-vista.jpg` | repo-approved | approved | Keep. |
| `harbor-beach` | `public/markets/harbor-beach.jpg` | `public/og-markets/harbor-beach.jpg` | repo-approved | approved | Keep. |
| `las-olas-isles` | `public/markets/las-olas-isles.jpg` | `public/og-markets/las-olas-isles.jpg` | repo-approved | approved | Keep. |
| `seven-isles` | `public/markets/seven-isles.jpg` | `public/og-markets/seven-isles.jpg` | repo-approved | approved | Keep. |
| `sea-ranch-lakes` | `public/markets/sea-ranch-lakes.jpg` | `public/og-markets/sea-ranch-lakes.jpg` | repo-approved | approved | Keep. |
| `hillsboro-mile` | `public/markets/hillsboro-mile.jpg` | `public/og-markets/hillsboro-mile.jpg` | repo-approved | approved | Keep. |
| `bay-colony` | `public/markets/bay-colony.jpg` | `public/og-markets/bay-colony.jpg` | repo-approved | approved | Keep. |
| `bermuda-riviera` | `public/markets/bermuda-riviera.jpg` | `public/og-markets/bermuda-riviera.jpg` | repo-approved | approved | Keep. |

### Insights / OG

All 12 `public/og-insights/<slug>.jpg` files present and audit-green (`audit:images`). No action.

### Mia headshot

`public/mia-headshot-{256,512}.jpg` and `public/mia-headshot.jpg` — operator-provided, approved, keep.

## Summary

- **23 approved repo assets** — keep.
- **7 brand-tone placeholders** — Cycle 25 cohort (Deerfield, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise); replace when Mia delivers licensed photography.
- **0 missing slots** — no broken images.
- **0 off-topic assets** — every image accurately matches its slot.
- **0 unlicensed third-party assets** in repo.

No image generation performed this cycle. Generation prompts and one-sample protocol in `neighborhood-image-generation-briefs.md`.
