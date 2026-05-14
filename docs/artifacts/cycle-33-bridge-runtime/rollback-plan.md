# Cycle 33 — Bridge IDX Rollback Plan

**Date:** 2026-05-14

## Rollback Triggers

Roll back Bridge IDX if:
- Bridge token is compromised or revoked
- Bridge API returns unexpected data (non-IDX data, PII exposure)
- IDX display compliance issue discovered (counsel flags attribution text)
- Browser token accidentally exposes server-grade credential
- Rate limit exhaustion causing site degradation
- Live listings fail to load in production and fallback iframe fails

## Rollback Steps

### Immediate (< 5 min, no Torrey UI required)

**Option 1 — Code flag rollback (fastest)**

```bash
# In src/lib/bridge.ts, change:
export const BRIDGE_INTEGRATION_LIVE = true as const;
# to:
export const BRIDGE_INTEGRATION_LIVE = false as const;

git commit -m "fix: rollback Bridge IDX integration"
git push origin main
# Trigger Dokploy redeploy
```

Effect: Home Search page shows MLS Matrix iframe fallback. No Bridge API calls in browser bundle.

**Option 2 — Remove build arg (token rotation)**

In Dokploy UI:
1. Remove `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` build arg
2. Redeploy

Effect: Same as Option 1 — `BRIDGE_AVAILABLE` becomes false, fallback renders.

**Option 3 — Token revocation (if token leaked)**

1. Torrey logs into Bridge dashboard
2. Regenerates Browser Token (immediately invalidates old token)
3. Updates `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` Dokploy build arg with new token
4. Redeploy

All requests using the old token will fail immediately on regeneration.

## Fallback State

When Bridge integration is rolled back:
- `/home-search/` renders the MLS Matrix iframe (same as `IdxEmbed` component on homepage)
- The SEARCH_ICON_HREF still points to `/home-search/` — no nav change needed
- MLS Matrix search continues to work for visitors
- No data loss — IDX listings are never stored locally

## Recovery Steps After Rollback

1. Identify root cause (token leak, compliance issue, rate limit, data quality)
2. Fix root cause
3. Run smoke test against staging with new token
4. Get Torrey approval to re-enable
5. Set `BRIDGE_INTEGRATION_LIVE = true` + redeploy
