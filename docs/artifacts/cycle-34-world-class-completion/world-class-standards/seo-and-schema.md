# SEO & Schema Standard

> Cycle 34 Phase 6.

## Title tag

- Max 60 chars.
- Pattern: `<Specific noun> | Mia Sanabria <role>` or `<Specific noun> | <Section>`.
- Examples that pass: `Home Search | Mia Sanabria REALTOR®` (35 chars), `Fort Lauderdale Luxury Real Estate | Mia Sanabria` (51 chars).

## Meta description

- 140-158 chars (target 145).
- First clause = the answer to the implicit user question.
- Last clause = `Mia Sanabria, REALTOR® with LPT Realty.` (or equivalent attribution).
- Existing `buildMetaDescription()` in `src/app/markets/[slug]/page.tsx` already enforces a 158 cap and tail attribution — keep this pattern.

## Canonical

- Always absolute.
- Always trailing slash where the static export emits a directory route.
- `${SITE.url}/<route>/`.

## OG / Twitter

- `og:image` = 1200 × 630, JPG, ≤ 200 KB.
- `og:title` ≤ 60 chars, may diverge from `<title>` for social framing.
- `og:description` may run slightly longer than meta description (~200 chars) where social previews allow.
- `twitter:card = summary_large_image`.

## Schema graph by page type

| Page | Required schema |
|---|---|
| `/` | Person + RealEstateAgent + Breadcrumb + (FAQPage if FAQ on page) |
| `/about/` | Person + Breadcrumb |
| `/contact/` | ContactPage + Breadcrumb + LocalBusiness |
| `/markets/` | RealEstateAgent + Breadcrumb |
| `/markets/[slug]/` | Place + RealEstateAgent + Breadcrumb + FAQPage |
| `/home-search/` | Breadcrumb (Bridge IDX renders WebPage by default; noindex while demo) |
| `/insights/` | Breadcrumb + (CollectionPage optional) |
| `/insights/[slug]/` | Article + Breadcrumb + (FAQPage if Q&A in post) |
| `/privacy/` · `/terms/` · `/accessibility/` · `/dmca/` | WebPage + Breadcrumb |

## Sitemap

- One canonical sitemap at `/sitemap.xml`.
- Excludes `/thank-you/`, `/404`, and `noindex` Bridge demo pages.
- `audit:route-inventory` enforces sitemap ↔ filesystem reconciliation.

## Robots

- Staging hosts return `noindex, nofollow` via `IS_STAGING` check in `src/lib/site.ts`.
- `/home-search/` has explicit `robots: { index: false, follow: true }` while Bridge is in demo mode.
- Production hosts (post-cutover) flip to `index, follow` site-wide except staging-only routes.

## Anti-patterns

- Multiple H1s per page.
- `<link rel="canonical">` pointing to a different domain than the page is served from.
- Schema for content not rendered.
- Title or meta description with placeholder text.
- Open Graph image returning 404.
