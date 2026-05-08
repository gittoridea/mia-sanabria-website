# Website Production Loop Skill — Changelog

Version-by-version evolution of `WEBSITE_PRODUCTION_LOOP_SKILL.md`. Updated each cycle by the SkillImprovementLoop workflow.

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
