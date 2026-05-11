# Project-local Claude Code recommendations — Cycle 19A-M

> These are recommendations, not committed infra. The project-local `.claude/` directory currently only contains `worktrees/`. We resist bloating it without convention.
> If/when we adopt project-local skills/hooks/subagents, this file is the staging draft.

## Skills (project-local)

Skill name | Purpose | Why project-local vs PAI global
-----|---------|-----
WebsiteProductionLoop | Owns the build → audit → deploy → live-verify → handoff flow specific to mia-sanabria-website (and forks for future BSS clients). Wraps the existing `bun run audit:all && deploy && smoke` chain into one callable workflow with effort-tier ISC budgeting. | Project-local because the deploy substrate (Dokploy), the audit chain, and the live URL are project-bound. Forkable for Sunrise / C3 / C4 / C5.
QAGateSkill | Provides the read of `reports/qa-gate-matrix.json` and classifies findings into owner-category 1..6, surfaces top blockers, and writes the readiness register stub. | Project-local because the page_type taxonomy + the 6-category split are domain-bound.

If/when adopted: scaffold per PAI `Skill` skill conventions at `.claude/skills/<Name>/SKILL.md` + `Workflows/` + `Tools/`.

## Hooks (project-local recommendations)

Hook | Trigger | Action
-----|---------|-------
`PreCommitStaleString.hook.ts` | `git commit` PreCommit | Run `bun run audit:stale` against the latest `out/`; block commit on a non-zero exit. (Prevents footer-double-period-class defects from ever reaching `main`.)
`ScreenshotRequiredOnVisualEdit.hook.ts` | PostToolUse Edit/Write on `src/components/**` or `src/app/globals.css` | Surface a reminder to capture before/after screenshots via `audit:mobile-readability:capture` before commit. Doesn't block — warns.
`PortGuardOnAuditRendered.hook.ts` | PreToolUse Bash matching `audit:rendered` or `deploy-and-verify` | Inject port-guard check; if 4173 is busy, fail fast with structured message naming the alternate.
`DocCrossRefIntegrity.hook.ts` | Stop | Check that every `Cycle N` reference in newly-edited handoff docs has the corresponding `docs/CYCLE_N_*.md` file present (typo guard for cycle numbering).

If adopted: register in `.claude/settings.json` `hooks` block.

## Subagents (project-local recommendations)

Subagent | Role | Tools
---------|------|------
`mobile-ux-auditor` | Reads `reports/audit-mobile-readability.{json,md}` + screenshots under `docs/artifacts/<cycle>/mobile-readability/`; emits structured findings on typography, tap-target, hero-fit, mobile-conversion-path. Read-only. | Read, Glob, Grep
`seo-aeo-auditor` | Reads `reports/audit-seo.{json,md}` + `reports/audit-schema.{json,md}` + `reports/qa-gate-matrix.{json,md}`; classifies findings on title/meta/canonical/schema/internal-links/direct-answer-extractability. Read-only. | Read, Glob, Grep
`compliance-classifier` | Reads `reports/audit-stale-terms.{json,md}` (if available) + `reports/audit-legal.{json,md}` + `reports/qa-gate-matrix.{json,md}`; classifies findings into c5 (legal) vs c1 (site fix) and surfaces principal/legal review items. **Does not provide legal conclusions.** Read-only. | Read, Glob, Grep
`launch-ops-planner` | Reads the production-readiness register; surfaces top-3 next-cycle launch dependencies. Read-only. | Read, Grep
`tooling-reliability-reviewer` | Reads `~/.claude/PAI/MEMORY/LEARNING/REFLECTIONS/algorithm-reflections.jsonl` + this repo's recent cycle handoffs; surfaces patterns of Cato/Forge PARTIAL / port conflicts / silent failures; proposes fix tickets. Read-only. | Read, Grep, WebFetch

If adopted: scaffold per `.claude/agents/<name>.md` convention (Anthropic agent format).

## Settings (project-local)

`.claude/settings.json` not yet present. Recommended fields when adopted:

```jsonc
{
  "permissions": {
    "deny": [
      "Bash(curl -X POST https://miasanabriarealtor.com/*)",
      "Bash(curl -X POST https://*ghl*/*)",
      "Bash(rm -rf out)",
      "Bash(rm -rf node_modules)"
    ],
    "allow": [
      "Bash(bun run *)",
      "Bash(bun *)",
      "Bash(rg *)",
      "Bash(grep *)",
      "Bash(curl -sI *)"
    ]
  },
  "hooks": {
    // populate when hooks adopted
  }
}
```

## What we deliberately did NOT do this cycle

- Commit a project-local `.claude/settings.json` — adds always-loaded context; defer until at least one hook or subagent is actually used.
- Move project-local CLAUDE.md content into `.claude/` — Claude Code reads `CLAUDE.md` at the repo root; that's where convention puts it.
- Adopt `Skill("WebsiteProductionLoop")` as a global PAI skill — first prove the workflow inside this repo with a manual loop; promote if the pattern survives 2-3 client forks.
