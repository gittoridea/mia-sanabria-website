# Cycle 38 — Remaining Blockers

date: 2026-05-16

## Cycle 38 closed (AI-closeable, done this cycle)

- Live "not displaying" defect on 7 neighborhood images — root-caused (Gemini framed-canvas), fixed (regenerated with hardened photorealism prompts + perimeter-whiteness validator), audit-deep 23/23, visually verified.
- Homepage hero swapped to operator-authorized miasanabria.com twilight waterfront composition.
- Floating Bridge-wired search card matches production miasanabria.com layout pattern.
- BridgeSearch reads URL params + auto-searches.
- Old IDX runtime audit stays green.
- All 11 audit gates green.
- Commit + push + tmux deploy executed.

## AI-closeable but deferred to next cycle (scope guard)

- Fold the perimeter-whiteness validator from `generate-neighborhood-images-v2.ts` into
  `audit-neighborhood-images-deep.ts` so future asset swaps are gated on pixel-content too.
  Cycle 38 catches the defect at the generation boundary; the audit boundary still doesn't.
- Add a "demo-honesty UI snapshot" audit that screenshots `/home-search/` at staging and
  flags any rendered listing card without a `DEMO` badge when `data-bridge-runtime-mode` is
  `demo`/`fallback`/`unknown`. Cycle 38 verifies this via component logic; an end-to-end
  visual gate would harden it.
- Lift `audit:home-bridge-search` into `audit:all` once stability is observed across 1-2
  cycles. Currently it runs on demand only.

## Externally blocked (NOT AI-closeable this session)

### Bridge live mode activation

Cannot complete from this workstation. Requires Dokploy build-arg state that is not visible from `~/.claude/.env`. Specifically, all of the following must be operator-confirmed in Dokploy:

1. `BRIDGE_DATASET_ID` and `NEXT_PUBLIC_BRIDGE_DATASET_ID` point at the Mia / Southeast Florida live dataset (not Bridge `test_sf`).
2. `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` points at the live IDX resource path (e.g., `idx/Properties`).
3. `NEXT_PUBLIC_BRIDGE_DEMO` is unset or `false`.
4. Bridge IDX feed approval for Mia / LPT Realty / SEF MLS is finalized on the Bridge account.
5. Referrer-domain restriction list includes the 3 target domains (confirmed by operator this cycle).

The Cycle 38 staging-live verification (Phase 12) will classify the actually-deployed mode without operator-side flag changes.

### Production cutover

- DNS for `miasanabriarealtor.com` still points at the Direct Axess host. Cutting to Cycle-38-style staging requires DNS + Dokploy production-config decision the operator must make.
- GHL form/webhook endpoints — currently mailto fallback. Real GHL endpoints require operator authorization.
- Branded `@miasanabriarealtor.com` email creation — operator decision.

### Mia review

- Visual approval of the new hero composition.
- Visual approval of the 7 regenerated neighborhood images.
- Approval of the floating search card layout.
- Approval to launch dev site for client review.

These are not AI-closeable; they require Mia's review of the deployed staging site.

## Pre-existing carry-overs unchanged by Cycle 38

- `audit:legal.dmca.uscoFlag` warning (USCO + in-process language; acceptable for staging, blocked for production cutover per Cycle-16 audit).
- 4 high-severity QA-gate findings + 1 medium + 56 low. None block deploy; carried over from prior cycles. Cycle 38 did not regress qa-gate critical (still 0).
- Cycle-35 leftover logs in `docs/artifacts/cycle-35-recovery-full-completion/logs/` — pre-existing untracked logs; not staged this cycle.

## Smallest next mission toward production readiness

Run one bounded mission that does ONLY:
1. Operator confirms Dokploy Bridge config (dataset, resource path, demo flag) ready for live.
2. Operator removes `NEXT_PUBLIC_BRIDGE_DEMO` flag from Dokploy.
3. Trigger Dokploy redeploy.
4. Staging probe classifies `data-bridge-runtime-mode="live"` and confirms non-fixture records.
5. Commit a single decision-record entry "Bridge live mode verified" + the staging probe artifact.

Nothing else. Production cutover (DNS, GHL, branded email) is a separate, larger, operator-led mission.
