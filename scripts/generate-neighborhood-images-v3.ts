#!/usr/bin/env bun
/**
 * generate-neighborhood-images-v3 — Cycle 40B image-lab workflow.
 *
 * Extends v2 (Cycle 38 hardened generator) with multi-candidate art-direction
 * workflow: per-slug candidate dirs, contact sheets, manifest JSON. Does NOT
 * auto-export to public/markets/ — winners are selected after visual review
 * (per Cycle 40B mission brief: humans inspect; v3 doesn't presume).
 *
 * Why v3:
 *   - Cycle 39 shipped one-shot generations with automated-only validation.
 *     Operator returned "off-brand" feedback that direct inspection couldn't
 *     reproduce. Symmetric answer: generate plural candidates + visible scoring
 *     trail, then a human picks the winner.
 *   - Cycle 40 dropped before writing this. Cycle 40B finishes the job.
 *
 * Output structure (per slug):
 *   docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidates/<slug>/
 *     cand-1.png            raw Gemini PNG, untouched
 *     cand-2.png
 *     cand-3.png
 *     cand-1-meta.json      { dimensions, perimeter_white_ratio, bytes,
 *                             prompt, attempt, accepted_by_automated_validator }
 *     cand-2-meta.json
 *     cand-3-meta.json
 *     contact-sheet.jpg     3-up horizontal grid (1800x600) for at-a-glance
 *                           review
 *     prompt.txt            the full prompt used (creative brief + global hdr)
 *
 * Aggregate manifest:
 *   docs/artifacts/cycle-40b-image-lab-hero-recovery/image-generation-results.json
 *     {
 *       generated_at: ISO,
 *       model: "gemini-2.5-flash-image",
 *       slugs: [...],
 *       candidates_per_slug: 3,
 *       per_slug: { <slug>: { prompt, candidates: [ { path, meta }, ... ] } }
 *     }
 *
 * Usage:
 *   GEMINI_API_KEY=... bun run scripts/generate-neighborhood-images-v3.ts \
 *     --slugs=coral-springs,davie,deerfield-beach,hollywood,plantation,sunrise,weston \
 *     --candidates=3
 *
 *   --dry-run                 only compute, do not write
 *   --slugs=<csv>             subset (default: all 7 Cycle-40B slugs)
 *   --candidates=N            candidates per slug (default 3, max 5)
 *   --max-retries=N           retries per candidate on validator/api failure (default 1)
 *   --concurrency=N           parallel slugs (default 2, careful with API rate)
 *   --no-contact-sheet        skip contact-sheet stitching
 *
 * Winner export is a SEPARATE step — after visual review, run:
 *   bun run scripts/export-cycle40b-winner.ts <slug> <cand-N>
 *   (or do it inline via sharp cli)
 */

import { mkdir, writeFile, stat, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const ARTIFACT_DIR = join(
  REPO,
  "docs/artifacts/cycle-40b-image-lab-hero-recovery",
);
const CAND_ROOT = join(ARTIFACT_DIR, "image-candidates");
const MANIFEST_PATH = join(ARTIFACT_DIR, "image-generation-results.json");

type NeighborhoodBrief = {
  slug: string;
  name: string;
  scene: string;
  must_include: string[];
  must_not_include: string[];
  alt: string;
};

/**
 * Briefs aligned with docs/artifacts/cycle-40b-image-lab-hero-recovery/
 * neighborhood-image-creative-briefs.md. Editing here without updating the doc
 * (or vice versa) is a doctrine violation — the brief is the source of truth
 * and this constant is its codified projection.
 */
const BRIEFS: ReadonlyArray<NeighborhoodBrief> = [
  {
    slug: "deerfield-beach",
    name: "Deerfield Beach",
    scene:
      "documentary-style editorial photograph of the Deerfield Beach Atlantic coastal area in Broward County Florida at warm golden hour, a long wooden public ocean pier extending out over calm turquoise Atlantic water, soft surf rolling on cream sand in the foreground, mature coastal palms framing the composition on either side, refined coastal residential rooflines visible in the distant background, soft warm afternoon sunlight raking across the water surface, brass-tinted highlights, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["coastal light", "palms", "Atlantic / ocean", "Broward coastal character"],
    must_not_include: ["abstract beach", "people", "signs", "generic mansion-only", "framed canvas"],
    alt: "Deerfield Beach Atlantic pier at golden hour (editorial)",
  },
  {
    slug: "hollywood",
    name: "Hollywood",
    scene:
      "documentary-style editorial photograph of the iconic Hollywood Beach Florida brick-paver beachfront promenade in Broward County, a curving brick promenade arcing along a soft turquoise Atlantic shoreline, mature palms casting long shadows on the warm brick pavers, cream sand beach at the water line, low warm golden hour sky, soft amber afternoon light, brass-tinted highlights, calm turquoise water at the horizon, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["oceanfront", "brick promenade or coastal residential", "palms"],
    must_not_include: ["fake text signs", "art-deco cliché with text", "framed canvas", "people"],
    alt: "Hollywood Beach brick promenade with palm shadows at golden hour (editorial)",
  },
  {
    slug: "plantation",
    name: "Plantation",
    scene:
      "documentary-style editorial photograph of a quiet South Florida residential street in Plantation, central Broward County, lined with a dense canopy of mature royal palms arching overhead, dappled warm afternoon sunlight on the road surface, lush emerald tropical landscaping along the curbs, refined residential lots visible behind the palm canopy, no traffic, calm and confident composition, warm golden hour ambient light, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["leafy palm canopy", "refined residential street", "dappled warm light"],
    must_not_include: ["beach", "ocean", "downtown skyline", "people"],
    alt: "Plantation royal-palm canopy over quiet residential street (editorial)",
  },
  {
    slug: "weston",
    name: "Weston",
    scene:
      "documentary-style editorial photograph of an elegant master-planned community lakeside scene in Weston Florida, western Broward County, a calm reflective lake at warm late afternoon, mature oak shade trees and tall slender palms along the lake edge in the foreground, manicured emerald lawn rolling down to the water, refined waterfront residential rooflines visible in the distant background, soft warm golden hour light, brass-tinted highlights on the water, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["lake or pond", "palms or oaks", "manicured landscape", "master-planned context"],
    must_not_include: ["beach", "ocean", "mountains", "desert", "generic golf-only cliché", "people"],
    alt: "Weston master-planned lakeside at golden hour (editorial)",
  },
  {
    slug: "coral-springs",
    name: "Coral Springs",
    scene:
      "documentary-style editorial photograph of a wide tree-lined master-planned residential boulevard in Coral Springs Florida, northwest Broward County, a mature oak canopy arching overhead across both sides of the road, manicured landscaped median strip with low ornamental plantings, soft warm late afternoon sunlight raking across the road surface, distant suburban planned-community rooflines in the background, refined civic calm, brass-tinted highlights, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["greenery / canopy", "residential context", "civic planned-community calm"],
    must_not_include: ["coral reef imagery", "beach", "ocean", "abstract coral objects", "people"],
    alt: "Coral Springs tree-lined boulevard at golden hour (editorial)",
  },
  {
    slug: "davie",
    name: "Davie",
    scene:
      "documentary-style editorial photograph of an open equestrian-friendly Florida ranch estate landscape in Davie, central-western Broward County, a curving three-rail white wooden horse-trail fence winding through tall green pasture grass at warm late afternoon, distant tree line of mature trees, soft warm golden hour sunlight, low warm sky, refined ranch-estate residential rooflines barely visible in the distant background, brass-tinted highlights, no horses no riders no people, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["white rail equestrian fencing", "open pasture grass", "tree line"],
    must_not_include: ["rodeo", "horses", "riders", "people", "barn cliché", "license plate"],
    alt: "Davie equestrian estate landscape at golden hour (editorial)",
  },
  {
    slug: "sunrise",
    name: "Sunrise",
    scene:
      "documentary-style editorial photograph of a calm sunny South Florida lakeside scene in Sunrise, western Broward County, a mirror-still small community lake at warm afternoon, tall palms framing both sides of the composition, lush ornamental tropical landscaping along the lake edge in the foreground, refined planned-community residential rooflines barely visible across the lake, soft pastel sky reflection on the water, warm golden hour light, brass-tinted highlights, full-bleed editorial composition that fills the entire frame edge-to-edge",
    must_include: ["lake or pond", "palms", "sunny planned-community feel"],
    must_not_include: ["arena logos", "mall signage", "abstract sculptures", "beach", "ocean", "people"],
    alt: "Sunrise community lakeside at golden hour (editorial)",
  },
];

type Args = {
  slugs: string[];
  candidates: number;
  dryRun: boolean;
  maxRetries: number;
  concurrency: number;
  noContactSheet: boolean;
};

function parseArgs(): Args {
  const argv = Bun.argv.slice(2);
  let slugs: string[] = BRIEFS.map((b) => b.slug);
  let candidates = 3;
  let dryRun = false;
  let maxRetries = 1;
  let concurrency = 2;
  let noContactSheet = false;
  for (const a of argv) {
    if (a.startsWith("--slugs=")) {
      slugs = a
        .slice("--slugs=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (a.startsWith("--candidates=")) {
      const n = Number(a.slice("--candidates=".length));
      candidates = Math.max(1, Math.min(5, Number.isFinite(n) ? n : 3));
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a.startsWith("--max-retries=")) {
      maxRetries = Number(a.slice("--max-retries=".length)) || 1;
    } else if (a.startsWith("--concurrency=")) {
      concurrency = Math.max(1, Math.min(4, Number(a.slice("--concurrency=".length)) || 2));
    } else if (a === "--no-contact-sheet") {
      noContactSheet = true;
    }
  }
  return { slugs, candidates, dryRun, maxRetries, concurrency, noContactSheet };
}

const PROMPT_HEADER = [
  "Create a documentary-style editorial PHOTOGRAPH (not a painting, not a drawing,",
  "not an illustration, not a digital painting, not a rendered concept-art image,",
  "not a framed artwork, not a canvas, not a gallery-wall composition). Output",
  "format must be a real-world photograph as if shot with a high-end DSLR or",
  "medium-format camera. The image MUST fill the entire frame edge-to-edge with",
  "NO frame, NO border, NO matting, NO white margin, NO canvas texture, NO",
  "gallery-wall presentation, NO drop shadow, NO 3D-perspective frame. Photoreal,",
  "natural light, editorial magazine quality. STRICT requirements:",
  "  - NO people, NO faces, NO silhouettes of people",
  "  - NO logos, NO text, NO license plates, NO readable street signs",
  "  - NO identifiable private residences or named landmarks",
  "  - Vertical portrait 4:5 framing native, suitable for both a 1200x1500 hero",
  "    tile and a 1200x630 OG crop (subject should not hug a single edge)",
  "  - Color palette consistent with refined South Florida luxury real-estate",
  "    editorial: natural sunlight tones, cream, soft golden, deep emerald",
  "    greens, calm blues, brass-tinted highlights.",
  "  - Subject:",
].join(" ");

type GeminiOk = { ok: true; pngBuffer: Buffer };
type GeminiErr = { ok: false; reason: string };

async function callGeminiImage(
  prompt: string,
  apiKey: string,
): Promise<GeminiOk | GeminiErr> {
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
    return {
      ok: false,
      reason:
        "network_error: " +
        (err instanceof Error ? err.message : String(err)),
    };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, reason: `http_${res.status}: ${text.slice(0, 200)}` };
  }
  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    }>;
    promptFeedback?: { blockReason?: string };
  };
  if (data.promptFeedback?.blockReason)
    return { ok: false, reason: `safety_block: ${data.promptFeedback.blockReason}` };
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline?.inlineData?.data)
    return { ok: false, reason: "no_image_in_response" };
  return { ok: true, pngBuffer: Buffer.from(inline.inlineData.data, "base64") };
}

type Metrics = {
  width: number;
  height: number;
  perimeter_white_ratio: number;
  perimeter_total: number;
  perimeter_near_white: number;
  mean_brightness: number;
  mean_saturation_proxy: number;
};

async function computeMetrics(buf: Buffer): Promise<Metrics> {
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w < 200 || h < 200) {
    return {
      width: w,
      height: h,
      perimeter_white_ratio: 0,
      perimeter_total: 0,
      perimeter_near_white: 0,
      mean_brightness: 0,
      mean_saturation_proxy: 0,
    };
  }
  const band = 50;
  const raw = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = raw.data;
  const stride = raw.info.channels * raw.info.width;
  let perimeterTotal = 0;
  let perimeterNearWhite = 0;
  let brightnessSum = 0;
  let satSum = 0;
  let totalPixels = 0;
  for (let y = 0; y < h; y++) {
    const isPerimeterY = y < band || y >= h - band;
    for (let x = 0; x < w; x++) {
      const inPerimeter = isPerimeterY || x < band || x >= w - band;
      const idx = y * stride + x * raw.info.channels;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      brightnessSum += (r + g + b) / 3;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      satSum += mx === 0 ? 0 : (mx - mn) / mx;
      totalPixels++;
      if (inPerimeter) {
        perimeterTotal++;
        if (r >= 235 && g >= 235 && b >= 235) perimeterNearWhite++;
      }
    }
  }
  return {
    width: w,
    height: h,
    perimeter_white_ratio: perimeterTotal === 0 ? 0 : perimeterNearWhite / perimeterTotal,
    perimeter_total: perimeterTotal,
    perimeter_near_white: perimeterNearWhite,
    mean_brightness: brightnessSum / Math.max(1, totalPixels),
    mean_saturation_proxy: satSum / Math.max(1, totalPixels),
  };
}

const MAX_PERIMETER_WHITE_RATIO = 0.25;

type CandidateRecord = {
  slug: string;
  index: number; // 1-based
  raw_png_path: string;
  meta_path: string;
  attempt_count: number;
  prompt_used: string;
  metrics: Metrics;
  accepted_by_automated_validator: boolean;
  rejection_reason: string;
  raw_bytes: number;
  generated_at: string;
};

async function generateOneCandidate(
  brief: NeighborhoodBrief,
  index: number,
  apiKey: string,
  args: Args,
): Promise<CandidateRecord> {
  const prompt = `${PROMPT_HEADER} ${brief.scene}. Place: ${brief.name}, Florida. Final reminder: full-bleed photograph that completely fills the frame edge-to-edge; absolutely NO frame, border, canvas margin, or gallery presentation; NO people.`;
  const slugDir = join(CAND_ROOT, brief.slug);
  await mkdir(slugDir, { recursive: true });
  const rawPath = join(slugDir, `cand-${index}.png`);
  const metaPath = join(slugDir, `cand-${index}-meta.json`);

  let attempt = 0;
  let lastReason = "";
  let acceptedBuf: Buffer | null = null;
  let lastMetrics: Metrics | null = null;

  while (attempt <= args.maxRetries) {
    attempt++;
    if (args.dryRun) {
      // synthesize a stub buffer for dry-run only (1px PNG)
      const stub = await sharp({
        create: { width: 1200, height: 1500, channels: 3, background: { r: 200, g: 180, b: 140 } },
      })
        .png()
        .toBuffer();
      acceptedBuf = stub;
      lastMetrics = await computeMetrics(stub);
      lastReason = "dry_run_synthetic";
      break;
    }
    const r = await callGeminiImage(prompt, apiKey);
    if (!r.ok) {
      lastReason = r.reason;
      process.stderr.write(
        `  ${brief.slug} cand-${index} attempt ${attempt} api_error=${r.reason}\n`,
      );
      continue;
    }
    const m = await computeMetrics(r.pngBuffer);
    lastMetrics = m;
    process.stderr.write(
      `  ${brief.slug} cand-${index} attempt ${attempt} dims=${m.width}x${m.height} perim_white=${m.perimeter_white_ratio.toFixed(3)}\n`,
    );
    if (m.perimeter_white_ratio <= MAX_PERIMETER_WHITE_RATIO) {
      acceptedBuf = r.pngBuffer;
      lastReason = `accepted_attempt_${attempt}`;
      break;
    }
    lastReason = `rejected_perimeter_white_${m.perimeter_white_ratio.toFixed(3)}_attempt_${attempt}`;
  }

  const accepted = acceptedBuf !== null;
  if (accepted && acceptedBuf) {
    await writeFile(rawPath, acceptedBuf);
  } else if (!args.dryRun) {
    // write empty placeholder marker so the contact sheet generator and
    // manifest see a deterministic record
    await writeFile(rawPath + ".FAILED", Buffer.from(lastReason, "utf-8"));
  }

  const rec: CandidateRecord = {
    slug: brief.slug,
    index,
    raw_png_path: accepted ? rawPath : rawPath + ".FAILED",
    meta_path: metaPath,
    attempt_count: attempt,
    prompt_used: prompt,
    metrics: lastMetrics ?? {
      width: 0,
      height: 0,
      perimeter_white_ratio: 0,
      perimeter_total: 0,
      perimeter_near_white: 0,
      mean_brightness: 0,
      mean_saturation_proxy: 0,
    },
    accepted_by_automated_validator: accepted,
    rejection_reason: accepted ? "" : lastReason,
    raw_bytes: accepted && acceptedBuf ? acceptedBuf.byteLength : 0,
    generated_at: new Date().toISOString(),
  };
  await writeFile(metaPath, JSON.stringify(rec, null, 2));
  return rec;
}

async function stitchContactSheet(
  slug: string,
  records: ReadonlyArray<CandidateRecord>,
): Promise<string | null> {
  const accepted = records.filter((r) => r.accepted_by_automated_validator);
  if (accepted.length === 0) return null;
  const tileW = 600;
  const tileH = 750;
  const tileBuffers = await Promise.all(
    accepted.map(async (r) => {
      const buf = await readFile(r.raw_png_path);
      return sharp(buf)
        .resize(tileW, tileH, { fit: "cover", position: "centre" })
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();
    }),
  );
  const sheetW = tileW * accepted.length;
  const sheet = await sharp({
    create: {
      width: sheetW,
      height: tileH,
      channels: 3,
      background: { r: 250, g: 245, b: 240 },
    },
  })
    .composite(
      tileBuffers.map((buf, i) => ({
        input: buf,
        top: 0,
        left: i * tileW,
      })),
    )
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  const path = join(CAND_ROOT, slug, "contact-sheet.jpg");
  await writeFile(path, sheet);
  return path;
}

async function runSlug(
  brief: NeighborhoodBrief,
  apiKey: string,
  args: Args,
): Promise<{
  slug: string;
  prompt: string;
  candidates: CandidateRecord[];
  contact_sheet: string | null;
}> {
  const records: CandidateRecord[] = [];
  for (let i = 1; i <= args.candidates; i++) {
    const r = await generateOneCandidate(brief, i, apiKey, args);
    records.push(r);
  }
  let contactSheet: string | null = null;
  if (!args.noContactSheet && !args.dryRun) {
    contactSheet = await stitchContactSheet(brief.slug, records);
  }
  // write per-slug prompt.txt for human visibility
  const promptPath = join(CAND_ROOT, brief.slug, "prompt.txt");
  await writeFile(promptPath, records[0]?.prompt_used ?? "");
  return {
    slug: brief.slug,
    prompt: records[0]?.prompt_used ?? "",
    candidates: records,
    contact_sheet: contactSheet,
  };
}

async function main() {
  const args = parseArgs();
  await mkdir(ARTIFACT_DIR, { recursive: true });
  await mkdir(CAND_ROOT, { recursive: true });

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
  if (!apiKey && !args.dryRun) {
    console.error("GEMINI_API_KEY / GOOGLE_API_KEY missing — cannot generate. Exit 2.");
    process.exit(2);
  }

  const briefs = BRIEFS.filter((b) => args.slugs.includes(b.slug));
  if (briefs.length === 0) {
    console.error("no matching slugs in brief set. requested=" + args.slugs.join(","));
    process.exit(2);
  }

  console.log(
    `cycle 40B image-lab v3 — ${briefs.length} slugs × ${args.candidates} candidates = ${briefs.length * args.candidates} total candidates`,
  );
  console.log(`output: ${CAND_ROOT}`);
  console.log(`dry-run: ${args.dryRun} | concurrency: ${args.concurrency}`);

  // Simple concurrency pool across slugs
  const results: Array<{
    slug: string;
    prompt: string;
    candidates: CandidateRecord[];
    contact_sheet: string | null;
  }> = [];
  let cursor = 0;
  const workers = Array.from({ length: args.concurrency }, async () => {
    while (cursor < briefs.length) {
      const i = cursor++;
      if (i >= briefs.length) break;
      const brief = briefs[i] as NeighborhoodBrief;
      const t0 = Date.now();
      const r = await runSlug(brief, apiKey, args);
      const dur = ((Date.now() - t0) / 1000).toFixed(1);
      const ok = r.candidates.filter((c) => c.accepted_by_automated_validator).length;
      console.log(
        `  [${i + 1}/${briefs.length}] ${brief.slug}: ${ok}/${args.candidates} accepted (${dur}s)${r.contact_sheet ? " + sheet" : ""}`,
      );
      results.push(r);
    }
  });
  await Promise.all(workers);

  const manifest = {
    schema_version: "cycle40b-v3-1.0.0",
    generated_at: new Date().toISOString(),
    model: "gemini-2.5-flash-image",
    candidates_per_slug: args.candidates,
    max_perimeter_white_ratio: MAX_PERIMETER_WHITE_RATIO,
    dry_run: args.dryRun,
    per_slug: Object.fromEntries(
      results.map((r) => [
        r.slug,
        {
          prompt: r.prompt,
          contact_sheet: r.contact_sheet,
          candidates: r.candidates.map((c) => ({
            index: c.index,
            raw_png_path: c.raw_png_path,
            meta_path: c.meta_path,
            attempt_count: c.attempt_count,
            metrics: c.metrics,
            accepted_by_automated_validator: c.accepted_by_automated_validator,
            rejection_reason: c.rejection_reason,
            raw_bytes: c.raw_bytes,
          })),
        },
      ]),
    ),
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nmanifest written: ${MANIFEST_PATH}`);

  // Summarize
  const summary = results.map((r) => ({
    slug: r.slug,
    accepted: r.candidates.filter((c) => c.accepted_by_automated_validator).length,
    total: r.candidates.length,
    sheet: r.contact_sheet ? "yes" : "no",
  }));
  console.log("\n--- SUMMARY ---");
  console.log(JSON.stringify(summary, null, 2));
  const anySlugWithZeroAccepted = summary.some((s) => s.accepted === 0);
  process.exit(anySlugWithZeroAccepted ? 1 : 0);
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
