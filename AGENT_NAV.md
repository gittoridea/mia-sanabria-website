# AGENT_NAV — code navigation & safe-refactor lane

> The "where is X / what uses X / what breaks if I change X" lane for this repo, for **both Torrey and LLM agents**.
> Zero-install: every command below uses `rg` (ripgrep) and `fd`, already standard on this host. No index, no embeddings, code never leaves the machine.
> Operationalizes the §4 recommendation in `~/.claude/PAI/MEMORY/WORK/website-codebase-mgmt-research-2026-06-03/LANDSCAPE.md`.
> **Repo invariant (CLAUDE.md:9):** `bun` always, never `npm`/`npx`. The optional upgrade tools below are owner-gated installs, NOT npx-at-runtime.

## Repo shape (so commands land)

- Import alias: `@/*` → `./src/*` (tsconfig.json). A module `src/lib/markets.ts` is imported as `@/lib/markets`.
- Content single-source-of-truth: `src/lib/{site,mia,markets,insights,bridge}.ts` (the canonical consts; see CLAUDE.md "Canonical client invariants").
- Routes: `src/app/**/page.tsx` (App Router). Components: `src/components/**`. Article data: `src/data/insights/*.ts`.

## The four moves

### 1. Find a symbol's DEFINITION
```bash
rg -n "export (const|function|type|interface|class|let) \w*<SYMBOL>" src/
# example (verified):
rg -n "export (const|function|type|interface|class|let) \w*MIA_APPROVED_NEIGHBORHOODS" src/
#   → src/lib/mia.ts:183:export const MIA_APPROVED_NEIGHBORHOODS = [
```

### 2. Find ALL usages of a symbol
```bash
rg -n "\b<SYMBOL>\b" src/ -g '*.ts*'
# example: rg -n "\bNAV\b" src/ -g '*.ts*'
#   → definition in src/lib/site.ts:67 + every consumer (SiteHeader.tsx:7,78,137)
```

### 3. Inspect a route's dependencies — both directions
```bash
# 3a. What does this route IMPORT (one level)?
rg -n "^import" "src/app/<route>/page.tsx"

# 3b. Reverse impact set — who CONSUMES a content module? (the code↔content map)
rg -l "@/lib/<module>" src/
# example (verified): rg -l "@/lib/markets" src/
#   → 9 files: sitemap.ts, markets/[slug]/page.tsx, markets/page.tsx, page.tsx,
#     FeaturedMarketsPager.tsx, MarketCard.tsx, AnswerFirst.tsx,
#     insights/RelatedMarketsModule.tsx, markets/FortLauderdaleV2.tsx
```
3b is the answer to **"if I edit `src/lib/markets.ts`, what must I re-check / re-render?"** — pair it with CLAUDE.md "Canonical client invariants".

### 4. Safe-refactor preflight (run BEFORE any rename/signature change)
```bash
# a. Size the blast radius:
rg -c "\b<SYMBOL>\b" -g '*.ts*' src/          # per-file ref counts
rg -l "@/lib/<module>" src/ | wc -l           # importer count
# b. Do the edit (Edit tool or `ast-grep -U`, see below).
# c. Prove nothing broke — the existing gates ARE the cascade validator:
bun run typecheck                              # tsc --noEmit — catches every missed ref
bun run build                                  # static export must succeed
bun run audit:all                              # 0 FAIL; content/route/schema cascade
# Visual edit? also: bun run audit:mobile-readability:capture   (CLAUDE.md rule)
```
There is no separate "change-cascade auditor" to build — `typecheck` + `build` + `audit:all` already prove the cascade. Step 4 just front-loads the ref count so you know what you're touching.

## Optional upgrade (owner-gated install — NOT required)

The four moves above cover ~90% of navigation with zero install. Two tools add **structural** precision regex can't (from LANDSCAPE.md §2, both `adopt-tool`). Install is a one-time owner decision; nothing here auto-installs.

- **ast-grep** — AST/structural search + dry-run rewrite. "Find every call shaped like `<X>($A)`", rename with `-U`.
  - Install (owner): `curl -fsSL https://github.com/ast-grep/ast-grep/releases/latest/download/<asset> -o ~/.local/bin/ast-grep` (or `cargo install ast-grep`). NOTE `/usr/bin/sg` on this host is Linux `switch-group`, NOT ast-grep — always invoke the full `ast-grep` binary.
  - Use: `ast-grep -p 'export const $A = $B' src/lib/markets.ts` · dry-run rewrite: `ast-grep -p '<old>' -r '<new>' --interactive`
- **probe** — zero-index local search returning complete semantic blocks (whole function/component), ideal for handing an agent a clean chunk.
  - Install (owner): see https://github.com/probelabs/probe (standalone binary to `~/.local/bin`).
  - Use: `probe search "<query>" src/` → returns full enclosing blocks, not line fragments.

Verdict from research: install these when a refactor is structural (rename a function signature across call sites) — the `rg`/`fd` moves stay the default for symbol/usage/route work.

## What this lane is NOT

- Not a replacement for the project ISA (`ISA.md`) or CLAUDE.md "Canonical client invariants" — those remain the source of truth for *what* facts live where.
- Not a deploy/rollback tool (that's `scripts/deploy-and-verify.ts` + Dokploy; rollback safety is a separate LANDSCAPE §5 zoom-in).
- Not content-schema validation (Velite/Zod is a separate, deferred zoom-in).
