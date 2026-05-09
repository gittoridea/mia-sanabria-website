# Website Production Loop Skill — Changelog

Version-by-version evolution of `WEBSITE_PRODUCTION_LOOP_SKILL.md`. Updated each cycle by the SkillImprovementLoop workflow.

## v0.3.1 — 2026-05-09 (Mia Sanabria cycle 9 — acceptance-driven visual completion)

**Driver:** Cycle 8's GPT-5.5 live acceptance review returned **PASS on contrast root cause + FAIL on layout polish** simultaneously: the cream H1 on navy panel hit ≥14:1 contrast (`audit:hero-contrast` 95 PASS · 0 FAIL) AND the hero still right-clipped on 320×568 / 375×812 mobile (long-text routes) AND the desktop CTAs sat below the 1280×800 / 1440×900 fold (because lg:min-h-[680px] + lg:py-32 = ~768px section vs. 712-812 visible viewport after 88px sticky header). Plus `audit:hero-contrast --live` returned 0 PASS · 95 WARN — the live mode was structurally broken because the audit-CSS injection only fires through the local Bun static server. Cycle 9 closed all three gaps. The structural lesson: **layout-acceptance and contrast-acceptance are different gates**. A hero can pass one and fail the other; conflating them lets a real defect ship.

The fix was structural in three places: (a) Hero.tsx uses GPT-5.5 xhigh's "Approach C-refined" — CTAs render INSIDE `[data-hero-copy-panel]` for image-mode heroes, hero shell drops to `lg:min-h-[560px] lg:py-16` (was 680/32), H1 image-mode font scale tightened to 16/17/26/32/40 (was 18/28/38/48/60), `<wbr/>` proper-noun-cluster wrap hints in the locked Card-3 homepage heading, mobile CTAs at `text-[11px] tracking-normal whitespace-nowrap px-2.5` (with `min-[375px]` step-up to spec values); (b) `scripts/audit-hero-pixel-contrast.ts` `--live` mode now routes the live URL through a local Bun reverse-proxy that injects audit CSS into HTML responses (Spark Team B's spec); (c) new `scripts/audit-screenshot-verdict-matrix.ts` provides deterministic per-route × per-viewport PASS/PARTIAL/FAIL on H1 clipping / CTA above-fold / contrast / visual-quality (Spark Team C's spec; heuristic-based; documented limitations on in-panel CTA arrangements). Composite mutation in `audit:hero-contrast --mutation` was strengthened: panel BG → cream-100 + all overlays → opacity:0; mutation exit-code logic now treats `(WARN+FAIL) >= 10% of rows` as sentinel-success and `< 10%` as sentinel-failure (a fully-green mutation run = no signal).

### Added

- HARD gate #18 — **Layout-acceptance gate, separate from contrast** — image-mode heroes test layout per-viewport: H1 right-edge `<=` panel right-edge (mobile clipping) AND primary CTA bottom edge `<=` viewport_height − header_height − 24px buffer (desktop fold). Either failure blocks visual PASS regardless of contrast verdict.
- HARD gate #19 — **Live-audit reverse-proxy pattern** — `--live` audits MUST route the live URL through a local Bun static server with audit-CSS injection for HTML responses. Direct URL targeting + `?auditMode=hide` fails because live URLs don't honor query params for CSS injection.
- New per-client substrate: `scripts/audit-screenshot-verdict-matrix.ts` — deterministic verdict matrix generator (route × viewport × axis); Bun + sharp; CLI flags `--input` `--label` `--output-md` `--output-json`; reusable for any future visual capture set.
- 4 new gotchas (#21–#24) — mutation FAILs and WARNs both count as detection; layout vs contrast acceptance separation; live-audit CSS injection requires reverse-proxy not direct URL; heuristic verdict matrices have FALSE-POSITIVE shapes that must be documented.

### Changed

- **Hard gate count:** 17 → 19.
- **`audit:hero-contrast` mutation fixture:** weak-scrim → composite (panel BG → cream-100 + all overlays → opacity:0 — produces 99% non-PASS rows).
- **`audit:hero-contrast` exit-code logic** — mutation run exits 1 on detection (≥10% non-PASS rows) AND on no-op (<10% non-PASS rows; "MUTATION SENTINEL FAILED" message). Clear separation between "audit caught the regression" and "audit isn't sensitive."
- **Per-client substrate** updated to require: `scripts/audit-hero-pixel-contrast.ts` (with `--live` reverse-proxy mode), `scripts/audit-screenshot-verdict-matrix.ts` (NEW v0.3.1).

### Process improvements caught

- **Codex CLI silent-fail pattern** — gpt-5.5 xhigh dispatches with stdin + arg-prompt sometimes return ZERO model output (just echo the input). Mitigation: dispatch with stdin-only (no arg-prompt), and increase timeout to ≥720s for complex briefs. Re-dispatch with reduced reasoning_effort if xhigh stalls. Document fallback explicitly per Phase 1 honesty contract.
- **Spark verdict matrix is "captured-vs-reviewed" not "deploy gate"** — heuristic-based pixel-cluster matrix returns false-positives on layouts that differ from its design assumptions (e.g. Cycle 9's panel-embedded CTAs trip the free-standing-pill detection). Visual review + rendered-pixel `audit:hero-contrast` are load-bearing; the matrix supplements them.
- **Forge race scope drift** prevention held — main-thread did Hero.tsx + audit edits; Spark teams ran read-only background reviews. No race despite parallel dispatch (per `feedback_forge_race_scope_drift.md`).
- **GPT-5.5 strategic-gate-only usage** preserved Cycle 8 doctrine: GPT-5.5 used at Phase 4 (layout decision), Phase 8 (predeploy), Phase 10 (live acceptance) only — bounded implementation work delegated to Spark teams (A/B/C/D).

### Limitations of v0.3.0 closed

- v0.3.0 gate #13 (rendered hero readability) was contrast-only; v0.3.1 #18 adds layout as separate axis.
- v0.3.0 gate #15 (live visual) referenced `audit:hero-contrast --live` but the script's `--live` mode was structurally broken; v0.3.1 #19 fixes the architecture.
- v0.3.0 gate #16 (audit-mutation) only checked exit-code; v0.3.1 #21 (gotcha) clarifies that WARN-shifted rows count as detection too.

### Limitations remaining (Cycle 10 candidates)

- **Layout-acceptance gate #18 lacks a runtime probe** — currently visual-review-only. Cycle 10 candidate: add a Playwright-based bounding-box probe at the 5 required viewports.
- **Verdict matrix's CTA-above-fold heuristic mis-detects panel-embedded CTAs** — Cycle 10 should add a "panel-embedded" mode that adjusts the brass-pill detection bounds.
- **320×568 primary CTA tail-clipping** — visually appears to clip on long labels (e.g. "Begin a Private Conversation") even though the math says 14-46px spare. Cycle 10 should DOM-probe the actual rendered text width OR add a content-shortened CTA fallback at ≤360px viewports.

## v0.3.0 — 2026-05-09 (Mia Sanabria cycle 8 — rendered hero readability failure recovery)

**Driver:** principal-visible PASS-vs-FAIL pattern persisted through cycles 5, 6, 7. Token + structural audits passed (35 PASS / 11 PASS / 12 PASS chains) while the user kept seeing illegible hero H1. Root cause: `src/app/globals.css` had `h1 { color: var(--color-navy-800); }` OUTSIDE any `@layer`. In Tailwind v4, raw CSS rules without `@layer` outrank ALL utilities — even though `.text-cream-50` has higher specificity (0,1,0) than `h1` (0,0,1), `@layer` ordering is consulted FIRST. Result: every image-mode H1 with `class="text-cream-50"` rendered as navy-800 across cycles 5/6/7 — invisible navy-on-navy. Three cycles of "stronger overlay" tweaks were treating a CSS-cascade bug as a contrast-math problem. Audits passed because they grepped class strings, not computed colors.

The fix was structural in TWO places: (a) wrap typography defaults in `@layer base` so utilities can override; (b) ship a sentinel that proves rendered pixels, not class presence.

### Added

- HARD gate #12 — **Defect reproduction gate (STATE-PROBE)** — capture and review live screenshots before any plan; route × viewport verdicts required.
- HARD gate #13 — **Rendered hero readability gate (VERIFY)** — `bun run audit:hero-contrast` must pass locally; H1 core glyph ≥4.5:1, edges ≥3.0:1 across all required viewports.
- HARD gate #14 — **Screenshot verdict gate (VERIFY)** — captured screenshots without a route × viewport verdict matrix are audit debt, not evidence.
- HARD gate #15 — **Live visual gate (VERIFY post-deploy)** — `audit:hero-contrast --live` against the deployed staging URL with cache-bust before declaring "deployed."
- HARD gate #16 — **Audit-mutation gate** — every visual sentinel ships with a mutation flag; the audit must FAIL on the deliberately-broken fixture.
- HARD gate #17 — **Cascade priority gate (BUILD → VERIFY)** — typography defaults that set `color`/`font-weight`/`font-family` on element selectors MUST live inside `@layer base`. Raw CSS without `@layer` silently overrides Tailwind utilities.
- New per-client substrate: `${project_root}/scripts/audit-hero-pixel-contrast.ts` — Bun static server + Chrome headless + sharp pixel diffing + WCAG contrast computation. Mutation flag injects weak-scrim CSS to verify the audit isn't a no-op.
- New verification command: `bun run audit:hero-contrast` — added to `audit:all` chain.
- Reframed `brand.heroH1ContrastTokens` (v0.2.0 sentinel) — description now says "STRUCTURAL ONLY — rendered readability is verified by `audit:hero-contrast`." Stops the sentinel from masquerading as a readability proof.
- New brand sentinel `brand.heroNoCycle7WeakOverlay` — flags regression to cycle-7 weak overlay values when Hero lacks a copy panel.
- 8 new gotchas (#13–#20) tied to cycle 5/6/7/8 lessons: token-vs-rendered, screenshot-as-debt, anti-pattern-vs-success, user-overrides-script, live-vs-local, Tailwind v4 @layer rule, audit-threshold-tuning, mutation-test discipline.
- Concurrency cap clarification: `≤3 same-model concurrent only for short read-only briefs`; full-cycle implementation runs return to `≤2`.

### Changed

- **Hard gate count:** 11 → 17. **Soft gate count:** 4 → 3 (visual screenshot acceptance promoted to HARD via gate #14).
- **Workflow order:** STATE-PROBE now includes mandatory defect-reproduction artifact capture before plan synthesis.
- **Verification commands chain:** `audit:hero-contrast` joins after `audit:brand`.
- **Anti-fragile/fragile audit:** added all v0.3.0 controls under anti-fragile (evidence-anchoring, not behavioral).

### Process improvements caught this cycle (v0.3.0)

- Cycle 5/6/7 confirmed that `brand.heroH1ContrastTokens` was a readability oracle in name only; it grepped class strings, not pixels. v0.3.0 introduces a true rendered-pixel audit.
- Cycle 7 confirmed screenshot capture without verdict interpretation is insufficient. v0.3.0 makes the verdict matrix mandatory.
- Cycle 8 confirmed the 3-cycle loop pattern: when the audit passes but the user says FAIL, the audit is wrong, not the user. The audit needs new dimensions.
- Cycle 8 confirmed mutation tests are non-optional: a sentinel that doesn't FAIL on a deliberately-broken fixture has zero signal. v0.3.0 makes the mutation flag mandatory for every visual sentinel.
- Cycle 8 confirmed Tailwind v4 @layer ordering is a meaningful CSS hazard distinct from selector specificity. v0.3.0 introduces the cascade-priority gate.
- Cycle 6 finding (≤3 same-model concurrent works for short briefs) codified into the concurrency rule.
- Cycle 8 confirmed the skill type stays Type 4 + Type 8 (Business Process + Operations Runbook) — the failure mode is verification/operations, not autonomous routing.

### Limitations of v0.2.0 closed in v0.3.0

- Token sentinels masqueraded as readability evidence (Cato §11.6) → rendered-pixel sentinel + structural-only reframe.
- Screenshot capture without verdict (cycle 7 closeout) → screenshot verdict gate.
- Live visual evidence was implicit (cycle 7 closeout) → live visual gate post-deploy.
- "Anti-pattern absent" was treated as "readable" (cycles 5/6/7) → anti-pattern + positive sentinels paired.
- Tailwind v4 @layer hazard not flagged (cycles 5/6/7 silent miscompile) → cascade-priority gate.
- Visual sentinel sensitivity not measured (cycles 4/5/6/7) → mutation gate.

## v0.2.0 — 2026-05-08 (Mia Sanabria cycle 4 — Spark-only production-quality correction)

**Driver:** principal observed visible production-quality issues (missing images, branding inconsistency, navbar/hero/footer/color/font issues) that cycle-3 audits under-weighted. Cycle 4 ran under a Spark-only constraint with rate-limit cap, codified the gaps as new audit sentinels, and elevated the skill from a useful spec into an operational production skill.

### Added

- **Spark-only model lane** — explicit `model_lane: spark-only` configuration; all 6 expert teams use `gpt-5.3-codex-spark` only; concurrency cap ≤2 same-model (raise to 3 only for short / read-only briefs)
- **Rate-limit-optimized dispatch pattern** — `< /dev/null` to close stdin; wait for prior batch to advance past stdin probe; kill-and-redispatch protocol when 39B log-file stall observed
- **Image-integrity sentinel** (§Workflow 4 + §Hard gate 8) — derived from cycle-4 Team B finding; `scripts/audit-images.ts` written; wired to `audit:all`
- **Brand-consistency sentinel** (§Workflow 5 + §Hard gate 9) — derived from cycle-4 Team A finding; `scripts/audit-brand-consistency.ts` written; caught a real `backdrop-blur` glassmorphism violation in `SiteHeader.tsx:15` that cycle-3 had missed
- **Live-staging verification gate** (§Hard gate 7) — formalized the build-time vs live-time fidelity distinction (Cato §11.3 from cycle-3); MANDATORY for every cycle that ships code; cache-bust curl pattern + Caddy flip wait + ETag/last-modified verification
- **Compliance severity taxonomy** (§5 synthesis + §Hard gate 10) — 6 classes: statutory-binary / statutory-borderline / policy/trademark / business-risk / quality-risk / deferred; each class has its own action rule; cycle-3 anti-pattern of flattening compliance:fail into "concerns" is now structurally prevented
- **Principal-decision register pattern** (§6 + new file `PRINCIPAL_DECISION_REGISTER.md`) — when an issue requires a principal call, output a Decision Card with Reading A / Reading B / recommendation / status; do NOT silently advance past an open card
- **Skill improvement loop formalized** (§Workflow 8) — explicit "after every cycle, update the skill via UpdateSkill workflow on `~/.claude/skills/CreateSkill`"; companion changelog file mandatory; commit alongside cycle's other changes
- **Parameterized artifact paths** (§Required fields) — every per-client filename is now caller-supplied (`brand_system_path`, `compliance_gate_path`, `gap_matrix_path`, etc.); decision rule = log gap in `## Decisions` if missing; do not silently proceed with placeholder values
- **World-class production-company QA checklist** (new section after §Hard gates) — 12-row table mapping each visual/structural surface (nav / hero / footer / colors / typography / spacing / CTA / page rhythm / hierarchy / image integrity / mobile / compliance display / production polish) to the gate that catches it; becomes `BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md` per cycle
- **Skill type classification** (§Skill Type) — declared as Type 4 + Type 8 hybrid (Business Process + Operations Runbook) per Anthropic skill taxonomy
- **Workflow Routing table** added per CreateSkill canonical structure (TitleCase workflow names, USE WHEN trigger framing in description)
- **Gotchas section** (§Gotchas — 12 gotchas) — mandatory per CreateSkill methodology; accumulates lessons from every cycle; highest information density in the skill
- **BPE check** added — anti-fragile vs fragile audit; this skill scores well on the anti-fragile axis (most mass is verifications + anti-criteria + parameterized inputs)
- **Honest model self-attestation rule** — treat `--config model=` flag as authoritative; team self-attestation is corroborating only; declining to self-attest model identity is exemplary, not a defect

### Changed

- §Required fields table — now annotated as "parameterized intake" with explicit defaults vs `<required>` vs per-vertical paths
- §Authority order — now uses `${field}` interpolation instead of hard-coded paths (e.g. `${brand_system_path}` not `docs/BRAND_SYSTEM_CONTRACT.md`)
- §Required inputs (artifact load order) — same parameterization; rule = "stop at first missing artifact and either create it or log a gap"
- §Expert lane dispatch — added Spark-only column to lane×model table; renamed Lane B to "Visual QA / Missing Image Inspector" (was sub-finding in v0.1.0); reframed Lane E to "Compliance Severity Classifier" (was generic "Compliance / Risk Guardrail"); reframed Lane G to "Production Loop Architect / Skill Improvement"
- §Verification + deploy gate — added `audit:images` + `audit:brand` to the canonical chain; added Live-staging Verification Gate as the **mandatory post-deploy step** (was implicit in v0.1.0)
- §Universal anti-criteria — added "no claim of regulatory compliance unless mechanics ship (prose ≠ mechanics)" + "no statutory-binary downgraded to concerns by averaging across teams"
- §Vertical adaptation — kept the realtor / HVAC / professional-services table; added precision in primitive descriptions
- §Reference docs — split into PAI substrates (`~/.claude/skills/CreateSkill/`, etc.) vs per-client substrate (`${project_root}/scripts/audit-{images,brand-consistency}.ts` are NEW v0.2.0 per-client substrates)

### Process improvements caught this cycle (v0.1.0 → v0.2.0)

- **Skill spec review-via-Spark catches the skill's own gaps.** Cycle-4 Team F (Loop Improvement Architect) reviewed the v0.1.0 spec and called it "partial" on closing cycle-3 gaps. v0.3.0 candidate gaps surfaced; queued.
- **CreateSkill skill MUST be invoked.** Per `~/.claude/skills/CLAUDE.md`, handrolling skill methodology is anti-pattern even when the target spec lives in a project tree. v0.2.0 was processed through CreateSkill UpdateSkill workflow.
- **Audit script bugs ARE skill-level findings.** Cycle-3 Team F caught the `audit-completeness.ts` MARKET_PAGES hardcode + the `deploy-and-verify.ts` field-name drift. v0.2.0 elevates "audit-script structural drift" to its own gate class via `audit:images` and `audit:brand` patterns.
- **Spark-only lane is operational.** All 6 cycle-4 teams ran on Spark with `--config model="gpt-5.3-codex-spark"` + `< /dev/null` + ≤2 concurrent. Two batches of 2 plus a final batch of 2 completed cleanly; no stdin-stage stalls.

## v0.1.0 — 2026-05-08 (Mia Sanabria cycle 3 — Codex-Spark expert team audit)

**Driver:** principal asked for a reusable Website Production Loop skill that distills the 7-team Codex-Spark expert audit cycle into a pattern reusable across BSS realtor clients (Mia, Sunrise, future) and adaptable to non-realtor verticals.

### Added (initial spec)

- 7 spec sections: mission intake / baseline / fact-and-compliance gate binding / expert lane dispatch / synthesis / safe implementation / verification / learning
- 7 expert lanes (A Brand, B Realtor Strategy, C SEO/AEO/Schema, D Content, E Compliance, F QA, G Production Loop Architect)
- Default lane×model assignment (multi-family lane: 5 Spark + 1 gpt-5.4 + 1 gpt-5.5)
- 8 hard decision gates + 4 soft decision gates
- Vertical adaptation rules (luxury realtor / HVAC / plumbing / professional services)
- Universal anti-criteria (8 items)
- Composition with PAI Algorithm v6.4.0 (loop = domain skill INSIDE the Algorithm; not replacement)

### Limitations of v0.1.0 (closed in v0.2.0)

- Workflow primitives hard-coded realtor-specific filenames despite the vertical-adaptation table (Cato §11.5)
- Missing-image and brand-consistency drift not their own gates (cycle-3 Team A + cycle-4 Team A/B filled)
- Live-staging verification was implicit, not a HARD gate (Cato §11.3)
- Compliance findings could be flattened into "concerns" by averaging across teams (Cato §11.4)
- License-rendering + similar ambiguous constraint readings did not have a Principal-Decision Register pattern (Cato §11.2)
- No Spark-only lane (only multi-family was assumed)
- No rate-limit cap (cycle-3 hit a 4-Spark-concurrent stall before the cap was learned)
- No Gotchas section (CreateSkill mandate)
- No BPE check
