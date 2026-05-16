# Cycle 38 — Neighborhood Image Fix Report

date: 2026-05-16

## Inputs

- 7 affected slugs: `coral-springs`, `davie`, `deerfield-beach`, `hollywood`, `plantation`, `sunrise`, `weston`.
- Defect classification: Cycle 37 Gemini-generated images contained framed/painted compositions whose white margins dominated the rendered tile (Hollywood + Davie worst; others stylistically off vs photorealistic baseline). See `neighborhood-image-root-cause.md`.

## Action

1. Authored `scripts/generate-neighborhood-images-v2.ts`:
   - PROMPT_HEADER explicitly demands "documentary-style editorial PHOTOGRAPH" and explicitly forbids "frame, border, matting, white margin, canvas texture, gallery-wall presentation, drop shadow, 3D-perspective frame."
   - Requests vertical portrait 4:5 framing native (instead of 16:9 cropped down).
   - Per-slug `scene` prompts updated with "documentary-style photograph" prefix and "photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge" suffix.
   - New perimeter-whiteness validator: rejects candidates whose 50-px perimeter band is more than 25 % near-white pixels (r,g,b each ≥ 235). Retries up to 2× before failing.
   - Final post-resize validation on the actual hero JPEG too.
2. Ran the generator for all 7 slugs. Result:

| slug | attempts | raw perimeter-white ratio | hero bytes | og bytes |
|------|----------|---------------------------|-----------|----------|
| coral-springs | 1 | 0.001 | 394 KB | 199 KB |
| davie | 1 | 0.000 | 264 KB | 133 KB |
| deerfield-beach | 1 | 0.006 | 200 KB | 106 KB |
| hollywood | 1 | 0.041 | 272 KB | 130 KB |
| plantation | 1 | 0.003 | 379 KB | 187 KB |
| sunrise | 1 | 0.000 | 223 KB | 123 KB |
| weston | 1 | 0.007 | 405 KB | 185 KB |

All accepted on attempt 1; max perimeter ratio 0.041 (Hollywood — sky region, not a frame), well under the 0.25 threshold.

3. Visually verified each of the 7 hero JPEGs and a sample of OG variants via the Read tool. Each now renders as full-bleed photorealistic editorial content matching the brief.

4. Re-ran `audit:neighborhood-images-deep` → **PASS 23/23**. The existing audit could not detect the prior pixel-content defect, but the new generator's validator does, and the audit-deep continues to enforce structural correctness.

## Where the new images live

- `public/markets/<slug>.jpg` — 1200×1500 hero tile (matches MarketCard `aspect-[4/5]`).
- `public/og-markets/<slug>.jpg` — 1200×630 OG tile.
- All 14 files tracked in git via the Cycle 38 commit.

## Provenance

- All 7 newly generated assets are `provenance: ai-generated-illustrative`.
- Model: `gemini-2.5-flash-image`.
- Generation log: `docs/artifacts/cycle-38-live-images-bridge-hero/image-generation-log.md`.
- Ledger: `docs/artifacts/cycle-38-live-images-bridge-hero/image-provenance-ledger.md`.
- Alt text: editorial framing (not documentary truth claim).

## Anti-regression for the future

The Cycle-37 framed-canvas defect class would have escaped the existing
`audit:neighborhood-images-deep` because that audit only checks file existence,
byte size, and dimensions. The generator's perimeter-whiteness validator is the
durable fix at the generation boundary. A follow-up cycle is queued to fold the
same check into `audit:neighborhood-images-deep` so any future asset swap is
also gated on perimeter-whiteness — see `remaining-blockers.md`.

## Rollback

Per-slug rollback:

```
git checkout ed24e69 -- public/markets/<slug>.jpg public/og-markets/<slug>.jpg
git commit -m "revert MIA-SITE-CYCLE-38 image for <slug>"
```

Full revert of the 7-image regeneration:

```
for slug in coral-springs davie deerfield-beach hollywood plantation sunrise weston; do
  git checkout ed24e69 -- public/markets/$slug.jpg public/og-markets/$slug.jpg
done
git commit -m "revert MIA-SITE-CYCLE-38 image regeneration"
```
