#!/usr/bin/env bun
/**
 * Renders SVG placeholders to JPG/PNG so social platforms (Facebook, LinkedIn,
 * Twitter/X, iMessage) get something to display. SVG OG images are not honored
 * by most social cards.
 *
 * Also generates per-market OG images at 1200x630 from inline SVG into
 * public/og-markets/<slug>.jpg so social shares of /markets/<slug>/ render
 * a market-specific card.
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";

async function fileExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const targets: Array<{ src: string; dst: string; width: number; height: number; format: "jpg" | "png" }> = [
  { src: "public/og-default.svg", dst: "public/og-default.jpg", width: 1200, height: 630, format: "jpg" },
  { src: "public/mia-headshot.svg", dst: "public/mia-headshot.jpg", width: 800, height: 1000, format: "jpg" },
  { src: "public/markets/boca-raton.svg", dst: "public/markets/boca-raton.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/fort-lauderdale.svg", dst: "public/markets/fort-lauderdale.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/palm-beach.svg", dst: "public/markets/palm-beach.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/delray-beach.svg", dst: "public/markets/delray-beach.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/lighthouse-point.svg", dst: "public/markets/lighthouse-point.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/victoria-park.svg", dst: "public/markets/victoria-park.jpg", width: 1200, height: 1500, format: "jpg" },
  { src: "public/markets/coral-ridge.svg", dst: "public/markets/coral-ridge.jpg", width: 1200, height: 1500, format: "jpg" },
];

for (const t of targets) {
  if (!(await fileExists(t.src))) {
    console.log(`- ${t.dst} skipped (source SVG ${t.src} not present — existing JPG preserved)`);
    continue;
  }
  const svg = await readFile(t.src);
  const buf = await sharp(svg, { density: 144 })
    .resize(t.width, t.height)
    [t.format === "jpg" ? "jpeg" : "png"]({ quality: 88 })
    .toBuffer();
  await writeFile(t.dst, buf);
  console.log(`✓ ${t.dst} (${buf.length} bytes)`);
}

// ---------------------------------------------------------------------------
// Per-market OG images (1200x630) — generated from inline SVG on the fly.
// ---------------------------------------------------------------------------

type MarketOg = { slug: string; name: string; tagline: string };

const MARKETS_OG: ReadonlyArray<MarketOg> = [
  { slug: "fort-lauderdale", name: "Fort Lauderdale", tagline: "Waterfront, city, and beach living in Mia's home market." },
  { slug: "coral-ridge", name: "Coral Ridge", tagline: "Established Fort Lauderdale streets with water access." },
  { slug: "victoria-park", name: "Victoria Park", tagline: "Walkable Fort Lauderdale near Las Olas and the beach." },
  { slug: "boca-raton", name: "Boca Raton", tagline: "Coastal, club, and city access across South Palm Beach." },
  { slug: "palm-beach", name: "Palm Beach", tagline: "Island and coastal property decisions, prepared carefully." },
  { slug: "delray-beach", name: "Delray Beach", tagline: "Beach, downtown, and residential — shaped by Atlantic Avenue." },
  { slug: "lighthouse-point", name: "Lighthouse Point", tagline: "A Broward coastal community where water access drives the search." },
  // Cycle 25 — seven Mia-approved Broward neighborhoods (primary cluster).
  // Brand-tone placeholder OG cards until Mia provides licensed photography.
  { slug: "deerfield-beach", name: "Deerfield Beach", tagline: "Northeastern Broward beach city framed by Boca Raton and Pompano." },
  { slug: "hollywood", name: "Hollywood", tagline: "South Broward coastal city anchored by the Hollywood Broadwalk." },
  { slug: "plantation", name: "Plantation", tagline: "Central Broward city with mature tree canopy and connector access." },
  { slug: "weston", name: "Weston", tagline: "Western Broward master-planned communities at the Everglades edge." },
  { slug: "coral-springs", name: "Coral Springs", tagline: "Northwestern Broward planned city with a deliberate road grid." },
  { slug: "davie", name: "Davie", tagline: "Central Broward town with equestrian heritage and college corridor." },
  { slug: "sunrise", name: "Sunrise", tagline: "Western Broward city anchored by Sawgrass Mills and the arena." },
];

const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const renderMarketOgSvg = (m: MarketOg): string => {
  const name = escapeXml(m.name);
  const tagline = escapeXml(m.tagline);
  // Wrap tagline at ~52 chars onto two lines if needed.
  const wrapAt = 52;
  let line1 = tagline;
  let line2 = "";
  if (tagline.length > wrapAt) {
    const cut = tagline.lastIndexOf(" ", wrapAt);
    if (cut > 0) {
      line1 = tagline.slice(0, cut);
      line2 = tagline.slice(cut + 1);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0F2A44"/>
      <stop offset="1" stop-color="#1D3F66"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0" stop-color="#B89B5E" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#B89B5E" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <line x1="80" y1="100" x2="200" y2="100" stroke="#B89B5E" stroke-width="1" opacity="0.85"/>
  <g font-family="Cinzel, 'Times New Roman', serif" fill="#F5EFE6">
    <text x="80" y="140" font-size="18" letter-spacing="6" fill="#B89B5E">MIA SANABRIA</text>
    <text x="80" y="170" font-size="13" letter-spacing="4" fill="#E8DAB7" opacity="0.85">LUXURY REAL ESTATE CONCIERGE</text>
    <text x="80" y="320" font-size="78" font-weight="600" letter-spacing="2">${name}</text>
    <text x="80" y="395" font-size="22" fill="#E8DAB7" opacity="0.92">${line1}</text>
    ${line2 ? `<text x="80" y="425" font-size="22" fill="#E8DAB7" opacity="0.92">${escapeXml(line2)}</text>` : ""}
    <text x="80" y="525" font-size="20" fill="#B89B5E" letter-spacing="3">BOCA RATON · FORT LAUDERDALE · PALM BEACH</text>
    <text x="80" y="565" font-size="15" fill="#E8DAB7" opacity="0.75">LPT Realty · (954) 540-0358</text>
  </g>
</svg>`;
};

await mkdir("public/og-markets", { recursive: true });

// Cycle 25 — OG generation now SKIPS slugs whose JPG already exists in
// public/og-markets/. This preserves any human-curated or higher-fidelity OG
// asset that has already been committed (e.g., the Cycle 16 / 18 markets whose
// OG cards were generated with full Cinzel font fidelity on a different host).
// To force regeneration of a specific market, delete its JPG first and re-run.
const MAX_BYTES = 100_000;
for (const market of MARKETS_OG) {
  const dst = `public/og-markets/${market.slug}.jpg`;
  if (await fileExists(dst)) {
    console.log(`- ${dst} skipped (existing OG preserved — delete file to force regenerate)`);
    continue;
  }
  const svg = Buffer.from(renderMarketOgSvg(market));
  const buf = await sharp(svg, { density: 144 })
    .resize(1200, 630)
    .jpeg({ quality: 88 })
    .toBuffer();
  await writeFile(dst, buf);
  console.log(`✓ ${dst} (${buf.length} bytes)`);
  if (buf.length >= MAX_BYTES) {
    throw new Error(`Per-market OG ${dst} exceeded ${MAX_BYTES} bytes (got ${buf.length})`);
  }
}

// ---------------------------------------------------------------------------
// Cycle 25 — Portrait hero placeholders (1200x1500) for the seven new
// Mia-approved Broward cities that have NO Mia-licensed photography on file.
//
// The audit-images gate enforces that every slug in ALL_MARKET_SLUGS has both
// public/markets/<slug>.jpg AND public/og-markets/<slug>.jpg. Until Mia delivers
// real photography for these seven cities, brand-tone JPGs render here. The
// visual is intentionally on-brand and abstract — not a faked photograph.
// Each placeholder is a single asset swap away from a Mia-licensed photo upgrade.
// ---------------------------------------------------------------------------

const CYCLE_25_NEW_HERO_SLUGS = [
  "deerfield-beach",
  "hollywood",
  "plantation",
  "weston",
  "coral-springs",
  "davie",
  "sunrise",
] as const;

const renderMarketHeroSvg = (m: MarketOg): string => {
  const name = escapeXml(m.name);
  const tagline = escapeXml(m.tagline);
  const wrapAt = 36;
  let line1 = tagline;
  let line2 = "";
  if (tagline.length > wrapAt) {
    const cut = tagline.lastIndexOf(" ", wrapAt);
    if (cut > 0) {
      line1 = tagline.slice(0, cut);
      line2 = tagline.slice(cut + 1);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#0F2A44"/>
      <stop offset="1" stop-color="#1D3F66"/>
    </linearGradient>
    <radialGradient id="glow" cx="35%" cy="45%" r="55%">
      <stop offset="0" stop-color="#B89B5E" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#B89B5E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bottomScrim" x1="0" y1="0.6" x2="0" y2="1">
      <stop offset="0" stop-color="#0F2A44" stop-opacity="0"/>
      <stop offset="1" stop-color="#0F2A44" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" fill="url(#bg)"/>
  <rect width="1200" height="1500" fill="url(#glow)"/>
  <rect width="1200" height="1500" fill="url(#bottomScrim)"/>
  <line x1="90" y1="180" x2="240" y2="180" stroke="#B89B5E" stroke-width="1.5" opacity="0.85"/>
  <g font-family="Cinzel, 'Times New Roman', serif" fill="#F5EFE6">
    <text x="90" y="230" font-size="22" letter-spacing="7" fill="#B89B5E">MIA SANABRIA</text>
    <text x="90" y="265" font-size="16" letter-spacing="5" fill="#E8DAB7" opacity="0.85">REALTOR® · LPT REALTY</text>
    <text x="90" y="660" font-size="96" font-weight="600" letter-spacing="2">${name}</text>
    <text x="90" y="775" font-size="28" fill="#E8DAB7" opacity="0.92">${line1}</text>
    ${line2 ? `<text x="90" y="815" font-size="28" fill="#E8DAB7" opacity="0.92">${escapeXml(line2)}</text>` : ""}
    <line x1="90" y1="1290" x2="240" y2="1290" stroke="#B89B5E" stroke-width="1" opacity="0.75"/>
    <text x="90" y="1330" font-size="22" fill="#B89B5E" letter-spacing="4">SOUTHEAST FLORIDA</text>
    <text x="90" y="1370" font-size="17" fill="#E8DAB7" opacity="0.78">Broward County · LPT Realty · (954) 540-0358</text>
  </g>
</svg>`;
};

const cycle25NewSlugs: ReadonlySet<string> = new Set(CYCLE_25_NEW_HERO_SLUGS);
for (const market of MARKETS_OG) {
  if (!cycle25NewSlugs.has(market.slug)) continue;
  const svg = Buffer.from(renderMarketHeroSvg(market));
  const buf = await sharp(svg, { density: 144 })
    .resize(1200, 1500)
    .jpeg({ quality: 88 })
    .toBuffer();
  const dst = `public/markets/${market.slug}.jpg`;
  await writeFile(dst, buf);
  console.log(`✓ ${dst} (${buf.length} bytes) [Cycle 25 placeholder hero — Mia photo upgrade pending]`);
}
