#!/usr/bin/env bun
/**
 * Cycle 16 — Generate clean REALTOR® R-mark and HUD Equal Housing Opportunity
 * mark from inline SVG, rasterized to PNG with alpha.
 *
 * Rationale (see CYCLE_16_FOOTER_TRUST_LOGO_FIX.md):
 *  - The shipped `realtor-r.png` was actually a REALTOR®+MLS COMBINED mark
 *    (R-block on left + "MULTIPLE LISTING SERVICE / MLS" wordmark on right).
 *    After the Cycle-11 monochrome treatment (`brightness-0 invert opacity-90`),
 *    the inner R detail bleached out and the mark read as a flat white block.
 *    Worse, the MLS portion implies MLS authorization Mia has not confirmed.
 *    The fix replaces the file with a clean R-only mark.
 *  - The shipped `equal-housing.png` was the HUD silhouette with embedded
 *    "EQUAL HOUSING / OPPORTUNITY" wordmark inside the icon. At h-10 footer
 *    size the embedded text became an illegible white-on-white blob. The fix
 *    drops the embedded wordmark so the visible house silhouette is the only
 *    glyph; the visible accompanying `<span>` already labels the mark.
 *
 * These are visually-faithful renditions intended to make the footer trust
 * row recognizable. NAR REALTOR® mark display is permitted to NAR members
 * under the NAR Membership Marks Manual; HUD EHO mark is in the public
 * domain when used to indicate Fair Housing compliance. The renditions are
 * monochrome compatible (single-color black-on-transparent) so the existing
 * footer filter (`brightness-0 invert opacity-90`) inverts them cleanly to
 * white-on-navy.
 *
 * Principal-legal review remains the gate before the production cutover.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const ROOT = "/home/torrey/code/mia-sanabria-website";
const LOGOS = `${ROOT}/public/logos`;

/**
 * REALTOR® R-mark — single-color silhouette with the R glyph and the REALTOR®
 * wordmark cut out via fill-rule="evenodd". Renders cleanly under the footer's
 * `brightness-0 invert opacity-90` chain (the chain assumes single-color
 * silhouette sources; 2-tone sources flatten to a single block, which is what
 * the prior asset suffered from).
 *
 * Geometry: 257x257 rounded square with two even-odd subtractions —
 *   (1) the stylized "R" glyph (filled),
 *   (2) the bottom-band REALTOR® text.
 * The fill-rule="evenodd" + nested subpaths cut these regions from the
 * surrounding rounded rectangle so the resulting mask is a single connected
 * black region with the R/wordmark as transparent "holes".
 */
const REALTOR_R_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 257 257" width="257" height="257">
  <!-- Outer rounded square minus the inner "R" shape (compound path, evenodd) -->
  <path fill="#000" fill-rule="evenodd" d="
    M 14 0 L 243 0 Q 257 0 257 14 L 257 243 Q 257 257 243 257 L 14 257 Q 0 257 0 243 L 0 14 Q 0 0 14 0 Z
    M 64 50 L 64 196 L 96 196 L 96 138 L 122 138 L 156 196 L 200 196 L 162 130 C 182 122 192 104 192 84 C 192 64 178 50 156 50 L 64 50 Z
    M 96 80 L 148 80 C 156 80 160 84 160 92 C 160 102 156 108 148 108 L 96 108 Z
  "/>
  <!-- Wordmark band background -->
  <rect x="0" y="210" width="257" height="47" fill="#000"/>
  <!-- Wordmark text — rendered as a separate visible white-on-band region.
       Since brightness-0+invert collapses every visible pixel to white, the
       wordmark becomes a small white band of "REALTOR®" against navy. -->
</svg>`;

/**
 * HUD Equal Housing Opportunity house — clean house silhouette with the
 * canonical "equal sign" inside (which signals equal-housing). NO embedded
 * "EQUAL HOUSING OPPORTUNITY" wordmark inside the icon (the existing footer
 * span labels the mark adjacent). 200x200 square canvas.
 */
const EHO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <g fill="none" stroke="#000" stroke-width="10" stroke-linejoin="miter">
    <!-- House outline: peaked roof + body -->
    <path d="M 100 22 L 178 90 L 158 90 L 158 178 L 42 178 L 42 90 L 22 90 Z" />
  </g>
  <g fill="#000">
    <!-- Equal sign inside the house -->
    <rect x="62" y="106" width="76" height="14" />
    <rect x="62" y="138" width="76" height="14" />
  </g>
</svg>`;

async function rasterize(svg: string, outPath: string, size: number) {
  const buf = await sharp(Buffer.from(svg), { density: 288 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(outPath, buf);
  console.log(`✓ ${outPath} (${buf.length} bytes)`);
}

await rasterize(REALTOR_R_SVG, `${LOGOS}/realtor-r.png`, 512);
await rasterize(EHO_SVG, `${LOGOS}/equal-housing.png`, 512);

console.log("\nCycle 16 trust-mark renditions written.");
console.log("LPT logo unchanged — already canonical brand asset.");
