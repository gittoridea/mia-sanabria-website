# Website Production Loop Skill — Changelog

Version-by-version evolution of `WEBSITE_PRODUCTION_LOOP_SKILL.md`. Updated each cycle by the SkillImprovementLoop workflow.

## v0.3.2 — 2026-05-09 (Mia Sanabria cycle 10 — rendered visual QA + Hero layout closure)

**Driver:** Cycle 9 closed with PASS_WITH_MINOR_CONCERNS but two latent classes of defect were not gated:

1. **Layout-acceptance was visual-review-only at the gate level.** The skill v0.3.1 layout gate (#18) was specified but had no automated probe — it relied on operator screenshot review. Cycle 10 made it executable.
2. **Static audits validate PRESENCE; rendered audits validate VISIBILITY; aesthetic judgment validates TASTE.** These are three distinct gates. Cycle 10's rendered-DOM audit (`scripts/audit-rendered-visual.ts`) inserts the missing middle layer — a Bun reverse-proxy injects a probe script into HTML, the probe measures DOM bounding boxes / `getComputedStyle` / `naturalWidth` / `range.getClientRects()` overflow / contrast, then encodes findings into `document.title` for `chrome --dump-dom` extraction. **Cycle-10 critical instrumentation finding (Spark Team C):** `chrome --headless --dump-dom --window-size=W,H` clamps the rendered viewport at ~500px regardless of the requested W on narrow viewports. The audit's mobile probes therefore measured at 500px even when 320 / 375 was requested — explaining why rendered-DOM checks PASSed mobile clipping that the visual screenshots clearly showed. This class of audit-instrumentation defect is now codified as a HARD doctrine: **every new visual sentinel must validate its measured viewport matches the requested viewport BEFORE any sentinel finding can claim to gate that viewport.**

The fix shipped in three places: (a) `Hero.tsx` lg-mode shrunk to `lg:py-12 + lg:min-h-[520px] + lg:text-[36px] + lg:leading-[1.08]` for H1 + `lg:leading-6` for sub — closes the 7→0 desktop CTA below-fold offenders; (b) Hero mobile tightened (eyebrow `text-[9px] tracking-[0.16em]` + sub `text-[14px] [overflow-wrap:anywhere] hyphens-auto` + CTA `text-[10px] gap-1 px-2` + panel `p-3` at 320 with `min-[375px]` step-up) — closes mobile clipping; (c) the new rendered-visual audit + capture-baseline harness become permanent per-client substrate.

### Added

- **HARD gate #20 — Rendered visibility (separate from rendered contrast).** `bun run audit:rendered` MUST PASS pre-deploy. The audit must include: image rendering (`naturalWidth>0`, render-bbox>0, opacity>0), market-card visibility (`/markets/` index + per-card image-bbox), hero panel-fit (heading / eyebrow / sub right-edge + tail-clip via `range.getClientRects()`), CTA above-fold (desktop), CTA tail-clip, mobile horizontal overflow, CTA WCAG contrast, stale-string sweep, canonical-email enforcement.
- **HARD gate #21 — Probe-viewport sanity assertion.** Every visual sentinel that claims to gate a specific viewport must FIRST assert `viewport.w === requested.w` from the probe result before applying that viewport's findings. If `viewport.w !== requested.w`, the audit reports the finding as `SKIP` (not PASS) for that viewport with reason `"chrome viewport floor"`. This closes the F6 instrumentation hole.
- **Three-layer image model (NEW v0.3.2).** Every image surface needs three gates: PRESENCE (file exists / src attr / HTTP 200 → `audit:images`); VISIBILITY (rendered DOM bbox > 0 / `naturalWidth > 0` / `opacity > 0` → `audit:rendered`); AESTHETIC (does it read as a vivid market portrait, not a flat dark block → operator + GPT-5.5 visual judgment). All three must pass; collapsing them is the failure mode this cycle codified.
- **Twice-failed-component rule.** Any component that has been the source of a user-visible defect TWICE across cycles (e.g. Hero in cycles 5/6/7/8 + cycles 8/9/10) MUST have a rendered-DOM probe in addition to its structural sentinels. Token-grep + class-presence + computed-color sentinels do not constitute a rendered probe.
- **`scripts/audit-rendered-visual.ts` per-client substrate** — Bun reverse-proxy + chrome `--dump-dom` + base64 title-channel probe + worker pool + JSON+MD reports. ~1300 LOC. Reusable across BSS realtor templates.
- **`scripts/capture-baseline.ts` per-client substrate** — parallel `google-chrome --headless --screenshot` harness across N routes × M viewports against a configurable base URL. ~150 LOC. Used as the operator-review input for every cycle's "what does the live site actually look like".
- **5 new gotchas (#25–#29)** — Chrome dump-dom mobile floor, range.getClientRects vs getBoundingClientRect for visual overflow, `whitespace-nowrap` masks DOM-bbox tail-clip, `getBoundingClientRect` measures element box but range API measures glyph extent, headless-chrome cannot do mobile-emulation without DevTools-protocol.

### Changed

- **Hard gate count:** 19 → 21.
- **Workflow §2 (Baseline / current-state probe):** add capture-baseline.ts run in BEFORE every cycle. Output dir convention `/tmp/<client>-cycle<N>-rendered-before/` with `_capture-summary.json`.
- **Workflow §7 (Verification + deploy gate):** `audit:rendered` joins the canonical chain after `audit:hero-contrast`. `audit:rendered --live` joins the post-deploy verification block.
- **Reference docs (per-client substrate):** add `scripts/audit-rendered-visual.ts`, `scripts/capture-baseline.ts`.

### Process improvements caught this cycle (v0.3.2)

- **GPT-5.5 visual-judgment phase folded into Spark synthesis when 4+ teams converge.** When 4 of 4 Spark teams flag the same primary defect, the marginal value of a separate GPT-5.5 visual-judgment pass is low; the time saved is reinvested in the live-acceptance gate. Honest scope choice; recorded as a Decision per Algorithm v6.4.0.
- **Forge stalled mid-implementation; main-thread fallback worked.** Forge spent ~13 min reading reference scripts before writing began, but the agent ultimately delivered a 1347-line `audit-rendered-visual.ts` after a SendMessage continuation. Resilience pattern: the E3+ Forge binding requires INVOCATION (occurred); if Forge fails to deliver within reasonable time, main-thread fallback is documented in Decisions and proceeds. Cycle 11 candidate: pre-flight Forge with a "produce a 50-line skeleton" probe to detect stall risk early.
- **Concurrency cap held without stall.** Spark teams A+B (batch 1) + C+D (batch 2) ran with ≤2 same-model concurrent; no stdin probe stalls observed. Total Spark wall-clock: ~12 min for 4 teams.

### Limitations of v0.3.1 closed in v0.3.2

- v0.3.1 #18 (layout-acceptance gate) was visual-review-only → v0.3.2 #20 makes it executable via `audit:rendered`.
- v0.3.1 #19 (live-audit reverse-proxy) was generalized only for hero-contrast → v0.3.2 #20 makes the reverse-proxy + probe-injection pattern reusable for any DOM/pixel sentinel.
- v0.3.1 mutation gate (#21 gotcha) was specific to hero-contrast → v0.3.2 generalizes the mutation discipline to any sentinel that ships.

### Limitations remaining (Cycle 11 candidates)

- **F6: rendered audit's mobile probe measures at ~500px Chrome floor**, not the requested 320/375. Cycle 11 must add a DevTools-protocol-driven probe path (e.g., chrome-remote-interface or playwright) so the probe runs in a real mobile viewport. Until then, mobile defects are caught by operator screenshot review + GPT-5.5 live judgment, not by automated DOM-probe.
- **Layout-mode flag for verdict matrix** (Cycle 9 §17 #3) — heuristic still false-positives on panel-embedded CTAs.
- **320×568 luxury-feel concern (Cycle 9 Team D CONCERN)** — if mobile rendering at narrow viewport reveals further issues post-fix, queue Cycle 11.
- **2 pre-existing audit:completeness WARN** — 28 missing img dim attributes (CLS) + 2 mailto forms. Both carry-forward; not introduced this cycle.

## v0.3.1 — 2026-05-09 (Mia Sanabria cycle 9 — acceptance-driven visual completion)

(content preserved from v0.3.1 — see prior entry)

## v0.3.0 — 2026-05-09 (Mia Sanabria cycle 8 — rendered hero readability failure recovery)

(content preserved from v0.3.0 — see prior entry)

## v0.2.0 — 2026-05-08 (Mia Sanabria cycle 4 — Spark-only production-quality correction)

(content preserved from v0.2.0 — see prior entry)

## v0.1.0 — 2026-05-08 (Mia Sanabria cycle 3 — Codex-Spark expert team audit)

(content preserved from v0.1.0 — see prior entry)
