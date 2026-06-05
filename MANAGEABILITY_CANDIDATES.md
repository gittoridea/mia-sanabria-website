# Manageability cadence — daily pick

> The standing "codebase manageability" program for this site. **Pick 1 candidate per day** (highest-leverage first), progress it to its done-oracle, stop. Owner-paced — no cron. Full report + rationale: `~/.claude/PAI/MEMORY/WORK/website-codebase-mgmt-research-2026-06-03/ROADMAP.md`.

## Daily top-3 (rotate, pick 1/day)

| Pick | Candidate | Effort | Risk | Done-oracle |
|------|-----------|--------|------|-------------|
| 1 | **Dokploy GHCR registry rollback** | M | med | App registry configured (`DokployDeploy.ts --status`); ≥2 image-tagged deploys + Rollback button on a non-latest; test rollback flips live `etag` to prior build. Owner-gated (prod config + GHCR cred). |
| 2 | **Velite typed content** (DESIGN only, never same-day apply) | L | high | `.velite/index.d.ts` generated; `typecheck && build` 0; `audit:all` 0 FAIL; an invalid content entry fails Zod at build. Owner-gated (`bun add` denied). Migrate ONE collection first — blast radius = ~9 files + ISA + 27 audits. |
| 3 | **Knip backlog-clear** | S | low | `bun run audit:deadcode` finding count drops to only ISC-618 intentional API; decide if it joins `audit:all`. |

## Backlog (lower leverage)
- **AGENT_NAV propagation** → BSS flagship + other client repos (Mia DONE).
- **probe** semantic-block code search — owner-gated `~/.local/bin` install; marginal over rg/fd.
- **ast-grep + @next/codemod** refactor lane — owner-gated install; high value only when a structural multi-site rename is needed.
- **Declare @eslint/eslintrc + @napi-rs/canvas** (currently knip-suppressed) — owner runs `bun install`; risk only on fresh clone.

## How to run a pick
1. Open a session in this repo. 2. Read the candidate's row + its ROADMAP detail. 3. Progress to the done-oracle (owner-gated steps stop at the gate with a copy-paste command). 4. Gates stay green: `bun run typecheck && bun run build && bun run audit:all`. 5. Cato before any commit; push owner-gated.

## Shipped
- AGENT_NAV lane — `26b0f1f` · Knip gate + dead-code removal — `e03a21a`.
