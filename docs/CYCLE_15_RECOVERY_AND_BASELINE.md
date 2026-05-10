# Cycle 15 — Recovery + Baseline (2026-05-10)

**Mission:** Cycle 15 · Insights Library + Soft Lead-Capture Architecture + Sitewide Content Weaving.
**Algorithm:** v6.4.0 · Tier E5 · classifier+/effort max.

## Cycle 14 close-state confirmation

| Probe | Result |
|---|---|
| `git status --short` | clean (no uncommitted changes) |
| `git rev-parse HEAD` | `54c9aeae92101c3ce0c551908f056d0035d052bc` |
| `git ls-remote origin main` | `54c9aeae92101c3ce0c551908f056d0035d052bc` (matches HEAD) |
| `git log --oneline -10` head | `54c9aea docs(MIA-SITE-CYCLE-14): closeout — Cato pass + handoff + next-trigger + GPT-5.5 acceptance + final reports` |
| Cycle 14 handoff present | `docs/PRODUCTION_READINESS_HANDOFF_CYCLE_14_MARKET_SYSTEM_AND_FEATURED_PAGE_EXCELLENCE_2026-05-10.md` |
| Cycle 14 next-trigger present | `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_14.md` |

**Verdict:** Cycle 14 cleanly closed. Safe to begin Cycle 15.

## Live HTTP HEAD probe (pre-cycle baseline)

```
HTTP/2 200
etag: "dif3sciprg8w2vtu"
last-modified: Sun, 10 May 2026 15:31:26 GMT
content-length: 134562
date: Sun, 10 May 2026 17:15:54 GMT
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

Cache-busted via `?_=$(date +%s)` per `feedback_caddy_dokploy_cache_bust.md`.

## Specialist-Prereq Probe (OBSERVE phase)

Result of `bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json`:

| Specialist | Available | Resolved capability |
|---|---|---|
| Forge | ✅ | Forge (`/home/torrey/.local/bin/codex` · oauth) |
| Cato | ✅ | Cato (`codex exec --sandbox read-only`) |
| Perplexity | ✅ | PerplexityResearcher (OPENROUTER_API_KEY) |
| Anvil | ❌ | Forge fallback (Kimi K2.6 binary not found) |

Decision logged in ISA Cycle 15 Decisions block.

## Baseline counts

| Surface | Count |
|---|---|
| Top-level routes | 12 (about, accessibility, buyers, contact, dmca, insights, markets, privacy, sellers, terms, valuation, +home) |
| Dynamic market routes | 15 (`getAllMarketRoutes()`) |
| Featured market routes | 8 (`getFeaturedMarketRoutes()`) |
| Insights routes | 1 (only `/insights/` index — no `[slug]` route, no data model) |
| Inline insights articles in current page | 2 (Practice + Lighthouse Point lot profiles, hardcoded JSX) |
| Sitemap entries (pre-cycle) | 12 static + 15 market = 27 total |
| Components in `src/components/` | 18 |
| Schema components | 11 (Organization, WebSite, Person, RealEstateAgent, LocalBusiness, Place, Breadcrumb, Faq, ContactPage, Service, OfferCatalog) |
| Lib modules | 4 (`cn`, `markets`, `mia`, `site`) |
| `src/data/` | does not exist |
| `src/components/cta/` | does not exist |
| Audit scripts | 11 |
| Total docs | 159 markdown files |

## `bun run typecheck` baseline

```
$ tsc --noEmit
(exit 0; no output)
```

## `bun run lint` baseline

```
$ next lint
✔ No ESLint warnings or errors
```

## `bun run audit:all` baseline summary

| Audit | Status |
|---|---|
| `audit:stale` | PASS · 0 stale-string hits |
| `audit:schema` | PASS |
| `audit:links` | PASS · 1360 internal links (post Cycle-14 reverse-link delta) |
| `audit:seo` | PASS |
| `audit:completeness` | PASS · classified WARNs preserved per Cycle 12 review |
| `audit:images` | PASS |
| `audit:brand` | PASS · 12/12 · single canonical email |
| `audit:hero-contrast` | 105 PASS · 0 WARN · 0 FAIL (samples=1) |
| `audit:rendered` | 14 PASS · 1 WARN · 0 FAIL (rendered.probe.viewportSanity is the documented chrome `--dump-dom` mobile-clamp limitation; screenshot channel + GPT-5.5 visual review covers the gap) |

**No FAILs. One expected WARN from Cycle 12 carry-forward classification.**

## What is in scope for Cycle 15

1. New `src/lib/insights.ts` data model + 12 typed posts in `src/data/insights/`.
2. `/insights/` rebuild (replace inline 2-article hardcode with premium 12-post index) + new `/insights/[slug]/` editorial route.
3. `src/components/cta/` directory with 7 reusable lead-capture components + lead-capture architecture doc.
4. 4 thank-you routes (`/thank-you`, `/thank-you/valuation`, `/thank-you/buyer-brief`, `/thank-you/market-brief`).
5. Sitewide weaving (homepage Insights section, markets index module, featured market page links, buyers/sellers/valuation/contact CTAs).
6. `scripts/audit-insights.ts` + SEO/AEO matrix doc.
7. Forge separate-context VERIFY (Rule 2b) + Cato cross-vendor compliance audit (Rule 2a, mandatory at E5).
8. Deploy + cache-busted live verification.
9. Production-readiness scorecard update (preserves classification of unchanged external blockers).
10. Skill / process upgrade to v0.4.0; handoff + next-session trigger.

## What is OUT of scope for Cycle 15

- GHL form/webhook wiring (forms route to existing pages or new thank-you pages; no production POSTs).
- TCPA mechanics (no consent flows shipped — legal-counsel gated).
- License rendering (Card 1 still PRINCIPAL_DECISION_PENDING).
- REALTOR®/MLS graphic swap (Cards 4+5 still PRINCIPAL_DECISION_PENDING).
- Branded email decision (Card 2 still PRINCIPAL_DECISION_PENDING).
- Analytics provider swap.
- DNS/.com cutover (still principal-decision + scheduling-pending).
- CMS install (Payload/Postgres/Decap absent).
- Legal-page rewrite.
- Hero/SiteFooter modifications (Cycle 14 + earlier locked).
- New colors/fonts/glassmorphism (brand contract preserved).
- Spanish hreflang.
- Lead-magnet PDF.
- Cycle 14 reverse-link curation, DRY refactor, comparisonContext content, or Ultimate Standard reopening.

## Intent reframe — "1 post per month over the last 12 months"

Principal asked about "1 post per month over the last 12 months." Cycle 15 interprets this honestly:

- The 12 posts are **created now** (Q2 2026) as a 12-part evergreen market-cycle library.
- `datePublished` and `dateModified` are **honest** — both reflect current publication, not fabricated history.
- Each post carries an editorial `topicMonth` field (e.g. `"January Reset"`, `"July Dockage Season"`) labeling it as a 12-month guide series.
- This positions the library as a comprehensive evergreen reference cycle, not a backdated archive.

This decision is captured in `docs/CYCLE_15_INSIGHTS_AND_LEAD_CAPTURE_STRATEGY.md` and enforced by `audit:insights` (no `datePublished` more than 7 days in the past at audit time).
