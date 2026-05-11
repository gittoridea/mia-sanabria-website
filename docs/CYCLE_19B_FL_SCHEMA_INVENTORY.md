# Cycle 19B-FL — Schema / AEO Inventory

> Snapshot of every JSON-LD emission site across the static export, with
> proposed audit extensions and known duplicates carried into Cycle 19C.

## Global emissions (every route)

| Schema | Component | Source file |
|---|---|---|
| `Organization` | `<OrganizationSchema />` in `RootLayout` | `src/components/schema/OrganizationSchema.tsx` |
| `WebSite` | `<WebSiteSchema />` in `RootLayout` | `src/components/schema/WebSiteSchema.tsx` |

These two emit on **every** built page via `src/app/layout.tsx`.

## Per-route emissions

| Route | Schemas emitted (excluding global Org + WebSite) |
|---|---|
| `/` | Person, RealEstateAgent, BreadcrumbList |
| `/about/` | Person, RealEstateAgent, BreadcrumbList |
| `/contact/` | Person, RealEstateAgent, LocalBusiness, BreadcrumbList |
| `/buyers/` | RealEstateAgent, Service, BreadcrumbList |
| `/sellers/` | RealEstateAgent, Service, BreadcrumbList |
| `/valuation/` | Service, BreadcrumbList |
| `/markets/` | RealEstateAgent, BreadcrumbList |
| `/markets/[slug]/` (generic) | RealEstateAgent, Place, FAQPage, BreadcrumbList |
| `/markets/fort-lauderdale/` (V2 component) | RealEstateAgent, Place, BreadcrumbList — **duplicates the generic markets/[slug] route emission** (see Known Duplicates below) |
| `/insights/` | BreadcrumbList, Blog (via `<JsonLd>`) |
| `/insights/[slug]/` | Article (via `<JsonLd>`), BreadcrumbList, FAQPage (where the post has faqs) |
| `/thank-you/`, `/thank-you/{intent}/` | BreadcrumbList |
| `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` | BreadcrumbList |
| `/downloads/{magnet}/` (Cycle 19B-FL **new**, noindex) | none — print-friendly source for PDFs, intentionally schema-light |
| `/404`, `/_not-found/` | none |

## Cycle 19B-FL audit posture

| Audit | Coverage |
|---|---|
| `audit:schema` (existing) | Every emitted JSON-LD parses with `@context` + `@type`. After Cycle 19B-FL build: **247 blocks across 49 pages, 0 failures.** |
| `audit:trust-row` (new) | 13 routes verified to render the brokerage trust marks above `<main>` in DOM order, NOT only inside the shared footer (closes Cato F6 / TP-13). |
| `audit:lead-magnets` (new) | 3 PDFs + 3 print-friendly HTML sources verified to carry disclaimer block + use-agreement block + brokerage license # + LPT Realty LLC + Fort Lauderdale download CTAs on /markets/fort-lauderdale/. |
| `audit:no-fabrications` (new) | `out/` HTML scanned for off-market guarantees, transaction-volume / years-experience / languages fabrications, response-time claims, and the principal-gated "Same-business-day response" phrase. Cycle 19B-FL build: 0 hits. |
| `audit:stale` (extended) | New FORBIDDEN entry catches case-insensitive "evergreen" anywhere in `out/`. Verified clean post-Cycle-19B-FL. |
| `audit:fort-lauderdale-standard` (existing) | Cycle 19B-FL preserves the 31 V3+V4 markers as a regression guard. |

## Known duplicates — Cycle 19C cleanup candidate

The Fort Lauderdale market page emits `RealEstateAgent` + `Place` + `BreadcrumbList` twice on the rendered page because `src/components/markets/FortLauderdaleV2.tsx` includes its own `<RealEstateAgentSchema />`, `<PlaceSchema />`, and `<BreadcrumbSchema />` AND the parent `src/app/markets/[slug]/page.tsx` already emits the same three for any market slug. This produces 6 JSON-LD blocks on the FL route where 3 would suffice. `audit-schema` accepts it (all blocks parse), but the noise is real.

**Recommendation for Cycle 19C:** decide which layer owns the per-route schema emission (probably the dynamic `/markets/[slug]/page.tsx`) and remove the duplicate emitters from `FortLauderdaleV2.tsx`. Add `audit-schema-no-duplicates` extension to catch the regression.

## What was intentionally **not** introduced this cycle

- **No `Review`, `AggregateRating`, `Rating`, `Award`, `priceRange`** — these schema types require verified inputs (reviews, awards, etc.) that the principal has not approved as ready-to-display. The `priceRange` term is also banned by `audit:stale` for the same reason.
- **No `knowsLanguage` / `knowsAbout` on Person** — language and topic claims need principal confirmation; the existing `MIA.unverified.languages = ["English"]` stays a placeholder until Mia confirms in writing.
- **No `Offer`, `OfferCatalog`** for the new lead magnets — these are not commerce products. The PDFs are free downloads with no implicit transaction.

## What ships this cycle

The schema layer added **zero new emitters**; Cycle 19B-FL is a content + audit cycle, not a schema expansion cycle. The 247 JSON-LD blocks the build produces are the same shape as Cycle 19A-M plus the 3 new `/downloads/{slug}/` routes which intentionally emit nothing (their PDF artifact is the user-facing deliverable; the HTML source is noindex).

Cycle 19C is the appropriate cycle for the schema-duplicate cleanup and any restraint expansion (`CollectionPage` on `/markets/`, `WebPage` enrichment on legal pages, etc.) — none of which is blocking the current deploy.
