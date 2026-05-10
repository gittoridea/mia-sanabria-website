#!/usr/bin/env bun
/**
 * Cycle 16 — Per-post OG image generator for /insights/*.
 *
 * Composites:
 *   - Source: post.heroImage (already a curated market image at 1200x1500).
 *   - Resize+crop to 1200x630 with `cover` fit (smart center crop).
 *   - 3-layer navy scrim (mood + content + cta) matching Hero.tsx for editorial cohesion.
 *   - SVG overlay: brass-200 divider · post title (Cinzel, wrapped to 3 lines max) ·
 *     "MIA SANABRIA — REALTOR®" wordmark · editorial-month frame.
 *
 * Output: public/og-insights/<slug>.jpg @ 1200x630, JPEG q=82.
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const ROOT = "/home/torrey/code/mia-sanabria-website";
const DATA_DIR = `${ROOT}/src/data/insights`;
const PUBLIC = `${ROOT}/public`;
const OUTPUT_DIR = `${PUBLIC}/og-insights`;

type Post = {
  slug: string;
  title: string;
  heroImage: string;
  editorialMonthLabel: string;
};

async function loadPosts(): Promise<Post[]> {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith(".ts")).sort();
  const posts: Post[] = [];
  for (const f of files) {
    const text = await readFile(`${DATA_DIR}/${f}`, "utf8");
    const slug = text.match(/slug:\s*"([^"]+)"/)?.[1];
    const title = text.match(/title:\s*"([^"]+)"/)?.[1];
    const heroImage = text.match(/heroImage:\s*"([^"]+)"/)?.[1];
    const editorialMonthLabel = text.match(/editorialMonthLabel:\s*"([^"]+)"/)?.[1];
    if (!slug || !title || !heroImage || !editorialMonthLabel) {
      throw new Error(`Failed to parse ${f}`);
    }
    posts.push({ slug, title, heroImage, editorialMonthLabel });
  }
  return posts;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap a string into N lines at ~maxChars width on word boundaries. */
function wrapToLines(s: string, maxChars: number, maxLines: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const trial = current ? `${current} ${w}` : w;
    if (trial.length <= maxChars) {
      current = trial;
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) {
        // Last line: pack remaining words and ellipsize if overflow.
        const rest = words.slice(words.indexOf(w)).join(" ");
        if (rest.length > maxChars) {
          const cut = rest.lastIndexOf(" ", maxChars - 1);
          lines.push(cut > 0 ? rest.slice(0, cut) + "…" : rest.slice(0, maxChars - 1) + "…");
        } else {
          lines.push(rest);
        }
        return lines;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

function renderOverlaySvg(post: Post): string {
  const title = escapeXml(post.title);
  const monthLabel = escapeXml(post.editorialMonthLabel.toUpperCase());
  const titleLines = wrapToLines(title, 38, 3);
  const titleStart = 320;
  const titleStep = 56;
  const titleY = (i: number) => titleStart + i * titleStep;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="scrim-mood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0F2A44" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#0F2A44" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="scrim-content" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0F2A44" stop-opacity="0.30"/>
      <stop offset="0.50" stop-color="#0F2A44" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0F2A44" stop-opacity="0.78"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#scrim-mood)"/>
  <rect width="1200" height="630" fill="url(#scrim-content)"/>
  <g font-family="Cinzel, 'Times New Roman', serif">
    <line x1="80" y1="98" x2="200" y2="98" stroke="#B89B5E" stroke-width="1" opacity="0.95"/>
    <text x="80" y="140" font-size="18" letter-spacing="6" fill="#B89B5E">MIA SANABRIA</text>
    <text x="80" y="172" font-size="12" letter-spacing="4" fill="#E8DAB7" opacity="0.88">REALTOR® · LPT REALTY</text>
    <text x="80" y="246" font-size="14" letter-spacing="5" fill="#B89B5E">${monthLabel}</text>
    ${titleLines
      .map(
        (line, i) =>
          `<text x="80" y="${titleY(i)}" font-size="42" font-weight="600" letter-spacing="1" fill="#F5EFE6">${escapeXml(
            line
          )}</text>`
      )
      .join("\n    ")}
    <text x="80" y="555" font-size="16" letter-spacing="4" fill="#B89B5E">INSIGHTS · EVERGREEN LIBRARY</text>
    <text x="80" y="580" font-size="13" letter-spacing="3" fill="#E8DAB7" opacity="0.78">MIASANABRIAREALTOR.COM</text>
  </g>
</svg>`;
}

async function generateOne(post: Post): Promise<{ slug: string; bytes: number }> {
  const heroPath = `${PUBLIC}${post.heroImage}`;
  if (!existsSync(heroPath)) {
    throw new Error(`Hero image missing for ${post.slug}: ${heroPath}`);
  }
  const overlaySvg = Buffer.from(renderOverlaySvg(post));

  // Resize hero to 1200x630 with cover fit (smart center crop).
  const base = await sharp(heroPath)
    .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
    .toBuffer();

  const composited = await sharp(base)
    .composite([{ input: overlaySvg, top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  const dst = `${OUTPUT_DIR}/${post.slug}.jpg`;
  await writeFile(dst, composited);
  return { slug: post.slug, bytes: composited.length };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const posts = await loadPosts();
  console.log(`Found ${posts.length} insights posts.`);
  for (const post of posts) {
    const { slug, bytes } = await generateOne(post);
    console.log(`✓ /og-insights/${slug}.jpg (${bytes} bytes)`);
  }
  console.log(`\nGenerated ${posts.length} per-post OG images.`);
}

await main();
