# Reviewer E — PAI/Memory Placement

- **Reviewer:** E — PAI/Memory Placement
- **Files inspected:**
  - `/home/torrey/code/mia-sanabria-website/CLAUDE.md`
  - `/home/torrey/code/mia-sanabria-website/ISA.md` (frontmatter + 25 section headers via grep)
  - `/home/torrey/.claude/projects/-home-torrey/memory/MEMORY.md` (23-entry index)
  - `/home/torrey/.claude/projects/-home-torrey/memory/feedback_forge_race_scope_drift.md`
  - `/home/torrey/.claude/projects/-home-torrey/memory/feedback_subagent_reviewer_verdict_budget.md`
  - `/home/torrey/.claude/CLAUDE.md` (grep `closeout|learn phase` → zero matches)

- **Finding:** Hybrid. Mechanics (audit-gate names, `docs/artifacts/cycle-*` paths, Caddy ETag/cache-bust, ISA `## Decisions (continued — DATE cycle)` append) are Mia-site-specific. Discipline (named cycle + LEARN phase) is cross-project but **already covered** by Algorithm v6.4.0 LEARN + ISASync/WorkCompletionLearning hooks. The two existing memory feedbacks capture closeout-adjacent **failure classes**, not a protocol — i.e. cross-project value lives at failure-class granularity.

- **Recommended minimal change:** **project-local CLAUDE.md** — 3-5 line "Cycle closeout" subsection pinning cycle vocabulary, artifact path, audit-gate re-run. Skip global PAI CLAUDE.md and Algorithm spec.

- **Bloat risk:** **low** for project CLAUDE.md (63 lines, well-curated); **high** for global PAI CLAUDE.md.

- **Promotion target:** project-local CLAUDE.md. Defer a `feedback_cycle_closeout_discipline.md` memory until two non-Mia projects independently reinvent it.

- **Owner category:** Project-local invariant (Mia cycle ergonomics).

- **Confidence:** 0.82

- **Should main thread act:** **yes** — add CLAUDE.md subsection this cycle; defer memory promotion.

- **Justification one-paragraph:** The load-bearing mechanics (audit-gate names, Caddy cache-bust contract, `docs/artifacts/cycle-*` scheme, ISA append pattern) are Mia-repo-specific and already gestured at in CLAUDE.md §"Audit gates" + §"When in doubt." A short "Cycle closeout" subsection consolidates dispersed signals without inventing new doctrine. The two existing memory feedbacks prove cross-project value lives at failure-class level, not protocol level — promote case-by-case. Layering a project's closeout ritual onto Algorithm v6.4.0 / global CLAUDE.md would relitigate settled doctrine (the exact failure logged in `feedback_read_doctrine_before_architecture_recommendations.md`).

- **Anti-recommendation:** **Reject** (a) global `~/.claude/CLAUDE.md` — crowds constitutional rules with project mechanics; (b) Algorithm v6.4.0 spec edit — LEARN phase already specified; closeout is project ritual not algorithm phase; (c) new ISA.md section — ISA is per-run truth, not procedural doctrine; (d) discard — project demonstrably benefits from making implicit ritual explicit.

Path: `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-20-r1-smarter-ai-closeout/reviewer-packs/E-pai-memory-placement.md`
