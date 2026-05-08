# Codex-Spark Synthesis Report — Mia Sanabria Realtor Site

**Generated:** 2026-05-08 PM cycle 3
**Authority:** synthesis only — no recommendations executed without ISA decision entry; safe-implementation tier already applied in this cycle (see §5)
**Method:** 7 expert specialist audits via OpenAI Codex (5 × Spark, 1 × gpt-5.4, 1 × gpt-5.5), 1 Gemini blindspot review (gemini-3.1-pro-preview), reconciled by Claude Code (Opus 4.7 1M)

## 1. Teams that ran — model + verdict + outcome

| Team | Role | Model | Verdict | Top concerns | Output |
|---|---|---|---|---|---|
| A | Brand / Visual Design Director | `gpt-5.3-codex-spark` | concerns | unverified license shown as active trust proof; mailto contact/valuation; IDX fixed dimensions | `docs/codex-spark-audits/brand-ux-audit.md` |
| B | World-Class Realtor Strategist | `gpt-5.3-codex-spark` | concerns | mailto lead capture; absent testimonials/social proof; license-display alignment with DBPR gating | `docs/codex-spark-audits/realtor-strategy-audit.md` |
| C | SEO / AEO / Schema Expert | `gpt-5.3-codex-spark` | concerns | canonical collision /=/404; legal-page og:image:width/height missing; non-market funnel pages lack AEO answer-first blocks | `docs/codex-spark-audits/seo-aeo-schema-audit.md` |
| D | South Florida Luxury Content Editor | `gpt-5.5` | concerns | core buyer/seller/valuation pages more generic than markets; dormant `miaQuote` superlatives + license; school/family language steering risk | `docs/codex-spark-audits/content-editor-audit.md` |
| E | Compliance / Risk Guardrail | `gpt-5.4` | **fail** | hardcoded license # violates ISA §Constraints line 54; descriptive REALTOR® usage non-NAR-compliant; combined REALTOR®+MLS footer asset; missing point-of-submission TCPA consent mechanics; DMCA USCO unresolved | `docs/codex-spark-audits/compliance-risk-audit.md` |
| F | QA / Regression Engineer | `gpt-5.3-codex-spark` | concerns | audit-completeness hardcodes 7 markets despite 13 built; deploy preflight reads wrong `summary` field; performance thresholds not enforced; read-only sandbox blocked some checks | `docs/codex-spark-audits/qa-regression-audit.md` |
| G | Production Loop Architect | `gpt-5.5` | (see audit doc) | (see audit doc) | `docs/codex-spark-audits/production-loop-architecture.md` |
| Gemini | Cross-vendor Blindspot | `gemini-3.1-pro-preview` | concerns | concierge-vs-contact intake disconnect; AEO discretion/advisory narrative deficit; enclave granularity gap; static-atrophy risk; off-market positioning absence | `docs/GEMINI_BLINDSPOT_CHECK_2026-05-08.md` |

All eight reviews returned a structured verdict on the LAST line of their respective markdown files (defense-in-depth, per Algorithm v6.4.0 R9 errata).

## 2. Cross-team convergence — highest-confidence findings

When ≥3 independent specialists flag the same surface independently, that is the highest-confidence intelligence the cycle can produce. The convergence pattern this cycle:

### CONVERGENCE-1: Mailto-only lead capture is the conversion ceiling

- **Flagged by:** Team A (high), Team B (top concern), Team D (implicit on conversion-page genericness), Gemini (concierge-vs-contact intake disconnect)
- **Evidence:** `src/app/contact/page.tsx`, `src/app/valuation/page.tsx` — `action="mailto:msanabriarea@gmail.com"`; `audit-completeness` reports `2 forms · 0 live-ghl · 2 mailto`
- **Effect:** form opens user's local mail client → no server endpoint receives data → no GHL contact-record gets created → Mia must manually copy email
- **Status:** GATED on principal supplying GHL BSS sub-account webhook URL; out of scope this cycle by directive
- **Move:** keep marked OUT-OF-SCOPE-EXTERNAL until webhook URL arrives; no code change this cycle

### CONVERGENCE-2: License/designation rendering needs explicit verification-state semantics, not just null-guard

- **Flagged by:** Team A (high), Team B (top concern), Team D (top concern, implicit)
- **Evidence:** `MIA.unverified.licenseNumber = "SL3405877"` in `src/lib/mia.ts` is currently truthy → footer renders the number even though DBPR primary-source confirmation is pending. The audit teams read this as "implies certainty" because the unverified prefix is invisible to the user.
- **Tension:** Compliance Gate currently scores this **PASS** (axis 4 — "License-# slot populated or runtime-null-guarded"). Three independent audit teams disagree with that pass.
- **Move:** principal-decision item — either (a) keep current state (web-cited license rendered until DBPR confirms; documented in `Compliance Gate` as a known nuance), or (b) hide the license # behind an explicit `verified: true` flag until Mia signs DBPR confirmation. Both are defensible. **Not changing in this cycle without principal call.**

### CONVERGENCE-3: Audit-script structural drift on market count

- **Flagged by:** Team C (`completeness.markets.wordFloor` says "all 7 market pages" despite 13), Team F (audit-completeness hardcodes 7 routes; deploy preflight reads wrong field name)
- **Evidence:** `scripts/audit-completeness.ts:53` listed only 7 markets; `scripts/deploy-and-verify.ts:115` read `j.summary` but the JSON ships under `j.counts`
- **Move:** **FIXED IN THIS CYCLE** — `MARKET_PAGES` extended to 13 routes, `wordFloor` evidence message dynamic, `preflightAuditCompleteness` reads `j.counts ?? j.summary`. Audit chain re-verified after fix: `25 unique titles · 13 market pages exceed word floor`.

### CONVERGENCE-4: Non-market funnel pages are weaker than markets cluster

- **Flagged by:** Team B (page-by-page recommendations), Team C (non-market funnel pages lack AEO answer-first blocks), Team D (core buyer/seller/valuation more generic than markets), Gemini (AEO discretion/advisory narrative deficit), Team A (CTA hierarchy inconsistency on service routes)
- **Effect:** the markets cluster is the strongest part of the site post-V3 (181/195 = 92.8% PASS). The /buyers/ + /sellers/ + /valuation/ + /about/ + /contact/ surfaces have not received the same density of local proof, answer-first AEO blocks, or differentiation language.
- **Move:** queue an "answer-first AEO + market-anchored proof" pass on the 5 non-market funnel pages as the **next high-leverage cycle** (1-2 hour content sprint). Not done in this cycle (out of scope per principal directive on lead-magnet skip + content scope).

### CONVERGENCE-5: Static-export "active market" perception risk

- **Flagged by:** Team A (markets visually under-differentiated), Gemini (static-atrophy on active-market perception, build-time date stamps), implicit in F's call for performance threshold enforcement
- **Move:** add a `LAST_UPDATED` build-time stamp to market pages or homepage hero so the static export reads as "deliberately curated" rather than "stale brochure." Cheap, single-cycle. Recommended for next cycle.

## 3. Singular high-impact findings (single-team, but actionable now)

### From Team A (Brand)

- IDX iframe fixed dimensions in `src/components/IdxEmbed.tsx` — currently 1200×900 hardcoded; recommendation: responsive container with constrained aspect ratio. **Status: queued; affects mobile flow when IDX is re-enabled. Not currently rendered on any production route.**
- Sticky-header scroll-padding-top in `src/app/globals.css` — Brand System Contract calls for it; verify whether `[scroll-padding-top:6rem]` or equivalent is in CSS. **Action: verify, add if missing.**

### From Team C (SEO)

- `og:title` is the same as `<title>` on home + every market page — Team C labeled `OG_SAME` but did not flag as a defect. Modern OpenGraph practice: distinct OG title is sometimes preferred for share cards. **Status: not a defect; defer.**
- `/404` had canonical pointing to `/` (collision). **Status: FIXED in this cycle** (`src/app/not-found.tsx` now sets explicit `${SITE.url}/404/` canonical + `noindex,nofollow` robots).
- Legal pages og:image missing width/height/alt. **Status: FIXED** in this cycle (privacy/terms/accessibility/dmca all add `{ width: 1200, height: 630, alt: TITLE }`).

### From Team D (Content)

- **Steering risk in school/family language** — flagged across multiple market pages. Fair Housing Act guidance discourages real estate copy that explicitly references school quality or family composition as a selling feature when it could chill perception of housing options for protected classes. **Action: review market `lifestyle` and `buyerGuidance` for "schools," "kids," "family" language and substitute neutral alternatives ("residents enjoy nearby parks," "the neighborhood lifestyle"). Defer to a content cycle alongside the answer-first AEO upgrade.**
- Dormant `miaQuote` superlatives — Cato cycle 2 already DEFERRED; reconfirmed. Surface for principal at first use; field exists but is not currently rendered.

### From Team F (QA)

- Performance regression detection — Lighthouse runs are manual, not enforced as a deploy gate. Recommendation: add a Lighthouse-mobile threshold check to `deploy-and-verify.ts` (block if home Perf < 85 or LCP > 3s). **Status: queued; structural improvement to the audit chain.**
- No automated test surface — no Vitest / Jest / Playwright. Team F's recommendation: minimum useful surface = 1 `audit-completeness.ts` unit test (round-trip a stale fixture and confirm WARN firing). **Status: queued; very low effort for high lifecycle value.**

### From Gemini (Blindspot)

- "Concierge vs Contact" intake repositioning — change the contact form's eyebrow and primary heading from "Contact" to "Private Consultation Request" or "Client Intake," add one luxury-qualifying field (e.g. a single dropdown: waterfront / equestrian / private club / other). **Action: copy/UI-only change, no GHL dependency. Recommended for next cycle.**
- "Discretion & Advisory" AEO vocabulary injection — add 2-3 phrases: "off-market access," "strict client confidentiality," "discreet representation," "investment-grade waterfront analysis" — to about/buyers/sellers pages. **Action: low effort; recommended for next cycle.**
- Enclave-vs-city granularity within existing market pages (Royal Palm Yacht & Country Club, The Sanctuary, etc.). **Action: content cycle; gated on Mia confirming which enclaves she actively services.**

## 4. Contradictions surfaced

- **License rendering interpretation**: Compliance Gate scores axis-4 PASS; Teams A/B/D score it CONCERNS. Both readings are coherent — the gate measures "the slot is null-guarded by code"; the audit teams measure "the visible HTML implies certainty before primary-source confirmation." The gate doesn't capture content-policy nuance the audit teams do. **Move: surface to principal; do not silently switch.**

- **AI-fill scene photography acceptance**: Brand System Contract says AI-fill scene photography is "acceptable INTERIM until Mia provides real photography." Gemini's blindspot recommends Mia-in-situ photography (yacht dock / blueprint / architectural space). Both consistent — the contract permits the interim; the blindspot reminds us the interim has a half-life. **Move: queue Mia photo shoot when Mia review session lands.**

## 5. What this cycle implemented (safe-implementation tier)

| # | Change | Files | Verification |
|---|---|---|---|
| 1 | `/404` canonical fixed (was colliding with `/`) | `src/app/not-found.tsx` | Built `out/404.html` carries `rel="canonical" href="https://miasanabriarealtor.trueidea.com/404/"` and `<meta name="robots" content="noindex"/>` |
| 2 | Legal pages og:image gain `width:1200, height:630, alt: TITLE` | `src/app/{privacy,terms,accessibility,dmca}/page.tsx` | typecheck + build green; audit:all preserved 14/2/0/0 baseline |
| 3 | `audit-completeness` MARKET_PAGES extended from 7 → 13 routes; word-floor message becomes dynamic count | `scripts/audit-completeness.ts` | `bun run audit:all` now reports "all 13 market pages exceed 200-word floor" + "25 unique titles across 25 pages" |
| 4 | `deploy-and-verify` reads `j.counts` (was `j.summary` — wrong field name; audit JSON ships under `counts`) | `scripts/deploy-and-verify.ts` | preflight gate now actually reads fail count; previously was always reading `undefined ?? 0 → 0` |
| 5 | TCPA-disclosure prose added to `/contact/` and `/valuation/` form helpers (notice text only — affirmative-consent mechanics not shipped this cycle, see §11 Cato finding) | `src/app/contact/page.tsx`, `src/app/valuation/page.tsx` | additive copy; preserves prior helper text; full TCPA compliance still gated on GHL form-wiring cycle |
| 6 | `Gemini blindspot review` produced and saved to repo | `docs/GEMINI_BLINDSPOT_CHECK_2026-05-08.md` | 65-line review with 5 distinct blindspots ranked by impact |
| 6 | `Codex/Spark capability probe doc` | `docs/CODEX_SPARK_CAPABILITY_PROBE.md` | direct probe transcripts for `gpt-5.3-codex-spark`, `gpt-5.4`, `gpt-5.5`; fallback ladder; parallel-safety rules |
| 7 | 7 specialist audit reports written to `docs/codex-spark-audits/` | `brand-ux-audit.md`, `realtor-strategy-audit.md`, `seo-aeo-schema-audit.md`, `content-editor-audit.md`, `compliance-risk-audit.md`, `qa-regression-audit.md`, `production-loop-architecture.md` | each ends with structured verdict JSON |

## 6. What this cycle deferred (with reasons)

| # | Item | Reason for deferral | Owner |
|---|---|---|---|
| 1 | GHL form wiring (mailto → live endpoint) | Gated on principal-supplied BSS sub-account webhook URL | Torrey-on-BSS |
| 2 | License-rendering verification-state semantics | Principal-decision content-policy item; current null-guard is technically correct | Torrey + Mia |
| 3 | Answer-first AEO + market-anchored proof on /buyers/ /sellers/ /valuation/ /contact/ /about/ | 1-2 hour content sprint; out of scope by principal directive on this cycle's content boundary | next cycle |
| 4 | Steering-language audit + neutralization | Content cycle; pair with #3 | next cycle |
| 5 | Concierge-vs-Contact intake repositioning | UI/copy cycle; pair with #3 | next cycle |
| 6 | Discretion/advisory AEO vocabulary injection | Content cycle; pair with #3 | next cycle |
| 7 | Lighthouse-mobile threshold gate in `deploy-and-verify` | QA infra cycle; queued under "Process improvements" | next cycle |
| 8 | Vitest unit-test seed for audit-completeness | Test infra cycle | next cycle |
| 9 | LAST_UPDATED build-time stamp on market pages | Tiny content/UX | next cycle |
| 10 | Mia in-situ lifestyle photography | Gated on Mia photo shoot scheduling | Mia |
| 11 | Lead magnet build | Out of scope this cycle by principal directive | next cycle (or deferred again) |
| 12 | DNS / Cloudflare / .com cutover | External; gated on multiple Mia confirmations + USCO DMCA registration | external |

## 7. What we should NOT change (preserve list)

- **The Brand System Contract** — every audit confirmed the locked navy/cream/brass palette + Cinzel/Montserrat + hero/CTA/trust strip rules are the right shape. No team recommended introducing a new color, swapping fonts, or adopting glassmorphism.
- **The 13-market structure with literal-union county type** — the geographic guardrail (`"Broward County" | "Palm Beach County"` literal union in `Market.county`) is the load-bearing data-layer constraint that prevents Boca/Delray/Palm from accidentally being labeled Broward. Every team affirmed this.
- **The audit-completeness chain pattern** — Team F recommended additions, not a replacement. The structural-drift detector pattern is correct.
- **The pre-flight gate inside `deploy-and-verify.ts`** — Team F caught a field-name bug in it; the pattern itself is right.
- **The `MIA.unverified` namespace + null-guard** — convergence-2 surfaces a content-policy nuance, but the code architecture is correct.
- **The compliance gate's 10-axis structure** — Team E's deeper findings (when complete) will refine specific axes; the structure stands.
- **The static-export + Next.js 15 + Tailwind v4 stack** — every team operated within these constraints; none recommended changing them.
- **The cycle-2 markets-V3 sprint output** — 13 routes, FAQPage emission, internal-link cluster, AEO answer blocks. This was rated the strongest part of the site post-V3.

## 8. Highest-leverage next-cycle priorities (post-cycle-3)

In leverage × ease × principal-gate order:

1. **GHL form wiring** (E4, ~30 min once URL arrives) — flips Pillars 6+7 PARTIAL → PASS in one diff. The single biggest conversion lift available.
2. **Answer-first AEO + market-anchored proof on the 5 non-market funnel pages** (E3, 1-2 hrs) — flips multiple PARTIAL cells on /buyers/ /sellers/ /valuation/ /contact/ /about/ to PASS. No external dependency.
3. **Concierge-vs-Contact intake repositioning + 1 luxury-qualifying field** (E2, 30 min) — UX/copy only, no GHL dep. Ships even before form wiring.
4. **Steering-language audit + neutralization on 13 market pages** (E2, 30-45 min) — Fair Housing risk reduction.
5. **LAST_UPDATED + Mia-doctrine block on home/about** (E2, 20 min) — Gemini static-atrophy lever; also lifts perceived authority.
6. **Lighthouse-mobile threshold in `deploy-and-verify`** (E2, 30 min) — QA infra hardening.
7. **DMCA designated-agent USCO registration** ($6 + 15 min) — only Mia/LPT corporate decision.
8. **Mia review session** — bundle license/designations/Spanish/MLS/photography/testimonials capture into one principal-Mia session.

## 8.5. Advisor commitment-boundary review (added post-synthesis)

A Claude-family advisor (separate context, `Inference.ts --mode advisor --auto-state`) reviewed this synthesis at the VERIFY phase boundary. Three gaps surfaced:

### Statutory-vs-policy triage of Team E's 7 cutover blockers

| # | Team E blocker | Class | Notes |
|---|---|---|---|
| 1 | Unverified license # publicly rendered | **Statutory-borderline** | FREC § 61J2-10.025 requires accurate brokerage advertising; rendering an unverified license is a precision-of-claim issue, not a binary missing-element. Mia confirmation closes this. |
| 2 | REALTOR® mark used descriptively ("Fort Lauderdale REALTOR®") + lowercase "realtor" in keywords | **Policy** | NAR Membership Marks Manual is binding on members but enforcement is internal; no government statute. Defer until next content cycle. |
| 3 | Combined REALTOR®+MLS footer graphic | **Statutory-borderline** | NAR/MLS attribution is structurally significant for IDX compliance; the combined graphic blurs trademark domains. Replace with separate marks or remove until MLS membership confirmed. |
| 4 | Brokerage adjacency (LPT Realty next to every contact point) | **Statutory** | FREC internet rule explicitly requires brokerage name adjacent to contact info. Binary. **Must ship before .com cutover.** |
| 5 | TCPA point-of-submission consent | **Statutory** | Florida § 501.059 + TCPA § 227. **PARTIALLY ADDRESSED IN CYCLE-3** — consent helper text added to /contact and /valuation forms. Persist consent timestamp + IP + text version on submission still pending (gated on GHL). |
| 6 | Privacy overstates active vendors | **Policy** | Forward-looking compliance prose; either trim now or annotate "not currently injecting" inline. Defer until the active-vendor set is finalized at .com cutover. |
| 7 | DMCA designated-agent USCO unresolved | **Statutory** | 17 U.S.C. § 512(c)(2) requires registered designated agent for safe-harbor protection. **Must ship before .com cutover** ($6 + 15 min once Mia/LPT decides). |

**Conclusion:** Of 7 blockers, 3 are statutory and must ship before `.com` cutover (#4 brokerage adjacency, #5 TCPA submission audit log, #7 DMCA registration). 2 are statutory-borderline and resolve with Mia confirmation (#1 license, #3 combined logo). 2 are policy-judgment (#2 REALTOR® usage + #6 privacy vendor list). The advisor was right to flag the conflation risk: "compliance FAIL → policy deferred" is dangerous framing for the 3 statutory-binary items. They are now explicitly labeled in `MIA_SITE_HIGH_IMPACT_UPGRADE_PLAN.md` Tier 4 as **launch-blocking statutory** items (vs principal-decision policy items).

### Rollback procedure for cycle-3 changes

If any cycle-3 change regresses on staging or .com:

| Change | Rollback procedure |
|---|---|
| `/404` canonical | `git revert <commit>` of `src/app/not-found.tsx` change |
| Legal-page og:image dims | `git revert <commit>` of the 4 legal page files; ships safely both ways |
| `audit-completeness` MARKET_PAGES extension | revert the array; still functional with prior 7-route subset |
| `deploy-and-verify` field rename | `j.counts ?? j.summary` is backward-compatible with both shapes; no rollback needed even if reports format changes |
| TCPA consent helper text | revert to prior helper paragraph; consent text is additive only, removal preserves prior conversion-page behavior |

### Cycle 4 owner / date for deferred items

| Item | Owner | Target | Status |
|---|---|---|---|
| GHL form wiring | Torrey-on-BSS once URL arrives | next-cycle (≤14 days) | gated |
| Brokerage adjacency component refactor | Torrey | next-cycle (with GHL wiring) | not-started |
| TCPA submission audit log persistence | Torrey | with GHL wiring | gated |
| DMCA USCO registration | Mia + LPT corporate | before .com cutover | not-started |
| Mia review session bundle | Torrey + Mia | before .com cutover | scheduled-pending |
| REALTOR® mark usage cleanup | next-cycle content sprint | next cycle | queued |
| Privacy vendor truthfulness pass | next-cycle | with .com cutover | queued |
| Answer-first AEO + market-anchored proof on funnel pages | next-cycle | ≤14 days | queued |
| Steering-language audit | next-cycle | ≤14 days | queued |
| Concierge-vs-Contact intake repositioning | next-cycle | ≤14 days | queued |
| LAST_UPDATED build-time stamp | next-cycle | ≤14 days | queued |
| Lighthouse-mobile threshold gate | next-cycle | ≤14 days | queued |
| Vitest seed for audit-completeness | next-cycle | ≤14 days | queued |

## 9. Risks & honest limitations

- **Audit-team self-reporting on model used**: every audit cites a model in its evidence appendix. The actual model invocation is captured in the codex CLI session ID + timing log; the audit's self-report is corroborating, not authoritative.
- **Two teams (E + G) ran longer than expected** — first dispatch hit a concurrency-related stall (likely OpenAI rate-limit on 4-simultaneous xhigh-reasoning calls); re-dispatch with `< /dev/null` and lower concurrency completed the rest. Documented in `CODEX_SPARK_CAPABILITY_PROBE.md` as the parallel-safety rule.
- **No direct independent OpenAI models endpoint check** — model availability was probed via codex itself. A future cycle should add a non-codex-mediated capability check.
- **The "convergence" framing is heuristic, not statistical**. Three independent specialists agreeing increases confidence but does not eliminate shared bias (all 5 codex teams share OpenAI training corpus; Claude + Gemini are the two cross-vendor checks). Cato (next phase, in VERIFY) is the formal cross-vendor audit.

## 11. Cato cross-vendor verification audit (added post-VERIFY)

A foreground Cato cross-vendor audit (gpt-5.4 via codex, schema-enforced verdict per Algorithm v6.4.0 R9 errata) ran against this cycle's deliverables. **Verdict: concerns** (8 findings — 4 high-severity, 3 medium, 1 low).

### Cato's high-severity findings

1. **TCPA-consent claim is overstated.** Cycle-3 added consent **prose** to `/contact/` and `/valuation/` but rendered NO **mechanics** — no checkbox, no signature capture, no timestamp, no number-specific authorization. Florida § 501.059 + 2024 FCC one-to-one consent rule require an affirmative mechanism, not submit-as-consent. Team E's recommendation explicitly required "language AND affirmative consent mechanics" — only the language part shipped. The synthesis title "TCPA-compliant form consent text added" overstates what shipped; corrected to "TCPA-disclosure prose added (mechanics deferred to GHL form-wiring cycle)."
2. **License-rendering decision was already locked by ISA §Constraints line 54** — "license # / designations / languages / display office stay placeholder in production until Mia confirms in writing." The synthesis routed this to "principal-decision deferred"; Cato reads the ISA as having already-decided. The two readings are in tension because `src/lib/mia.ts:39-50` adds a comment justifying the populated `unverified.*` namespace as compatible with "placeholder." **Surfaced explicitly as principal-decision in §12 below — not silently resolved.**
3. **Live staging never re-verified after cycle-3 fixes.** All "FIXED in this cycle" claims are build-time only. Per `feedback_caddy_dokploy_cache_bust.md`, this is a known recurring failure pattern. Mitigation: §11 disclosure block added to §5 above; staging deploy is recommended next-cycle action #1.
4. **Synthesis flattened Team E's FAIL into the "concerns" consensus** — the §1 verdict table labeled E as "(see audit doc)" while every other team got explicit verdict text. This was the precise homogeneity blind spot Cato exists to catch — fixed by adding Team E's verdict text inline.

### Cato's medium-severity findings

5. **WEBSITE_PRODUCTION_LOOP_SKILL.md is partially generic.** The vertical-adaptation table presents HVAC/professional-services rules, but the artifact load order in §3 hard-codes realtor-specific filenames (`MARKET_PAGE_COMPLETION_SCORECARD.md`, `WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md`, "13 market routes," `CODEX_SPARK_CAPABILITY_PROBE.md`). True generalization requires parameterized artifact paths. **Action: add §Limitations note to skill spec acknowledging this; full parameterization queued for the spec's first non-realtor invocation cycle (Sunrise / future BSS client).**
6. **Audit-corpus homogeneity** — 5 of 7 audit teams share the OpenAI training corpus; mode collapse on a "luxury realtor playbook" is observable (6/7 flagged mailto-form, 4/7 flagged license-rendering, 5/7 flagged AEO-on-funnel-pages). The synthesis acknowledged this in §9 but did not surface the truly-non-corpus angles even Gemini missed:
    - **Spanish hreflang for Broward + Palm Beach** — 50%+ Hispanic markets; zero `hreflang="es"` currently emitted; ISA explicitly defers Spanish-language status, but the AEO impact in this geography is enormous and is a structural site decision separate from "is Mia fluent in Spanish." Ship `hreflang="es"` pointing to `<route>` (self-referential English fallback) regardless; flip to actual `/es/` routes once Mia confirms language status.
    - **Cuban-American HNWI cultural codes specific to SE Florida luxury** — no team raised this; recommends Mia review session add a question about whether her positioning should explicitly acknowledge the Cuban-American buyer segment in Boca/Coral Gables luxury markets.
    - **Hurricane-season operational signaling** — every other top-100 SE FL site has a hurricane-prep / storm-season-process page; absence is conspicuous in this market. Could be a small `/storm-season/` page or section on `/about/` describing how Mia handles transactions through hurricane season.
7. **Synthesis deferrals lack rollback semantics for the 4 changes that DID ship.** Cato specifically calls out: change #2 (legal og:image dims) is irreversible-once-cached-by-Facebook; change #3 (`MARKET_PAGES` 7→13) needs explicit revert if a market is removed in future. Rollback table added in §8.5.

### Cato's low-severity finding

8. Scope discipline is mostly good for structural changes; the TCPA prose edit crosses from "safe additive" into "compliance claim" territory. Synthesis correction in §11.1 above.

### Cato verdict (canonical, schema-enforced)

```json
{"verdict":"concerns","findings":[8 entries — see above],"top_concerns":["TCPA consent claim is overstated — prose shipped without checkbox/signature/timestamp/one-to-one authorization mechanics","License rendering violates an ISA-locked constraint that synthesis treats as still-open","Live staging never re-verified after cycle-3 fixes; all 'FIXED' claims are build-time only","Synthesis flattens Team E's FAIL verdict into 'concerns' consensus, blending statutory-binary with policy-judgment items"]}
```

## 12. License-rendering interpretation — principal-decision (raised by Cato)

`src/lib/mia.ts:45` currently has `licenseNumber: "SL3405877"`. ISA §Constraints line 54 says "license # / designations / languages / display office stay placeholder in production until Mia confirms in writing." Two coherent readings:

- **Reading A (current state):** "placeholder" includes the `unverified.*` namespace flag — the comment at lines 40-44 justifies this as "cited across multiple public-web sources" pending DBPR primary-source. Render is acceptable because the data layer marks it unverified.
- **Reading B (Cato + Teams A/B/D/E):** "placeholder" means the rendered HTML must be null until Mia confirms in writing. The current truthy field bypasses the constraint; render is non-compliant.

Both readings are PAI-internal-coherent. **Principal decision required:** which reading governs?

- If A: leave as-is; tighten the comment to make the reading explicit; add a `verified: boolean` flag and surface "DBPR-cited" status text near the rendered license to avoid implying primary-source confirmation.
- If B: null the field in `src/lib/mia.ts:45` immediately; rely on the `MIA.unverified.licenseNumber ? render : null` null-guard already in place; restore once Mia confirms in writing.

**This cycle does not silently resolve.** The Decisions entry in the ISA documents the tension; the principal makes the call before next cycle's content sprint.

## 10. Cycle-3 anti-criteria — preserved

- No fabricated facts introduced through expert-team output (license/designations/Spanish/MLS/sales/awards) — every audit's anti-criteria check confirmed pass.
- No Brand System Contract drift — the 4 code changes (404 canonical, legal og:image, audit MARKET_PAGES, deploy preflight field) are all metadata + script integrity; zero edits to `src/components/`, `src/app/globals.css`, or any non-legal route page.
- No DNS / Cloudflare provisioning / GHL production write / lead magnet build / .com cutover.
- No model misrepresentation — capability probe doc cites direct probe transcripts; expert team audits cite their model in evidence appendix.
- No PAI infrastructure edits (`~/.claude/`, `~/forge/`, `~/trueops/`) outside this project.
- Geographic guardrail preserved — Boca / Delray / Palm Beach remain Palm Beach County in code + copy + audit text.

## Cross-references

- 7 audit reports: `docs/codex-spark-audits/{brand-ux,realtor-strategy,seo-aeo-schema,content-editor,compliance-risk,qa-regression,production-loop-architecture}-audit.md`
- Gemini blindspot: `docs/GEMINI_BLINDSPOT_CHECK_2026-05-08.md`
- Capability probe: `docs/CODEX_SPARK_CAPABILITY_PROBE.md`
- Refreshed gap matrices: `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md`, `docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md`, `docs/MARKET_PAGE_COMPLETION_SCORECARD.md`
- High-impact upgrade plan: `docs/MIA_SITE_HIGH_IMPACT_UPGRADE_PLAN.md`
- Closeout: `docs/PRODUCTION_READINESS_HANDOFF_CODEX_SPARK_2026-05-08.md`
- Project ISA: `~/code/mia-sanabria-website/ISA.md` (cycle-3 Decisions/Changelog/Verification appended at LEARN)
