# Team 1 — Route, Inventory, and Consistency Report

Cycle 21-AI-REMAINING-WORK. Read-only. No source edits. Date: 2026-05-11.
Build inspected: `out/` present, sitemap = 40 URLs, audit-route-inventory PASS, audit-links PASS (2425 links).

## Section 1 — Full route table

Columns: path | source | type | in sitemap? | noindex? | CTAs valid?

| Path | Source | Type | Sitemap | Noindex | CTAs valid |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | static | YES | NO (staging YES via layout.tsx:67) | YES |
| `/about/` | `src/app/about/page.tsx` | static | YES | NO | YES (`/contact/`) |
| `/accessibility/` | `src/app/accessibility/page.tsx` | legal | YES | NO | YES (mailto) |
| `/buyers/` | `src/app/buyers/page.tsx` | static | YES | NO | YES (`/contact/?intent=buyer`) |
| `/contact/` | `src/app/contact/page.tsx` | static + mailto-form | YES | NO | YES (mailto, no thank-you redirect) |
| `/dmca/` | `src/app/dmca/page.tsx` | legal | YES | NO | YES (mailto) |
| `/insights/` | `src/app/insights/page.tsx` | static index | YES | NO | YES |
| `/insights/[slug]/` ×12 | `src/app/insights/[slug]/page.tsx` + `src/data/insights/*.ts` | dynamic (SSG) | YES (12) | NO | YES (all CTAs in `src/data/insights/*.ts` route to `/contact/?intent=…`, `/markets/…`, `/valuation/`, `/insights/…`) |
| `/markets/` | `src/app/markets/page.tsx` | static index | YES | NO | YES (`/contact/?intent=market-brief`) |
| `/markets/[slug]/` ×16 | `src/app/markets/[slug]/page.tsx` + `src/lib/markets.ts` | dynamic (SSG) | YES (16) | NO | YES (`/contact/`, `/valuation/`, `/buyers/`, `/sellers/`, `/downloads/*.pdf`) |
| `/privacy/` | `src/app/privacy/page.tsx` | legal | YES | NO | YES (mailto) |
| `/sellers/` | `src/app/sellers/page.tsx` | static | YES | NO | YES (`/contact/?intent=seller`) |
| `/terms/` | `src/app/terms/page.tsx` | legal | YES | NO | YES (mailto) |
| `/valuation/` | `src/app/valuation/page.tsx` | static + mailto-form | YES | NO | YES (mailto, no thank-you redirect) |
| `/thank-you/` | `src/app/thank-you/page.tsx` | thank-you | NO | YES (index:false, follow:true) | YES (to `/insights/`, `/markets/`) |
| `/thank-you/buyer-brief/` | `src/app/thank-you/buyer-brief/page.tsx` | thank-you | NO | YES | YES (to specific insight slug + `/markets/`) |
| `/thank-you/market-brief/` | `src/app/thank-you/market-brief/page.tsx` | thank-you | NO | YES | YES |
| `/thank-you/valuation/` | `src/app/thank-you/valuation/page.tsx` | thank-you | NO | YES | YES (to two specific insight slugs) |
| `/downloads/[slug]/` ×3 | `src/app/downloads/[slug]/page.tsx` + `src/data/lead-magnets/index.ts` | dynamic HTML source for PDF | NO | YES (robots.index:false, robots.follow:false) | YES |
| `/downloads/*.pdf` ×3 | `public/downloads/*.pdf` → copied to `out/downloads/*.pdf` | PDF static asset | NO | (asset, not HTML) | N/A |
| `/404/` (out/404.html) | `src/app/not-found.tsx` | error | NO | YES | YES (to `/` and `/markets/`) |
| `/sitemap.xml` | `src/app/sitemap.ts` | feed | (self) | N/A | N/A |
| `/robots.txt` | `src/app/robots.ts` | feed | N/A | (staging: disallow `/`; prod: standard) | N/A |
| `/manifest.webmanifest` | `src/app/manifest.ts` | feed | N/A | N/A | N/A |

Totals: 40 indexable HTML routes (matches sitemap), 4 noindex thank-you routes, 3 noindex `/downloads/[slug]/` HTML source pages, 3 PDF asset downloads, 1 404. Static-export route HTML files all present under `out/` (verified by `bun run audit:route-inventory` PASS).

## Section 2 — Drift findings

### 2.1 Orphan / unreferenced routes (filesystem present, no inbound user-flow link)

- `/thank-you/buyer-brief/`, `/thank-you/market-brief/`, `/thank-you/valuation/` — exist, noindexed, but **no internal navigation reaches them**. The contact and valuation forms (`src/app/contact/page.tsx:111`, `src/app/valuation/page.tsx:104`) use `action="mailto:…"` and have no post-submit redirect. These thank-you pages are reachable only by direct URL or via a future GHL post-submit redirect that does not yet exist. Audit `audit:route-inventory` correctly classifies them as `filesystem_only_optional_present`. Severity P2 — intentional pre-GHL scaffolding, but ungated by GHL would render them dead ends.

- `/thank-you/` (generic) — referenced in source comments and CTA route doctrine but **also unreachable in the user flow today**. Same root cause: mailto forms do not redirect. P2.

### 2.2 Missing-from-sitemap (intentional + correctly excluded)

- `/thank-you/*` — correct exclusion (noindex).
- `/downloads/[slug]/` HTML source pages — correct exclusion (noindex; PDF is the deliverable).
- `/404` — correct exclusion.

No unintentional sitemap omissions.

### 2.3 Missing-from-nav

- `/insights/` is in `FOOTER_NAV.explore` (`src/lib/site.ts:52`) but NOT in primary `NAV` (`src/lib/site.ts:36`). Header has no link to Insights. Discoverability cost. P2.
- `/downloads/*.pdf` are linked only from `src/components/markets/FortLauderdaleV2.tsx:826,835,844`. Two of the three PDFs (`luxury-seller-pre-listing-checklist`, `fort-lauderdale-waterfront-valuation-prep-sheet`) are linked only from the Fort Lauderdale market V2 page; they don't appear on `/sellers/` or `/valuation/` where they'd be topically relevant. P3 content-discoverability issue.

### 2.4 CTA → non-existent destinations

None found. `bun run audit:links` scanned 49 pages, 2425 internal links, 0 broken (recent run, this report run-cycle).

### 2.5 Other consistency findings

- `not-found.tsx:9` declares `alternates: { canonical: ${SITE.url}/404/ }`. The path `/404/` exists in `out/` as a trailing-slash mirror of `out/404.html`, but Next.js static export's 404 fallback is `out/404.html` (no trailing-slash). Self-referential canonical on a noindex page is technically harmless, but the `/404/` URL is not a canonical route. Cosmetic. P3.
- `src/app/page.tsx:84` hero copy reads "Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton." while `SITE.tagline` (`src/lib/site.ts:25`) names "Eastern Fort Lauderdale, Boca Raton, and Delray Beach." Pompano Beach is named in the hero but Delray Beach is not — inconsistent with `SITE.tagline`, `SITE.description`, and the footer copy. P2 (positioning drift, not a route defect).
- Out-of-sitemap asset directory `out/services/` (`buyers.jpg`, `contact.jpg`, `sellers.jpg`, `valuation.jpg`) is **not a route** — no `index.html` present. Used by hero `imageSrc="/services/*.jpg"` only. Not an orphan. (Logged for the record; no action.)

## Section 3 — Issue rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T1-001	team1	/thank-you/* (all four)	orphan-flow	Thank-you routes exist but no in-product path reaches them; mailto forms do not redirect post-submit	src/app/contact/page.tsx:111 (mailto action); src/app/valuation/page.tsx:104 (mailto action); audit-route-inventory.json classifies as optional_present	P2	Pages render but are practically unreachable until GHL submit-redirect is wired	Either (a) gate behind GHL cutover and leave intact, OR (b) add a visible "what to expect" link from /contact/ and /valuation/ to /thank-you/ as a confirmation-page preview before GHL ships	4	S	high	false	src/app/contact/page.tsx,src/app/valuation/page.tsx,src/app/thank-you/*	manual browser visit + audit:route-inventory
T1-002	team1	/insights/ (site-wide)	missing-from-nav	Insights is in footer but not primary header NAV; reduces discoverability of 12-post library	src/lib/site.ts:36-44 (NAV omits /insights/); src/lib/site.ts:46-53 (FOOTER_NAV.explore includes it)	P2	Insights library underexposed; hero/IntentRouter has no Insights surface either	Add { href: "/insights/", label: "Insights" } to NAV between /markets/ and /buyers/	1	S	high	true	src/lib/site.ts	visual diff header + audit:rendered
T1-003	team1	/sellers/, /valuation/	missing-from-nav	Lead-magnet PDFs surfaced ONLY from FortLauderdaleV2 page; topically relevant pages don't link them	src/components/markets/FortLauderdaleV2.tsx:826,835,844 are the only references; grep across /sellers/ and /valuation/ confirms no links	P3	Two of three PDFs (luxury-seller-pre-listing-checklist, valuation-prep-sheet) are buried	Add download links from /sellers/ (seller checklist + valuation prep) and /valuation/ (valuation prep + seller checklist) hero or aside	1	S	high	true	src/app/sellers/page.tsx,src/app/valuation/page.tsx	visual diff + audit:links
T1-004	team1	/	copy-drift	Hero h1 names "Pompano Beach" instead of the SITE.tagline triad of Fort Lauderdale, Boca Raton, Delray Beach	src/app/page.tsx:84 vs src/lib/site.ts:25 (tagline) and src/components/SiteFooter.tsx:22 (footer copy)	P2	Inconsistent regional positioning across surfaces; SEO targeting also misaligned with sitemap.title and metadata.description	Either change hero to match SITE.tagline OR update SITE.tagline to include Pompano Beach	3	S	med	false	src/app/page.tsx,src/lib/site.ts	visual diff home + audit:brand
T1-005	team1	/404 (not-found)	canonical-coherence	noindex 404 page has self-canonical to non-route URL /404/	src/app/not-found.tsx:9 (canonical: ${SITE.url}/404/); out/404.html grep "rel=canonical" returns /404/	P3	Cosmetic; noindex prevents indexing already	Either drop the alternates.canonical entry (preferred — 404 needs no canonical) or set it to SITE.url	1	S	high	true	src/app/not-found.tsx	grep rel=canonical out/404.html
T1-006	team1	/downloads/[slug]/ (HTML source)	intentional-noindex	HTML source pages render print-friendly view; correctly noindex per cycle 19B-FL contract	src/app/downloads/[slug]/page.tsx:43 (robots: index:false, follow:false, nocache:true); excluded from sitemap.ts	P3 (note only)	None — confirms intent. PDFs are the deliverable; HTML is the source for the chrome --headless print pipeline	No fix; verify on next major-cycle that the three PDFs in public/downloads/ remain byte-identical to the rendered HTML source	2	S	high	false	src/app/downloads/[slug]/page.tsx,public/downloads/*.pdf	audit:lead-magnets
T1-007	team1	/contact/, /valuation/	form-flow-stub	Forms POST to mailto: not to a backend; pages note "Direct lead capture is being finalized"	src/app/contact/page.tsx:111,122; src/app/valuation/page.tsx:104,115	P2 (pre-launch)	Known scaffolding; non-negotiable says do not fake GHL — current state respects that, but the gap between mailto and GHL is the cutover dependency	No code fix this cycle; document the mailto→GHL cutover as a launch dependency owned by GHL ops	4	M	high	false	(out of scope)	manual submit test post-GHL wiring
T1-008	team1	(global)	staging-noindex	Staging hostname triggers index:false across all routes via layout.tsx:67 + robots.ts:7	src/app/layout.tsx:67-84 (IS_STAGING branch); src/app/robots.ts:7-12 (disallow /); src/lib/site.ts:16	P0 (verified GREEN)	Confirms staging is properly noindex; production cutover flips when SITE_URL starts with miasanabriarealtor.com	No fix; verify on production-cutover packet that NEXT_PUBLIC_SITE_URL flip is in Dokploy	6	S	high	false	(launch dep)	grep "noindex" out/*/index.html + curl robots.txt
T1-009	team1	(site-wide)	noindex-coherence	All 7 noindex pages (thank-you ×4, downloads ×3) are correctly excluded from sitemap; sitemap holds only indexable URLs (40 total)	src/app/sitemap.ts:11-39; out/sitemap.xml grep <loc> count=40; bun audit:route-inventory PASS	P3 (note)	Coherence verified	No fix; rerun audit:route-inventory on any new route add	2	S	high	false	src/app/sitemap.ts	audit:route-inventory
T1-010	team1	/markets/[slug]/	cluster-coverage	16 market pages in sitemap match 16 MARKETS entries in src/lib/markets.ts; all CTAs to /contact/?intent=… and /valuation/?market=… resolve	src/lib/markets.ts (16 top-level slug entries); out/markets/*/index.html count=16; audit:featured-markets exists and passes per package.json	P3 (note)	Coherence verified	No fix	2	S	high	false	src/lib/markets.ts,src/app/markets/[slug]/page.tsx	audit:featured-markets + audit:links
```

## Section 4 — Confidence + dissent

**Confidence:** High on the route inventory itself — Next.js static export means `out/` is ground truth; sitemap, audit-route-inventory and audit-links all pass against the same artifact. Medium on the orphan-flow severity rating for `/thank-you/*` because the intent depends on whether GHL post-submit redirects are the planned mechanism (currently appears to be — comments in `src/components/cta/LeadCaptureCTA.tsx:10` and `src/lib/insights.ts:26` explicitly reference "non-GHL thank-you routes"). High on copy-drift finding for hero/Pompano Beach.

**Dissent:** None against non-negotiables — current implementation preserves IDX iframe, mailto fallback (no fake GHL), and footer "Private guidance for waterfront and luxury homes…" copy (`src/components/SiteFooter.tsx:22`). The Pompano Beach hero (T1-004) tension predates this cycle and is a content/positioning question, not a route-inventory question — flagged here only because the homepage hero is the most-trafficked route and the inconsistency surfaces during route review.

**Verification chain reproduced this run:**
- `bun run audit:route-inventory` → PASS (40 sitemap, 16 fs static + 16 dynamic markets + 12 dynamic insights, 4 optional thank-you, 3 optional download HTML sources)
- `bun run audit:links` → PASS (49 pages scanned, 2425 internal links, 0 broken)
- `out/sitemap.xml` <loc> count = 40 unique URLs (matches sitemap.ts staticRoutes + MARKETS×16 + INSIGHTS×12)
- `public/downloads/` matches `out/downloads/*.pdf` (3 PDFs)
