#!/usr/bin/env bun
/**
 * Walks every HTML page in the static export, extracts internal <a href>,
 * and confirms each target resolves to a file in the build output.
 * External links (http://, https://, mailto:, tel:) are ignored.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield path;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const HREF_RE = /href="([^"#?][^"]*)"/g;
const root = "out";

const startedAt = Date.now();
let pages = 0;
let bad = 0;
let checked = 0;
try {
  for await (const file of walk(root)) {
    pages++;
    const content = await readFile(file, "utf8");
    for (const m of content.matchAll(HREF_RE)) {
      const href = m[1] ?? "";
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("//")
      ) continue;
      checked++;
      const cleaned = href.split("#")[0]?.split("?")[0] ?? "";
      if (!cleaned) continue;
      const targetA = join(root, cleaned);
      const targetB = join(root, cleaned, "index.html");
      const targetC = `${join(root, cleaned)}.html`;
      const ok =
        (await exists(targetA)) || (await exists(targetB)) || (await exists(targetC));
      if (!ok) {
        console.error(`✗ ${file} → broken internal link: ${href}`);
        bad++;
      }
    }
  }
} catch (err) {
  console.error("audit-links: cannot walk out/ — run `bun run build` first.");
  console.error(err);
  process.exit(2);
}

const ms = Date.now() - startedAt;
console.log(
  `audit-links: scanned ${pages} pages, checked ${checked} internal links (${ms}ms).`,
);
if (bad > 0) {
  console.error(`✗ ${bad} broken internal links.`);
  process.exit(1);
}
console.log("✓ All internal links resolve.");
