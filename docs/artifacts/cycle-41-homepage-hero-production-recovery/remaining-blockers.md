---
cycle: 41
artifact: remaining-blockers
generated_at: 2026-05-17
---

# Cycle 41 — Remaining Blockers

After Phase 11 live verification (still in flight at time of file creation; final-state edit may follow), the items below remain external to AI work and external to this cycle's scope.

## Genuinely external

```yaml
production_cutover:
  status: blocked on principal decision
  reason: |
    Cycle 41 deploys to dev staging only (miasanabriarealtor.trueidea.com).
    Production cutover to miasanabria.com requires DNS, Cloudflare cache,
    GHL endpoint provisioning, Bridge credential rotation, legal review
    closeout (USCO DMCA), and Mia's sign-off on hero visuals + content.
    All explicitly out of scope per the Cycle 41 brief security rules.

mia_visual_review:
  status: pending
  reason: |
    Cycle 41 produces a credible production-grade baseline. Final
    sign-off on hero direction belongs to Mia. The dev URL
    https://miasanabriarealtor.trueidea.com/ is the review surface.

bridge_live_credential_provisioning:
  status: external
  reason: |
    Local + dev deploys render Bridge in fallback mode (env vars absent
    in dev shell; staging build may or may not have live creds). Live
    Bridge requires BRIDGE_SERVER_TOKEN / BRIDGE_CLIENT_SECRET / etc.
    set at the production Dokploy environment per the BRIDGE_*
    credential placement spec; AI explicitly does not rotate these.

ghl_endpoint_wiring:
  status: external
  reason: |
    Contact + Valuation forms remain mailto fallbacks. GHL_INQUIRY_WEBHOOK_URL
    and GHL_VALUATION_WEBHOOK_URL provisioning is a principal-action item
    per docs/mia-client-decision-record.md.

uscom_dmca_legal_review:
  status: external
  reason: |
    audit:legal flags "USCO + in-process language present (acceptable for
    staging; BLOCKED for production cutover)." Production cutover gate.

real_device_mobile_verification:
  status: external (operator + Mia phone test)
  reason: |
    The chrome --headless capture-baseline 320 / 360 / 375 right-edge
    artifact is the same CDP-vs-window-size mismatch Cycle 40C explicitly
    classified as non-defective via Playwright CDP measurement. Real
    iPhone verification remains operator territory; Cycle 41 left the
    Cycle 40B defensive CSS unchanged at mobile, so the geometry
    invariants Cycle 40C verified still hold.
```

## AI-closeable next steps

```yaml
mia_review_artifact_package:
  description: |
    Bundle live-after captures + a one-page Mia-facing summary
    "what changed and why" to make her review fast. Currently the
    Cycle 41 artifacts are engineer-facing.
  ai_closeable: yes
  size: small
  trigger: "request a Mia-facing brief from cycle 41 artifacts"

audit_rendered_warn_resolution:
  description: |
    audit:rendered carries a persistent WARN: "105/175 probes
    viewport-honest; 70 mismatched (chrome --dump-dom clamps mobile
    to ~500px)." This is the audit tool's instrumentation gap, not a
    site defect. A future audit-rendered-visual.ts upgrade could
    replace --dump-dom with a Playwright CDP eval path.
  ai_closeable: yes (medium effort)
  size: medium

post_search_spacer_recall:
  description: |
    Cycle 41 reduced the post-search spacer to h-6 sm:h-8 lg:h-10.
    If Mia reports the rhythm into "Mia's Service Areas" feels too
    tight after living with it, the spacer can be tuned upward to
    h-10 sm:h-12 lg:h-14 without further structural change.
  ai_closeable: yes
  size: trivial
```

## Smallest next mission toward production readiness

The single smallest next move (AI-closeable) toward Mia's production cutover:

> **Compile a Mia-facing one-page review artifact**: include the live-before / live-after URL comparison, the locked H1 statement, the eyebrow-removal rationale, the "what was preserved" list, and the next-step questions for Mia to decide (eyebrow re-add y/n, hero copy refinements, search-card width preference). This is a non-engineering deliverable that unblocks Mia review without forcing her to read 16 engineer artifacts.

After that, the production-cutover sequence is gated entirely on Mia + Torrey decisions (DNS, GHL, Bridge creds, legal closeout) and is not AI-closeable.
