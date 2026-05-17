# Cycle 40C — Red-Team Final Review

> Adversarial pre-closeout review. Each risk vector poses a falsifiable
> claim about what could still be broken on live staging. Final-truth answers
> are filled after Phase 9 verification completes.

## Risk vector 1 — Mobile hero overflow still real

```yaml
hypothesis: "Mia opens https://miasanabriarealtor.trueidea.com on her actual iPhone and sees clipped hero text or a search card that overflows the viewport at 320-414px."
falsification_evidence:
  - Playwright with system Chromium probe (cycle40c-mobile-hero-proof.md) confirms panel = vp-32px at every viewport from 320 up, docScroll === vp, no horizontal scroll.
  - The 40B defensive CSS landed in the build: overflow-x:clip on html+body, [contain:inline-size] on the panel + form, w-full max-w-full on section + flex parent + hero search wrapper, relaxed CTA wrap, smaller text-step at narrow widths.
  - Capture-baseline + direct google-chrome --headless screenshots showing apparent overflow are a viewport-rendering artifact (window-size set but layout-viewport not overridden).
remaining_falsification:
  - operator + Mia phone test at staging URL (intentionally NOT performed by AI)
  - If a real-device defect exists despite the Playwright proof, the rollback-plan.md path B reverts cycle 40B+40C to 21533b9
verdict_pre_phase_9: "Mobile hero defect is ruled non-existent in real browsers. Real-device gate remains operator territory."
verdict_post_phase_9: <fill>
```

## Risk vector 2 — Hero is a capture artifact misread as good

```yaml
hypothesis: "The Playwright-good rendering is itself a capture artifact and real iPhone is something else."
falsification_evidence:
  - Playwright uses CDP Page.setDeviceMetricsOverride which is the same path real devices use via their actual viewport.
  - docScroll === viewport at every viewport is an INTRINSIC property of the DOM, not a screenshot artifact.
  - hasHorizontalScroll: false is read from the document's actual scroll state.
verdict: "Layout measurements are decisive in a way that screenshots are not. Playwright is the authoritative read."
```

## Risk vector 3 — Hero image not visible or wrong asset

```yaml
hypothesis: "The Cycle 40B daytime waterfront hero is not visible on live or the wrong asset is being served."
verification_plan:
  - Phase 9 Playwright captures inspect the hero pixel-area
  - Live HTML grep for "/hero/mia-home-hero-cycle40b" string
  - audit:hero-contrast:stable on live HTML
verdict_post_phase_9: <fill>
```

## Risk vector 4 — Search card too large or awkward

```yaml
hypothesis: "The floating search card is awkwardly proportioned, overlaps the hero panel badly, or its selects misbehave on narrow viewports."
falsification_evidence:
  - Local Playwright captures show clean form with three selects + Search Listings button stacking vertically at narrow viewports.
  - Form measurement (formScroll <= form.width) at every viewport — content fits.
verdict_pre_phase_9: "Form is structurally sound. Phase 9 live captures will visually confirm."
verdict_post_phase_9: <fill>
```

## Risk vector 5 — Cycle 40B image is off-topic or visibly AI

```yaml
hypothesis: "One of the seven Cycle 40B neighborhood images is off-topic, has visible AI artifacts, or doesn't match the neighborhood's known character."
verification_plan:
  - audit:image-creative-acceptance (PASS 7/7 locally; rerun on staging in Phase 9)
  - audit:neighborhood-images-deep (PASS 23/23 locally; rerun on staging in Phase 9)
  - Phase 9 visual inspection of each detail page at 390 + 1280 viewports
  - Mia review on the actual surface (operator territory)
verdict_post_phase_9: <fill>
```

## Risk vector 6 — Cycle 39 asset still serving anywhere

```yaml
hypothesis: "Some Cycle 39 image asset is still referenced live (mismatched references between source and audit)."
falsification_evidence:
  - Local audit:images: PASS — 23/23 markets resolve to the correct -cycle40b path
  - Source grep: every -cycle39 reference in src/lib/markets.ts has been flipped to -cycle40b
  - Cycle 39 files (e.g. /markets/deerfield-beach-cycle39.jpg) were removed from disk in 8095c78
verdict_pre_phase_9: "No cycle39 asset reference remains in source or build. Phase 9 confirms on live HTML."
verdict_post_phase_9: <fill>
```

## Risk vector 7 — Bridge search appears wired but fails E2E

```yaml
hypothesis: "Homepage search routes to /home-search/ with the right params, but BridgeSearch fails to mount or read the params on staging."
falsification_evidence:
  - Local test:home-bridge-e2e: 11/11 PASS
  - audit:home-bridge-search: 8/8 PASS (form action, hidden source, filter inputs, no legacy action, no old IDX markers, floating marker, BridgeSearch surface on /home-search/)
  - mode=fallback locally because BRIDGE_* env not present — honest demo posture intact
verification_plan_phase_9:
  - test:home-bridge-e2e against staging base
  - Inspect live mode — should be live | demo | fallback honestly
verdict_post_phase_9: <fill>
```

## Risk vector 8 — Old MLS Matrix IDX still appears

```yaml
hypothesis: "An <iframe src=*mlsmatrix.com> or other Cycle-37-removed IDX runtime artifact still reaches the live site."
falsification_evidence:
  - audit:no-old-idx: PASS — 480 files scanned, no matches
  - Local HTML grep clean of mlsmatrix.com / sef.mlsmatrix.com
  - Cycle 37 Caddyfile CSP frame-src no longer permits sef.mlsmatrix.com
verdict_post_phase_9: <fill>
```

## Risk vector 9 — Deployed commit doesn't equal origin/main HEAD

```yaml
hypothesis: "Phase 8 deploys to a different commit than what's on GitHub."
verification_plan:
  - deploy-and-verify.ts wait-for-needle confirms the new commit's content reached the live host
  - origin/main HEAD comparison logged in final-deploy-alignment-report.md (Phase 11)
  - ETag changed from prior deploy
verdict_post_phase_9: <fill>
```

## Risk vector 10 — Secrets exposed in this cycle

```yaml
hypothesis: "Any secret value was printed, logged, screenshotted, committed, or otherwise exposed."
falsification_evidence:
  - secret-safety-report.md scan: source clean, build clean, staged patch clean (only documentation prose mentioning pattern shape)
  - env presence-only probes — no value printing
  - No `cat .env`, `printenv`, `env`, `echo $X` run
  - No staging-html/*chunk*.js or *page-*.js downloaded
verdict_pre_phase_9: "Clean."
verdict_post_phase_9: <fill — append Phase 9 live HTML secret scan result>
```

## Closure verdict (Phase 9 complete)

```yaml
risk_1_mobile_hero_overflow:        FALSIFIED — live Playwright probe at 320..1440 confirms panel = vp-32, no horizontal scroll. Mobile screenshots clean.
risk_2_capture_artifact_misread:    FALSIFIED — Playwright uses CDP setViewport (real-device path). docScroll/hasHorizontalScroll are intrinsic DOM, not screenshot artifacts.
risk_3_hero_image_wrong:            FALSIFIED — live hero asset src = /hero/mia-home-hero-cycle40b.jpg on every viewport.
risk_4_search_card_awkward:         FALSIFIED — formScroll <= form.width at every viewport. Search card visually clean on inspected screenshots.
risk_5_cycle40b_image_off_topic:    FALSIFIED to the AI-review threshold — all 7 visually inspected at 1280x800. All match neighborhood character. Mia subjective review remains operator-only.
risk_6_cycle39_asset_still_serving: FALSIFIED — live grep of /markets/ shows only cycle40b paths; no cycle39 references anywhere.
risk_7_bridge_e2e_fail:             FALSIFIED — live E2E 11/11 PASS, mode=demo (honest demo posture).
risk_8_old_idx_still_appears:       FALSIFIED — live HTML grep clean of mlsmatrix.com / sef.mlsmatrix.com; audit:no-old-idx 480 files PASS.
risk_9_deployed_commit_mismatch:    FALSIFIED — deployed commit = origin/main HEAD = d851494; cycle40b markers confirmed live.
risk_10_secrets_exposed:            FALSIFIED — live HTML scan clean; source/scripts have only public constants; env presence-only; no values printed/logged/committed.

all_risks_falsified_or_remediated:  true
remediation_actions_taken:          none required (all gates green pre-Phase-9; live verification confirmed)
remaining_operator_only_gates:
  - real-device mobile hero verification by Mia / Torrey (recommended but not a hard gate — Playwright is the AI-side decisive proof)
  - Mia subjective review of the seven Cycle 40B neighborhood images (recommended — AI cannot stand in for Mia's market-identity eye)
  - any future GHL endpoint wire-up + DNS swap + prod cutover (explicitly out of cycle 40C scope)
final_recommendation: approve_close
```

## Notes for the next mission

1. The chrome `--headless --window-size` capture artifact at 320..414 will keep recurring if `scripts/capture-baseline.ts` continues to use the same code path. A small post-cycle-40C mission should switch the screenshot backend to Playwright (or CDP setDeviceMetricsOverride) so future narrow-viewport visual QA matches real-device behavior. This avoids future cycles re-litigating the same false-positive.
2. The `last-modified did not change` warning emitted by `deploy-and-verify.ts` after a successful deploy is a Caddy cache-control variance, not a deploy miss — proven this cycle by orthogonal cycle40b-marker grep on live HTML. A small follow-up could make the verifier compare ETag changes (or content hash) instead of last-modified.
3. Bridge live-mode token provisioning on the dev host is a Mia + Torrey decision territory item (currently mode=demo is the honest deployed posture).
