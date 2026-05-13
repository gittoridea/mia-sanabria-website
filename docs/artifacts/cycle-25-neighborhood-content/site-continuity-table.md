# Cycle 25 — Site Continuity Table

Per the Cycle 25 mission Phase 5 brief. Status post-implementation of the seven new approved-neighborhood pages.

Legend: ✅ already continuous · 🔧 fix-now in this cycle · 🟡 defer (Mia content review) · 🔒 blocked (external owner)

| Area / route | Current continuity issue | Status | Action taken | Evidence |
|---|---|---|---|---|
| Homepage hero (`<Hero>` in `src/app/page.tsx`) | Cycle 24 H1 (two-line "South Florida Lifestyle / Home Search") + sub-line ("Discreet, local guidance for Southeast Florida luxury homeowners, absentee owners, and qualified buyers — from a small, deliberate practice.") | ✅ | None — already aligned with broader 9-city framing | `src/app/page.tsx:85-107` |
| Homepage `HeroSearch` | `<select>` options already list all 9 Mia-approved neighborhoods | ✅ | None — picks up all 9 from `MIA_APPROVED_NEIGHBORHOODS` automatically | `src/components/HeroSearch.tsx:75-81` |
| Homepage `NeighborhoodsRail` | Suffix label and link target flip from "Search" / search-anchor to "Guide" / `/markets/<slug>/` for the 7 newly-paged cities | ✅ | Flipped `hasPage: true` in `MIA_APPROVED_NEIGHBORHOODS` for all 7; component reactive | `src/lib/mia.ts` MIA_APPROVED_NEIGHBORHOODS; `src/components/NeighborhoodsRail.tsx:40-58` |
| Homepage `AnswerFirst` body | References "Eastern Fort Lauderdale, with adjacent practice in Boca Raton and Delray Beach" — narrower than 9-city Broward set | 🟡 | Deferred — Mia voice copy; queued for Cycle 26 Mia content review session | `src/app/page.tsx:121-126` |
| Homepage `HOME_FAQ` first answer | "Mia is based in Fort Lauderdale and serves clients across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. Featured market guides cover Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach." — narrower than 9-city set, references East-FL featured-markets pager | 🟡 | Deferred — Mia voice copy; queued for Cycle 26 Mia content review session | `src/app/page.tsx:28-49` |
| Homepage `HOME_VALUE_PROPS` "Brokerage relationships" | "Quiet introductions when Mia's brokerage and ownership relationships surface a fit across Eastern Fort Lauderdale, Boca Raton, and Delray Beach." — narrower than 9-city set | 🟡 | Deferred — Mia voice copy; queued for Cycle 26 Mia content review session | `src/app/page.tsx:51-68` |
| Homepage `FeaturedMarketsPager` | Currently East-FL waterfront 12 from `HOMEPAGE_FEATURED_ORDER`; Mia not yet decided to swap to Mia-approved-9 | 🟡 | Deferred per Cycle 24 R2 blocker C3 — requires Mia approval on SEO consequence of demoting East-FL waterfront homepage emphasis | `src/lib/mia.ts` HOMEPAGE_FEATURED_ORDER |
| `/markets/` hub hero subhead | "Each market lives by its own architectural and social logic. Representation begins with fluency in the place — the dock, the country club, the canopy, the avenue." — strong copy weighted toward Eastern FL cohort | 🟡 | Deferred — could be rebalanced to include "the inlet, the equestrian trail, the parkway" but is Mia editorial decision | `src/app/markets/page.tsx:62-69` |
| `/markets/` hub "primary" section heading | "South Florida cities and towns." — already accurate; now includes 14 primary markets | ✅ | None — heading still factually correct; layout responsive | `src/app/markets/page.tsx:72-87` |
| `/markets/` hub Eastern FL cluster section | Unchanged; still 9 markets (8 Eastern FL + Hillsboro Mile) | ✅ | None | `src/app/markets/page.tsx:89-104` |
| `/markets/fort-lauderdale/` | Existing FortLauderdaleV2 page; not modified | ✅ | None | `src/app/markets/[slug]/page.tsx:110-118` |
| `/markets/pompano-beach/` | Existing Pompano Beach page; not modified — remains the gold-standard template | ✅ | None | `src/lib/markets.ts:1101-1174` |
| `/markets/deerfield-beach/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` deerfield-beach entry |
| `/markets/hollywood/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` hollywood entry |
| `/markets/plantation/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` plantation entry |
| `/markets/weston/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` weston entry |
| `/markets/coral-springs/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` coral-springs entry |
| `/markets/davie/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` davie entry |
| `/markets/sunrise/` | NEW — Cycle 25 | 🔧 | Added Market entry; render placeholder hero/OG; page generated | `src/lib/markets.ts` sunrise entry |
| Legacy East-FL waterfront market pages (Coral Ridge, Victoria Park, Bay Colony, etc.) | Mia "retain / 301 / deprecate" decision still pending per Cycle 24 R2 C2 | 🟡 | Deferred — Mia review; all legacy markets remain in place for SEO continuity per mission boundary "avoid destructive removal unless safe" | `src/lib/markets.ts` |
| `/buyers/` | No edit required; CTAs target this page from new city asides | ✅ | None | `src/app/buyers/page.tsx` |
| `/sellers/` | No edit required; CTAs target this page from new city asides | ✅ | None | `src/app/sellers/page.tsx` |
| `/about/` | No content drift from Cycle 25; About-page service-area sentence already broadly accurate | ✅ | None | `src/app/about/page.tsx` |
| `/contact/` | No edit; CTAs target this page | ✅ | None | `src/app/contact/page.tsx` |
| `/insights/` index | Insights existing posts reference Eastern Fort Lauderdale and Palm Beach County markets; no Insights post yet references the seven new cities | 🟡 | Deferred — adding city-specific Insights posts is a follow-on content cycle; for now `RelatedInsightsModule` silently omits on the new city pages where no Insights post tags them | `src/components/insights/RelatedInsightsModule.tsx` |
| Footer | Reads `FOOTER_NAV` from `site.ts`; "Featured Markets" link still points to `/markets/` hub | ✅ | None | `src/lib/site.ts` FOOTER_NAV |
| Form/search forms | HeroSearch + GHL-disabled (mailto fallback) — no edit | ✅ | None | `src/components/HeroSearch.tsx` |
| Metadata | Each new Market entry feeds `generateMetadata` automatically | ✅ | None — verified via build | `src/app/markets/[slug]/page.tsx:44-72` |
| Schema (PlaceSchema, BreadcrumbSchema, FaqSchema, RealEstateAgentSchema) | All schema components emit per-market data driven from Market type | ✅ | None — verified via build + `audit:schema` | `src/components/schema/*` |
| Downloads / lead magnets | Three existing PDFs target Fort Lauderdale waterfront, luxury sellers, and waterfront valuation prep; no Cycle 25 edits | ✅ | None | `src/app/downloads/[slug]/page.tsx` |
| `src/lib/site.ts` | Already broadened to "Southeast Florida" in Cycle 24 R2 (description + tagline). `SITE.title` preserves "Fort Lauderdale REALTOR®" framing | ✅ | None | `src/lib/site.ts:36-48` |
| Route labels vs slugs | Nav labels "Neighborhoods" / "Blog" → routes `/markets/` / `/insights/` (Cycle 24 decision retained for SEO continuity) | ✅ | None — defer route slug rename to a separate SEO-redirect cycle | `src/lib/site.ts:67-77` |
| Bridge search scaffold | Stays scaffold-only per F1 decision; no Cycle 25 edits | 🔒 | Blocked — Torrey architecture decision pending | `src/lib/bridge.ts` |
| Testimonial capture plan | Still no testimonials added; `docs/mia-testimonial-capture-plan.md` workflow stands | 🔒 | Blocked — counsel + Mia + Torrey gate | `docs/mia-testimonial-capture-plan.md` |
| `MeetMia.tsx` "most coveted" copy | Cycle 22-R1 flagged for Mia decision | 🟡 | Deferred — Mia voice review queued for Cycle 26 | `src/components/MeetMia.tsx` |
| `audit:mobile-readability:capture` script hardcoded output path | `scripts/audit-mobile-readability.ts` writes to `docs/artifacts/cycle-19A-M/mobile-readability/after/` — overwrites Cycle 19A-M baselines if run as-is | 🟡 | Deferred — adding `--cycle=` / `--outDir=` flag is a tooling cycle of its own; not in Cycle 25 scope | `scripts/audit-mobile-readability.ts:289` (per Cycle 24 R2 note) |
| Legal pages (`/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`) | Cycle 24 R2 qa-gate carries 4 `high` warnings (CATO-01..08 counsel-gated) | 🔒 | Blocked — counsel review required | `reports/qa-gate-matrix.json` |
| GHL endpoint wiring | Forms still use mailto fallback | 🔒 | Blocked — Torrey + GHL UI work (see Cycle 24 R2 E-block) | `src/app/contact/page.tsx` |
| DNS / canonical-domain cutover | `miasanabria.com` not yet live; staging on `miasanabriarealtor.trueidea.com` | 🔒 | Blocked — Torrey + DNS provider | `src/lib/site.ts:14-17` |

## Counts

- ✅ Already continuous: 14 surfaces
- 🔧 Fix-now (Cycle 25): 7 (the seven new market pages)
- 🟡 Defer (Mia content review): 8 surfaces (HOME_FAQ, HOME_VALUE_PROPS, AnswerFirst body, /markets/ hero subhead, Featured Markets pager, MeetMia "most coveted" copy, /markets/ "most coveted" copy variant, legacy markets retain-vs-redirect, insights post coverage for 7 new cities, mobile-readability output path)
- 🔒 Blocked (external): 5 surfaces (legal pages, GHL, Bridge, DNS, testimonials)
