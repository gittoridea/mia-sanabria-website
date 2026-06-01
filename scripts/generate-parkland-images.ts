#!/usr/bin/env bun
/**
 * generate-parkland-images — one-shot hero + OG generator for the new Parkland
 * market page (2026-06-01 About+markets cycle).
 *
 * Reuses the Cycle-40B Gemini image integration (gemini-2.5-flash-image) and
 * the same sharp post-processing contract the deep-image audit enforces:
 *   - public/markets/parkland.jpg     >= 1200x1500, >= 80_000 bytes
 *   - public/og-markets/parkland.jpg  >= 1200x630,  >= 60_000 bytes
 *
 * Art direction (gemini-3.5-flash design pass, 2026-06-01): Parkland is an
 * INLAND, affluent, master-planned Broward city — large lots, gated
 * communities, mature oak/palm landscaping, equestrian/low-density heritage.
 * NO coastal/waterfront, NO people, NO text, NO recognizable real landmarks.
 *
 * Usage: GEMINI_API_KEY=... bun run scripts/generate-parkland-images.ts
 *   (falls back to ~/.claude/.env if GEMINI_API_KEY is not in the environment)
 */
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const REPO = process.cwd();
const HERO_OUT = join(REPO, "public", "markets", "parkland.jpg");
const OG_OUT = join(REPO, "public", "og-markets", "parkland.jpg");

const PROMPT =
  "documentary-style editorial photograph of an elegant inland master-planned residential community in Parkland, Florida, northwestern Broward County, at warm golden hour. A refined transitional-style estate set well back on a large manicured emerald lawn behind a dense canopy of mature live oaks and tall slender royal palms, lush tropical landscaping, a quiet tree-lined residential lane with no traffic, soft amber late-afternoon side-light raking through the oak canopy and casting long shadows, brass-tinted highlights, serene and affluent low-density character, distinctly inland with no beach, no ocean, no canal, and no water. Full-bleed editorial composition that fills the entire frame edge-to-edge, photoreal, architectural-digest quality.";

async function loadKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const txt = await readFile(`${process.env.HOME}/.claude/.env`, "utf-8");
    for (const line of txt.split("\n")) {
      const t = line.trim();
      if (t.startsWith("GEMINI_API_KEY=")) {
        return t.slice("GEMINI_API_KEY=".length).replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* fall through */
  }
  throw new Error("GEMINI_API_KEY not found in env or ~/.claude/.env");
}

async function generatePng(apiKey: string, attempt: number): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ parts: [{ text: PROMPT }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`gemini ${res.status} (attempt ${attempt}): ${(await res.text()).slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string } }> } }>;
  };
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline?.inlineData?.data) throw new Error(`no image part returned (attempt ${attempt})`);
  return Buffer.from(inline.inlineData.data, "base64");
}

async function main() {
  const apiKey = await loadKey();
  await mkdir(join(REPO, "public", "markets"), { recursive: true });
  await mkdir(join(REPO, "public", "og-markets"), { recursive: true });

  let png: Buffer | null = null;
  let lastErr = "";
  for (let attempt = 1; attempt <= 4 && !png; attempt++) {
    try {
      png = await generatePng(apiKey, attempt);
      console.log(`✓ generated candidate on attempt ${attempt} (${png.length} bytes raw)`);
    } catch (e) {
      lastErr = (e as Error).message;
      console.warn(`  attempt ${attempt} failed: ${lastErr}`);
      await new Promise((r) => setTimeout(r, 2500 * attempt));
    }
  }
  if (!png) throw new Error(`all attempts failed: ${lastErr}`);

  // Hero: 1200x1500 portrait cover crop, high quality so bytes >= 80_000.
  await sharp(png)
    .resize(1200, 1500, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(HERO_OUT);

  // OG: 1200x630 landscape cover crop, bytes >= 60_000.
  await sharp(png)
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(OG_OUT);

  const heroStat = await stat(HERO_OUT);
  const ogStat = await stat(OG_OUT);
  const heroMeta = await sharp(HERO_OUT).metadata();
  const ogMeta = await sharp(OG_OUT).metadata();
  console.log(`✓ hero ${HERO_OUT} — ${heroMeta.width}x${heroMeta.height}, ${heroStat.size} bytes`);
  console.log(`✓ og   ${OG_OUT} — ${ogMeta.width}x${ogMeta.height}, ${ogStat.size} bytes`);
  if (heroStat.size < 80_000) throw new Error("hero under 80KB threshold");
  if (ogStat.size < 60_000) throw new Error("og under 60KB threshold");
  console.log("✓ both images satisfy audit-neighborhood-images-deep thresholds");
}

main().catch((e) => {
  console.error("✗", (e as Error).message);
  process.exit(1);
});
