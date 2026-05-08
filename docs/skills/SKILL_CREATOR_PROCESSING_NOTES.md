# SkillCreator Processing Notes — Mia Sanabria cycle 4

**Workflow used:** `UpdateSkill` (from `~/.claude/skills/CreateSkill/Workflows/UpdateSkill.md`)
**Target:** `~/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.1.0 → v0.2.0
**Session:** Mia Sanabria cycle 4 (2026-05-08 PM, Spark-only production-quality correction)

## Why CreateSkill was invoked rather than direct edit

Per `~/.claude/skills/CLAUDE.md`: "Creating, modifying structure of, or validating any skill under this directory REQUIRES invoking `Skill('CreateSkill')` first. Reading CreateSkill's workflows and executing the steps by hand is NOT compliance — it is the exact handrolling anti-pattern documented in feedback_invoke_blogging_skill_never_handroll.md."

Although `WEBSITE_PRODUCTION_LOOP_SKILL.md` lives in `<project_root>/docs/skills/` rather than `~/.claude/skills/`, it follows PAI skill conventions (TitleCase, `## Workflow Routing`, USE WHEN trigger framing). The principal's cycle-4 mission text explicitly directed: "Find and invoke the Skill Creator skill or closest available PAI/Claude Code skill creation workflow." Honor the spirit of the rule + the explicit principal direction → invoke `Skill("CreateSkill")` with the UpdateSkill workflow.

## What CreateSkill UpdateSkill workflow caught vs what the principal mission listed

The principal mission text listed 10 cycle-4 lessons to encode. CreateSkill methodology added:

| # | Principal-listed | CreateSkill methodology added |
|---|---|---|
| 1 | Spark-only lane option | Yes — implemented |
| 2 | Rate-limit-optimized dispatch | Yes — implemented |
| 3 | Missing-image and broken-visual sentinel | Yes — `scripts/audit-images.ts` + §Hard gate 8 |
| 4 | Brand consistency sentinel | Yes — `scripts/audit-brand-consistency.ts` + §Hard gate 9 |
| 5 | Live-staging verification gate | Yes — §Hard gate 7 |
| 6 | Compliance severity taxonomy | Yes — §5 + §Hard gate 10 |
| 7 | Principal-decision register | Yes — §6 + companion `PRINCIPAL_DECISION_REGISTER.md` |
| 8 | Skill improvement loop | Yes — §Workflow 8 + this changelog file |
| 9 | Parameterized artifact paths | Yes — `${field}` interpolation throughout |
| 10 | World-class production-company QA checklist | Yes — new section + cycle-per matrix |
| Bonus | (CreateSkill mandate) `## Workflow Routing` table per canonical structure | Added — TitleCase workflow names |
| Bonus | (CreateSkill mandate) `## Gotchas` section | Added — 12 gotchas accumulated |
| Bonus | (CreateSkill mandate) `## BPE check` (Bitter-Pilled Engineering) | Added — anti-fragile vs fragile audit |
| Bonus | (CreateSkill mandate) Skill type classification (Anthropic taxonomy) | Added — Type 4 + Type 8 hybrid |
| Bonus | (CreateSkill mandate) USE WHEN / NOT FOR in description | Added to frontmatter |
| Bonus | (CreateSkill mandate) Honest model self-attestation rule | Added — `--config model=` flag is authoritative |

## What CreateSkill flagged as v0.3.0 candidate

Cycle-4 Team F (Loop Improvement Architect) running on Spark reviewed the freshly-written v0.2.0 spec and surfaced 4 high-severity findings:

1. **v0.2.0 closes cycle-3 gaps "partial," not "yes"** — some workflows still hard-code realtor-specific filenames in the example notation despite the parameterization (the vertical-adaptation table papers over this rather than fixing the workflow primitives)
2. **Compliance severity taxonomy is "partial" — 6 classes is right, but the action rules need execution detail** (e.g. "statutory-binary cannot be downgraded to concerns" is correct but the synthesis-time enforcement mechanism is implicit)
3. **Promotion to `~/.claude/skills/WebsiteProductionLoop/` is "defer"** — not yet, because the skill still requires 1+ non-realtor invocation to validate the parameterization is real
4. **SkillImprovementLoop §Workflow 8 closes the recursive loop** — but only if invoked. The mechanism that triggers SkillImprovementLoop on every cycle is currently a doc-level instruction, not a hook. Future work: add an Algorithm-phase rule that requires `WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md` to be touched whenever a cycle invokes the skill.

## File operations performed

- Read: `~/.claude/skills/CreateSkill/SKILL.md` (authoritative source)
- Read: `~/.claude/skills/CreateSkill/Workflows/UpdateSkill.md`
- Read: `~/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` (v0.1.0 — first 60 lines; full content already in conversation context from cycle 3)
- Wrote: `~/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` (v0.2.0 — full rewrite)
- Wrote: `~/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md` (new file)
- Wrote: `~/code/mia-sanabria-website/docs/skills/SKILL_CREATOR_PROCESSING_NOTES.md` (this file)
- (Pending) Write: `~/code/mia-sanabria-website/docs/skills/WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md` (cycle-5 update)

## TitleCase + canonical-structure verification

| Check | Status |
|---|---|
| Skill name in frontmatter | `WebsiteProductionLoop` (TitleCase, no underscore — public-style; lives in project tree, not `~/.claude/skills/`) ✓ |
| Frontmatter `description` is single-line with USE WHEN + NOT FOR | ✓ |
| Workflow routing table present | ✓ (workflow files not yet extracted; inline §Workflows authoritative) |
| `## Gotchas` section | ✓ (12 entries) |
| `## BPE check` | ✓ |
| Parameterized artifact paths | ✓ |
| Anti-criteria explicit | ✓ (universal + per-cycle) |
| Companion docs | ✓ (changelog, this notes file) |

## BPE check verdict

**Anti-fragile (KEEP):** verification commands, sentinel scripts, hard gates, gotchas section, principal-decision register pattern, compliance severity taxonomy, parameterized intake fields, rate-limit cap rules.

**Fragile (CUT next time):** any rule that says "the model will…" or "Claude should…" — Claude can already self-derive process steps; what it can't derive is the failure modes (gotchas), the verifications (sentinel scripts), and the constraints (anti-criteria).

Currently the skill scores well on the anti-fragile axis: most of its mass is verifications + anti-criteria + parameterized inputs.

## Public/private decision

Decision: **public-style placement** (TitleCase, no underscore prefix) but **kept in project tree** for now.

Rationale: the skill is parameterized enough to be generic ("client_slug", "vertical_profile", `${brand_system_path}`, etc.) so it COULD live as `~/.claude/skills/WebsiteProductionLoop/`. However:

1. The skill has only run once on a single vertical (luxury realtor); promoting before a non-realtor invocation cycle (Sunrise / future BSS realtor / HVAC / professional services) leaves the parameterization unvalidated.
2. The companion docs (`PRINCIPAL_DECISION_REGISTER.md`, `BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md`) are project-instance state, not skill-state.
3. The skill cites Mia-specific examples in its narrative; a true public release would either redact or template those.

Per the CreateSkill rule: "When in doubt, build it private first (`_ALLCAPS`). Promoting `_FOO` → `Foo` later is easy. Discovering a public skill leaks your life is permanent." Project-tree placement is the analog of `_ALLCAPS` — promotion to `~/.claude/skills/WebsiteProductionLoop/` is queued for the first non-realtor invocation.

## Execution log entry

```jsonl
{"ts":"2026-05-08T21:55:00Z","skill":"CreateSkill","workflow":"UpdateSkill","input":"WebsiteProductionLoop v0.1.0 → v0.2.0","status":"ok","duration_s":900}
```

(Will be appended to `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl` at cycle close per CreateSkill discipline.)
