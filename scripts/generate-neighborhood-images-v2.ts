#!/usr/bin/env bun
/**
 * generate-neighborhood-images-v2 — Cycle 38 hardened regeneration.
 *
 * Why v2: Cycle 37 prompts said "painterly luxury aesthetic, illustrative not
 * photo-real claims, 16:9 reference framing" — Gemini returned several outputs as
 * framed-canvas compositions (a painting hanging on a white wall) which the
 * cover-fit resize preserved. The on-page tile read as mostly-white.
 *
 * Fixes:
 *   - Prompt explicitly forbids frames, borders, canvas margins, painterly
 *     composition, gallery-wall presentation. Demands documentary photo realism
 *     with full-bleed composition.
 *   - Requests portrait 4:5 framing natively (matches MarketCard aspect).
 *   - Post-generate validator: rejects an image if the 50-px perimeter band is
 *     >25% near-white pixels. Retries up to 2× before giving up.
 *   - Writes Cycle-38 artifacts at docs/artifacts/cycle-38-live-images-bridge-hero/.
 *
 * Usage:
 *   GEMINI_API_KEY=... bun run scripts/generate-neighborhood-images-v2.ts \
 *     --slugs=coral-springs,davie,deerfield-beach,hollywood,plantation,sunrise,weston
 *
 *   --dry-run         only compute, do not write
 *   --slugs=<csv>     subset
 *   --max-retries=N   default 2
 */

import { mkdir, writeFile, stat, appendFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const ARTIFACT_DIR = join(REPO, "docs/artifacts/cycle-38-live-images-bridge-hero");
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
      "documentary-style photograph of a wide tree-lined master-planned suburban boulevard in South Florida at warm late-afternoon golden hour, mature oak canopy arching overhead, manicured median strip with low landscaping, soft amber sunlight raking across the road surface, distant suburban roofline in the background, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Coral Springs tree-lined boulevard at golden hour (editorial)",
  },
  {
    slug: "davie",
    name: "Davie",
    scene:
      "documentary-style photograph of an open equestrian-friendly Florida ranch landscape at warm late afternoon, three-rail white wooden horse-trail fencing curving through tall green pasture grass, distant tree line of mature trees, soft warm golden sunlight, low warm sky, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Davie equestrian pasture and trail fencing (editorial)",
  },
  {
    slug: "deerfield-beach",
    name: "Deerfield Beach",
    scene:
      "documentary-style photograph of a wooden Florida ocean pier extending out over calm Atlantic water in warm late-afternoon light, soft turquoise water gradient, gentle wave pattern in foreground, light wooden pier deck and pilings, brass-tinted highlights from low sun, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Deerfield Beach pier over calm Atlantic at golden hour (editorial)",
  },
  {
    slug: "hollywood",
    name: "Hollywood",
    scene:
      "documentary-style photograph of the iconic Hollywood Beach Florida brick-paver beachfront promenade boardwalk arcing along a soft turquoise shoreline, mature palms casting long shadows on the brick paving, warm cream sand at the water line, late-afternoon golden glow, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Hollywood Beach brick promenade with palm shadows (editorial)",
  },
  {
    slug: "plantation",
    name: "Plantation",
    scene:
      "documentary-style photograph of a quiet South Florida residential street in Plantation lined with mature royal palms forming a dense canopy overhead, dappled afternoon sunlight on the road, lush emerald lawn and tropical landscaping along the curbs, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Plantation royal-palm canopy over a quiet residential street (editorial)",
  },
  {
    slug: "sunrise",
    name: "Sunrise",
    scene:
      "documentary-style photograph of a calm South Florida lakeside scene at warm sunrise, mirror-still water with a soft golden horizon, lush palms and manicured tropical landscaping along the lake edge in the foreground, gentle warm light bathing the scene, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Sunrise lakeside at warm dawn (editorial)",
  },
  {
    slug: "weston",
    name: "Weston",
    scene:
      "documentary-style photograph of an elegant master-planned community entrance landscape in Weston Florida, a manicured emerald lawn with mature oak shade trees, ornamental tropical landscaping, soft warm late-afternoon natural light, photorealistic full-bleed editorial composition that fills the entire frame edge-to-edge",
    alt: "Weston master-planned community landscape (editorial)",
  },
];

type Args = { slugs: string[]; dryRun: boolean; maxRetries: number };

function parseArgs(): Args {
  const argv = Bun.argv.slice(2);
  let slugs: string[] = BRIEFS.map((b) => b.slug);
  let dryRun = false;
  let maxRetries = 2;
  for (const a of argv) {
    if (a.startsWith("--slugs=")) {
      slugs = a.slice("--slugs=".length).split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a.startsWith("--max-retries=")) {
      maxRetries = Number(a.slice("--max-retries=".length)) || 2;
    }
  }
  return { slugs, dryRun, maxRetries };
}

const PROMPT_HEADER = [
  "Create a documentary-style editorial PHOTOGRAPH (not a painting, not a drawing,",
  "not an illustration, not a digital painting, not a rendered concept-art image,",
  "not a framed artwork). Output format must be a real-world photograph as if shot",
  "with a high-end DSLR/medium-format camera. The image MUST fill the entire frame",
  "edge-to-edge with NO frame, NO border, NO matting, NO white margin, NO canvas",
  "texture, NO gallery-wall presentation, NO drop shadow, NO 3D-perspective frame.",
  "Photoreal, natural light, magazine quality. STRICT requirements:",
  "  - NO people, NO faces, NO silhouettes of people",
  "  - NO logos, NO text, NO license plates, NO readable street signs",
  "  - NO identifiable private residences or named landmarks",
  "  - Vertical portrait 4:5 framing native, suitable for a 1200x1500 hero tile",
  "  - Color palette consistent with luxury South Florida real estate editorial:",
  "    natural sunlight tones, cream, soft golden, deep emerald greens, calm blues.",
  "  - Subject:",
].join(" ");

type GeminiOk = { ok: true; pngBuffer: Buffer };
type GeminiErr = { ok: false; reason: string };

async function callGeminiImage(prompt: string, apiKey: string): Promise<GeminiOk | GeminiErr> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, reason: "network_error: " + (err instanceof Error ? err.message : String(err)) };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, reason: `http_${res.status}: ${text.slice(0, 200)}` };
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }>;
    promptFeedback?: { blockReason?: string };
  };
  if (data.promptFeedback?.blockReason) return { ok: false, reason: `safety_block: ${data.promptFeedback.blockReason}` };
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline?.inlineData?.data) return { ok: false, reason: "no_image_in_response" };
  return { ok: true, pngBuffer: Buffer.from(inline.inlineData.data, "base64") };
}

/**
 * Validator: rejects images whose 50-px perimeter band has >25% near-white pixels.
 * This catches the Cycle 37 framed-canvas defect class (Hollywood, Davie).
 */
async function perimeterWhitenessRatio(buf: Buffer): Promise<{ ratio: number; total: number; near_white: number; width: number; height: number }> {
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < 200 || h < 200) return { ratio: 0, total: 0, near_white: 0, width: w, height: h };
  const band = 50;
  const raw = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = raw.data;
  const stride = raw.info.channels * raw.info.width;
  let total = 0;
  let nearWhite = 0;
  for (let y = 0; y < h; y++) {
    const isPerimeter = y < band || y >= h - band;
    for (let x = 0; x < w; x++) {
      const inX = isPerimeter || x < band || x >= w - band;
      if (!inX) continue;
      const idx = y * stride + x * raw.info.channels;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      total++;
      if (r >= 235 && g >= 235 && b >= 235) nearWhite++;
    }
  }
  return { ratio: total === 0 ? 0 : nearWhite / total, total, near_white: nearWhite, width: w, height: h };
}

async function fileSize(p: string): Promise<number> {
  try {
    return (await stat(p)).size;
  } catch {
    return -1;
  }
}

async function logEntry(slug: string, data: Record<string, string | number | boolean>) {
  const lines = ["", `### ${slug}`];
  for (const [k, v] of Object.entries(data)) lines.push(`- ${k}: ${v}`);
  lines.push("");
  await appendFile(LOG_PATH, lines.join("\n"));
}

const MAX_PERIMETER_WHITE_RATIO = 0.25;

async function main() {
  const args = parseArgs();
  await mkdir(ARTIFACT_DIR, { recursive: true });
  await mkdir(join(REPO, "public/markets"), { recursive: true });
  await mkdir(join(REPO, "public/og-markets"), { recursive: true });

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
  if (!apiKey) {
    console.error("GEMINI_API_KEY/GOOGLE_API_KEY missing — cannot generate. Exit 2.");
    process.exit(2);
  }

  const briefs = BRIEFS.filter((b) => args.slugs.includes(b.slug));
  if (briefs.length === 0) {
    console.error("no matching slugs in brief set: " + args.slugs.join(","));
    process.exit(2);
  }

  if (!(await stat(LOG_PATH).catch(() => null))) {
    await writeFile(
      LOG_PATH,
      `# Cycle 38 — Neighborhood Image Generation Log\n\nGenerated: ${new Date().toISOString()}\nMode: ${args.dryRun ? "dry-run" : "live"}\nValidator: perimeter-whiteness ratio must be < ${MAX_PERIMETER_WHITE_RATIO}\n`,
    );
  }

  const summary: Array<{ slug: string; status: string; attempts: number; perimeter_ratio: number; hero_bytes: number; og_bytes: number }> = [];

  for (const brief of briefs) {
    const prompt = `${PROMPT_HEADER} ${brief.scene}. Place: ${brief.name}, Florida. Final reminder: full-bleed photograph that completely fills the frame edge-to-edge; absolutely NO frame, border, canvas margin, or gallery presentation.`;
    let attempt = 0;
    let acceptedBuf: Buffer | null = null;
    let lastRatio = 1;
    let lastReason = "";
    while (attempt <= args.maxRetries) {
      attempt++;
      const r = await callGeminiImage(prompt, apiKey);
      if (!r.ok) {
        lastReason = r.reason;
        process.stderr.write(`  ${brief.slug} attempt ${attempt} gemini_error=${r.reason}\n`);
        continue;
      }
      const v = await perimeterWhitenessRatio(r.pngBuffer);
      lastRatio = v.ratio;
      process.stderr.write(`  ${brief.slug} attempt ${attempt} dims=${v.width}x${v.height} perimeter_white_ratio=${v.ratio.toFixed(3)}\n`);
      if (v.ratio <= MAX_PERIMETER_WHITE_RATIO) {
        acceptedBuf = r.pngBuffer;
        lastReason = `accepted_attempt_${attempt}`;
        break;
      }
      lastReason = `rejected_perimeter_white_ratio_${v.ratio.toFixed(3)}_attempt_${attempt}`;
    }

    if (!acceptedBuf) {
      await logEntry(brief.slug, {
        neighborhood: brief.name,
        provenance: "ai-generated-rejected",
        status: "FAILED",
        attempts: attempt,
        last_perimeter_ratio: Number(lastRatio.toFixed(3)),
        reason: lastReason,
        dry_run: args.dryRun,
      });
      summary.push({ slug: brief.slug, status: "FAILED", attempts: attempt, perimeter_ratio: lastRatio, hero_bytes: -1, og_bytes: -1 });
      continue;
    }

    const heroPath = join(REPO, "public/markets", `${brief.slug}.jpg`);
    const ogPath = join(REPO, "public/og-markets", `${brief.slug}.jpg`);
    const heroOptimized = await sharp(acceptedBuf)
      .resize(1200, 1500, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const ogOptimized = await sharp(acceptedBuf)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    // Final post-resize validation on the actual hero JPEG
    const heroCheck = await perimeterWhitenessRatio(heroOptimized);
    if (heroCheck.ratio > MAX_PERIMETER_WHITE_RATIO) {
      process.stderr.write(`  ${brief.slug} POST-RESIZE perimeter ratio ${heroCheck.ratio.toFixed(3)} still > ${MAX_PERIMETER_WHITE_RATIO} — flagging\n`);
    }

    if (!args.dryRun) {
      await writeFile(heroPath, heroOptimized);
      await writeFile(ogPath, ogOptimized);
    }

    const heroBytes = args.dryRun ? heroOptimized.byteLength : await fileSize(heroPath);
    const ogBytes = args.dryRun ? ogOptimized.byteLength : await fileSize(ogPath);

    await logEntry(brief.slug, {
      neighborhood: brief.name,
      provenance: "ai-generated-illustrative",
      reason: lastReason,
      attempts: attempt,
      raw_perimeter_ratio: Number(lastRatio.toFixed(3)),
      hero_post_resize_perimeter_ratio: Number(heroCheck.ratio.toFixed(3)),
      hero_path: `/markets/${brief.slug}.jpg`,
      hero_bytes: heroBytes,
      og_path: `/og-markets/${brief.slug}.jpg`,
      og_bytes: ogBytes,
      alt_text: brief.alt,
      dry_run: args.dryRun,
    });

    summary.push({
      slug: brief.slug,
      status: args.dryRun ? "dry-run" : heroCheck.ratio > MAX_PERIMETER_WHITE_RATIO ? "WROTE_BUT_FLAGGED" : "WROTE",
      attempts: attempt,
      perimeter_ratio: heroCheck.ratio,
      hero_bytes: heroBytes,
      og_bytes: ogBytes,
    });
    console.log(
      `${brief.slug}: ${args.dryRun ? "dry-run" : "wrote"} attempts=${attempt} perimeter=${heroCheck.ratio.toFixed(3)} hero=${heroBytes}B og=${ogBytes}B`,
    );
  }

  console.log("\n--- SUMMARY ---");
  console.log(JSON.stringify({ summary, max_allowed_perimeter_white_ratio: MAX_PERIMETER_WHITE_RATIO }, null, 2));
  const anyFailed = summary.some((s) => s.status === "FAILED" || s.status === "WROTE_BUT_FLAGGED");
  process.exit(anyFailed ? 1 : 0);
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
