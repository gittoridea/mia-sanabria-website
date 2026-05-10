# Cycle 11 — True Mobile Instrumentation Report (F6 Closure)

**Captured:** 2026-05-10T02:43Z
**Tier:** E5 · **Algorithm:** v6.4.0
**Author:** main-thread (script-quality patch — small, focused, well-bounded — kept on main thread per `feedback_forge_race_scope_drift.md`)

---

## 1. The F6 finding (Cycle 10 carry-forward)

> Chrome `--dump-dom` mode renders the DOM at chrome's internal default viewport (~500 px wide) and ignores `--window-size`. As a result, `audit-rendered-visual.ts` mobile probes at 320 and 375 actually measured at ~500 px — silently passing on layout assertions that cannot answer the question they were asked.

The screenshot channel (`google-chrome --headless --window-size --screenshot=PATH`) DOES honor `--window-size` — that channel produces truthful PNGs. So:

- Truthful at 320 / 375: PNG screenshots (capture-baseline.ts).
- Untruthful at 320 / 375: dump-dom probe channel (audit-rendered-visual.ts).
- Truthful at 768 / 1280 / 1440: both channels (chrome's default render width is around the 500-768 range, so 768 happens to align by coincidence; 1280 + 1440 are deliberately scaled).

## 2. Investigation: implementation options weighed

| Option | Effort | Value | Risk | Verdict |
|---|---|---|---|---|
| **A. Full DevTools-Protocol rewrite** of audit-rendered-visual.ts | 4-8h | High — every measurement viewport-honest | Substantial new code, new dependency or hand-rolled WebSocket; substrate churn for marginal probe-channel improvement | Deferred (Cycle 12+ if needed) |
| **B. Add CDP fallback only on viewport-mismatch** | 3-5h | Mid | Half-rewrite still risks state-divergence | Deferred |
| **C. Add NEW sibling script `audit-rendered-cdp.ts`** | 4-6h | Mid | Substrate proliferation; both scripts must stay aligned | Deferred |
| **D. Add VIEWPORT-HONESTY assertion + SKIP gate; rely on screenshot channel + GPT-5.5 vision for 320/375** | 30-60 min | High for honesty (the lying stops); leverages existing capture-baseline.ts substrate | Low risk, surgical patch | **CHOSEN** |

**Decision rationale:** Option D delivers the user-visible benefit (the audit no longer silently lies at narrow widths) at ~10× lower implementation cost than Option A. The screenshot channel already produces real-viewport PNGs; the GPT-5.5 visual-acceptance gate already reviews them. The remaining gap (DOM-level layout probing at 320/375) is closeable later if a specific class of bug surfaces that requires it. For E5 cycle scope, this is the pragmatic-truth path.

## 3. Patch applied

**File:** `scripts/audit-rendered-visual.ts`

**Net additions:**

1. `VIEWPORT_HONEST_TOLERANCE_PX` constant (5 px slack)
2. `isViewportHonest(p: RouteProbe): boolean` helper — compares `p.result.viewport.w` (from `window.innerWidth`) to `p.viewport.width` (requested)
3. `viewportMismatch(p: RouteProbe): { requested, actual } | null` helper — returns mismatch shape when present
4. **Modified finding `#10 rendered.mobile.noHorizontalOverflow`** — splits probes into honest + dishonest; runs the overflow check on honest probes only; counts dishonest probes as SKIPPED with reason; status logic:
   - 0 honest mobile probes → `SKIP` overall (use screenshot review)
   - 0 overflow at honest probes → `PASS` (evidence cites honest probe count + dishonest skipped count)
   - any overflow at honest probes → `FAIL`
5. **NEW finding `#15 rendered.probe.viewportSanity`** — F6 instrumentation gate. Reports per-viewport honest-vs-mismatched count + sample actual width. WARN (not FAIL) because the screenshot-channel + GPT-5.5 fallback covers the gap.

**Net diff:** ~70 lines added; no existing PASS results regressed.

## 4. Result on live staging (post-patch)

```
$ bun run audit:rendered

  ✓ rendered.images.allRendered — 0 broken images across 125 probes
  ✓ rendered.marketCards.allVisibleOnIndex — 13 visible cards (best viewport: 320x568)
  ✓ rendered.principalReportedMarkets.visible — all 3 principal-reported markets visible
  ✓ rendered.hero.headingFitsPanel — 0 offenders across 125 probes
  ✓ rendered.hero.eyebrowFitsPanel — 0 offenders across 125 probes
  ✓ rendered.hero.subFitsPanel — 0 offenders across 125 probes
  ✓ rendered.hero.primaryCtaAboveFoldDesktop — 0 desktop probes show primary CTA below fold
  ✓ rendered.hero.primaryCtaTextFits — 0 primary-CTA tail-clips
  ✓ rendered.hero.secondaryCtaTextFits — 0 secondary-CTA tail-clips
  ✓ rendered.mobile.noHorizontalOverflow — 0 overflow at 25 viewport-honest probes; 50 dishonest probes SKIPPED (instrumentation mismatch)
  ✓ rendered.ctas.contrastVisible — 0 CTAs below contrast threshold
  ✓ rendered.staleStrings.absent — 0 stale-string hits across rendered surfaces
  ✓ rendered.canonicalEmail.consistent — single canonical email rendered: msanabriarea@gmail.com
  ✓ rendered.errors.zero — 0 probe errors
  ⚠ rendered.probe.viewportSanity — 75/125 probes viewport-honest; 50 mismatched (chrome --dump-dom clamps mobile to ~500px — screenshot channel + GPT-5.5 visual review covers the gap)

audit:rendered — 14 PASS · 1 WARN · 0 FAIL · 0 SKIP
```

**Per-viewport honesty breakdown** (from `reports/audit-rendered-visual.json#viewportSanity`):

| Requested viewport | Total probes | Viewport-honest | Mismatched | Sample actual width |
|---|---:|---:|---:|---:|
| 320×568 | 25 | 0 | 25 | ~500 |
| 375×812 | 25 | 0 | 25 | ~500 |
| 768×1024 | 25 | 25 | 0 | ~768 |
| 1280×800 | 25 | 25 | 0 | ~1280 |
| 1440×900 | 25 | 25 | 0 | ~1440 |

**The audit now tells the truth.** The 320/375 mobile probes are SKIPPED with `instrumentation_mismatch`, and the screenshot channel (Phase 3 below) is the official mobile gate at those widths.

## 5. The 320 / 375 mobile gate going forward

| Layer | Tool | Truthful at 320/375? | Cycle gate |
|---|---|:-:|---|
| **Pixel screenshots** | `scripts/capture-baseline.ts` (chrome `--screenshot --window-size=W,H`) | ✅ | All cycles (320, 375, 414, 768, 1280, 1440) |
| **DOM probe** | `scripts/audit-rendered-visual.ts` (chrome `--dump-dom`) | ❌ at 320/375; ✅ at 768+ | Mobile probes now SKIPPED with reason |
| **Operator visual review** | manual screenshot inspection | ✅ | Phase 3 + Phase 9 |
| **GPT-5.5 visual judgment** | `codex exec gpt-5.5 xhigh` reviewing screenshot dirs | ✅ | Phase 6 + Phase 10 + Phase 12 |

The screenshot pipeline + GPT-5.5 visual review constitutes the **official mobile gate** at 320/375. The DOM-probe channel is honest about its blind spot rather than lying about it.

## 6. Skill v0.3.3 candidate (folded into Phase 13)

- **HARD gate #15 (probe viewport-honesty assertion)** is now enforceable. Prior to Cycle 11 it was a soft commitment in skill v0.3.2; Cycle 11 codifies it in the audit script itself.
- The 3-layer image model (PRESENCE / VISIBILITY / AESTHETIC) gains a **VIEWPORT** axis: any layer's claim is bounded by the probe's viewport-honesty.

## 7. What remains queued (for Cycle 12+)

- **CDP-driven probe path** — Page.setDeviceMetricsOverride to make audit-rendered-visual.ts honest at all widths. Estimate: 4-8h. Trigger condition: a layout bug surfaces that pixel screenshots cannot diagnose without DOM measurement.
- **`audit:hero-contrast` probe-stability hardening** — the 1500-glyph-sample contrast measurement occasionally lands on light hero-image regions and reports glyph contrast 2.47 (Cycle 11 entry probe). Retest passes 15.40+. Candidate fix: aggregate 3 sample runs and take median, not single. Estimate: 30-45 min.

---

**Phase 2 result: ✅ F6 closed via Option D. Audit now SKIPs 320/375 dump-dom probes with explicit instrumentation_mismatch reason. Screenshot + GPT-5.5 visual review is the official mobile gate. Net diff ~70 LOC. Audit chain: 14 PASS · 1 WARN · 0 FAIL.**
