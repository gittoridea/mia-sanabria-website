#!/usr/bin/env bun
/**
 * audit-no-old-idx — fails if the legacy MLS Matrix / old-IDX runtime
 * fallback re-appears in source or built output.
 *
 * Allowed: IDX/MLS disclosure copy required for compliance, Bridge Data Output
 * references, historical archived artifacts.
 *
 * Forbidden: MlsMatrix*, MatrixFallback, sef.mlsmatrix.com, idxbroker,
 * ihomefinder, flexmls, showcaseidx, legacy IDX provider iframes.
 *
 * Scans:
 *   - src/                                     (runtime source)
 *   - public/                                  (static assets shipped)
 *   - out/                                     (built output, if present)
 *   - .next/                                   (build cache, if present)
 *
 * Outputs: reports/audit-no-old-idx.md, reports/audit-no-old-idx.json.
 * Exit 0 on no findings, exit 1 on any FAIL.
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const REPO = process.cwd();
const REPORTS = join(REPO, "reports");

const SCAN_ROOTS = ["src", "public", "out", ".next"];
const SCAN_FILES = ["Caddyfile", "Dockerfile", "next.config.ts"];
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".html",
  ".css",
  ".json",
  ".svg",
  ".md",
  ".mdx",
  ".txt",
]);
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "tsconfig.tsbuildinfo",
  "cache",
]);

type Finding = {
  file: string;
  line: number;
  match: string;
  rule: string;
};

const FORBIDDEN: ReadonlyArray<{ rule: string; pattern: RegExp }> = [
  { rule: "MlsMatrixFallback-component", pattern: /MlsMatrixFallback/g },
  { rule: "MlsMatrix-symbol", pattern: /\bMlsMatrix\b/g },
  { rule: "MatrixFallback-symbol", pattern: /\bMatrixFallback\b/g },
  { rule: "MlsMatrix-host", pattern: /sef\.mlsmatrix\.com/gi },
  { rule: "matrix-idx-search-path", pattern: /Matrix\/Public\/IDXSearch/gi },
  { rule: "idxbroker-provider", pattern: /\bidxbroker\b/gi },
  { rule: "ihomefinder-provider", pattern: /\bihomefinder\b/gi },
  { rule: "flexmls-provider", pattern: /\bflexmls\b/gi },
  { rule: "showcaseidx-provider", pattern: /\bshowcaseidx\b/gi },
  { rule: "legacy-idx-iframe-attr", pattern: /<iframe[^>]+matrix/gi },
];

const ALLOW_PATH_PREFIXES = [
  "docs/artifacts/cycle-1",
  "docs/artifacts/cycle-2",
  "docs/artifacts/cycle-30",
  "docs/artifacts/cycle-33",
  "docs/artifacts/cycle-34",
  "docs/artifacts/cycle-35",
  "docs/artifacts/cycle-36",
  "docs/artifacts/cycle-37-neighborhood-images-bridge-idx",
  "docs/CYCLE_",
  "docs/mia-client-decision-record.md",
  "ISA.md",
];

function isAllowedPath(rel: string): boolean {
  return ALLOW_PATH_PREFIXES.some((p) => rel.startsWith(p));
}

async function walk(root: string, acc: string[]): Promise<void> {
  let names: string[];
  try {
    names = await readdir(root);
  } catch {
    return;
  }
  for (const name of names) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const full = join(root, name);
    let s: Awaited<ReturnType<typeof stat>>;
    try {
      s = await stat(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      await walk(full, acc);
    } else if (s.isFile()) {
      const dot = name.lastIndexOf(".");
      const ext = dot >= 0 ? name.slice(dot) : "";
      if (TEXT_EXTENSIONS.has(ext)) acc.push(full);
    }
  }
}

async function scanFile(file: string): Promise<Finding[]> {
  const findings: Finding[] = [];
  let body: string;
  try {
    const s = await stat(file);
    if (s.size > 5_000_000) return [];
    body = await readFile(file, "utf8");
  } catch {
    return [];
  }
  const lines = body.split("\n");
  for (const { rule, pattern } of FORBIDDEN) {
    pattern.lastIndex = 0;
    if (!pattern.test(body)) continue;
    pattern.lastIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      if (ln === undefined) continue;
      const local = new RegExp(pattern.source, pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = local.exec(ln))) {
        findings.push({
          file: relative(REPO, file),
          line: i + 1,
          match: m[0],
          rule,
        });
        if (m.index === local.lastIndex) local.lastIndex++;
      }
    }
  }
  return findings;
}

async function main() {
  await mkdir(REPORTS, { recursive: true });
  const files: string[] = [];
  for (const root of SCAN_ROOTS) {
    await walk(join(REPO, root), files);
  }
  for (const f of SCAN_FILES) {
    const full = join(REPO, f);
    try {
      const s = await stat(full);
      if (s.isFile()) files.push(full);
    } catch {
      // file absent — skip
    }
  }
  const allFindings: Finding[] = [];
  for (const f of files) {
    const rel = relative(REPO, f);
    if (isAllowedPath(rel)) continue;
    const got = await scanFile(f);
    for (const g of got) allFindings.push(g);
  }

  const json = {
    generated_at: new Date().toISOString(),
    scanned_files: files.length,
    findings: allFindings,
    pass: allFindings.length === 0,
  };
  await writeFile(
    join(REPORTS, "audit-no-old-idx.json"),
    JSON.stringify(json, null, 2)
  );

  const md: string[] = [];
  md.push("# audit-no-old-idx");
  md.push("");
  md.push(`Generated: ${json.generated_at}`);
  md.push(`Scanned files: ${json.scanned_files}`);
  md.push(`Findings: ${allFindings.length}`);
  md.push(`Pass: ${json.pass}`);
  md.push("");
  if (allFindings.length === 0) {
    md.push("PASS — no legacy IDX runtime markers found in src/, public/, out/, .next/.");
  } else {
    md.push("FAIL — legacy IDX runtime markers must be removed.");
    md.push("");
    md.push("| File | Line | Rule | Match |");
    md.push("|------|------|------|-------|");
    for (const f of allFindings) {
      md.push(`| ${f.file} | ${f.line} | ${f.rule} | \`${f.match}\` |`);
    }
  }
  await writeFile(join(REPORTS, "audit-no-old-idx.md"), md.join("\n"));

  if (!json.pass) {
    console.error(
      `audit-no-old-idx: FAIL — ${allFindings.length} legacy IDX marker${allFindings.length !== 1 ? "s" : ""} found`
    );
    for (const f of allFindings.slice(0, 20)) {
      console.error(`  ${f.file}:${f.line} [${f.rule}] ${f.match}`);
    }
    process.exit(1);
  }
  console.log(`audit-no-old-idx: PASS (${files.length} files scanned)`);
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
