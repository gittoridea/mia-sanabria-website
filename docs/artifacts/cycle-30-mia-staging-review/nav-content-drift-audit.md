# Cycle 30 — Visible Nav + Content Drift Audit

**Base:** `https://miasanabriarealtor.trueidea.com/` (post-Cycle-29 deploy, ETag `dihxpvatt4ow57u7`)
**Method:** surgical regex on `<nav aria-label="Primary">` and `<nav id="mobile-nav">` blocks of every reviewed route; honesty-contract live grep on 16 routes.

## Mia-approved nav (source of truth)

Per project brief and `src/lib/site.ts:51-77` (Cycle 24 Mia-Live-Decisions lock):

```
Neighborhoods, Buyers, Sellers, Blog, About, Contact, Home Search
```

- `/insights/` route slug retained for SEO continuity; **labeled** `Blog` in the header.
- `/markets/` route slug retained for SEO continuity; **labeled** `Neighborhoods` in the header.
- `Home Search` rendered as Search icon link (desktop) + labeled button (mobile drawer).

## Observed desktop header nav (live)

| Route | Header `Primary` nav labels | Match Mia-approved? |
|---|---|---|
| `/` | `[Neighborhoods, Buyers, Sellers, Blog, About, Contact]` + Search icon (aria-label `Home Search`) + phone CTA | ✓ |
| `/markets/` | same | ✓ |
| `/markets/fort-lauderdale/` | same | ✓ |
| `/markets/pompano-beach/` | same | ✓ |
| `/markets/deerfield-beach/` | same | ✓ |
| `/markets/coral-springs/` | same | ✓ |
| `/markets/plantation/` | same | ✓ |
| `/markets/weston/` | same | ✓ |
| `/markets/hollywood/` | same | ✓ |
| `/markets/davie/` | same | ✓ |
| `/markets/sunrise/` | same | ✓ |
| `/buyers/` | same | ✓ |
| `/sellers/` | same | ✓ |
| `/insights/` | same | ✓ |
| `/about/` | same | ✓ |
| `/contact/` | same | ✓ |

## Observed mobile drawer nav (live)

| Route | `mobile-nav` labels | Match Mia-approved? |
|---|---|---|
| `/` | `[Neighborhoods, Buyers, Sellers, Blog, About, Contact, Home Search]` + phone CTA | ✓ |
| (all other routes — drawer is identical across routes) | same | ✓ |

## Search icon accessibility label

`<a aria-label="Home Search" title="Home Search" href="/markets/#property-search">` rendered both in desktop header (icon only) and in the mobile drawer (icon + visible `Home Search` label). Screen readers and hover tooltips both read `Home Search`. **No drift.**

## `/insights/` route label classification

| Layer | Value |
|---|---|
| Route slug | `/insights/` (retained per `src/lib/site.ts:51-77` for SEO continuity) |
| **Header nav label (desktop + mobile)** | **`Blog`** ✓ (matches Mia decision) |
| Footer "Explore" column label | `Insights` (non-nav) |
| Homepage section eyebrow + H2 | `Insights` / `Latest Insights` (non-nav) |
| Data-model identifiers (TS types, helper fn names) | `Insights*` — code-only, not visible copy |

## Non-nav "Insights" references — classification only

Per project brief: "Non-nav 'Insights' references in section eyebrows, resource labels, metadata, or footer text should be classified separately. Do not falsely call non-nav text a header/nav failure."

| # | Location | Visible? | Source | Cycle 30 verdict |
|---|---|---|---|---|
| 1 | Footer "Explore" column link | yes | `src/lib/site.ts:85` `FOOTER_NAV.explore = [{ href: "/insights/", label: "Insights" }]` | non-nav. Surface as a Mia decision in the review packet — she may want `Blog` end-to-end. |
| 2 | Homepage section eyebrow `<span>Insights</span>` divider | yes | `src/app/page.tsx` (rendered above `<InsightsTeaser>`) | non-nav. Same Mia decision. |
| 3 | Homepage section H2 `Latest Insights` | yes | `src/app/page.tsx:166` `<InsightsTeaser heading="Latest Insights" />` | non-nav. Same Mia decision. |
| 4 | TS type `InsightCTA`, helper `getAllInsights`, etc. | no | `src/lib/insights.ts`, `src/components/cta/*.tsx`, `src/app/sitemap.ts` | not visible. No drift. |

**Non-nav verdict:** no header-nav drift. Three visible non-nav `Insights` surfaces (footer link, section eyebrow, section H2) are surfaced to Mia for her decision in `mia-review-packet.md`. No source code change made this cycle.

## Visible copy drift from Mia doctrine

| Class | Live grep (all 16 routes) | Result |
|---|---|---|
| Luxury-as-practice (`luxury concierge`, `white-glove`, `bespoke`, `high-net-worth`, `off-market`, `since 2017`, `within two hours`) | 0 hits | ✓ |
| Fair Housing steering (`best schools`, `good schools`, `safe neighborhood`, `family-friendly`, `kid-friendly`, `bachelor pad`) | 0 hits | ✓ |
| FREC superlatives (`#1 realtor`, `top realtor`, `best realtor`, `guaranteed sale`, `guaranteed price`) | 0 hits | ✓ |
| Bilingual professional-service claim (`bilingual`, `hablo español`, `Spanish-speaking`) | 0 hits | ✓ |
| Testimonial placeholders (`lorem ipsum`, `placeholder testimonial`, `TESTIMONIAL_PLACEHOLDER`) | 0 hits | ✓ |
| Visible `Updated MONTH YYYY` blog label | 0 hits | ✓ |
| Old H1 `Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton` | 0 hits | ✓ |

**Verdict:** no visible copy drift. Mia doctrine intact across all 16 routes.

## False production-readiness language

Cycle 30 grep for "production ready", "launch ready", "ready for launch" claims in live HTML: 0 visible occurrences. Live HTML carries `noindex,nofollow` (`IS_STAGING=true`). No public surface claims production-readiness. Staging is correctly framed as public-review only. **No drift.**

## Canonical-domain wording drift in visible HTML

Cycle 30 grep for `miasanabriarealtor.com` and `miasanabria.com` in live HTML: only contexts found are the canonical `<link>` tag (correctly set to `miasanabriarealtor.trueidea.com`) and the schema `breadcrumbItem` URLs (also correctly staging-scoped). No leaked references to the legacy `miasanabriarealtor.com` Direct Axess host on any rendered page. **No drift.**

## Action required

- **Header / mobile nav drift:** none. No action required.
- **Non-nav `Insights` (footer + section eyebrow + section H2):** Mia decision needed — does she want `Blog` end-to-end? Surfaced in Phase 6 `mia-review-packet.md`. No action this cycle.
- **Honesty contracts:** all clean. No action required.
- **Production-readiness language:** none on live. No action required.
- **Canonical-domain visible HTML:** clean. No action required.
- **Canonical-domain docs/report drift:** see `canonical-domain-drift-audit.md` — 3 active doctrine docs received banner corrections this cycle; ISA Vision queued for future ISA-rev cycle.

**Net:** Cycle 30 found zero visible header/mobile nav drift, zero visible copy drift, and zero false production-readiness language. The only Mia-facing decision surfaced is whether to extend the `Blog` label outside the header nav (footer + section labels).
