# Cycle 17 — Footer Official Trust Logo Fix

**Date:** 2026-05-10
**Status:** FIXED at source — local + live verification pending Phase 10 + Phase 13.
**Decision binding:** CYCLE_17_DECISION_REGISTER.md Cards 2 & 3.

## Why this cycle revisits the trust logos

Cycle 16 marked the trust-logo issue FIXED after replacing the prior REALTOR®+MLS combined PNG and the embedded-wordmark EHO PNG with clean SVG-derived renditions. The principal continues to report the marks as visually wrong. Root cause carried: the SVG renditions, while structurally clean, are not the canonical NAR + HUD assets a discerning visitor (or legal review) would compare against. Cycle 17 replaces them with the canonical sources.

## What changed

| Asset | Before (Cycle 16 SVG rendition) | After (Cycle 17 canonical) |
|---|---|---|
| `public/logos/realtor-r.png` | 512×512 RGBA, SVG-derived black-on-transparent R-block + wordmark band | 600×600 RGBA, **NAR official white-on-transparent membership mark** |
| `public/logos/equal-housing.png` | 512×512 RGBA, SVG-derived HUD-style house silhouette + equal sign | 1000×1000 RGBA, **equalhousinglogo.com curated white-on-transparent HUD silhouette** |
| `public/logos/lpt-realty.png` | unchanged | unchanged (1097×1097 RGBA, grayscale brand asset) |

The Cycle 16 renditions are preserved as `realtor-r.cycle16.png.bak` and `equal-housing.cycle16.png.bak` for visual comparison and rollback.

## Sources and provenance

### REALTOR® R-mark

- **Source URL:** `https://www.nar.realtor/sites/default/files/2025-07/nar_membershipmark_white.png`
- **Source page:** `https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo`
- **Format:** 600×600 RGBA PNG, RGB=(255,255,255), alpha carries the R-mark + REALTOR® wordmark shape.
- **License posture:** NAR Membership Marks Manual permits NAR member display of the REALTOR® R-mark. Mia is cited as NAR member in PUBLIC_FACT_LEDGER §2 (LPT, Realtor.com, Klein Morgan legacy pages reference). DBPR + NAR primary-source confirmation remains the principal-legal gate before `.com` cutover.
- **No MLS overclaim:** The downloaded file is the R-block + REALTOR® wordmark — no MLS reference, no MLS authorization claim. The Cycle 14 OFFICIAL_GRAPHICS_REVIEW concern is closed at the source level.

### Equal Housing Opportunity

- **Source URL:** `https://equalhousinglogo.com/wp-content/uploads/2019/03/equal-housing-logowhite-1000.png`
- **Source page:** `https://equalhousinglogo.com/`
- **Format:** 1000×1000 RGBA PNG, RGB=(255,255,255), alpha carries the canonical HUD house silhouette + equal-sign.
- **License posture:** The HUD Equal Housing Opportunity mark is in the public domain when used to indicate Fair Housing compliance by a brokerage. equalhousinglogo.com is a curated third-party redistribution of the public-domain HUD asset. Source explicitly named by principal in Cycle 17 mission prompt.

### LPT Realty (unchanged)

- Brand asset retained from Cycle 11; grayscale (mean RGB=64). Continues to rely on the `brightness-0 invert` filter chain to render white-on-navy.

## Asset channel-stats verification

| Asset | Dimensions | R range | G range | B range | A range | Notes |
|---|---|---|---|---|---|---|
| `realtor-r.png` | 600×600 | 255-255 | 255-255 | 255-255 | 0-255 | pure white-on-transparent |
| `equal-housing.png` | 1000×1000 | 255-255 | 255-255 | 255-255 | 0-255 | pure white-on-transparent |
| `lpt-realty.png` | 1097×1097 | 0-255 | 0-255 | 0-255 | 0-255 | grayscale on transparent (unchanged from Cycle 11) |

## Filter chain reasoning

`SiteFooter.tsx` applies `brightness-0 invert opacity-90` to all three trust marks. This chain is intentionally uniform:

| Asset | Filter step 1 (`brightness-0`) | Filter step 2 (`invert`) | Filter step 3 (`opacity-90`) | Final render |
|---|---|---|---|---|
| LPT (grayscale mean 64) | RGB → 0,0,0 (black) | → 255,255,255 (white) | × 0.9 | white-on-navy, 90% opacity |
| REALTOR® (pure white) | 255,255,255 → 0,0,0 (black) | → 255,255,255 (white) | × 0.9 | white-on-navy, 90% opacity |
| EHO (pure white) | 255,255,255 → 0,0,0 (black) | → 255,255,255 (white) | × 0.9 | white-on-navy, 90% opacity |

For the two new assets, the brightness/invert pair is a no-op (white → black → white), so the result is identical to applying `opacity-90` alone. Uniform treatment is preserved at zero behavioral cost. No SiteFooter.tsx code change needed beyond the explanatory comment update.

## What was NOT done

| Item | Why |
|---|---|
| Did not change SiteFooter.tsx structure or filter values | Filter chain is idempotent for the new sources; LPT still depends on it; uniform treatment is the cleanest pattern. |
| Did not delete the Cycle 16 SVG renditions | Preserved as `.cycle16.png.bak` for visual comparison and rollback. |
| Did not download MLS logo | Mia's MLS authorization is not confirmed; intentionally excluded per ULTIMATE_FEATURED_MARKET_PAGE_STANDARD anti-pattern register. |
| Did not modify alt text | `"LPT Realty"`, `"REALTOR®"`, `"Equal Housing Opportunity"` already canonical from Cycle 16. |
| Did not modify visible label `<span>` text | Already canonical from Cycle 11/16. |
| Did not modify `width={40} height={40}` declarations | Uniform 40×40 visual balance preserved. |
| Did not download or embed the NAR EPS or HUD vector files | PNG is sufficient for footer-scale (40×40) and avoids SVG-rendering uncertainty in static-export. |

## REVIEW gates carried to `.com` cutover

| Gate | Status | Action |
|---|---|---|
| Active NAR membership confirmation (Mia) | PUBLIC_FACT_LEDGER §2 candidate (LPT/Realtor.com/Klein Morgan references) | Principal-legal: confirm via DBPR/NAR primary source |
| NAR Membership Marks Manual rendition compliance | Asset is NAR-canonical by construction; live treatment (40×40 on navy under opacity-90 filter) is the deployment-specific element | Principal-legal sign-off on the live treatment |
| Mia is NOT advertising MLS membership | Asset chosen explicitly removes MLS reference | No further action |
| HUD EHO mark display permitted in current layout | Public-domain when used for Fair-Housing compliance | Principal-legal final read |

## Rollback

```bash
cd ~/code/mia-sanabria-website
mv public/logos/realtor-r.cycle16.png.bak public/logos/realtor-r.png
mv public/logos/equal-housing.cycle16.png.bak public/logos/equal-housing.png
# Revert the SiteFooter.tsx comment update via git.
```

## Tooling

`scripts/download-trust-logos.ts` (Cycle 17) is the idempotent re-runnable downloader. Documents both sources, license posture, and writes both assets in one bun run.

```bash
bun run scripts/download-trust-logos.ts
```

## Local + live verification gates (Phase 10 + Phase 13)

- Local build screenshot at 320, 375, 768, 1280, 1440 viewports — footer trust strip.
- Live deploy screenshot at the same viewport set post-Caddy-flip.
- Visual comparison with Cycle 16 BEFORE screenshot at `/tmp/mia-cycle16-before/footer-actual-1440.png`.
- Expected: REALTOR® R-mark + REALTOR® wordmark band reads cleanly; EHO house silhouette with equal-sign reads cleanly; LPT unchanged; all three marks white-on-navy at 90% opacity.

## Related artifacts

- Decision binding: `docs/CYCLE_17_DECISION_REGISTER.md` Cards 2 & 3.
- Source delta: `public/logos/realtor-r.png` + `public/logos/equal-housing.png` (overwritten) + `scripts/download-trust-logos.ts` (new) + `src/components/SiteFooter.tsx` (comment block update).
- Audit binding: `audit:trust-logos` to be added in Phase 8 (channel-stat probe of the 3 logos for white-on-navy expected rendering).
- Cycle 16 lineage: `docs/CYCLE_16_FOOTER_TRUST_LOGO_FIX.md` (now superseded for the two affected assets).
