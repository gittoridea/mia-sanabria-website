/**
 * Bridge Data Output IDX integration — scaffold only.
 *
 * Provider: Bridge Data Output (`bridgedataoutput.com/docs/platform/`)
 * Mia confirmed Bridge as the IDX provider on 2026-05-13 (live meeting).
 *
 * ─── STATIC-EXPORT BLOCKER ──────────────────────────────────────────────
 * This Next.js app is configured for static export (`next.config.ts`),
 * which removes the Node.js runtime that Bridge server tokens require.
 * There is no Next.js API route, no serverless function, and no Node
 * middleware in the current architecture that can safely hold the
 * `BRIDGE_SERVER_TOKEN` or `BRIDGE_SECRET_ID`.
 *
 * Until a secure server runtime is decided + provisioned, this module
 * MUST NOT call Bridge. It exists to:
 *   1. Centralize the env-var names the future secure caller will read,
 *   2. Document the safe architecture options for the integration cycle,
 *   3. Provide a typed shape for the eventual response sanitization layer.
 *
 * ─── SAFE ARCHITECTURE OPTIONS ─────────────────────────────────────────
 * Pick one before wiring:
 *
 *   A. **Edge function in front of static export** — Cloudflare Worker,
 *      Vercel Edge Function, or Dokploy Node sidecar at a path like
 *      `/api/bridge/*` holds the server token, calls Bridge, sanitizes
 *      response, returns JSON. Site fetches that proxy URL with no
 *      secret material in the browser bundle.
 *
 *   B. **Drop static export for IDX routes** — switch the listings /
 *      property-detail routes to Next.js Server Components (or App
 *      Router server actions), keeping the rest of the site statically
 *      exported. Server-side calls Bridge directly. Requires Dokploy
 *      runtime change.
 *
 *   C. **Browser-safe public Bridge endpoints only** — if Bridge docs
 *      explicitly authorize the browser token against the specific
 *      dataset endpoints in use, the browser token may ship in
 *      NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN. Server token NEVER ships
 *      client-side under any option.
 *
 * ─── ENV CONTRACT ──────────────────────────────────────────────────────
 * The following env var names are reserved for the future caller. They
 * are NOT read in this module. Their values must NEVER appear in this
 * repo, in chat output, in screenshots, in build logs, or in commit
 * messages. They live in `~/.claude/.env` (or the equivalent secrets
 * surface for the chosen runtime).
 *
 *   BRIDGE_CLIENT_ID                 # account identifier
 *   BRIDGE_SECRET_ID                 # SERVER-ONLY — never ship client-side
 *   BRIDGE_SERVER_TOKEN              # SERVER-ONLY — never ship client-side
 *   NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN # browser token — Bridge docs permit browser use
 *   NEXT_PUBLIC_BRIDGE_DATASET_ID    # dataset identifier — baked into client bundle
 *   BRIDGE_DATASET_NAME              # legacy name (prefer NEXT_PUBLIC_BRIDGE_DATASET_ID)
 *
 * ─── COMPLIANCE INTERSECTIONS ──────────────────────────────────────────
 * Bridge IDX flows interact with:
 *   - SEF MLS reciprocity / IDX disclaimer language (CATO-05)
 *   - F.S. 475.278 brokerage-relationship statutory text (CATO-02)
 *   - TCPA PEWC consent on any contact-form post-search (CATO-01)
 *   - GA4 + cookie / consent treatment if listings interaction is tracked
 * Counsel review remains an external blocker before flipping the switch.
 */

/**
 * Public-side feature flag.
 * Cycle 33B (2026-05-14): flipped true with Browser Token runtime (Option D).
 * Cycle 37 (2026-05-15): when credentials are absent at build time, the
 * BridgeSearch component renders bundled fixture listings with a DEMO
 * banner + DEMO badges + IDX/MLS disclosure; the legacy MLS Matrix iframe
 * fallback was removed from runtime. Rollback path: flip this back to
 * false and redeploy (BridgeSearch will still render fixtures with banner).
 */
export const BRIDGE_INTEGRATION_LIVE = true as const;

/** Provider documentation pointer for future maintainers. */
export const BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/" as const;

/**
 * Env-var name registry. Read by the future secure caller; this module
 * intentionally does NOT call process.env at this scaffold stage so the
 * static build never touches these names.
 */
export const BRIDGE_ENV_NAMES = {
  clientId: "BRIDGE_CLIENT_ID",
  secretId: "BRIDGE_SECRET_ID",
  serverToken: "BRIDGE_SERVER_TOKEN",
  browserToken: "NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN",
  datasetId: "NEXT_PUBLIC_BRIDGE_DATASET_ID",
  datasetName: "BRIDGE_DATASET_NAME",
} as const;

/** Bridge API base URL (v2 OData). */
export const BRIDGE_API_BASE =
  "https://api.bridgedataoutput.com/api/v2/OData" as const;

/** IDX-filtered Properties endpoint suffix. Append /{dataset_id}/idx/Properties. */
export const BRIDGE_IDX_RESOURCE = "idx/Properties" as const;

/**
 * Sanitized listing shape — what the future server-side proxy returns to
 * the browser. NEVER includes raw Bridge response fields that may leak
 * pricing model internals, exclusive-access data, or PII.
 */
export type SanitizedListing = Readonly<{
  mlsNumber: string;
  city: string;
  state: "FL";
  zip: string;
  beds: number;
  baths: number;
  listPrice: number;
  /** Public photo URL; sanitized to authorized CDN host only. */
  primaryPhotoUrl: string | null;
  /** Free-text status, normalized: "active" | "pending" | "closed". */
  status: "active" | "pending" | "closed";
  /** ISO date. */
  listDate: string;
}>;

/**
 * Search-input shape — the visual hero search box collects these criteria
 * and posts to the future proxy. None of these reach Bridge until the
 * runtime decision is made.
 */
export type ListingSearchCriteria = Readonly<{
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  status?: "active" | "pending" | "closed";
}>;
