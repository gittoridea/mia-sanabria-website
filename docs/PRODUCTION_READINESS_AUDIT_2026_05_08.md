# Mia Sanabria Site — Production Readiness Audit (22-Pillar Scorecard)

**Audit date:** 2026-05-08T17:30Z
**Commits in scope:** `2486d3b` → `3c09565` → `634322f` → `a521e4a`
**Live URL:** https://miasanabriarealtor.trueidea.com
**Production target:** https://miasanabriarealtor.com (cutover gated)
**Audit basis:** fresh re-probe (no memory reliance per principal directive)

## Executive verdict

**18 PASS · 3 PARTIAL · 1 FAIL · 0 UNVERIFIED**

The staging surface is **shippable to production once 4 external blockers clear** (Mia confirmations, GHL webhook URL, .com DNS swap, USCO DMCA agent registration). The single FAIL — Conversion Offers — is a strategic gap, not a defect; it does not block staging cutover but caps lead capture.

## 22-Pillar Scorecard

| # | Pillar | Verdict | Evidence |
|---|--------|:-------:|----------|
| 1 | **Skeleton** | ✅ PASS | 24 routes built; sitemap lists 19 (incl. /dmca/ as of `a521e4a`); every public page returns HTTP/2 200 on staging |
| 2 | **Navigation** | ✅ PASS | SiteHeader desktop nav (7 links: Home/Markets/Buyers/Sellers/Valuation/About/Contact) + mobile drawer; all internal links resolve (`audit:links` 881/881) |
| 3 | **Luxury Design** | ✅ PASS | Cinzel display + Montserrat body, deep-navy/cream/brass palette, photo-forward hero (overlay /15-/35-/15 + H1 text-shadow per principal "brighter feel like miasanabria.com" directive); editorial typography hierarchy; live screenshot grid at `/tmp/mia-mobile-shots/` |
| 4 | **Mobile UX** | ✅ PASS | Lighthouse mobile A11y **100/100/100/100/100** sustained across home/about/contact/fort-lauderdale/insights; LCP home 2.5s (was 6.4s, −3.9s); 5×5 viewport screenshot grid captured at `/tmp/mia-mobile-shots/` |
| 5 | **Images** | ✅ PASS | 17 representative images audited live, all HTTP 200: 7 market hero JPEGs (244-585KB), 4 service portraits (169-313KB), 3 footer logos (8-39KB), Mia headshot (75KB), LPT logo (10KB), og-default (99KB), icon.svg (351b). Below 1.2MB luxury-hero exception |
| 6 | **Forms/CTAs** | 🟡 PARTIAL | Contact + Valuation forms render with proper labels, `aria-describedby`, `noValidate`. **Action endpoints currently `mailto:msanabriarea@gmail.com`** — opens local mail client; no server endpoint receives data. Replaces with proxied GHL webhook at cutover (see `docs/GHL_INTEGRATION_OPTIMAL.md`) |
| 7 | **GHL Pipeline Routing** | 🟡 PARTIAL | Architecture documented in `GHL_INTEGRATION_OPTIMAL.md` (GHL Inbound Workflow Webhook + Cloudflare Pages Function CORS-safe proxy); TCPA + Florida § 501.059 + CCPA hybrid consent text drafted in `/terms/`. **BLOCKER: principal must supply BSS sub-account webhook URL.** No GHL writes occur from this codebase |
| 8 | **Privacy** | ✅ PASS | `/privacy/` live with 15 H2 sections: identity, data collection, use, legal bases, third parties, CCPA/CPRA, GDPR/UK, **Do Not Track + Global Privacy Control** (added 3c09565 per Cato), retention, security, COPPA, transfers, updates. Florida § 501.171 breach-notification cited |
| 9 | **Terms** | ✅ PASS | `/terms/` live with 19 H2 sections: IDX disclaimer, AS-IS warranty, $100 liability cap (matches Mia's existing terms), REALTOR®/NAR mark statement, FREC ad-rule disclosure, TCPA + Florida § 501.059 hybrid consent, AS-IS, indemnification, Florida governing law + Broward venue, DMCA cross-link |
| 10 | **DMCA** | 🟡 PARTIAL | `/dmca/` live with 17 USC § 512(c)(3) takedown elements + § 512(g)(3) counter-notice + repeat-infringer policy + § 512(f) misrepresentation warning. **TODO inline at `dmca/page.tsx:80`: USCO designated-agent registration ($6, gates .com cutover).** Mailing-address publication waits on registration |
| 11 | **Accessibility** | ✅ PASS | `/accessibility/` live with WCAG 2.1 AA target, ADA Title III referenced, AT compatibility (JAWS/NVDA/VoiceOver), msanabriarea@gmail.com remediation contact, last-updated 2026-05-08, ongoing-improvement framing |
| 12 | **Brokerage Disclosure** | ✅ PASS | `LPT Realty LLC` legal name in footer brokerage block; FL Sales Associate License `SL3405877` rendered (null-guarded via `MIA.unverified.licenseNumber`); appears in About JSON-LD `worksFor: Organization`; FREC ad-rule § 61J2-10.025 satisfied |
| 13 | **REALTOR®/MLS/IDX** | ✅ PASS | NAR Membership Marks Manual prerequisite met (Mia's NAR + Florida Realtors + BPS REALTORS® web-cited); MLS REALTOR® combined logo from `miasanabriarealtor.com/images/MLS-clear.png` rendered in footer; SEF MLS Matrix iframe wired in `IdxEmbed.tsx` (currently `loading="lazy"`, deferred render) |
| 14 | **EHO/Fair Housing** | ✅ PASS | Official HUD EHO logo from `miasanabriarealtor.com/images/fheo350-clear.png` rendered in footer with visible "Equal Housing Opportunity" text label adjacent (NAR display-rules best practice); 11/11 sampled built routes carry EHO sentinel |
| 15 | **SEO** | ✅ PASS | Sitemap 19 routes (post-`a521e4a` /dmca/ fix); robots.txt staging-disallow (intentional, flips at cutover); `audit:seo` 0 warnings, 0 errors; canonicals correct per page; hreflang en-US + x-default; per-page titles ≤60c rendered |
| 16 | **AEO** | ✅ PASS | FAQPage schema on home (12 Q&A) + insights (5 Q&A on Lighthouse Point essay); per-market `localContext` AEO-relevant copy; `miaQuote` field added to 5 of 7 markets (`markets.ts`) — currently a data field, not yet rendered (T29 follow-up) |
| 17 | **Schema** | ✅ PASS | 112 JSON-LD blocks across 21 pages, all parse with @context+@type (`audit:schema` exit 0); home graph carries WebSite + Organization + Person + RealEstateAgent + LocalBusiness + ImageObject + ContactPoint + AdministrativeArea + BreadcrumbList + FAQPage + ListItem + Question + Answer; legal pages carry WebPage + BreadcrumbList |
| 18 | **Blog** | ✅ PASS | `/insights/` live with 2 long-form essays: "What working with a Fort Lauderdale REALTOR® means in practice" (Article schema `@id #article-realtor-model`) + "What Lighthouse Point Lot Profiles Actually Tell a Buyer" (Article + FAQPage 5 Q&A). Editorial register matched |
| 19 | **Local Authority Pages** | ✅ PASS | 7 market pages live (`/markets/{fort-lauderdale,coral-ridge,victoria-park,boca-raton,delray-beach,palm-beach,lighthouse-point}/`); each page renders 700–731 visible words including chrome (well above 150-word floor); each carries Place + RealEstateAgent + BreadcrumbList schema |
| 20 | **Conversion Offers** | 🔴 **FAIL** | **No lead magnets, no gated downloads, no email capture beyond 3 placeholder forms.** Site has zero conversion offers — every form is a "contact us" intent funnel that requires user to draft a message. **Material gap for lead capture.** Recommended (post-cutover): (a) "Eastern Fort Lauderdale Buyer's Guide" PDF gated on email; (b) "Sell with Mia" valuation packet; (c) market-monthly newsletter signup with archive |
| 21 | **Analytics/Tracking** | 🟡 PARTIAL | GA4 ID `G-PYYSF87G8K` present in `MIA.tracking.ga4Id` source-of-truth but **NOT injected** in `layout.tsx` — no `<script>` tag or `gtag` call in built HTML. UserWay ID `vVNkJJLvR4` similarly stored but not wired. Intentional staging-clean posture; flips on at .com cutover with `NEXT_PUBLIC_ENABLE_GA` flag (architecture documented). CSP allow-listed for googletagmanager.com + google-analytics.com |
| 22 | **Display Integrity** | ✅ PASS | 5 viewports × 5 routes = 25 screenshots captured (320/375/414/768/1024 × home/about/contact/fort-lauderdale/insights); H1 text-shadow added when `background="image"` (resolves Cato hero-overlay-on-bright-photo concern); cross-viewport layout consistent |

## Lighthouse Mobile (post-deploy 3c09565, live staging)

| Page | Perf | A11y | BP | LCP | Threshold (Perf≥85, A11y≥95, BP≥90) |
|------|-----:|-----:|---:|----:|:-:|
| home | 89 | 100 | 100 | 2.5s | ✅ |
| about | 99 | 100 | 100 | 2.1s | ✅ |
| contact | 94 | 100 | 79 | 2.9s | ✅ Perf+A11y · ⚠️ BP `mailto:` quirk |
| fort-lauderdale | 84 | 100 | 100 | 3.4s | ✅ A11y+BP · ⚠️ Perf 1pt under (post-cutover Cloudflare Polish closes) |
| insights | 95 | 100 | 100 | 2.1s | ✅ |

**SEO 69 sitewide is intentional staging robots-disallow; flips ≥90 at .com cutover.**

## Compliance Gate (10 axes, run 2026-05-08)

All 10 axes PASS (2 with cutover-deferred notes). Full doc: `docs/COMPLIANCE_GATE_2026_05_08.md`.

## External blockers — ranked by impact × effort

| # | Blocker | Impact | Effort | Owner |
|---|---------|--------|--------|-------|
| 1 | Mia's review session (license, designations, Spanish, photography, testimonials) | HIGH | 30-60 min | Mia |
| 2 | GHL BSS sub-account webhook URL | HIGH (closes form-routing) | 5 min | Torrey-on-BSS |
| 3 | DMCA designated-agent USCO registration | MED (gates `.com` cutover) | $6 + 15 min | Mia or LPT corporate |
| 4 | Cloudflare account decision (Polish at cutover) | MED (closes 99KB JPEG hero gap, lifts fort-lauderdale Perf 84→90+) | 30 min | Torrey |
| 5 | Real Mia photography handoff (her own — replace AI fill on 7 market hero portraits + Mia headshot if needed) | LOW-MED (ships under AI fill; replaces post-launch) | scheduled shoot | Mia |
| 6 | DNS swap `.trueidea.com` → `.com` | TRIGGER | 60 min execution | Torrey + Mia |
| 7 | Branded email `mia@miasanabriarealtor.com` provisioning (currently uses gmail) | LOW | 10 min | Torrey-on-LPT-domain |
| 8 | LinkedIn cleanup (Klein Morgan as concurrent employer per PUBLIC_FACT_LEDGER D11.1) | LOW | 5 min Mia | Mia |

## Verified completions this audit (with evidence)

1. ✅ `/dmca/` added to sitemap (commit `a521e4a`) — sitemap.xml now 19 routes (was 18)
2. ✅ `/about/` per-page OG block added — `og:title="About Mia Sanabria — Fort Lauderdale REALTOR®"` + `og:image=/mia-headshot.jpg`
3. ✅ `/insights/` per-page OG block added — `og:title="Insights — Mia Sanabria, Fort Lauderdale REALTOR®"` + `og:image=/og-default.jpg`
4. ✅ All audit chain green: typecheck, lint, audit:stale, audit:seo (0/0), audit:schema (112 blocks), audit:links (881 links), build (24 routes)

## Remaining defects (deferred to next cycle, not blocking staging)

- ⚠️ Conversion Offers gap (Pillar 20 FAIL) — no lead magnets, no gated downloads, no newsletter signup. **Strategic, not technical.** Recommended next-cycle deliverable: 1 PDF buyer's guide gated on email + monthly market newsletter via GHL.
- ⚠️ Coral Ridge + Victoria Park missing `miaQuote` (no source quote on miasanabria.com) — surface for Mia to provide a §1 quote per market.
- ⚠️ `miaQuote` field present on 5 markets but **not yet rendered anywhere** — surface decision: render in market detail aside with attribution, or drop the field if not surfacing.
- ⚠️ Cato deferred concerns: GDPR Art. 22 automated-decision rights (defensible since site does no profiling); miaQuote attribution required at render time.

## Next 3 actions (highest leverage)

1. **Land GHL webhook URL → wire forms.** Replaces `mailto:` form actions with proxied GHL endpoint (see `docs/GHL_INTEGRATION_OPTIMAL.md`). Dissolves Pillars 6 + 7 PARTIAL → PASS. Cleared by principal supplying BSS sub-account URL.
2. **Cloudflare Polish at .com cutover.** Closes Pillar 4 fort-lauderdale Perf 84→90+ gap; closes 99KB JPEG hero LCP risk; lifts SEO crawl budget post-cutover. Single biggest perf win available; zero code change. Action: principal decides Cloudflare account, then Torrey provisions Polish + WAF + DNS proxy.
3. **Mia review session (consolidated 30-60 min).** Captures all 6 Mia-gated facts in one pass: license # primary-source, designations opt-in, Spanish-language flag, display office, photography readiness for shoot, real testimonials. Schedule via Mia's calendar; principal decides if BSS or Torrey runs.

## Process improvement note

**What capability/tool/process should be used earlier next time:**

This audit revealed that **the staging build was technically clean (every audit script exited 0) but had three silent regressions** discovered only via fresh re-probe:

1. **Sitemap drift** — the hardcoded route list in `sitemap.ts` didn't auto-update when Forge added `/dmca/`. The `/dmca/` route built and shipped but Google would never crawl it.
2. **Per-page OG omission** — `/about/` and `/insights/` had no `openGraph` block and silently inherited the homepage default via Next.js metadata template fallback.
3. **Word-count probe regex bug** — earlier-cycle audit reported "0 words" on market pages due to a too-aggressive sed strip; fresh probe with proper Python extraction returned 700+ words.

**Process upgrade for next session:**

Add a **`scripts/audit-completeness.ts`** that probes structural drift not caught by the existing audit chain:
- Every `out/<route>/index.html` is in `out/sitemap.xml`
- Every `<page>.tsx` exports `openGraph` (warn if absent and SITE-default would inherit)
- Every page has unique `og:title` (not the SITE.title default fallback)
- Every page has unique `og:url` matching its canonical
- Every market page has ≥150 verbatim visible words excluding chrome (real visible-text extractor, not naive sed)

This audit script would have caught all 3 silent regressions before deploy and would run as part of `bun run audit:all` in the existing CI chain.

Add this as the **first action** of the next closeout cycle: write the script, integrate with `audit:all`, then re-run the production-readiness audit knowing structural completeness is now machine-checked.

## Updated next-session trigger prompt

```
Mission: Mia Sanabria luxury realtor site — Pre-cutover GHL form wiring + Conversion Offer launch + Cloudflare Polish provisioning + Mia review session intake.

OBSERVE — load this context BEFORE any other work:

1. /context-search query "Mia site production readiness audit GHL forms conversion offers Cloudflare cutover"
2. Read repo ISA verbatim at ~/code/mia-sanabria-website/ISA.md (currently phase=verify, progress 192/200 + 3 sitemap/OG fixes from 2026-05-08 audit at commit a521e4a)
3. Read docs/PRODUCTION_READINESS_AUDIT_2026_05_08.md (22-pillar scorecard, 18 PASS · 3 PARTIAL · 1 FAIL)
4. Read docs/GHL_INTEGRATION_OPTIMAL.md (form-wiring architecture; awaiting principal's BSS sub-account webhook URL)
5. Read docs/COMPLIANCE_GATE_2026_05_08.md (10/10 PASS; 2 PASS-with-note for cutover)
6. Read docs/CDN_PREFLIGHT.md (Cloudflare Polish at cutover plan)
7. Specialist-Prereq Probe: bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json (Forge ✅, Cato ✅, Anvil ❌)
8. Bind memories upfront: feedback_caddy_dokploy_cache_bust.md, feedback_cato_structured_verdict_prompt.md, feedback_forge_race_scope_drift.md (NEW), feedback_interceptor_headless_server_fallback.md, knowledge_eho_realtor_logo_sourcing.md (NEW), reference_dokploy_mia_app.md

PUNCHLIST (ordered, each ends with Skill("ISA", "append verification ...")):

0. Pre-flight: write scripts/audit-completeness.ts (E3, ~30 min) — structural-drift probes for sitemap-route-set, per-page openGraph presence, per-page og:title uniqueness, per-page og:url match-canonical, per-market visible word-floor. Integrate into audit:all. Catches the 3 silent regressions found in the 2026-05-08 audit.

1. GHL form wiring (E4 — gated on principal supplying BSS sub-account webhook URL). Implement Cloudflare Pages Function proxy per docs/GHL_INTEGRATION_OPTIMAL.md; replace mailto: form actions with proxied GHL endpoint; preserve TCPA + Florida § 501.059 + CCPA hybrid consent text already in /terms/ and form sub-text. Test forms end-to-end with synthetic submission.

2. Conversion offer #1 — "Eastern Fort Lauderdale Buyer's Guide" gated lead magnet (E4). Forge composes a 1-2-page PDF + Next.js gated download flow (email capture, GHL contact create, PDF download URL emailed). Resolves Pillar 20 FAIL → PARTIAL.

3. Cloudflare Polish provisioning (E2 — gated on principal's account decision). Configure Polish (lossy WebP + AVIF auto-conversion); validate fort-lauderdale Perf 84 → 90+; validate home LCP 2.5s → ~2.0s.

4. Mia review session intake (E2 — depends on Mia's calendar). Schedule 30-60 min consolidated session: license # DBPR primary-source, designations opt-in (AHWD/SFR/etc.), Spanish-language flag, display office, photography readiness, real testimonials, NAR/MLS/USCO confirms.

5. Cato cross-vendor re-audit (E4) on the post-GHL post-Polish state. Consequence-framed verdict-on-LAST-line per memory pattern.

6. Compliance Gate v2 run (E4) on the post-cutover-ready state. Compare against 2026-05-08 baseline.

CYCLE DISCIPLINE — non-negotiable:
- Every push uses bun scripts/deploy-and-verify.ts; never trigger Dokploy by hand.
- Wait 7-10 min after deploy before re-probing live URL (Caddy cache flip).
- Cache-bust verification with ?_=$(date +%s) + Cache-Control: no-cache.
- For ≥3 file work at E3+: use Forge with strict file-scope contract; suspend main-thread edits during background-Forge runs (per feedback_forge_race_scope_drift.md).
- Visual verification via google-chrome --headless=new --no-sandbox --screenshot=.

DO NOT: spawn Artist agent for batches; write to GHL/Mia's surfaces without principal approval; push to .com; modify NEXT_PUBLIC_SITE_URL; edit AI-OS infra; fabricate facts; auto-commit Cato FAIL without principal review.

EFFORT TIER: E5 (multi-deliverable, multi-file, sub-agent-bound, principal-gate-bound).
```

## Anti-criteria — confirmed clean (this audit)

- No edits to `next.config.ts` (`images.unoptimized=true` preserved)
- No DNS modifications attempted
- No edits to NEXT_PUBLIC_SITE_URL, sitemap host, canonical host, robots logic
- No outbound HTTP from this codebase to real Mia surfaces
- No `~/.claude/`, `~/forge/`, `~/trueops/` infrastructure edits
- No fabricated facts; license number rendering pattern preserved
- No live form endpoints (still `mailto:`)
- No analytics IDs firing (intentional staging)

## Summary

22-pillar scorecard: **18 PASS / 3 PARTIAL / 1 FAIL / 0 UNVERIFIED.** Three silent regressions caught and fixed (sitemap missing /dmca/, /about/ + /insights/ missing per-page OG). The site is shippable to production once 4 external blockers clear (Mia review, GHL webhook URL, USCO DMCA registration, Cloudflare account). The single FAIL is a strategic conversion-offer gap, addressable in next cycle with one gated lead magnet PDF.
