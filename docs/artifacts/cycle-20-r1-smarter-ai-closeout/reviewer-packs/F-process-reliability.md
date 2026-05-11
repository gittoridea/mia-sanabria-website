# Reviewer F — Process Reliability

- **Reviewer:** F — Process Reliability
- **Files inspected:**
  - `~/.claude/projects/-home-torrey/memory/feedback_cato_structured_verdict_prompt.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_codex_cli_reasoning_effort_flag.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_forge_race_scope_drift.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_subagent_reviewer_verdict_budget.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_artist_agent_batch_unreliable.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_caddy_dokploy_cache_bust.md`
  - `~/.claude/projects/-home-torrey/memory/feedback_forge_e3_binding_skipped.md`
- **Finding:** The shared failure pattern is **claimed-completion without artifact** — Cato says "audit done" with no verdict JSON, Artist says "launched all 7" with zero files, Caddy returns 200 with stale bytes, Forge says "scope respected" after clobbering five files. The closeout protocol's job is to force every claim to name the artifact path that proves it, or be classified as unverified.
- **Recommended minimal change:** Add one line to the closeout template: each lesson must cite a file/log/URL that would change if the lesson were violated — no citation, no promotion.
- **Bloat risk:** low
- **Promotion target:** shape-existing-rule (extend the durable-lesson row format already proposed in cycle-20 synthesis; no new CLAUDE.md prose)
- **Owner category:** tool/process
- **Confidence:** 0.86
- **Should main thread act:** yes
- **Justification one-paragraph:** All seven defects share one root: an agent or system asserted completion that wasn't verifiable from artifacts. The protocol's leverage point is the same one PAI's existing receipt discipline already uses — force evidence at the claim point. A closeout that lists lessons without citing the artifact each lesson would protect is itself the same anti-pattern. One bullet ("citation or unverified") prevents lesson-bloat AND lesson-fakery in the same stroke, without adding a new ceremony layer. The other six candidates are valuable but narrower — they each address one failure mode, while citation-discipline addresses the meta-pattern that generated them.
- **Anti-recommendation:**
  - *Pre-write verdict skeleton* (subagent_reviewer_verdict_budget): correct fix, but it shapes subagent prompts, not the closeout protocol — wrong scope.
  - *Suspend main edits during background Forge* (forge_race_scope_drift): high value but belongs in Forge dispatch doctrine, not closeout.
  - *Voice failure ≠ cancel verify* (caddy adjacent): real but a hook/notification concern, not closeout-shaped.
  - *Don't dispatch Cato when not needed* (forge_e3_binding reverse): a routing rule, already lives in capability binding.
  - *Codex CLI flag form* (codex_cli_reasoning_effort_flag): a syntax fix, zero protocol-design leverage.
  - *Artist batch direct-CLI* (artist_agent_batch_unreliable): tool-selection rule, not protocol-shaped.

File: `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-20-r1-smarter-ai-closeout/reviewer-packs/F-process-reliability.md`
