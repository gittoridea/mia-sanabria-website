---
cycle: 42
artifact: remaining-blockers
generated_at: 2026-05-17
---

# Cycle 42 — Remaining Blockers

After Phase 9 live verification and Phase 10 red-team final review, the items below remain external to AI work and external to Cycle 42's scope.

## Genuinely external

```yaml
mia_visual_review_of_new_helper_copy:
  status: pending
  reason: |
    Cycle 42 chose Option C copy ("Begin with an area, price range,
    and bedroom count. Mia will help you interpret the listings,
    neighborhoods, and details behind the search.") based on the
    brief's recommendations and local visual QA. Final sign-off on
    the exact wording belongs to Mia. Review surface remains the dev
    URL https://miasanabriarealtor.trueidea.com/.
  next_action: |
    Operator shows Mia the live dev URL. If she wants a different
    word/sentence, that is a forward-fix follow-up commit (or a brief
    revert per rollback-plan.md), not a Cycle 42 reopener.

production_cutover:
  status: blocked on principal decision
  reason: |
    Cycle 42 deployed to dev staging only. Production cutover to
    miasanabria.com requires DNS, Cloudflare cache strategy, GHL
    inquiry/valuation endpoint provisioning, Bridge production
    credential rotation (BRIDGE_SERVER_TOKEN etc.), legal review
    closeout (USCO DMCA), and Mia's sign-off on hero visuals.
    All explicitly out of scope per the brief security rules and
    by prior-cycle convention.

bridge_live_credential_provisioning:
  status: external
  reason: |
    Live Bridge mode at the dev Dokploy is currently `demo`
    (test-dataset + NEXT_PUBLIC_BRIDGE_DEMO=true). Promoting to
    `live` mode requires BRIDGE_SERVER_TOKEN / BRIDGE_CLIENT_SECRET /
    NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN / NEXT_PUBLIC_BRIDGE_DATASET_ID
    set on the production Dokploy environment per the BRIDGE_*
    credential placement spec. AI explicitly does not rotate
    these.

ghl_endpoint_wiring:
  status: external
  reason: |
    Contact + Valuation forms remain mailto fallbacks per Cycle 41
    closeout. GHL_INQUIRY_WEBHOOK_URL and GHL_VALUATION_WEBHOOK_URL
    provisioning is a principal-action item per
    docs/mia-client-decision-record.md. Cycle 42 did not change
    this; it remains a production-cutover dependency.

uscom_dmca_legal_review:
  status: external
  reason: |
    audit:legal still flags "USCO + in-process language present
    (acceptable for staging; BLOCKED for production cutover per
    CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md)". Production cutover gate.

real_device_mobile_verification:
  status: external (operator + Mia phone test)
  reason: |
    The 320/360/375/390 CDP right-edge body-copy clipping is the same
    --window-size vs real-viewport artifact Cycle 40C/41 classified
    as non-defective via Playwright CDP measurement. Cycle 42's
    text-only edit did not change geometry; the underlying defensive
    CSS from Cycle 40B remains in place. Real iPhone verification is
    operator/Mia territory.

qa_gate_high_register:
  status: deferred (separate cycle)
  reason: |
    audit:qa-gate reports critical=0 (gate green) but high=4. These 4
    high-priority items are pre-existing readiness-register entries
    not introduced by Cycle 42. Closing the high register is the
    smallest next mission toward production readiness.

future_audit_all_inclusion:
  status: pending policy decision
  reason: |
    The new audit:home-hero-copy script is wired into package.json
    individually but not yet added to the audit:all / audit:all:stable
    chains. Defer 1-2 cycles to observe stability before
    folding in.
```

## Not blockers (but worth noting)

```yaml
gitignored_screenshots:
  status: by_design
  reason: |
    docs/artifacts/cycle-42-*/{live-before,local-after,live-after}/
    screenshots/ contain 35+ PNGs total. .gitignore keeps them out of
    the repo (~10MB compressed); they live on disk for inspection
    and are reproducible via:
    bun run scripts/capture-baseline.ts --base=<url> --out=<dir>
    --routes=… --viewports=… --concurrency=3 --vtb=15000

cycle_41_staging_html_left_untracked:
  status: by_design
  reason: |
    docs/artifacts/cycle-41-*/staging-html/ contains raw chunk JS
    the brief security rules forbid committing. Cycle 41 closed
    without staging these; Cycle 42 leaves them untracked too.
```

## Genuinely AI-closeable (potential next-cycle scope)

```yaml
- name: qa_gate_high_register_cleanup
  scope: review the 4 high-priority items in reports/qa-gate-matrix.json
    and close any that are AI-actionable text/markup/image-swap fixes.
- name: bridge_mode_telemetry
  scope: surface the data-bridge-runtime-mode value on a non-rendered
    DOM hook so audit scripts can pick it up without parsing free text.
    (Already partly present via data-bridge-runtime-mode attribute;
    standardize the audit reading.)
- name: audit_all_inclusion_for_home_hero_copy
  scope: after 1-2 stable cycles, add audit:home-hero-copy to
    audit:all and audit:all:stable. Promote to deploy-and-verify's
    pre-flight chain so the gate fires automatically on every deploy.
```
