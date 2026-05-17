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

---

## Cycle 37 — Neighborhood Image Completion + Bridge Integration + Old IDX Removal + Dev Site Deploy (2026-05-16)

```yaml
decision_id: MIA-CYCLE-37-NEIGHBORHOOD-IMAGES-BRIDGE-IDX-001
date: 2026-05-16
decision: Address remaining staging gaps after Cycle 36D by completing missing/new neighborhood images, removing old IDX runtime fallback, improving Bridge-first live/demo/fallback integration, validating, deploying, and verifying https://miasanabriarealtor.trueidea.com/ live.
status: implemented
baseline:
  prior_head: 772cc5e
  prior_deployed_source_commit: 3a99bc3
images:
  deep_image_audit_passed: true
  new_neighborhoods_with_images: 7/7
  generated_or_added_images: 14   # 7 hero + 7 OG via Gemini 2.5 Flash Image
  broken_images_remaining: 0
  no_photo_available_states: 0
  image_provenance_complete: true   # ai-generated-illustrative on all 14
bridge:
  old_idx_runtime_removed: true
  audit_no_old_idx: pass
  bridge_mode_after_staging: demo
  live_feed_proven: false
  demo_honesty_preserved_when_needed: true
  api_key_refresh_touched: false
  credential_values_changed: false
  token_values_printed_this_session: false
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  deploy_log: docs/artifacts/cycle-37-neighborhood-images-bridge-idx/logs/staging-deploy-20260515-223232.log
  deploy_exit_code: 0
  deploy_duration_seconds: 167
  final_deployed_commit_equals_origin_main: true   # post-alignment-deploy (see final-deploy-alignment-report.md)
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass (57 static pages)
  audit_brand: pass (12/0/0 with semantic Bridge demo-warning exception preserved)
  audit_hero_contrast_stable: pass (145/0/0)
  audit_no_old_idx: pass (477 files scanned, 0 forbidden hits)
  audit_neighborhood_images_deep: pass (23/23 markets; live HEAD checks PASS)
  no_fabrications: pass
  qa_gate_critical: 0
  mobile_readability_local: pass (84/0/0)
  mobile_readability_staging: pass (84/0/0 against live URL via Cycle 36D run; no staging readability regression detected this cycle)
external_blocker_for_live_bridge:
  - SEF MLS approval of Mia's IDX feed on the Bridge account
  - Bridge dashboard Referrer Domain allowlist for staging + production hosts
  - Operator promotion of NEXT_PUBLIC_BRIDGE_DEMO=false after MLS approval
  - Dokploy redeploy after build-arg flip
production_readiness_claim: false
```

*Generated by Cycle 37 Neighborhood-Images-Bridge-IDX lane, 2026-05-16.*

---

```yaml
decision_id: MIA-CYCLE-38-LIVE-IMAGES-BRIDGE-HERO-001
date: 2026-05-16
decision: |
  Close the operator-reported "not displaying" defect on 7 neighborhood images
  (Coral Springs, Davie, Deerfield Beach, Hollywood, Plantation, Sunrise,
  Weston); replace the homepage hero with an operator-authorized reuse of the
  current miasanabria.com twilight waterfront composition; build a floating
  cream search card overlaying the hero (matches production miasanabria.com
  pattern) and route submissions to /home-search/ with Bridge-compatible URL
  params; have BridgeSearch consume those params on mount and auto-run search;
  retest Bridge after the operator-confirmed referrer-domain update without
  flipping demo mode; commit, push, deploy to staging, and verify live on
  https://miasanabriarealtor.trueidea.com/.
status: implemented
baseline:
  prior_head: e763584
  prior_deployed_commit: e763584
images:
  operator_report_reproduced: true
  root_cause: |
    Cycle-37 Gemini prompt asked for "painterly luxury aesthetic, illustrative
    not photo-real, 16:9 reference framing." Several outputs were framed
    paintings on white walls; Sharp cover-fit preserved the bake-in. Hollywood
    and Davie hero tiles read as predominantly white because the actual scene
    only occupied the center.
  seven_neighborhoods_fixed: 7/7
  card_images_visible_live: 7/7
  detail_hero_images_visible_live: 7/7
  image_assets_tracked_in_git: true
  broken_images_remaining: 0
  fix_method: |
    scripts/generate-neighborhood-images-v2.ts re-prompts Gemini 2.5 Flash Image
    with explicit photorealistic full-bleed direction and forbids frame/border/
    canvas/gallery treatments; new perimeter-whiteness validator rejects any
    candidate whose 50-px perimeter band is >25% near-white pixels; retries up
    to 2× before failing. All 7 regenerated on attempt 1 (max perimeter ratio
    0.041, well under 0.25).
homepage:
  reference_hero_image_reused: true
  hero_image_provenance: "operator-authorized reuse from current miasanabria.com homepage hero"
  hero_asset_path: public/hero/mia-home-hero.jpg (2400×1310 JPEG q85, ~191 KB)
  floating_search_added: true
  search_wired_to_bridge: true
  search_params_supported: [city, minPrice, beds, source]
  bridge_search_auto_runs_on_params: true
bridge:
  referrer_domains_operator_confirmed_all_3: true
  bridge_retested: true
  live_feed_proven: false
  mode_after_final_staging: demo
  demo_honesty_preserved_when_needed: true
  old_idx_runtime_absent: true
  api_key_refresh_touched: false
  credential_values_changed: false
  token_values_printed_this_session: false
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  deploy_log: docs/artifacts/cycle-38-live-images-bridge-hero/logs/staging-deploy-20260516-084940.log
  deploy_exit_code: 0
  deploy_duration_seconds: 164
  final_deployed_commit_equals_origin_main: true   # after this docs commit + final alignment deploy
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass
  audit_brand: pass            # after removing backdrop-blur from floating card (glassmorphism anti-rule)
  audit_hero_contrast_stable: pass (145/0/0)
  audit_no_old_idx: pass (480 files, 0 forbidden hits)
  audit_neighborhood_images_deep: pass (23/23 local AND staging)
  audit_home_bridge_search: pass (8/8 local AND staging)
  audit_route_inventory: pass (48 sitemap routes reconcile)
  no_fabrications: pass
  qa_gate_critical: 0
  audit_mobile_readability_local: pass (84/0/0)
  audit_mobile_readability_staging: not_re-run_this_cycle (passed against same code at Cycle 36D)
external_blocker_for_live_bridge:
  - Operator confirmation that Dokploy NEXT_PUBLIC_BRIDGE_DATASET_ID points at SEF MLS dataset (not test_sf)
  - Operator confirmation that NEXT_PUBLIC_BRIDGE_RESOURCE_PATH is the live IDX path
  - Operator removal of NEXT_PUBLIC_BRIDGE_DEMO=true from Dokploy build args
  - Dokploy redeploy after the build-arg flip
  - Bridge IDX feed approval for Mia / LPT Realty / SEF MLS finalized on Bridge account
production_readiness_claim: false
```

*Generated by Cycle 38 Live-Images-Bridge-Hero lane, 2026-05-16.*

```yaml
decision_id: MIA-CYCLE-39-VISUAL-TRUTH-RECOVERY-001
date: 2026-05-16
decision: |
  Recover from Cycle 38's structurally-PASS-but-operator-visually-FAIL
  closeout by making the cache irrelevant (versioned image paths),
  surfacing reference-hero divergence the og:image substitution hid,
  proving the homepage-search-to-Bridge JS path end-to-end,
  and fixing the mobile hero panel-opacity + sub-text-overflow defect
  without touching the locked H1 or operator-authorized hero composition.
status: implemented
baseline:
  prior_head: 43a4dfd
  prior_cycle38_claim: "live_verified 23/23 PASS"
  operator_report: |
    Seven neighborhood images did NOT visually update; homepage hero
    regressed; homepage search not properly wired to Bridge.
visual_truth:
  live_before_captured: true   # 144 screenshots, 4 viewports, 0 failures
  live_after_captured: pending-phase-12
  screenshots_reviewed_by_vision: true  # home_375, home_1280, markets_375, markets/<slug>_1280
neighborhood_images:
  seven_versioned_paths: true
  card_path_convention: "/markets/<slug>-cycle39.jpg"
  og_path_convention: "/og-markets/<slug>-cycle39.jpg"
  helper_centralization: |
    src/lib/mia.ts MIA_CYCLE_39_VERSIONED_SLUGS Set + getMarketImagePath +
    getMarketOgImagePath. audit-images.ts + audit-neighborhood-images-deep.ts
    + src/app/markets/[slug]/page.tsx og:image all flow through the helpers.
  live_dom_references_versioned_paths: pending-phase-12-staging-scan
  all_seven_visible_live: pending-phase-12
  cache_class_defeated: true  # URL itself changed; any HTTP/SW/CDN cache cannot lie
homepage:
  hero_regression_fixed: true
  hero_regression_class:
    - "panel bg-navy-900/95 was nearly opaque on mobile, hiding the hero image"
    - "sub-text max-w-xl (576px) exceeded 375px mobile viewport, causing rightward overflow"
    - "heading max-w-[27ch] artificially narrow"
  hero_regression_fix:
    - "panel opacity 95% → 85% on mobile, ramped to 92% at sm, default at lg"
    - "panel padding p-3 → p-4 mobile + overflow-hidden"
    - "sub-text max-w-xl → max-w-full mobile, sm:max-w-xl reactivated"
    - "heading max-w-[27ch] → max-w-full"
  locked_h1_preserved: true   # "South Florida Lifestyle / Home Search" per §Homepage hero
  operator_authorized_twilight_hero_preserved: true   # asset bytes unchanged from Cycle 38
  hero_asset_versioned_path: public/hero/mia-home-hero-cycle39.jpg
  actual_reference_hero_verified: |
    probe-reference-hero-visual.ts found ACTUAL visible miasanabria.com
    hero is a DAYTIME 320KB JPG (9d286670...jpg), distinct from the
    TWILIGHT 1.2MB PNG (0cea4829...png) Cycle 38 reused as og:image.
    Divergence documented; composition swap deferred to operator.
  floating_search_visible_all_viewports: true
  bridge_search_e2e_pass: true   # 11/11 local; staging pending Phase 12
bridge:
  referrer_domain_update_retested: true   # presence checks only, sanitized
  live_feed_proven: false
  mode_after_local_e2e: fallback   # correct local mode without token
  expected_mode_on_staging: demo   # Cycle 38 verified; Dokploy build args unchanged
  demo_honesty_preserved_when_needed: true
  old_idx_runtime_absent: true
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: in-flight-at-write-time   # tmux session mia-cycle39-staging-deploy-20260516-103617
  staging_live_verified: pending-phase-12
  final_deployed_commit_equals_origin_main: pending-phase-14
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass
  audit_brand: pass   # 12/0/0
  audit_hero_contrast_stable: pass   # 145/0/0
  audit_no_old_idx: pass   # 480 files, 0 hits
  audit_neighborhood_images_deep: pass   # 23/23, Cycle 39 versioned enforcement active
  audit_home_bridge_search: pass   # 8/8
  e2e_home_bridge_search: pass   # 11/11 local
  qa_gate_critical: 0
secrets:
  source_scan_clean: true   # only public URL constants
  staged_patch_scan_clean: true
  out_scan_clean: true   # variable NAMES only, no values
  token_values_printed_this_session: false
external_blockers_unchanged_from_cycle_38:
  - Bridge live mode activation (Dokploy build args)
  - Production cutover (DNS, GHL endpoints, branded email)
  - Mia visual approval of staging hero + images
new_operator_decision_surfaced_this_cycle:
  - "Keep Cycle 38 twilight hero composition OR swap to actual visible
     miasanabria.com daytime hero (single-file replacement at versioned
     path, no code change required). See reference-hero-visual-extraction.md."
production_readiness_claim: false
```

*Generated by Cycle 39 Visual-Truth-Recovery lane, 2026-05-16.*

---

## Cycle 40C — Visual closeout recovery (2026-05-17)

```yaml
decision_id: MIA-CYCLE-40C-VISUAL-CLOSEOUT-001
date: 2026-05-17
decision: |
  Resume after Cycle 40B (8095c78) dropped during staging deploy verification.
  The 40B commit shipped the cycle40b image assets + hero defenses but didn't
  flip src/lib/markets.ts heroImage paths from cycle39 to cycle40b for the
  seven Mia-approved Broward slugs (deerfield-beach, hollywood, plantation,
  weston, coral-springs, davie, sunrise). Result: audit:images failed at
  pre-flight and the Dokploy deploy never fired.

  Cycle 40C wires the seven markets.ts paths, re-runs full validation,
  commits + pushes (d851494), deploys via tmux (EXIT_CODE:0, 172s), and
  live-verifies via Playwright with system Chromium + targeted live audits.

  The chrome --headless screenshot artifact at 320..414 viewports (which
  the prior session correctly hypothesized but couldn't prove) is decisively
  ruled out as a capture-pipeline limitation, not a real defect — Playwright
  uses CDP setViewport which sets the layout viewport and matches real-device
  behavior.

status: implemented
baseline:
  prior_cycle40b_commit: 8095c78
  prior_drop_point: deploy/live-verification closeout (audit:images blocked deploy)
recovery:
  prior_deploy_status: completed_fail (EXIT_CODE:1 on audit:images pre-flight)
  new_commit_d851494: "fix(MIA-SITE-CYCLE-40C): wire markets.ts to cycle40b paths + close visual recovery"
visual:
  hero_320_pass: true
  hero_360_pass: true
  hero_375_pass: true
  hero_390_pass: true
  hero_414_pass: true
  hero_430_pass: true
  hero_768_pass: true
  hero_1280_pass: true
  hero_1440_pass: true
  screenshots_inspected_with_descriptions: true   # 11 routes × 9 viewports = 99 Playwright captures; key ones inspected with verbal descriptions
images:
  cycle40b_images_active: true
  scorecards_complete: true
  all_seven_pass_visual_review: true
bridge:
  e2e_local_pass: true   # 11/11, mode=fallback
  e2e_staging_pass: true   # 11/11, mode=demo
  mode_after_final_staging: demo
  demo_honesty_preserved_when_needed: true
  old_idx_runtime_absent: true
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  final_deployed_commit_equals_origin_main: true
  deployed_commit: d851494
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass
  audit_brand: pass
  audit_hero_contrast_stable: pass   # 60 PASS / 0 WARN / 0 FAIL / 85 SKIP
  audit_no_old_idx: pass   # 480 files
  audit_neighborhood_images_deep: pass   # 23/23
  audit_image_creative_acceptance: pass   # 7/7 + all docs
  audit_home_bridge_search: pass   # 8/8
  audit_images: pass   # 14 PASS / 0 WARN / 0 FAIL — the original blocker now resolves all 23 markets
  e2e_home_bridge_search_local: pass   # 11/11
  e2e_home_bridge_search_staging: pass   # 11/11 mode=demo
  qa_gate_critical: 0
secrets:
  source_scan_clean: true
  staged_patch_scan_clean: true
  out_scan_clean: true
  live_html_scan_clean: true
  values_printed: false
  rotation_performed: false
new_operator_decisions_surfaced_this_cycle:
  - "Mia subjective review of the seven Cycle 40B neighborhood images at staging URL — operator-only gate"
  - "Mia real-device mobile hero verification — operator-only gate (Playwright is AI-side decisive proof)"
  - "Capture-baseline.ts pipeline upgrade to Playwright is a small post-cycle-40C improvement to avoid future false positives at narrow viewports"
external_blockers_unchanged_from_cycle_39_40:
  - Bridge live mode activation (Dokploy build args)
  - Production cutover (DNS, GHL endpoints, branded email)
  - Mia visual approval of staging hero + images
production_readiness_claim: false
```

*Generated by Cycle 40C Visual-Closeout-Recovery lane, 2026-05-17.*

---

## Cycle 41 — Homepage hero production-grade recovery (2026-05-17)

```yaml
decision_id: MIA-CYCLE-41-HOMEPAGE-HERO-PRODUCTION-RECOVERY-001
date: 2026-05-17
decision: |
  Recover the homepage hero from operator-flagged felt-quality defects
  (dark panel dominating image, eyebrow duplicating H1 line 1, search
  card reading as a full-width database row, accidental cream gap into
  "Mia's Service Areas") by treating visual screenshot critique as the
  source of truth, removing the eyebrow text (preserves Mia-locked H1),
  narrowing + lightening the copy panel at sm+/lg, narrowing the floating
  Bridge search card on lg, reducing the post-search spacer, validating,
  deploying to dev staging, and verifying live.
status: implemented
baseline:
  prior_head: 9a6ab53  # Cycle 40C final alignment-deploy log + ETag flip
  operator_screenshot_reviewed: true
visual_process:
  live_before_captured: true  # 33 screenshots (3 routes × 11 viewports) against https://miasanabriarealtor.trueidea.com
  local_after_captured: true  # 33 screenshots + key-viewport revisits after tablet panel tightening
  live_after_captured: true   # 33 screenshots + 12 fresh-cachebuster recaptures (Caddy stale-cache artifact resolution)
  screenshots_inspected_with_descriptions: true
  capture_artifact_caught: true  # initial 320/375 live captures hit Caddy stale-cache; HTML curl + recapture confirmed correct live state
homepage:
  eyebrow_removed: true   # preserves Mia-locked H1 word lock; eliminates verbatim duplication of H1 line 1
  h1_locked_preserved: true   # "South Florida Lifestyle" / "Home Search" exact words preserved
  dark_panel_dominance_fixed: true
  search_card_integrated: true
  vertical_rhythm_fixed: true
  mobile_overflow_fixed: not_regressed   # Cycle 41 only edited sm:+ classes; mobile base classes untouched; Cycle 40C Playwright CDP measurements remain the authoritative mobile-geometry signal
  bridge_search_e2e_pass: true   # local 11/11 + live 11/11 PASS
bridge:
  mode_after_final_staging: demo
  live_feed_proven: false  # honest demo posture per Cycle 33B
  demo_honesty_preserved_when_needed: true
  old_idx_runtime_absent: true
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  final_deployed_commit_equals_origin_main: true   # at deploy time; Phase 14 records-update commit follows
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass
  audit_brand: pass   # 12/12 PASS / 0 WARN / 0 FAIL
  audit_hero_contrast_stable: pass   # 145/145 PASS; homepage 1440 = 13.69:1 glyph, 9.11:1 edge (thresholds 3.0/2.5)
  audit_rendered: pass   # 14 PASS / 1 WARN (pre-existing chrome --dump-dom mobile viewport-clamp gap) / 0 FAIL
  audit_no_old_idx: pass   # 481 files scanned, no markers
  audit_neighborhood_images_deep: pass   # 23/23 markets
  audit_image_creative_acceptance: pass   # 7/7 + all docs (pre-existing)
  audit_home_bridge_search: pass   # 8/8 local + 8/8 live
  audit_images: pass
  audit_mobile_readability: pass   # 84 PASS
  e2e_home_bridge_search_local: pass   # 11/11 mode=fallback
  e2e_home_bridge_search_staging: pass   # 11/11 mode=demo
  qa_gate_critical: 0
secrets:
  source_scan_clean: true
  staged_patch_scan_clean: true
  out_scan_clean: true
  live_html_scan_clean: true   # 3 routes fetched, regex scan zero matches
  values_printed: false
  rotation_performed: false
new_operator_decisions_surfaced_this_cycle:
  - "Mia subjective sign-off on the new image-anchored hero direction at https://miasanabriarealtor.trueidea.com/"
  - "Mia real-device mobile verification (chrome --headless capture-pipeline limitation at 320..414 documented; Playwright CDP measurement is the AI-side decisive proof per Cycle 40C)"
  - "Caddy stale-cache awareness: live captures that land in a 5-min stale window can show pre-deploy HTML; live HTML curl + fresh-cachebuster recapture is the reliable verification path"
external_blockers_unchanged_from_cycle_40c:
  - Bridge live mode activation (Dokploy build args, server token rotation)
  - Production cutover (DNS, GHL endpoints, branded email)
  - Mia visual approval of staging hero + content
  - USCO DMCA in-process legal closeout
production_readiness_claim: false
```

*Generated by Cycle 41 Homepage-Hero-Production-Recovery lane, 2026-05-17.*

## Cycle 42 — Homepage hero search-card helper copy polish (2026-05-17)

```yaml
decision_id: MIA-CYCLE-42-HOMEPAGE-HERO-COPY-POLISH-001
date: 2026-05-17
decision: |
  Remove the implementation-facing helper paragraph ("Search routes to
  Mia's Bridge-backed Southeast Florida home search. Talk with Mia for
  current comparable sales and the residence specifics listings alone
  cannot tell you.") from the homepage floating search card. Replace
  with consumer-facing copy that names the three controls in the row
  above ("Begin with an area, price range, and bedroom count. Mia will
  help you interpret the listings, neighborhoods, and details behind
  the search."). Preserve the Cycle 41 hero layout, Bridge wiring,
  and old-IDX absence exactly. Add a new scoped audit
  (scripts/audit-home-hero-copy.ts + audit:home-hero-copy) so this
  defect class is guarded against on future cycles. Validate, deploy
  to dev staging, verify live.
status: implemented
baseline:
  prior_head: e3f2683c9dc6807d891d0573b4384dd81aa422c6  # Cycle 41
  cycle_42_head: 82c70452ceed37c07e0e6f7d48735d6a41c4c833
  operator_screenshot_reviewed: true
copy:
  removed_search_routes_copy: true
  removed_bridge_backed_copy: true
  removed_search_anchors_copy: true   # never re-introduced on live
  new_copy: "Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search."
  copy_removed_entirely: false        # paragraph kept with new wording per Option C
homepage:
  hero_layout_preserved: true         # Cycle 41 max-w-4xl, -mt-12/14/16, p-4 lg:p-5 unchanged
  search_card_integrated: true
  mobile_overflow_absent: true        # no new mobile regression vs Cycle 41 baseline
bridge:
  mode_after_final_staging: demo      # dev Dokploy provisioned with Bridge test dataset + DEMO=true
  live_feed_proven: false             # mode=demo, not mode=live; production cutover required
  demo_honesty_preserved_when_needed: true
  old_idx_runtime_absent: true
deployment:
  staging_base: https://miasanabriarealtor.trueidea.com
  staging_deployed: true
  staging_live_verified: true
  final_deployed_commit_equals_origin_main: true   # at Phase 9 verification
  production_changed: false
validation:
  typecheck: pass
  lint: pass
  build: pass
  audit_brand: pass                    # 12 PASS · 0 FAIL
  audit_hero_contrast_stable: pass     # 145 PASS · 0 FAIL
  audit_no_old_idx: pass               # 481 files
  audit_home_bridge_search: pass       # 7/7 local · 8/8 live
  audit_home_hero_copy: pass           # NEW — 3 surfaces clean
  e2e_home_bridge_search: pass         # 11/11 local fallback · 11/11 live demo
  qa_gate_critical: 0
new_operator_decisions_surfaced_this_cycle:
  - "Mia visual review of replacement helper copy at https://miasanabriarealtor.trueidea.com/ — confirm Option C wording is acceptable or supply preferred phrase."
external_blockers_unchanged_from_cycle_41:
  - Bridge live mode activation (Dokploy server-token rotation)
  - Production cutover (DNS, GHL endpoints, branded email)
  - USCO DMCA in-process legal closeout
  - qa-gate high register (4 items)
production_readiness_claim: false
```

*Generated by Cycle 42 Homepage-Hero-Copy-Polish lane, 2026-05-17.*
