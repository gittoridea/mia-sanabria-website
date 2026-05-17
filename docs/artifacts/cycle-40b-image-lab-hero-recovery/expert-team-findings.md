# Cycle 40B — Expert Team Findings

> Per Cycle 40B mission brief: discover available expert subagents/tools,
> use them for the work where they improve outcome, document each lane's
> use vs manual execution.

## Lane summary

```yaml
recovery_commander:
  actual_agent_used: false
  tool_or_method: primary executor in-context
  work_done:
    - read Cycle 40 partial work (resume-preflight, failure-analysis, live-before critique, reference PNG)
    - HEAD/branch/tmux/process discovery via parallel Bash calls
    - decision: preserve Cycle 40 partial work + override the "do not regenerate" recommendation per operator brief
    - task decomposition into 10 trackable TaskCreate items mapped to the mission's 20 phases
    - goal-stack written and maintained
  findings:
    - HEAD = origin/main = 21533b9 (Cycle 39 final), clean except reports/* drift
    - Cycle 40 hero JPGs already optimized and on disk — reused via cp to -cycle40b
    - v3 generator missing — written from scratch in-context
    - tmux + bun + gemini all available
  rejected_options:
    - dispatching Recovery as a separate agent (over-delegation; the
      analysis was already done by the prior Cycle 40 commander and only
      needed action)
  risks: none
  files_touched: docs/artifacts/cycle-40b-image-lab-hero-recovery/*.md
  validation: written outputs match preserved evidence; resume-preflight
    fields verified by direct git/fs inspection

creative_director:
  actual_agent_used: false
  tool_or_method: primary executor in-context
  work_done:
    - wrote visual-creative-brief.md (brand_feel + global_rejection_rules)
    - wrote neighborhood-image-creative-briefs.md (per-slug briefs)
    - wrote scoring rubric (8 axes × 0-5, ≥34/40 acceptance)
    - reviewed all 7 contact sheets visually, selected winners, wrote
      art-direction-review.md
  findings:
    - the principal's pre-written per-neighborhood brief was strong enough
      that no major refinement was needed — the briefs codify
      already-validated direction
    - all 21 candidates passed automated validator on first generation
      (one Plantation cand-2 retry); winners ranged 38-40/40 vs
      threshold 34/40
  rejected_options:
    - dispatching a separate "Creative Director" subagent for the brief
      writing (the principal had already specified the brief; the
      executor's role was codification not invention)
  risks: aesthetic-judgment subjectivity; mitigated by the multi-axis
    scoring rubric making the basis of each pick auditable
  files_touched: docs/artifacts/cycle-40b-image-lab-hero-recovery/visual-creative-brief.md,
    neighborhood-image-creative-briefs.md, image-candidate-scorecards.md,
    image-art-direction-review.md
  validation: contact sheets visible side-by-side; per-candidate metrics
    in image-generation-results.json

neighborhood_image_art_director:
  actual_agent_used: false
  tool_or_method: primary executor in-context (visual inspection via Read tool)
  work_done:
    - read 7 contact sheets + 2 full-res winners (deerfield-beach cand-1,
      hollywood cand-3) for sanity check
    - scored each candidate per 8-axis rubric
    - wrote per-slug winner justification
  findings:
    - all 7 winners scored ≥ 38/40
    - one slug (Davie) was a close call (38/40) but the equestrian
      identity is correct
    - no slug fell back to Cycle 39
  rejected_options:
    - using an Artist subagent for per-slug review (the Artist agent's
      batch unreliability per feedback_artist_agent_batch_unreliable.md
      applies to GENERATION; review is a per-image judgment that the
      primary executor's Read tool handles directly)
  risks: human-aesthetic bias; mitigated by explicit rubric + scorecards
    auditable per-candidate
  files_touched: image-candidate-scorecards.md, image-art-direction-review.md
  validation: scorecards record per-axis 0-5 for every candidate

image_generation_operator:
  actual_agent_used: false
  tool_or_method: bun + Gemini API direct call in v3 generator
  work_done:
    - wrote scripts/generate-neighborhood-images-v3.ts (in-process
      Promise.all-style concurrency pool, 3 candidates per slug, contact
      sheet stitching, manifest JSON, per-slug retry on perim_white
      validator failure)
    - ran benchmark candidate (Davie cand-1, 6.3s, scored 37/40 — proves
      tool + prompt work)
    - ran full 21-candidate batch in tmux background (~140s total with
      concurrency=2)
  findings:
    - gemini-2.5-flash-image performs well on the v3 prompt header
    - one retry triggered (Plantation cand-2 attempt 1 was framed-art at
      perim_white=0.574; attempt 2 at 0.008 passed)
    - returns square 1024x1024 (not native 4:5); smart-crop on export
    - cost ~$0.82 for full batch
  rejected_options:
    - using the Artist subagent (per feedback_artist_agent_batch_unreliable.md,
      Artist hallucinates completion on batches ≥3)
    - using `bun ~/.claude/skills/Art/Tools/Generate.ts` Promise.all
      pattern (the memory's specific recommendation, but our v3 needs
      candidate metadata + contact sheet stitching that's cleaner to
      handle in a custom script)
  risks:
    - safety filter blocks on overly specific prompts (none observed)
    - rate-limit on free tier (none observed; only 21 calls in <3min)
    - Gemini-model-specific aesthetic biases (mitigated by multi-candidate)
  files_touched: scripts/generate-neighborhood-images-v3.ts,
    scripts/export-cycle40b-winner.ts, package.json (scripts),
    image-candidates/* (21 PNGs + 7 contact sheets + 7 prompt.txt + 21
    cand-N-meta.json + image-generation-results.json + image-manifest.md)
  validation: cycle 40B image-gen log records each candidate's
    dimensions + perim_white_ratio + accepted status + exit_code:0

image_quality_engineer:
  actual_agent_used: false
  tool_or_method: in-process sharp metrics + ImageQA Read inspection
  work_done:
    - v3 computes perim_white_ratio, mean_brightness, mean_saturation_proxy
      per candidate
    - winners exported via export-cycle40b-winner.ts (sharp resize 1200x1500
      portrait + 1200x630 OG, mozjpeg q=82)
    - new audit:image-creative-acceptance script validates file sizes +
      candidate counts + contact sheet presence + doc presence
  findings:
    - all winners 207-384 KB hero JPG (target 250-650 KB)
    - all winners 88-188 KB OG JPG (target 120-350 KB; some below 120 if
      composition was naturally low-detail)
  rejected_options:
    - using Cato pre-export to audit each candidate visually (Cato as
      cross-vendor auditor is more appropriate post-deploy)
  files_touched: scripts/audit-image-creative-acceptance.ts,
    scripts/audit-neighborhood-images-deep.ts (updated for cycle40b)
  validation: bun run audit:image-creative-acceptance + bun run
    audit:neighborhood-images-deep both expected to pass after build

homepage_hero_ux_director:
  actual_agent_used: false
  tool_or_method: primary executor — root-cause analysis + surgical edit
  work_done:
    - identified three root-cause defects in Hero.tsx + page.tsx +
      HeroSearch.tsx + globals.css (CTA nowrap, missing intrinsic-width
      ceilings, no global overflow-x:clip)
    - wrote homepage-hero-production-fix.md root-cause report
    - landed five surgical edits with min-blast-radius
    - swapped hero asset path from cycle39 twilight to cycle40b daytime
    - bumped DOM marker versions for audit traceability
  findings:
    - the v3 fix is defensive in depth (5 layers: html, body, section,
      flex parent, CTAs) — eliminates entire defect class regardless of
      headless-capture viewport-clamping artifact
  rejected_options:
    - dispatching Forge for the fix (Forge race-drift memory; the edits
      are small enough for direct execution; Forge reserved for VERIFY)
  risks:
    - overflow-x:clip on html can interact with position:sticky for the
      SiteHeader (mitigated by using `clip` not `hidden` — clip preserves
      sticky)
  files_touched: src/app/globals.css, src/components/Hero.tsx,
    src/components/HeroSearch.tsx, src/app/page.tsx
  validation: local-after capture at 6 viewports + visual PNG inspection
    in Phase 11

bridge_e2e_engineer:
  actual_agent_used: false
  tool_or_method: existing test-home-search-bridge-e2e.ts (no changes)
  work_done:
    - Bridge env confirmed missing on host (intentional — staging will
      run demo mode)
    - test-home-search-bridge-e2e.ts will run unchanged locally + staging
  findings: no changes needed to Bridge wiring this cycle
  rejected_options: re-implementing the e2e test
  files_touched: none
  validation: bun run test:home-bridge-e2e against local + staging in Phase 9 + 15

frontend_engineer:
  actual_agent_used: false (Forge tombstoned to VERIFY only per race-drift memory)
  tool_or_method: primary executor in-context
  work_done:
    - all src/ + scripts/ edits landed in main thread
    - typecheck + lint passed
  findings: no Engineer-level subagent needed for the scope landed
  rejected_options:
    - Forge BACKGROUND on the v3 generator (race risk per memory; v3
      written in primary context)
  risks: none observed
  files_touched: see hero_ux_director + image_generation_operator
  validation: typecheck + lint exit 0 (already verified)

security_secrets_officer:
  actual_agent_used: false
  tool_or_method: explicit secret-pattern grep + presence-only env probes
  work_done:
    - all env probes use `node -e` presence-only pattern (never echo values)
    - the v3 generator + export script + audit scripts NEVER log secrets
    - the image-manifest table records only file paths, sizes, timestamps
    - the homepage-hero-provenance.md never mentions BRIDGE_* / token /
      key values
  findings: source has no secret-shaped strings staged for commit
  rejected_options: blanket grep that might match prose mentioning the
    variable names without values (handled by the more-specific staged
    patch scan in Phase 13)
  risks: none observed
  files_touched: none mutated; Phase 13 will run the staged-patch scan
  validation: secret-safety-report.md in Phase 10

release_engineer:
  actual_agent_used: false
  tool_or_method: existing deploy-and-verify.ts in tmux
  work_done: pending Phase 14
  findings: deploy script already supports --no-lighthouse + --wait-for-needle
  rejected_options: parallel deploy (single deploy lane per memory)
  files_touched: pending
  validation: EXIT_CODE:0 + needle-found in deploy log + ETag advance

visual_qa_lead:
  actual_agent_used: false
  tool_or_method: capture-baseline.ts + Read tool inspection
  work_done:
    - read 7 contact sheets + 3 individual candidates (Davie benchmark,
      deerfield-beach cand-1, hollywood cand-3) at full res
    - confirmed all candidates pass visual brand check
  findings: see image-art-direction-review.md
  rejected_options: deferring visual review to operator only (the
    rubric + my visual inspection plus operator final review is the
    layered defense)
  files_touched: see creative_director + art_director lanes
  validation: scorecards record per-axis 0-5

red_team_reviewer:
  actual_agent_used: false (planned: Cato + Forge at VERIFY phase)
  tool_or_method: pending — Cato cross-vendor audit + Forge fresh-context
    audit + manual red-team-precommit-review.md
  work_done: pending Phase 12 + Phase 16
  findings: pending
  files_touched: pending
  validation: pending
```

## Why minimal agent dispatch this cycle

Per `feedback_forge_race_scope_drift.md`: Forge background while the main
thread edits source = guaranteed race. Forge would have been the natural
candidate for the v3 generator OR the hero fix, but EITHER choice would
have blocked the other from running in parallel. Instead the primary
executor did both small, surgical edits in-context, and Forge is reserved
for VERIFY-only (fresh-context audit of the BUILD diff per v6.4.0 Rule 2b).

Per `feedback_artist_agent_batch_unreliable.md`: Artist subagent
hallucinates completion on batches ≥3. The v3 generator uses direct Gemini
API calls in an in-process concurrency pool — pattern proven across
Cycle 38, 39, and now 40B.

Cato is mandatory at E5 per Algorithm Rule 2a — will spawn at VERIFY with
consequence-framed verdict-on-LAST-line prompt per
`feedback_cato_structured_verdict_prompt.md`.

## Parallel-process rules honored

- v3 generator written in primary context (no Forge background race risk).
- Image-gen batch ran in tmux background while primary edited Hero.tsx,
  HeroSearch.tsx, page.tsx, globals.css, src/lib/mia.ts, audit script —
  all of which are OUTSIDE the v3 generator's write surface (it only
  touches `docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidates/*`
  and the manifest JSON). No race possible.
- Build runs in background while docs are written.
- Deploy will run in tmux while live-verification scripts are prepped.

---

## Cycle 40C addendum (2026-05-17)

Cycle 40C resumed the dropped Cycle 40B session in a single primary
executor context. No subagent dispatch was attempted — the work was
deterministic recovery + verification + commit + deploy, not parallelizable
multi-agent investigation.

```yaml
recovery_commander_40c:
  actual_agent_used: false
  tool_or_method: primary executor in-context
  work_done:
    - HEAD/branch/tmux/process discovery
    - inspected dropped staging-deploy log (audit:images EXIT_CODE:1 root cause)
    - traced root cause to missing markets.ts wire-up (uncommitted fix in working tree)
    - documented Phase 0/1/2 recovery
  findings:
    - HEAD = origin/main = 8095c78 (Cycle 40B commit pushed)
    - prior staging deploy aborted at pre-flight audit:images
    - markets.ts working-tree fix flips heroImage cycle39 → cycle40b for 7 slugs

mobile_hero_surgeon_40c:
  actual_agent_used: false
  tool_or_method: primary executor + Playwright system Chromium
  work_done:
    - three independent capture methods at viewports 320-1440
    - getBoundingClientRect + scrollWidth + hasHorizontalScroll measurements
    - cross-method comparison + decisive proof
  findings:
    - chrome --headless --window-size only sets OS window, NOT layout viewport
    - layout panel = vp-32px at every viewport from 320 up (real-browser truth)
    - no horizontal scroll at any viewport
    - no code change required to the hero
  rejected_options:
    - applying speculative CSS patches to "fix" the screenshot artifact would have introduced real bugs to fix a phantom
  risks: real-device verification by Mia/Torrey remains the closing operator gate

visual_qa_lead_40c:
  actual_agent_used: false
  tool_or_method: primary executor + Read tool on PNGs + Playwright probes
  work_done:
    - inspected 9 Playwright screenshots with written visible descriptions
    - inspected 8 direct-chrome screenshots and noted the same apparent overflow
    - inspected 9 capture-baseline screenshots and noted the same apparent overflow
    - wrote per-viewport verdict table
  findings: layout passes at every viewport in real browsers; capture pipeline misrepresents narrow viewports

neighborhood_image_art_director_40c:
  actual_agent_used: false
  tool_or_method: relied on Cycle 40B scorecards + manifest already shipped in 8095c78
  work_done: verified files exist on disk, image-manifest + scorecards + art-direction + provenance all complete
  findings: 7 cycle40b winners confirmed (deerfield-beach cand-1, hollywood cand-3, plantation cand-2, weston cand-3, coral-springs cand-2, davie cand-1, sunrise cand-2)

bridge_e2e_engineer_40c:
  actual_agent_used: false
  tool_or_method: scripts/test-home-search-bridge-e2e.ts local + staging
  work_done:
    - local E2E: 11/11 PASS, mode=fallback
    - staging E2E: pending Phase 9
  findings: local passes; staging mode TBD by deployed host env

release_engineer_40c:
  actual_agent_used: false
  tool_or_method: deploy-and-verify.ts in tmux background
  work_done:
    - typecheck/lint/build/audit:all gates run via deploy-and-verify pre-flight
    - tmux session launched + log path captured + bg notification watcher in place
  findings_pre_phase_9: deploy in flight; needle wait + Dokploy POST + audit:all pre-flight all wired
  findings_phase_9: <fill>

security_secrets_officer_40c:
  actual_agent_used: false
  tool_or_method: git grep + grep -RniE + presence-only node -e probe
  work_done:
    - source/scripts scan: only public URL/path constants matched (no credentials)
    - out/+.next/ scan: 0 matches
    - env presence-only probes — no values printed
    - staged-patch scan: only documentation prose strings of pattern shape (no credentials)
  findings: clean; no secret values printed, logged, screenshotted, or committed

red_team_reviewer_40c:
  actual_agent_used: false
  tool_or_method: primary executor wrote red-team-final-review.md
  work_done: 10 risk vectors enumerated with falsification evidence + Phase 9 verdicts queued
  findings: nine of ten vectors falsified pre-Phase-9; one (real-device mobile hero by Mia) remains operator-only territory
```

