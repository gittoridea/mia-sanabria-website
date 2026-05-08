#!/usr/bin/env bun
/**
 * Generates favicon.ico, favicon-32x32.png, favicon-16x16.png, and apple-touch-icon.png
 * from public/icon.svg. ICO is hand-rolled (single 32×32 PNG-in-ICO entry, supported
 * since Windows Vista) — keeps zero new deps beyond the existing sharp.
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile("public/icon.svg");

async function rasterise(size: number): Promise<Buffer> {
  return sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

const png16 = await rasterise(16);
const png32 = await rasterise(32);
const png180 = await rasterise(180);

await writeFile("public/favicon-16x16.png", png16);
await writeFile("public/favicon-32x32.png", png32);
await writeFile("public/apple-touch-icon.png", png180);

// Build a minimal multi-image ICO containing the 16×16 and 32×32 PNGs.
function buildIco(pngs: ReadonlyArray<{ size: number; data: Buffer }>): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = ICO
  header.writeUInt16LE(pngs.length, 4); // image count

  const dirEntries = Buffer.alloc(16 * pngs.length);
  let dataOffset = 6 + 16 * pngs.length;
  const dataParts: Buffer[] = [];

  pngs.forEach(({ size, data }, i) => {
    const o = i * 16;
    dirEntries[o + 0] = size === 256 ? 0 : size;
    dirEntries[o + 1] = size === 256 ? 0 : size;
    dirEntries[o + 2] = 0; // colour count
    dirEntries[o + 3] = 0; // reserved
    dirEntries.writeUInt16LE(1, o + 4); // planes
    dirEntries.writeUInt16LE(32, o + 6); // bpp
    dirEntries.writeUInt32LE(data.length, o + 8); // image bytes
    dirEntries.writeUInt32LE(dataOffset, o + 12); // offset
    dataParts.push(data);
    dataOffset += data.length;
  });

  return Buffer.concat([header, dirEntries, ...dataParts]);
}

const ico = buildIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
]);
await writeFile("public/favicon.ico", ico);

console.log("rendered:", {
  "favicon.ico": ico.length,
  "favicon-16x16.png": png16.length,
  "favicon-32x32.png": png32.length,
  "apple-touch-icon.png": png180.length,
});
