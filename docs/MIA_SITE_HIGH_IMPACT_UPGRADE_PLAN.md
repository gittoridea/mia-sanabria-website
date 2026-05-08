# Mia Sanabria Site — High-Impact Upgrade Plan

**Generated:** 2026-05-08 PM cycle 3 (Codex-Spark expert team audit)
**Source:** Synthesis of 7 expert audits (Codex Spark / 5.4 / 5.5) + Gemini blindspot + cycle-3 implementation pass
**Live staging:** https://miasanabriarealtor.trueidea.com
**Authority:** this plan ranks future-cycle work; nothing here ships without an explicit principal-approved cycle scope

## How to read this

Each item is annotated with:

- **Tier** — Immediate (≤2h) / Near-term (2-6h) / Strategic (1-2d) / Gated (external dependency)
- **Effort** — E1-E5 per PAI Algorithm
- **Source** — which audit team(s) flagged it (convergence is highest-confidence)
- **Dependency** — what must be true before it can ship
- **Lever** — what scorecard cell or pillar moves when it ships

## Tier 1 — Immediate (0-2 hours)

### 1.1 Concierge-vs-Contact intake repositioning [DONE-CANDIDATE]

- **Effort:** E2 (~30 min)
- **Source:** Gemini blindspot (top concern), Team B (intent router not stateful), Team A (CTA hierarchy)
- **Dependency:** none — UI/copy only, no GHL endpoint required
- **Lever:** Pillar 6/7 (lead capture / conversion) PARTIAL → PASS-with-note; Pillar 14 (lead capture) ⚠ → ⚠ with luxury-positioning advance
- **Specifics:**
  - Change `/contact/` page H1 from "Contact" to "Private Consultation Request" or "Client Intake"
  - Add 1 luxury-qualifying dropdown to the form (e.g. interest = waterfront / private-club / pied-à-terre / advisory-only)
  - Eyebrow text reinforces discretion: "Direct response from Mia within 2 business hours"
  - Mirror on `/valuation/` page: H1 → "Valuation & Acquisition Brief" or similar

### 1.2 Discretion / advisory AEO vocabulary injection [STAGED]

- **Effort:** E2 (~30 min)
- **Source:** Gemini blindspot (top concern — AEO discretion deficit)
- **Dependency:** none
- **Lever:** Pillar 16 (AEO) on `/about/`, `/buyers/`, `/sellers/` lifts; HNWI-vector LLM citation share rises
- **Specifics:**
  - Inject 2-3 phrases into `/about/` body: "off-market access," "strict client confidentiality," "discreet representation," "investment-grade waterfront analysis"
  - Add to `MIA.voice.advisoryPhrases` in `src/lib/mia.ts` so the language is centralized
  - DO NOT touch the locked anchor lines (`Personal by design, not by claim.` / `If I don't know the answer, I will find it.`)

### 1.3 LAST_UPDATED build-time stamp [STAGED]

- **Effort:** E2 (~20 min)
- **Source:** Gemini blindspot (static-atrophy on active-market perception)
- **Dependency:** none
- **Lever:** combats the "static brochure" perception risk; reads as deliberate editorial cadence
- **Specifics:**
  - Inject `process.env.BUILD_TIME = new Date().toISOString()` at build time via `next.config.ts`
  - Render small `Updated: <Month YYYY>` text on `/markets/` index footer + each market page footer (above CTAStrip)
  - Format: `"Curated for ${MONTH} ${YEAR}"` per Gemini's "deliberate editorial choice" framing

### 1.4 Footer social-icon touch-target sizing [QUEUED]

- **Effort:** E1 (~15 min)
- **Source:** Team A (medium severity — current icons below 44×44 minimum)
- **Dependency:** none
- **Lever:** Mobile UX polish; Pillar 12 (Mobile) reinforced
- **Specifics:** Raise icon button hit-area to ≥ 44×44 CSS px in `src/components/SiteFooter.tsx`; increase `padding` around icon, not icon size

## Tier 2 — Near-term (2-6 hours)

### 2.1 Answer-first AEO + market-anchored proof on funnel pages

- **Effort:** E3 (~2 h)
- **Source:** Team B + Team C + Team D + Gemini (4-team convergence)
- **Dependency:** none for first pass; Mia confirmation needed before adding any verifiable market data
- **Lever:** Pillar 8 (AEO) PARTIAL → PASS on `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/about/`; Pillar 6 (Local Authority) PARTIAL → PASS on those same pages
- **Specifics per page:**
  - `/buyers/` — Add 75-125 word answer block titled "If you're buying in Eastern Fort Lauderdale, Boca, or Delray …" before the process timeline. Internal-link to 3 markets matching reader intent.
  - `/sellers/` — Same pattern with seller-side framing.
  - `/valuation/` — Same; lead with the question "What's a residential luxury waterfront valuation actually answering?"
  - `/contact/` — Skip the AEO block (it's a conversion page); add the qualifying field from Tier 1.1 instead.
  - `/about/` — Add the discretion/advisory paragraph from Tier 1.2 here too; this page is the central trust surface.

### 2.2 Steering-language audit + neutralization on 13 markets

- **Effort:** E2 (~45 min)
- **Source:** Team D (top concern — Fair Housing steering risk in school/family language)
- **Dependency:** none — content edits inside `src/lib/markets.ts` only
- **Lever:** Compliance posture — reduces Fair Housing Act § 3604 exposure; Compliance Gate axis 5 reinforced
- **Specifics:**
  - Grep `src/lib/markets.ts` for: `school`, `kids`, `family`, `families`, `child`, `children`, `student`
  - Substitute neutral alternatives: "residents enjoy," "the neighborhood lifestyle," "households," "the community"
  - Document grep-pre + grep-post in `## Decisions` ISA entry
  - Update `audit-stale-terms.ts` with steering-language sentinels (so future drift is caught at audit time)

### 2.3 Lighthouse-mobile threshold gate in `deploy-and-verify`

- **Effort:** E2 (~30 min)
- **Source:** Team F (high-severity gap — performance regression undetected)
- **Dependency:** Lighthouse CI binary available in deploy environment
- **Lever:** Hardens deploy gate; performance regression now blocks deploy instead of warning
- **Specifics:**
  - Add `preflightLighthouse()` step to `scripts/deploy-and-verify.ts`
  - Threshold per cycle: home Perf ≥ 85 (currently 89), LCP ≤ 3.0s (currently 2.5s), A11y ≥ 95 (currently 100), BP ≥ 90 (currently 100 — 79 on `/contact/` due to known mailto false-positive; document an allowlist)
  - WARN-only first cycle; flip to HARD next cycle once threshold proven stable

### 2.4 Vitest unit-test seed for `audit-completeness`

- **Effort:** E2 (~45 min)
- **Source:** Team F (recommended new test surface)
- **Dependency:** none
- **Lever:** Audit script regression prevention; "the auditor of auditors" pattern
- **Specifics:**
  - Add `bun test` (Bun's built-in test runner — no Vitest dependency required)
  - Seed test: feed a known-stale fixture HTML to `audit-completeness.ts`, assert WARN/FAIL fires correctly
  - Add `package.json` `"test": "bun test"` script

## Tier 3 — Strategic (1-2 days)

### 3.1 Off-market positioning surface

- **Effort:** E3 (~3-4 h)
- **Source:** Gemini blindspot (5th blindspot — psychological lever)
- **Dependency:** Mia's go-ahead on whether she has a "private waterfront collection" / "pre-MLS access" angle to position
- **Lever:** New conversion psychology lever; FOMO + access-to-shadow-inventory framing
- **Specifics:**
  - Add a `/private-collection/` (or `/concierge-access/`) page — request-access framing, no actual private listings yet
  - Form posts to same intake endpoint as `/contact/` (no separate GHL workflow)
  - Brand-System-compliant: brass-card frame, navy hero, single primary CTA "Request Access"
  - Anti: do NOT claim Mia has off-market deals if she doesn't; this is positioning, not fabrication

### 3.2 Mia in-situ photography gallery

- **Effort:** content-only post-shoot
- **Source:** Gemini (photography gap), Team A (image treatment), Team D (voice anchoring)
- **Dependency:** Mia photo shoot scheduled
- **Lever:** Pillar 11 (Images) advance; non-headshot trust signals; reduces "templated luxury" perception
- **Specifics:**
  - Mia at a yacht dock (waterfront context)
  - Mia reviewing blueprints / floorplans (advisory framing)
  - Mia in a high-end architectural space (luxury-tier subliminal)
  - Replace AI-fill scene photography on `/buyers/`, `/sellers/`, `/valuation/`

### 3.3 Topic-cluster /insights/ expansion

- **Effort:** E3 (~3-4 h)
- **Source:** Cycle-2 handoff (deferred), Gemini (enclave granularity gap)
- **Dependency:** content-quality gate from Mia (or principal voice-write)
- **Lever:** Pillar 16 (AEO) deepening; long-tail Eastern FtL waterfront / Boca Mediterranean Revival / Delray Atlantic Avenue queries
- **Specifics:**
  - 3 new MDX essays as Article + FAQPage + BreadcrumbList
  - Each ~800-1200 words; internal-link aggressively into market detail pages
  - Brand-System-compliant typography rhythm

## Tier 4 — Gated (external dependency)

### 4.1 GHL form wiring (mailto → live endpoint) — **HIGHEST LEVERAGE**

- **Effort:** E4 (~30 min once URL arrives; setup of Cloudflare/Netlify Pages Function proxy ~2 h)
- **Source:** Team A + Team B + Team D + Gemini (4-team convergence — single biggest improvement on the table)
- **Dependency:** Principal supplies BSS sub-account webhook URL
- **Lever:** Pillar 6/7 PARTIAL → PASS in one diff; Pillar 14 (lead capture) ⚠ → ✅; Pillar 15 (automation path) ❌ → ✅ on `/contact/`
- **Specifics:** per `docs/GHL_INTEGRATION_OPTIMAL.md`

### 4.2 License-rendering verification-state semantics

- **Effort:** E2 (~15 min once decision made)
- **Source:** Team A + Team B + Team D (3-team convergence on content-policy nuance)
- **Dependency:** principal decision — keep current state (web-cited) OR gate behind `verified: true` flag
- **Lever:** Compliance Gate axis 4 PASS-with-note → PASS-clean; reduces audit-team friction in future cycles

### 4.3 DMCA designated-agent USCO registration

- **Effort:** $6 + 15 min once Mia/LPT decides
- **Source:** Cycle-1 deferral; Compliance Gate § external blocker
- **Dependency:** Mia or LPT corporate decision + USCO registration submission
- **Lever:** `src/app/dmca/page.tsx:80` TODO closes; .com cutover unblocked on this axis

### 4.4 Mia review session

- **Effort:** 30-60 min principal-Mia
- **Source:** every cycle's "external blockers" list
- **Bundle:**
  - DBPR primary-source license confirmation (axis 4 hardening)
  - Designations (CRS / GRI / SFR / AHWD / etc.) opt-in or null-affirm
  - Spanish proficiency status confirm
  - NAR / MLS membership specifics
  - Photography schedule
  - Real testimonials with consent
  - Display office confirmation
- **Lever:** unblocks 6 axes simultaneously; gates `.com` cutover

### 4.5 DNS swap `.trueidea.com` → `.com`

- **Effort:** 60 min, scheduled
- **Dependency:** All other gated items (4.1-4.4) cleared + Mia readiness
- **Trigger:** Mia signs off + GHL forms wired + DMCA registered + LinkedIn cleanup + branded email setup

### 4.6 GSC + Bing Webmaster sitemap submission

- **Effort:** 15 min post-cutover
- **Dependency:** `.com` cutover complete
- **Lever:** Initial crawl + index acceleration

### 4.7 Cloudflare Polish (deferred per principal directive)

- **Effort:** account setup + DNS migration
- **Source:** prior-cycle blocker list, REMOVED 2026-05-08
- **Status:** Out of plan unless production quality fails to meet baseline without it; current Lighthouse home Perf 89 + LCP 2.5s without Cloudflare is acceptable

## Tier 5 — World-class polish (optional, post-cutover)

### 5.1 Vendor ecosystem teasing block

- **Source:** Gemini blindspot
- **Specific:** Mia's "black book" — marine surveyors / luxury stagers / private wealth attorneys — hint at her network as a focal point of an HNWI ecosystem
- **Form:** small `/concierge/` page or about-page section listing partner categories (no actual partner names without consent)

### 5.2 Zero-click executive dossier on market pages

- **Source:** Gemini blindspot
- **Specific:** TL;DR block at top of each market page — entry price-point band, proximity to private aviation / yacht dockage, vibe descriptor
- **Constraint:** any price-point data must come from Mia's verifiable MLS access; flag as `[MIA-CONFIRM]` until then

### 5.3 Adviser-philosophy block on `/about/`

- **Source:** Gemini blindspot
- **Specific:** explicit advisory-process narrative — "How I work with each client" — 4 phases visible

### 5.4 Schema-drift enforcement (cross-cycle)

- **Source:** Gemini cross-cycle compounding risks; Team F structural drift category
- **Specific:** quarterly cycle that re-runs every audit + diff against the prior cycle's scorecard; surface any cell that moved without an explicit ISA entry

## What this cycle (cycle-3) actually shipped

| # | Improvement | Tier | Effort actual | Files |
|---|---|---|---|---|
| 1 | `/404` canonical fix (was colliding with `/`) | T1 SEO | 15 min | `src/app/not-found.tsx` |
| 2 | Legal-page og:image dims (privacy/terms/accessibility/dmca) | T1 SEO | 10 min | `src/app/{privacy,terms,accessibility,dmca}/page.tsx` |
| 3 | `audit-completeness` MARKET_PAGES extended 7 → 13; word-floor message dynamic | T2 QA | 10 min | `scripts/audit-completeness.ts` |
| 4 | `deploy-and-verify` reads `j.counts` (was `j.summary`) | T2 QA | 5 min | `scripts/deploy-and-verify.ts` |
| 5 | 7 specialist audit reports + Gemini blindspot + capability probe + synthesis report + skill spec + this plan | T2 docs | bulk | 11 docs |

All 5 changes verified: `bun run typecheck` exit 0; `bun run lint` exit 0; `bun run build` exit 0; `bun run audit:all` exit 0 (14 PASS / 2 WARN / 0 FAIL preserved baseline; metadata audit now reports across 25 pages instead of 19; markets word-floor across 13 pages instead of 7).

## Cross-references

- 7 audits: `docs/codex-spark-audits/`
- Gemini blindspot: `docs/GEMINI_BLINDSPOT_CHECK_2026-05-08.md`
- Synthesis: `docs/CODEX_SPARK_SYNTHESIS_REPORT.md`
- Capability probe: `docs/CODEX_SPARK_CAPABILITY_PROBE.md`
- Skill spec: `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md`
- Project ISA: `~/code/mia-sanabria-website/ISA.md`
