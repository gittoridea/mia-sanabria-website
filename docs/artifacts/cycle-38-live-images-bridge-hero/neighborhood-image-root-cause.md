# Cycle 38 — Neighborhood Image Root Cause

## Symptom (operator-reported, live-reproduced)

On `https://miasanabriarealtor.trueidea.com/markets/` and each `/markets/<slug>/`
detail page, the 7 neighborhood tiles for Deerfield Beach, Hollywood, Plantation,
Weston, Coral Springs, Davie, and Sunrise appeared "not displaying" to the
operator.

## What the live infrastructure was actually doing — confirmed clean

- All 14 `.jpg` URLs return HTTP 200 with non-zero bytes.
- Each local `.jpg` is a valid progressive JPEG at correct dimensions
  (1200×1500 hero / 1200×630 OG), git-tracked in `ed24e69` (Cycle 37).
- `<img src="/markets/<slug>.jpg">` tags are present in:
  - raw HTML from `curl`,
  - rendered DOM from `google-chrome --headless=new --dump-dom`.
- No `No photo available` placeholder appears anywhere.
- No 404, CSP block, CORS error, MIME mismatch.

## The actual defect — image content, not delivery

Cycle 37 used `scripts/generate-neighborhood-images.ts` with this prompt header:

> "Premium South Florida real estate editorial photograph … Refined,
> magazine-quality, **painterly luxury aesthetic** … **illustrative not
> photo-real claims** … **16:9 horizontal framing** …"

Gemini 2.5 Flash Image obliged literally: several outputs are **paintings of
neighborhood scenes**, some rendered as **framed canvases on a white gallery
wall** with the actual scene only occupying a portion of the frame. The Sharp
resize step (`fit: cover, position: centre`) preserved the white-margin/gallery
geometry baked into the pixels.

Worst defects (visually verified by reading the JPEGs):

| asset | defect |
|-------|--------|
| `public/markets/hollywood.jpg` (1200×1500) | scene drawn inside a black-bordered painting with large white margins above and below; majority of rendered tile is white canvas |
| `public/markets/davie.jpg` (1200×1500) | equestrian-fence scene drawn inside a tilted 3D-perspective frame with large white margin above; rendered tile dominated by white space |
| `public/markets/deerfield-beach.jpg` | painterly canvas-textured pier (less catastrophic but obviously illustrated) |
| `public/markets/plantation.jpg` | photorealistic-ish but symmetrical AI-canopy artifacts |
| `public/markets/weston.jpg` | generic AI fountain courtyard, not place-specific |
| `public/markets/sunrise.jpg` | abstract bronze sculptures, not representative of Sunrise FL |
| `public/markets/coral-springs.jpg` | AI tree-canopy pattern |

## Why the deep audit missed it

`scripts/audit-neighborhood-images-deep.ts` validates file existence, byte size
(≥80 KB hero / ≥60 KB OG) and dimensions (≥1200×1500 hero / ≥1200×630 OG). All
seven defect images pass those structural gates because they ARE valid JPEGs of
correct size. There is **no pixel-content check** in the deep audit.

## Why operator perceived it as "not displaying"

On a card with `aspect-[4/5]` and `object-cover`, a 1200×1500 image whose scene
only fills the centre portion (with white margins) renders as predominantly
white. To a viewer, the tile looks like a broken image / blank state — hence
"not displaying."

## Fix applied

1. Created `scripts/generate-neighborhood-images-v2.ts` with a hardened prompt
   header that:
   - explicitly demands "documentary-style editorial photograph (not a painting
     … not a framed artwork)",
   - explicitly forbids "frame, border, matting, white margin, canvas texture,
     gallery-wall presentation, drop shadow, 3D-perspective frame",
   - requests vertical portrait 4:5 framing native (instead of 16:9 cropped
     down),
   - keeps every safety constraint from Cycle 37 (no people, no logos, no
     identifiable landmarks).
2. Added a **perimeter-whiteness validator**: rejects any candidate whose
   50-px perimeter band is more than 25 % near-white pixels (defined as r,g,b
   each ≥ 235). Retries up to 2× per slug before failing.
3. Regenerated all 7 slugs. Every slug accepted on attempt 1 with perimeter
   ratios well under the 0.25 threshold (max 0.041 for Hollywood — small bright
   sky region, not a frame).
4. Final hero JPEGs visually inspected (Read tool) — all 7 now show
   photorealistic, place-appropriate, full-bleed compositions matching the
   editorial quality of the pre-existing `fort-lauderdale.jpg` baseline.

## Anti-regression — closing the gap

The perimeter-whiteness validator in `generate-neighborhood-images-v2.ts`
catches the framed-canvas defect class at generation time. A future hardening
step (deferred from Cycle 38) is to fold the same check into
`scripts/audit-neighborhood-images-deep.ts` so any future image swap is gated
on perimeter-whiteness — flagged in `remaining-blockers.md` for the next cycle.
