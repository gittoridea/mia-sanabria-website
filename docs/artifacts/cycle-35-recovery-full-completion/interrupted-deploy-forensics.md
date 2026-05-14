# Interrupted-Deploy Forensics — Cycle 35B

date: 2026-05-14
cycle: MIA-SITE-CYCLE-35B
goal: Classify what happened to the Cycle 35 recovery `deploy-and-verify.ts` invocation after the SSH `client_loop: send disconnect: Broken pipe`.

## What we looked for

1. Locally persisted deploy logs (none expected — the prior session ran the command as a foreground process tied to SSH).
2. Any deploy or dokploy process still running (none expected, SSH death severed the parent).
3. Live staging routes: HTTP, ETag, last-modified, needle presence.
4. Any leaked secret material in the rendered HTML.

## Local-state evidence

```
find docs/artifacts/cycle-35-recovery-full-completion -type f \( -iname '*deploy*' -o -iname '*staging*' -o -iname '*.log' \)
# -> no pre-existing deploy logs
find /tmp -maxdepth 2 -type f \( -iname '*mia*deploy*' -o -iname '*dokploy*' -o -iname '*cycle35*' \)
# -> no /tmp deploy artifacts
ps -ef | grep -E "deploy-and-verify|dokploy" | grep -v grep
# -> no deploy or dokploy processes still running
```

`scripts/deploy-and-verify.ts` calls Dokploy's `application.deploy` API (POST). Dokploy executes the build/deploy independently of the local script. When SSH died, the **local** polling died — but Dokploy continued the build and deploy cycle to completion.

## Live-staging evidence (cache-busted hex)

All routes returned HTTP/2 200 with identical `last-modified: Thu, 14 May 2026 16:46:59 GMT` and a single ETag prefix `diijwdedso3k…` differing only per route. That is the fingerprint of a single completed deploy bundle served from Caddy after the etag flipped:

```
HTTP/2 200   /
HTTP/2 200   /home-search/
HTTP/2 200   /markets/
HTTP/2 200   /markets/fort-lauderdale/
HTTP/2 200   /markets/pompano-beach/
HTTP/2 200   /markets/deerfield-beach/
HTTP/2 200   /markets/coral-springs/
HTTP/2 200   /markets/plantation/
HTTP/2 200   /markets/weston/
HTTP/2 200   /markets/hollywood/
HTTP/2 200   /markets/davie/
HTTP/2 200   /markets/sunrise/
HTTP/2 200   /markets/boca-raton/
HTTP/2 200   /markets/delray-beach/
HTTP/2 200   /buyers/
HTTP/2 200   /sellers/
HTTP/2 200   /about/
HTTP/2 200   /contact/
HTTP/2 200   /insights/
HTTP/2 200   /privacy/
HTTP/2 200   /terms/
HTTP/2 200   /accessibility/
HTTP/2 200   /dmca/
```

Needle scan on `/` and `/home-search/`:

```
Home Search
LPT Realty
Mia Sanabria
Search available homes
South Florida Lifestyle
```

Per-neighborhood H1 + title sample (size in bytes):

```
fort-lauderdale  252KB  Fort Lauderdale Luxury Real Estate | Mia Sanabria
                       "Where deepwater yacht access, a working downtown, and a 165-mile canal system meet."
pompano-beach   136KB  Pompano Beach Luxury Real Estate | Mia Sanabria
                       "A northern Broward beach city with deepwater boating, redeveloped pier district, and offshore reef."
deerfield-beach 132KB  Deerfield Beach Luxury Real Estate | Mia Sanabria
                       "Northeastern Broward beach city framed by Boca Raton, Pompano Beach, and the Hillsboro Inlet."
coral-springs   129KB  Coral Springs Luxury Real Estate | Mia Sanabria
                       "Northwestern Broward planned city with a deliberate road grid and named subdivisions."
plantation      128KB  Plantation Luxury Real Estate | Mia Sanabria
                       "Central Broward city with mature tree canopy and a central-Broward connector position."
weston          132KB  Weston Luxury Real Estate | Mia Sanabria
                       "Western Broward master-planned communities at the Everglades Water Conservation Area edge."
hollywood       128KB  Hollywood Luxury Real Estate | Mia Sanabria
                       "South Broward coastal city anchored by the Hollywood Broadwalk and Young Circle / ArtsPark."
davie           133KB  Davie Luxury Real Estate | Mia Sanabria
                       "Central Broward town with equestrian heritage, Tree City USA designation, and a college corridor."
sunrise         131KB  Sunrise Luxury Real Estate | Mia Sanabria
                       "Western Broward city anchored by the Sawgrass Mills retail district and the Florida Panthers arena."
boca-raton      133KB  Boca Raton Luxury Real Estate | Mia Sanabria
                       "Coastal, club, and city access across South Palm Beach County."
delray-beach    132KB  Delray Beach Luxury Real Estate | Mia Sanabria
                       "Beach, downtown, and residential options with a strong local lifestyle draw."
```

Page sizes 128-252KB indicate substantial rendered content — not thin shells.

## Secret-safety scan on captured HTML

```
grep -RniE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|access_token=|refresh_token=|Bearer [A-Za-z0-9._-]{16,}|DOKPLOY_API_TOKEN" docs/artifacts/cycle-35-recovery-full-completion/live-html-check
# -> no matches
```

No secret material is rendered in any staging HTML.

## Classification

```
deploy_status: completed_after_disconnect
evidence:
  live_needle_south_florida_lifestyle: true (/ and /home-search/)
  home_search_live: true ("Home Search", "Search available homes" present)
  bridge_demo_warning_visible_if_demo_data: not_evaluated_here (per Phase E secret scan + later visual review)
  staging_http_200_routes: 23 (all approved + reference + core + legal + utility)
  deploy_logs_found: none (SSH-tied; expected)
  process_found: none (no orphan deploy-and-verify, dokploy probe, or build process)
  unified_etag_fingerprint: diijwdedso3k… across all routes — single deploy bundle
  unified_last_modified: Thu, 14 May 2026 16:46:59 GMT — after the prior SSH disconnect window
next_action: skip Phase D redeploy; continue Phase E full verification + remaining phases
```

The previous session's recovery deploy completed successfully despite the SSH disconnect. No corrective deploy is required at this stage.
