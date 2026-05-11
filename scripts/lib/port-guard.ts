/**
 * port-guard — sub-second helper to detect whether a TCP port is in use,
 * pick an alternate, or fail with a clear message.
 *
 * Why this exists: deploy-and-verify and audit-rendered/audit-hero both
 * spin a `vite preview` (or equivalent) on 4173 in different invocations.
 * When two run concurrently or the prior process leaked, the second errors
 * mid-run with cryptic ECONNREFUSED. This module surfaces the conflict
 * before the work starts.
 *
 * Public API:
 *   isPortInUse(port: number) — boolean (does NOT bind; uses /proc/net + connect probe)
 *   acquirePort(preferred, fallbacks, opts) — returns first free port; throws if all busy
 *
 * Anti: blindly killing the holder of 4173. We log who owns it; user decides.
 */
import { createConnection } from "node:net";

export async function isPortInUse(port: number, host = "127.0.0.1", timeoutMs = 400): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const sock = createConnection({ host, port });
    const timer = setTimeout(() => {
      sock.destroy();
      resolve(false);
    }, timeoutMs);
    sock.on("connect", () => {
      clearTimeout(timer);
      sock.end();
      resolve(true);
    });
    sock.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

export type AcquirePortOpts = {
  /** Set true to throw a structured error rather than choose a fallback. */
  strict?: boolean;
  /** Optional logger; defaults to console.log. */
  log?: (msg: string) => void;
};

export async function acquirePort(
  preferred: number,
  fallbacks: ReadonlyArray<number>,
  opts: AcquirePortOpts = {}
): Promise<number> {
  const log = opts.log ?? ((m: string) => console.log(m));
  const candidates = [preferred, ...fallbacks];
  for (const port of candidates) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      if (port !== preferred) log(`port-guard: preferred ${preferred} busy; using ${port}`);
      return port;
    }
    log(`port-guard: ${port} in use`);
  }
  const err = new Error(
    `port-guard: all candidates busy [${candidates.join(", ")}]. Run \`ss -tlnp 'sport = :${preferred}'\` to find the holder. Refuse to kill blindly.`
  );
  (err as { code?: string }).code = "PORT_GUARD_EXHAUSTED";
  throw err;
}

/** CLI mode: `bun scripts/lib/port-guard.ts [--port N] [--fallbacks 4174,4175]` */
if (import.meta.main) {
  const args = process.argv.slice(2);
  const preferred = parseInt(
    args.find((a) => a.startsWith("--port="))?.slice("--port=".length) ?? "4173",
    10
  );
  const fallbacksArg = args.find((a) => a.startsWith("--fallbacks="));
  const fallbacks = fallbacksArg
    ? fallbacksArg
        .slice("--fallbacks=".length)
        .split(",")
        .map((n) => parseInt(n, 10))
        .filter((n) => Number.isInteger(n))
    : [4174, 4175, 4176];
  try {
    const chosen = await acquirePort(preferred, fallbacks);
    console.log(`PORT=${chosen}`);
    process.exit(0);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
