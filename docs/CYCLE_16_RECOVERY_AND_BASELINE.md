# Cycle 16 — Recovery and Baseline

**Date:** 2026-05-10
**Effort:** E5 / Algorithm v6.4.0
**Cycle objective:** Refine site from "strong production surface" into polished, coherent luxury real estate experience.

## Git state

- **Branch:** main
- **HEAD:** `b1ebe8e` — `docs(MIA-SITE-CYCLE-15): closeout — Cato concerns→clean + Forge VERIFY pass + LIVE deploy verified + handoff + next-trigger + skill v0.4.0`
- **Working tree:** clean (no unstaged changes)
- **Remote sync:** in sync with `origin/main` (`b1ebe8e`)
- **Recent commits:**
  - `b1ebe8e` — Cycle 15 closeout
  - `82046b2` — Cycle 15 Cato compliance findings + Forge VERIFY docs
  - `872ac5c` — Cycle 15 insights library + lead capture + sitewide weaving
  - `54c9aea` — Cycle 14 closeout
  - `ca02263` — Cycle 14 market system integrity + featured page excellence

Cycle 15 is cleanly closed and pushed.

## Live state

- **URL:** https://miasanabriarealtor.trueidea.com/
- **HTTP:** 200 OK
- **ETag:** `dif86vkf7ke838d4`
- **Last-Modified:** `Sun, 10 May 2026 18:58:29 GMT`
- **Content-Length:** 150,808 bytes

## Local build state

- **TypeScript:** `bun run typecheck` → exit 0 (background)
- **audit:all:** exit 0 net of port-conflict hero-contrast (4173 EADDRINUSE from leftover Chrome — killed; rerun green)
- **audit:images:** 14 PASS / 0 WARN / 0 FAIL
- **audit:brand-consistency:** 12 PASS / 0 WARN / 0 FAIL
- **audit:completeness:** 15 PASS / 1 WARN / 0 FAIL (`forms.classification`: 2 mailto, 0 live-ghl — expected per lead-capture architecture, BLOCKED BY GHL)
- **Sitemap:** 39 built · 39 in sitemap · 0 missing
- **JSON-LD:** 159 blocks across 27 pages · 0 broken
- **Markets:** 15 total · 8 currently featured
- **Insights:** 12 posts · all `datePublished` = `2026-05-10` (honest deployment date)
- **OG images:** all 45 og:image entries resolve · /og-insights/ directory does not yet exist (per-post images not generated; all posts currently use `/og-default.jpg`)

## Data-model inventory

### `ALL_MARKET_SLUGS` (15)

`fort-lauderdale, coral-ridge, victoria-park, boca-raton, palm-beach, delray-beach, lighthouse-point, rio-vista, harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes, hillsboro-mile, bay-colony, bermuda-riviera`

### `FEATURED_MARKETS` (current — 8)

`fort-lauderdale, las-olas-isles, harbor-beach, victoria-park, boca-raton, delray-beach, bay-colony, bermuda-riviera`

### Principal's requested first-page Featured order (6)

`fort-lauderdale, boca-raton, palm-beach, victoria-park, lighthouse-point, delray-beach`

**Gap:** `palm-beach` and `lighthouse-point` are NOT in current `FEATURED_MARKETS`. Cycle 16 will:

- Introduce an explicit `HOMEPAGE_FEATURED_ORDER` constant (6 slugs, ordered per principal direction).
- Expand `FEATURED_MARKETS` to include `palm-beach`, `lighthouse-point` (and `coral-ridge`, `rio-vista`, `seven-isles` for page 2 candidates) — driven by principal's request.

### Insights library (12 posts, all dated 2026-05-10)

Posts 01-12 each tagged with `topicMonth` (editorial label) and `marketCycleMonth` (1-12). Currently the visible date on the index is the editorial-month label, not the publication date — but the `<time datetime="2026-05-10">` element and schema `datePublished` are both raw deploy-date. Cycle 16 will keep `datePublished` honest and add `editorialDate` / `editorialMonthLabel` / `dateDisplayMode` discipline.

## Legal page state (pre-audit)

- **/privacy/** — substantial (16 sections, GA4 + GHL + Cloudflare + Userway disclosed, FL/CA/GDPR rights, GPC honored)
- **/terms/** — substantial (17 sections, IDX/MLS disclaimer, REALTOR® mark definition, TCPA notice, FL governing law/venue)
- **/accessibility/** — substantial (WCAG 2.1 AA target, JAWS/NVDA/VoiceOver, contact escalation)
- **/dmca/** — substantial **but** DMCA designated agent is explicitly "in the process of registering" with U.S. Copyright Office. Mailing-address publication is pending. This is a **REVIEW** classification, not a failure.

All four routes are in `FOOTER_NAV.legal` and rendered in sitemap.

## About page state (pre-audit)

Renders three unverified claims that need Cycle 16 audit:
1. "deliberately small client list each quarter" — appears twice (AnswerFirst + body). Cycle 15 explicitly flagged this for review per `Cycle 15 residuals`. Unverified by principal — needs softening or removal.
2. "Mia is most deeply versed in Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge" — phrased as personal expertise statement; if unsupported by Mia's public profile, soften.
3. Credentials block emits Title/Brokerage/Practicing-since/Service-area; `experience.since` is null so the entire field is omitted (good); License # field renders only when `MIA.unverified.licenseNumber` set — currently `SL3405877` cited from LPT/MLS/Klein Morgan legacy pages (still flagged unverified until DBPR primary-source confirmation).

## Footer trust-logo state (pre-audit)

Footer renders 3 trust marks (LPT, REALTOR®, EHO) with `brightness-0 invert opacity-90` filter applied for monochrome consistency on navy footer. Cycle 11 chose this monochrome treatment intentionally. Principal observation: "footer REALTOR® and Equal Housing Opportunity logos still do not look fixed" — Cycle 16 must reproduce visually with screenshots BEFORE deciding what looks fixed.

Asset inventory:
- `public/logos/lpt-realty.png` (40×40 source)
- `public/logos/realtor-r.png` (64×30 source — note: filename says "realtor-r" but Cycle 14 OFFICIAL_GRAPHICS_REVIEW reported this is the REALTOR® R-mark, not REALTOR®+MLS combined; verify rendering against original NAR canonical source URL `https://www.nar.realtor/logos-and-trademark-rules/realtor-trademark-rules` before claiming a fix)
- `public/logos/equal-housing.png` (36×40 source)

## Open Cycle 15 residuals carried forward

1. **Forge nice-to-haves (8 items)** — captured in `docs/CYCLE_15_GPT55_PREDEPLOY_REVIEW.md`. Cycle 16 will address items overlap with new mission (per-post OG images, audit:insights tightening, content standard divergence resolution).
2. **Cato 7th finding — all 12 posts same date** — Cycle 16's date governance addresses this directly.
3. **Country-club name verification (Post 8)** — manual confirmation needed; deferred to principal-decision cycle.
4. **forms.classification WARN** — expected per lead-capture architecture; flips to PASS only when Cycle 17 wires GHL.

## External blockers (untouched by Cycle 16)

Same 9 blockers from Cycle 12 production-readiness scorecard:

- BLOCKED BY PRINCIPAL: license #, DNS cutover, branded email, analytics provider
- BLOCKED BY LEGAL: REALTOR® mark formal authorization, TCPA copy, DMCA USCO agent
- BLOCKED BY GHL: form wiring (Cycle 17)
- DEFERRED: payload/CMS migration, Spanish localization

## Cycle 16 in/out scope

**IN scope:**
- Featured Markets homepage UX (6-at-a-time pager)
- Markets index completeness check + fixes
- Blog date governance (editorialDate / editorialMonthLabel)
- Per-post hero + OG images
- Fort Lauderdale V2 gold-standard market page
- Footer REALTOR®/EHO logo visual fix (or REVIEW marker)
- Legal pages accuracy audit (PASS/REVIEW/BLOCKED)
- About credentials/service areas audit
- Audit hardening (audit:featured-markets, audit:legal, audit:about)

**OUT of scope (preserved):**
- GHL production wiring
- TCPA compliance claims
- DNS / Cloudflare / .com production
- Payload/Postgres install
- CMS migration
- Lead magnet build
- Legal page rewrites (unless principal/legal authorizes)
- New colors / fonts / glassmorphism
- Boca/Delray-as-Broward errors
- ".com launch-ready" claims while external blockers remain

## Audit chain hardening targets

After Cycle 16, the following NEW audits should fail loudly on the issues this cycle is meant to prevent recurring:

1. `audit:featured-markets` — first-page order matches principal direction; 6 visible; pager works; all featured markets have route+image+OG+schema; /markets index complete.
2. `audit:insights` (extended) — each post has heroImage+ogImage; no repeated `/og-default.jpg` if avoidable; date governance honored; schema datePublished not misleading.
3. `audit:legal` — privacy/terms/accessibility/dmca status; DMCA USCO flag; legal page metadata/canonicals/footer links.
4. `audit:about` — no unverified credentials rendered; canonical service areas; no stale claims.

## Conclusion

Baseline is **clean and ready to start**. Working tree is clean, build is green, audit chain is green (with 1 expected WARN). The Cycle 15 surface is stable; Cycle 16's job is refinement, not recovery.

No reasons to halt before edits. Proceeding to Phase 1 (Decision Register).
