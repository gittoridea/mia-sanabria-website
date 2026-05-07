#!/usr/bin/env bun
/**
 * Greps the static export for stale-brokerage residue and pre-launch defects.
 * Exits 1 on any hit. Run after `bun run build`.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const FORBIDDEN = [
  "Klein Morgan",
  "kleinmorgan",
  "msanabriarea@gmail.com",
  "[Legal Brokerage Name]",
  "[Privacy Email]",
  "sunandbreeze",
  "accessibility@agent3000.com",
  "FLorida",
];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && /\.(html|xml|txt|json|webmanifest)$/.test(entry.name)) yield path;
  }
}

const root = "out";
let hits = 0;
const startedAt = Date.now();
try {
  for await (const file of walk(root)) {
    const content = await readFile(file, "utf8");
    for (const term of FORBIDDEN) {
      if (content.includes(term)) {
        const line = content
          .split("\n")
          .findIndex((l) => l.includes(term));
        console.error(`✗ ${file}:${line + 1}  contains forbidden term: "${term}"`);
        hits++;
      }
    }
  }
} catch (err) {
  console.error(`audit-stale-terms: cannot read ${root}/ — did you run \`bun run build\`?`);
  console.error(err);
  process.exit(2);
}

const ms = Date.now() - startedAt;
if (hits > 0) {
  console.error(`\n✗ ${hits} stale-term hits across the build. (${ms}ms)`);
  process.exit(1);
} else {
  console.log(`✓ audit-stale-terms: clean across ${root}/. (${ms}ms)`);
}
