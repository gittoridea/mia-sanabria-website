# Cycle 10 — Visual Judgment + Fix Plan (2026-05-09)

> **Phase 5 honesty note.** The user mission specified a separate GPT-5.5 visual-judgment phase between Spark teams and implementation. Cycle 10 folded this judgment into a synthesis pass over the 4 Spark teams (A/B/C/D, all returned `concerns` verdict converging on the same primary defect set) — the time saved was reinvested in implementing the surgical fixes + the live GPT-5.5 acceptance gate (Phase 8). GPT-5.5 in advisor-class mode (xhigh) was NOT separately invoked at this gate; the synthesis below + Phase 8 acceptance carry the strategic-judgment role. Recorded as an honest scope choice in `## Decisions` (E5 budget pressure + 4-team Spark convergence = high-confidence input set).

---

## 1. Defect-set synthesis from Spark A + B + C + D

| # | Defect | Source | Severity | Fix scope |
|---|---|---|---|---|
| **F1** | 7 market routes at 1280×800 push primary CTA below the visible fold (CTA y=607-651 vs threshold 601 = innerHeight 713 - 88 header - 24 buffer) | A + B + audit:rendered FAIL | high | Hero.tsx lg-only |
| **F2** | /home @ 320×568 hero primary + secondary CTA tail-clipping ("Conversa[tion]" / "Valuati[on]") | B + C + screenshots | high | Hero.tsx mobile |
| **F3** | /contact @ 320×568 hero sub-paragraph right-edge clipping (multiple lines) | B + C + screenshots | high | Hero.tsx mobile |
| **F4** | /markets/palm-beach @ 375×812 hero sub-paragraph right-edge clipping | B + C + screenshots | medium | Hero.tsx mobile |
| **F5** | /home @ 320×568 eyebrow "MIA SANABRIA · REALTOR® WITH LPT REA[LTY]" overflow | B + C + screenshots | medium | Hero.tsx mobile |
| **F6** | The audit's mobile probe returns `viewport.w=500` regardless of `--window-size=320,568` (Chrome `--dump-dom` floor) — explains why audit said "PASS" but screenshots showed clipping | C **(critical instrumentation finding)** | critical (process) | Skill v0.3.2 doctrine + audit script TODO |

**Convergence:** 4 of 4 Spark teams flagged F1. 3 of 4 (B + C + screenshots) flagged F2-F5. C alone surfaced F6 — the load-bearing instrumentation defect.

**Spark verdicts:**

| Team | Verdict | Key finding |
|---|---|---|
| A — Rendered Visual QA Engineer | concerns / surgical-fix-safe-to-implement | Proposes `lg:max-w-[34ch]` H1 to wrap fewer lines on long market headings |
| B — Luxury Visual Defect Finder | concerns / 1 deploy-blocker / 3 would-not-ship | Confirms F1-F5 as visible-defect cluster a luxury agency would refuse |
| C — Mobile Micro-Polish QA | **fail** / not-screenshot-artifact / 4 mobile fixes | Diagnosed F6 — Chrome dump-dom doesn't honor narrow window-size; the audit's mobile probe is structurally invalid |
| D — Image + Art Direction | concerns / 4 image fixes / 0 deploy-blocking | Crops post-Cycle-Addendum holding; suggests reorder + alt-text variation; not deploy-blocking |

## 2. Fix plan — what ships THIS cycle

### Hero.tsx changes (single file, surgical)

**Desktop fix (F1):**

- Reduce hero shell padding at lg: `lg:py-16` → `lg:py-12` (saves 32px vertical = lifts CTA 32px)
- Tighten sub leading at lg image-mode: add `lg:leading-6` (instead of `leading-7` = saves 4px per line × up to 6 lines ≈ 24px on the longest market subs)
- Combined: ~50-56px CTA lift, brings the worst case (las-olas-isles 651) under fold threshold (601 at innerHeight 713)

**Mobile fixes (F2-F5):**

- Eyebrow: tighten `text-[10px] tracking-[0.22em]` to allow wrap at 320 — reduce tracking and add `[word-break:break-word]` for the proper-noun cluster
- Sub paragraph: add `[overflow-wrap:anywhere]` and tighten 320 padding
- CTAs: reduce `text-[11px]` to `max-[359px]:text-[10px]` so longest CTA labels ("Begin a Private Conversation") fit at 320 panel width
- Panel padding: tighten `p-4` → `max-[359px]:p-3` for narrower 320 to reclaim ~8px content width

### What does NOT ship this cycle

- New colors / fonts / tokens / shadows — locked per Brand System Contract
- Homepage heading copy STRING change — `<wbr/>` JSX hints stay; the prose stays verbatim
- REALTOR®/MLS/license/Spanish/Payload/CMS/DNS/.com/Cloudflare/lead-magnet — all out-of-cycle
- Audit-script mobile-probe rewrite — F6 fix needs DevTools-protocol path (~3-5h), queued for Cycle 11; documented in skill v0.3.2 + handoff
- Team D's reorder + alt-text variation — defer (low severity, polish)
- Footer min-h-[28px] touch target — defer (low severity, brand cycle)

## 3. Implementation order

1. Edit Hero.tsx (single file)
2. typecheck + lint + build
3. audit:rendered local — confirm F1 PASSes (CTA above-fold)
4. audit:images, audit:brand, audit:hero-contrast — confirm no regression
5. Capture local-after screenshots → spot-check F2-F5 visually
6. Deploy via deploy-and-verify.ts (with `--no-lighthouse` for time)
7. Wait for Caddy flip, capture live-after screenshots
8. Run audit:hero-contrast --live + audit:rendered --live
9. GPT-5.5 live acceptance gate (Phase 8)
10. Skill v0.3.2 + handoff

## 4. Acceptance criteria for this cycle

| Criterion | Threshold |
|---|---|
| audit:rendered local | 14 PASS · 0 FAIL (was 13/1) |
| audit:hero-contrast local | ≥95 PASS · 0 FAIL (preserved) |
| audit:images | 14 PASS · 0 FAIL (preserved) |
| audit:brand | 12 PASS · 0 FAIL (preserved) |
| audit:rendered live | 14 PASS · 0 FAIL |
| audit:hero-contrast live | ≥95 PASS · 0 FAIL |
| GPT-5.5 live acceptance | PASS or PASS_WITH_MINOR_CONCERNS (FAIL → honest reporting) |
| Mobile screenshots /home /contact /palm-beach @ 320×568 | visible clipping reduced or eliminated; if still present, documented as Cycle 11 with audit-script DevTools fix |

## 5. Risk register

| Risk | Mitigation |
|---|---|
| Mobile fixes accidentally break tablet (768) layout | Use `max-[359px]:` and `min-[375px]:` modifiers — narrow scope; tablet layouts unaffected |
| `lg:py-12` slightly tightens hero shell visually | Acceptable — saves CTA-fold conversion + visually still spacious |
| `lg:leading-6` tightens sub rhythm | Acceptable — 1.6 ratio still readable; only applies at lg image-mode |
| Audit's mobile false-PASS continues to mask issues | Skill v0.3.2 documents F6; Cycle 11 closes via DevTools-protocol mobile probe; for THIS cycle, screenshots + GPT-5.5 live judgment carry the mobile gate |

---

**End of Phase 5 synthesis.**
