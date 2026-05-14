# Cycle 33B — Live Credentials + Hardening Report

**Date:** 2026-05-14
**Trigger:** Torrey provided Bridge API credentials in chat session; mission was "expertly apply" and get Bridge actively functional on Mia's dev site.

## Credentials state

All four Bridge credentials were applied as shell environment variables for this session only. Values are not written to any file in this repository at any point. **Note: because the credentials were pasted into chat, the values are now present in the session transcript and Anthropic API logs. Token rotation is strongly recommended before any long-lived production use** (see "Operator next steps" below).

| Credential | Test result |
|---|---|
| Client ID | Present — used only as identifier |
| Client Secret | Present — never referenced by any code in this repo |
| Server Token | Present — used only for DataSystem enumeration (read-only) |
| Browser Token | Present — verified working against `test_sf/Property` with Origin/Referer matching staging |

## Critical finding: SEF MLS feed is NOT provisioned

DataSystem enumeration via Server Token shows the Bridge account has only:

| Dataset ID | Name |
|---|---|
| `test_sd` | San Diego Test Dataset |
| `test_sf` | San Francisco Test Dataset |
| `test` | Static Test Vendor |

There is **no Southeast Florida MLS dataset** on this account. The IDX endpoint (`/idx/Properties`) returns 404 ("Feed type not found") on every test dataset — the IDX feed type is not provisioned. `FeedTypes: []` confirms no IDX/VOW license attached.

**This is the real production gate.** All code is correct; the data feed must be approved by SEF MLS and added to the Bridge account before Mia's site can show real Southeast Florida listings.

## What this cycle delivered

### Code

- `src/lib/bridge-client.ts`:
  - `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` env override (default `idx/Properties`, allowlisted to also accept `Property` for test datasets)
  - `NEXT_PUBLIC_BRIDGE_DEMO` flag — surfaces a clear "Demo Data — SEF MLS Feed Pending" banner and disables inquiry CTAs on cards
  - Media host allowlist (`cloudfront.net`, `amazonaws.com`, `bridgedataoutput.com`; extend via `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS`) — defense-in-depth against poisoned media URLs (Silas MEDIUM-1)
  - Operator-visible `console.warn` on non-OK Bridge response with status code (Silas MEDIUM-2)
  - `AbortController` wired through `searchListings()` (Silas MEDIUM-3)
- `src/components/bridge/BridgeSearch.tsx`:
  - In-flight request cancellation via `useRef<AbortController>` + cleanup on unmount
  - `DemoBanner` rendered when `BRIDGE_DEMO_MODE === true`
  - `ListingAttribution` rendered only in non-demo mode
- `src/components/bridge/BridgeListingCard.tsx`:
  - `demoMode` prop renders a "DEMO" badge overlay and disables the inquiry CTA
- `src/lib/bridge.ts`:
  - `BRIDGE_INTEGRATION_LIVE` flipped to `true`
- `Caddyfile`:
  - `connect-src` extended with `https://api.bridgedataoutput.com`

### Verification

- `bun run typecheck` — 0 errors
- `bun run lint` — 0 warnings
- `bun run build` — 61 pages, /home-search 5.59 kB
- `audit:stale` — clean
- `audit:no-fabrications` — 0 hits
- `audit:legal` — 18 PASS · 1 WARN (pre-existing USCO) · 0 FAIL
- `audit:route-inventory` — 48 routes reconcile
- `audit:schema` — 287 JSON-LD blocks valid
- `audit:about` — 12 PASS
- `audit:qa-gate` — critical 0 · high 4 (pre-existing legal-c5) · medium 1 (pre-existing) · low 56
- Build-output secret scan — no server token, no client secret, no browser token (since no creds in env on this rebuild), no client ID
- **Credentialed build secret scan** — server token & client secret absent from `out/`; browser token present in exactly 1 JS chunk file as designed by Bridge

### Live end-to-end test against `test_sf`

```
curl https://api.bridgedataoutput.com/api/v2/OData/test_sf/Property
  with Origin: https://miasanabriarealtor.trueidea.com
  with access_token=[browser token]
  $top=3&$filter=StandardStatus eq 'Active'&$select=...

Response: HTTP 200
@odata.count: 10000
listings returned: 3
all $select fields present
CORS: access-control-allow-origin: https://miasanabriarealtor.trueidea.com (reflected)
```

### Security review (Silas, parallel)

- 0 critical, 0 high, 3 medium, 1 low, 4 info findings
- All 3 medium findings addressed in this cycle (media host allowlist, error visibility, abort control)
- 1 low: `RESOURCE_PATH` allowlist — operator must ensure production Dokploy build args never set `Property` over `idx/Properties`. Captured in operator instructions below.

## Operator next steps (Torrey)

### 1. Rotate credentials (recommended — chat exposure)

Because the four credentials were typed into chat, they are in the session transcript. Rotate them in Bridge dashboard before relying on the current values for long-term production:

1. Bridge dashboard → API → Regenerate Client Secret (this invalidates the current Browser Token + Server Token; new tokens issue)
2. Capture the NEW Browser Token + Client Secret + Server Token via Bridge dashboard UI directly (do not paste into chat or repo)

### 2. Set Referrer Domain in Bridge dashboard

In Bridge dashboard for the API application, set Referrer Domain(s) to:
- `miasanabriarealtor.trueidea.com` (staging — for dev-site verification)
- `miasanabria.com` (final production canonical — for future cutover)
- `www.miasanabria.com`

Without Referrer Domain restriction, the browser token can be used from any site that discovers it in the JS bundle.

### 3. Provision SEF MLS feed on Bridge account (REAL BLOCKER)

This is the actual production-data blocker. Contact Bridge support and request the Southeast Florida MLS (SEF MLS) IDX feed be added to this account. Expected provisioning:

- Bridge will request IDX subscriber agreement copies (Mia's MLS membership)
- SEF MLS approves the IDX feed application
- Bridge adds a new dataset (e.g., `sef` or similar slug) to this account with `IDX` listed in `FeedTypes`
- Mia's IDX dataset ID will replace `test_sf` in Dokploy build args

### 4. Deploy to staging with demo mode (optional — visible proof of integration)

To make Bridge "actively functional on the dev site" before SEF MLS provisions, deploy with the test fixture clearly labeled as demo data:

In Dokploy → app `XJSRlvH-91ZtUsh0RPGvo` → Build Args, add:

```
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN = <newly-rotated browser token>
NEXT_PUBLIC_BRIDGE_DATASET_ID    = test_sf
NEXT_PUBLIC_BRIDGE_RESOURCE_PATH = Property
NEXT_PUBLIC_BRIDGE_DEMO          = true
```

Trigger redeploy. The site will show a clear demo banner and "DEMO" badges on each card so visitors cannot mistake test data for real Southeast Florida inventory.

### 5. Cut over to real SEF MLS feed (after step 3 lands)

When SEF MLS approves and Bridge adds the real dataset:

In Dokploy build args:
```
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN = <production browser token>
NEXT_PUBLIC_BRIDGE_DATASET_ID    = <real SEF dataset slug, e.g., "sef" or per Bridge>
# REMOVE NEXT_PUBLIC_BRIDGE_RESOURCE_PATH  (defaults to idx/Properties — the IDX-licensed path)
# REMOVE NEXT_PUBLIC_BRIDGE_DEMO          (defaults to false — full production UI, real attribution, working CTAs)
# Optionally add NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS if SEF photo CDN host differs from defaults
```

Redeploy. The site immediately serves real SEF MLS listings with full attribution text and working inquiry CTAs.

### 6. Counsel review

Before flipping demo mode off in production, counsel should review:
- IDX display rules from SEF MLS license
- Attribution text rendered by `ListingAttribution` component (currently: "Listing information is deemed reliable but not guaranteed. Data provided by Bridge Data Output via Southeast Florida MLS…")
- Brokerage attribution requirements
- TCPA PEWC consent on inquiry CTAs

## Rollback

If anything goes wrong:

```bash
# In src/lib/bridge.ts, flip:
export const BRIDGE_INTEGRATION_LIVE = true as const;
# to:
export const BRIDGE_INTEGRATION_LIVE = false as const;
git commit -am "fix: rollback Bridge IDX integration"
git push origin main
```

Or remove the four Dokploy build args and redeploy. Either path returns the page to MLS Matrix iframe fallback within one Dokploy build.
