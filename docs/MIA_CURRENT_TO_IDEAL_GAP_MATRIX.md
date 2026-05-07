# Mia Sanabria Site — Current vs Ideal Gap Matrix

> **Compares:** current dev/staging at `https://miasanabriarealtor.trueidea.com` (commit `9660b3a`, 2026-05-07) vs `MIA_IDEAL_PRODUCTION_STATE.md`.
> **Classification:** P0 (blocks Mia review) · P1 (blocks `.com` cutover) · P2 (defer) · GATED (needs Mia confirmation) · APPROVAL (needs Torrey approval) · AUTOMATE (becomes a reusable BSS process).
> **Evidence column:** every row cites either current proof or the absence of it.

---

## Page Architecture (axis 1)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 1.1 18+ public routes 200 | 18/18 routes 200 in 2026-05-07 sweep | **none** | — (closed) |
| 1.2 Single `<h1>` per page | not yet probed automatically | unknown — needs `audit-seo.ts` to enforce | **P1 / AUTOMATE** |
| 1.3 Sequential headings | not yet probed | unknown — axe pass needed | **P1 / AUTOMATE** |
| 1.4 Branded 404 | `not-found.tsx` exists; `Caddyfile` rewrites 404 → `/404.html` | verify `out/404.html` exists post-build | **P0** |
| 1.5 Markets dynamic | `src/lib/markets.ts` is the data source; `[slug]/page.tsx` is generic | **none** | — (closed) |
| 1.6 Insights empty-state w/ RSS | route 200, body content not yet inspected | needs spot-check | **P1** |

## Compliance (axis 2)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 2.1 LPT in footer everywhere | `LPT Realty` confirmed in footer (audit) | **none** | — |
| 2.2 License # null in prod | `MIA.unverified.licenseNumber === null`, schema renders null | confirmation pending | **GATED on Mia** |
| 2.3 Designations/languages/years/office null | all null in `MIA.unverified.*` | confirmation pending | **GATED on Mia** |
| 2.4 EHO line on IDX surfaces | confirmed in SiteFooter (cycle 3 commit) | spot-check market pages explicitly | **P1** |
| 2.5 Privacy/Terms/Accessibility w/ last-updated | routes 200 | verify `Last updated` present in body | **P0** |
| 2.6 Accessibility statement names WCAG 2.1 AA + remediation contact | route 200 | verify content | **P0** |
| 2.7 Stale-residue audit clean | `bun run audit:stale` exits 0 | **none** | — |
| 2.8 No FREC superlative-claim risk | not yet enforced; site copy says "luxury concierge" + "South Florida Real Estate Concierge" (positioning, not awards) — but no automated guard | extend `audit-stale-terms.ts` with banned-phrase set | **P1 / AUTOMATE** |
| 2.9 No steering-risk demographic copy | not enforced | extend audit | **P1 / AUTOMATE** |
| 2.10 DPA/Privacy enumerates actual vendors | unknown — content not yet inspected | spot-check Privacy page | **P1** |

## IDX/MLS (axis 3)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 3.1 CSP whitelists `sef.mlsmatrix.com` | confirmed in Caddyfile CSP `frame-src` | **none** | — |
| 3.2 IDX present on appropriate surfaces | needs page-level grep | spot-check | **P1** |
| 3.3 IDX iframe responsive | not yet probed | manual + responsive grep | **P1** |
| 3.4 IDX HTTPS / mixed-content clean | CSP forces; manual Lighthouse Best-Practices needed | run Lighthouse | **P1 / AUTOMATE** |
| 3.5 No deeper IDX without approval | confirmed — only iframe | **none** | — |
| 3.6 No fabricated listing claims | confirmed — body copy fact-ledger gated | **none** | — |

## SEO / AEO / GEO (axis 4)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 4.1 Per-page title ≤ 60, description ≤ 160 | not enforced automatically | add length check to new `audit-seo.ts` | **P0 / AUTOMATE** |
| 4.2 Canonical points at production URL when env set | env-var-driven via `site.ts → SITE_URL` | **none** (canonical correctness verified for staging; will follow env at cutover) | — |
| 4.3 OG meta complete | confirmed via curl (og:url, og:image, og:title, og:description) | **none** | — |
| 4.4 Twitter card complete | confirmed via curl | **none** | — |
| 4.5 Sitemap lists every page, no duplicates, valid lastmod | live sitemap inspection: clean, no duplicates, ISO lastmod | **none** | — |
| 4.6 robots.txt sane on prod host | live robots.txt 200 | verify host pin works at cutover | **P1** |
| 4.7 manifest.webmanifest present | live 200 | **none** | — |
| 4.8 Per-page JSON-LD graph valid | `audit:schema` reports 100 valid blocks across 20 pages | **none** | — |
| 4.9 schema-dts compile-time | `bun run typecheck` clean | **none** | — |
| 4.10 No unverified facts in JSON-LD | runtime null guard in PersonSchema | **none** (verified) | — |
| 4.11 AEO 1–3 sentence quotable answer per page | not yet probed | manual review per page | **P1** |
| 4.12 GEO ≥150 unique words/market + hyper-local anchors | `markets.ts` has substantial content; not measured | add word-count check to `audit-seo.ts` | **P1 / AUTOMATE** |
| 4.13 `<html lang="en-US">` | confirmed in layout.tsx | **none** | — |
| 4.14 hreflang `en-US` self-link | not yet verified in head | spot-check; cheap to add if missing | **P0** |
| 4.15 GSC/Bing sitemap submission | post-cutover only | document checklist | **P1 (post-cutover)** |

## Conversion (axis 5)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 5.1 Three-tier CTA hierarchy | per cycle-3 commit | spot-check Home/Buyers/Sellers | **P1** |
| 5.2 Valuation form ≤ 4 fields | not yet probed | grep `<input` count | **P1** |
| 5.3 `tel:+19545400358` in header+footer | confirmed | **none** | — |
| 5.4 No popups/scroll-triggers/email-walls | confirmed via package inventory | **none** | — |
| 5.5 Calendar embed on Contact (placeholder OK) | unknown — needs page-level grep | **P1** |
| 5.6 Forms POST to placeholder endpoints | confirmed (no live URLs) | **none** | — |
| 5.7 CTA action verbs | manual review | **P2** |

## GHL Integration (axis 6) — **OUT OF SCOPE FOR THIS RUN**

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 6.1 Sub-account configured | not done | — | **APPROVAL (Torrey + Mia)** |
| 6.2 Form-mapping documented | not done | author template | **AUTOMATE** (Phase 5 deliverable) |
| 6.3 Calendar widget URL | placeholder | — | **GATED on Mia** |
| 6.4 Tag taxonomy | not done | document in template | **AUTOMATE** |
| 6.5 Auto-reply workflow ≤ 60s | not done | — | **APPROVAL** |
| 6.6 No live POST from staging | confirmed | **none** | — |

## Analytics / Search Console (axis 7)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 7.1 GA4 measurement ID stored as placeholder | `MIA.tracking.ga4Id = "G-PYYSF87G8K"` | **none** | — |
| 7.2 GA4/GTM injection wired in layout (gated) | not yet wired | implement behind `NEXT_PUBLIC_ENABLE_GA` flag | **APPROVAL (Torrey)** |
| 7.3 UserWay widget gated on Mia | ID present, not injected | implement behind flag | **GATED on Mia** |
| 7.4 Privacy-respecting defaults | not yet implemented | — | **P1 (post-injection)** |
| 7.5 GSC verified on prod | post-cutover | document checklist | **P1 (post-cutover)** |
| 7.6 Bing verified on prod | post-cutover | document checklist | **P1 (post-cutover)** |
| 7.7 Sitemap submitted | post-cutover | document checklist | **P1 (post-cutover)** |
| 7.8 No analytics IDs hard-coded yet | confirmed | **none** | — |

## Performance / Accessibility (axis 8)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 8.1 Lighthouse Perf ≥ 90 (Home/About/Contact) | not yet run on staging | run from PageSpeed Insights | **P1 / AUTOMATE** |
| 8.2 Lighthouse SEO ≥ 95 site-wide | not run | run | **P1 / AUTOMATE** |
| 8.3 Lighthouse A11y ≥ 95 site-wide | not run | run | **P1 / AUTOMATE** |
| 8.4 Lighthouse Best-Practices ≥ 95 | not run | run | **P1 / AUTOMATE** |
| 8.5 LCP ≤ 2.5s | not run | run | **P1 / AUTOMATE** |
| 8.6 CLS ≤ 0.1 | not run | run | **P1 / AUTOMATE** |
| 8.7 INP ≤ 200ms | not run | run | **P1 / AUTOMATE** |
| 8.8 All images via `next/image` | not yet audited | grep `<img` raw uses | **P1 / AUTOMATE** |
| 8.9 Hero image preloaded; fonts preloaded | manual review needed | — | **P1** |
| 8.10 Home JS ≤ 120 KB gzipped | unknown | check `bun run build` output | **P1** |
| 8.11 Color contrast | not run | axe-core | **P1 / AUTOMATE** |
| 8.12 Skip-to-main-content keyboard reachable | unknown | axe-core | **P0 / AUTOMATE** |
| 8.13 Forms have labels | not run | axe-core | **P0 / AUTOMATE** |
| 8.14 Keyboard navigable | manual | manual | **P1** |

## Security (axis 9)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 9.1 HSTS preload | confirmed `max-age=63072000; includeSubDomains; preload` | **none** | — |
| 9.2 CSP enforced | confirmed | **none** | — |
| 9.3 X-CTO/X-Frame/Referrer-Policy/Permissions-Policy | confirmed | **none** | — |
| 9.4 No `console.log` in shipped client bundles | ESLint enforced | **none** | — |
| 9.5 No `.env*` tracked | confirmed | **none** | — |
| 9.6 No secrets in history | scanned, no real-looking secrets | **none** | — |
| 9.7 Static-export | confirmed | **none** | — |
| 9.8 Form endpoints placeholder | confirmed | **none** | — |
| 9.9 Container hardened | needs Dockerfile review | spot-check non-root, multi-stage | **P1** |

## Client Review (axis 10) — **GATED on Mia**

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 10.1 License # confirm | placeholder | — | **GATED** |
| 10.2 Designations confirm | placeholder | — | **GATED** |
| 10.3 Languages confirm | English-only assumed | — | **GATED** |
| 10.4 Display office confirm | null | — | **GATED** |
| 10.5 Years-licensed confirm | null | — | **GATED** |
| 10.6 Photography approval | placeholder SVG hero | — | **GATED** |
| 10.7 Bio approval (50/150/300) | drafts in PAI/MiaSanabria/build-spec/about.md | — | **GATED** |
| 10.8 Markets list approval | 7 in `markets.ts`; matches earlier 6 + Fort Lauderdale parent | — | **GATED** |
| 10.9 Calendar embed URL | placeholder iframe | — | **GATED** |
| 10.10 Form endpoint approval | placeholder | — | **GATED on Mia + Torrey** |

## Launch / Cutover (axis 11) — **DEFERRED**

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 11.1 Mia confirmations captured | not yet | — | **GATED** |
| 11.2 DNS A record flipped | staging only | — | **APPROVAL (Torrey)** |
| 11.3 `NEXT_PUBLIC_SITE_URL` flipped | staging | — | **APPROVAL (Torrey)** |
| 11.4 Domains list updated in Dokploy | staging only | — | **APPROVAL (Torrey)** |
| 11.5 Staging 301 → prod post-cutover | not yet | — | **POST-CUTOVER** |
| 11.6 Sitemap re-submitted in GSC + Bing | not yet | — | **POST-CUTOVER** |
| 11.7 Schema/canonical/sitemap reflect prod host | env-var-driven; will follow | **none** (mechanism in place) | — |
| 11.8 Live route sweep on prod | not yet | — | **POST-CUTOVER** |
| 11.9 TLS valid for `.com` + `www.` | not yet | — | **POST-CUTOVER** |
| 11.10 Klein Morgan SEO bleed handled | not yet (D11 in PRELAUNCH_DEFECTS) | follow-up task | **APPROVAL (Torrey)** |

## Rollback (axis 12)

| Ideal | Current Evidence | Gap | Class |
|-------|------------------|-----|-------|
| 12.1 Code rollback recipe | implicit (`git revert` + push) | document explicitly in `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` | **P1** |
| 12.2 Deploy rollback recipe | Dokploy UI exists | document | **P1** |
| 12.3 DNS rollback | not yet planned | document | **P1** |
| 12.4 Env-var rollback | mechanism exists | document | **P1** |
| 12.5 Analytics injection rollback | flag mechanism not yet added | add `NEXT_PUBLIC_ENABLE_GA` flag at injection time | **P1 (with 7.2)** |
| 12.6 RTO ≤ 10 min | untested | document + dry-run | **P1** |
| 12.7 Build retention ≥ 30 days | Dokploy default unknown | check setting | **P1** |

---

## Summary

| Class | Count |
|-------|------:|
| **closed (none)** | 22 |
| **P0** | 6 |
| **P1** | 30 |
| **P2** | 1 |
| **GATED on Mia** | 14 |
| **APPROVAL (Torrey)** | 6 |
| **AUTOMATE (BSS process candidate)** | 13 |
| **POST-CUTOVER** | 6 |

## Safe-gap actions for this run (Phase 3)

These can land without Mia confirmation, GHL writes, DNS changes, or external account writes. Each is a P0 or P1 marked above.

| # | Action | Touches | Risk |
|---|--------|---------|------|
| S1 | New `scripts/audit-seo.ts`: per-page title/description length, single h1, lang attr, hreflang, og:image, twitter:card, canonical | new script + `package.json` `audit:seo` + `audit:all` chain | low |
| S2 | Extend `scripts/audit-stale-terms.ts` with FREC superlative + steering-risk patterns (warn-only initially) | edit existing script | low (warn mode) |
| S3 | Verify 404 page emits no JSON-LD claiming valid content | spot-check `not-found.tsx` | low |
| S4 | Verify `/privacy/`, `/terms/`, `/accessibility/` bodies contain `Last updated` and target standard | read-only check; minor edit if missing | low |
| S5 | Verify `<html lang>` + hreflang self-link present | layout.tsx | low |
| S6 | Document GHL integration plan as `BSS_REALTOR_GHL_INTEGRATION_PACKET_TEMPLATE.md` (Phase 5) | new docs | none — docs only |
| S7 | Document Search Console + Bing checklist in `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` (Phase 5) | new docs | none — docs only |
| S8 | Document client review pack as `BSS_REALTOR_CLIENT_REVIEW_PACK_TEMPLATE.md` (Phase 5) | new docs | none — docs only |
| S9 | Document fact ledger schema as `BSS_REALTOR_FACT_LEDGER_SCHEMA.md` (Phase 5) | new docs | none — docs only |
| S10 | Document compliance gate as `BSS_REALTOR_COMPLIANCE_GATE.md` (Phase 5) | new docs | none — docs only |

## Out of bounds for this run

- All GATED rows (Mia confirmation): blocked until written confirmation lands.
- All APPROVAL rows: queued for Torrey decision.
- All POST-CUTOVER rows: gated on Torrey's cutover approval.
- Lighthouse / axe-core CI integration: deferred to a separate sprint (would require Lighthouse CI + GitHub Actions wiring; AUTOMATE candidate).
- Live GA4/GTM injection: APPROVAL row 7.2 — code path can be added behind a flag without firing, but the user explicitly excluded "analytics pixel insertion requiring account IDs" — left untouched.
- 301 staging → prod redirect: POST-CUTOVER only.
