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

(populated at LEARN)

## Verification

(populated at VERIFY)
