# Next Session — Lead Magnet & Brand Consistency Sprint

**Authored:** 2026-05-08 PM
**Cycle target:** Next Claude Code session
**Mission tier:** E5 (multi-deliverable, multi-file, sub-agent-bound, principal-gate-bound)

## Mission

Build the first **gated lead magnet** end-to-end — recommended primary: `The Eastern Fort Lauderdale Luxury Waterfront Buyer's Guide` (PDF) — landing page, gated download flow, thank-you page, GHL pipeline integration, and 5-email nurture sequence. While the lead-magnet build runs, execute a **brand consistency sprint** that closes any visual-system drift surfaced by the new gap matrix and locks the brand contract documented in `docs/BRAND_SYSTEM_CONTRACT.md`.

The sprint resolves Pillar 20 (Conversion Offers) FAIL → PASS, materially improves Pillars 6 (Forms/CTAs) + 7 (GHL Pipeline) when the principal supplies the BSS sub-account webhook URL, and elevates 1-3 additional pillars on the `↗ improved` axis.

## Current verified state (DO NOT redo)

| Item | Verdict | Source-of-truth |
|---|:-:|---|
| Audit chain (typecheck + lint + audit:stale + audit:seo + audit:schema + audit:links + audit:completeness + build) | ✅ all green on commit `0fced7d` | `reports/audit-completeness.{json,md}` baseline 14 PASS · 2 WARN · 0 FAIL |
| 22-pillar scorecard | ✅ 18 PASS · 3 PARTIAL · 1 FAIL · 0 UNVERIFIED | `docs/PRODUCTION_READINESS_HANDOFF_2026_05_08_PM.md` |
| Compliance Gate | ✅ 10/10 PASS | `docs/COMPLIANCE_GATE_2026_05_08.md` |
| Caddy flipped commit `eddd1d1` | ✅ live `last-modified: 18:38:09 GMT` | sentinels: "Schedule a Conversation", "Personal by design", `aria-label="Industry affiliations"` |
| Mia's principal-supplied photo | ✅ landed at 3 sizes | `public/mia-headshot.jpg` (1024², 75KB), `public/mia-headshot-256.jpg` (256², 11KB), `public/mia-og.jpg` (1200×630, 45KB) |
| MeetMia component on home | ✅ live | `src/components/MeetMia.tsx`, rendered between `<Hero>` and `<IntentRouter>` |
| Footer trust strip | ✅ live | `aria-label="Industry affiliations"` row with LPT + REALTOR® + EHO |
| GHL Blog architecture decision | ✅ documented | `docs/GHL_BLOG_INTEGRATION_DECISION.md` — Next.js `/insights/` canonical, GHL CRM-only |
| Audit-completeness script | ✅ shipped + integrated | `scripts/audit-completeness.ts`, `package.json` `audit:completeness` + `audit:all` |
| Forge worktree isolation pattern | ✅ proven | first successful use of `isolation: "worktree"` on Agent tool, commit `eddd1d1` |
| Cloudflare | 🚫 REMOVED from blocker list | per principal directive 2026-05-08 PM |

## Exact commits in scope (this cycle's history — context for next session)

```
0fced7d chore(MIA-SITE-AUDIT-V2): production readiness audit v2 close-out — 22-pillar 18/3/1/0 (4 ↗), ISA append
eddd1d1 feat(MIA-SITE-DESIGN-V2): Phase 2 design/UX master pass — 7 files via Forge worktree
98200e6 docs(MIA-SITE-AUDIT-V2): GHL Blog integration decision — Next.js canonical, GHL CRM-only
0896a9b feat(MIA-SITE-AUDIT-V2): audit-completeness script + Mia real photo + /markets/ OG fix
529486f chore(MIA-SITE-AUDIT): production readiness audit close-out — 22-pillar 18/3/1/0, ISA append
a521e4a fix(MIA-SITE-AUDIT): sitemap.ts /dmca/ + per-page OG for /about/ and /insights/
634322f chore(MIA-SITE-ISA): closeout cycle close-out — append ISCs 178-200, decisions, changelog, Compliance Gate 10/10 PASS
3c09565 fix(MIA-SITE-CATO): hero text-shadow + privacy GPC honoring (2/5 Cato concerns)
2486d3b feat(MIA-SITE-CLOSEOUT): legal pages + official logos + brighter hero + 52c title
```

## Remaining blockers (next session must respect)

| # | Blocker | Impact | Effort | Owner |
|---|---|:-:|:-:|---|
| 1 | Mia consolidated review session (license DBPR primary-source, designations, Spanish, photography readiness, testimonials, NAR/MLS confirms) | HIGH | 30-60 min | Mia |
| 2 | **GHL BSS sub-account webhook URL** — UNBLOCKS form wiring + lead magnet capture | HIGH | 5 min principal action | Torrey-on-BSS |
| 3 | USCO DMCA designated-agent registration | MED (gates `.com` cutover) | $6 + 15 min | Mia or LPT corporate |
| 4 | DNS swap `.trueidea.com` → `.com` (TRIGGER, not work) | TRIGGER | 60 min execution | Torrey + Mia |
| 5 | Branded email `mia@miasanabriarealtor.com` provisioning | LOW | 10 min | Torrey-on-LPT-domain |
| 6 | LinkedIn cleanup — Klein Morgan as concurrent employer | LOW | 5 min | Mia |

**Cloudflare is NOT a blocker** per principal directive. Do not provision unless production quality cannot be met without it.

## What NOT to redo (already shipped, verified, committed)

- ❌ Do not rewrite the legal pages (Privacy, Terms, Accessibility, DMCA) — Forge composed these in commit `2486d3b`; Cato CONCERNS resolved in `3c09565`
- ❌ Do not re-optimize the Mia photo — 3 sizes already exist; the 320KB principal-supplied source is the canonical reference
- ❌ Do not re-write `audit-completeness.ts` — 16 checks across 9 categories already shipped
- ❌ Do not re-do the design master pass surfaces (MeetMia, Hero polish, About brass-card-offset, footer trust strip, MarketCard hover lift, CTAStrip tighten) — committed in `eddd1d1`
- ❌ Do not provision Cloudflare Polish — principal directive
- ❌ Do not modify `next.config.ts` (`images.unoptimized=true` mandatory for static export)
- ❌ Do not touch `NEXT_PUBLIC_SITE_URL`, sitemap host, canonical host, robots logic
- ❌ Do not assert license # SL3405877 as DBPR-verified — keep web-cited posture in `MIA.unverified.licenseNumber`
- ❌ Do not modify the GHL Blog integration architecture — Next.js canonical, GHL CRM-only verdict is locked in `docs/GHL_BLOG_INTEGRATION_DECISION.md`
- ❌ Do not write to GHL surfaces without principal approval (no GHL writes from this codebase)
- ❌ Do not push to `.com` (staging only)
- ❌ Do not edit `~/.claude/`, `~/forge/`, `~/trueops/` infrastructure

## Success criteria (binary)

- ✅ Lead magnet PDF rendered (file shipped to `/public/lead-magnets/eastern-fort-lauderdale-buyers-guide.pdf` or equivalent path)
- ✅ Lead magnet landing page live at `/guides/eastern-fort-lauderdale-buyers/` (or principal-named slug)
- ✅ Gated download flow live: form → email capture → GHL contact-create (when webhook URL supplied) OR mailto fallback (until URL supplied) → thank-you page → email-with-PDF-link
- ✅ Thank-you page live at `/guides/eastern-fort-lauderdale-buyers/thank-you/`
- ✅ 5-email nurture sequence drafted (markdown in repo at `docs/lead-magnet-email-sequence-fl-luxury-buyer.md`) with GHL workflow mapping spec
- ✅ Brand consistency sprint: visual gaps surfaced by `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md` are EITHER closed in code OR explicitly deferred with reason in ISA
- ✅ Audit-completeness baseline ≥ 14 PASS · 2 WARN · 0 FAIL (no regression); ideally adds ≥1 PASS via lead-magnet-page coverage
- ✅ Cato cross-vendor re-audit returns CONCERNS or PASS (not FAIL); any CONCERNS deployable in same cycle resolved
- ✅ Compliance Gate 10/10 PASS preserved
- ✅ ISA append + commit + push — same closeout pattern as `0fced7d`
- ✅ Production-readiness handoff doc updated with new 22-pillar scorecard

## Expert delegation lanes (suggested parallel structure)

Consider Forge worktree isolation for any lane producing ≥3 file edits. Each lane completes its scope, the main thread merges with audit chain re-verification.

### A. Designer
- Owns visual quality across all surfaces.
- Source-of-truth: `docs/BRAND_SYSTEM_CONTRACT.md`.
- Deliverables: lead magnet landing page hero + form treatment, thank-you page, any cross-page brand drift surfaced by gap matrix.
- Validation: 5-viewport screenshot grid post-Caddy-flip + audit:completeness PASS on new pages.

### B. Content / Copy
- Owns lead magnet PDF body copy.
- Source-of-truth: `docs/LEAD_MAGNET_PDF_SPEC.md` (ToC + section outline + disclaimers).
- Deliverables: PDF source (markdown or LaTeX or HTML→PDF render); landing-page form sub-text; 5 nurture emails (subject + body + CTA per email).
- Validation: §1 fact-ledger compliance (no fabricated facts; license + designations posture preserved); FREC § 61J2-10.025 disclaimers; TCPA + Florida § 501.059 + CCPA consent.

### C. GHL Automation
- Owns the form-routing + nurture pipeline.
- Source-of-truth: `docs/GHL_INTEGRATION_OPTIMAL.md` (existing) + `docs/LEAD_MAGNET_PDF_SPEC.md` §GHL mapping.
- Deliverables: Cloudflare Pages Function proxy stub (or principal-equivalent function host) that POSTs to GHL Inbound Workflow Webhook; tag + custom-field schema for the lead-magnet capture; pipeline-stage mapping; email-template body for the immediate-PDF-delivery email.
- Validation: synthetic submission end-to-end against staging endpoint; principal supplies BSS sub-account webhook URL.

### D. Compliance Guardrail (continuous)
- Runs continuously during the lane work.
- Source-of-truth: `docs/BSS_REALTOR_COMPLIANCE_GATE.md` (10 axes) + `docs/RESEARCH_COMPLIANCE_LOGOS.md`.
- Deliverables: re-run Compliance Gate after each lane lands; flag any drift in brokerage disclosure / REALTOR® / EHO / IDX / Privacy / Terms / TCPA / Accessibility.
- Validation: 10/10 axes PASS preserved.

### E. QA / Completeness
- Owns the audit-completeness chain.
- Source-of-truth: `scripts/audit-completeness.ts` (16 checks).
- Deliverables: audit-completeness still 14 PASS · 2 WARN · 0 FAIL minimum on final commit; ideally +1 PASS for the new lead-magnet page in checks like `legal.routesExist`-style probes (extend the script if a new check makes sense).
- Validation: full `audit:all` chain green pre-deploy.

### F. Architect (decisions only)
- Holds the line on architecture decisions:
  - mailto fallback OK ONLY if GHL webhook URL still pending; if URL is supplied, switch to live GHL endpoint in same cycle
  - PDF stored in `public/lead-magnets/` with stable filename; rotated only on principal-confirmed content updates
  - Lead magnet page at `/guides/<slug>/` not `/lead-magnets/<slug>/` (luxury voice prefers "guide" over "lead magnet")
  - No analytics tracking added in staging; flips at .com cutover

## Required validation chain (before deploy)

```bash
bun run typecheck         # exit 0
bun run lint              # exit 0
bun run audit:stale       # exit 0
bun run audit:schema      # exit 0
bun run audit:links       # exit 0
bun run audit:seo         # exit 0
bun run audit:completeness # 14+ PASS · 2- WARN · 0 FAIL
bun run build             # exit 0; new routes prerendered
```

Then deploy via `bun scripts/deploy-and-verify.ts --no-lighthouse`. Wait 7-10 min for Caddy flip per memory `feedback_caddy_dokploy_cache_bust.md`.

Then visual verification: `google-chrome --headless=new --no-sandbox --screenshot=` with `--virtual-time-budget=20000` (per process improvement note from PM cycle — 12s captures Cinzel font-display:swap artifacts; 20s avoids).

Then Cato cross-vendor re-audit per memory `feedback_cato_structured_verdict_prompt.md` (consequence-framed verdict-on-LAST-line).

## Anti-criteria (cumulative; preserve)

- No edits to AI-OS infrastructure
- No fabricated facts; license number rendering pattern preserved
- No live form endpoints to real Mia surfaces (mailto fallback only until GHL URL supplied)
- No DNS / production cutover
- No Cloudflare provisioning
- No GHL writes from this codebase
- No `npm`/`npx` (bun-only per CLAUDE.md)
- No Python files (TypeScript-only per CLAUDE.md)
- No hardcoded `/home/torrey/` paths

## See also

- `docs/BRAND_SYSTEM_CONTRACT.md` — visual system rules (companion doc)
- `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md` — page-by-page scorecard (companion doc)
- `docs/LEAD_MAGNET_PDF_SPEC.md` — lead magnet expert spec (companion doc)
- `docs/NEXT_SESSION_TRIGGER_PROMPT.md` — paste-ready trigger prompt for next session
