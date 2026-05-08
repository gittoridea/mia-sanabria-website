# Team F — Loop Improvement Architect (Cycle 4)

## Verdict (one sentence)
`v0.2.0` is materially better than `v0.1.0` and closes several cycle-3 misses, but it is still partially non-enforcing for a reusable loop and should be upgraded to `v0.3.0` before being considered stable/portable.

## Top 10 findings about WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0
| # | Finding | Severity | Recommendation | Safe-cycle-4? |
|---|---|---|---|---|
| 1 | `WEBSITE_PRODUCTION_LOOP_SKILL.md` hard-gates invoke `bun run audit:images` and `bun run audit:brand`, but `package.json` contains neither script and `scripts/` has no `audit-images.ts` / `audit-brand.ts`; this makes gates partially non-actionable. | high | Add executable sentinel scripts and register `audit:images`/`audit:brand` scripts before declaring those gates hard. | yes |
| 2 | The skill frontmatter references missing companion artifacts (`WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md`, `SKILL_CREATOR_PROCESSING_NOTES.md`, `CREATOR_PROCESSING_NOTES`-equivalent), while runtime hard dependencies (`BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md`, `PRINCIPAL_DECISION_REGISTER.md`) are also absent in-tree. | high | Either create these files in the same skill home or remove/relax references and gate behavior until they exist. | yes |
| 3 | Cycle-3 TCPA finding is only partially encoded: the spec adds “no claim of compliance unless mechanics ship,” but the verification section has no machine-checkable affirmative-consent primitive (checkbox/signature/timestamp/log) and no gate that rejects prose-only compliance claims. | high | Add a dedicated TCPA mechanics checker (or explicit form-field/submit telemetry) and a hard verdict condition that blocks launch-ready status until it passes. | conditional |
| 4 | License interpretation ambiguity from cycle-3 (unverified vs rendered certainty) is captured via a principal-decision register pattern, but there is no hard process gate that blocks phase advance on an unresolved card. | high | Add a mandatory `principal_decision_open` check in VERIIFY/LEARN so any unresolved critical principal card makes the cycle non-complete. | yes |
| 5 | The build-time vs live-time gap is acknowledged, yet `Live-staging gate (HARD)` is contingent on deployment and can be cleanly skipped if deploy is not run, so “fixed” claims can still be build-only without explicit release-level downgrade semantics. | medium | Require every cycle closeout to declare `fixed_scope = build-only|live` with explicit schema in handoff, and treat “build-only” as non-production closure. | yes |
| 6 | `vertical_profile` and intake fields are parameterized, but multiple workflow defaults and required behaviors still hard-wire realtor patterns (e.g., `/markets/`, 13-route market logic), so non-realtor reuse remains mostly papered over. | medium | Complete parameterization at artifact and flow level (`route_set`, `landing_route_pattern`, `market_schema_profile`, `conversion_schema_profile`) and add a non-realtor smoke test cycle. | conditional |
| 7 | Of 11 hard gates, several are advisory/documentation-only (authority-load, re-read, schema-enforced verdict, principal-decision register), so they are not consistently machine-enforceable despite being labeled HARD. | medium | Introduce a gate manifest with machine-readable criteria + exit status (pass/fail/pending) so only truly automatic gates auto-advance. | yes |
| 8 | The new `model_lane` axis mixes capacity/cost with diversity but does not enforce vendor/homogeneity controls; Cato already showed OpenAI-corpus overlap risks, and the spec currently does not quantify divergence or concentration risk. | medium | Replace lane logic with explicit diversity policy: minimum independent-vendor evidence ratio and overlap checks before final synthesis sign-off. | yes |
| 9 | `Spark-only` lane value-noise tradeoff is under-specified: cap guidance is inconsistent (`≤2` in one section, `max 3` in sibling guidance), and no objective quality threshold gates Spark-only selection. | medium | Normalize concurrency policy (`≤2` or conditional `≤3` with rationale), record expected recall thresholds, and switch to multi-family automatically when homogeneity risk rises. | yes |
| 10 | Compliance taxonomy is close, but class semantics are blurred by mixing normative class (`policy/trademark`, `business-risk`, etc.) with output disposition (`deferred/non-blocking`), which encourages false certainty masking in downstream reporting. | medium | Split severity from disposition: keep severity classes strict, and track disposition as explicit status metadata (`open`, `gated`, `deferred`, `resolved`). | yes |

## Skill v0.2.0 vs cycle-3 friction — gap analysis (does v0.2.0 actually close cycle-3 gaps?)

- **Partially closed:** missing-image + brand sentinels (`audit:images`, `audit:brand`), severity-first compliance handling, principal-decision pattern, and explicit build-vs-live distinction are added in text.
- **Still partially/mostly open:** TCPA mechanics, license-rendering ambiguity, and enforceability of critical gates were still operationally manual in cycle-3 outcomes.
- **Overall verdict:** `v0.2.0` improved coverage but remains **partial** on the highest-risk cycle-3 gaps because several protections are declarative without execution-level guardrails.

## Proposed v0.3.0 changes (if any are warranted now)

1. Add executable `scripts/audit-images.ts` + `scripts/audit-brand-consistency.ts` and wire both into `package.json` scripts and preflight checks.
2. Add missing skill companions referenced by the spec: changelog notes, creator-processing note path, principal register, and visual QA matrix in a deterministic location.
3. Add a mandatory unresolved-principal-decision gate in VERIIFY/LEARN.
4. Add explicit TCPA mechanics evidence checks and prevent “compliance prose only” from satisfying launch criteria.
5. Add a machine-readable gate manifest and pass/fail schema for all hard gates.
6. Parametrize route-set assumptions and remove Realtor-only behavior from default required flows.
7. Add cross-vendor homogeneity checks (recommendation overlap, repeated finding clustering, and no single-family drift thresholds).
8. Normalize Spark concurrency cap into one contract value with fallback/retry logic and explicit selection criteria.
9. Move `deferred` out of severity taxonomy into an orthogonal status dimension.
10. Add a skill-local non-realtor reference test case in `ISA` and a `v0.3.0` changelog entry in repo-local and promotion targets.

## BPE check — would a smarter model make these rules unnecessary?

- Keep (environmental failure domains): codex read-only output behavior, stdin hang mitigation, Caddy cache timing caveats, schema-enforced cross-vendor verdict requirements.
- Remove/relax (model-limitation scaffolding): verbose “model should not self-attest” phrasing and any deterministic model-specific hardcoding that isn’t tied to measured failure.
- Keep only what is evidence-backed infrastructure/process constraints; remove broad, style-level instructions that do not prevent known failures.

## Promotion path (~/.claude/skills/WebsiteProductionLoop/) — when and how

- **Current status:** **No immediate promotion.**
- **Why:** skill is still repo-local and not fully generic (missing artifacts, Realtor assumptions, enforcement gaps).
- **Go-live trigger for promotion via `CreateSkill`:**
  - complete parameterization with validated non-realtor test cycle,
  - missing companion artifacts and gate commands in place,
  - `v0.3.0` hardening committed and evidenced,
  - 2+ vertical reuses without manual rule patching.
- **Procedure:** Use `Skill("CreateSkill")` with `UpdateSkill` as required by the workflow instructions in `~/.claude/skills/CreateSkill/Workflows/UpdateSkill.md`.

## Skill ImprovementLoop closure check — does the skill self-improve, or does it require external prompting?

- **Partial closure.** The workflow exists and explicitly points to `UpdateSkill`/ISA updates, but there is no automatic trigger tied to repeated findings, failed gates, or re-use metrics.
- **Required fix:** Add explicit closure condition: repeated hard-gate or compliance misses must spawn a `vX.Y` bump and a `CreateSkill/UpdateSkill` pass in the same LEARN cycle.

## Anti-criteria check

- The spec does not propose replacing PAI, inventing new Algorithm features, or dropping ISA-first process discipline.
- No forbidden county-misalignment language is introduced (`Boca`/`Delray`/`Palm Beach` handling remains constrained to county literals in client code/tests).
- Remaining anti-criteria concern is mainly **executional**: declared hard gates that are not actually executable in the repo.

## Evidence appendix
- model_used: gpt-5.3-codex-spark
- team: F
- reasoning_effort: xhigh
- sandbox: read-only
- Files reviewed:
  - [ISA.md](/home/torrey/code/mia-sanabria-website/ISA.md)
  - [WEBSITE_PRODUCTION_LOOP_SKILL.md](/home/torrey/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md)
  - [CODEX_SPARK_SYNTHESIS_REPORT.md](/home/torrey/code/mia-sanabria-website/docs/CODEX_SPARK_SYNTHESIS_REPORT.md)
  - [PRODUCTION_READINESS_HANDOFF_CODEX_SPARK_2026-05-08.md](/home/torrey/code/mia-sanabria-website/docs/PRODUCTION_READINESS_HANDOFF_CODEX_SPARK_2026-05-08.md)
  - [production-loop-architecture.md](/home/torrey/code/mia-sanabria-website/docs/codex-spark-audits/production-loop-architecture.md)
  - [CreateSkill/SKILL.md](/home/torrey/.claude/skills/CreateSkill/SKILL.md)
  - [UpdateSkill.md](/home/torrey/.claude/skills/CreateSkill/Workflows/UpdateSkill.md)
  - [ImproveSkill.md](/home/torrey/.claude/skills/CreateSkill/Workflows/ImproveSkill.md)
  - [ALGORITHM v6.4.0](/home/torrey/.claude/PAI/ALGORITHM/v6.4.0.md)
  - [WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md](/home/torrey/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md)

{"team":"F","verdict":"concerns","completeness":"full","v0_2_0_closes_cycle_3_gaps":"partial","v0_3_0_warranted":"yes","findings_count":10,"high_severity_count":4,"promotion_to_pai_recommended":"defer","compliance_severity_taxonomy_correct":"partial"}
