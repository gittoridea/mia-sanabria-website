AUDIT_START

# Team E — Website Production Loop Skill v0.3.0 Amendments

## 1. v0.3.0 changelog entry (copy-paste-ready for `WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md`)
```md
# Website Production Loop Skill — Changelog

Version-by-version evolution of `WEBSITE_PRODUCTION_LOOP_SKILL.md`. Updated each cycle by the SkillImprovementLoop workflow.

## v0.3.0 — 2026-05-09 (Mia Sanabria cycle 8 — rendered readability failure recovery)

**Driver:** principal-visible PASS-vs-FEEDOFFER FAIL pattern persisted through cycles 3–7; token and structural audits passed but users still saw unreadable hero copy. v0.3.0 codifies Cycle 5→8 lessons so visual regressions cannot escape as deploy-ready.

### Added

- NEW hard gate: **Defect reproduction gate** (pre-implementation, live baseline required, route×viewport capture) to prevent issue fabrication and close the gap-cycle from cycles 5/6/7.
- NEW hard gate: **Rendered hero readability gate** (`bun run audit:hero-contrast`) to replace token/overlay-only checks.
- NEW hard gate: **Screenshot verdict gate** requiring explicit route×viewport verdict rows; captured files alone are insufficient.
- NEW hard gate: **Live visual gate** (post-deploy pixel+screening with cache-bust URL and ETag/Last-Modified flip).
- Moved **visual screenshot acceptance** from SOFT to HARD; no visual PASS without reviewed verdict matrix.
- Added live baseline defect evidence requirement before any implementation plan is drafted.
- Added per-viewport hero readability evidence requirements for `320x568`, `375x812`, `768x1024`, `1280x800`, and `1440x900`.
- Added explicit user-source parity check before final "hero readability passed" language.
- Added Cycle-6 concurrency correction: same-model concurrency for short read-only briefs can be 3; all other brief classes remain 2 (for Spark-only lane).
- Added anti-fragile guard against "negative-sentinel success" (`brand.heroNoNavyGlowHalo`/overlay layers prove removal, not readability).
- Added requirement that font loading includes requested face-weight at runtime for hero typography families.

### Changed

- **Hard gate count:** 11 → 15; **Soft gate count:** 4 → 3 (visual screenshot acceptance removed from soft list).
- **Workflow order:** State-probe now includes mandatory defect-reproduction artifact capture before plan synthesis.
- **Verification commands:** `bun run audit:hero-contrast` joins the VERIFY chain; live visual parity becomes explicit post-deploy requirement.
- **Gotchas density:** +6 v0.3.0 gotchas, each anchored to Cycle 5/6/7/8 anti-failure lessons.
- **BPE check:** `WEBSITE_PRODUCTION_LOOP_SKILL.md` updated with additional anti-fragile detection points (pixel verdicts, reproduction matrix, live parity, mutation-fidelity checks).

### Process improvements caught this cycle (v0.3.0)

- Cycle 5 confirmed that `brand.heroH1ContrastTokens` is not a readability oracle.
- Cycle 6 confirmed short read-only concurrency 3 is safe and materially faster for audit-only bursts.
- Cycle 7 confirmed screenshot presence without verdict interpretation is not sufficient evidence.
- Cycle 8 confirmed we need explicit user-visible reproduction, pixel evidence, and live cache-bust rerun before PASS.
- Cycle 8 also confirmed the old anti-pattern: "no old bad pattern = good new pattern" is false without contrast proof.
- Cycle 8 confirms the skill still belongs as **Type 4 + Type 8**; no new skill taxonomy needed.

- Skill type review: confirmed unchanged as Type 4 + Type 8 (Business Process + Operations Runbook)
```

## 2. v0.3.0 spec deltas (copy-paste-ready for the .md file)
```md
version: 0.3.0
last_updated: 2026-05-09
last_updated_cycle: 8 (hero-rendered-readability failure prevented)
```

```md
**v0.3.0:** After reviewing cycles 5–8, this skill remains **Type 4 + Type 8**. The failure mode is verification/operations, not a taxonomy expansion; the skill type is unchanged and should stay unchanged unless a future cycle adds autonomous model-routing authority.
```

```md
| **`spark-only`** | Principal explicitly requests; bias-coherence audit needed; cross-vendor diversity not the goal | `gpt-5.3-codex-spark` only | **≤2 same-model concurrent (raise to 3 only for short/read-only briefs)** |
| **`multi-family`** (default) | Standard cycle; cross-vendor diversity is part of the goal | Spark + `gpt-5.4` + `gpt-5.5` mixed across teams | **≤3 same-model concurrent** |

**Concurrency rule (CRITICAL — v0.3.0 addendum):**
- Short / read-only briefs (no write-backed or execution side effects) may use same-model concurrency = 3.
- All other Spark-only runs stay at ≤2.
- Keep `--sandbox read-only` discipline; always use `stdin` closure.
```

```md
### 2b. Defect reproduction gate (NEW v0.3.0)

Before any upgrade-plan synthesis, run a user-visible reproduction capture on the current live/staging URL:

```bash
mkdir -p /tmp/<client>-cycle<N>-defect-before
ROUTES=(/ /about/ /buyers/ /sellers/ /valuation/ /contact/ /markets/<all-key-markets>/)
VIEWPORTS=("320,568:mobile-sm" "375,812:mobile-md" "768,1024:tablet" "1280,800:desktop-small" "1440,900:desktop")
for r in "${ROUTES[@]}"; do
  for vp in "${VIEWPORTS[@]}"; do
    IFS=: read size label <<< "$vp"
    # playwright screenshot command capturing live pixels for route+viewport
  done
done
```

For each route×viewport, produce one verdict entry:
`user-visible failure reproduced: PASS/FAIL/UNVERIFIED`, with evidence path.
Failure to record this step = hard stop. No implementation plan may start before the gate is marked PASS or justified `AWAITING PRINCIPAL REWORK`.
```

```md
## 7. Hard gate stack (v0.3.0 addendum)

11. **Re-read gate (VERIFY)** — every explicit ask in user's mission addressed or marked SKIP with reason.
12. **NEW v0.3.0 — Defect reproduction gate (STATE-PROBE)** — before any plan writing, capture and evidence the user-visible defect against the current staging state. If not reproduced or not documented route×viewport-wise, pause and re-scope.
13. **NEW v0.3.0 — Rendered hero readability gate (VERIFY, pre-deploy/build-boundary)** — local `bun run audit:hero-contrast` must pass for image-mode hero routes at all required viewports before build/fix acceptance. Core glyph contrast ≥ 4.5:1 and anti-aliased edge contrast ≥ 3.0:1.
14. **NEW v0.3.0 — Screenshot verdict gate (VERIFY)** — every screenshot capture must include a reviewed verdict matrix per route×viewport (captured, reviewed, PASS/FAIL/NA). Any missing row blocks visual PASS.
15. **NEW v0.3.0 — Live visual gate (POST-DEPLOY HARD)** — rerun pixel-readability + screenshot verdict against cache-busted live URL after deploy flip; all visual gates must pass before closeout.
```

```md
## 7. Decision gates (SOFT — surface but don't block)

1. **Lighthouse-mobile threshold** — capture, surface a warning when below threshold; future cycle should harden via deploy gate.
2. **Form readiness** — WARN-only on mailto-classified forms; flips HARD when GHL endpoint URL arrives.
3. **Performance regression** — Lighthouse threshold drift between cycles; surface, don't block.
```

```md
## Universal anti-criteria (apply to every cycle)

- ...
- **v0.3.0 (add):** No claim of visual PASS without `Defect reproduction gate + Screenshot verdict gate + Rendered hero readability gate` evidence.
- **v0.3.0 (add):** No claim of readability by token grep (`text-shadow`, overlay classes, weight class, etc.) alone; token checks are structural-only evidence.
- **v0.3.0 (add):** No closeout “hero readable” language if user-reported defect was pending or rejected by screenshot matrix/user-source gate.
- **v0.3.0 (add):** No deployment-closeout on hero/visual work without cache-busted live URL parity and gate evidence.
- **v0.3.0 (add):** No visual sentinel can be considered successful if a seeded weak-scrim mutation run of the same mechanism passes unchanged.
```

```md
## Universal anti-criteria (append under existing Gotchas if required fields exist)

12. **Token-level readability checks are not readability checks.** `brand.heroH1ContrastTokens` can pass while H1 remains unreadable.  
13. **Captured screenshots without a reviewed matrix are audit debt.** A file dump without verdicts is not deploy evidence.  
14. **“Anti-halo” success is not “readable success.”** `brand.heroNoNavyGlowHalo` catching one anti-pattern does not validate the replacement.  
15. **User-visible rejection overrides scripted PASS.** If principal says unreadable, final state remains blocked until evidence flips.  
16. **Live and local are different systems.** `out/` + local checks passing is insufficient if live cache/rewrite state diverges.  
17. **Do not overfit concurrency.** “≤3 same-model” only applies to short read-only bursts; full-cycle implementation runs return to ≤2.
18. **Font class ≠ loaded weight.** A declared `font-bold` is unverified without runtime-weight coverage and can silently undermine contrast.  
```

```md
## BPE (Bitter-Pilled Engineering) check (append new bullets)

- **ANTI-FRAGILE (KEEP):** Defect reproduction gate before plan drafting.
- **ANTI-FRAGILE (KEEP):** Rendered hero pixel contrast gate.
- **ANTI-FRAGILE (KEEP):** Screenshot verdict gate with route×viewport matrix.
- **ANTI-FRAGILE (KEEP):** Live visual gate with cache-bust and live pixel verification.
- **ANTI-FRAGILE (KEEP):** Reclassifying visual screenshot acceptance to HARD.
- **ANTI-FRAGILE (KEEP):** Font-weight runtime verification requirement tied to hero classes.
- **ANTI-FRAGILE (KEEP):** Concurrency cap clarifier (3 only for short read-only).
- **ANTI-FRAGILE (KEEP):** Explicit user-source gate before declaring readability PASS.
```

```md
## Skill version history

- **v0.1.0** — ...
- **v0.2.0** — ...
- **v0.3.0** — 2026-05-09 — rendered-readability recovery, pre-fix reproduction, route×viewport verdicting, cache-busted live visual gate, and visual pass hardening.
```

```md
## Verification commands (canonical) v0.3.0 additions

bun run typecheck
bun run lint
bun run build
bun run audit:all
bun run audit:completeness
bun run audit:seo
bun run audit:schema
bun run audit:links
bun run audit:images
bun run audit:brand
bun run audit:hero-contrast  # NEW v0.3.0
```

## 3. Wire-up in the main spec
1. Update header metadata around the top block (v0.2.0 lines 1–18): bump `version`, `last_updated`, `last_updated_cycle`, and keep `skill_type` unchanged as Type 4 + Type 8.
2. Add clarifying concurrency text in `### 1a. Model lane selection` (around v0.2.0 lines ~94–120): enforce 3 only for short/read-only Spark runs, not general Spark-only work.
3. Insert `### 2b. Defect reproduction gate` immediately after `### 2. Baseline / current-state probe (STATE-PROBE-phase)` (around v0.2.0 lines ~118–190) with route×viewport capture + hard-stop condition.
4. In `## Decision gates (HARD...)` (around v0.2.0 lines ~360–390), append new hard gates #12–#15 in the listed order:
   - Defect reproduction
   - Rendered hero readability
   - Screenshot verdict
   - Live visual
5. In `## Decision gates (SOFT...)` (around v0.2.0 lines ~392–408), remove visual screenshot acceptance soft gate and keep remaining SOFTs.
6. In `## Universal anti-criteria` (around v0.2.0 lines ~430–455), add five anti-criteria bullets above.
7. Append new gotchas to `## Gotchas` (around v0.2.0 lines ~450–500) with explicit cycle-5/6/7/8 lineage.
8. In `## Verification commands (canonical)` (around v0.2.0 lines ~420+), add `bun run audit:hero-contrast`.
9. In `## BPE (Bitter-Pilled Engineering) check` (around v0.2.0 lines ~507+), add anti-fragile bullets for the five-plus new controls.
10. In `## Skill version history` (near file bottom), add v0.3.0 bullet and date.

## 4. Anti-fragile vs fragile audit
1. Defect reproduction gate: anti-fragile (KEEP)
2. Rendered hero readability gate: anti-fragile (KEEP)
3. Screenshot verdict gate: anti-fragile (KEEP)
4. Live visual gate with cache-bust: anti-fragile (KEEP)
5. Visual screenshot acceptance hardening (SOFT→HARD): anti-fragile (KEEP)
6. Concurrency cap clarification (3 same-model short read-only only): anti-fragile (KEEP)
7. User-source gate before PASS claims: anti-fragile (KEEP)
8. Runtime font-weight verification for hero typography: anti-fragile (KEEP)
9. Mutation/anti-failure fixture check for hero readability sentinels: anti-fragile (KEEP), not fragile

No fragile additions were introduced; all additions are evidence-anchoring controls, not behavioral assumptions.

```json
{"team":"E","verdict":"pass","completeness":"full","model_used":"gpt-5.3-codex-spark","sandbox":"read-only","findings_count":9}
```

AUDIT_END