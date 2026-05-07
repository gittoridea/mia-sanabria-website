#!/usr/bin/env bun
/**
 * Extracts every JSON-LD <script> from the static build, validates it parses
 * as JSON, and confirms minimal schema.org structure. Exits 1 on any failure.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield path;
  }
}

const SCRIPT_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

let total = 0;
let bad = 0;
let pages = 0;

const startedAt = Date.now();
try {
  for await (const file of walk("out")) {
    pages++;
    const content = await readFile(file, "utf8");
    for (const m of content.matchAll(SCRIPT_RE)) {
      total++;
      const raw = m[1] ?? "";
      try {
        const parsed = JSON.parse(raw);
        if (!parsed["@context"] || !parsed["@type"]) {
          console.error(`✗ ${file}: JSON-LD missing @context or @type`);
          bad++;
        }
      } catch (e) {
        console.error(`✗ ${file}: JSON-LD parse failure: ${(e as Error).message}`);
        bad++;
      }
    }
  }
} catch (err) {
  console.error("audit-schema: cannot walk out/ — run `bun run build` first.");
  console.error(err);
  process.exit(2);
}

const ms = Date.now() - startedAt;
console.log(
  `audit-schema: scanned ${pages} pages, found ${total} JSON-LD blocks (${ms}ms).`,
);
if (bad > 0) {
  console.error(`✗ ${bad} JSON-LD failures.`);
  process.exit(1);
}
console.log("✓ All JSON-LD blocks parse with @context + @type.");
