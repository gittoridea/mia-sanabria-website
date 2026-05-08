# SEO / AEO / Market Authority Matrix — Mia Sanabria Realtor Site

**Generated:** 2026-05-08 PM (post markets-V3 sprint)
**Live URL:** https://miasanabriarealtor.trueidea.com
**Source of truth:** `src/lib/markets.ts`, `src/app/markets/[slug]/page.tsx`, `src/app/markets/page.tsx`

This matrix is the per-route SEO/AEO authority map. Every public route should have a primary intent, an AEO-ready answer block, schema saturation, and an internal-link cluster that strengthens topic authority. Refresh each cycle.

## Core pages

| Route | Primary intent | Audience | H1 | Metadata | AEO answer | FAQ | Schema | Internal links |
|---|---|---|---|---|---|---|---|---|
| `/` | Brand + lead capture (luxury concierge framing) | Eastern FtL waterfront/luxury buyers + sellers | "Fort Lauderdale REALTOR® …" | unique 60ch | implicit (hero + IntentRouter) | yes (homepage FAQ block) | WebSite + Person + RealEstateAgent + LocalBusiness + BreadcrumbList + FAQPage | About, Markets, Buyers, Sellers, Valuation, Insights |
| `/about/` | Trust + relationship | Researching buyers/sellers | "Personal by design, not by claim." | unique | implicit (bio paragraphs) | n/a | Person + RealEstateAgent + BreadcrumbList | Home, Contact, Markets |
| `/buyers/` | Buyer conversion path | Luxury buyers | (intent-specific H1) | unique | implicit (process timeline) | yes | Service + BreadcrumbList + FAQPage | Markets, Valuation, Contact |
| `/sellers/` | Seller conversion path | Premium sellers | (intent-specific H1) | unique | implicit | yes | Service + BreadcrumbList + FAQPage | Valuation, Contact, Markets |
| `/valuation/` | Valuation lead capture | Sellers + curious owners | (valuation H1) | unique | implicit | yes | Service + BreadcrumbList + FAQPage | Sellers, Contact |
| `/markets/` | Market hub navigation | All audiences | "Featured Markets" | unique | grouped intro paragraphs | n/a | BreadcrumbList + RealEstateAgent | all 13 market routes |
| `/contact/` | Conversion | All audiences | (contact H1) | unique | n/a | yes | Person + RealEstateAgent + ContactPage + LocalBusiness + BreadcrumbList + FAQPage | Home, About, Valuation |
| `/insights/` | Topic authority + recurring crawl | All audiences | "Insights" | unique | per-essay AEO blocks | per-essay | Article + FAQPage + BreadcrumbList (per essay) | Home, Markets, Buyers/Sellers |

## Market pages — primary service markets

| Route | Primary search intent | Secondary intent | County | AEO block | FAQ | Schema | Internal-link targets |
|---|---|---|---|---|---|---|---|
| `/markets/fort-lauderdale/` | Fort Lauderdale luxury real estate | Eastern FtL waterfront homes | Broward | ✅ 75–125 words, waterfront-focused | ✅ 5 market-specific | Place + BreadcrumbList + RealEstateAgent + FAQPage | las-olas-isles, harbor-beach, victoria-park, coral-ridge |
| `/markets/boca-raton/` | Boca Raton luxury homes | Mediterranean Revival, country club, beach access | Palm Beach | ✅ | ✅ | full | delray-beach, palm-beach |
| `/markets/delray-beach/` | Delray Beach luxury homes | Atlantic Avenue, Pineapple Grove, beach blocks | Palm Beach | ✅ | ✅ | full | boca-raton, palm-beach |
| `/markets/palm-beach/` | Palm Beach estates | Worth Avenue corridor, oceanfront, North End/South End | Palm Beach | ✅ | ✅ | full | boca-raton, delray-beach |
| `/markets/lighthouse-point/` | Lighthouse Point waterfront homes | Hillsboro Inlet, no-fixed-bridge ocean access, finger isles | Broward | ✅ | ✅ | full | hillsboro-mile, sea-ranch-lakes, harbor-beach |
| `/markets/hillsboro-mile/` | Hillsboro Mile oceanfront estates | A1A barrier-island ocean-to-Intracoastal trophy properties | Broward | ✅ | ✅ | full | lighthouse-point, sea-ranch-lakes |
| `/markets/sea-ranch-lakes/` | Sea Ranch Lakes private village | Gated coastal village, private beach club | Broward | ✅ | ✅ | full | lighthouse-point, hillsboro-mile, fort-lauderdale |

## Market pages — Eastern Fort Lauderdale neighborhoods

| Route | Primary search intent | Secondary intent | County | AEO block | FAQ | Schema | Internal-link targets |
|---|---|---|---|---|---|---|---|
| `/markets/coral-ridge/` | Coral Ridge waterfront homes | Coral Ridge Country Club adjacent, finger isles | Broward | ✅ | ✅ | full | fort-lauderdale, victoria-park, lighthouse-point |
| `/markets/victoria-park/` | Victoria Park real estate | walkable in-town FtL, Las Olas adjacent | Broward | ✅ | ✅ | full | fort-lauderdale, rio-vista, las-olas-isles |
| `/markets/rio-vista/` | Rio Vista luxury homes | Eastern FtL deepwater single-family, walkable Las Olas | Broward | ✅ | ✅ | full | las-olas-isles, harbor-beach, fort-lauderdale, victoria-park |
| `/markets/harbor-beach/` | Harbor Beach gated luxury | private beach club, Eastern FtL trophy estates | Broward | ✅ | ✅ | full | rio-vista, las-olas-isles, fort-lauderdale |
| `/markets/las-olas-isles/` | Las Olas Isles waterfront homes | finger isles, walkable Las Olas Boulevard | Broward | ✅ | ✅ | full | seven-isles, rio-vista, harbor-beach, fort-lauderdale |
| `/markets/seven-isles/` | Seven Isles deepwater estates | yacht-capable, no-fixed-bridge ocean access | Broward | ✅ | ✅ | full | las-olas-isles, harbor-beach, rio-vista |

## Topic authority clusters

The internal-link graph forms three reinforcing clusters. The data lives in `Market.internalLinks[]` so all cross-references are typed against `MarketSlug` — a typo would fail typecheck, not silently break authority.

**Cluster A — Eastern Fort Lauderdale waterfront / luxury (core niche):**
fort-lauderdale ↔ las-olas-isles ↔ seven-isles ↔ rio-vista ↔ harbor-beach ↔ victoria-park ↔ coral-ridge

**Cluster B — Northern Broward coastal:**
lighthouse-point ↔ hillsboro-mile ↔ sea-ranch-lakes ↔ fort-lauderdale (cross-link to anchor)

**Cluster C — Adjacent Palm Beach County primary luxury markets:**
boca-raton ↔ delray-beach ↔ palm-beach

The clusters are explicit guardrails — Cluster A uses Eastern Fort Lauderdale neighborhood vocabulary; Cluster C never describes itself as Broward; Cluster B is the northern-Broward coastal corridor.

## Schema saturation summary

- **148 JSON-LD blocks** across 27 generated pages (audit:schema)
- Per-market: PlaceSchema + BreadcrumbSchema + RealEstateAgentSchema + FaqSchema (FAQPage) — full graph
- All blocks parse + carry `@context` + `@type`
- Zero unverified-fact assertions in JSON-LD (license # null-guarded; designations [] empty array; languages = English only; no displayOffice)

## AEO posture

Every market page emits a 75–125 word natural-language paragraph answering "what is [market] known for in luxury real estate." The paragraph is built from the `aeoAnswer` field on each `Market` entry. The metadata description is built deterministically from the first sentence of the AEO answer + a Mia voice tail clamped to 158 chars (`buildMetaDescription` in `src/app/markets/[slug]/page.tsx`).

Why this works for AEO: when an LLM-driven search engine asks "What is Las Olas Isles known for?" the cleanest possible answer is in the page body, in plain prose, with the same entity name and concrete distinguishing facts (deepwater finger isles, walkable Las Olas Boulevard, no fabricated stats). FAQPage schema markup lifts the per-question answers.

## Compliance posture

All 13 market pages inherit the locked footer trust strip (LPT logo + REALTOR® logo + EHO logo with explicit text labels) + IDX disclaimer + brokerage disclosure + EHO statement + 4 legal-policy links. No market page inlines unverified claims. Geographic guardrails enforced at the data layer (`Market.county` is the literal-union type `"Broward County" | "Palm Beach County"`).

## Remaining gap

- **Image dim/alt audit** still warns 27 issues — all are `next/image` with `fill` prop where width/height aren't direct attributes. CLS is protected via aspect-ratio CSS; gap is cosmetic.
- **Form classification** still warns mailto-only — gated on principal supplying GHL BSS sub-account webhook URL. Out of scope this cycle.
- **`completeness.markets.wordFloor`** message still says "all 7 market pages" — hardcoded "7" in the audit script; not a content gap, audit-script bug to fix in a later cycle.
- **`/insights/` topic-cluster posts** — could add Eastern FtL waterfront essay, Boca Raton Mediterranean Revival essay, Delray Beach Atlantic Avenue essay, expired-listings angle. Deferred to next cycle.

## Cross-references

- `src/lib/markets.ts` — Market type + 13 entries
- `src/lib/mia.ts` — MarketSlug literal union
- `src/app/markets/[slug]/page.tsx` — 8-section template with FaqSchema emission
- `src/app/markets/page.tsx` — Primary vs Eastern FtL neighborhoods grid
- `docs/BRAND_SYSTEM_CONTRACT.md` — locked visual system
- `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` — per-market PASS/PARTIAL/FAIL/REVIEW scorecard
- `reports/audit-completeness.md` — structural-drift audit
