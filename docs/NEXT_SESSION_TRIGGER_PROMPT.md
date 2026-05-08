# Next Session — Trigger Prompt (paste-ready)

> Paste the contents of the code block below into a fresh Claude Code session in `~/code/mia-sanabria-website/`. Self-contained; references the 4 companion docs landed this cycle.

---

## TRIGGER PROMPT

```
Mission: Mia Sanabria luxury realtor site — Lead Magnet build + Brand Consistency Sprint. Resolve Pillar 20 FAIL → PASS by shipping the first gated lead magnet (Eastern Fort Lauderdale Luxury Waterfront Buyer's Guide) end-to-end: PDF, landing page, gated form, thank-you page, GHL pipeline integration, 5-email nurture sequence. Run audit-completeness as a continuous structural-drift guardrail. Close visible brand drift surfaced by the gap matrix.

OBSERVE — load this context BEFORE any other work, in this order:

1. /context-search query "Mia site lead magnet brand sprint Eastern Fort Lauderdale waterfront buyer GHL"
2. Read repo ISA at ~/code/mia-sanabria-website/ISA.md (currently phase=verify, progress 220/225 after the 2026-05-08 PM audit-v2 cycle at commit 0fced7d)
3. Read these 4 next-session companion docs in this order:
   a. docs/NEXT_SESSION_LEAD_MAGNET_AND_BRAND_SPRINT.md (mission, current state, blockers, success criteria, lane structure)
   b. docs/BRAND_SYSTEM_CONTRACT.md (the locked visual-system contract — colors, type, components, image, CTA, footer, mobile, screenshot acceptance)
   c. docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md (page-by-page scoring matrix; identifies highest-leverage closures)
   d. docs/LEAD_MAGNET_PDF_SPEC.md (expert spec for the first lead magnet — primary recommendation: Eastern Fort Lauderdale Luxury Waterfront Buyer's Guide)
4. Read these supporting docs:
   - docs/GHL_INTEGRATION_OPTIMAL.md (form-wiring architecture)
   - docs/GHL_BLOG_INTEGRATION_DECISION.md (Phase 5 verdict — Next.js canonical, GHL CRM-only)
   - docs/COMPLIANCE_GATE_2026_05_08.md (10-axis Compliance Gate verdict)
   - docs/PRODUCTION_READINESS_HANDOFF_2026_05_08_PM.md (22-pillar scorecard 18/3/1/0; audit cycle close-out)
5. Specialist-Prereq Probe: bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json (expect Forge ✅, Cato ✅, Anvil ❌, Perplexity ✅)
6. Bind these MEMORY files upfront:
   - feedback_caddy_dokploy_cache_bust.md (~7-10 min Caddy cache flip post-deploy)
   - feedback_cato_structured_verdict_prompt.md (consequence-framed verdict-on-LAST-line)
   - feedback_forge_race_scope_drift.md (use isolation:"worktree" parameter on Agent for any background-Forge ≥3 file work)
   - feedback_artist_agent_batch_unreliable.md (direct CLI Promise.all for image batches ≥3)
   - feedback_interceptor_headless_server_fallback.md (google-chrome --headless on Linux server)
   - feedback_forge_e3_binding_skipped.md (E3+ multi-file work MUST include Forge)
   - knowledge_eho_realtor_logo_sourcing.md (HUD only ships TIF/EPS for EHO; PNG fallback chain documented)
   - knowledge_sharp_libvips_linux_runtime.md (LD_LIBRARY_PATH for sharp-using bun commands)
   - reference_dokploy_mia_app.md (applicationId XJSRlvH-91ZtUsh0RPGvo; deploy → poll → cache-bust)
   - reference_mia_site_assets.md (vibe.filesafe.space first-party CDN)
7. Run baseline: bun run audit:all → confirm 14 PASS · 2 WARN · 0 FAIL preserved (or capture deltas).

PUNCHLIST (ordered, each item ends with `Skill("ISA", "append verification ...")`):

0. **Pre-flight: integrate audit:completeness into deploy-and-verify.ts** (E2 — ~30 min). Wire `bun run audit:completeness` as a pre-flight gate inside scripts/deploy-and-verify.ts that BLOCKS the deploy on FAIL (warnings allowed). This closes the manual-invocation hole identified in the PM cycle handoff.

1. **AskUserQuestion — confirm primary lead magnet** (E1, blocking). Per docs/LEAD_MAGNET_PDF_SPEC.md §A, the recommended primary is "Eastern Fort Lauderdale Luxury Waterfront Buyer's Guide" (variant of principal-suggested A, sharpened with waterfront differentiator). Surface 3 options: (a) Recommended waterfront variant, (b) Principal's stated Eastern Fort Lauderdale Luxury Buyer's Guide (broader, no waterfront sharpener), (c) other niche (expired listings / absentee owners / valuation packet). Block on principal selection.

2. **Lead magnet PDF source** (E4 — Forge worktree-isolated, Content + Designer lanes). Compose PDF source per docs/LEAD_MAGNET_PDF_SPEC.md §B (8 sections, 16-24 pages, Cinzel + Montserrat, navy/cream/brass palette, FREC/EHO/MLS disclaimers). Output formats: HTML→PDF render via headless Chrome OR markdown→PDF via pandoc OR React→PDF via @react-pdf/renderer (Forge picks; principle: deterministic + repeatable + version-controlled source). Land at public/lead-magnets/eastern-fort-lauderdale-buyers-guide.pdf.

3. **Lead magnet landing page** (E3 — Designer lane, after PDF). Build src/app/guides/eastern-fort-lauderdale-buyers/page.tsx per docs/LEAD_MAGNET_PDF_SPEC.md §B "Gated download flow" + docs/BRAND_SYSTEM_CONTRACT.md component rules. Hero + form + 3-paragraph value summary + ToC preview + Mia bio block + REALTOR®/LPT/EHO trust strip. Form action: live-GHL endpoint if principal supplies BSS sub-account webhook URL; else mailto: fallback with explicit ISA Decisions log entry.

4. **Thank-you page** (E2 — Designer lane). src/app/guides/eastern-fort-lauderdale-buyers/thank-you/page.tsx. Cinzel "Your guide is on its way." headline + instruction paragraph + "Open the guide now" PDF download button + "Schedule a Private Consultation" secondary CTA + 3 cross-promo links.

5. **5-email nurture sequence** (E2 — Content lane). Markdown source at docs/lead-magnet-email-sequence-fl-luxury-buyer.md per docs/LEAD_MAGNET_PDF_SPEC.md §B "Follow-up email sequence". Each ≤200 words; signed Mia · REALTOR® · LPT Realty; one CTA per email; reply-prompted.

6. **GHL mapping doc** (E2 — GHL Automation lane). Markdown source at docs/lead-magnet-ghl-mapping.md per docs/LEAD_MAGNET_PDF_SPEC.md §B "GHL tags / fields / pipeline mapping". Tag schema, custom-field schema, pipeline-stage mapping, automation triggers, anti-criteria.

7. **Sitemap + audit-completeness new-page coverage** (E1 — QA lane). Add /guides/eastern-fort-lauderdale-buyers/ + /guides/eastern-fort-lauderdale-buyers/thank-you/ to src/app/sitemap.ts. Re-run audit:all; expect 14+ PASS · 2 WARN · 0 FAIL with new pages flowing through metadata + footer-trust + image-attribute checks.

8. **Brand consistency drift sprint** (E3 — Designer lane). Per docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md §"Highest-leverage closures": (a) AEO answer-first summaries on /buyers/, /sellers/, /valuation/ (~30 min), (b) internal-link density — buyers + sellers cross-link to insights essays + relevant market detail pages; market detail pages cross-link to 2 adjacent markets + relevant insights essays (~45 min). Don't expand scope beyond these two — the lead magnet is the primary cycle deliverable.

9. **Cato cross-vendor re-audit** (E4 — consequence-framed). Agent(subagent_type="Cato", isolation: optional). Audit the post-build state for: lead magnet landing schema (FAQPage / WebPage / Service?); thank-you page schema (WebPage / ContactPage?); form-action consistency; FREC/EHO/REALTOR/MLS sentinels on new pages; PDF disclaimer compliance. Verdict-on-LAST-line JSON object MANDATORY.

10. **Compliance Gate v2 run** (E2). Re-run all 10 axes per docs/BSS_REALTOR_COMPLIANCE_GATE.md against the post-deploy state. Update docs/COMPLIANCE_GATE_2026_05_<date>.md. Compare against PM cycle baseline.

11. **Updated production-readiness handoff** (E2 — close-out). Append ISA cycle entry. Refresh 22-pillar scorecard. Update docs/PRODUCTION_READINESS_HANDOFF_<date>.md. Compose next-next-session trigger prompt for follow-on work (e.g. Mia review session debrief; GHL form wiring if URL still pending; conversion-offer #2 candidate; .com cutover prep).

CYCLE DISCIPLINE — non-negotiable:

- Every push uses bun scripts/deploy-and-verify.ts; never trigger Dokploy manually.
- Wait 7-10 min after deploy for Caddy cache flip; cache-bust verification with ?_=$(date +%s) + Cache-Control: no-cache.
- For ≥3 file work at E3+: dispatch Forge with isolation:"worktree" parameter; suspend main-thread edits during background-Forge runs; re-apply main-thread edits in batch post-Forge.
- Visual verification: google-chrome --headless=new --no-sandbox --screenshot= with --virtual-time-budget=20000 (20s — avoids Cinzel font-display:swap paint artifacts seen at 12s).
- For image batches ≥3: direct CLI Promise.all via sharp (LD_LIBRARY_PATH prefixed); never spawn Artist agent.
- Brand contract is locked. Any color/type/component/CTA deviation requires explicit principal approval + Decisions log entry per docs/BRAND_SYSTEM_CONTRACT.md.

DO NOT:

- Spawn Artist agent for image batches.
- Write to GHL/Mia's surfaces without principal approval.
- Push to .com / modify NEXT_PUBLIC_SITE_URL / DNS.
- Edit AI-OS infrastructure (~/.claude/, ~/forge/, ~/trueops/, hooks, skills, agents).
- Fabricate facts; assert license SL3405877 as DBPR-verified; assert designations / Spanish / display office Mia hasn't confirmed.
- Provision Cloudflare (per principal directive 2026-05-08 PM — only if a non-Cloudflare fallback fails to meet production quality).
- Auto-commit Cato FAIL verdict without principal review.
- Skip the audit chain (audit:completeness is now part of audit:all and must run before deploy).
- Use npm/npx (bun-only per CLAUDE.md).
- Use Python (TypeScript-only per CLAUDE.md).
- Hardcode /home/torrey/ paths.

EFFORT TIER: E5 (multi-deliverable, multi-file, sub-agent-bound, principal-gate-bound).

DELIVERABLES at LEARN/SUMMARY:
(a) Lead magnet PDF + landing + thank-you + GHL mapping + email sequence — ALL committed
(b) Updated 22-pillar scorecard
(c) audit-completeness pre-deploy gate integrated
(d) Cato re-audit verdict
(e) Compliance Gate v2 PASS
(f) ISA append + commit + push
(g) Updated production-readiness handoff doc
(h) Next-next-session trigger prompt
(i) 5-viewport screenshot grid for new pages at /tmp/mia-leadmagnet-shots/
```

---

## Notes for the executor

The trigger prompt above is paste-ready. Two judgment calls the executor must make:

1. **PDF render technology** — pick one and stick with it. Options (in order of preference):
   - **HTML → headless-Chrome PDF print** — uses existing chrome dependency, full CSS support, easiest to maintain (recommended)
   - **React → @react-pdf/renderer** — TS-native, programmatic, but adds a heavyweight dependency
   - **Markdown → pandoc** — clean source but requires pandoc binary; not in project deps

2. **Form action — live or mailto** — depends on principal supplying BSS sub-account webhook URL at start of cycle. If supplied, wire live; if not, mailto fallback with ISA Decisions log entry. **Do not block the entire cycle waiting for the URL** — ship the lead magnet with mailto fallback if needed; flip to live in a follow-up commit when URL arrives.

## Cross-references

- `docs/NEXT_SESSION_LEAD_MAGNET_AND_BRAND_SPRINT.md` — mission brief
- `docs/BRAND_SYSTEM_CONTRACT.md` — visual contract
- `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md` — page-by-page gap matrix
- `docs/LEAD_MAGNET_PDF_SPEC.md` — PDF expert spec
- This doc (`docs/NEXT_SESSION_TRIGGER_PROMPT.md`) — paste-ready trigger prompt
