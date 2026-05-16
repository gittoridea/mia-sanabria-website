# Cycle 38 — Live Neighborhood Image Reproduction

date: 2026-05-16
base: https://miasanabriarealtor.trueidea.com

## Operator report (acceptance)

Operator reports the following neighborhood images are **not displaying** on the live dev site:

- deerfield-beach
- hollywood
- plantation
- weston
- coral-springs
- davie
- sunrise

## Reproduction — what actually happens live

### Asset-layer evidence

All 14 live image URLs return HTTP 200 with non-zero bytes:

| slug | `/markets/<slug>.jpg` | `/og-markets/<slug>.jpg` |
|------|-----------------------|--------------------------|
| deerfield-beach | 200 / 178,459 B | 200 / 81,645 B |
| hollywood | 200 / 136,189 B | 200 / 107,879 B |
| plantation | 200 / 260,806 B | 200 / 124,673 B |
| weston | 200 / 177,481 B | 200 / 139,743 B |
| coral-springs | 200 / 334,930 B | 200 / 164,733 B |
| davie | 200 / 146,742 B | 200 / 83,631 B |
| sunrise | 200 / 104,091 B | 200 / 73,323 B |

Local files match: each `.jpg` is a valid progressive JPEG at 1200×1500 (hero) or 1200×630 (OG). All files git-tracked in commit `ed24e69` (Cycle 37).

### DOM evidence — live

Curl-fetched + Chrome-headless-dumped DOM both show correct `<img>` tags pointing at correct asset paths for all 7 slugs on `/markets/` and each `/markets/<slug>/` detail page. Example (deerfield-beach detail page, live DOM via `google-chrome --headless=new --dump-dom`):

```
<img alt="Deerfield Beach luxury real estate" decoding="async" data-nimg="fill"
     class="object-cover object-center" style="..." src="/markets/deerfield-beach.jpg"/>
```

Zero occurrences of `No photo available` placeholder. No 404. No CSP block. No CORS issue.

### Visual content evidence

Inspecting the actual JPEG content reveals **the real failure mode**: several Cycle 37 Gemini-generated hero images contain a **framed/gallery composition** with **large white margins** baked into the pixel data. The 1200×1500 frame is mostly white canvas with a tilted/perspective-rendered "painting" of the scene occupying only the centre portion:

| slug | hero (1200×1500) visual content | og (1200×630) visual content |
|------|---------------------------------|------------------------------|
| deerfield-beach | painted/canvas-textured pier scene fills frame (acceptable but obviously illustrative) | pier scene fills frame, painterly |
| hollywood | **DEFECT — beach scene shown inside a black-bordered painting with large white margins above and below; majority of the rendered tile is white canvas** | beach scene mostly fills frame, thin black border |
| plantation | photorealistic royal palm canopy scene, fills frame but has obvious AI rendering artifacts (symmetrical canopy) | fills frame |
| weston | photorealistic fountain courtyard, fills frame, obvious AI rendering | fills frame |
| coral-springs | photorealistic tree-canopy boulevard, fills frame | fills frame |
| davie | **DEFECT — equestrian-fence scene shown inside a tilted 3D-perspective frame with white margins above; rendered tile is dominated by empty white space** | equestrian scene fills frame, thin left border |
| sunrise | photorealistic but with bronze-sculpture abstract elements that don't read as "real" Sunrise FL | fills frame, photorealistic skyline reflection |

## Classification

```yaml
operator_report_reproduced: true
failure_type:
  - image_content_defect            # Hollywood + Davie hero JPEGs contain framed-painting compositions with dominant white margins
  - aesthetic_quality_mismatch       # remaining 5 are technically rendered but obviously AI-generated (painterly, symmetrical, abstract) vs photorealistic baseline like fort-lauderdale.jpg
root_cause: >
  Cycle 37 `scripts/generate-neighborhood-images.ts` ran Gemini 2.5 Flash Image with prompts that did
  not enforce "no frame, no border, no canvas margin, photographic full-bleed composition." Gemini
  returned several outputs as framed-gallery compositions (a painting hanging on a white wall). The
  cover-fit resize in Sharp preserved the white margins because the source itself contained them.
  Audit-deep checked file existence, byte size, and dimensions — none of which catch a framed
  composition baked into the pixels. Result: live HTML and HTTP succeed, but the rendered tile in
  the user's browser is dominated by white space, which Mia/operator perceive as "the image is not
  displaying."

affected_routes:
  - /markets/
  - /markets/deerfield-beach/
  - /markets/hollywood/
  - /markets/plantation/
  - /markets/weston/
  - /markets/coral-springs/
  - /markets/davie/
  - /markets/sunrise/

affected_assets:
  worst:
    - public/markets/hollywood.jpg      # framed painting, large white margins
    - public/markets/davie.jpg          # tilted-perspective frame, white margins above
  weaker:
    - public/markets/deerfield-beach.jpg # painterly canvas (acceptable but stylistically off)
    - public/markets/plantation.jpg     # AI artifacts (symmetrical canopy)
    - public/markets/weston.jpg         # generic AI courtyard
    - public/markets/coral-springs.jpg  # AI tree canopy
    - public/markets/sunrise.jpg        # abstract bronze sculpture content, unrepresentative
```

## Live DOM probe result

`scripts/probe-live-neighborhood-images.ts` was run; the rewrite-and-rehost approach disabled Next.js hydration, so naturalWidth came back 0 on the rewritten page. Direct `google-chrome --dump-dom` against the live URL was the authoritative check: img tags **are present** in the rendered DOM. The probe script was kept so the post-fix verification step (after build) can use it against `127.0.0.1` with hydration intact, or against the live URL with a different injection strategy.

## Cycle 37 false-pass explanation

Cycle 37 reported `audit:neighborhood-images-deep 23/23 PASS` and `staging deep image audit passed 23/23`. The deep audit only checks: file exists, ≥80 KB, ≥1200×1500. All seven defect images pass those structural gates. There was no pixel-content check (e.g., dominant-color analysis to flag images with >40 % near-white pixels). That is the gap to close in Cycle 38.

## Fix path

Replace all 7 hero JPEGs (and update the 7 OG variants where the frame/border bleeds in) with content that is:

- full-bleed (no internal frame, no white margin, no canvas border),
- photorealistic editorial quality matching the existing fort-lauderdale.jpg baseline,
- license-clear for commercial reuse.

Selected approach: re-run `scripts/generate-neighborhood-images.ts` with hardened prompts that explicitly forbid frames/borders/painted-canvas treatments, demand photographic realism, and request 1200×1500 portrait native output. Add a post-generate pixel-content check that flags >25 % near-white perimeter pixels (catches the framed-painting defect class going forward).

Documented in `neighborhood-image-root-cause.md` and `neighborhood-image-fix-report.md`.
