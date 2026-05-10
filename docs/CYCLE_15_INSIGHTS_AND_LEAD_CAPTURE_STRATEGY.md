# Cycle 15 — Insights + Lead Capture Strategy (2026-05-10)

## 1. Should the blog go live now?

**Yes.** The site is design-complete (Cycles 9-14) but content-thin and conversion-thin. Organic landing on a market page currently has nowhere narratively to go and no soft conversion path other than the contact page. A 12-post evergreen library plus reusable soft CTAs is the highest-leverage move while external blockers (GHL wiring, TCPA, .com cutover) remain principal-pending.

## 2. Should the 12 posts be published now or staged?

**Published now** as part of the Cycle 15 deploy. All 12 launch together as a coherent library; no post is staged behind a feature flag. The library is presented as "evergreen guide series" rather than "a year's worth of dispatches" — the editorial frame matches the truth of when the work was done.

## 3. How is "monthly over last 12 months" handled honestly?

**Reframed as a 12-part evergreen guide series, not a backdated archive.**

| Field | Value | Honesty contract |
|---|---|---|
| `datePublished` | `2026-05-10` (or current Cycle 15 deploy date) for all 12 | Reflects actual publication. No backdating. |
| `dateModified` | Same as `datePublished` initially; updates honestly when post is edited | No fabricated revision history. |
| `topicMonth` | Editorial label (e.g. `"January Reset"`, `"April Search"`, `"July Dockage Season"`, `"October Positioning"`) | Identifies the post's seasonal relevance and library position; **not** a publication date. |
| `seasonalFocus` | Optional natural-language label | Same purpose; never confused with publish history. |
| `marketCycleMonth` | 1-12 ordinal for library navigation | Same. |

`audit:insights` enforces: no post may carry a `datePublished` more than 7 days in the past at audit time without an explicit `editorial.republished_from` field documenting the original publication date.

The library frame on the Insights index reads as: *"A twelve-part evergreen guide to the Southeast Florida luxury and waterfront market — read in any order."* Not: *"A year of dispatches."*

## 4. Canonical Insights architecture

| Layer | Choice |
|---|---|
| Storage | TypeScript data files in `src/data/insights/` (no MDX install this cycle) |
| Type | `InsightPost` defined in `src/lib/insights.ts` |
| Routing | Next.js App Router static-export — `/insights/` index + `/insights/[slug]/` dynamic page |
| Schema | Article + BlogPosting + Breadcrumb + (FAQPage where applicable) JSON-LD per page |
| Sitemap | `sitemap.ts` extended to include `getAllInsightRoutes()` |
| Discovery | Sitewide weaving — homepage section, markets index module, featured market page links, buyers/sellers/valuation/contact CTAs |
| CMS | None this cycle. Editing is repo-side TypeScript (matches the Markets data model — Cycle 14's DRY refactor proved this scales). |

**Why TypeScript data over MDX this cycle:** the existing site is 100% statically typed. MDX adds compiler complexity, content-loader risk, and an editorial surface that isn't yet needed (Mia herself does not edit the repo). When/if Mia onboards as content editor, MDX or Decap CMS becomes a separate cycle.

**Why Next.js canonical, not GHL blog:** static export wins on (a) SEO/AEO indexability — Article schema lives in the HTML at request time, no JS hydration needed; (b) editorial control — typography, layout, related-modules are first-class; (c) deploy discipline — every post lands via the same `bun run build` + Caddy ETag flip pipeline as the rest of the site. GHL stays as the eventual CRM/automation endpoint when forms are wired.

## 5. How do Insights posts route visitors into private consultation?

Every post terminates in two CTAs:

| Tier | Component | Routes to |
|---|---|---|
| **Primary** | Soft, post-specific (`Request the private brief`, `Begin a private conversation about <market>`, `Request a property-specific review`, `Submit a private buyer brief`) | `/contact/?source=insight-<slug>&cta=<cta>` (until GHL wires, this lands on the existing Contact page with attribution params) |
| **Soft** | Inline mid-article module (`InlineInsightCTA`) and end-of-post (`LeadCaptureCTA`) | Same as above; secondary CTAs route to a relevant market or the broader `/insights/` library |

No post depends on the form working — every CTA is wired to an existing page that already accepts the inquiry, with attribution UTM-style params encoded so future GHL wiring captures source.

## 6. Which lead-capture paths can be implemented now without GHL?

| Path | Implementation status this cycle |
|---|---|
| Private Consultation Request | **IMPLEMENTED-STATIC** — CTA component routes to `/contact/?intent=consultation` |
| Confidential Home Valuation | **IMPLEMENTED-STATIC** — CTA component routes to `/valuation/` |
| Private Buyer Brief | **IMPLEMENTED-STATIC** — CTA component routes to `/contact/?intent=buyer-brief` |
| Quarterly Waterfront Market Brief | **IMPLEMENTED-STATIC** — CTA component routes to `/contact/?intent=market-brief` (no automated subscription claim) |
| Dockage / Route-to-Inlet Review | **IMPLEMENTED-STATIC** — CTA routes to `/contact/?intent=dockage-review&market=<slug>` |
| Private Listing Strategy Conversation | **IMPLEMENTED-STATIC** — CTA routes to `/contact/?intent=listing-strategy` |
| Market-Specific Brief Request | **IMPLEMENTED-STATIC** — CTA routes to `/contact/?intent=market-brief&market=<slug>` |

All seven are visible in the UI; all seven attribute correctly via URL param; **none claim to capture into a CRM**, automate a follow-up, or guarantee a response time. Copy reads as *"Reach out directly to begin a private conversation"* — honest about the manual step.

## 7. What is blocked

| Block | Owner | Notes |
|---|---|---|
| GHL workflow webhook URL + form POST destination | Principal + GHL admin | Until provided, forms route to existing pages with attribution params |
| TCPA consent mechanics (SMS opt-in language, double-opt-in flow) | Principal + legal counsel | No SMS/email opt-in copy ships this cycle |
| Branded email (`mia@miasanabriarealtor.com`) | Principal + email-provider decision | Canonical email stays `msanabriarea@gmail.com` per Cycle 14 |
| Analytics provider swap / Plausible / Umami | Principal | GA4 `G-PYYSF87G8K` already wired in `src/lib/mia.ts` |
| `.com` cutover from Direct Axess host | Principal + DNS scheduling | Staging stays on `.trueidea.com` |
| Lead magnet PDF / gated download | Principal | Out of scope this cycle (separate cycle) |

## 8. Rule for "Direct private intake is being finalized" copy

**Banned this cycle.** Cycle 14 OFFICIAL_GRAPHICS_REVIEW noted that overclaim copy creates a launch-blocker. Replacement language:

| Don't say | Do say |
|---|---|
| "Get instant access" | "Begin a private conversation" |
| "Download now" | "Request the private brief" |
| "Free report" | "Request a property-specific review" |
| "Discover your home's value" | "Request a confidential valuation" |
| "Direct private intake is being finalized" | (no replacement — just don't make the claim) |
| "Subscribe to our newsletter" | "Request the private market brief" |
| "Guaranteed response within 24h" | (no claim — Mia replies when she can) |

`audit:insights` enforces the banned-phrase regex.
