# Mia Sanabria Realtor Site — Ideal Production State

> **⚠ CANONICAL TARGET UPDATED (2026-05-13, Cycle 24 Mia-Live-Decisions / Cycle 30 audit):** the final production canonical is **`https://miasanabria.com`**, not `miasanabriarealtor.com`. Section 11 ("Launch / Cutover") rows below name `miasanabriarealtor.com` as the cutover host — that target is **stale**. The **technical actions** (DNS A flip, Dokploy domain bind, `NEXT_PUBLIC_SITE_URL` build-arg, sitemap re-submit, TLS issue, staging 301) are still correct in shape; only the destination host changed. Source-of-truth: `docs/mia-client-decision-record.md` §"Production canonical" + `src/lib/site.ts:14-15`. A future cutover-rev cycle will rewrite §11 against the live canonical.
>
> **Target:** `https://miasanabriarealtor.com` (post-cutover production). *[Stale per Cycle 24/30 banner above — read as `https://miasanabria.com`.]*
> **Scope:** the full articulation of "production-ready" for this site, written so each row is testable.
> **Authority order when this doc and another disagree:** `ISA.md` › `PUBLIC_FACT_LEDGER.md` v2 › this doc › supplemental BSS templates.
> **What this doc is not:** it does not invent new copy, claim unverified facts, or specify GHL/DNS/cutover work — those are gated.

This articulation is grounded in artifacts already in the repo. Where an artifact exists, this doc points at it instead of re-stating it.

---

## 1. Page Architecture

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 1.1 | Public route set ≥ 18 (Home, About, Contact, Buyers, Sellers, Valuation, Markets index, 7 dynamic markets, Insights, Privacy, Terms, Accessibility, 404) | each route returns 200 | `src/app/**/page.tsx`, `src/app/markets/[slug]/page.tsx`, `src/lib/mia.ts → FEATURED_MARKETS` |
| 1.2 | Single `<h1>` per page | grep + axe rule `page-has-heading-one` | per-page `page.tsx` |
| 1.3 | Sequential heading hierarchy (no skipped levels) | axe rule `heading-order` | per-page `page.tsx` |
| 1.4 | 404 page is branded and emits no JSON-LD claiming valid content | `out/404.html` exists; Caddy `handle_errors` rewrites to it | `src/app/not-found.tsx`, `Caddyfile` |
| 1.5 | Markets are dynamic (1 file, N data rows) — adding a market is a `markets.ts` edit, not new code | `src/lib/markets.ts` is the single source for slugs, copy, lat/lon | `src/lib/markets.ts`, `src/app/markets/[slug]/page.tsx` |
| 1.6 | Insights hub renders empty-state with RSS link until first post lands | route 200 + body contains "feed" | `src/app/insights/page.tsx` |

## 2. Compliance

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 2.1 | Brokerage attribution visible in footer of every page | grep `LPT Realty` in every emitted page | `SiteFooter` component |
| 2.2 | License # placeholder slot exists in footer + About; renders **null** in production until Mia confirms in writing | `MIA.unverified.licenseNumber === null` blocks render | `src/lib/mia.ts`, fact ledger §1 |
| 2.3 | Designations, languages beyond English, years-licensed, display office: all null in production until Mia confirms | `MIA.unverified.*` blocks rendering | `src/lib/mia.ts` |
| 2.4 | Fair Housing language present on every IDX/MLS surface | grep `Equal Housing` in markets index + every market page | `SiteFooter` EHO line, IDX iframe surroundings |
| 2.5 | Privacy / Terms / Accessibility legal stubs render with last-updated date | route 200 + body contains `Last updated` | `src/app/{privacy,terms,accessibility}/page.tsx` |
| 2.6 | Accessibility statement names target standard (WCAG 2.2 AA) and remediation contact | grep `WCAG 2.1` and contact line in `/accessibility/` | `src/app/accessibility/page.tsx` |
| 2.7 | Stale-residue audit returns 0 hits on the canonical forbidden-string set | `bun run audit:stale` exits 0 | `scripts/audit-stale-terms.ts` |
| 2.8 | No FREC ad-rule violation surfaces: no superlative claims (`#1`, `top`, `best`) without verifiable basis; no fabricated awards/media | manual review + audit-language extension flagging known risk patterns | `scripts/audit-stale-terms.ts` (extended) |
| 2.9 | No steering-risk demographic language in market copy ("good schools", "safe neighborhood", "family-friendly") | audit grep for known patterns + manual review | `scripts/audit-stale-terms.ts` (extended) |
| 2.10 | DPA / privacy-policy enumerates analytics + tracking + form-handler vendors actually wired | manual diff against `MIA.tracking` + form integrations | `src/app/privacy/page.tsx` |

## 3. IDX / MLS

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 3.1 | IDX iframe hosted by `sef.mlsmatrix.com` whitelisted in CSP `frame-src` | `curl -I` shows CSP includes `sef.mlsmatrix.com` | `Caddyfile` CSP block |
| 3.2 | IDX surface present on Home + Buyers + Sellers + Valuation (or referenced via CTA from each) | grep `mlsmatrix.com` in those page sources | per-page `page.tsx` |
| 3.3 | IDX iframe responsive (no fixed pixel widths leaking off mobile) | curl page + grep for `width="100%"` or CSS responsive class | per-page IDX wrapper component |
| 3.4 | IDX iframe loads under HTTPS (mixed-content clean) | DevTools Network panel / Lighthouse Best-Practices | run Lighthouse |
| 3.5 | No deeper IDX integration (search, save, alerts) without Mia/MLS approval | inventory: only iframe, no API calls | confirmed in repo |
| 3.6 | Listings copy never claims a property is owned, listed, or sold by Mia unless Klein-Morgan-era public records or Mia confirms | manual review + ledger §6 do-not-publish | `PUBLIC_FACT_LEDGER.md` §6 |

## 4. SEO / AEO / GEO

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 4.1 | Every page emits unique `<title>` ≤ 60 chars and `<meta name="description">` ≤ 160 chars | grep + length check | per-page `metadata` export |
| 4.2 | Every page emits `<link rel="canonical">` pointing at the production URL when `NEXT_PUBLIC_SITE_URL` is set to prod | curl + grep | `src/lib/site.ts`, per-page metadata |
| 4.3 | Every page emits Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) | curl + grep | `src/app/layout.tsx`, per-page metadata |
| 4.4 | Every page emits Twitter card (`twitter:card=summary_large_image`) | curl + grep | layout.tsx |
| 4.5 | `sitemap.xml` lists every public page, no duplicates, valid `<lastmod>` per URL | curl + xmllint | `src/app/sitemap.ts` |
| 4.6 | `robots.txt` permits indexing on production host, lists sitemap, sane Disallow for sensitive crawlers | curl + grep | `src/app/robots.ts` |
| 4.7 | `manifest.webmanifest` present with name, theme-color, icons | curl 200 | `src/app/manifest.ts` |
| 4.8 | Each page emits a JSON-LD `@graph` covering the entities the page genuinely represents (Person/RealEstateAgent/LocalBusiness on identity surfaces, Place on markets, FAQPage where Q&A appears, Service on Buyers/Sellers/Valuation, BreadcrumbList everywhere) | `bun run audit:schema` exits 0 | `scripts/audit-schema.ts`, `src/components/schema/*` |
| 4.9 | All JSON-LD validates with schema-dts at compile time | `bun run typecheck` exits 0 | `tsconfig.json` strict + `BuildSchema<T>` helper |
| 4.10 | No emitted JSON-LD asserts unverified facts (license #, designations, Spanish, display office) in prod build | runtime null guard in PersonSchema/RealEstateAgentSchema | `src/components/schema/PersonSchema.tsx`, `MIA.unverified.*` |
| 4.11 | AEO: every important page leads with a 1–3 sentence quotable answer in plain English | manual review per page-spec template | `~/.claude/PAI/USER/PROJECTS/MiaSanabria/SHARED_CONTEXT.md` voice rules |
| 4.12 | GEO: hyper-local anchors (street names, marinas, dining, bridge clearances, architectural styles) on each market page; ≥150 unique words per market | `bun run audit:links` keeps internal-links healthy + manual word-count | `src/lib/markets.ts`, market `page.tsx` |
| 4.13 | `<html lang="en-US">` site-wide; no untagged language switches | grep | `src/app/layout.tsx` |
| 4.14 | hreflang `en-US` self-link present | grep in head | layout.tsx |
| 4.15 | Sitemap submits cleanly to Google Search Console + Bing Webmaster on the production domain (post-cutover) | manual screenshot of GSC + Bing | follow-up checklist (Phase 5 launch checklist) |

## 5. Conversion

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 5.1 | Three-tier CTA hierarchy: Tier 1 calendar, Tier 2 home valuation form, Tier 3 phone/email | manual route inspection on Home/Buyers/Sellers/Valuation/Contact | per-page page.tsx |
| 5.2 | Home valuation form has ≤ 4 visible fields | grep `<input` in valuation `page.tsx` | `src/app/valuation/page.tsx` |
| 5.3 | Phone number rendered as `tel:` link in header + footer | grep `tel:+19545400358` | SiteHeader, SiteFooter |
| 5.4 | No popup, scroll-trigger, or email-wall anywhere | grep absence of common popup libs in `package.json` + per-page audit | repo |
| 5.5 | Calendar embed exists on Contact (placeholder iframe acceptable until Mia provides URL) | grep iframe in `/contact/page.tsx` | `src/app/contact/page.tsx` |
| 5.6 | Forms post to placeholder endpoints in staging; live endpoints only after GHL form mapping is finalized | grep `action=` and `/api/submit-` patterns | per-form component |
| 5.7 | CTAs use action verbs, not interrogatives | manual copy review | per-page page.tsx |

## 6. GHL Integration (planning only — out of scope for this run)

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 6.1 | Sub-account exists with branding, calendar, pipelines, tags configured | Torrey-confirmed checklist | `BSS_REALTOR_GHL_INTEGRATION_PACKET_TEMPLATE.md` |
| 6.2 | Form-mapping documented: site form fields → GHL contact fields | matrix doc with per-field mapping | `BSS_REALTOR_GHL_INTEGRATION_PACKET_TEMPLATE.md` |
| 6.3 | Calendar widget URL provided by Mia/GHL admin | URL recorded in `MIA.contact` extension once Mia confirms | gated on Mia confirmation |
| 6.4 | Tag taxonomy: `lead.source = mia-website`, `lead.intent = buyer | seller | valuation | general` | inventory in GHL UI | gated on Torrey + Mia |
| 6.5 | At least one workflow auto-replies to inbound forms within 60 seconds | GHL workflow log | gated on Torrey + Mia |
| 6.6 | This codebase emits zero outbound POST to a real Mia surface until 6.1–6.5 land | `src/app/**` grep for production endpoints | repo |

## 7. Analytics / Search Console

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 7.1 | GA4 measurement ID known and stored in code as a placeholder string | `MIA.tracking.ga4Id` | `src/lib/mia.ts` |
| 7.2 | GA4 + GTM injection wired in `layout.tsx` (or a `<TrackingHead/>` component) — gated on Torrey approval to fire | grep `googletagmanager.com` in layout when enabled | `src/app/layout.tsx` |
| 7.3 | UserWay accessibility widget ID known; injection gated on Mia approval | `MIA.tracking.userwayId` | `src/lib/mia.ts` |
| 7.4 | Privacy-respecting defaults: cookie consent gates Layer 2/3 trackers; IP anonymization; DNT honored | manual review of injection logic when wired | future |
| 7.5 | Search Console property verified (DNS TXT or HTML file) on production domain | screenshot in launch checklist | `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` |
| 7.6 | Bing Webmaster property verified | screenshot in launch checklist | `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` |
| 7.7 | Sitemap submitted in both Search Console and Bing Webmaster post-cutover | screenshot | launch checklist |
| 7.8 | No analytics IDs hard-coded in shipped HTML on staging without Torrey approval | curl + grep | repo |

## 8. Performance / Accessibility

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 8.1 | Lighthouse Performance ≥ 90 on Home, About, Contact | Lighthouse report | run via PageSpeed Insights |
| 8.2 | Lighthouse SEO ≥ 95 on every public page | Lighthouse report | run via PageSpeed Insights |
| 8.3 | Lighthouse Accessibility ≥ 95 on every public page | Lighthouse report | run via PageSpeed Insights |
| 8.4 | Lighthouse Best-Practices ≥ 95 | Lighthouse report | run via PageSpeed Insights |
| 8.5 | LCP ≤ 2.5s on 4G mobile | Lighthouse | run |
| 8.6 | CLS ≤ 0.1 | Lighthouse | run |
| 8.7 | INP ≤ 200ms | Lighthouse | run |
| 8.8 | All images use `next/image` with explicit width/height | grep `<img` for raw uses | per-page page.tsx |
| 8.9 | Hero image preloaded; critical fonts preloaded via `next/font` or `<link rel="preload">` | layout.tsx + hero component | `src/app/layout.tsx`, hero component |
| 8.10 | Total JS shipped on Home ≤ 120 KB gzipped | DevTools Network or `next build` output | local build |
| 8.11 | Color contrast ≥ 4.5:1 body, ≥ 3:1 large text | axe-core | run axe-core |
| 8.12 | Skip-to-main-content link is keyboard-reachable | axe-core | run axe-core |
| 8.13 | Forms have `<label>` for every input | axe-core | run axe-core |
| 8.14 | Site is fully keyboard-navigable | manual | manual review |

## 9. Security

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 9.1 | HTTPS-only with HSTS preload | `curl -I` shows `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` | `Caddyfile` |
| 9.2 | CSP enforced with `default-src 'self'` and explicit allowlists for GA, fonts, MLS iframe | `curl -I` | `Caddyfile` |
| 9.3 | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` deny camera/mic/geo/payment | `curl -I` | `Caddyfile` |
| 9.4 | No `console.log` in shipped client bundles | ESLint rule + grep `out/` | `eslint.config.mjs` |
| 9.5 | No `.env*` tracked in git | `git ls-files` | `.gitignore` |
| 9.6 | No secrets in commit history | `git log -p` scan + secret-scanner | manual + GitGuardian/secretlint optional |
| 9.7 | Static export — no server-side runtime; zero attack surface beyond static asset serve + headers | `next.config.ts` `output: 'export'` | `next.config.ts` |
| 9.8 | Form endpoints are placeholder until GHL mapping signed off — no live data accepted | per-form `action=` audit | repo |
| 9.9 | Container hardened: non-root user, multi-stage minimal image, read-only root FS option documented | `Dockerfile` review | `Dockerfile` |

## 10. Client Review (Mia)

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 10.1 | Mia confirms license # in writing → `MIA.unverified.licenseNumber` populated → footer + About + schema render it | written confirm + diff | gated |
| 10.2 | Mia confirms designations (or none) → `MIA.unverified.designations` populated | written confirm | gated |
| 10.3 | Mia confirms language list (English-only OR English + Spanish + …) | written confirm | gated |
| 10.4 | Mia confirms display-office address (the LPT branch she identifies with publicly) | written confirm | gated |
| 10.5 | Mia confirms years-licensed | written confirm | gated |
| 10.6 | Mia approves photography (headshot + lifestyle) with usage rights | written confirm | gated |
| 10.7 | Mia approves voice/copy for About page bio (50/150/300 word versions) | written confirm | gated |
| 10.8 | Mia approves the 7-market list (or proposes swaps) | written confirm | gated |
| 10.9 | Mia approves the calendar embed URL OR provides a different one | written confirm | gated |
| 10.10 | Mia approves the form endpoints (GHL form ID per intake type) | written confirm | gated |

## 11. Launch / Cutover

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 11.1 | Pre-cutover Mia confirmations 10.1–10.10 captured in writing | review-pack signed | `BSS_REALTOR_CLIENT_REVIEW_PACK_TEMPLATE.md` |
| 11.2 | DNS A record for `miasanabriarealtor.com` flips from DirectAxess to the Helos VPS IP | `dig +short` matches VPS | post-cutover sweep |
| 11.3 | `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.com` in Dokploy build args; redeploy | manual UI step | `DEPLOY.md` Cutover section |
| 11.4 | Dokploy app's Domains list includes `miasanabriarealtor.com` AND `www.miasanabriarealtor.com` with Let's Encrypt issuing | Traefik logs + `curl -I` | DEPLOY.md |
| 11.5 | Staging subdomain `miasanabriarealtor.trueidea.com` 301-redirects to `https://miasanabriarealtor.com` post-cutover | `curl -I` | Caddyfile / Traefik middleware |
| 11.6 | Sitemap re-submitted in GSC + Bing under new domain | screenshot | launch checklist |
| 11.7 | All schema/canonical/og:url/sitemap reflect production host (env-var-driven) | `curl -s … | grep miasanabriarealtor.com` | `src/lib/site.ts` |
| 11.8 | Live route sweep on production: 18/18 routes 200, sitemap.xml 200, robots.txt 200, manifest.webmanifest 200 | bash sweep loop | launch checklist |
| 11.9 | TLS valid for `.com` + `www.` | `openssl s_client` | launch checklist |
| 11.10 | DirectAxess legacy SEO bleed handled (Klein Morgan agent page noindex/redirect/takedown) | crawl + GSC removal request | gated separate task |

## 12. Rollback

| # | Target | Threshold / Probe | Source / Evidence |
|---|--------|-------------------|-------------------|
| 12.1 | Rollback command for code: `git revert <hash> && git push origin main` (Dokploy redeploys on push, or manual `application.deploy` per ISA D-2026-05-07) | runbook entry | this doc + DEPLOY.md |
| 12.2 | Rollback command for deploy: revert Dokploy to previous build via UI "Rollback" button | UI step | DEPLOY.md |
| 12.3 | Rollback for DNS cutover: re-flip A record back to DirectAxess IP; staging subdomain stays live as a safety net | DNS provider UI | launch checklist |
| 12.4 | Rollback for env-var change: `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.trueidea.com` → redeploy | Dokploy UI | DEPLOY.md |
| 12.5 | Rollback for analytics injection: disable env flag (`NEXT_PUBLIC_ENABLE_GA=0`) → redeploy | Dokploy UI | future flag |
| 12.6 | RTO ≤ 10 minutes for any single rollback step | timer test on first deploy cycle | manual |
| 12.7 | Backup of last green build's `out/` archived in CI artifact OR Dokploy build history retained ≥ 30 days | Dokploy retention setting | Dokploy config |

---

## Doctrine

- **Verified facts only.** §10 gates exist precisely so the codebase never asserts what Mia hasn't confirmed.
- **Static-export discipline.** No server runtime means no surprise outage surfaces; Cache-Control + immutable hashed assets keep CDN behavior predictable.
- **One source of truth per concern.** `mia.ts`, `markets.ts`, `site.ts` own data. `Caddyfile` owns headers + caching. `sitemap.ts/robots.ts/manifest.ts` own crawl directives. Schema components own JSON-LD shape.
- **Audit scripts are the executable spec.** When a target above can be probed in a script, it should be — that turns "ideal state" into "build-time gate".
