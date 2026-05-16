# Cycle 37 — Continuation Prompt (next-session resume)

> Use this if Cycle 37 is interrupted or extended in a follow-up session.

## State snapshot

- branch: main
- HEAD: ed24e69 (Cycle 37 implementation commit)
- origin/main: ed24e69 (in sync)
- working tree: 3 untracked Cycle-35 log files only
- completed phases: 0, 1, 2, 3, 4, 5, 6, 7, 8 (commit + push)
- in-progress phases: 9 (staging deploy in tmux), 10 (live verification), 11–12 (alignment + records), 13–15 (final artifacts + cleanup)
- changed files: see commit-report.md
- validation results: all 14 critical audits PASS, full matrix in local-validation-report.md
- image audit result: 23/23 markets PASS deep audit (was 16/23 at session start by my new threshold; no audit existed before)
- Bridge mode/probe result: local fallback (no creds in shell); staging mode TBD post-deploy
- old IDX removal result: PASS — IdxEmbed.tsx deleted, MlsMatrixFallback retired, audit:no-old-idx clean
- staging deploy status: see staging-deploy-report.md (or in-progress under tmux session `mia-cycle37-staging-deploy-*`)
- whether live: filled in by staging-live-verification-report.md
- tmux sessions: see latest-staging-deploy-session.txt
- screenshots/artifact paths: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/local/*.png (gitignored; reproducible)
- blockers: see remaining-blockers.md
- secret-safety status: clean (see secret-safety-report.md)

## Resume command (if Phase 9 was interrupted)

```bash
cd /home/torrey/code/mia-sanabria-website
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-37-neighborhood-images-bridge-idx/logs/staging-deploy-${ts}.log"
tmux new-session -d -s "mia-cycle37-staging-deploy-${ts}" \
  "bash -c 'set +x; set -a; source ~/.claude/.env; set +a; bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle=\"South Florida Lifestyle\" --wait-timeout=900 --wait-interval=15 > \"${log}\" 2>&1; echo EXIT_CODE:\$? >> \"${log}\"'"
```

## Resume command (if Phase 10 was interrupted)

```bash
cd /home/torrey/code/mia-sanabria-website
base="https://miasanabriarealtor.trueidea.com"
mkdir -p docs/artifacts/cycle-37-neighborhood-images-bridge-idx/staging-html/final
for path in "/" "/home-search/" "/home-search/?city=Fort%20Lauderdale" "/markets/" "/markets/coral-springs/" "/markets/davie/" "/markets/deerfield-beach/" "/markets/hollywood/" "/markets/plantation/" "/markets/sunrise/" "/markets/weston/"; do
  cb="$(node -e 'console.log(require(\"crypto\").randomBytes(8).toString(\"hex\"))')"
  safe="$(echo "$path" | tr '/?=&%' '_____' | sed 's#^_$#home#')"
  echo "=== ${base}${path}?cb=${cb} ==="
  curl -I -L -H "Cache-Control: no-cache" --max-time 20 "${base}${path}?cb=${cb}" | sed -n '1,12p'
  curl -L -H "Cache-Control: no-cache" --max-time 30 -s "${base}${path}?cb=${cb}" \
    > "docs/artifacts/cycle-37-neighborhood-images-bridge-idx/staging-html/final/${safe}.html"
  grep -Ei "South Florida Lifestyle|Bridge|MLS|IDX|MlsMatrix|MLS Matrix|No photo available|data-bridge-runtime-mode" \
    "docs/artifacts/cycle-37-neighborhood-images-bridge-idx/staging-html/final/${safe}.html" | head -40
done
```

## Smallest next mission

Verify staging then update mia-client-decision-record.md, ISA.md, and MIA_SESSION_REPORT.md with Cycle 37 entry. If the deployed commit ends up behind origin/main due to a docs commit, run a final alignment deploy.
