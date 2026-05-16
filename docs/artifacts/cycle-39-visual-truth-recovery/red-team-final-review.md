# Cycle 39 — Red-Team Final Review

date: 2026-05-16

Pre-final adversarial check: try to disprove each "fixed" claim before
declaring live-verified.

## R1 — Could Mia still be seeing old images due to browser cache?

**Hypothesis:** Even after Cycle 39 deploy, the operator's Chrome continues
to render the framed-canvas or Cycle 37 pixels.

**Adversarial check:**
- All seven affected slugs now use `-cycle39.jpg` URLs in both `<img src>`
  (rendered DOM, verified locally in `out/` for all 7) and the `og:image`
  meta (verified locally in `out/`).
- The unversioned `/markets/<slug>.jpg` URLs still resolve to the prior
  bytes (legacy files remain on disk) — but the RUNTIME never references
  them. Even a stale-cache lookup against the unversioned URL is harmless
  because the runtime UI doesn't request that URL.
- New URL = no cache key match in any layer (browser HTTP cache, service
  worker, Cloudflare edge if any, Caddy front).

**Verdict:** disproof failed. Cache cannot lie when the URL itself is new.
Operator's browser MUST fetch fresh bytes the first time it loads a
versioned URL.

## R2 — Could live DOM still reference old unversioned paths after deploy?

**Hypothesis:** The deploy ships the new URLs in HTML but a build-time
artifact still emits the old paths.

**Adversarial check:**
- `audit-neighborhood-images-deep.ts` was extended this cycle: when run
  with `--base=<staging-url>`, it fetches `/markets/` index AND each
  `/markets/<slug>/` detail and FAILS if the unversioned `src=/markets/<slug>.jpg`
  appears for any of the seven versioned slugs.
- The audit will run against staging in Phase 12 — a regression here
  emits a non-zero exit and would block the "live_verified" claim.
- Local build verified: `grep src="/markets/<slug>.jpg" out/markets/*` = 0
  matches for the seven versioned slugs.

**Verdict:** disproof requires a build cache bug; staging audit will catch.

## R3 — Could homepage hero be the wrong miasanabria.com image?

**Hypothesis:** The asset Cycle 38 chose (twilight og:image) is not the
actual visible hero on miasanabria.com.

**Adversarial check:**
- `scripts/probe-reference-hero-visual.ts` explicitly ran this comparison.
  Result: the actual visible miasanabria.com hero is a DAYTIME composition
  (`9d286670…jpg`, 320 KB), distinct from the og:image PNG (`0cea4829…png`,
  1.2 MB twilight) that Cycle 38 reused.
- Cycle 39 documents this divergence openly in
  `reference-hero-visual-extraction.md` and explicitly does NOT change the
  asset (operator authorized the Cycle 38 twilight composition by name in
  the mission brief: "operator-authorized reuse of the twilight waterfront
  composition; provenance recorded"). Cycle 39 only versioned the path
  (`-cycle39` suffix); the asset bytes are unchanged.

**Verdict:** the disproof actually surfaces a REAL question. Documented as
operator decision: keep twilight (Cycle 38 selection, current state) OR
swap to actual daytime hero. Not AI-closeable; explicitly recorded as a
deferred decision.

## R4 — Could homepage search merely navigate without Bridge consuming params?

**Hypothesis:** The form submits and navigates, but the auto-search never
fires because the JS path is broken.

**Adversarial check:**
- `scripts/test-home-search-bridge-e2e.ts` runs google-chrome --headless
  with `--virtual-time-budget=18000`, navigating to a URL with the same
  params the homepage form would submit. The DOM dump after JS execution
  is asserted to contain `data-bridge-runtime-mode`, the rendered results
  region (loading skeleton / demo banner / result cards / error panel),
  the BridgeSearch form surface, and the IDX/MLS disclosure.
- Local result: 11/11 PASS with `bridge_mode=fallback` (correct local mode
  when no Bridge token is set).
- Staging run (Phase 12) repeats against the live URL; expected mode
  `demo` (test fixture dataset per Cycle 38).

**Verdict:** disproof requires a runtime regression that the E2E test
catches by design. Local pass; staging pass pending Phase 12.

## R5 — Could Bridge be falsely labeled live?

**Hypothesis:** The UI declares live mode even though it isn't.

**Adversarial check:**
- Bridge mode is derived in `src/lib/bridge-client.ts` from three signals:
  presence of `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` + `NEXT_PUBLIC_BRIDGE_DATASET_ID`,
  the `NEXT_PUBLIC_BRIDGE_DEMO` flag, and the dataset classification.
  When `NEXT_PUBLIC_BRIDGE_DEMO=true` (Dokploy current state), the mode is
  forced to `demo`. Cycle 39 changed no Bridge code.
- The fallback/demo branches both render the "Demo data" banner and the
  IDX/MLS disclosure; live results would render only after operator flips
  the Dokploy build args. The UI cannot misrepresent live mode through any
  Cycle-39 change.

**Verdict:** disproof requires a code change Cycle 39 did not make.

## R6 — Could old IDX still be present?

**Hypothesis:** A legacy MlsMatrix / iframe / IDX runtime survives in some
corner of source or output.

**Adversarial check:**
- `bun run audit:no-old-idx` scanned 480 files, 0 hits.
- Manual grep across `src public out .next Caddyfile Dockerfile next.config.ts`
  for `MlsMatrix|MLS Matrix|mlsmatrix|sef\.mlsmatrix\.com|idxbroker|ihomefinder|flexmls|showcaseidx`
  returns only Cycle 38 doc references (artifact text, not runtime).
- Cycle 37 removed the runtime; Cycle 38 confirmed; Cycle 39 audit
  re-confirmed.

**Verdict:** disproof failed; old IDX runtime is gone.

## R7 — Could docs commit after deploy cause deployed-commit mismatch?

**Hypothesis:** The final-deploy alignment regresses if a docs-only commit
lands after the staging deploy completes.

**Adversarial check:**
- Cycle 39 committed source + docs in a single commit (`889b2c2`) BEFORE
  deploy. The deploy points at `889b2c2`.
- If Phase 12 produces additional reports (staging-live-verification,
  live-visual-qa, etc.) the cycle commits them in a second alignment
  commit AND runs a second deploy so HEAD/origin/main/deployed-commit
  stay in sync. This is the Cycle 38 lesson explicitly applied.

**Verdict:** disproof requires skipping the alignment redeploy; the
process explicitly forbids that.

## Composite verdict

No red-team check produced a successful disproof of any Cycle 39 claim
that the cycle actually makes. The one finding that *did* survive the
red-team — that the miasanabria.com visible hero is not the og:image
Cycle 38 reused — is openly documented and explicitly outside Cycle 39's
AI-closeable scope.

Cycle 39 is cleared to proceed to final live-verification (Phase 12) and
records update (Phase 15).
