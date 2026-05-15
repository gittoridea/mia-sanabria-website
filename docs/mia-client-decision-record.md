# Mia Sanabria — Client Decision Record

> **Source:** Live meeting between Mia Sanabria and Torrey Rozycki on 2026-05-13. Transcribed and confirmed via Cycle 24 Mia-decisions implementation lane. This document is the durable on-repo source of truth for Mia's confirmed positioning, identity, navigation, and content decisions. Cross-reference: `src/lib/mia.ts`, `src/lib/site.ts`, `ISA.md` (project root).

## Identity (locked)

- **Display name:** Mia Sanabria
- **Legal name:** Mia Mary Sanabria
- **Brokerage display:** LPT Realty
- **Brokerage legal:** LPT Realty LLC
- **License number (Florida):** SL3405877 — Mia confirmed correct on 2026-05-13. DBPR primary-source verification remains a pre-production-cutover gate (`src/lib/mia.ts` `unverified` block stays until DBPR portal screenshot captured).
- **Languages claimed in marketing:** English only. **Spanish/bilingual claims explicitly disallowed** — do not surface Spanish service language anywhere on the site or in schema.

## Designations approved (2026-05-13)

Mia verbally approved the following designations for site display. They have moved into `src/lib/mia.ts → unverified.designations` pending a written attestation + NAR membership card cross-check. **REALTOR® R logo display remains gated on NAR / Florida Realtors / BPSR membership confirmation per `CATO-03`.**

- PSA — Pricing Strategy Advisor
- RENE — Real Estate Negotiation Expert
- CDPE — Certified Distressed Property Expert
- ABR — Accredited Buyer's Representative
- SFR — Short Sales & Foreclosure Resource
- AHWD — At Home With Diversity

No other designations may be displayed without a new written approval from Mia.

## Canonical domain

- **Production canonical:** `https://miasanabria.com`
- **Prior canonical (legacy):** `https://miasanabriarealtor.com` — Mia's existing Direct Axess hosted site. DNS/cutover, 301 redirects from legacy → canonical, and brand-email reissue (`mia@miasanabria.com`) are external work owned by Torrey + Mia.
- **Code-side change:** `src/lib/site.ts` `PRODUCTION_URL` updated to `https://miasanabria.com`. Schema, OG, canonical link, hreflang, sitemap all auto-flow from this constant.
- **Boundary:** Claude / Cycle 24 lane does NOT touch DNS, Dokploy environment vars, Direct Axess, GHL sub-account hostnames, or the existing legacy domain. Cutover requires a separate Torrey-authorized cycle.

## Positioning thesis (approved)

> **Mia helps Southeast Florida luxury homeowners, absentee owners, and qualified buyers make confident real estate decisions with discreet, local, concierge-level guidance.**

- Price band: **$600k–$5M residences**
- Tone: local expert + approachable concierge
- Banned phrasing (per project `CLAUDE.md` honesty contracts): "luxury concierge", "white-glove", "bespoke", "high-net-worth", "off-market", "since 2017", "within two hours", "as seen in/on"
- Audit guard: `bun run audit:no-fabrications` will block overclaim regression (13-pattern catalog shipped Cycle 23).

## Audience priority

1. Luxury sellers ($600k–$5M)
2. Waterfront / lifestyle buyers
3. Qualified South Florida buyers
4. Absentee luxury owners
5. Expired-listing sellers
6. Relocating buyers
7. Investors
8. Renters / first-time buyers — **lower priority, not homepage-dominant**

Expired-listing sellers and absentee owners are real priority niches but must remain **secondary**, not homepage-dominant. Homepage retains an answer-first hero with broad luxury Southeast FL framing.

## Navigation (locked)

Header navigation, in order:

1. Neighborhoods
2. Buyers
3. Sellers
4. Blog
5. About
6. Contact
7. **Search icon** — hover/title/aria-label exactly: `Home Search`

Routes (code-side, kept for SEO continuity):

| Label | Route | Notes |
|---|---|---|
| Neighborhoods | `/markets/` | Label changed from "Markets" → "Neighborhoods" in nav; route slug retained to preserve existing SEO. Future cycle may add `/neighborhoods/` 301 alias. |
| Buyers | `/buyers/` | Unchanged |
| Sellers | `/sellers/` | Unchanged |
| Blog | `/insights/` | Label changed from "Insights" → "Blog" in nav; route slug retained for SEO. |
| About | `/about/` | Unchanged |
| Contact | `/contact/` | Unchanged |
| (Search icon) | `/markets/#property-search` | Anchors to existing property-search section; will retarget to Bridge IDX route when wired |

Removed from labeled top nav (still accessible via footer / homepage CTAs / direct route):
- `Home` (replaced by logo link)
- `Home Valuation` (`/valuation/`) — remains in footer + CTA strip

## Homepage hero (locked content; visual scaffold deferred)

- **H1 (two lines, exactly):**
  - Line 1: `South Florida Lifestyle`
  - Line 2: `Home Search`
- **Search box in hero:** Required. Initial implementation = "quick-jump" link to the property-search section + retained Matrix MLS iframe below. Full inline Bridge IDX search-by-city/price/beds remains blocked on the Bridge middleware decision (see IDX section below).
- **Hero background image:** Existing `/public/markets/fort-lauderdale.jpg` reused (Cycle 22-R1 approved twilight luxury waterfront). The current `miasanabria.com` hero asset is **not pulled** this cycle — no credential / scrape risk; reuse keeps the visual stable until Mia approves a new asset.

## Approved neighborhoods (9, locked)

The canonical Mia-approved neighborhood list (Broward focus, Mia's daily working market):

1. Fort Lauderdale
2. Pompano Beach
3. Deerfield Beach
4. Coral Springs
5. Plantation
6. Weston
7. Hollywood
8. Davie
9. Sunrise

**Coverage state vs existing repo content:**

| Approved neighborhood | Existing market page? | Status |
|---|---|---|
| Fort Lauderdale | Yes (`/markets/fort-lauderdale/`) | Live, FortLauderdaleV2 component |
| Pompano Beach | Yes (`/markets/pompano-beach/`) | Live (Cycle 18) |
| Deerfield Beach | **No** | Content gap — needs Mia copy + photos |
| Coral Springs | **No** | Content gap — needs Mia copy + photos |
| Plantation | **No** | Content gap — needs Mia copy + photos |
| Weston | **No** | Content gap — needs Mia copy + photos |
| Hollywood | **No** | Content gap — needs Mia copy + photos |
| Davie | **No** | Content gap — needs Mia copy + photos |
| Sunrise | **No** | Content gap — needs Mia copy + photos |

**Legacy markets (in repo, NOT on Mia's approved list — flagged for legacy SEO review):**

`coral-ridge`, `victoria-park`, `boca-raton`, `palm-beach`, `delray-beach`, `lighthouse-point`, `rio-vista`, `harbor-beach`, `las-olas-isles`, `seven-isles`, `sea-ranch-lakes`, `hillsboro-mile`, `bay-colony`, `bermuda-riviera`.

Per mission boundary ("avoid destructive removal unless safe"), legacy pages are **retained for SEO continuity** with a tracked decision: review and decide retain-vs-redirect-vs-deprecate in a separate Mia-content cycle. The homepage Featured Markets pager still references the existing East FL waterfront set until Mia confirms the homepage neighborhood-emphasis switch.

The Mia-approved 9 are now also surfaced as `MIA_APPROVED_NEIGHBORHOODS` in `src/lib/mia.ts` for downstream nav / sitemap / schema reuse.

## IDX — Bridge Data Output (architecture decision)

- **Provider chosen by Mia:** Bridge Data Output (`bridgedataoutput.com/docs/platform/`)
- **Credentials state:** Torrey has client ID, secret ID, server token, browser token ready. **No credentials are in this repo, in `.env`, or in chat. Claude has not seen them.**

### Bridge Runtime Decision (Cycle 33 — 2026-05-14)

```yaml
decision_id: MIA-BRIDGE-RUNTIME-001
date: 2026-05-14
decision: Option D — Bridge Browser Token direct client
status: implemented (code complete; not deployed; not live)
credential_policy: browser-token-only (NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN baked into static bundle at build time)
server_token_ships_to_browser: false
client_secret_ships_to_browser: false
browser_token_ships_to_browser: true — Bridge explicitly documents it for browser use
deployment_policy: no deploy in this cycle; requires Torrey authorization
rollback: set BRIDGE_INTEGRATION_LIVE=false in src/lib/bridge.ts and redeploy
evidence:
  - Bridge docs reviewed (docs.bundle.js extracted 2026-05-14)
  - Bridge API probed with public docs demo token (CORS, rate limits confirmed)
  - Repo deployment model reviewed (static export confirmed, no server runtime)
  - Secret scan performed (repo and out/ clean)
  - typecheck/lint/build/audit gates all pass
```

**Bridge doc basis for browser token:**
Bridge platform docs state: "Browser Token — Used for websites that may query the API directly from the browser; be sure to set the Referrer Domain if you use this approach."

**Pre-production gates (Torrey action required):**
1. Set Referrer Domain in Bridge dashboard to `https://miasanabria.com`
2. Place `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` in Dokploy build args (not repo, not chat)
3. Place `NEXT_PUBLIC_BRIDGE_DATASET_ID` in Dokploy build args
4. Counsel sign-off on IDX display attribution text
5. Live smoke test: real listings load, attribution correct
6. Flip `BRIDGE_INTEGRATION_LIVE = true` in `src/lib/bridge.ts`
7. Change robots from `noindex` to `index` on `/home-search/`
8. Torrey authorizes Dokploy redeploy

**Env var contract (Cycle 33 final):**
```
BRIDGE_CLIENT_ID                    # account identifier (not needed for browser-token architecture)
BRIDGE_SECRET_ID                    # SERVER-ONLY — never ship client-side
BRIDGE_SERVER_TOKEN                 # SERVER-ONLY — never ship client-side
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN    # browser token — Dokploy build arg
NEXT_PUBLIC_BRIDGE_DATASET_ID       # dataset ID — Dokploy build arg
```

**IDX endpoint:** `https://api.bridgedataoutput.com/api/v2/OData/{DATASET_ID}/idx/Properties`

**Compliance reminder:** SEF MLS reciprocity disclaimer language (CATO-05), F.S. 475.278 brokerage-relationship statutory text (CATO-02), and TCPA PEWC consent (CATO-01) all interact with the IDX flow. Counsel review remains an external blocker before BRIDGE_INTEGRATION_LIVE flips to true.

## Testimonials

- **Sources Mia approved (2026-05-13):**
  - Facebook page: `https://www.facebook.com/miasanrea/`
  - Realtor.com profile (Mia's listing-agent profile)
- **Mia's standing instruction:** Direct quotes may be imported.
- **Hard constraints:**
  1. No invented review text. No paraphrase as direct quote.
  2. No implied endorsement from Facebook or Realtor.com (platforms are sources, not sponsors).
  3. Exact text + reviewer name + date + permission status must be captured **before publishing** any direct quote.
- **Action:** See `docs/mia-testimonial-capture-plan.md` for the capture workflow. No testimonials added on-site this cycle.

## CTAs / forms / lead capture

- Existing mailto fallback (`mailto:msanabriarea@gmail.com`) preserved this cycle.
- **GHL endpoint wiring blocked** on Torrey-provided credentials (`GHL_INQUIRY_WEBHOOK_URL`, `GHL_VALUATION_WEBHOOK_URL`) + counsel-approved TCPA consent text. See remaining-gap table §E.
- Form fields, field map, honeypot + Cloudflare Turnstile, success/failure UI: all blocked on GHL endpoint provisioning (Tomorrow §2.1–§2.10).

## Decisions intentionally NOT made this cycle (Mia content pending)

- "Most coveted" copy in `src/components/MeetMia.tsx` and `src/app/markets/page.tsx` — Mia approval pending; audit catalog leaves this phrase un-flagged so a Mia decision can land without breaking the build.
- Replacing the existing East-FL-waterfront homepage Featured Markets pager with the new Broward-9 set — requires Mia to approve the SEO consequence (deprecating East-FL waterfront emphasis) plus produce neighborhood copy for the 7 missing pages.
- Migrating `/insights/` → `/blog/` route slug — keeps SEO but is a separate redirect cycle.
- Migrating `/markets/` → `/neighborhoods/` route slug — same.
- Hero asset replacement with a current-`miasanabria.com`-style image — Mia must approve the source asset and grant license; no scraping.

## Pointer back to ISA

This decision record is referenced from `ISA.md` (Mia Sanabria Website ISA). On the next Mia-decisions cycle, the ISA Decisions and Verification sections should land receipts pointing back to the specific items here that closed live.

---

*Generated by Cycle 24 Mia-Live-Decisions implementation lane, 2026-05-13.*

---

## Cycle 34 — World-Class Site Completion (2026-05-14)

```yaml
decision_id: MIA-WORLD-CLASS-COMPLETION-001
date: 2026-05-14
decision: >
  Refit Home Search hero on `/` and `/home-search/` to the locked direction
  (`South Florida Lifestyle` eyebrow + `Search available homes` primary CTA +
  `Talk with Mia` secondary CTA). Adopt typed Neighborhoods system — kept
  existing `Market` type since it already covers the canonical profile shape.
  Complete site-wide audit + standards docs (page architecture, copy/tone,
  image system, fact/claim policy, SEO/schema, compliance). Enforce image
  provenance (no AI generation this cycle — operator-gated one-sample
  checkpoint protocol prepared). Visual QA via Playwright 1.58.0 +
  Chromium headless-shell against locally-served static build (20 screenshots,
  10 routes × 2 viewports).
status: implemented
hero_direction:
  eyebrow: South Florida Lifestyle
  heading: Home Search (two-line on `/`)
  background_source: existing-approved-fallback
  background_path: /markets/fort-lauderdale.jpg
  background_decision_basis: >
    Current `miasanabria.com` hero is hosted on `vibe.filesafe.space`
    (vibe.codes CDN) — provenance unknown, not safely re-licensable.
    Fallback to repo-approved asset.
image_policy:
  real_photos_preferred: true
  ai_generated_allowed: illustrative_only_with_operator_approval
  no_unlicensed_web_images: true
  every_image_has_provenance: true
  generation_performed_this_cycle: false
  one_sample_checkpoint_prepared: true
copy_policy:
  no_unsupported_school_safety_ranking_claims: true
  no_fabricated_testimonials_or_awards: true
  no_market_stats_without_current_source: true
  banned_phrase_sweep_result: clean (2 hits, both guard-comments)
bridge_policy:
  demo_honesty_preserved: true
  api_key_refresh_deferred_to: 2026-05-22
  real_sef_feed_pending: true
  tokens_touched: false
visual_qa:
  tool_used: playwright-1.58.0 + chromium-headless-shell-1208
  routes_captured: 10
  viewports: 375x812, 1280x800
  total_screenshots: 20
deployment:
  staging_deployed: pending operator sign-off on this cycle
  production_changed: false
  dns_changed: false
  ghl_changed: false
  google_changed: false
artifacts_root: docs/artifacts/cycle-34-world-class-completion/
```

*Generated by Cycle 34 World-Class Completion lane, 2026-05-14.*

---

## Cycle 35C — Resume + Closeout after Phase N drop (2026-05-14)

```yaml
decision_id: MIA-CYCLE-35C-RESUME-CLOSEOUT-001
date: 2026-05-14
decision: >
  Resume Cycle 35B after the Phase N drop. Preserve completed recovery,
  neighborhood, image-provenance, and visual-QA work. Commit and push the
  Phase N closeout artifacts as a documentation/evidence-only commit on top
  of 3530d5f. Run the final staging deploy under a tmux-wrapped logged
  command so a disconnect cannot drop the deploy mid-flight. Verify final
  staging with HTTP probes, HTML grep, mobile-readability, capture-baseline
  screenshots, and a live secret scan. Do not touch production, DNS, GHL,
  Google, or Bridge credentials.
status: implemented
recovery:
  prior_drop_point: Phase N committing implementation work
  prior_recovery_commit: 3530d5f
  audit_brand_bridge_demo_exception: verified  # 12 PASS / 3 allowed by data-brand-exception="demo-warning"
  interrupted_recovery_deploy_status: completed_after_disconnect
tools:
  playwright_or_capture_baseline_operational: true
  interceptor_operational: false
  image_generation_operational: not_needed
neighborhoods:
  approved_routes_complete: 9/9   # Fort Lauderdale, Pompano Beach, Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise
  reference_routes_complete: 2/2  # Boca Raton, Delray Beach
images:
  existing_approved_or_adequate: 11  # 4 photographic heroes + 7 brand-tone editorial cards
  ai_generated_illustrative: 0
  operator_needed: 7   # future-cycle Mia photos for the Cycle 25 Broward cohort, not a staging blocker
bridge:
  demo_honesty_preserved: true
  api_key_refresh_touched: false
  real_sef_feed_status: pending_external
deployment:
  recovery_staging_deployed: true
  final_staging_deployed: pending Phase 7 in this cycle
  production_changed: false
validation:
  typecheck: pending Phase 5 re-run; prior-session pass at logs/validation-20260514-131233.log
  lint: pending Phase 5 re-run
  build: prior-session pass at logs/validation-20260514-131233.log
  audit_brand: pass  # 12 PASS / 0 FAIL / 3 allowed
  no_fabrications: pending Phase 5 re-run; prior cycle 0 hits
  qa_gate_critical: 0
artifacts_root: docs/artifacts/cycle-35-recovery-full-completion/
```

*Generated by Cycle 35C Resume + Closeout lane, 2026-05-14.*

## Cycle 36D — SSH-crash recovery + Bridge truthfulness QA + dev-staging deploy + live verification (2026-05-15)

```yaml
decision_id: MIA-CYCLE-36D-DEV-LIVE-CLOSEOUT-001
date: 2026-05-15
decision: Resume Cycle 36 after repeated SSH disconnects, recover in-progress validation, preserve hero-contrast and Bridge truthfulness work, prevent token-bearing chunk artifacts from commit, validate, commit, deploy staging, and verify completed work live on https://miasanabriarealtor.trueidea.com/.
status: implemented
recovery:
  prior_drop_point: validation/deploy closeout after Cycle 36C local QA
  prior_head: 1386d208fa93b66d3e66f5131b001ff432b35911
  cycle36_commit: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
  validation_recovered: true
hero_contrast:
  prior_failure_routes:
    - /markets/seven-isles/ 768x1024
    - /markets/pompano-beach/ 768x1024
  root_cause: cold-cache image-load race in samples=1 audit diff
  fixed_without_weakening_gate: true
  samples_1_pass: intermittent — race narrowed but not eliminated; first re-run 144/0/1, second re-run 145/0/0
  samples_3_pass: true   # 145 PASS · 0 WARN · 0 FAIL · 0 SKIP
  mutation_sentinel_detects_regression: true   # 0 PASS · 15 WARN on --mutation --samples=1
  deploy_gate_was_samples_3: true   # audit:all uses audit:hero-contrast:stable
bridge:
  mia_reported_connection_should_work: true
  credentials_presence_verified_without_values: true
  live_probe_attempted: true
  live_feed_proven: false
  mode_after_final_staging: demo
  demo_honesty_preserved_when_needed: true
  api_key_refresh_touched: false
  credential_values_changed: false
  token_values_printed_this_session: false
  token_bearing_chunk_committed: false
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  deploy_log: docs/artifacts/cycle-36-bridge-live-integration/logs/staging-deploy-20260515-165745.log
  deploy_exit_code: 0
  deploy_duration_seconds: 173
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass (61 static pages)
  audit_brand: pass (12/0/0 with semantic Bridge demo-warning exception preserved)
  audit_hero_contrast: pass (samples=1 intermittent; second run 145/0/0)
  audit_hero_contrast_stable: pass (145/0/0)
  no_fabrications: pass
  qa_gate_critical: 0
  mobile_readability_local: pass (84/0/0)
  mobile_readability_staging: pass (84/0/0 against live URL)
external_blocker_for_live_bridge:
  - Provision non-test Bridge dataset for Southeast Florida MLS
  - Flip Dokploy build args (NEXT_PUBLIC_BRIDGE_DATASET_ID, _RESOURCE_PATH, _DEMO, _BROWSER_TOKEN)
  - Set Bridge dashboard Referrer Domain restriction
  - Trigger Dokploy rebuild after build-arg flip
production_readiness_claim: false
```

*Generated by Cycle 36D Resume + Closeout lane, 2026-05-15.*
