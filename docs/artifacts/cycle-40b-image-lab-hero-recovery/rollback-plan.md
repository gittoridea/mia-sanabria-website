# Cycle 40C — Rollback Plan

> Minimum-blast-radius reversal path if Cycle 40C ships a regression. Two
> rollback targets are available: a) the Cycle 40C commit only (revert to
> 8095c78 head + restore old paths), b) the Cycle 40B + 40C stack (revert
> to 21533b9, the prior Cycle 39 final-deploy-alignment commit).

## Pre-rollback safety

```yaml
1. Confirm regression class is visible to the operator on miasanabriarealtor.trueidea.com.
2. Capture rollback-trigger evidence:
   - one screenshot of the regression on https://miasanabriarealtor.trueidea.com
   - one curl -sI showing live ETag at the moment of decision
3. Confirm origin/main HEAD on GitHub matches the deployed commit.
```

## Rollback A — revert Cycle 40C commit only

Used when the Cycle 40B image lab + hero is good but Cycle 40C wiring or audit-report changes broke something specific.

```bash
cd /home/torrey/code/mia-sanabria-website
git revert <CYCLE_40C_SHA> --no-edit
git push origin main
# then deploy
tmux new-session -d -s "mia-rollback-A-$(date +%Y%m%d-%H%M%S)" \
  "bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15"
```

Result: live site returns to commit 8095c78 (which was on origin/main when the dropped deploy fired). Note: 8095c78 had the markets.ts wire-up gap which caused audit:images to fail at deploy pre-flight. To deploy that commit you would need to also unbreak the audit, which is exactly the Cycle 40C work. **In practice rollback A is not useful — the Cycle 40B commit alone cannot deploy.** Use rollback B instead.

## Rollback B — revert Cycle 40B + 40C entirely (preferred)

Used when the Cycle 40B image lab or hero swap is itself the regression source.

```bash
cd /home/torrey/code/mia-sanabria-website

# Either: hard reset main to the prior good commit
git reset --hard 21533b9   # Cycle 39 final-deploy-alignment, the last known-good production-deployed commit
git push --force-with-lease origin main

# OR: a non-destructive revert that creates a new commit reverting the cycle40b+40c changes
git revert --no-commit 8095c78^..HEAD
git commit -m "revert(MIA-SITE-CYCLE-40C): roll back Cycle 40B + 40C to 21533b9 baseline"
git push origin main

# Then deploy
tmux new-session -d -s "mia-rollback-B-$(date +%Y%m%d-%H%M%S)" \
  "bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15"
```

The revert path is safer because it preserves the cycle 40B history (artifacts, image-lab evidence) while removing the active wiring. The hard-reset path is cleaner if you also want to discard the cycle 40B image assets.

## What rollback B affects

```yaml
removes_from_live:
  - 7 cycle40b neighborhood images visible at /markets/{slug}/
  - cycle40b homepage hero (daytime waterfront)
  - cycle40b mobile hero overflow defenses (overflow-x:clip on html/body, contain:inline-size on hero copy panel + form, w-full max-w-full on section + flex parent + hero search wrapper, relaxed CTA wrap)
returns_to_live:
  - 7 cycle39 neighborhood images at /markets/{slug}/
  - cycle39 twilight homepage hero
  - cycle39 hero CSS (no overflow-x:clip, no contain:inline-size on hero panel)
preserves:
  - Bridge IDX wiring (unchanged in 40B/40C)
  - audit suite, audit reports, all prior cycle artifacts
  - mia.ts neighborhood approval list
  - markets data shape (only heroImage path field flipped)
```

## Rollback bar

Trigger rollback B only if any of these is true after Phase 9 live verification:

1. Homepage hero overflows visibly on any iPhone tested by Mia or Torrey at her actual viewport.
2. Any of the seven Cycle 40B images renders broken, distorted, off-topic, or visibly AI-uncanny on Mia's review.
3. `audit:image-creative-acceptance` flips to FAIL on live HTML.
4. `audit:neighborhood-images-deep` flips to FAIL on live HTML.
5. Bridge E2E flips to FAIL on staging.
6. Old IDX (`sef.mlsmatrix.com` iframe) re-appears in the runtime DOM.

Do NOT roll back for:

- Subjective preference about hero composition that is not a structural defect.
- A capture-baseline screenshot artifact at 320/360/375/390 (proven non-defect in Playwright probe — see `cycle40c-mobile-hero-proof.md`).
- A WARN-level audit signal that does not flip a hard gate.

## Production guarantees

This rollback does NOT:

- touch the production miasanabriarealtor.com Direct Axess host;
- modify DNS;
- modify GHL sub-account;
- modify Google Ads / GBP / social profiles;
- rotate Bridge tokens, Dokploy tokens, Google API keys;
- send messages to Mia or any other real person.

The staging dev site `miasanabriarealtor.trueidea.com` is the only surface affected.
