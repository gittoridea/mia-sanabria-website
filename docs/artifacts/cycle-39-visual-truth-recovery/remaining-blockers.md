# Cycle 39 — Remaining Blockers

date: 2026-05-16

## Cycle 39 closed (AI-closeable, done this cycle)

- Operator-reported "neighborhood images did not update" defect class
  ROOT-CAUSED (in-place asset replacement at unversioned URLs) and FIXED
  (versioned `-cycle39.jpg` filenames + helper-enforced runtime
  consistency + audit-enforced anti-regression).
- Operator-reported "homepage hero regressed" defect partially addressed:
  mobile panel opacity reduced (image now visible) + sub-text-overflow
  fix (panel no longer extends rightward off-viewport) + locked H1 + locked
  twilight composition preserved.
- Operator-reported "homepage search not properly wired to Bridge" defect:
  JS path now proven end-to-end via new
  `scripts/test-home-search-bridge-e2e.ts` (11/11 PASS local).
- Reference-hero asset verification (new): probe-script enumerates actual
  visible miasanabria.com hero candidates and surfaces the divergence
  Cycle 38 missed.
- `audit:neighborhood-images-deep` permanently hardened — versioned-path
  enforcement + live-DOM versioned-path scan.
- Old IDX runtime audit remains clean.
- 27 audit gates green locally; commit `889b2c2` pushed to origin/main.

## AI-closeable but deferred to next cycle (scope guard)

- **Daytime-hero composition swap.** The reference probe shows the actual
  visible miasanabria.com hero is a DAYTIME 320KB JPG, not the TWILIGHT
  1.2MB PNG Cycle 38 reused as the operator-authorized hero. The swap is
  a single-file replacement (overwrite `public/hero/mia-home-hero-cycle39.jpg`
  byte-for-byte with the daytime composition), no code change needed.
  Deferred because the Cycle 38 selection was operator-authorized by name
  in the mission brief; changing the composition without explicit operator
  sign-off would deviate from the standing authorization.
- **Lift `audit:home-bridge-search` and `audit:neighborhood-images-deep`
  into `audit:all`.** Currently they run on demand. Cycle 38 deferred this;
  Cycle 39 still defers — let the new audits stabilize across 1–2 cycles
  before they become deploy-gate-blocking.
- **Cycle 38 deferred items still standing:**
  - Fold perimeter-whiteness validator from `generate-neighborhood-images-v2.ts`
    into `audit-neighborhood-images-deep.ts` (catches framed-canvas defect
    at audit boundary, not just generation boundary).
  - "Demo-honesty UI snapshot" audit: screenshot `/home-search/` at staging
    and FAIL on any rendered listing card without DEMO badge when
    `data-bridge-runtime-mode` is non-live.

## Externally blocked (NOT AI-closeable this session)

### Bridge live mode activation

Cannot complete from this workstation. Requires Dokploy build-arg state
the workstation does not have visibility into. Operator must confirm all
of the following in Dokploy:

1. `BRIDGE_DATASET_ID` and `NEXT_PUBLIC_BRIDGE_DATASET_ID` point at the
   Mia / Southeast Florida live dataset (not Bridge `test_sf`).
2. `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` points at the live IDX resource
   path (e.g., `idx/Properties`).
3. `NEXT_PUBLIC_BRIDGE_DEMO` is unset or `false`.
4. Bridge IDX feed approval for Mia / LPT Realty / SEF MLS is finalized
   on the Bridge account.
5. Referrer-domain restriction list includes the 3 target domains
   (operator confirmed in Cycle 38 brief).

The Cycle 39 staging-live verification (Phase 12) will classify the
actually-deployed mode without operator-side flag changes.

### Production cutover

- DNS for `miasanabriarealtor.com` still points at Direct Axess. Cutting
  to Cycle-39-style staging requires DNS + Dokploy production-config
  decision the operator must make.
- GHL form/webhook endpoints — currently mailto fallback. Real GHL
  endpoints require operator authorization.
- Branded `@miasanabriarealtor.com` email creation — operator decision.

### Mia review

- Visual approval of the Cycle 39 panel-opacity + sub-text-width hero
  treatment.
- Visual approval of the versioned-path-republished 7 neighborhood images.
- Approval of the floating search card layout (unchanged from Cycle 38
  but visually different now that the hero panel is less opaque).
- Approval to launch dev site for client review.

These are not AI-closeable; they require Mia's review of the deployed
Cycle 39 staging site.

### Operator decision on reference-hero divergence

The probe-script surfaced that the actual visible miasanabria.com hero is
not the og:image Cycle 38 reused. Two paths, operator chooses:

1. Stay with Cycle 38 twilight composition (current Cycle 39 state).
2. Swap to actual daytime composition (single-file replacement at the
   already-versioned path).

## Pre-existing carry-overs unchanged by Cycle 39

- `audit:legal.dmca.uscoFlag` warning (USCO + in-process language;
  acceptable for staging, blocked for production cutover per
  CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md).
- 4 high-severity QA-gate findings + 1 medium + 56 low. None block
  deploy; carried over from prior cycles. Cycle 39 did not regress
  qa-gate critical (still 0).
- Cycle-35 leftover logs in
  `docs/artifacts/cycle-35-recovery-full-completion/logs/` —
  pre-existing untracked logs; not staged this cycle.

## Smallest next mission toward production readiness

Mia review of staging hero + neighborhood images. If approved without
edits:

1. Operator decision on twilight vs daytime hero composition.
2. Operator decision on Bridge live mode activation timing.
3. Operator decision on production-cutover DNS plan.
4. Branded email + GHL endpoint provisioning.
5. Final pre-cutover audit + DNS flip + monitoring setup.

Nothing else is in Cycle 39 scope.
