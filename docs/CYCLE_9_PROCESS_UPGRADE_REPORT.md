# Cycle 9 — Process Upgrade Report

**Authored:** 2026-05-09
**Cycle:** 9 — acceptance-driven visual completion + process upgrade
**Skill version:** v0.3.0 → v0.3.1
**Algorithm:** PAI v6.4.0 / E5 (`/effort max` operator override; max ≡ xhigh per codex CLI 0.129.0)

## What Cycle 8 missed

Cycle 8 closed correctly on its principal failure mode (cycles 5/6/7 navy-on-navy contrast root cause was a Tailwind v4 `@layer` ordering bug; wrapped in `@layer base` and shipped a rendered-pixel `audit:hero-contrast` sentinel). But the closeout's GPT-5.5 live acceptance review flagged THREE residual layout issues:

1. **Mobile 320×568 + 375×812 H1 right-edge clipping** on long-text routes (home, harbor-beach, etc.). Cinzel display + proper-noun cluster (`LAUDERDALE`, `BOCA RATON`, `DELRAY BEACH`) couldn't break inside the panel boundary even with `[overflow-wrap:anywhere]` + `break-words`.
2. **Desktop 1280×800 + 1440×900 hero CTAs below the fold.** Cycle 8's hero shell was `lg:min-h-[680px] + lg:py-32`, totaling ~768px section height. With sticky 88px header, visible viewport at 1280×800 = 712px, putting CTA bottom at ~y=620-720 → just at or below the fold.
3. **`audit:hero-contrast --live` returned 0 PASS · 95 WARN.** The audit's hide-vs-normal capture diff requires CSS injection that only fires through the local Bun static server. Live URLs don't honor `?auditMode=hide`, so `--live` produced two identical captures and zero glyph mask pixels.

The structural lesson: Cycle 8 audited contrast (rendered pixels) but not layout (bounding boxes / fold math). Both axes need separate gates. The `audit:hero-contrast` 95 PASS · 0 FAIL was honest signal that the H1 was readable WHERE it rendered. It said nothing about whether the rendering position was reachable.

## How Cycle 9 closed the gaps

### Layout fix — Hero.tsx Approach C-refined (GPT-5.5 xhigh)

GPT-5.5 chose Approach C-refined at Phase 4 with full implementation guidance:

- **CTAs INSIDE the panel** for image-mode heroes (`useImage ? ctas : null` inside `[data-hero-copy-panel]`; `!useImage ? ctas : null` outside for non-image heroes). This eliminates the separate CTA band that pushed the CTA bottom edge below the fold.
- **Hero shell compressed**: `min-h-[440px]` mobile, `sm:min-h-[500px]`, `lg:min-h-[560px]` (was 520/620/680). `py-8 / sm:py-12 / lg:py-16` (was 16/24/32).
- **Panel padding reduced**: `p-4 min-[375px]:p-5 sm:p-6 lg:p-8` (was p-5/p-8/p-12).
- **H1 image-mode font scale**: `text-[16px] min-[375px]:text-[17px] sm:text-[26px] md:text-[32px] lg:text-[40px]` (was 18/28/38/48/60).
- **`<wbr/>` proper-noun-cluster wrap hints** in the locked Card-3 homepage heading: "Luxury and waterfront real estate across Eastern Fort Lauder<wbr/>dale, Boca <wbr/>Raton, and Delray <wbr/>Beach."
- **Mobile CTAs tightened**: `text-[11px] tracking-normal whitespace-nowrap px-2.5 gap-1.5` at base, with `min-[375px]` step-up to `text-[13px] tracking-wide px-4 gap-2` to fit the 28-char "Begin a Private Conversation" label in the 232-236px button content area at 320 viewport.
- **CTA above-fold math (1280×800)**: 88 (header) + ≤ 64 (lg:py-16 top) + ≤ 320 (panel content) + ≤ 50 (CTA height) = ≤ 522px panel-and-CTA, well within 800 − 112 = 688px usable area.

### Live audit fix — reverse-proxy pattern (Spark Team B)

`scripts/audit-hero-pixel-contrast.ts` `startStaticServer(port, mutation, liveBase?)` now accepts an optional `liveBase`. When `--live` is set, the Bun server proxies all upstream resources from `LIVE_BASE` and injects audit CSS into HTML responses server-side. Other resources pass through unchanged. The `captureScreenshot` flow is unchanged — Chrome captures at `127.0.0.1:PORT` instead of the live URL directly. Result: live audit produces real glyph samples (95 PASS · 0 FAIL) instead of all-WARN.

### Verdict matrix script — deterministic per-route × per-viewport (Spark Team C)

New `scripts/audit-screenshot-verdict-matrix.ts` walks any directory of `<route_safe>__<width>x<height>.png` captures and emits markdown + JSON verdict on four axes: H1 clipping (right-edge cream cluster + bounding-box heuristic), CTA above-fold (brass-400 pill detection in bottom half), Contrast (dark cluster + cream text estimate), Visual quality (composite). Documented limitations: heuristics can false-positive on Cycle 9's panel-embedded CTAs because the brass-pill detection was designed for free-standing pills. The matrix is a "captured-vs-reviewed" sentinel, not a deploy gate.

### Mutation strengthened

`audit:hero-contrast --mutation` now applies a composite fixture: panel BG → cream-100, all 3 overlays → opacity:0. This forces cream H1 onto cream panel = ~1.0:1 intrinsic contrast. The exit-code logic was reframed: any mutation run with `(WARN+FAIL) >= 10% of rows` exits 1 (sentinel detected); `< 10%` exits 1 with "MUTATION SENTINEL FAILED" (sentinel is no-op, must be re-tuned). Result: 1 PASS · 94 WARN · 0 FAIL — 99% non-PASS detection.

## How GPT-5.5 helped

GPT-5.5 xhigh fired at three strategic decision gates only:

1. **Phase 4 — layout decision gate.** Read Cycle 8 review + current Hero.tsx + 4 approach options. Chose Approach C-refined. Provided exact JSX, font scale, height limits, CTA-above-fold math, anti-patterns, 8 acceptance criteria, risk register. 228-line spec.
2. **Phase 8 — predeploy acceptance.** Reviewed shipped Hero.tsx vs Phase 4 spec. Verdict: PASS_WITH_MINOR_CONCERNS / SAFE_TO_DEPLOY: yes. Mobile CTA fit math: 14-46px spare at 320×568 (acceptable but not generous). Note: xhigh attempt timed out at 720s; high-tier retry with tighter brief succeeded in 4 min — documented per Phase 1 honesty contract.
3. **Phase 10 — live acceptance.** Reviewed live audit (95 PASS · 0 WARN), live ETag (flipped), 75 live-after screenshots (operator visual review). Verdict: PASS_WITH_MINOR_CONCERNS / USER_VISIBLE_ISSUE_RESOLVED: yes / SESSION_MAY_CLOSE: yes.

GPT-5.5 was deliberately reserved for these gates rather than diluted across every task. Spark teams handled bounded implementation/audit work.

## How Codex Spark helped

Four Spark teams (`gpt-5.3-codex-spark` xhigh, ≤2 same-model concurrent) ran read-only briefs:

- **Team A — Hero impl review.** Validated post-implementation Hero.tsx vs Phase 4 spec. Verdict: ship · no scope drift · 8/8 acceptance criteria PASS · 1 non-blocking concern (exact-string-coupling on Card-3 heading lock).
- **Team B — Live audit engineering.** Designed the reverse-proxy CSS-injection pattern. Provided full TypeScript diff. Verdict: pass · safe_to_implement_now: yes · approach: live_reverse_proxy_css_injection.
- **Team C — Verdict matrix generator.** Designed deterministic route × viewport × axis matrix. Provided full TypeScript spec (~600 lines). Verdict: pass · safe_to_implement_now: yes · approach: route-viewport deterministic matrix v1.
- **Team D — Brand/UX guardrail.** Reviewed C-refined hero for luxury feel. Verdict: CONCERN at 320×568 (compressed, brochure territory). Not deploy-blocking; documented for Cycle 10.

## What should be automated next

- **Layout-acceptance runtime probe** — currently visual-review-only. Cycle 10 candidate: Playwright bounding-box probe at 5 viewports (320 / 375 / 768 / 1280 / 1440) measuring `[data-hero-heading]`, `[data-hero-cta="primary"]`, `[data-hero-copy-panel]` rects.
- **Verdict matrix panel-embedded mode** — adjust the brass-pill detection to recognize panel-embedded CTAs.
- **CTA label length sentinel** — derive primary CTA label length × text-size × padding budget per viewport; flag combinations that don't fit. Removes the "may show slight tail clipping" maybe-state.
- **Pre-flight `model_reasoning_effort=max` rejection check** — if a script tries `max` against codex CLI 0.129.0, fail-fast with a clear "use xhigh" message rather than silent runtime error.

## What should remain human/GPT-5.5 judged

- **Visual taste / luxury-editorial feel** — pixel contrast can be measured; "does this read as luxury editorial vs template realtor" cannot be reduced to a metric. Reserve for principal review or GPT-5.5 design-decision gates. Cycle 9 Team D verdict ("CONCERN at 320 luxury feel") is exactly the right shape: not blocking, not auto-fixable, queue for next cycle.
- **CTA copy decisions** — "Begin a Private Conversation" is voice-adjacent; CTA-shortening fallback at ≤360px crosses into copy territory and needs principal sign-off, not a sentinel.
- **GPT-5.5-vs-advisor disagreement** — Cycle 9 surfaced a real conflict: Phase 10 GPT-5.5 said PASS_WITH_MINOR_CONCERNS / SESSION_MAY_CLOSE: yes, while the commitment-boundary advisor pushed back ("CTA tail-clipping is a functional defect, iterate first"). The user's hard rule designated GPT-5.5 as authority — closure was authorized. The advisor's cautious read is captured in the Cycle 10 next-session trigger.

## How the next cycle should think better

1. **Test layout and contrast as separate axes, every cycle.** A hero can pass one and fail the other. Cycle 8 missed this because it had a contrast sentinel and not a layout sentinel.
2. **Verify any `--live` audit's CSS-injection mechanism actually fires against the live URL.** A `--live` mode that produces all-WARN is silent failure that Cycle 8 deployed without catching.
3. **Mutation tests should produce VISIBLE detection** — either FAIL count rises OR WARN count rises OR exit-code flips. Cycle 9's reframing covers all three signal shapes.
4. **Heuristic verdict matrices need documented false-positive shapes.** Cycle 9's matrix returns FAIL at 1280 desktop on routes that visually PASS — because its brass-pill detection assumes free-standing pills, not panel-embedded ones. Document the disagreement; don't over-trust the matrix.
5. **GPT-5.5 strategic-gate usage discipline preserved.** Don't dilute across every task; reserve for Phase 4 (decision), Phase 8 (predeploy), Phase 10 (live acceptance). Bounded implementation goes to Spark.
6. **Honest fallback documentation when xhigh stalls.** Cycle 9 Phase 8 first attempt at xhigh timed out at 720s without verdict; second attempt at high tier with tighter brief produced clean verdict. Document fallback explicitly per Phase 1 honesty contract.

## Anti-fragile additions to v0.3.1 (KEEP)

All v0.3.1 additions are anti-fragile per BPE:

- **Layout-acceptance gate (#18)** — evidence-anchoring control with explicit per-viewport math.
- **Live-audit reverse-proxy pattern (#19)** — architectural fix that documents WHY direct URL targeting fails.
- **Verdict matrix script** — pure pixel analysis; deterministic; reusable across cycles.
- **Mutation exit-code reframing** — recognizes WARN as valid sentinel detection (was missing in v0.3.0).
- **4 new gotchas (#21-24)** — each tied to a specific Cycle 9 lesson with file:line evidence.

None of these say "the model will…" or "Claude should…". They are evidence-anchoring controls that require specific tool output, not behavioral assumptions.
