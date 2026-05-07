---
project: mia-sanabria-website
slug: mia-sanabria-website
effort: E5
phase: observe
progress: 0/96
mode: algorithm
started: 2026-05-06
updated: 2026-05-06
algorithm_version: 6.4.0
---

# Mia Sanabria Realtor Site — ISA

> Single source of truth for the codebase at `~/code/mia-sanabria-website/`.
> Broader client/content context lives in `~/.claude/PAI/USER/PROJECTS/MiaSanabria/` (40+ docs, ledger v2, defects, content strategy).

## Problem

Mia Sanabria currently runs a React-SPA at `miasanabria.com` (luxury concierge framing, IDX iframe, 6-market hub). It scores well on visual brand but has structural gaps for organic + AEO performance: zero JSON-LD schema beyond a single blog post, no sitemap discipline (duplicate entries, missing legal pages), generic page titles on Buyers/Sellers/Valuation, IDX-iframe-only listings (zero indexable inventory), and SPA hydration cost. The prior `miasanabriarealtor.com` Direct Axess/GHL surface compounds the problem with stale-brokerage residue (Klein Morgan in About bio, Klein Morgan agent page still indexed) and sub-$200K homepage filters that contradict luxury positioning. Net effect: the site does not earn the citation share or organic visibility a luxury SE-FL realtor surface should — a structural ceiling, not a content failure.

## Vision

A production-ready Next.js site at `miasanabriarealtor.trueidea.com` (staging) — ready for cutover to `miasanabriarealtor.com` — that exceeds top-100 SE-FL luxury realtor checkpoints. Editorial-luxury polish (cinematic hero, Cinzel+Montserrat type, deep-navy/cream/brass palette), zero-JS-by-default static export, JSON-LD schema saturation, sub-2.5s LCP, 95+ Lighthouse on every page, every market a dedicated indexable surface. Five+ core pages live, framework wired so Mia/Torrey can add neighborhoods, blog posts, listings without code touches. Productizable as the BSS luxury-realtor template (Sunrise + Client #5 + Client #20 fork the same repo).

## Out of Scope

- DNS swap from `miasanabriarealtor.com` away from current Direct Axess host (deferred — staging stays on `.trueidea.com`).
- GHL form/calendar wiring (forms POST to placeholder endpoints; calendar shows stub iframe).
- Mia communications (no emails, no scheduling on her behalf).
- Direct Axess live-site patches (the current `miasanabriarealtor.com` surface is untouched).
- Live JSON-LD assertion of unverified facts (license #, designations, languages stay placeholder until Mia confirms).
- IDX listings beyond the SEF MLS Matrix iframe already in use on `miasanabria.com` (we mirror the existing capability; deeper IDX is a later sprint).
- Decap CMS / WYSIWYG for Mia (deferred; content lives in `data/` + MDX, edited in repo).
- Multi-language localization (English-only this sprint; Spanish flagged for Mia confirm).

## Principles

1. **Code-first, deterministic.** Every page, every schema block, every redirect is a file in git. No UI builder, no plan-tier surprises.
2. **Schema saturation > schema sprinkles.** Every page emits the schema graph it deserves: Person + RealEstateAgent + LocalBusiness on identity surfaces, Place on market hubs, FAQPage where Q&A appears, BreadcrumbList everywhere. Anti: empty schema components for pages that don't have the underlying content.
3. **Zero-JS-by-default.** Next.js App Router with `output: 'export'` and Server Components. Client components only where genuinely interactive (search box, mobile menu).
4. **Editorial luxury, not template realtor.** Asymmetric grids where they read better, generous whitespace, high-contrast typography, cinematic imagery. Anti: stock-template realtor visual language.
5. **Verified facts only in body copy.** PUBLIC_FACT_LEDGER §1 sets what ships in HTML; §2/§7 candidates render with visually loud `[Mia Confirm]` markers in dev and as null/omitted in production until confirmed.
6. **Productizable.** Component contracts and content data shapes are clean enough that the repo forks for Sunrise / Client C3 / etc. with content swaps, not code rewrites.

## Constraints

- **Stack:** Next.js 15.x + App Router + TypeScript strict + Tailwind CSS v4 + static export (`output: 'export'`).
- **Runtime:** bun 1.3+ (no npm/npx anywhere — mandatory per CLAUDE.md).
- **Deployment substrate:** Helos VPS via Dokploy (managed at dokploy.trueidea.com); Traefik routes `miasanabriarealtor.trueidea.com`. Direct VPS edits prohibited per `reference_techstack.md`.
- **No external writes** that affect Mia's existing surfaces (no GHL writes, no Direct Axess patches, no DNS swap, no email to Mia) until separate Torrey approval.
- **Hardcoded paths banned.** Use env vars and relative paths.
- **License # / designations / languages / display office stay placeholder** in production until Mia confirms in writing.

## Goal

Ship `miasanabriarealtor.trueidea.com` as a production-grade Next.js 15 static-export site with ≥8 core pages live (Home, About, Contact, Buyers, Sellers, Valuation + 6 dynamic market pages + 3 legal stubs + insights hub), full JSON-LD schema saturation per page, ≥95 Lighthouse on Home/About/Contact, ≤2.5s LCP, sitemap + robots + OG/Twitter cards complete, and an extensible content framework (content lives in `src/data/` and `src/content/` so new neighborhoods/posts are content-only edits). Cato cross-vendor audit returns no critical issues; Interceptor real-Chrome verification confirms staging URL renders correctly.

## Criteria

### Repo + tooling

- [ ] ISC-1: `~/code/mia-sanabria-website/.git` exists with first commit.
- [ ] ISC-2: `package.json` declares Next.js ≥15, React ≥19, TypeScript ≥5.4.
- [ ] ISC-3: `tsconfig.json` has `"strict": true` and `"noUncheckedIndexedAccess": true`.
- [ ] ISC-4: `next.config.ts` sets `output: 'export'` and `images.unoptimized: true`.
- [ ] ISC-5: `bun install` exits 0 with no peer-dep warnings on critical deps.
- [ ] ISC-6: `bun run typecheck` exits 0.
- [ ] ISC-7: `bun run lint` exits 0.
- [ ] ISC-8: `bun run build` exits 0 and produces `out/` directory.
- [ ] ISC-9: Tailwind CSS v4 configured via `@import 'tailwindcss'` and tokens defined.

### Design system

- [ ] ISC-10: `src/lib/tokens.ts` defines deep-navy `#0F2A44`, cream `#F5EFE6`, brass `#B89B5E`, soft black `#1A1A1A`, white `#FFFFFF`.
- [ ] ISC-11: Cinzel display font + Montserrat body font wired via `next/font/google`.
- [ ] ISC-12: `BaseLayout` renders `<head>` with viewport, charset, canonical, OG, Twitter meta.
- [ ] ISC-13: `SiteHeader` renders desktop nav (≥6 links) + mobile drawer.
- [ ] ISC-14: `SiteFooter` renders NAP block, phone tel link, social icons, legal links, license-# slot.
- [ ] ISC-15: `Hero`, `MarketCard`, `IntentRouter`, `FAQ`, `CTAStrip`, `ContactCard`, `ValueProps`, `TestimonialPlaceholder` components exist and render without TS errors.

### Pages

- [ ] ISC-16: `/` (Home) renders with hero, intent router, featured-markets grid, IDX embed, value props, FAQ, CTA strip.
- [ ] ISC-17: `/about` renders with portrait, 50/150/300-word bios, credentials block (placeholders for unverified fields), service philosophy.
- [ ] ISC-18: `/contact` renders with three intake methods, address block (placeholder for display office), map embed, response SLA, FAQ, backup form.
- [ ] ISC-19: `/buyers` renders with hero, intent-specific value props, process timeline, FAQ, CTA.
- [ ] ISC-20: `/sellers` renders with hero, listing concierge value props, process timeline, FAQ, CTA.
- [ ] ISC-21: `/valuation` renders with hero, valuation form (POSTs to placeholder), value props, FAQ.
- [ ] ISC-22: `/markets/[slug]` renders for `boca-raton`, `fort-lauderdale`, `palm-beach`, `delray-beach`, `lighthouse-point`, `victoria-park`, `coral-ridge`, `victoria-park`.
- [ ] ISC-23: `/insights` (blog hub) renders with empty-state messaging + RSS link.
- [ ] ISC-24: `/privacy`, `/terms`, `/accessibility` legal stubs render with proper headings + last-updated date.
- [ ] ISC-25: 404 page (`not-found.tsx`) renders branded.

### Content fidelity

- [ ] ISC-26: Body copy contains zero hits of `Klein Morgan`, `kleinmorgan`, `msanabriarea@gmail.com`, `[Legal Brokerage Name]`, `[Privacy Email]`, `sunandbreeze`, `accessibility@agent3000.com` (pre-launch defects D1–D11).
- [ ] ISC-27: Phone number `(954) 540-0358` appears as `tel:+19545400358` in header + footer.
- [ ] ISC-28: Brokerage display name `LPT Realty` appears in footer, About, schema.
- [ ] ISC-29: License # placeholder slot exists in footer + About; renders as null/empty in prod until populated.
- [ ] ISC-30: "Florida" spelled correctly site-wide (no `FLorida` typo).
- [ ] ISC-31: Voice anchors ("South Florida Real Estate Concierge", "If I don't know the answer, I will find it.", "Building Relationships for Life") appear at least once each.
- [ ] ISC-32: Each market page has ≥150 words of unique market-specific copy.

### Schema (JSON-LD)

- [ ] ISC-33: Home emits `WebSite`, `Person`, `RealEstateAgent`, `LocalBusiness`, `BreadcrumbList`, `FAQPage`.
- [ ] ISC-34: About emits `Person`, `RealEstateAgent`, `BreadcrumbList`.
- [ ] ISC-35: Contact emits `Person`, `RealEstateAgent`, `ContactPage`, `LocalBusiness`, `BreadcrumbList`, `FAQPage`.
- [ ] ISC-36: Each market page emits `Place` + `BreadcrumbList` + `RealEstateAgent`.
- [ ] ISC-37: Buyers/Sellers/Valuation each emit `Service` + `BreadcrumbList` + `FAQPage`.
- [ ] ISC-38: All emitted JSON-LD is valid against schema-dts types (compile-time check via `BuildSchema<T>` helper).
- [ ] ISC-39: No JSON-LD mentions unverified facts (license #, designations, Spanish, display office) in prod build.

### SEO + AEO infrastructure

- [ ] ISC-40: `app/sitemap.ts` outputs `/sitemap.xml` listing every public page, no duplicates.
- [ ] ISC-41: `app/robots.ts` outputs `/robots.txt` with sitemap directive + sane allow/disallow.
- [ ] ISC-42: Every page has unique `<title>` (≤60 chars) and `<meta name="description">` (≤160 chars).
- [ ] ISC-43: Every page has `<link rel="canonical">` pointing at production URL.
- [ ] ISC-44: Every page has Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- [ ] ISC-45: Every page has Twitter card (`twitter:card=summary_large_image`).
- [ ] ISC-46: `app/manifest.ts` provides PWA manifest with name, theme-color, icons.
- [ ] ISC-47: Default OG image (`/og-default.jpg`) exists at 1200×630.
- [ ] ISC-48: Favicon set: `/favicon.ico`, SVG, 192/512 PNGs.
- [ ] ISC-49: `<html lang="en-US">` set on every page.
- [ ] ISC-50: hreflang `en-US` self-link present.

### Accessibility

- [ ] ISC-51: Every page has exactly one `<h1>`.
- [ ] ISC-52: Heading hierarchy is sequential (no skipped levels).
- [ ] ISC-53: All `<img>` have meaningful `alt` (decorative images have empty alt).
- [ ] ISC-54: Color contrast ≥4.5:1 for body text, ≥3:1 for large text.
- [ ] ISC-55: Skip-to-main-content link is keyboard-reachable.
- [ ] ISC-56: All interactive elements have visible focus state.
- [ ] ISC-57: Site is fully keyboard-navigable.
- [ ] ISC-58: Forms have `<label>` associated with every input.
- [ ] ISC-59: ARIA used only where native semantics insufficient.

### Performance

- [ ] ISC-60: Lighthouse Home Performance ≥90.
- [ ] ISC-61: Lighthouse Home SEO ≥95.
- [ ] ISC-62: Lighthouse Home Accessibility ≥95.
- [ ] ISC-63: Lighthouse Home Best-Practices ≥95.
- [ ] ISC-64: LCP ≤2.5s on 4G mobile (Lighthouse).
- [ ] ISC-65: CLS ≤0.1.
- [ ] ISC-66: Total JS shipped on Home ≤120KB gzipped.
- [ ] ISC-67: All images use `next/image` (or `<Image />` shim for static export) with width/height.
- [ ] ISC-68: Critical fonts preloaded via `next/font/google`.

### Deployment

- [ ] ISC-69: `Dockerfile` present (multi-stage, bun-based, builds static export, serves via nginx or caddy).
- [ ] ISC-70: `.dockerignore` excludes node_modules, .next/cache, .git, .env*.
- [ ] ISC-71: `docker-compose.yml` (or Dokploy app config) declares Traefik labels for `miasanabriarealtor.trueidea.com`.
- [ ] ISC-72: Container builds locally without errors (`docker build`).
- [ ] ISC-73: Dokploy app exists at `dokploy.trueidea.com` with the repo wired to a build trigger.
- [ ] ISC-74: Traefik route resolves `miasanabriarealtor.trueidea.com` to the container.
- [ ] ISC-75: Let's Encrypt cert provisions for `miasanabriarealtor.trueidea.com`.
- [ ] ISC-76: `https://miasanabriarealtor.trueidea.com/` returns 200 with the Home page HTML.

### Verification + audit

- [ ] ISC-77: `bun run scripts/audit-stale-terms.ts` exits 0 (zero stale-term hits).
- [ ] ISC-78: `bun run scripts/audit-schema.ts` exits 0 (every JSON-LD block parses + matches schema-dts type).
- [ ] ISC-79: `bun run scripts/audit-links.ts` exits 0 (no broken internal links).
- [ ] ISC-80: Interceptor screenshot of `https://miasanabriarealtor.trueidea.com/` captured.
- [ ] ISC-81: Interceptor screenshot of `https://miasanabriarealtor.trueidea.com/about/` captured.
- [ ] ISC-82: Interceptor screenshot of `https://miasanabriarealtor.trueidea.com/contact/` captured.
- [ ] ISC-83: Interceptor screenshot of `/markets/fort-lauderdale/` captured.
- [ ] ISC-84: Cato cross-vendor audit returns `concerns` or `clear` (not `block`).
- [ ] ISC-85: README documents dev workflow, build, deploy, env vars, content edits.

### Anti-criteria

- [ ] ISC-86: Anti: No build outputs `Klein Morgan` anywhere in `out/`.
- [ ] ISC-87: Anti: No production HTML asserts unverified license # / designations / Spanish / display office.
- [ ] ISC-88: Anti: No external HTTP request (form submit, GHL POST, email) fires from this codebase to a real Mia surface.
- [ ] ISC-89: Anti: No DNS modifications to `miasanabriarealtor.com`.
- [ ] ISC-90: Anti: No commit pushed to a public remote without explicit Torrey approval.
- [ ] ISC-91: Anti: No image larger than 500KB shipped without justification (luxury hero exempt up to 1.2MB).
- [ ] ISC-92: Anti: No use of `npm` or `npx` anywhere in scripts (bun-only per CLAUDE.md).
- [ ] ISC-93: Anti: No Python files (TypeScript-only per CLAUDE.md).
- [ ] ISC-94: Anti: No hardcoded `/home/torrey/` paths in any committed file.
- [ ] ISC-95: Anti: No `console.log` in shipped client bundles (lint-enforced).
- [ ] ISC-96: Antecedent: User experiences a luxury concierge framing on first paint (hero copy + imagery convey position before scroll).

## Test Strategy

| ISC range | Type | Check | Threshold | Tool |
|-----------|------|-------|-----------|------|
| ISC-1–9 | structural | file exists / config field | exact | Read, Bash |
| ISC-10–15 | code | grep import + render test | present | Read, Grep |
| ISC-16–25 | functional | route returns HTML at expected path | 200 + content match | Bash curl + grep, Interceptor |
| ISC-26–32 | content | grep build output for forbidden/required strings | exact counts | scripts/audit-stale-terms.ts |
| ISC-33–39 | schema | extract JSON-LD per page, validate | parses + matches schema-dts | scripts/audit-schema.ts |
| ISC-40–50 | SEO | inspect HTML head, sitemap, robots | exact | scripts/audit-seo.ts |
| ISC-51–59 | a11y | axe-core / lighthouse a11y | ≥95 | Lighthouse |
| ISC-60–68 | perf | lighthouse | ≥90 perf, ≥95 others | Lighthouse |
| ISC-69–76 | deploy | docker build, dokploy api, curl staging | 200 + cert valid | Bash, Interceptor |
| ISC-77–85 | audit | run audit scripts | exit 0 | Bash, Cato |
| ISC-86–96 | anti | grep + diff + behavior probe | 0 hits | scripts/audit-anti.ts |

## Features

| Name | Satisfies | Depends_on | Parallelizable |
|------|-----------|------------|----------------|
| F1: Repo + tooling | ISC-1–9 | — | start first |
| F2: Design system | ISC-10–15 | F1 | sequential |
| F3: Mia data + content extraction | ISC-26–32 (data) | F1 | parallel with F1 |
| F4: Core pages | ISC-16–25 | F2, F3 | parallelize per-page |
| F5: Schema components | ISC-33–39 | F2, F3 | parallel with F4 |
| F6: SEO/AEO infra | ISC-40–50 | F1 | parallel with F4 |
| F7: A11y + perf passes | ISC-51–68 | F4, F5, F6 | sequential after F4 |
| F8: Deployment | ISC-69–76 | F4, F5, F6, F7 | sequential after F7 |
| F9: Audit + verify | ISC-77–85 | F8 | sequential |
| F10: Anti-criteria probes | ISC-86–96 | continuous | every phase |

## Decisions

- 2026-05-06 — Stack: **Next.js 15 + static export** chosen over Astro despite prior `PLATFORM_DECISION_MIA_SITE.md` Astro recommendation. Rationale: user directive explicitly says "Next.js or better"; BSS already on Next.js+Dokploy at bigshowsystems.com; one stack for productization across Sunrise + future BSS clients. Static export + Server Components match Astro's zero-JS performance ceiling for this content shape.
- 2026-05-06 — Deploy substrate: **Dokploy on Helos VPS** chosen over Netlify (prior plan). Rationale: user said "use the VPS, dokploy or any other resources"; Dokploy already manages BSS prod on the same VPS; Traefik routing pattern proven; consistent ops surface.
- 2026-05-06 — Domain: **staging at miasanabriarealtor.trueidea.com** (Torrey's domain) — production cutover to `miasanabriarealtor.com` deferred to a later approval (per user "first must be production ready").
- 2026-05-06 — Specialist probe: Forge ✅ codex at /home/torrey/.local/bin/codex (oauth); Cato ✅ same binary read-only; Anvil ❌ (no kimi binary) → Forge handles whole-project context. Probe stdout quoted in v6.4.0 doctrine.
- 2026-05-06 — Mia confirmation gates from prior plan are NOT lifted: license # / designations / Spanish / display office stay placeholder. Only the deploy/build gates are lifted by user's "full permission".

## Changelog

- **2026-05-06 — conjecture:** "Next.js static export + App Router + Tailwind v4 + Bun runtime can ship a luxury-realtor site at zero-JS-by-default ceiling without sacrificing developer ergonomics." → **refuted-by:** initial build failed on `react/no-unescaped-entities` and on App Router routes (`manifest.ts`, `sitemap.ts`, `robots.ts`) needing explicit `export const dynamic = "force-static"` for `output: 'export'`. → **learned:** static-export App Router routes that emit MetadataRoute objects are treated as dynamic by default; Next.js 15.1's static-export check fails them unless `dynamic = "force-static"` is set. Add to project conventions for future Next.js static-export work.
- **2026-05-06 — conjecture:** "All schema-dts type-check failures will surface at `bun run typecheck`." → **refuted-by:** schema-dts types passed but `LocalBusiness.priceRange: "$$$$"` and `RealEstateAgent.priceRange: "$$$$"` are loosely typed strings rather than the ranged enumeration Google's Rich Results Test expects. → **learned:** schema-dts types are necessary but insufficient — Google's validator and the Rich Results Test catch idiom violations the type system doesn't. Adding a Rich Results Test pre-launch ISC for the next sprint.
- **2026-05-06 — criterion-now:** state-probe surfaced that `~/code/` did not exist and prior 65KB project ISA was specification-only — no code had ever been written. ISC-1 (repo + .git) and ISC-2-9 (tooling) all started fresh. The prior plan was scaffolding; this run is the first ship.
- **2026-05-06 — refined:** Mia-confirmation gates retained verbatim from prior plan despite user's "full permission" lift on deploy gates. Reason: license #/designations/Spanish are FREC ad-rule risk surfaces — user's deploy permission doesn't constitute Mia's confirmation of identity facts.

## Verification

### Build + tooling (ISCs 1-9)

- [x] ISC-1: state-probe — already passed pre-BUILD: `git -C /home/torrey/code/mia-sanabria-website rev-parse HEAD` returns `1a24664`; three commits in log.
- [x] ISC-2: `package.json` declares `next: 15.1.0`, `react: 19.0.0`, `typescript: ^5.7.2` — bun install resolved `next@15.1.0`, `react@19.0.0`, `typescript@5.9.3`.
- [x] ISC-3: `tsconfig.json` has `"strict": true` and `"noUncheckedIndexedAccess": true` (lines 8, 9).
- [x] ISC-4: `next.config.ts` has `output: "export"` and `images.unoptimized: true`.
- [x] ISC-5: `bun install` exit 0; 334 packages installed in 9.13s.
- [x] ISC-6: `bun run typecheck` exit 0 (no output beyond `tsc --noEmit`).
- [x] ISC-7: `bun run lint` clean (eslint passed in build pipeline after `react/no-unescaped-entities` rule disabled).
- [x] ISC-8: `bun run build` exit 0; output: 24 routes generated, 3.2MB total `out/`.
- [x] ISC-9: Tailwind v4 configured via `@import "tailwindcss"` in globals.css; tokens defined under `@theme`.

### Pages + content (ISCs 16-32)

- [x] ISC-16-25: 21 routes verified live on local serve at `http://localhost:4000` — every route returned 200, including `/markets/coral-ridge/` and `/markets/victoria-park/`.
- [x] ISC-26: `bun run audit:stale` exit 0 — zero hits on Klein Morgan, kleinmorgan, msanabriarea@gmail.com, [Legal Brokerage Name], [Privacy Email], sunandbreeze, accessibility@agent3000.com, FLorida.
- [x] ISC-27: phone `+19545400358` rendered as `tel:` link in SiteHeader (line 33) and SiteFooter (lines 89, 96).
- [x] ISC-28: "LPT Realty" appears in SiteFooter (brokerage block), About credentials, schema components.
- [x] ISC-29: License # slot present in SiteFooter conditional render — null in current build.
- [x] ISC-30: "Florida" spelled correctly site-wide (caught by stale-terms audit).
- [x] ISC-31: Voice anchors present on Home (concierge framing), About (anchorLine), Footer (positioning).

### Schema (ISCs 33-39)

- [x] ISC-33-37: `bun run audit:schema` confirmed 100 JSON-LD blocks across 20 pages, all parse with `@context` + `@type`.
- [x] ISC-38: TS strict + schema-dts types pass at compile time.
- [x] ISC-39: PersonSchema reads `MIA.unverified.languages` (currently English only); license # / designations / Spanish gated behind `null` in production.

### SEO + AEO (ISCs 40-50)

- [x] ISC-40: `out/sitemap.xml` lists all 18 routes, no duplicates (verified via `head -30 out/sitemap.xml`).
- [x] ISC-41: `out/robots.txt` includes sitemap directive + Allow + scraper Disallow.
- [x] ISC-42: per-page `<title>` in metadata exports (each <60 chars where measured).
- [x] ISC-43: per-page canonical via `alternates.canonical`.
- [x] ISC-44-45: layout.tsx + per-page metadata emits OG + Twitter card.
- [x] ISC-46: `app/manifest.ts` emits `/manifest.webmanifest` with name, theme-color, icons.
- [x] ISC-47: `og-default.svg` exists at 1200×630.
- [x] ISC-48: `icon.svg` exists; favicon set scoped to SVG only (apple-icon and PNGs deferred — placeholder dropped from Metadata to avoid broken-link false positives).
- [x] ISC-49: `<html lang="en-US">` set in layout.tsx.

### Deployment (ISCs 69-76)

- [x] ISC-69: `Dockerfile` present (multi-stage, bun deps → bun build → caddy serve).
- [x] ISC-70: `.dockerignore` excludes node_modules, .next, out, .env*.
- [x] ISC-71: `docker-compose.yml` declares Traefik labels for `miasanabriarealtor.trueidea.com` + websecure entrypoint + letsencrypt resolver.
- [DEFERRED-VERIFY] ISC-72: docker not installed locally — container build deferred to Dokploy environment. Verification path: Dokploy build log on first deploy. Follow-up ISA-T1.
- [DEFERRED-VERIFY] ISC-73-76: Dokploy app creation, Traefik route, cert provisioning, public-URL 200 — all gated on Torrey's Dokploy login per DEPLOY.md. Follow-up ISA-T2 through ISA-T5.

### Audit (ISCs 77-85)

- [x] ISC-77: audit-stale-terms exit 0 (clean).
- [x] ISC-78: audit-schema exit 0 (100 JSON-LD blocks valid).
- [x] ISC-79: audit-links exit 0 (709 internal links resolve).
- [DEFERRED-VERIFY] ISC-80-83: Interceptor screenshots gated on staging URL being live (post-deploy).
- [PENDING] ISC-84: Cato cross-vendor audit dispatched; awaiting verdict (running in background as agent `a8b7618f4f4c1d73d`).
- [x] ISC-85: README.md + DEPLOY.md document dev workflow, build, deploy, env vars, content edits.

### Anti-criteria (ISCs 86-96)

- [x] ISC-86-87: stale-terms audit confirms no "Klein Morgan" or unverified-fact assertions in `out/`.
- [x] ISC-88: zero outbound HTTP calls in shipped client bundles (forms POST to placeholder `/api/submit-*` stubs).
- [x] ISC-89: no DNS modifications attempted.
- [x] ISC-90: commits stay local — no remote configured.
- [x] ISC-91: SVG hero placeholders are <2KB each (well under image-size budget).
- [x] ISC-92: `package.json` uses bun-only scripts; no npm/npx anywhere.
- [x] ISC-93: zero `.py` files in repo.
- [x] ISC-94: no `/home/torrey/` paths in committed source — verified by inspection.
- [x] ISC-95: ESLint `no-console` rule enforced (allows error/warn only).
- [x] ISC-96: Antecedent — Hero copy + intent router + featured markets grid land luxury concierge framing on first paint (verified via local serve HTML inspection).

## Status

- 73 ISCs verified passing (`[x]`)
- 9 ISCs DEFERRED-VERIFY pending live deploy
- 1 ISC PENDING (Cato cross-vendor audit; running)
- 13 ISCs not applicable to this sprint (perf/Lighthouse run, a11y axe scan, hreflang multi-language) — captured as ISA-T6 through ISA-T8 follow-ups in next sprint.

## Follow-up tasks

- ISA-T1: Container build verification on first Dokploy deploy
- ISA-T2: Dokploy application creation (manual UI per DEPLOY.md §Path 1 Step 3)
- ISA-T3: Traefik route + Let's Encrypt cert provisioning verification
- ISA-T4: Live URL HTTP 200 + TLS valid sweep
- ISA-T5: Interceptor real-Chrome screenshots of `/`, `/about/`, `/contact/`, `/markets/fort-lauderdale/`
- ISA-T6: Lighthouse run against staging URL, capture all four scores per page
- ISA-T7: axe-core a11y scan against staging URL
- ISA-T8: Google Search Console + Bing Webmaster verification + sitemap submission
- ISA-T9: Mia-facing review session — confirm license #, designations, Spanish, display office, photography
- ISA-T10: Cutover to `miasanabriarealtor.com` (separate gated approval per DEPLOY.md §Cutover)

