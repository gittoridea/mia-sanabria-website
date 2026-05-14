# Mia Site — Next Session Trigger Prompt

> **⚠ SUPERSEDED — DO NOT PASTE AS-IS (2026-05-13, Cycle 30 audit).** This trigger predates Cycle 24 Mia-Live-Decisions and Cycle 30 Mia-staging-review packet. Pasting it into a fresh session would re-anchor on the prior canonical (`miasanabriarealtor.com`) and miss the new launch-blocker matrix. **Use instead:** `docs/artifacts/cycle-30-mia-staging-review/torrey-action-list.md` + `launch-blocker-matrix.md` for the actual current next move; canonical target is `https://miasanabria.com` (see `docs/mia-client-decision-record.md`). Body below is preserved as historical record of the prior trigger.

> Paste this entire block into a fresh Claude Code session in `~/code/mia-sanabria-website/`. It is self-contained, expert-team-aware, and verification-bound.

---

## TRIGGER PROMPT (paste below this line)

```
Mission: Mia Sanabria luxury realtor site — Compliance + Skeleton + Mobile + Production Readiness Closeout. Drive the live staging site at miasanabriarealtor.trueidea.com to a state where Compliance Gate axes 1-10 all PASS and the only remaining cutover blockers are external (Mia confirmations, GHL webhook URL, .com DNS swap).

OBSERVE — load this context BEFORE any other work, in this order:

1. /cs query "Mia site closeout compliance EHO REALTOR logo legal pages mobile"
2. Skill("bss-prime") if it exists, otherwise read the master ISA at ~/.claude/PAI/USER/PROJECTS/MiaSanabria/ISA.md
3. Read the repo ISA verbatim — do NOT skim — at ~/code/mia-sanabria-website/ISA.md (currently phase=verify, progress 113/157, follow-ups T25-T31 are the live backlog)
4. Read the FOUR research / preflight docs landed last session:
   - docs/CDN_PREFLIGHT.md (Cloudflare Free + Cache Everything Page Rule recommended)
   - docs/CUTOVER_PACKET.md (preflight, NOT executed; principal gate)
   - docs/GHL_INTEGRATION_OPTIMAL.md (GHL Inbound Webhook + Cloudflare Pages Function proxy + TCPA/FL/CCPA consent text)
   - /tmp/mia-compliance-research.md AND /tmp/mia-mobile-a11y-audit-research.md if present (this session's research output)
5. Specialist-Prereq Probe: bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json. Confirm Forge ✅, Cato ✅, Imagen via GOOGLE_API_KEY, Perplexity via OPENROUTER_API_KEY.
6. Bind these MEMORY files upfront — they are the second-brain for this work:
   - feedback_caddy_dokploy_cache_bust.md (~7-10 min cache flip; deploy-and-verify "stale" warning is always a false alarm in first 5 min)
   - feedback_cato_structured_verdict_prompt.md (verdict-on-LAST-line WITH consequence framing, not just instruction — empirically required twice)
   - feedback_artist_agent_batch_unreliable.md (direct CLI Promise.all for image batches ≥3, never Artist agent)
   - feedback_interceptor_headless_server_fallback.md (use google-chrome --headless=new --no-sandbox --screenshot=)
   - feedback_forge_e3_binding_skipped.md (E3+ multi-file coding/UI/content work MUST include Forge)
   - knowledge_sharp_libvips_linux_runtime.md (every sharp-using bun command must prefix LD_LIBRARY_PATH=node_modules/@img/sharp-libvips-linux-x64/lib OR scripts must be wrapped in package.json)
   - reference_dokploy_mia_app.md (applicationId XJSRlvH-91ZtUsh0RPGvo; deploy → poll → cache-bust → wait 7-10 min → re-probe)
   - reference_mia_site_assets.md (vibe.filesafe.space CDN for first-party assets)

PUNCHLIST (ordered, each item ends with `Skill("ISA", "append verification to ~/code/mia-sanabria-website/ISA.md")`):

0. **Pre-flight gates BEFORE legal-pages or logo work (E2 — non-skippable)** — three verifications that gate the rest of the work:
   - **NAR membership verification:** confirm Mia's active NRDS membership at her local board (BPS Realtors / MIAMI Association of REALTORS®). **If membership is not active, do NOT display the REALTOR® R logo OR the term REALTOR® on the site.** Surface the membership-confirm result in ISA Decisions before P3 fires. (Per /tmp/mia-compliance-research.md §1: "Only members of NAR can call themselves a REALTOR®. The license runs to the member personally.")
   - **MLS jurisdiction confirmation:** the IDX iframe currently uses sef.mlsmatrix.com → SEF MLS (BeachesMLS / Broward Palm Beaches & St. Lucie Realtors). Confirm Mia's specific MLS membership (could be SEF, MIAMI, Stellar, or multiple) and pull the correct broker-reciprocity logo from THAT MLS's broker resources page. Drop logo at `public/logos/mls-broker-reciprocity.{svg,png}`.
   - **DMCA Designated Agent registration check:** search US Copyright Office DMCA directory at https://www.copyright.gov/dmca-directory/ for "LPT Realty". If LPT corporate is registered AND coverage extends to agent sub-sites, reference that designation in the new /dmca/ page. If not, decide between (a) Mia registers personally for $6 OR (b) document the iframe-only-no-UGC argument that registration is not required (see /tmp/mia-compliance-research.md §5 for the reasoning).

1. **Compliance research integration (E2)** — read /tmp/mia-compliance-research.md and /tmp/mia-mobile-a11y-audit-research.md (both delivered prior session). Surface the official asset URLs for the NAR REALTOR® R logo and the HUD/NAR Equal Housing Opportunity logo. Surface the FREC + NAR + Fair Housing + ADA + DMCA + IDX-disclosure rule citations the legal pages must satisfy. Both files have direct downloadable asset URLs verified HTTP 200 at delivery.

2. **Real legal pages (E4) — Forge mandatory binding** — replace the stub Privacy / Terms / Accessibility pages and CREATE a new DMCA page. Forge composes:
   - `src/app/privacy/page.tsx` — full privacy policy compliant with CCPA + GDPR + Florida § 501.171, with sections for (a) data collected, (b) cookies/analytics (GA4 disclosed), (c) form-data routing to GHL workflow webhook (post-cutover), (d) opt-out mechanisms, (e) children's privacy COPPA, (f) data retention, (g) update procedure
   - `src/app/terms/page.tsx` — terms of service with (a) IDX disclaimer + reliable-but-not-guaranteed, (b) FREC § 61J2-10.025 brokerage disclosure, (c) testimonial/results disclaimers, (d) DMCA bridge link to /dmca/, (e) jurisdiction (Florida), (f) limitation of liability
   - `src/app/accessibility/page.tsx` — accessibility statement targeting WCAG 2.1 AA + ADA Title III + Section 508, with (a) standards adopted, (b) ongoing-improvement statement, (c) feedback contact (msanabriarea@gmail.com + phone), (d) UserWay disclosure (id `vVNkJJLvR4` already in MIA.tracking)
   - `src/app/dmca/page.tsx` (NEW route) — DMCA notice procedure with (a) Designated Agent contact (LPT Realty corporate or Mia depending on what the research surfaces), (b) takedown request format, (c) counter-notice procedure, (d) repeat-infringer policy
   Variables sourced from `src/lib/mia.ts` MIA constant (email msanabriarea@gmail.com, phone, brokerage LPT Realty). License # SL3405877 still flagged with TODO for DBPR primary-source verification — keep that flag intact.

3. **Add NAR REALTOR® R + HUD EHO official logos to repo + footer (E3)** — download official assets per research. Land at `public/logos/realtor-r.svg` (or .png) and `public/logos/equal-housing.svg`. Update `src/components/SiteFooter.tsx`:
   - Replace the hand-rolled inline SVG (currently a generic house icon with "Equal Housing Opportunity" text at line 100-119) with the OFFICIAL HUD EHO logo
   - Add the NAR REALTOR® R logo adjacent to the LPT Realty brokerage block in the footer
   - Both logos rendered as `<img>` with proper alt text and `width`/`height` to prevent CLS
   - Logo height ≤ 32px on desktop, ≥ 24px on mobile (NAR minimum readable size)
   - Ensure the EHO logo position matches HUD's standard "lower right corner of advertising" pattern OR adapts cleanly to the footer multi-column grid
   - Add a Person/RealEstateAgent JSON-LD `memberOf` reference to NAR if research confirms the schema pattern is supported

4. **Lighthouse mobile sweep — multi-route + multi-viewport (E3)** — extend `scripts/deploy-and-verify.ts` to run mobile Lighthouse on the FULL public-route set (home, about, contact, buyers, sellers, valuation, insights, markets/[fort-lauderdale,coral-ridge,victoria-park,boca-raton,delray-beach,palm-beach,lighthouse-point], privacy, terms, accessibility, dmca). Target thresholds per route: Perf ≥85 mobile, A11y ≥95, BP ≥90, SEO ≥69 (staging-gated until cutover). Output: scoreboard JSON + a markdown delta table written to `audits/{ts}/scoreboard.md`. Land any quick wins (touch-target spacing, form-input zoom-prevention, font-display) Forge surfaces.

5. **Mobile UX deep audit — actual viewports (E3)** — capture headless Chrome screenshots at `375×667` (iPhone SE), `390×844` (iPhone 14), `412×892` (Pixel), `768×1024` (iPad), `1440×900` (desktop) for the home + 4 service pages + 1 market detail + 1 insights essay. Land in `/tmp/mia-mobile-shots/{viewport}/{slug}.jpg`. Visually inspect 5 key screenshots (home@375, contact@375, buyers@375, lighthouse-point@390, insights@390) and document any (a) hero overlap with H1, (b) touch-target collisions, (c) form-input zoom issues, (d) sticky-header collisions in the ISA verification block.

6. **T25 hero gradient — apply darkest-middle pattern (E2)** — last session deferred per principal "skip for now" but the legibility issue was visible in /tmp/mia-final-shots/home.jpg. RECOMMEND: change the gradient pattern in `src/components/Hero.tsx:45` from `from-navy-800/80 via-navy-800/70 to-navy-800/90` (bright-middle) to `from-navy-800/75 via-navy-900/85 to-navy-800/90` (darkest-middle, where the H1 sits). Verify on home + lighthouse-point + buyers (where the bright-foreground image is the LCP candidate). If the principal deferred T25 again previously and there's an explicit "skip" note in ISA decisions, surface for re-confirmation rather than auto-apply.

7. **T31 title length — principal-confirm decision (E1, AskUserQuestion)** — current SITE.title is 67 chars rendered ("Fort Lauderdale REALTOR® | Waterfront & Luxury Homes — Mia Sanabria"); principal target was 60c. Three options: (a) accept the slight over-budget; (b) trim to 52c by dropping "— Mia Sanabria" tail (brand still in shortTitle/header); (c) trim to 59c by dropping "& Luxury". Block on principal answer.

8. **License # SL3405877 DBPR primary-source verification (E2)** — visit https://www.myfloridalicense.com/wl11.asp directly via WebFetch with the search form values for `LName=Sanabria&FName=Mia`. If the page returns 200 with license details, capture the official license number, license type, status, and brokerage affiliation. If verified == SL3405877, REMOVE the TODO comment in `src/lib/mia.ts`. If verified ≠ SL3405877, update to the verified value. If DBPR returns errors persistently, surface a manual-verification follow-up for principal to do during launch-day window.

9. **Migrate landing — §1 verified content from miasanabria.com (E2)** — last session surfaced 6 §1 verified market hero quotes from her live site (Coral Ridge missing). Add an optional `miaQuote?: { text: string; source: string }` field to the Market type in `src/lib/markets.ts` and populate the 6 markets with their respective quotes. Render the quote on each `/markets/[slug]/` page in an aside or pull-quote block. NO DATA-SHAPE BREAKING CHANGES — additive only.

10. **Cato cross-vendor re-audit (E4)** — Agent(subagent_type="Cato", ...) with the consequence-framed prompt template (per memory). Scope: every legal page renders with real content vs stub, REALTOR® R + EHO logos render with proper alt text + license #, mobile Lighthouse Perf ≥85 across all routes, Compliance Gate axes 1-10 traceable to evidence in the build. Verdict on LAST line as JSON object MANDATORY.

11. **Compliance Gate full run (E4)** — per docs/BSS_REALTOR_COMPLIANCE_GATE.md, execute each of the 10 axes with PASS/FAIL/N-A verdicts captured in a new `audits/compliance-gate-{ts}.md`. This is the document the principal hands Mia for sign-off pre-cutover.

CYCLE DISCIPLINE — non-negotiable:

- Every push uses `bun scripts/deploy-and-verify.ts` (committed at c9637e3). Never trigger Dokploy by hand.
- Wait 7-10 minutes after deploy before re-probing live URL — Caddy cache flip is the truth signal (memory: feedback_caddy_dokploy_cache_bust.md). Use `last-modified` header comparison vs pre-deploy.
- Cache-bust verification with `?_=$(date +%s)` + `Cache-Control: no-cache` headers.
- For any image gen ≥3 images, direct CLI in Promise.all — never spawn Artist agent (memory: feedback_artist_agent_batch_unreliable.md).
- Visual verification via `google-chrome --headless=new --no-sandbox --screenshot=` — Interceptor unavailable on this server.
- Forge MUST handle any item touching ≥3 source files at this tier (memory: feedback_forge_e3_binding_skipped.md).
- Every sharp-using script invocation: prefix `LD_LIBRARY_PATH="$(pwd)/node_modules/@img/sharp-libvips-linux-x64/lib:$LD_LIBRARY_PATH"` OR wrap into package.json scripts permanently (memory: knowledge_sharp_libvips_linux_runtime.md).
- Cato dispatch: ALWAYS use the consequence-framed verdict-on-LAST-line template (memory: feedback_cato_structured_verdict_prompt.md), not just the instruction-only template.

DELEGATION PATTERN (parallel where independent):

- Phase 1 KICKOFF (parallel background dispatches):
  - Forge — comprehensive legal-pages composition (P2: privacy + terms + accessibility + dmca, all 4 in one prompt)
  - Research — official logo download URLs + footer placement standards verification (only if /tmp/mia-compliance-research.md not already present)
  - Direct CLI — Lighthouse multi-route mobile sweep (Phase 4 wrapper enhancement)

- Phase 2 SERIAL FOREGROUND:
  - Logo file-system land + footer wiring (P3, Edit tool — small precise scope)
  - Hero gradient T25 (P6, Edit tool single-line)
  - Migrate quote landing (P9, Edit tool small structural addition)
  - License # DBPR verification (P8, WebFetch)

- Phase 3 SEQUENTIAL VERIFICATION:
  - Build + audit:all chain (must exit 0)
  - Deploy + wait 10 min + re-probe last-modified flip
  - Lighthouse mobile sweep across all routes
  - Multi-viewport headless Chrome screenshots
  - Cato re-audit with consequence-framed prompt
  - Compliance Gate run

- Phase 4 PRINCIPAL-FACING DELIVERABLES:
  - Lighthouse delta scoreboard (mobile)
  - Visual screenshot grid (5 viewports × 5 routes)
  - Compliance Gate verdict per axis
  - Updated ISA progress count + open follow-ups
  - 5 highest-leverage suggestions for the SESSION AFTER THIS ONE

LEARN / CLOSE deliverables (in this exact order):

(a) Lighthouse mobile scoreboard — pre/post delta table covering all public routes
(b) Compliance Gate verdict per axis (10 axes) with evidence cited per
(c) ISA progress count opened/closed/deferred + commit hashes
(d) Visual screenshot grid index — 5 viewports × 5 routes — at /tmp/mia-mobile-shots/index.md
(e) Five highest-leverage suggestions for the session AFTER this one (compounding leverage focus, not punchlist enumeration)
(f) Open questions for principal (anything blocking next session — Mia-confirmation gates, the Cloudflare account decision for CDN, photography handoff, etc.)
(g) Memory writes to land if any (new feedback or knowledge files surfaced this run)

DO NOT:
- Spawn Artist agent for batch image gen
- Write to GHL or Mia's existing surfaces (anti-criteria ISC-88, ISC-160)
- Push to .com or modify NEXT_PUBLIC_SITE_URL on staging
- Edit AI-OS infra outside the repo
- Fabricate facts not in PUBLIC_FACT_LEDGER §1
- Auto-commit Cato's "FAIL" without principal review
- Skip the consequence-framed Cato prompt template
- Commit without running the audit:all chain
- Forget to wait 7-10 min for Caddy cache flip before re-probing

EFFORT TIER: E5 (Comprehensive — substantial multi-file work with cross-cutting compliance + delegation + verification + principal-facing brief).
```

---

## END TRIGGER PROMPT
