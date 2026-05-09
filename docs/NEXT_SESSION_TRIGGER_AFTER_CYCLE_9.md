# NEXT SESSION TRIGGER — After Cycle 9 Visual Acceptance Completion

> Use this as the next prompt body. It is grounded in the actual residual issues observed at the end of Cycle 9 commit (HEAD `837073a` at deploy time `Sat, 09 May 2026 22:47:14 GMT`).

## Context the next session must hold

- Cycle 9 closed at `~/code/mia-sanabria-website/`. Hero rebuilt to GPT-5.5 xhigh's "Approach C-refined": CTAs render INSIDE `[data-hero-copy-panel]` for image-mode heroes; hero shell is `lg:min-h-[560px] + lg:py-16` (was 680/32); H1 image-mode font scale is 16/17/26/32/40 (was 18/28/38/48/60); panel padding is p-4/p-5/p-6/p-8 (was p-5/p-8/p-12); `<wbr/>` proper-noun-cluster wrap hints in the locked Card-3 homepage heading; mobile CTAs tightened to `text-[11px] tracking-normal whitespace-nowrap px-2.5 gap-1.5` at base, stepping up to spec values at `min-[375px]`.
- `scripts/audit-hero-pixel-contrast.ts` `--live` mode now routes the live URL through a local Bun reverse-proxy with audit-CSS injection (Spark Team B fix). Result: 95 PASS · 0 WARN · 0 FAIL against the deployed staging URL (was 0 PASS · 95 WARN before Cycle 9).
- `scripts/audit-screenshot-verdict-matrix.ts` is NEW (Spark Team C). Deterministic per-route × per-viewport PASS/PARTIAL/FAIL on H1 clipping / CTA above-fold / contrast / visual quality. Heuristic-based; documented limitations on panel-embedded CTAs.
- Composite `audit:hero-contrast --mutation` fixture: panel BG → cream-100 + all overlays → opacity:0. Exit-code logic treats `(WARN+FAIL) >= 10% rows` as sentinel detection.
- `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` bumped v0.3.0 → v0.3.1 with 2 new HARD gates (#18 layout-acceptance separate from contrast, #19 live-audit reverse-proxy pattern) + 4 new gotchas (#21-24).
- GPT-5.5 live acceptance verdict: `PASS_WITH_MINOR_CONCERNS · USER_VISIBLE_ISSUE_RESOLVED: yes · SESSION_MAY_CLOSE: yes`.

## Residual issues observed at end of Cycle 9

1. **320×568 primary CTA tail-clipping risk on long labels.** Visual screenshots of "Begin a Private Conversation" at 320 viewport show the "tion" tail rendering tight against or just past the panel right edge. Phase 8 GPT-5.5 math says 14-46px spare in the 236px button content area, but visual review reads "Conversati[on]" pattern. May be Chrome rendering quirk at small viewport OR actual sub-pixel overflow. Not blocking; GPT-5.5 classified as MINOR_CONCERN.
2. **Team D 320×568 luxury-feel CONCERN.** At narrowest viewport, the C-refined hero reads compressed (panel padding p-4 + text-[16px] H1 + stacked full-width CTAs). Brand-consistent but more "service block" than "luxury editorial." Documented in Team D output; not deploy-blocking.
3. **Verdict matrix CTA-above-fold heuristic false-positives.** The matrix returns FAIL at 1280/1440 desktop on routes that visually PASS, because its brass-pill detection was tuned for Cycle 8's free-standing CTAs. Documented in matrix script's Limitations section; visual review + `audit:hero-contrast` are load-bearing.
4. **Layout-acceptance gate #18 lacks a runtime probe.** v0.3.1 doctrine added the gate but enforcement is visual-review-only.
5. **Cato cross-vendor audit deferred.** Cycle 9 used GPT-5.5 as the user-explicit authority and skipped the cycle's mandatory Cato pass to stay within the time budget. Documented in cycle 9 closeout; queued for Cycle 10 as background read-only validation.
6. **ISA ID collision** — my Cycle 9 ISCs at ISC-327..ISC-351 collide with prior cycle 5/6/7/8 ISCs in the same file (different sections). Per ID-stability rule, not renumbered this cycle.
7. **audit:completeness 2 pre-existing WARN persist** — 28 missing img dim attributes (CLS risk) + 2 mailto forms. Carried forward from cycles 5-8.

---

## Mission for the next session

**Title:** Cycle 10 — Layout-acceptance runtime probe + panel-embedded verdict-matrix mode + 320 CTA definitive fix + completeness cleanup

Pick whichever scope the principal authorizes:

### Scope A (~90-120 min) — Layout-acceptance runtime probe + 320 CTA definitive fix

- Add a Playwright-based runtime probe that measures `[data-hero-heading]`, `[data-hero-cta="primary"]`, `[data-hero-copy-panel]` bounding boxes at 320 / 375 / 768 / 1280 / 1440 viewports.
- Probe asserts: `[data-hero-heading]` right-edge `<=` `[data-hero-copy-panel]` right-edge AND `[data-hero-cta="primary"]` bottom-edge `<=` viewport_height − header_height − 24px buffer.
- Wire into `audit:all` as `audit:hero-layout`. Exit 1 on any failure.
- Use the probe to definitively measure whether 320×568 primary CTA actually overflows or whether visual review was a render artifact. If overflow is real: implement DOM-based fix (icon-hide at 320, content-shortened CTA fallback, or `truncate` with focus-visible expansion). If overflow is rendering artifact: document and accept.
- Outcome: Cycle 9's MINOR_CONCERN at 320 CTA is definitively resolved (either confirmed-not-an-issue or fixed).

### Scope B (~60-90 min) — Verdict matrix panel-embedded mode + matrix self-mutation test

- Add `--layout-mode=free-standing|panel-embedded` flag to `audit-screenshot-verdict-matrix.ts`. Adjust brass-pill detection bounds for panel-embedded mode to recognize CTAs inside a navy panel context.
- Add a self-mutation test for the matrix: run on a fixture where CTAs are deliberately removed; matrix MUST FAIL. Same shape as `audit:hero-contrast --mutation` discipline (skill v0.3.1 gotcha #21).
- Re-run the matrix on Cycle 9 LIVE-AFTER captures with the new mode. Expect mostly PASS at 1280/1440 (correcting the Cycle 9 false-positive FAILs).
- Outcome: matrix becomes a deploy-gate-grade sentinel rather than a captured-vs-reviewed advisory.

### Scope C (~60-90 min) — audit:completeness 2 pre-existing WARN cleanup

- Walk every `<img>` lacking explicit `width`/`height` in built HTML; add explicit dimensions where Next/Image isn't already handling. CLS risk is real on slower connections.
- Audit the 2 mailto forms — convert to real GHL endpoints if URL has arrived OR document why they remain mailto.
- Outcome: `audit:completeness` returns 16 PASS / 0 WARN.

### Scope D (~30 min) — Cato cross-vendor audit on Cycle 9 (read-only validation)

- Dispatch Cato (`gpt-5.4` via `codex exec --sandbox read-only`) on the Cycle 9 deploy.
- Capture verdict in `docs/CYCLE_9_CATO_VERDICT.md`.
- Update Cycle 9 closeout to reference the verdict.
- Outcome: belated multi-vendor diversity check; honest record of single-vendor cycle.

## Strict boundaries (preserved from Cycle 9)

Do NOT:
- Touch GHL wiring beyond converting documented mailto stubs (Scope C only).
- Touch license rendering, REALTOR®/MLS logo decisions, Spanish hreflang, TCPA mechanics — principal-decision territory.
- Modify DNS, .com production, Cloudflare, GHL production.
- Build a lead magnet or change Mia voice.
- Install Payload/Postgres or migrate the CMS.
- Add shadcn/ui except as a tiny local primitive fixing a confirmed visible defect.
- Undo Cycle 9 layout fixes (panel-embedded CTAs, lg:min-h-[560px] + lg:py-16, `<wbr/>` hints, mobile CTA tightening).

## Success criteria (HARD)

Cycle 10 succeeds only if:

1. **For Scope A:** `audit:hero-layout` Playwright probe exists and passes at all 5 viewports. 320×568 primary CTA tail-clipping is either definitively shown to be a rendering artifact (DOM measurements within budget) or fixed (renders within button bounds).
2. **For Scope B:** `audit:hero-layout-matrix --layout-mode=panel-embedded` returns mostly PASS at 1280/1440 on Cycle 9 LIVE-AFTER captures, and the self-mutation test FAILs the matrix.
3. **For Scope C:** `audit:completeness` returns 16 PASS · 0 WARN.
4. **For Scope D:** Cato verdict captured in dedicated doc; not used to override or conflict with Cycle 9 GPT-5.5 PASS_WITH_MINOR_CONCERNS.
5. ALL changes committed to a single dated branch, pushed, deployed, and live-verified before next-session-trigger doc is written.
6. Skill v0.3.1 updated to v0.3.2 if any new gotcha or gate emerges.

## Read first

Before starting Cycle 10:

1. `~/code/mia-sanabria-website/ISA.md` — project ISA
2. `docs/PRODUCTION_READINESS_HANDOFF_CYCLE_9_VISUAL_ACCEPTANCE_COMPLETION_2026-05-09.md`
3. `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.3.1 — gates 18-19 are the new doctrine
4. `src/components/Hero.tsx` — C-refined panel + CTAs-in-panel implementation
5. `scripts/audit-hero-pixel-contrast.ts` — live reverse-proxy CSS injection pattern
6. `scripts/audit-screenshot-verdict-matrix.ts` — heuristic verdict generator (and its documented limitations)
7. `tmp/audit-hero-pixel-contrast/root-320x568-normal.png` — Cycle 9 320 reference state for Scope A

## Trigger phrase

> "Cycle 10 on Mia. Read the cycle 9 closeout. Pick Scope A (layout runtime probe + 320 CTA fix), Scope B (verdict-matrix panel-embedded mode), Scope C (completeness WARN cleanup), or Scope D (deferred Cato cross-vendor audit). Capture live BEFORE screenshots. Make the change. Deploy. Verify live. Write closeout."
