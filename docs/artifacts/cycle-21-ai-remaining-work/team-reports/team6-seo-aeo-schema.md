# Team 6 — SEO, AEO, Local SEO, and Schema

> Cycle 21-AI-REMAINING-WORK · Read-only audit · 2026-05-11
> Live staging: https://miasanabriarealtor.trueidea.com/

## Audit baseline (gates)

- `bun run audit:schema` — scanned 49 pages, 247 JSON-LD blocks, all parse with `@context + @type`. PASS.
- `bun run audit:seo` — 0 warnings, no errors across `out/`. PASS.
- `bun run audit:links` — 2425 internal links checked, all resolve. PASS.
- `bun run audit:insights` — 547 PASS / 0 WARN / 0 FAIL on 12 posts.
- Robots: staging emits `User-Agent: * / Disallow: /` and root metadata sets `index:false, follow:false` via `IS_STAGING`. PASS.
- Sitemap: 40 URLs (12 static + 16 markets + 12 insights). Honest `lastModified`. PASS.
- Canonicals: trailing-slash, absolute, present on every page. PASS.
- Hreflang: explicit `<link rel="alternate" hrefLang="en-US">` + `x-default` rendered in layout (works around Next.js 15 metadata.alternates.languages defect). PASS.

The repo has unusually strong baseline coverage. Findings below are coherence and AEO-optimization issues, not breakage.

---

## Section 1 — Metadata table

| Route | Title (effective) | Description | Canonical | OG image | Issues |
|---|---|---|---|---|---|
| `/` | Fort Lauderdale REALTOR® \| Waterfront & Luxury Homes | Eastern Fort Lauderdale, Boca Raton, and Delray Beach … | `/` | `/og-default.jpg` | Hero text disagrees with metadata description (Pompano Beach vs Delray Beach) — see I-21A-S6-001 |
| `/about/` | About Mia — Southeast Florida Luxury REALTOR® \| Mia Sanabria | LPT Realty, Eastern FL/Boca/Delray | `/about/` | `/mia-og.jpg` | OK |
| `/buyers/` | Buying — Private Buyer Representation \| Mia Sanabria | Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach | `/buyers/` | `/og-buyers.jpg` | OK |
| `/sellers/` | Selling — Elevated Marketing & Strategy \| Mia Sanabria | Tailored SE FL marketing | `/sellers/` | `/og-sellers.jpg` | OK |
| `/valuation/` | Home Valuation — Southeast Florida \| Mia Sanabria | Complimentary tailored valuation | `/valuation/` | `/og-valuation.jpg` | OK |
| `/contact/` | Contact Mia Sanabria — Private Consultation \| Mia Sanabria | FL REALTOR® with LPT Realty | `/contact/` | `/og-contact.jpg` | OK |
| `/markets/` | Featured Markets — Southeast Florida \| Mia Sanabria | South FL cities + clusters | `/markets/` | `/og-default.jpg` | Generic OG (no markets-specific image) — P3 |
| `/insights/` | Insights — SE Florida Luxury Real Estate \| Mia Sanabria | Twelve field-note briefs | `/insights/` | `/og-default.jpg` | Generic OG (no insights-index image) — P3 |
| `/markets/{slug}/` × 16 | `{Name} Luxury Real Estate \| Mia Sanabria` | First AEO sentence + LPT tail | `/markets/{slug}/` | `/og-markets/{slug}.jpg` | All 16 OG images present. OK |
| `/insights/{slug}/` × 12 | `post.seoTitle` (absolute) | `post.seoDescription` | `/insights/{slug}/` | `/og-insights/{slug}.jpg` | All 12 OG images present. OK |
| `/privacy/` `/terms/` `/accessibility/` `/dmca/` | per page | per page | per route | `/og-default.jpg` | OK |
| `/thank-you/`, `/thank-you/buyer-brief/`, `/thank-you/market-brief/`, `/thank-you/valuation/` | per page | per page | per route | none | `robots: index:false, follow:true` — correct (post-conversion noindex). OK |
| `/downloads/{slug}/` × 3 | magnet title | print-friendly source | per route | none | `robots: index:false, follow:false, nocache:true` — correct. OK |
| `/404/` (not-found) | Page Not Found · Mia Sanabria, REALTOR® | … | `${SITE.url}/404/` | none | Canonical to non-existent `/404/` path — harmless under noindex, but cosmetically wrong — P3 |

---

## Section 2 — Schema findings

| @type | Routes | Valid? | Visible match? | Issue |
|---|---|---|---|---|
| `Organization` (layout) | every | YES | n/a | Organization name is `LPT Realty LLC` and is set as `WebSite.publisher` for `miasanabriarealtor.com`. LPT Realty does not publish this site — see I-21A-S6-002 |
| `WebSite` (layout) | every | YES | n/a | Publisher → `#organization` (= LPT Realty). Coherence issue (above). |
| `Person` (#person) | `/`, `/about/`, `/contact/` | YES | YES | OK |
| `RealEstateAgent` (#realestate-agent) | every page (deduped by @id) | YES | YES | `areaServed` declares "Eastern Fort Lauderdale" etc. as `AdministrativeArea` — these are colloquial, not administrative. See I-21A-S6-003 |
| `LocalBusiness` (#localbusiness) | `/contact/` only | YES | YES | OK |
| `ContactPage` | `/contact/` | YES | YES | OK |
| `BreadcrumbList` | every content page | YES | YES (visual breadcrumbs absent — schema-only is permitted) | OK |
| `Place` (with `GeoCoordinates` + `containedInPlace`) | every `/markets/{slug}/` | YES | YES | All 16 have lat/lng + county. PASS. |
| `Service`, `OfferCatalog`, `Offer` | `/buyers/`, `/sellers/`, `/valuation/` | YES (parse) | YES | `Offer.itemOffered.provider` declares `@type: RealEstateAgent` but `@id: #person`. Type/id mismatch. See I-21A-S6-004 |
| `Article` (insights) | every `/insights/{slug}/` | YES | YES | `@type: Article` is fine, but `BlogPosting` more semantically precise for editorial series — P3 advisory only |
| `FAQPage` (Faq component) | every page with Faq | YES | YES (built from same items array) | See I-21A-S6-005 — 5 pages emit **2 FAQPage entities** |
| `FAQPage` (AnswerFirst) | `/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/` | YES | YES | Q is rendered as `<h2>`, A as `<p>` directly below. Visible match confirmed. Conflicts with page-level FAQ — I-21A-S6-005. |
| `FAQPage` on insight `/insights/{slug}/` | every insight | YES | YES | Schema from `post.faqs`; visible from same array. PASS. However, insight `aeoQuestion`/`aeoAnswer` (the most valuable Q+A on the page) is NOT in the FAQPage. See I-21A-S6-006 |
| `WebPage` | `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` | YES | YES | OK |
| `Blog` (insights index) | `/insights/` | YES | YES | OK |

### Schema-visible FAQ parity verification

Verified by code-path inspection: every FAQ schema component (`FaqSchema`, `AnswerFirst`, `Article.faqs`) builds JSON-LD from the **same in-source array** that renders visible text. Mismatch is structurally prevented (single source of truth). PASS for parity. The only structural issue is **count** (Section 5 below).

### FortLauderdaleV2 — gold-standard structural check

- Schemas emitted: `RealEstateAgent`, `Place` (with `GeoCoordinates` + `containedInPlace`), `BreadcrumbList`, `FAQPage` (11 Qs, single emission). PASS.
- Visible/schema FAQ parity: items prop = `[...market.faqs, ...FORT_LAUDERDALE_V2_FAQS]` → schema reads same array. PASS.
- 11 FAQs render as `<details>` accordion in same order as schema. PASS.
- Should remain the model for other markets.

---

## Section 3 — AEO direct-answer findings

| Route | AnswerFirst present? | Format consistent? | Schema emit? | Issue |
|---|---|---|---|---|
| `/` | YES | YES (Q as `<h2>`, A as `<p>`) | FAQPage (1Q) | Hero/AnswerFirst/SITE.description name 3 different market triples — content coherence issue |
| `/about/` | YES | YES | FAQPage (1Q) | OK |
| `/buyers/` | YES | YES | FAQPage (1Q) | OK |
| `/sellers/` | YES | YES | FAQPage (1Q) | OK |
| `/valuation/` | YES | YES | FAQPage (1Q) | OK |
| `/contact/` | NO | n/a | — | AEO direct-answer block absent — P3 candidate for completion |
| `/markets/` | NO | n/a | — | AEO direct-answer block absent — P3 candidate for completion |
| `/markets/{slug}/` (non-FL) | Embedded ("Honest summary" `<p>`) | YES (sub-pattern) | Place + FAQPage from market.faqs | Uses an inline `<p>{market.aeoAnswer}</p>` instead of AnswerFirst component → no FAQPage emit of that direct Q/A. Gap. See I-21A-S6-007 |
| `/markets/fort-lauderdale/` (FL V2) | Embedded ("Executive AEO answer" block) | YES | Place + FAQPage from 11 Qs | OK |
| `/insights/{slug}/` | Embedded ("Quick answer" `<aside>` with aeoQuestion/aeoAnswer) | YES | Article + FAQPage from post.faqs | aeoQuestion/aeoAnswer NOT included in FAQPage. See I-21A-S6-006 |
| `/insights/` | NO | n/a | Blog | OK (index page) |

**Pattern observed:** AEO direct-answer copy is present in the visible content on 23+ pages, but the Q+A Schema.org binding is only emitted on the 5 hub pages that use `<AnswerFirst>`. The 16 market pages render an `<h2>` + `<p>` AEO block but do not bind it as `Question`/`Answer` JSON-LD. This is the single largest AEO opportunity in the codebase.

---

## Section 4 — Internal-link findings

### Market internal-link incoming counts (audit-links is clean)

```
fort-lauderdale=10  las-olas-isles=7  harbor-beach=6  coral-ridge=5  bermuda-riviera=5
bay-colony=4  rio-vista=4  lighthouse-point=4  hillsboro-mile=3  delray-beach=3
boca-raton=3  victoria-park=3  sea-ranch-lakes=2  palm-beach=2  pompano-beach=1  seven-isles=1
```

- No orphan markets. All 16 referenced ≥1 time.
- Thin: `pompano-beach` (1 incoming), `seven-isles` (1 incoming) — both new or specialty. P3 content gap, not schema.

### Insight internal-link incoming counts

```
fort-lauderdale-waterfront-buyer-guide=9
private-buyer-brief-defining-the-search=5
dockage-seawalls-bridge-clearance-route-to-inlet=4
bay-colony-and-bermuda-riviera-private-waterfront=3
preparing-waterfront-residence-private-market-conversations=3
positioning-luxury-waterfront-eastern-fort-lauderdale=2
las-olas-vs-seven-isles-vs-harbor-beach=2
boca-raton-luxury-buyers-club-beach-waterfront=2
delray-beach-luxury-buyers-walkability-beach-waterfront=2
why-automated-valuations-miss-luxury-waterfront=2
coral-ridge-victoria-park-rio-vista=1
lighthouse-point-sea-ranch-lakes-hillsboro-mile=1
```

- No orphan insights. All 12 referenced ≥1 time.
- Thin: `coral-ridge-victoria-park-rio-vista`, `lighthouse-point-sea-ranch-lakes-hillsboro-mile` — 1 incoming each.

### Market editorial comparisonContext gaps

Markets WITHOUT `comparisonContext` editorial bridge (renders generic "Continue your tour." heading with no prose):
`coral-ridge`, `palm-beach`, `lighthouse-point`, `rio-vista`, `seven-isles`, `sea-ranch-lakes`, `hillsboro-mile` (7 of 16).

P3 — content gap, not schema. Authoring needed, not safe-fix.

---

## Section 5 — Local SEO specificity

| Market page asset | Status |
|---|---|
| `Place.geo.latitude` / `longitude` | All 16 set. PASS. |
| `Place.containedInPlace` (county) | All 16 set (Broward County / Palm Beach County). PASS. |
| `Place.hasMap` | All 16 (Google Maps query URL). PASS. |
| `RealEstateAgent.parentOrganization` (brokerage) | YES — points to `#organization` (LPT Realty LLC). PASS for brokerage attribution. |
| `LocalBusiness` on `/contact/` | YES, with lat/lng (26.1224, -80.1373) and Fort Lauderdale 33305 PostalAddress. PASS. |
| `serviceArea` semantics | Uses "Eastern Fort Lauderdale", "Eastern Boca Raton", "Eastern Delray Beach" — colloquial, typed as `AdministrativeArea`. See I-21A-S6-003. |
| Neighborhood-level lat/lng on market pages | YES — each finger-isle / neighborhood has its own coordinates (e.g. `las-olas-isles` 26.1217,-80.1170; `seven-isles` 26.1212,-80.1162). PASS. |
| Brokerage in schema on every page | YES — `RealEstateAgent.parentOrganization → #organization → LPT Realty LLC`. PASS. |

Local SEO baseline is strong. The one remaining lever is fixing the AdministrativeArea naming.

---

## Section 6 — Safe fix candidates (high-confidence)

Ordered by impact/effort ratio. All preserve gold-standard FL pattern.

1. **I-21A-S6-005 — Single-FAQPage rule.** On 5 hub pages, set `<AnswerFirst emitFaqSchema={false}>` and merge the AnswerFirst Q+A into the page-level `<Faq>` items array (or hoist it as the first FAQ). One FAQPage per page is Google's documented recommendation. Files: `src/app/page.tsx`, `/about/page.tsx`, `/buyers/page.tsx`, `/sellers/page.tsx`, `/valuation/page.tsx`. Effort: S.
2. **I-21A-S6-007 — Bind market `aeoAnswer` to FAQPage.** The 15 non-FL market pages render `{market.aeoAnswer}` as a `<p>` but never bind it as `Question`/`Answer` JSON-LD. Either (a) prepend `{question: "What is {market.name} known for?", answer: market.aeoAnswer}` to the existing `Faq` items list (single FAQPage grows by 1 item), or (b) extract `aeoQuestion` field on each Market and bind both. Mirror is FL V2 pattern. Effort: S.
3. **I-21A-S6-006 — Bind insight `aeoQuestion`/`aeoAnswer` to FAQPage.** Insight `aeoQuestion` + `aeoAnswer` already exist on every post. Modify `buildFaqSchema(post)` in `src/app/insights/[slug]/page.tsx` to prepend that Q/A pair to `post.faqs` before mapping. 12 posts gain a top-billed schema-bound answer. Effort: XS.
4. **I-21A-S6-004 — Fix OfferCatalog provider type/id mismatch.** In `src/components/schema/OfferCatalogSchema.tsx` line 39, change `@id: SITE.url + "/#person"` to `@id: SITE.url + "/#realestate-agent"` when `providerType === "RealEstateAgent"` (which is the default — used on `/buyers/`, `/sellers/`, `/valuation/`). Effort: XS.
5. **I-21A-S6-001 — Homepage hero/description market-triple coherence.** Pick one canonical triple and use it everywhere on the homepage. Current state: hero says "Fort Lauderdale, Pompano Beach, and Boca Raton"; SITE.description says "Eastern Fort Lauderdale, Boca Raton, and Delray Beach"; AnswerFirst body says "Eastern Fort Lauderdale … Boca Raton and Delray Beach". Recommended: align hero to the SITE.description triple. Single file edit: `src/app/page.tsx` line 84. Effort: XS.
6. **I-21A-S6-008 — Add canonical-removal on 404.** Remove `alternates.canonical` from `src/app/not-found.tsx` metadata (currently points to non-existent `/404/`). Effort: XS.
7. **I-21A-S6-009 — Normalize `availableLanguage` format.** `OrganizationSchema` uses `["English"]`; `ContactPageSchema` uses `["en"]`. Pick BCP-47 (`"en"`) and propagate. Effort: XS.

### Candidates explicitly NOT safe-fix (need principal review)

- **I-21A-S6-002 — Organization name / publisher coherence.** WebSite.publisher currently resolves to LPT Realty LLC. LPT Realty does not publish miasanabriarealtor.com — Mia does. Options: (a) split Organization (publisher of the site) from Brokerage (LPT Realty); (b) keep current and accept the over-attribution. Needs principal decision because the consequence is changing the `#organization` node identity referenced by 5+ schemas.
- **I-21A-S6-003 — AdministrativeArea naming.** Replacing "Eastern Fort Lauderdale" etc. as `AdministrativeArea` with real admin areas (Broward County, Palm Beach County) and demoting the colloquial regions to a different schema field. Needs principal sign-off on the new structure.

---

## Section 7 — Issue rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
I-21A-S6-001	team6	/	content-coherence	Hero text says "Fort Lauderdale, Pompano Beach, and Boca Raton" while SITE.description and AnswerFirst body name a different triple ending in "Delray Beach"	src/app/page.tsx:84 vs src/lib/site.ts:23-25 vs src/app/page.tsx:100	P2	medium	Align hero heading to canonical triple "Eastern Fort Lauderdale, Boca Raton, and Delray Beach" (or principal-choose canonical, propagate everywhere)	site/content	XS	HIGH	YES	src/app/page.tsx	grep "Pompano" src/app/page.tsx → 0 matches after fix
I-21A-S6-002	team6	(all)	schema-coherence	WebSite.publisher resolves to Organization name "LPT Realty LLC" — LPT does not publish miasanabriarealtor.com; brokerage role is being mixed with site-publisher role on a shared @id #organization	out/index.html (Organization @id #organization, name LPT Realty LLC, referenced as WebSite.publisher) + src/components/schema/{Organization,WebSite}Schema.tsx	P2	medium	Split #organization (site publisher = Person Mia Sanabria, or a neutral "Mia Sanabria Realty" Organization) from #brokerage (LPT Realty LLC, used only as RealEstateAgent.parentOrganization); needs principal direction	principal	M	HIGH	NO	src/components/schema/OrganizationSchema.tsx; src/components/schema/RealEstateAgentSchema.tsx; src/components/schema/WebSiteSchema.tsx	rich-results test + manual JSON-LD review
I-21A-S6-003	team6	(all)	schema-precision	RealEstateAgent.areaServed and Service.areaServed declare "Eastern Fort Lauderdale", "Eastern Boca Raton", "Eastern Delray Beach" as AdministrativeArea — these are colloquial regions, not admin areas	out/index.html AdministrativeArea names; src/lib/mia.ts serviceArea.administrative	P2	medium	Promote real admin areas (Broward County, Palm Beach County) into AdministrativeArea; demote colloquial regions to a separate Place-typed serviceArea or knowsAbout list; needs principal sign-off on the new shape	principal	S	HIGH	NO	src/lib/mia.ts; src/components/schema/RealEstateAgentSchema.tsx; src/components/schema/ServiceSchema.tsx	grep "AdministrativeArea" out/*.html shows only county-level names; manual review
I-21A-S6-004	team6	/buyers/ /sellers/ /valuation/	schema-coherence	Offer.itemOffered.provider declares @type RealEstateAgent but @id #person — type/id mismatch; #person is the Person node, RealEstateAgent node is at #realestate-agent	src/components/schema/OfferCatalogSchema.tsx:39; out/buyers/index.html "provider":{"@type":"RealEstateAgent","@id":".../#person"}	P2	medium	When providerType==="RealEstateAgent" use @id "#realestate-agent"; otherwise keep "#person"	site/content	XS	HIGH	YES	src/components/schema/OfferCatalogSchema.tsx	grep "#person" out/buyers/index.html after fix shows Person refs only
I-21A-S6-005	team6	/ /about/ /buyers/ /sellers/ /valuation/	schema-recommendation	Five hub pages emit 2 FAQPage entities each (AnswerFirst + page Faq) — Google docs recommend a single FAQPage per page	grep -c "FAQPage" out/{index,about,buyers,sellers,valuation}/index.html = 2 each	P2	medium	Set <AnswerFirst emitFaqSchema={false}> on the 5 hub pages and merge the AnswerFirst Q+A as the first item of the page-level Faq items array	site/content	S	HIGH	YES	src/app/page.tsx; /about/page.tsx; /buyers/page.tsx; /sellers/page.tsx; /valuation/page.tsx	grep -c "FAQPage" out/{...}/index.html = 1 each
I-21A-S6-006	team6	/insights/{slug}/ × 12	aeo-gap	Insight aeoQuestion + aeoAnswer (the highest-value Q/A on the page, rendered in a Quick-Answer aside) is NOT bound into the FAQPage JSON-LD	src/app/insights/[slug]/page.tsx buildFaqSchema only iterates post.faqs; out/insights/{slug}/index.html mainEntity lacks the aeoQuestion	P1	high	Prepend {question: post.aeoQuestion, answer: post.aeoAnswer} to mainEntity in buildFaqSchema before mapping post.faqs (or build a separate Question/Answer entity); 12 posts gain a top-billed schema-bound answer	site/content	XS	HIGH	YES	src/app/insights/[slug]/page.tsx	out/insights/*/index.html mainEntity[0].name === post.aeoQuestion
I-21A-S6-007	team6	/markets/{slug}/ × 15 (non-FL)	aeo-gap	Non-FL market pages render <p>{market.aeoAnswer}</p> in the "An honest summary." block but do not bind it as Question/Answer schema; only market.faqs is bound	src/app/markets/[slug]/page.tsx Section 1 inline <p>; out/markets/{slug}/index.html FAQPage contains only the 5 market.faqs entries	P1	high	Prepend {question: "What is {market.name} known for?" (or add aeoQuestion field), answer: market.aeoAnswer} to the items prop passed to <Faq> (single FAQPage grows by 1 item); preserve FL V2 separately	site/content	S	HIGH	YES	src/app/markets/[slug]/page.tsx; src/lib/markets.ts (optional aeoQuestion field)	out/markets/{slug}/index.html FAQPage.mainEntity has 6 questions (1 AEO + 5 market.faqs); FL V2 unchanged at 11
I-21A-S6-008	team6	/404 (not-found)	metadata-cosmetic	not-found page sets alternates.canonical to ${SITE.url}/404/ — no such route exists; under noindex this is harmless but cosmetically wrong	src/app/not-found.tsx metadata.alternates.canonical	P3	low	Remove alternates.canonical from not-found.tsx metadata (Google ignores canonical on 4xx anyway)	site/content	XS	HIGH	YES	src/app/not-found.tsx	grep "canonical" out/404.html shows no inserted link
I-21A-S6-009	team6	(all)	schema-consistency	availableLanguage uses "English" in OrganizationSchema and "en" in ContactPageSchema — inconsistent format	src/components/schema/OrganizationSchema.tsx:27 vs src/components/schema/ContactPageSchema.tsx:27,33,41	P3	low	Standardize on BCP-47 "en" everywhere	site/content	XS	HIGH	YES	src/components/schema/OrganizationSchema.tsx	grep -E "availableLanguage" out/ shows uniform "en"
I-21A-S6-010	team6	/insights/{slug}/	schema-recommendation	Article schema uses @type:Article — BlogPosting would be more semantically precise for an editorial series	src/app/insights/[slug]/page.tsx buildArticleSchema	P3	low	Change @type from "Article" to "BlogPosting" (BlogPosting subclasses Article — strictly more specific, no break)	site/content	XS	MEDIUM	YES	src/app/insights/[slug]/page.tsx	out/insights/{slug}/index.html shows BlogPosting @type
I-21A-S6-011	team6	/markets/{slug}/ × 7 non-FL	content-gap	Coral Ridge, Palm Beach, Lighthouse Point, Rio Vista, Seven Isles, Sea Ranch Lakes, Hillsboro Mile lack comparisonContext editorial bridge prose above the related-markets card grid	src/lib/markets.ts (no comparisonContext field on these 7 entries)	P3	low	Author 75-125 word comparisonContext for each — schema-neutral content lift; not a schema fix	site/content	M	HIGH	NO (authoring)	src/lib/markets.ts	visual: each non-FL market page has prose above the related-markets cards
I-21A-S6-012	team6	/markets/	metadata-cosmetic	/markets/ and /insights/ OG image is /og-default.jpg — generic homepage frame, not section-specific	src/app/markets/page.tsx, src/app/insights/page.tsx openGraph.images	P3	low	Optional: author /og-markets-index.jpg and /og-insights-index.jpg with section-specific framing	site/content	S	MEDIUM	YES (after asset)	src/app/markets/page.tsx; src/app/insights/page.tsx	curl -I OG image returns 200; tweet preview shows section image
I-21A-S6-013	team6	/contact/ /markets/	aeo-gap	AnswerFirst (or equivalent embedded AEO block) is not present on /contact/ or /markets/ index — both are high-AEO-value routes (e.g. "How do I contact Mia Sanabria?", "What markets does Mia Sanabria cover?")	src/app/contact/page.tsx, src/app/markets/page.tsx	P3	medium	Add one <AnswerFirst> block above the existing fold content on each, with the Q+A bound to a single FAQPage (apply I-21A-S6-005 rule from the start)	site/content	S	HIGH	YES	src/app/contact/page.tsx; src/app/markets/page.tsx	out/{contact,markets}/index.html mainEntity contains the new direct answer
```

---

## Section 8 — Confidence + dissent

**Confidence: HIGH** on schema-coherence findings (I-001 through I-009). Every Section-2 finding verified against rendered `out/*.html` JSON-LD, not just source. Audit gates (schema/seo/links) all green — these findings are coherence and AEO-optimization issues, not breakage.

**Confidence: MEDIUM** on I-21A-S6-007's market-page aeoAnswer-binding recommendation. The visible inline `<p>{market.aeoAnswer}</p>` is high-quality direct-answer content but binding it as a sixth FAQPage item is one interpretation; alternative is to emit a standalone `Question`/`Answer` graph object referenced from the page. Either reads.

**Dissent (one):** I would soften the FL gold-standard rollout pressure. FortLauderdaleV2 has 11 FAQs + a dedicated playbook structure. Rolling that exact pattern to 15 other markets risks padding and superlative drift — and the schema-bind opportunity in I-21A-S6-007 captures most of the FL FAQ depth without forcing 11 Qs per market. Prefer: bind aeoAnswer (XS, mechanical, 15 markets) + add 1-2 market-specific FAQs over time (content authoring) → matches FL coverage gradually without the rollout-template burden.

**Top 3 P1 fixes (priority order):**
1. **I-21A-S6-006** — Bind insight `aeoQuestion`/`aeoAnswer` into FAQPage. 12 insights, XS effort, mechanical. Largest AEO lift in the codebase per file changed.
2. **I-21A-S6-007** — Bind non-FL market `aeoAnswer` into FAQPage. 15 markets, S effort, mechanical. Second-largest AEO lift.
3. **I-21A-S6-005** — Resolve double-FAQPage emission on 5 hub pages. S effort, eliminates Google's structured-data warning class.

**Non-negotiables observed (all confirmed PASS):**
- No fake reviews, ratings, priceRange, awards. None found anywhere in schema. PASS.
- No unsupported credentials. `MIA.unverified.*` correctly gates licenseNumber, designations, yearsLicensed, displayOffice; `availableLanguage` correctly limited to English; `experience.since` null. PASS.
- No fake freshness. All 12 insight `dateModified` == `datePublished` == 2026-05-10. No manipulated freshness. PASS.
- No over-optimization SEO filler. Titles/descriptions are voice-consistent and within length. PASS.
- FL gold-standard schema preserved as model — FortLauderdaleV2 is structurally distinct and remains the rollout reference. PASS.

---

**Pages reviewed:** 49 (full `out/` tree).
**Schema types verified:** Organization, WebSite, Person, RealEstateAgent, LocalBusiness, ContactPage, BreadcrumbList, Place + GeoCoordinates + containedInPlace, Service, OfferCatalog/Offer, Article, FAQPage, Question/Answer, WebPage, Blog, AdministrativeArea, PostalAddress, ContactPoint, ImageObject (19 distinct types).
**Lines used:** ~520 of 600 cap.
