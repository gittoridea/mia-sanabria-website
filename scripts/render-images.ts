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
import { readFile, writeFile, mkdir } from "node:fs/promises";

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

const MAX_BYTES = 100_000;
for (const market of MARKETS_OG) {
  const svg = Buffer.from(renderMarketOgSvg(market));
  const buf = await sharp(svg, { density: 144 })
    .resize(1200, 630)
    .jpeg({ quality: 88 })
    .toBuffer();
  const dst = `public/og-markets/${market.slug}.jpg`;
  await writeFile(dst, buf);
  console.log(`✓ ${dst} (${buf.length} bytes)`);
  if (buf.length >= MAX_BYTES) {
    throw new Error(`Per-market OG ${dst} exceeded ${MAX_BYTES} bytes (got ${buf.length})`);
  }
}
