# Team D — SEO / AEO / Internal Link Expert (Cycle 4)

## Verdict (one sentence)
Cycle-4 is in **concern** state: core AEO and internal-link gains are now concentrated in market pages, while non-market funnel pages still miss high-leverage, answer-first content and some schema/metadata consistency opportunities remain.

## Current numbers (verified by running audit scripts)
- `bun run audit:schema`: `scanned 27 pages, found 148 JSON-LD blocks (26ms)`.
- `bun run audit:seo`: `0 warning(s), no errors across out/`.
- `ls out/sitemap.xml`: file exists; `out/sitemap.xml` contains **25** routes.
- `grep -rE 'aeoAnswer:|faqs:|internalLinks:' src/lib/markets.ts`: market data contains all three primitives for market entries; 404 canonical/slug collision is not present here.
- `grep -E 'hreflang|x-default' src/app/layout.tsx`: `alternates.languages` currently only `en-US` + `x-default`.
- `reports/audit-completeness.md`: `14 PASS · 2 WARN · 0 FAIL` (still the prior warning context: image attrs + mailto form classification).

## Top 10 findings (each: severity / file / fix / validation / safe-now / approval-required)

1. Severity: **high**  
   File: [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx)  
   Fix: Add answer-first AEO blocks to all five pages (missing currently):  
   - `/buyers/`: insert **112-word** paragraph directly under hero/intro and before first CTA block.  
   - `/sellers/`: insert **118-word** paragraph directly under hero/intro and before first CTA block.  
   - `/valuation/`: insert **104-word** paragraph directly under hero/intro and before valuation form.  
   - `/contact/`: insert **92-word** paragraph directly under hero/intro and before contact option cards/form.  
   - `/about/`: insert **130-word** paragraph directly under hero/intro and before commitments/CTA section.  
   Validation: page scan should show each funnel page containing a standalone, first-meaningful-block paragraph that directly answers a single high-intent query; no dependence on FAQ collapse.  
   Safe-now: yes  
   Approval-required: no

2. Severity: **high**  
   File: [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx)  
   Fix: Increase non-market body internal-link density (current explicit links are sparse; nav/footer not counted as content intent links):  
   - `/buyers/` add links to `/sellers/`, `/valuation/`, `/markets/`, `/insights/`, `/contact/`.  
   - `/sellers/` add links to `/buyers/`, `/valuation/`, `/contact/`, `/markets/`, `/insights/`.  
   - `/valuation/` add links to `/contact/`, `/buyers/`, `/sellers/`, one market page (e.g., `/markets/lighthouse-point/`), and `/insights/`.  
   - `/contact/` add links to `/buyers/`, `/sellers/`, `/valuation/`, `/markets/`, `/about/`.  
   - `/about/` add links to `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/markets/`.  
   Validation: each page should contain at least 5 contextual internal anchors in main content/body (not only header/footer).  
   Safe-now: yes  
   Approval-required: no

3. Severity: **high**  
   File: [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), [docs/CODEX_SPARK_SYNTHESIS_REPORT.md](/home/torrey/code/mia-sanabria-website/docs/CODEX_SPARK_SYNTHESIS_REPORT.md)  
   Fix: Resolve Cato Spanish blind spot with approved shape and no false targeting:  
   - Keep self-referential English alternates now:  
     `en-US` → page URL, `en` → page URL, `x-default` → page URL.  
   - Do not add `es-*` until fully deployed localized URLs exist; then add `es-US/es-ES` as full per-page mirrors.  
   - Keep canonical unchanged (`SITE.url`) and consistent with current 404 fix.  
   Validation: crawl generated `<link rel="alternate" hreflang=...>` to ensure no dead/non-existent URLs.  
   Safe-now: yes  
   Approval-required: yes (requires explicit Spanish rollout decision)

4. Severity: **high**  
   File: [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)  
   Fix: Add missed AEO query pages/blocks for LLM-style prompts not yet explicitly answered:  
   - "luxury waterfront Fort Lauderdale market timing during hurricane season, what should buyers do first?"  
   - "which SE FL luxury coastal market performs best for Cuban-American HNWI relocation buyers?"  
   - "what are the HOA/marina dock-rights risks across markets, and how do they change by street/market?"  
   - "what valuation evidence does a seller need before listing a waterfront property now?"  
   Place each as dedicated answer-first blocks with city-specific examples and citations available locally.  
   Validation: test with 6–8 controlled prompts in Perplexity/SearchGPT; ensure direct, concise direct answers match on-page copy.  
   Safe-now: yes  
   Approval-required: yes (content strategy direction and tone)

5. Severity: **medium**  
   File: [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), [src/app/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)  
   Fix: OG/Twitter card optimization for CTR + relevance:  
   - Add page-level OG/twitter metadata to `/` and `/insights/` (currently no dedicated social image/text for these in metadata route override).  
   - Keep legal pages on neutral branding image if needed, but ensure core funnels each have distinct social asset.  
   - For /insights currently on `og-default.jpg`, use `og-insights.jpg` at 1200x630.  
   Validation: sample `view-source` on built pages confirms unique `<meta property="og:image">` for high-value landing pages.  
   Safe-now: yes  
   Approval-required: no

6. Severity: **medium**  
   File: [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), legal/social pages in [src/app](/home/torrey/code/mia-sanabria-website/src/app)  
   Fix: Twitter improvements: keep `summary_large_image`, but add explicit `twitter.title`, `twitter.description`, and `twitter.creator` from Mia’s official handle so per-page copy is optimized without changing card type.  
   Validation: social scraper check (or `bun run build` + HTML scan) should show page-level Twitter title/description on key routes.  
   Safe-now: yes  
   Approval-required: no

7. Severity: **medium**  
   File: [src/components/schema/FaqSchema.tsx](/home/torrey/code/mia-sanabria-website/src/components/schema/FaqSchema.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx)  
   Fix: FAQPage schema exists on these pages, but `FaqSchema` currently emits no stable `@id`; add canonical `@id` (e.g., `${url}#faq`) and per-question identifiers to improve answer de-duplication and AEO grounding.  
   Validation: structured-data scrape should show each page’s FAQPage object with unique `@id`.  
   Safe-now: yes  
   Approval-required: no

8. Severity: **medium**  
   File: [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx)  
   Fix: Schema saturation still uneven: only certain pages include `RealEstateAgentSchema`, and `LocalBusinessSchema` is currently only guaranteed in contact; apply schema parity on high-intent pages where business/service intent is explicit (especially `/valuation/` and `/insights/` if market-facing).  
   Validation: `bun run audit:schema` should show agent/person/business schema on all conversion-critical routes.  
   Safe-now: yes  
   Approval-required: no

9. Severity: **low**  
   File: [src/app/sitemap.ts](/home/torrey/code/mia-sanabria-website/src/app/sitemap.ts), [out/sitemap.xml](/home/torrey/code/mia-sanabria-website/out/sitemap.xml)  
   Fix: All 25 URLs currently share one `lastmod` timestamp from build time; add route-level lastmod values to avoid freshness ambiguity for editorial/legal updates.  
   Validation: confirm `out/sitemap.xml` has varied `lastmod` where update cadence differs and stable values for archived legal pages.  
   Safe-now: yes  
   Approval-required: no

10. Severity: **low**  
    File: [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)  
    Fix: Near-duplicate risk on market templates and keyword concentration is present where shared framing is reused across 13+ market records; add 2 unique local proof elements per market (e.g., flood-zone nuance + transaction pattern) and reduce repetitive phrase chaining in insights.  
    Validation: run similarity check / bigram overlap across market entries; watch phrase density spikes for `luxury`, `waterfront`, `Fort Lauderdale`.  
    Safe-now: yes  
    Approval-required: yes (content additions + local market facts need source confirmation)

## Spanish hreflang recommendation (Cato §11.6 angle — concrete shape, not abstract)
Use a deferred bilingual model now, then expand only when Spanish routes are real: keep `alternates.languages` as `{"en-US": canonical, "en": canonical, "x-default": canonical}` on all current pages, and gate any `es-*` entries behind a launch check that confirms every referenced `/es/...` route exists and returns 200.

## Topic-cluster /insights/ recommendation (3 essays with title + AEO target queries)
1) Title: `SE FL Waterfront Timing: What Happens to Luxury Listings Between Storm Season and Spring Demand`  
   AEO target query: `“hurricane season impact on luxury waterfront home listings in Fort Lauderdale, Boca Raton, and Delray Beach”`
2) Title: `Cuban-American HNWI Coastal Living in South Florida: Market Entry Signals by Neighborhood`  
   AEO target query: `“where do Cuban-American luxury buyers typically buy in SE Florida’s waterfront markets and why”`
3) Title: `Dock, Drought, and Downstream Value: How HOA Rules Change Waterfront Buy/Sell Decisions Across SE FL`  
   AEO target query: `“how do HOA and dock-rights policies affect luxury waterfront property value in Fort Lauderdale-area neighborhoods”`

## What we should NOT change (preserve list)
- Do not revert `"/404/"` canonical + noindex behavior fixed in [cycle-3] and present in [src/app/not-found.tsx](/home/torrey/code/mia-sanabria-website/src/app/not-found.tsx).  
- Do not add any new unverified claims (license numbers, MLS claims, awards, proficiency assertions).  
- Do not label Boca Raton / Delray / Palm Beach as “Broward County.”  
- Do not add `hreflang="es"` links to non-existent routes (`/es/...`).  
- Do not touch `robots`/staging security posture or implement hardening tasks outside SEO/AEO scope (DNS/Cloudflare/GHL/etc.).

## Anti-criteria check
- Forbidden licensing/designation claims introduced: **No**  
- Unauthorized Hispanic-language route assumptions: **No**  
- Geographical misclassification (Boca/Delray/Palm Beach as Broward): **No**  
- External infrastructure/config edits (DNS/Cloudflare/GHL): **No**

## Evidence appendix
- model_used: gpt-5.3-codex-spark  
- team: D SEO/AEO/Internal Links  
- reasoning_effort: xhigh  
- sandbox: read-only  
- Scope files reviewed: [ISA.md](/home/torrey/code/mia-sanabria-website/ISA.md), [docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md](/home/torrey/code/mia-sanabria-website/docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md), [docs/codex-spark-audits/seo-aeo-schema-audit.md](/home/torrey/code/mia-sanabria-website/docs/codex-spark-audits/seo-aeo-schema-audit.md), [docs/CODEX_SPARK_SYNTHESIS_REPORT.md](/home/torrey/code/mia-sanabria-website/docs/CODEX_SPARK_SYNTHESIS_REPORT.md), [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), [src/app/sitemap.ts](/home/torrey/code/mia-sanabria-website/src/app/sitemap.ts), [src/app/robots.ts](/home/torrey/code/mia-sanabria-website/src/app/robots.ts), [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx), [src/app/markets/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx), and funnel/legal pages under [src/app](/home/torrey/code/mia-sanabria-website/src/app).  
- Command outputs included in working notes: `audit:schema`, `audit:seo`, `ls out/sitemap.xml`, `grep`/`rg` probes listed above.

{"team":"D","verdict":"concerns","completeness":"full","top_concerns":["Missing answer-first AEO blocks on 5 funnel pages","Non-market internal-link density is thin","Spanish hreflang blind spot for SE FL Hispanic intent","Missed high-value AEO queries (Cato blind-spot set)","OG/Twitter card differentiation gaps for home and some key pages","FAQPage schema lacks canonical @id anchors","Schema saturation uneven across high-intent pages","Sitemap lastmod uniform across all routes","Market page near-duplicate templated phrasing","Keyword/term repetition should be normalized","Curation of page-level social/title metadata","Canonical/404 fixes already validated"],"findings_count":10,"high_severity_count":3,"safe_now_count":8,"hreflang_recommendation":"Use self-referential English alternates now (en-US/en/x-default) and add es-* only once real localized /es pages are published and tested 200.","topic_cluster_essay_count":3}
