# Cycle 8 — Process Improvement Report

**Authored:** 2026-05-09
**Cycle:** 8 — process-corrected visual fix using GPT-5.5 xhigh + Codex 5.3 Spark
**Skill version:** v0.2.0 → v0.3.0
**Algorithm:** PAI v6.4.0 / E5 (`/effort max` explicit override)

## What prior cycles missed

Cycles 5, 6, and 7 each closed with PASS audits while the principal kept seeing an unreadable hero H1. The structural reasons:

1. **Token-only audits were treated as readability proof.** `brand.heroH1ContrastTokens` grepped for the presence of `text-shadow`, overlay gradients, and `font-bold`. It never measured rendered pixels. Three cycles passed structural checks while the actual H1 was rendering navy-on-navy.
2. **Closeout docs over-trusted the audit chain.** Each cycle's closeout claimed PASS based on `35 PASS / 11 PASS / 12 PASS` chains and operator-asserted "after screenshot review." None of these saw the rendered output as an acceptance gate.
3. **The screenshot pipeline existed but had no verdict matrix.** 75-PNG capture sets were produced and cited as evidence, but no per-route × per-viewport verdict was recorded. Capture is not review.
4. **Anti-pattern absence was treated as success.** `brand.heroNoNavyGlowHalo` proved the cycle-5 broken pattern was gone. It did NOT prove the replacement was readable. Negative sentinels are not positive sentinels.
5. **Live evidence was implicit, not enforced.** Cycle 7 closeout listed "live grep" line items but did not run a rendered-pixel audit against the deployed URL with cache-bust.
6. **The actual root cause was a CSS-cascade bug.** `src/app/globals.css` had `h1 { color: var(--color-navy-800); }` OUTSIDE any `@layer`. In Tailwind v4, raw CSS rules outrank ALL utilities — even though `.text-cream-50` has higher specificity (0,1,0) than `h1` (0,0,1). Three cycles of overlay tweaks were trying to fix a contrast-math problem that was actually a `@layer` ordering problem. The H1 was rendering navy, not cream, regardless of overlay.

## Why prior cycles missed it

- The audit chain was structurally narrow: it grepped class strings without computing rendered colors. There was no place in the chain where a sentinel asked "does the H1 letter pixel contrast exceed AA against the pixel under it?"
- The closeout language pattern ("audit:brand 11/0/0 — H1 readability hardened") elided the gap between class-presence and pixel-contrast. The closeout reader could not tell the audit only checked the former.
- The 9-lane Codex Spark audit (cycle 6) included an Accessibility lane that flagged hero contrast as `~2.02:1` — but the upgrade plan implemented "deepen the scrim" rather than "render the H1 cream and verify rendered pixels." The lane saw the right thing; the synthesis chose the wrong fix.
- The screenshot capture stage produced PNGs but never enforced "review every PNG." 70-screenshot sets accumulated as audit debt.

## How GPT-5.5 xhigh helped

GPT-5.5 was used at three decision gates only — not at every minor task:

1. **Failure retrospective (Phase 1).** Produced a 109-line analysis identifying the 6 misleading checks and 7 missing decision gates. Acceptance criteria #5: "rendered pixel contrast" not "token presence." Wrote the 12 atomic acceptance criteria that anchored the rest of the cycle.
2. **Hero design decision gate (Phase 3).** Chose Option C (content card / scrim panel) over A/B/D, with computed contrast math: `bg-navy-900/95` over worst-case white = ~14:1 cream-50 contrast. Provided copy-paste-ready JSX. Listed 5 anti-patterns to avoid + 12 acceptance criteria for the implementation.
3. **Predeploy acceptance review (Phase 6).** Reviewed the implementation against its own stated criteria before deploy. Verdict gated whether the cycle proceeded to deploy or iterated.

GPT-5.5 was deliberately reserved for these gates rather than diluted across every task. It worked at xhigh reasoning, computed actual contrast math, and produced specific copy-paste output rather than directional advice.

## How Codex Spark helped

Codex 5.3 Spark teams (≤2 concurrent) handled bounded implementation/audit work:

- **Team B — pixel-contrast audit spec** (260 lines). Designed the Bun + headless Chrome + sharp pipeline. Specified the H1-hidden diff approach. Provided a TypeScript skeleton runnable with `bun run`.
- **Team E — skill v0.3.0 amendments** (202 lines). Drafted the gate additions, gotchas, anti-criteria, and BPE check entries. Specified exact placement in v0.2.0's structure.

Spark was used for completeness + structural rigor where breadth + careful enumeration mattered more than judgment. Spark concurrency held at ≤2 same-model.

## What should be automated

- **Pixel-contrast audit** — automated via `audit:hero-contrast` (NEW v0.3.0). Wired into `audit:all`. Mutation flag verifies it isn't a no-op.
- **Cascade-priority guard** — could be automated as a sentinel: grep for `^[a-z\d ,]+\s*\{[^}]*color:` rules in `src/app/globals.css` that appear OUTSIDE `@layer`. Flag any element-selector typography defaults not in `@layer base`. Not yet implemented; queued for v0.3.1 candidate.
- **Live-staging pixel re-audit** — `audit:hero-contrast --live` + cache-bust pattern; runs against the deployed URL post-deploy. Manual today; could be wired into `deploy-and-verify.ts` post-flip.
- **Screenshot verdict matrix generation** — could auto-generate a markdown matrix from any screenshot directory with a `verdict.json` sidecar pattern.

## What should remain human/GPT-5.5 judged

- **Visual taste / luxury-editorial feel** — pixel contrast can be measured; "does this read as luxury editorial vs template realtor" cannot be reduced to a metric. Reserve for principal review or GPT-5.5 design-decision gates.
- **Voice-adjacent surface decisions** — IntentRouter copy retunes, market template archetype variants, hero motion ceremony. These touch Mia's voice and require principal direction.
- **Brand System Contract supersession** — any change to colors, fonts, glassmorphism rules, or cycle-N overlay decisions requires explicit principal sign-off.

## How the next cycle should think better

1. **Reproduce before planning.** No implementation plan may begin until the user-visible defect is reproduced in screenshot form, with route × viewport verdict rows. Operator assertion is not evidence.
2. **Audit the audit.** Every sentinel must have a mutation test that proves it's sensitive. A sentinel that passes its mutation has zero signal.
3. **Pair token sentinels with rendered sentinels.** Class-presence checks are structural. Pixel-contrast checks are functional. Both are required; neither alone is acceptance.
4. **Scrutinize CSS cascade order in Tailwind v4.** Any `h1 { color: ... }` rule outside `@layer base` is a candidate cascade-priority bug. Search for unwrapped element-selector typography rules at audit time.
5. **User-visible rejection overrides scripted PASS.** When the principal says "unreadable," the state is FAIL until rendered evidence and user-visible review align — not until the audit chain says PASS.
6. **Use GPT-5.5 xhigh at decision gates only.** Not at every task. Reserve it for: pre-fix retrospective on repeated failure, design-direction decision when multiple options exist, predeploy acceptance review on visual changes, live acceptance review after deploy.
7. **Use Codex Spark for bounded depth.** Audit spec design, skill update drafting, focused per-axis review. Concurrency cap ≤2 same-model (≤3 only for short read-only briefs).

## Anti-fragile additions to v0.3.0 (KEEP)

All six new HARD gates are anti-fragile per BPE:

- Defect reproduction gate (evidence anchor before plan)
- Rendered hero readability gate (rendered-pixel WCAG)
- Screenshot verdict gate (verdict-or-it-doesn't-count)
- Live visual gate (cache-busted live pixel re-audit)
- Audit-mutation gate (every sentinel proves itself)
- Cascade priority gate (Tailwind v4 @layer discipline)

None of these say "the model will…" or "Claude should…". They are evidence-anchoring controls that require specific tool output, not behavioral assumptions.
