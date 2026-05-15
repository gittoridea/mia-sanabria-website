# Cycle 36D → Next Cycle Continuation Prompt

**Generated:** 2026-05-14T22:10Z (Cycle 36C scaffold), **refreshed 2026-05-15** after Cycle 36D close-out
**Use:** Drop this verbatim into the next raw-Claude session if a follow-up cycle is needed.

## Where Cycle 36D left off

```yaml
branch: main
head: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
origin_main: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
working_tree_state: clean (after Phase 9 commit and Phase 14 docs follow-up commit; only 3 transient Cycle 35C deploy log files left untracked, intentional)
phases_completed: 0 through 15 (full Cycle 36D mission)
phases_incomplete: none
deployed_to_staging: true
staging_url_live_with_current_commit: true
deployed_commit_matches_head: true
staging_etag_post_deploy_home: dijka7eh7g1s57rf-gzip
staging_last_modified: "Fri, 15 May 2026 21:17:43 GMT"
bridge_mode_on_staging: demo   # unchanged — chunk test_sf + BRIDGE_DEMO=true
live_bridge_feed_proven: false
visual_qa_local_pngs: 39
visual_qa_staging_pngs: 108
mobile_readability_local: pass (84/0/0)
mobile_readability_staging: pass (84/0/0)
hero_contrast_stable_local: pass (145/0/0)
audit_all_critical: 0
secret_safety: clean (no values printed, logged, or committed)
production_changes: none
```

## Cycle 36C work summary

- Cycle 35C deploy blocker (audit:hero-contrast cold-cache race on Seven Isles + Pompano Beach 768x1024) FIXED via asset cache prewarm in `scripts/audit-hero-pixel-contrast.ts`.
- `package.json` `audit:all` chain uses `audit:hero-contrast:stable` (samples=3) for stability; `audit:hero-contrast` (samples=1, used by deploy-and-verify) still passes 145/0/0/0 because of the prewarm.
- `scripts/probe-bridge-live.ts` added — secret-safe diagnostic probe; short-circuits to `endpointConfigured=false` when credentials absent.
- `.gitignore` excludes `docs/artifacts/**/staging-html/*chunk*.js|page-*.js` — protects against committing token-bearing JS bundles.
- Bridge investigation concluded: **demo mode** is what is deployed on staging. Dataset literal `test_sf` + DEMO=true are baked into the Cycle 33B chunk (page-4e686a00462ff90a.js). The deployed chunk is the same one investigated at Cycle 36 start — no staging redeploy has changed it since.
- Demo honesty preserved. Demo banner + DEMO badges remain gated to demo mode in chunk.

## Remaining items external to this codebase

| Item | Owner | Action |
|---|---|---|
| Provision Bridge production dataset for SE Florida MLS | Mia + Bridge support | Bridge dashboard — new dataset ID, non-test |
| Set `NEXT_PUBLIC_BRIDGE_DATASET_ID` in Dokploy build args to production dataset | Torrey + Mia | Dokploy app `XJSRlvH-91ZtUsh0RPGvo` environment config |
| Set `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH=idx/Properties` | Torrey + Mia | Dokploy build args |
| Set `NEXT_PUBLIC_BRIDGE_DEMO=false` | Torrey + Mia | Dokploy build args |
| Set Bridge dashboard Referrer Domain restriction | Mia | Bridge dashboard — security tab |
| Trigger Dokploy rebuild after build-arg flip | Torrey | Dokploy redeploy button |
| Verify chunk needles post-flip (dataset !== test_sf, DEMO=false, idx/Properties) | Next-cycle PAI session | Use the Phase 11 probe loop |
| GHL form/webhook wiring (currently mailto fallback) | Torrey | Out-of-scope this cycle |
| GA4 / GTM / SC / GBP setup | Torrey | Out-of-scope this cycle |
| DNS cutover from staging trueidea.com → miasanabriarealtor.com | Torrey | Out-of-scope this cycle |

## Exact next commands

If next cycle is "verify Mia-flipped build args bake into chunk":

```bash
cd /home/torrey/code/mia-sanabria-website
git pull origin main
ts="$(date +%Y%m%d-%H%M%S)"
base="https://miasanabriarealtor.trueidea.com"
mkdir -p docs/artifacts/cycle-37-bridge-live-cutover-verify/staging-html
curl -sI -L "${base}/home-search/" | head -5
curl -sL "${base}/home-search/" > docs/artifacts/cycle-37-bridge-live-cutover-verify/staging-html/home-search.html
chunk=$(grep -oE '/_next/static/chunks/app/home-search/page-[a-f0-9]+\.js' \
         docs/artifacts/cycle-37-bridge-live-cutover-verify/staging-html/home-search.html | head -1)
echo "chunk: $chunk"
# Then check the chunk for `test_sf|test_sd` literals (should be absent) and `idx/Properties` (should be present)
# Do NOT print the token literal; redact it with `sed -E 's/[A-Fa-f0-9]{20,}/[REDACTED]/g'` before showing any chunk content
```

If next cycle is "make Bridge probe usable with credentials from a credential-bearing host":

- Run `bun run scripts/probe-bridge-live.ts` on the Dokploy build host (or any host where `NEXT_PUBLIC_BRIDGE_*` env vars are set).
- Expected output classification: `live` if dataset is production + records are Florida; `demo` if dataset is `test_sf|test_sd`; `error` with `http_4xx` if token is invalid.
- Result goes to `docs/artifacts/cycle-XX/bridge-live-probe-result.json`.

## Validation summary needed before next deploy

```bash
bun run typecheck
bun run lint
bun run build
bun run audit:all
bun run audit:hero-contrast
bun run audit:hero-contrast:stable
bun run audit:mobile-readability
```

All must pass with `EXIT_CODE:0`.

## Resume prompt for next session

> Resume the Mia Sanabria website at `~/code/mia-sanabria-website`. Cycle 36C closed with the hero-contrast deploy blocker fixed and Bridge truthfulness audit complete. Demo honesty is preserved because the deployed chunk hard-wires `test_sf` + DEMO=true. The next step depends on whether Mia + Torrey have completed the external Bridge dashboard + Dokploy build-arg work documented in `docs/artifacts/cycle-36-bridge-live-integration/continuation-prompt.md`. If yes, run Cycle 37 cutover verification (chunk needles + visual QA + staging live verify). If not, this codebase has no in-scope work; return to BSSClientStrategy or another active project.
