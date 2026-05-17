# Cycle 40C — Resume Preflight (post-drop recovery)

> Captured at the start of the Cycle 40C session after the prior Cycle 40B
> session dropped during deploy verification. Establishes the actual repo
> and deploy state observed from the working tree, not the prior transcript.

## Captured state

```yaml
branch: main
head: 8095c786988924b2069d86b9602f672df27158d7
origin_main: 8095c786988924b2069d86b9602f672df27158d7
head_equals_origin_main: true
commit_8095c78_present: true
commit_8095c78_on_origin: true
working_tree_clean: false
uncommitted_files:
  modified:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/hero-contrast-20260516-205838.log
    - reports/audit-about.{json,md}
    - reports/audit-brand-consistency.{json,md}
    - reports/audit-completeness.{json,md}
    - reports/audit-featured-markets.{json,md}
    - reports/audit-hero-pixel-contrast.{json,md}
    - reports/audit-images.{json,md}
    - reports/audit-insights.{json,md}
    - reports/audit-legal.{json,md}
    - src/lib/markets.ts            # <-- material fix: swap 7 slug heroImage paths to -cycle40b
  untracked:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/bridge-truthfulness-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/commit-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/local-validation-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/local-visual-qa-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/old-idx-reaudit-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/red-team-precommit-review.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/secret-safety-report.md
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/build.pid
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/build3.log
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/latest-staging-deploy-log.txt
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/local-preview-4211.log
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-20260516-210340.log
running_tmux_sessions: none
running_deploy_processes: none (no node/bun deploy-and-verify processes; only openclaw gateway + ambient pyright/claude)
latest_staging_deploy_log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-20260516-210340.log
first_incomplete_phase: Phase 1 deploy-recovery classification + Phase 3 mobile hero proof + Phase 7 commit fix-up + Phase 8 deploy + Phase 9 live verification
safe_to_continue: true
```

## What the prior session left behind

- Cycle 40B commit `8095c78` already on `origin/main` — image lab + hero recovery + daytime waterfront swap, but `src/lib/markets.ts` was **not** updated to reference the seven new `-cycle40b.jpg` paths.
- That gap is the documented cause of the dropped deploy: the pre-flight `audit:images` audit failed because `images.everyMarketCardImagePresent` + `images.everyMarketPageHeroImagePresent` flagged seven markets without their card / hero images.
- The fix is the working-tree edit to `src/lib/markets.ts` already in place (cycle39 → cycle40b on all seven slugs).
- All seven cycle40b assets exist on disk and are git-tracked (committed in 8095c78), so the fix is purely the source-side wire-up.
- Mobile hero overflow concern at 375/390 remains the highest-risk unresolved question. Prior session reasoned it as a chrome `--headless` viewport-clamping capture artifact (cycle 39 documented behavior). User mandate: re-prove with multiple independent browser methods, do not dismiss without proof.

## Plan for Cycle 40C

1. Document deploy-recovery classification (Phase 1).
2. Verify cycle40b image state and source references (Phase 2).
3. Rebuild with the markets.ts fix locally; capture mobile hero at
   320/360/375/390/414/430/768/1280/1440 via two independent methods
   (capture-baseline + direct google-chrome --headless=new); inspect every
   PNG and either prove artifact OR patch the hero (Phase 3).
4. Confirm image-lab artifacts (scorecards, art-direction review, manifest,
   provenance) are complete; add `audit:image-creative-acceptance` if missing
   (Phase 4).
5. Run local Bridge E2E (Phase 5).
6. Run full validation gates + secret scans (Phase 6).
7. Commit + push (Phase 7).
8. Deploy via tmux (Phase 8).
9. Live capture + visual + audit + secret-scan after deploy (Phase 9).
10. Red-team final review (Phase 10), deploy alignment (Phase 11), records
    update (Phase 12), required artifacts (Phase 13), rollback +
    continuation (Phase 14).

No production / DNS / GHL / Google / Bridge credentials touched.
