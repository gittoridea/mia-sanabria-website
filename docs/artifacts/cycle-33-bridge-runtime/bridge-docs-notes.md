# Cycle 33 — Bridge Docs Notes

**Date:** 2026-05-14
**Sources consulted:**
- `https://bridgedataoutput.com/docs/platform/` (JS-rendered; extracted via JS bundle parse + targeted curl probes)
- `https://bridgedataoutput.com/docs.bundle.js` (docs SPA bundle — extracted text from Vue renderer)
- Live API probe: `api.bridgedataoutput.com` with public docs demo token (intentionally public in docs JS CONF block)

## API Discovery

### Base URL
```
https://api.bridgedataoutput.com/api/v2/OData/{dataset_id}/
```

### Authentication
- **Method:** `?access_token=TOKEN` query parameter (documented + verified)
- Also accepts `Authorization: Bearer TOKEN` header
- RETS API: Client ID + Client Secret as username/password

### Token Types (from Bridge docs)

| Token | Documented Use |
|-------|----------------|
| **Client ID** | Account identifier |
| **Client Secret** | Used in generation of both Server and Browser tokens; regenerating expires all child tokens |
| **Server Token** | "Use as the bearer token for API requests" — server-side use |
| **Browser Token** | "Used for websites that may query the API directly from the browser; be sure to set the Referrer Domain if you use this approach" |

**Critical:** Bridge explicitly documents the Browser Token for direct browser queries. The Referrer Domain restriction in the Bridge dashboard limits which domains may use the browser token.

### CORS Policy
- **Behavior:** Reflective — Bridge echoes the request `Origin` back as `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS`
- This means any origin can technically make CORS requests; security relies on Referrer Domain restriction in the Bridge dashboard
- Verified via OPTIONS preflight and GET with Origin header

### IDX Endpoint (key finding)
```
https://api.bridgedataoutput.com/api/v2/OData/{dataset_id}/idx/Properties
```
- The `/idx/` path prefix filters results to IDX-license-appropriate records and fields
- IDX-specific field rules: `/api/v2/OData/{dataset_id}/idx/Field`
- Dataset replication endpoint: `/api/v2/OData/{dataset_id}/Property/replication`

### Resources Confirmed
- `Properties` (OData singular: `Properties`)
- `Members`
- `Offices`
- `DataSystem` (metadata/data-system info)

### OData Parameters Confirmed
| Param | Description | Example |
|-------|-------------|---------|
| `$top` | Page size | `$top=200` (docs example; tested `$top=1`) |
| `$skip` | Offset | `$skip=200` |
| `$select` | Field whitelist | `$select=LivingArea` |
| `$unselect` | Field exclusion | `$unselect=Media` |
| `$filter` | OData filter expression | `$filter=ListPrice gt 100000` |
| `$orderby` | Sort | `$orderby=ListPrice desc` |
| `$expand` | Related entity expand | `$expand=ListOffice` |
| `$count` | Include total count | `$count=true` |

### Rate Limits (from docs)
- **Hourly:** 5,000 requests per hour (default; can be raised on request)
- **Burst:** 1/15 of hourly per minute = ~333 requests/minute
- Rate limit headers in every response: `Application-RateLimit-Limit`, `Application-RateLimit-Remaining`, `Application-RateLimit-Reset`, `Burst-RateLimit-Limit`, `Burst-RateLimit-Remaining`, `Burst-RateLimit-Reset`
- Test token (docs demo) showed 100,000/hr — that is the docs demo token's elevated limit

### Cache-Control on Responses
- `Cache-Control: max-age=10` observed on test probes

### Attribution
- No Bridge-specific attribution text found in docs bundle
- IDX display attribution (MLS disclaimer, brokerage, EHO) is governed by the MLS license (SEF MLS for this dataset), not by Bridge itself
- Bridge passes through IDX rules in the `/idx/` endpoint filtering

## Env Var Name Mapping

The mission brief expected different env var names than the existing repo. Mapping:

| Mission brief name | Repo canonical name (bridge.ts) | Notes |
|---|---|---|
| `BRIDGE_CLIENT_ID` | `BRIDGE_CLIENT_ID` | Same |
| `BRIDGE_CLIENT_SECRET` | `BRIDGE_SECRET_ID` | Repo uses `BRIDGE_SECRET_ID` |
| `BRIDGE_BROWSER_TOKEN` | `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | Repo uses NEXT_PUBLIC_ prefix (required for Next.js client bundle) |
| `BRIDGE_SERVER_TOKEN` | `BRIDGE_SERVER_TOKEN` | Same |
| `BRIDGE_DATASET_ID` | `BRIDGE_DATASET_NAME` | Repo used "NAME"; Cycle 33 adds `NEXT_PUBLIC_BRIDGE_DATASET_ID` |

## Live API Probe Summary

| Probe | Method | Result |
|-------|--------|--------|
| Root endpoint | GET /api/v2/ | 400 Bad Request |
| Dataset=test, Property | GET /api/v2/test/Property | 404 Not Found (test dataset has no real data) |
| OData Property | GET /api/v2/OData/test/Property | 404 Not Found (test dataset) |
| CORS probe with Origin | GET (with Origin: https://miasanabria.com) | 200 OK, access-control-allow-origin: https://miasanabria.com |
| OPTIONS preflight | OPTIONS (Origin: https://example.com) | access-control-allow-origin: https://example.com (reflective) |

All probes used the public docs demo token (`CONF.docs_test_dataset_access_token` — intentionally public in the Bridge docs JS). The "test" dataset does not contain real property data. No customer credentials were used in any probe.

## Caveats

- The `$top` maximum is not explicitly stated in extracted docs; `$top=200` appears in examples. Recommend capping at 12 per page for IDX display use case.
- IDX compliance rules (display restrictions, sold data timing, address display) are governed by the MLS license agreement, not by Bridge API itself. Counsel review remains required before live IDX display.
- Referrer Domain MUST be set in Bridge dashboard before browser token is safe for production use.
