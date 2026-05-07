#!/usr/bin/env bun
/**
 * Renders SVG placeholders to JPG/PNG so social platforms (Facebook, LinkedIn,
 * Twitter/X, iMessage) get something to display. SVG OG images are not honored
 * by most social cards.
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

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
