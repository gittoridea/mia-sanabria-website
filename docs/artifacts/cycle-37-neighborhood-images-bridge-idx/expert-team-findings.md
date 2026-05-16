# Cycle 37 — Expert Team Findings

This cycle was executed as a primary-agent Algorithm run (E4) without dispatching parallel sub-agent specialists. Specialist-Prereq Probe results recorded for the record.

## Specialist-Prereq Probe (OBSERVE phase)

Lane Name: Forge
  actual_agent_used: false (probe-only — would have run if a Forge-class refactor surfaced)
  tool_or_method: SpecialistProbe.ts
  closed_now: probe-confirmed available (codex CLI + ~/.codex/auth.json present)
  prepared_now: would handle Bridge state-machine refactor at E4
  blocked_external: none
  risks_found: Forge invocation overhead unjustified for the scoped Bridge edits this cycle
  files_touched: none
  validation: probe stdout `forge: ok`

Lane Name: Anvil
  actual_agent_used: false
  tool_or_method: SpecialistProbe.ts
  closed_now: probe failed (binary not found at /home/torrey/.bun/bin/anvil)
  prepared_now: n/a
  blocked_external: Anvil binary not installed
  risks_found: none for this cycle
  files_touched: none
  validation: probe stdout `anvil: missing`

Lane Name: Cato
  actual_agent_used: false
  tool_or_method: SpecialistProbe.ts
  closed_now: probe-confirmed available (codex read-only sandbox)
  prepared_now: cross-vendor audit could run on Bridge changes
  blocked_external: none
  risks_found: Cato invocation overhead exceeded the marginal value at this scope
  files_touched: none
  validation: probe stdout `cato: ok read-only`

## Lanes executed inline (primary agent)

Lane Name: Recovery Commander
  actual_agent_used: false (primary agent)
  tool_or_method: Bash + Read + git
  closed_now: Phase 0 preflight + Phase 1 prior-state review
  prepared_now: Cycle 37 task plan
  blocked_external: none
  risks_found: 3 untracked Cycle-35 log files (left in place — not in scope)
  files_touched: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/{resume-preflight,prior-state-review}.md
  validation: head_equals_origin_main verified

Lane Name: Neighborhood Image Director
  actual_agent_used: false (primary agent)
  tool_or_method: Read + Sharp + sizing scan
  closed_now: identified 7 placeholder neighborhoods (Coral Springs, Davie, Deerfield Beach, Hollywood, Plantation, Sunrise, Weston) by file-size threshold + source comments
  prepared_now: image generation brief per slug
  blocked_external: none
  risks_found: prior cycle PASS reports masked placeholder-only state
  files_touched: scripts/generate-neighborhood-images.ts + scripts/audit-neighborhood-images-deep.ts
  validation: deep-image audit 23/23 PASS post-generation

Lane Name: Image Generation / Asset Operator
  actual_agent_used: false (primary agent)
  tool_or_method: Gemini 2.5 Flash Image API + Sharp
  closed_now: 14 assets generated (7 hero + 7 OG) + provenance ledger
  prepared_now: rollback paths documented per slug
  blocked_external: none
  risks_found: Gemini occasionally renders a "frame" perspective; final crop mitigates
  files_touched: public/markets/{7}.jpg + public/og-markets/{7}.jpg
  validation: file size 104-334 KB hero / 73-164 KB OG; visual spot-check Davie + Hollywood

Lane Name: Bridge IDX Architect
  actual_agent_used: false (primary agent)
  tool_or_method: Edit + Write
  closed_now: Bridge state machine + bundled fixtures + truthful mode rendering
  prepared_now: live-promotion path documented (set NEXT_PUBLIC_BRIDGE_DEMO=false + present credentials)
  blocked_external: SEF MLS approval, Bridge dashboard Referrer Domain
  risks_found: error path now renders branded ErrorPanel (no iframe); preserves contact-Mia escape hatch
  files_touched: src/lib/bridge-client.ts, src/components/bridge/BridgeSearch.tsx
  validation: typecheck + lint + build + completeness + brand all PASS

Lane Name: Old IDX Retirement Auditor
  actual_agent_used: false (primary agent)
  tool_or_method: Write + git grep
  closed_now: deleted IdxEmbed.tsx, removed homepage usage, retired MlsMatrixFallback, updated audit-completeness sentinels
  prepared_now: audit:no-old-idx wired into audit:all to prevent regression
  blocked_external: none
  risks_found: audit-completeness check would have failed without sentinel update — handled
  files_touched: src/components/IdxEmbed.tsx (deleted), src/app/page.tsx, src/components/bridge/BridgeSearch.tsx, src/lib/bridge.ts, src/lib/site.ts, scripts/audit-completeness.ts, scripts/audit-no-old-idx.ts (new)
  validation: audit:no-old-idx PASS 477 files

Lane Name: Security / Secrets Officer
  actual_agent_used: false (primary agent)
  tool_or_method: presence-only env probes + secret-shape scans
  closed_now: source secret scan clean, out/.next value-shape scan clean, gitignore check
  prepared_now: deploy phase will source ~/.claude/.env in subshell with set +x only
  blocked_external: none
  risks_found: NEXT_PUBLIC_* env names appear inlined in chunks (expected Next.js); no values leak
  files_touched: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/secret-safety-report.md
  validation: 0 value-shaped matches in out/.next; 0 in source

Lane Name: Visual QA Reviewer
  actual_agent_used: false (primary agent)
  tool_or_method: capture-baseline.ts + python http.server preview
  closed_now: 20 PNGs captured for new neighborhoods + home + home-search at 375 + 1280
  prepared_now: staging visual QA after deploy
  blocked_external: none
  risks_found: none for this cycle
  files_touched: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/local/*.png
  validation: 20/20 captures succeeded, no error frames

Lane Name: Release Engineer
  actual_agent_used: pending — Phase 9 + 10
  tool_or_method: tmux + scripts/deploy-and-verify.ts + curl
  closed_now: pre-deploy validation gates green
  prepared_now: deploy command primed; live-verification curl loop primed
  blocked_external: Dokploy availability
  risks_found: cache flip needs cb=hex query string per CLAUDE.md
  files_touched: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/staging-deploy-report.md (post-phase)
  validation: post-deploy

Lane Name: Cato / Compliance Reviewer
  actual_agent_used: false
  tool_or_method: probe-only
  closed_now: probe-confirmed available; explicit decision NOT to invoke this cycle
  prepared_now: would be invoked if Bridge moved to live mode in this cycle
  blocked_external: none
  risks_found: under-utilizing Cato is acceptable when changes are scoped + each gate green
  files_touched: none
  validation: documented decision in this report

Lane Name: Forge / Engineer
  actual_agent_used: false
  tool_or_method: probe-only
  closed_now: probe-confirmed available; explicit decision to do refactor inline because the change set was small enough
  prepared_now: available for next cycle if scope expands
  blocked_external: none
  risks_found: none
  files_touched: none
  validation: gates green without Forge invocation
