# Reviewer B — Bloat Red-Team

- **Reviewer:** B — Bloat Red-Team
- **Files inspected:**
  - `~/code/mia-sanabria-website/CLAUDE.md` (64 lines — already dense with 8 invariant sections)
  - `~/code/mia-sanabria-website/docs/artifacts/cycle-20-agency-qa/final-pm-synthesis.md` (§11 already enumerates 8 follow-up prompts)
  - `~/code/mia-sanabria-website/docs/artifacts/cycle-20-agency-qa/issue-matrix.md` (the 6-owner-type taxonomy is already live)
  - `~/code/mia-sanabria-website/docs/CYCLE_18_PROCESS_UPGRADE_REPORT.md` (4 lessons + 3-item backlog, already a closeout)
  - `~/code/mia-sanabria-website/docs/CYCLE_15_PROCESS_UPGRADE_REPORT.md` (7 lessons → skill v0.4.0)
  - `~/code/mia-sanabria-website/docs/CYCLE_19C_COPY_HANDOFF.md` (already groups remaining blockers by the same 6 owner categories)
- **Finding:** The protocol is **97% ceremony, 3% novelty**. Cycle 15 and 18 PROCESS_UPGRADE_REPORTs already do durable-lesson extraction with naming, generalization, and skill-update queuing. Cycle 19C HANDOFF already groups blockers into the proposed 6 owner-type buckets (§Remaining blockers c1–c6). Cycle 20's final-pm-synthesis already enumerates follow-up prompts (§11) and recommends next cycles. The only thing missing is a one-line *promotion verdict* per cycle. A formal 7-bullet block in CLAUDE.md adds ~25 lines (40% of the file) of cognitive surface that competes with load-bearing rules like Fair Housing audits, sharp/libvips runtime, and Caddy cache-bust hex.
- **Recommended minimal change:** 1-line CLAUDE.md addition (or 2 lines, not a 7-bullet block)
- **Bloat risk:** high (if proposed as written into CLAUDE.md); low (if kept as a template in `docs/`)
- **Promotion target:** template (in `docs/`, optional one-line CLAUDE.md pointer — NOT the full block)
- **Owner category:** tool/process
- **Confidence:** 0.82
- **Should main thread act:** yes (minimal version)
- **Justification one-paragraph:** Two of the seven bullets (Pattern type, Bloat guard) are redundant — "Bloat guard" collapses into "Promotion target = discard". One bullet (Owner category) duplicates the 6-owner taxonomy already in issue-matrix.md. Two more (Action taken, Earlier catch) are implicit in any honest handoff. Claude already produces end-of-turn summaries; existing PROCESS_UPGRADE_REPORT_*.md files are evidence the practice is already alive and adapting per-cycle. Fossilizing it as a CLAUDE.md block risks two failure modes: (a) checkbox-completion theater that dulls real lessons (Cycle 15 lesson 1 was "honest dates" — would have been flattened into 18 words), and (b) cognitive-surface crowding against rules that prevent compliance/FairHousing/cache regressions. Ship as `docs/CYCLE_CLOSEOUT_TEMPLATE.md` (offer, don't enforce) plus a single CLAUDE.md line: *"On cycle close, emit at minimum: smallest durable improvement + promotion target (audit/CLAUDE.md/discard). Discard is first-class."* That captures the only novel demand — the explicit discard verdict — without 25 lines of structure. Two-bullet versions force the bit; seven-bullet versions invite filler.
