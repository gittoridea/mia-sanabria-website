#!/usr/bin/env bun
/**
 * generate-neighborhood-images — Gemini 2.5 Flash Image generator for missing/weak
 * neighborhood hero + OG images. Falls back to programmatic SVG/Sharp editorial
 * images if Gemini fails or is unavailable.
 *
 * Usage:
 *   GEMINI_API_KEY=... bun run scripts/generate-neighborhood-images.ts \
 *     --slugs=coral-springs,davie,deerfield-beach,hollywood,plantation,sunrise,weston
 *   bun run scripts/generate-neighborhood-images.ts --slugs=davie --dry-run
 *   bun run scripts/generate-neighborhood-images.ts --slugs=davie --probe-only
 *
 * Outputs:
 *   public/markets/<slug>.jpg (1200x1500 portrait — matches MarketCard aspect-[4/5])
 *   public/og-markets/<slug>.jpg (1200x630 OG)
 *   docs/artifacts/cycle-37-neighborhood-images-bridge-idx/image-generation-log.md (append-only)
 *
 * Provenance: every generated image labeled `ai-generated-illustrative` or
 * `programmatic-illustrative` in the manifest. Alt text describes general
 * editorial scene, not documentary truth.
 *
 * Safety rules (enforced in prompt):
 *   - no people, no real identifiable homes, no logos, no text in image
 *   - no license plates, no specific landmarks claimed by name
 *   - editorial brand-palette aesthetic (navy/brass/cream cues)
 *   - 16:9 reference framing, then crop/extend as needed
 */

import { mkdir, writeFile, stat, appendFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const ARTIFACT_DIR = join(
  REPO,
  "docs/artifacts/cycle-37-neighborhood-images-bridge-idx"
);
const LOG_PATH = join(ARTIFACT_DIR, "image-generation-log.md");

type NeighborhoodBrief = {
  slug: string;
  name: string;
  scene: string;
  alt: string;
};

const BRIEFS: ReadonlyArray<NeighborhoodBrief> = [
  {
    slug: "coral-springs",
    name: "Coral Springs",
    scene:
      "wide tree-lined master-planned suburban boulevard at golden hour, lush mature oak canopy, manicured median, soft amber sunset over distant subtle Florida architecture rooflines",
    alt: "Coral Springs tree-lined boulevard at golden hour (illustrative editorial)",
  },
  {
    slug: "davie",
    name: "Davie",
    scene:
      "open equestrian-friendly Florida landscape, white horse-trail fencing curving through tall green pasture grass, distant tree line, soft late afternoon warm light",
    alt: "Davie equestrian-style open pasture and trail fencing (illustrative editorial)",
  },
  {
    slug: "deerfield-beach",
    name: "Deerfield Beach",
    scene:
      "sun-washed Florida beach pier extending over calm Atlantic in warm late-afternoon light, soft turquoise water gradient, gentle wave pattern, brass-tinted highlights",
    alt: "Deerfield Beach pier over calm Atlantic at golden hour (illustrative editorial)",
  },
  {
    slug: "hollywood",
    name: "Hollywood",
    scene:
      "iconic Florida beachfront brick promenade boardwalk arcing along soft turquoise shoreline, palm shadows, warm cream sand, late-afternoon glow, no people no logos",
    alt: "Hollywood beachfront promenade with palm shadows (illustrative editorial)",
  },
  {
    slug: "plantation",
    name: "Plantation",
    scene:
      "dense royal palm canopy over a quiet South Florida residential street with soft dappled afternoon light, lush emerald-green park lawn in background, brass sun flares",
    alt: "Plantation royal-palm canopy over a quiet residential street (illustrative editorial)",
  },
  {
    slug: "sunrise",
    name: "Sunrise",
    scene:
      "vast manicured Florida lakeside plaza at sunrise, warm golden horizon over still water, distant subtle skyline silhouette, brass and cream warm tones, glassy reflections",
    alt: "Sunrise lakefront plaza at warm dawn (illustrative editorial)",
  },
  {
    slug: "weston",
    name: "Weston",
    scene:
      "elegant master-planned community fountain courtyard with mature oak shade, manicured emerald lawn, gentle warm late-afternoon Florida light, brass accents on water spray",
    alt: "Weston master-planned community fountain courtyard (illustrative editorial)",
  },
];

type Args = {
  slugs: string[];
  dryRun: boolean;
  probeOnly: boolean;
};

function parseArgs(): Args {
  const argv = Bun.argv.slice(2);
  let slugs: string[] = BRIEFS.map((b) => b.slug);
  let dryRun = false;
  let probeOnly = false;
  for (const a of argv) {
    if (a.startsWith("--slugs=")) {
      slugs = a
        .slice("--slugs=".length)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a === "--probe-only") {
      probeOnly = true;
    }
  }
  return { slugs, dryRun, probeOnly };
}

const PROMPT_HEADER = [
  "Premium South Florida real estate editorial photograph for use as a website",
  "section hero. Refined, magazine-quality, painterly luxury aesthetic, brand",
  "palette: navy, brass, cream. Strict requirements:",
  "  - NO people, NO faces, NO silhouettes of people",
  "  - NO logos, NO text, NO license plates, NO street signs with text",
  "  - NO identifiable private residences or named landmarks",
  "  - Composition reads as place, not as a documentary photo of a property",
  "  - Cinematic depth, soft natural light, illustrative not photo-real claims",
  "  - 16:9 horizontal framing, ultra-high quality, photoreal but uncluttered",
  "  - Subject:",
].join(" ");

async function callGeminiImage(
  prompt: string,
  apiKey: string
): Promise<{ ok: true; pngBuffer: Buffer } | { ok: false; reason: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      ok: false,
      reason: "network_error: " + (err instanceof Error ? err.message : String(err)),
    };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      reason: `http_${res.status}: ${text.slice(0, 200)}`,
    };
  }
  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    }>;
    promptFeedback?: { blockReason?: string };
  };
  if (data.promptFeedback?.blockReason) {
    return { ok: false, reason: `safety_block: ${data.promptFeedback.blockReason}` };
  }
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline?.inlineData?.data) {
    return { ok: false, reason: "no_image_in_response" };
  }
  return {
    ok: true,
    pngBuffer: Buffer.from(inline.inlineData.data, "base64"),
  };
}

async function programmaticEditorial(brief: NeighborhoodBrief): Promise<Buffer> {
  // Brand palette
  const navy = "#0F2A44";
  const brass = "#B8924A";
  const cream = "#F4EAD5";
  // Pick a scene-driven hue per slug (deterministic) so each card differs
  const seed = brief.slug
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const accentHue = (seed * 11) % 360;
  const accent = `hsl(${accentHue}deg 35% 45%)`;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${navy}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${cream}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="brassWash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${brass}" stop-opacity="0.0"/>
      <stop offset="60%" stop-color="${brass}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${brass}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <g opacity="0.55">
    <ellipse cx="${(seed * 17) % 1600}" cy="${340 + (seed % 80)}" rx="${260 + (seed % 60)}" ry="120" fill="${cream}" opacity="0.20"/>
    <ellipse cx="${(seed * 29) % 1600}" cy="${430 + (seed % 90)}" rx="${340 + (seed % 50)}" ry="160" fill="${navy}" opacity="0.22"/>
  </g>
  <rect y="520" width="1600" height="380" fill="${navy}" opacity="0.42"/>
  <rect y="520" width="1600" height="380" fill="url(#brassWash)"/>
  <g stroke="${brass}" stroke-width="0.6" opacity="0.35">
    <path d="M 0 720 Q 400 680 800 720 T 1600 720" fill="none"/>
    <path d="M 0 760 Q 400 720 800 760 T 1600 760" fill="none"/>
  </g>
</svg>`;
  return await sharp(Buffer.from(svg))
    .resize(1600, 900, { fit: "cover" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}

async function fileSize(p: string): Promise<number> {
  try {
    return (await stat(p)).size;
  } catch {
    return -1;
  }
}

async function logEntry(
  slug: string,
  data: Record<string, string | number | boolean>
) {
  const lines = ["", `### ${slug}`];
  for (const [k, v] of Object.entries(data)) lines.push(`- ${k}: ${v}`);
  lines.push("");
  await appendFile(LOG_PATH, lines.join("\n"));
}

async function main() {
  const args = parseArgs();
  await mkdir(ARTIFACT_DIR, { recursive: true });
  await mkdir(join(REPO, "public/markets"), { recursive: true });
  await mkdir(join(REPO, "public/og-markets"), { recursive: true });

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
  const briefs = BRIEFS.filter((b) => args.slugs.includes(b.slug));
  if (briefs.length === 0) {
    console.error("no matching slugs in brief set: " + args.slugs.join(","));
    process.exit(2);
  }

  if (!(await stat(LOG_PATH).catch(() => null))) {
    await writeFile(
      LOG_PATH,
      `# Cycle 37 — Neighborhood Image Generation Log\n\nGenerated: ${new Date().toISOString()}\nMode: ${args.dryRun ? "dry-run" : args.probeOnly ? "probe-only" : "live"}\n`
    );
  }

  const results: Array<{ slug: string; status: string; provenance: string }> = [];
  for (const brief of briefs) {
    const prompt = `${PROMPT_HEADER} ${brief.scene}. Place: ${brief.name}, Florida.`;
    let provenance = "ai-generated-illustrative";
    let buf: Buffer | null = null;
    let reason = "";

    if (apiKey && !args.probeOnly) {
      const r = await callGeminiImage(prompt, apiKey);
      if (r.ok) {
        buf = r.pngBuffer;
        reason = "gemini_2_5_flash_image";
      } else {
        reason = r.reason;
      }
    } else if (!apiKey) {
      reason = "no_api_key";
    } else if (args.probeOnly) {
      reason = "probe_only_skip";
    }

    if (!buf) {
      provenance = "programmatic-illustrative";
      buf = await programmaticEditorial(brief);
      reason += "+programmatic_fallback";
    }

    const heroPath = join(REPO, "public/markets", `${brief.slug}.jpg`);
    const ogPath = join(REPO, "public/og-markets", `${brief.slug}.jpg`);

    const heroOptimized = await sharp(buf)
      .resize(1200, 1500, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const ogOptimized = await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    if (!args.dryRun) {
      await writeFile(heroPath, heroOptimized);
      await writeFile(ogPath, ogOptimized);
    }

    const heroBytes = args.dryRun ? heroOptimized.byteLength : await fileSize(heroPath);
    const ogBytes = args.dryRun ? ogOptimized.byteLength : await fileSize(ogPath);

    await logEntry(brief.slug, {
      neighborhood: brief.name,
      provenance,
      reason,
      hero_path: `/markets/${brief.slug}.jpg`,
      hero_bytes: heroBytes,
      og_path: `/og-markets/${brief.slug}.jpg`,
      og_bytes: ogBytes,
      alt_text: brief.alt,
      dry_run: args.dryRun,
    });

    results.push({
      slug: brief.slug,
      status: args.dryRun ? "dry-run" : "wrote",
      provenance,
    });
    console.log(
      `${brief.slug}: ${provenance} hero=${heroBytes}B og=${ogBytes}B (${reason})`
    );
  }

  console.log(JSON.stringify({ results }, null, 2));
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
