#!/usr/bin/env bun
/**
 * Cycle 17 — Download official trust-mark logos.
 *
 * Replaces the Cycle 16 SVG renditions (which the principal flagged as still
 * visually wrong) with the canonical NAR REALTOR® white/reversed mark and the
 * principal-named third-party EHO white asset from equalhousinglogo.com.
 *
 * Sources (per CYCLE_17_DECISION_REGISTER.md Cards 2 & 3):
 *  - REALTOR® white: NAR public download
 *    https://www.nar.realtor/sites/default/files/2025-07/nar_membershipmark_white.png
 *    License posture: NAR Membership Marks Manual permits member display of the
 *    REALTOR® R-mark; principal-legal review pending for .com cutover.
 *  - EHO white: equalhousinglogo.com curated public-domain HUD mark
 *    https://equalhousinglogo.com/wp-content/uploads/2019/03/equal-housing-logowhite-1000.png
 *    License posture: HUD Equal Housing Opportunity mark is in the public
 *    domain when used to indicate Fair Housing compliance.
 *
 * Both source assets are pre-rendered white-on-transparent — they pass cleanly
 * through the existing SiteFooter `brightness-0 invert opacity-90` filter chain
 * (the chain is idempotent for already-white sources; LPT, which is grayscale
 * non-white, still relies on the chain to whiten — uniform footer treatment
 * preserved).
 *
 * Cycle 16 SVG renditions are preserved as .cycle16.png.bak siblings so we
 * can compare visually and roll back via mv if needed.
 *
 * Idempotent: rerunning re-downloads and overwrites the live assets.
 */
import { writeFile } from "node:fs/promises";

const ROOT = "/home/torrey/code/mia-sanabria-website";
const LOGOS = `${ROOT}/public/logos`;

const SOURCES = [
  {
    name: "REALTOR® R-mark (NAR official, white/reversed)",
    url: "https://www.nar.realtor/sites/default/files/2025-07/nar_membershipmark_white.png",
    out: `${LOGOS}/realtor-r.png`,
    expectedFormat: "PNG, RGBA, white-on-transparent",
  },
  {
    name: "Equal Housing Opportunity (equalhousinglogo.com white)",
    url: "https://equalhousinglogo.com/wp-content/uploads/2019/03/equal-housing-logowhite-1000.png",
    out: `${LOGOS}/equal-housing.png`,
    expectedFormat: "PNG, RGBA, white-on-transparent",
  },
];

for (const s of SOURCES) {
  console.log(`▶ ${s.name}`);
  console.log(`  ${s.url}`);
  const res = await fetch(s.url);
  if (!res.ok) {
    console.error(`  ✗ download failed: HTTP ${res.status}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(s.out, buf);
  console.log(`  ✓ wrote ${s.out} (${buf.length.toLocaleString()} bytes)`);
}

console.log(`
Cycle 17 trust logo download complete.
LPT logo unchanged — already canonical brand asset.
Cycle 16 SVG renditions preserved at:
  public/logos/realtor-r.cycle16.png.bak
  public/logos/equal-housing.cycle16.png.bak
`);
