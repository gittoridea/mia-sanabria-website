# Cycle 40C — Remaining Blockers

> What's left after Cycle 40C closes — separated by whether the remaining
> work is AI-closeable, operator-only, or genuinely external.

## AI-closeable (mission-internal)

```yaml
none_at_session_close: true
ai_closeable_items: []   # all Phase 9 gates passed; no in-cycle remediation needed
```

## Operator-only (Mia / Torrey decision territory)

```yaml
items:
  - real-device mobile hero verification on Mia's actual iPhone at https://miasanabriarealtor.trueidea.com
  - Mia subjective review of the seven Cycle 40B neighborhood images (deerfield-beach, hollywood, plantation, weston, coral-springs, davie, sunrise) — content matches her market identity
  - Mia subjective review of the new homepage daytime waterfront hero (mia-home-hero-cycle40b)
  - GHL endpoint decision for valuation/contact/brief forms (currently mailto fallback per project doctrine)
  - production cutover decision for miasanabriarealtor.com (Direct Axess vs Dokploy)
  - DNS, GBP, social-profile alignment if cutover proceeds
```

## Genuinely external

```yaml
items:
  - Bridge IDX credential provisioning on the Helos VPS dev host (currently mode=fallback because BRIDGE_* env vars are not present on the dev host)
  - any production-side credential storage or rotation work
  - any operator decision on whether to migrate the Bridge tokens or generate fresh ones for the prod cutover
  - capture-baseline.ts pipeline upgrade to drive screenshots via Playwright (CDP setDeviceMetricsOverride) — a small post-cycle-40C improvement so future narrow-viewport visual QA matches real-device behavior
```

## What is explicitly NOT a blocker

```yaml
non_blockers:
  - capture-baseline / direct google-chrome screenshot artifact at 320/360/375/390/414 — proven non-defect via Playwright probe (cycle40c-mobile-hero-proof.md)
  - the chrome --headless viewport-clamping behavior at narrow widths — known capture-pipeline limitation, not a layout bug
  - the audit:completeness forms-classification WARN (2 mailto, 1 search, 0 live-ghl) — acceptable for the staging surface; not a hard gate
  - the audit:legal dmca uscoFlag WARN — acceptable for staging; BLOCKED for production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md
```

## Smallest next mission toward production readiness

After Cycle 40C is live-verified and Mia has approved the staging surface on her phone, the smallest next move is one of:

1. **Switch capture-baseline.ts to Playwright** (one-day mission) so future cycles don't re-litigate the chrome --headless artifact.
2. **GHL endpoint wire-up conversation** with Mia + Torrey to decide which forms get real GHL endpoints vs staying as mailto for the prod cutover.
3. **Bridge live-mode token provisioning** on the dev host to flip mode=fallback → mode=live so the live site exercises the real Bridge endpoint with Mia's customer data.

Pick exactly one. Don't bundle.
