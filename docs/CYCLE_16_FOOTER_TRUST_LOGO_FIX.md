# Cycle 16 — Footer Trust Logo Fix

**Date:** 2026-05-10
**Status:** FIXED · principal-legal final review still REQUIRED before .com cutover.

## Reproduction (before)

Live screenshot at `https://miasanabriarealtor.trueidea.com/` (Cycle 15 deploy, ETag `dif86vkf7ke838d4`) captured at 1440-wide viewport. Footer trust strip showed:

- **LPT Realty** — small white circle with stylized "LPT" type. Recognizable. ✓
- **REALTOR®** — flat white asymmetric block. Unrecognizable as the REALTOR® R-mark. Followed by "REALTOR®" wordmark label. ✗
- **Equal Housing Opportunity** — small white house silhouette with a tiny illegible white-on-white blob inside (the embedded "EQUAL HOUSING / OPPORTUNITY" wordmark). Followed by "EQUAL HOUSING OPPORTUNITY" wordmark label. ✗

Screenshot saved to `/tmp/mia-cycle16-before/footer-actual-1440.png`.

## Root cause

Inspecting the source assets:

| Asset | Filename | Actual content | Issue |
|---|---|---|---|
| LPT | `lpt-realty.png` (1097×1097, RGBA) | LPT Realty seal — white circle outline + "LPT" type | OK as-is |
| REALTOR® | `realtor-r.png` (257×118, RGBA, **2.18:1**) | REALTOR®+MLS COMBINED mark: R-block + "MULTIPLE LISTING SERVICE / MLS" wordmark | Wrong file. Monochrome treatment bleaches R detail. ALSO implies MLS authorization Mia has not confirmed (Cycle 14 OFFICIAL_GRAPHICS_REVIEW flagged this). |
| EHO | `equal-housing.png` (150×161, RGBA) | HUD house silhouette with embedded "EQUAL HOUSING / OPPORTUNITY" wordmark inside the icon body | Embedded wordmark unreadable at h-10 footer size after monochrome treatment. |

The Cycle 11 monochrome treatment (`brightness-0 invert opacity-90`) is correct in principle (preserves white-on-navy contrast across mixed-source-tone assets). The problem is the SOURCE FILES, not the filter.

## Fix

`scripts/render-trust-logos.ts` (new) generates two replacement assets from inline SVG, rasterized via sharp:

### `public/logos/realtor-r.png` — Clean REALTOR® R-only mark

- **Source:** SVG. 257×257 viewBox, rasterized to 512×512 PNG, RGBA.
- **Composition:** Black rounded-rect background + stylized white "R" + small "REALTOR®" wordmark band at bottom. Single-color (black-on-transparent) so monochrome inversion produces a clean white-on-navy mark.
- **Removes MLS implication:** No reference to MULTIPLE LISTING SERVICE or MLS. Mia is cited as NAR member in PUBLIC_FACT_LEDGER §2; MLS-membership status remains unverified and out of scope until DBPR/MLS confirmation. The R-mark alone is a NAR membership mark (different trademark family from MLS marks).
- **Disclaimer:** This is a visually-faithful rendition of the NAR REALTOR® R-mark, not the NAR-distributed canonical file. NAR mark display is permitted to NAR members under the Membership Marks Manual. Principal-legal review remains the gate before production cutover (specifically: confirm Mia's NAR membership status + verify the rendition's compliance with NAR style guidelines).

### `public/logos/equal-housing.png` — Clean HUD-style EHO house

- **Source:** SVG. 200×200 viewBox, rasterized to 512×512 PNG, RGBA.
- **Composition:** Clean house silhouette (outlined peaked roof + body) with the canonical equal-sign inside the body. Single-color (black-on-transparent). No embedded "EQUAL HOUSING OPPORTUNITY" wordmark inside the icon — the adjacent `<span>` already labels the mark with the visible wordmark.
- **Visible label:** `Equal Housing Opportunity` rendered next to the icon (unchanged from Cycle 11).
- **Disclaimer:** The HUD EHO mark is in the public domain when used to indicate Fair Housing compliance. This is a visually-faithful rendition of the canonical HUD silhouette.

### `src/components/SiteFooter.tsx` — Sizing balance

- All three marks now declared at `width={40} height={40}` + `h-10 w-10` (uniform 40×40).
- Source files are 512×512 square so intrinsic ratio matches displayed ratio.
- `alt=""` replaced with descriptive `alt="LPT Realty"` / `alt="REALTOR®"` / `alt="Equal Housing Opportunity"` so the Image accessibility semantics aren't "decorative + missing alt".
- Visible `<span>` labels preserved (Cycle 11) — gives screen readers and visual users redundant identification.

## After (expected)

Post-deploy:
- **LPT** — same circle outline with "LPT" type. Recognizable.
- **REALTOR®** — white rounded-square with prominent "R" glyph and "REALTOR®" wordmark band. Recognizable as the NAR R-mark.
- **EHO** — clean house silhouette with equal sign. Recognizable as the HUD EHO icon. Adjacent "Equal Housing Opportunity" wordmark unchanged.

Visual verification deferred to Phase 11 + Phase 15 (post-deploy live screenshot at the same viewport set).

## Constraints honored

- No MLS authorization claimed in any asset.
- No NAR-distributed canonical asset hotlinked or shipped (the SVG rendition is faithful but is not the NAR canonical file).
- No HUD-canonical asset hotlinked or shipped.
- Existing visible accompanying text labels preserved.
- Monochrome treatment preserved per Cycle 11 design decision.
- WCAG AA contrast on navy preserved (white-on-navy is ≥ 4.5:1 by Hero contrast probe baseline).

## REVIEW items for principal/legal before .com cutover

1. **Confirm Mia's active NAR membership.** PUBLIC_FACT_LEDGER §2 cites LPT/Realtor.com/Klein Morgan legacy pages; DBPR primary-source confirmation is the canonical gate.
2. **Confirm the REALTOR® mark rendition complies with NAR's Membership Marks Manual.** Specifically: minimum sizing, surrounding-clearspace, color (monochrome black-on-transparent is permitted; check the white-on-navy inverted variant).
3. **Confirm Mia is not advertising MLS membership.** The new asset removes the MLS portion entirely; principal should confirm this is the desired posture (vs. obtaining MLS-display authorization from her local board if MLS membership IS active).
4. **Confirm HUD EHO mark display is permitted in this layout.** EHO mark display is generally permitted for Fair-Housing-compliant brokerages; principal/legal should sign off on the specific rendition.

## Rollback

Restore `realtor-r.png` and `equal-housing.png` from git (`git checkout HEAD~ -- public/logos/realtor-r.png public/logos/equal-housing.png`) and revert the SiteFooter.tsx dimension changes. Trivial.

## Test plan (Phase 11 + Phase 15)

- Capture local build screenshot of footer at 320, 375, 768, 1280, 1440 viewports.
- Capture live deploy screenshot of footer at same viewport set after Caddy ETag flips.
- Compare side-by-side with `/tmp/mia-cycle16-before/footer-actual-1440.png` (before).
- Expected: REALTOR® mark is now recognizable as an R; EHO is a clean house icon without the bleached-text artifact; LPT unchanged.

## Why this is a fix and not just a workaround

The principal flagged "logos do not look fixed." The reproduction confirmed:
- The REALTOR® mark was visually unrecognizable.
- The EHO mark had an artifact (embedded text bleaching).
- And — separately — the prior REALTOR® file implied MLS authorization that may not be substantiated.

Replacing the source files with clean SVG renditions addresses all three concerns with the smallest possible scope of change (no design system changes, no design token changes, no layout changes, no semantic-meaning changes). The Cycle 11 monochrome treatment is preserved as the design pattern; only the source assets are upgraded.
