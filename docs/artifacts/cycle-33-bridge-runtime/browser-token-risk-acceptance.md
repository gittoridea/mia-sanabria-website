# Cycle 33 — Browser Token Risk Acceptance

**Required artifact for Option D selection.**
**Date:** 2026-05-14
**Prepared by:** Claude Code (Jarvis) — Cycle 33 Bridge Runtime Mission

## Bridge Doc Basis

From `https://bridgedataoutput.com/docs.bundle.js` (Bridge platform docs, extracted 2026-05-14):

> "Browser Token — Used for websites that may query the API directly from the browser; be sure to set the Referrer Domain if you use this approach."

This is the sole documented token type explicitly intended for browser (client-side) use. The Server Token is documented only as "Use as the bearer token for API requests" (server-side context). The Browser Token is a distinct credential intended for exactly this use case.

## Why Browser Token Is Not Equivalent to Server Token

| Property | Server Token | Browser Token |
|---|---|---|
| Intended runtime | Server-side only | Browser / public websites |
| Visible in browser network panel? | Must not be | Yes — by design |
| Referrer Domain restriction | N/A (not used in browser) | **Must be set** — limits which domains can use the token |
| Can access non-IDX data? | Yes (based on license) | Restricted per Bridge token policy |
| Token rotation | Regenerating Client Secret expires it | Regenerating Client Secret expires it |
| Placement in Next.js | Never (BRIDGE_SERVER_TOKEN without NEXT_PUBLIC_) | NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN — baked into client bundle |

## Allowed Origin Restrictions

Bridge provides a "Referrer Domain" configuration in the Bridge dashboard. When set, the browser token only accepts requests that include a matching `Referer` header. Before production use, Torrey must:

1. Log in to the Bridge dashboard
2. Set Referrer Domain to `miasanabria.com` (and optionally `www.miasanabria.com` and the staging subdomain)
3. This restricts the browser token so it cannot be used from arbitrary third-party sites

**Pre-production gate:** If Referrer Domain is not set, any site that discovers the browser token value (e.g., from browser dev tools) can make Bridge API calls. This is mitigated by setting the Referrer Domain before the site is publicly accessible.

## CORS Behavior

Bridge uses reflective CORS — it echoes the request `Origin` back as `Access-Control-Allow-Origin`. This means the API accepts cross-origin browser requests from any domain. The Referrer Domain restriction is the primary access control for browser tokens, not CORS. CORS behavior was verified via live probe on 2026-05-14.

## Data and Query Abuse Potential

With a browser token visible in dev tools or network panel:
- An attacker could make read-only Bridge API calls to the IDX endpoint
- They could paginate through available IDX listings (public MLS data already intended for IDX display)
- They cannot write, update, or delete MLS data (Bridge API is read-only for IDX consumers)
- They cannot access non-IDX data unless the token's Referrer Domain restriction is bypassed
- Rate limits apply: 5,000 requests/hour default

**Risk:** Low — the IDX data is inherently intended for public display. The browser token provides read-only access to the same data that IDX displays are designed to show publicly.

## Why This Is Acceptable

1. Bridge explicitly designed the Browser Token for this use case
2. IDX data is by nature publicly displayable per MLS IDX rules (subject to attribution/display compliance)
3. Referrer Domain restriction will be set before production (Torrey action required)
4. Read-only access only — no mutation risk
5. Rate limiting limits scraping abuse
6. The alternative (Option C / Worker proxy) adds deployment complexity without materially reducing risk for public IDX data

## Rollback Path

If the browser token is compromised or if Bridge changes its policy:
1. Torrey regenerates the Browser Token in the Bridge dashboard (immediately invalidates old token)
2. Torrey updates `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` in Dokploy build args
3. Redeploy
4. Or: set `BRIDGE_INTEGRATION_LIVE = false` in `src/lib/bridge.ts` → redeploy → falls back to MLS Matrix iframe

## Operator Sign-off Required Before Production

This risk acceptance document is prepared by Claude Code. It is NOT an operator approval. Before setting `BRIDGE_INTEGRATION_LIVE = true`:

- [ ] Torrey has read and accepted this risk analysis
- [ ] Torrey has set Referrer Domain in Bridge dashboard
- [ ] Torrey has placed `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` in Dokploy build args (no value in repo or chat)
- [ ] Torrey has placed `NEXT_PUBLIC_BRIDGE_DATASET_ID` in Dokploy build args
- [ ] Counsel has reviewed IDX display rules and attribution text
- [ ] At least one live smoke test has returned real IDX listings
