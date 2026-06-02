#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { rename, stat, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import {
  ALL_MARKET_SLUGS,
  MIA_CYCLE_40B_VERSIONED_SLUGS,
} from "../src/lib/mia";

const vipsLib = join(process.cwd(), "node_modules/@img/sharp-libvips-linux-x64/lib");
if (existsSync(vipsLib)) {
  process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
    ? `${vipsLib}:${process.env.LD_LIBRARY_PATH}`
    : vipsLib;
}
const sharp = (await import("sharp")).default;

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const QUALITY_ATTEMPTS = [82, 84, 86, 88, 90, 92] as const;
const MIN_SAFETY_BYTES = 90_000;
const CYCLE_40B_MARKET_BYTES = 150_000;
const OTHER_MARKET_GATE_BYTES = 80_000;
const HOME_HERO_GATE_BYTES = 90_000;
const MARKET_MIN_WIDTH = 1200;
const MARKET_MIN_HEIGHT = 1500;
const HOME_MIN_WIDTH = 1200;
const HOME_MIN_HEIGHT = 1000;
const MAX_WIDTH = 1800;

type ImageClass = "market-cycle40b" | "market" | "home";
type TargetImage = {
  relPath: string;
  absPath: string;
  imageClass: ImageClass;
};
type Dimensions = { width: number; height: number };
type Candidate = {
  buffer: Buffer;
  bytes: number;
  dimensions: Dimensions;
  quality: number;
};
type OptimizeStatus =
  | { kind: "written"; savedBytes: number }
  | { kind: "skipped"; reason: string };
type OptimizeResult = {
  target: TargetImage;
  beforeBytes: number;
  beforeDimensions: Dimensions;
  afterBytes: number;
  afterDimensions: Dimensions;
  status: OptimizeStatus;
  errored: boolean;
};
type Summary = {
  processed: number;
  written: number;
  skipped: number;
  errored: number;
  beforeBytes: number;
  afterBytes: number;
};

function parseArgs(argv: readonly string[]): { dryRun: boolean } {
  let dryRun = false;
  for (const arg of argv.slice(2)) {
    if (arg === "--dry-run") {
      dryRun = true;
    } else {
      console.error(`Ignoring unknown argument: ${arg}`);
    }
  }
  return { dryRun };
}

function targetList(): TargetImage[] {
  const targets: TargetImage[] = ALL_MARKET_SLUGS.map((slug) => {
    const suffix = MIA_CYCLE_40B_VERSIONED_SLUGS.has(slug) ? "-cycle40b" : "";
    const imageClass: ImageClass = MIA_CYCLE_40B_VERSIONED_SLUGS.has(slug)
      ? "market-cycle40b"
      : "market";
    const relPath = `public/markets/${slug}${suffix}.jpg`;
    return {
      relPath,
      absPath: join(REPO, relPath),
      imageClass,
    };
  });

  targets.push({
    relPath: "public/hero/mia-home-hero-cycle40b.jpg",
    absPath: join(REPO, "public/hero/mia-home-hero-cycle40b.jpg"),
    imageClass: "home",
  });

  return targets;
}

function effectiveFloorBytes(target: TargetImage): number {
  const gateFloorBytes =
    target.imageClass === "market-cycle40b"
      ? CYCLE_40B_MARKET_BYTES
      : target.imageClass === "market"
        ? OTHER_MARKET_GATE_BYTES
        : HOME_HERO_GATE_BYTES;
  return Math.max(MIN_SAFETY_BYTES, gateFloorBytes);
}

async function fileBytes(path: string): Promise<number> {
  return (await stat(path)).size;
}

async function imageDimensions(pathOrBuffer: string | Buffer): Promise<Dimensions> {
  const metadata = await sharp(pathOrBuffer).metadata();
  const { width, height } = metadata;
  if (typeof width !== "number" || typeof height !== "number") {
    throw new Error("sharp metadata did not include width and height");
  }
  return { width, height };
}

function dimensionsAfterAllowedResize(original: Dimensions, target: TargetImage): Dimensions {
  if (original.width <= MAX_WIDTH) return original;

  const scaledHeight = Math.round((original.height * MAX_WIDTH) / original.width);
  const resized = { width: MAX_WIDTH, height: scaledHeight };
  const floor = dimensionFloor(target);
  if (resized.width < floor.width || resized.height < floor.height) return original;
  return resized;
}

function dimensionFloor(target: TargetImage): Dimensions {
  if (target.imageClass === "market" || target.imageClass === "market-cycle40b") {
    return { width: MARKET_MIN_WIDTH, height: MARKET_MIN_HEIGHT };
  }
  return { width: HOME_MIN_WIDTH, height: HOME_MIN_HEIGHT };
}

function outputDimensionsAreValid(
  target: TargetImage,
  original: Dimensions,
  output: Dimensions,
): boolean {
  const floor = dimensionFloor(target);
  if (output.width < floor.width || output.height < floor.height) return false;
  if (original.width <= MAX_WIDTH) {
    return output.width === original.width && output.height === original.height;
  }
  const resized = dimensionsAfterAllowedResize(original, target);
  return output.width === resized.width && output.height === resized.height;
}

async function recompressCandidate(
  target: TargetImage,
  originalDimensions: Dimensions,
  quality: number,
): Promise<Candidate> {
  const expectedDimensions = dimensionsAfterAllowedResize(originalDimensions, target);
  let pipeline = sharp(target.absPath);
  if (expectedDimensions.width !== originalDimensions.width) {
    pipeline = pipeline.resize({
      width: expectedDimensions.width,
      withoutEnlargement: true,
    });
  }
  const buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  return {
    buffer,
    bytes: buffer.byteLength,
    dimensions: await imageDimensions(buffer),
    quality,
  };
}

async function bestCandidate(
  target: TargetImage,
  originalBytes: number,
  originalDimensions: Dimensions,
): Promise<{ candidate: Candidate | null; skipReason: string | null }> {
  const floorBytes = effectiveFloorBytes(target);
  let smallerButBelowFloor = false;

  for (const quality of QUALITY_ATTEMPTS) {
    const candidate = await recompressCandidate(target, originalDimensions, quality);
    if (!outputDimensionsAreValid(target, originalDimensions, candidate.dimensions)) {
      return {
        candidate: null,
        skipReason: `output dimensions invalid at q=${candidate.quality}`,
      };
    }
    if (candidate.bytes >= originalBytes) {
      return { candidate: null, skipReason: "not smaller" };
    }
    if (candidate.bytes >= floorBytes) {
      return { candidate, skipReason: null };
    }
    smallerButBelowFloor = true;
  }

  if (smallerButBelowFloor) {
    return { candidate: null, skipReason: "cannot meet floor at q<=92" };
  }
  return { candidate: null, skipReason: "not smaller" };
}

function tempPathFor(target: TargetImage): string {
  const name = basename(target.absPath);
  const nonce = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return join(dirname(target.absPath), `.${name}.${nonce}.tmp`);
}

async function removeTempFile(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`failed to clean temp file ${path}: ${reason}`);
  }
}

async function writeAtomically(
  target: TargetImage,
  candidate: Candidate,
  originalDimensions: Dimensions,
): Promise<void> {
  const tmpPath = tempPathFor(target);
  try {
    await writeFile(tmpPath, candidate.buffer);
    const tmpBytes = await fileBytes(tmpPath);
    const tmpDimensions = await imageDimensions(tmpPath);
    if (tmpBytes !== candidate.bytes) {
      throw new Error(`temp byte validation mismatch: ${tmpBytes} !== ${candidate.bytes}`);
    }
    if (!outputDimensionsAreValid(target, originalDimensions, tmpDimensions)) {
      throw new Error(`temp dimensions invalid: ${formatDimensions(tmpDimensions)}`);
    }
    await rename(tmpPath, target.absPath);
  } catch (error) {
    await removeTempFile(tmpPath);
    throw error;
  }
}

async function optimizeOne(target: TargetImage, dryRun: boolean): Promise<OptimizeResult> {
  const beforeBytes = await fileBytes(target.absPath);
  const beforeDimensions = await imageDimensions(target.absPath);
  const { candidate, skipReason } = await bestCandidate(target, beforeBytes, beforeDimensions);

  if (candidate === null) {
    return {
      target,
      beforeBytes,
      beforeDimensions,
      afterBytes: beforeBytes,
      afterDimensions: beforeDimensions,
      status: { kind: "skipped", reason: skipReason ?? "no valid candidate" },
      errored: false,
    };
  }

  if (!dryRun) {
    await writeAtomically(target, candidate, beforeDimensions);
  }

  return {
    target,
    beforeBytes,
    beforeDimensions,
    afterBytes: candidate.bytes,
    afterDimensions: candidate.dimensions,
    status: { kind: "written", savedBytes: beforeBytes - candidate.bytes },
    errored: false,
  };
}

async function fallbackBytesForError(target: TargetImage): Promise<number> {
  if (!existsSync(target.absPath)) return 0;
  try {
    return await fileBytes(target.absPath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`${target.relPath}: byte read after error failed: ${reason}`);
    return 0;
  }
}

async function fallbackDimensionsForError(target: TargetImage): Promise<Dimensions> {
  if (!existsSync(target.absPath)) return { width: 0, height: 0 };
  try {
    return await imageDimensions(target.absPath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`${target.relPath}: metadata read after error failed: ${reason}`);
    return { width: 0, height: 0 };
  }
}

function formatBytes(bytes: number): string {
  return `${bytes} (${(bytes / 1024).toFixed(1)} KB)`;
}

function formatDimensions(dimensions: Dimensions): string {
  return `${dimensions.width}x${dimensions.height}`;
}

function formatResultLine(result: OptimizeResult): string {
  const status =
    result.status.kind === "written"
      ? `WRITTEN saved ${(result.status.savedBytes / 1024).toFixed(1)} KB`
      : `SKIPPED ${result.status.reason}`;
  return [
    result.target.relPath,
    `${formatBytes(result.beforeBytes)} ${formatDimensions(result.beforeDimensions)}`,
    "->",
    `${formatBytes(result.afterBytes)} ${formatDimensions(result.afterDimensions)}`,
    `[${status}]`,
  ].join("  ");
}

function summarize(results: readonly OptimizeResult[]): Summary {
  let written = 0;
  let skipped = 0;
  let errored = 0;
  let beforeBytes = 0;
  let afterBytes = 0;

  for (const result of results) {
    beforeBytes += result.beforeBytes;
    afterBytes += result.afterBytes;
    if (result.errored) {
      errored += 1;
    } else if (result.status.kind === "written") {
      written += 1;
    } else {
      skipped += 1;
    }
  }

  return {
    processed: results.length,
    written,
    skipped,
    errored,
    beforeBytes,
    afterBytes,
  };
}

function printSummary(summary: Summary): void {
  const savedBytes = summary.beforeBytes - summary.afterBytes;
  const reduction =
    summary.beforeBytes > 0 ? (savedBytes / summary.beforeBytes) * 100 : 0;
  console.log(
    [
      "Summary:",
      `processed=${summary.processed}`,
      `written=${summary.written}`,
      `skipped=${summary.skipped}`,
      `errored=${summary.errored}`,
      `before=${formatBytes(summary.beforeBytes)}`,
      `after=${formatBytes(summary.afterBytes)}`,
      `saved=${formatBytes(savedBytes)}`,
      `reduction=${reduction.toFixed(1)}%`,
    ].join(" "),
  );
}

async function main(): Promise<void> {
  const { dryRun } = parseArgs(Bun.argv);
  if (dryRun) console.log("Dry run: no files will be written.");

  const results: OptimizeResult[] = [];
  for (const target of targetList()) {
    try {
      const result = await optimizeOne(target, dryRun);
      results.push(result);
      console.log(formatResultLine(result));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      const fallbackBytes = await fallbackBytesForError(target);
      const fallbackDimensions = await fallbackDimensionsForError(target);
      const result: OptimizeResult = {
        target,
        beforeBytes: fallbackBytes,
        beforeDimensions: fallbackDimensions,
        afterBytes: fallbackBytes,
        afterDimensions: fallbackDimensions,
        status: { kind: "skipped", reason: `error: ${reason}` },
        errored: true,
      };
      results.push(result);
      console.error(`${target.relPath}: error: ${reason}`);
      console.log(formatResultLine(result));
    }
  }

  const summary = summarize(results);
  printSummary(summary);
  if (summary.errored > 0) {
    process.exitCode = 1;
  }
}

await main();
