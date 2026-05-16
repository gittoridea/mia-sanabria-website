# Cycle 38 — Neighborhood Image Staging Final Report

date: 2026-05-16
target: `https://miasanabriarealtor.trueidea.com/`

## Per-slug staging verification

| slug | route HTTP | hero asset HTTP | og asset HTTP | hero bytes live==repo | og bytes live==repo | `<img>` in raw HTML | `<img>` in Chrome DOM | placeholder absent | new image visually | result |
|------|------------|-----------------|---------------|------------------------|----------------------|---------------------|-----------------------|---------------------|---------------------|--------|
| deerfield-beach | 200 | 200 | 200 | 199686 == 199686 ✓ | 106052 == 106052 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| hollywood | 200 | 200 | 200 | 271516 == 271516 ✓ | 130344 == 130344 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| plantation | 200 | 200 | 200 | 379393 == 379393 ✓ | 186532 == 186532 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| weston | 200 | 200 | 200 | 405135 == 405135 ✓ | 185248 == 185248 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| coral-springs | 200 | 200 | 200 | 394510 == 394510 ✓ | 198915 == 198915 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| davie | 200 | 200 | 200 | 263928 == 263928 ✓ | 133336 == 133336 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |
| sunrise | 200 | 200 | 200 | 222571 == 222571 ✓ | 122791 == 122791 ✓ | ✓ | ✓ | ✓ | ✓ | **live_verified** |

## Audit gate (live)

```
$ bun run audit:neighborhood-images-deep -- --base=https://miasanabriarealtor.trueidea.com
audit-neighborhood-images-deep: PASS — 23/23 markets
```

## Aggregate fields

```yaml
cards_visible_on_markets_index: 7/7
detail_heroes_visible: 7/7
no_photo_available_count: 0
broken_images_count: 0
final_result: live_verified
```

## How the original "not displaying" failure ended

The pre-Cycle-38 baseline (`ed24e69`) had the same HTTP/asset and HTML structure — 200s, correct img tags. The user-visible failure was that the JPEG pixel content for several slugs included framed-canvas compositions with large white margins. Cycle 38 regenerated those 7 assets with explicit photorealism prompts and a perimeter-whiteness validator. Staging now serves the new files (verified byte-for-byte against repo), and the new pixel content reads as full-bleed photorealistic editorial. Operator-visible defect resolved.
