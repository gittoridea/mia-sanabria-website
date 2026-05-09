# Cycle 6 — Design Level-Up After (Phase 7 artifact)

**Authored:** 2026-05-09 (cycle 6, Phase 7)
**Purpose:** Document what visibly improved between baseline and post-implementation, anchor before/after screenshot pairs, and surface what still needs human review.

## Before/after screenshot directories

- **Before:** `/tmp/mia-cycle6-design-before/` (75 PNGs · 15 routes × 5 viewports · cycle-5 baseline content)
- **After:** `/tmp/mia-cycle6-design-after/` (75 PNGs · same routes/viewports · cycle-6 deploy content live at `https://miasanabriarealtor.trueidea.com`, ETag `didrenptbrb4*`, last-modified `2026-05-09T01:36:40Z`)

Diff with `compare`/`magick` or visual-inspection app of choice.

## What visibly improved

These changes are observable side-by-side at the named routes/viewports.

### Mobile drawer (`/`, `/about/`, every route at `mobile-sm` and `mobile-md`)

- **Before:** Tapping the menu icon revealed the drawer, but Tab-key cycled into hidden page content; ESC did nothing; body scroll continued under the drawer.
- **After:** Drawer captures focus on first link; Tab-cycle stays inside the drawer; ESC dismisses + returns focus to the toggle; body scroll is locked while open; `aria-modal="true"` + `role="dialog"` announce to assistive tech.
- **Verification:** `src/components/SiteHeader.tsx:14-49` (focus-manager useEffect); manual keyboard journey at 320×568 + 375×812.

### Header menu icon (`/`, every route at `mobile-sm` and `mobile-md`)

- **Before:** `h-10 w-10` (40×40 px) — below WCAG 2.5.5 AAA 44×44 floor.
- **After:** `h-12 w-12` (48×48 px) — comfortably above floor; consistent across navy borders.
- **Verification:** `src/components/SiteHeader.tsx:88-95`.

### Hero scrim on image-mode (`/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/markets/`, `/markets/[slug]/`)

- **Before:** Top + bottom scrim at navy-900/35; middle band navy-900/65. On bright image regions, eyebrow + H1 dropped below AA contrast at edges.
- **After:** Cycle-5 base scrim preserved verbatim. New content-band overlay (`inset-x-0 bottom-0 top-1/4 from-transparent via-navy-900/35 to-navy-900/55`) deepens the band where text renders without changing the H1 shadow stack. Eyebrow `text-brass-300` and H1 `text-cream-50` now meet AA across image source variance.
- **Verification:** `src/components/Hero.tsx:43-58`; visual diff on `/markets/fort-lauderdale/` and `/about/` heroes.

### MarketCard "Explore Area" label (`/`, `/markets/`, `/markets/[slug]/` related-markets blocks)

- **Before:** `text-brass-300` over image strip ≈ 2.17:1 contrast — failed AA.
- **After:** `text-cream-50` — passes AA on every market hero image; the brand-tracking eyebrow style preserved at `tracking-[0.3em]`.
- **Verification:** `src/components/MarketCard.tsx:31-34`.

### MarketCard h3 typography (`/markets/`, `/`)

- **Before:** `tracking-[0.05em]` — reads compressed/engineered at 2xl scale.
- **After:** Default `font-display` letter-spacing — reads editorial. Added `[text-wrap:balance]` on h3 + `[text-wrap:pretty]` on tagline.
- **Verification:** `src/components/MarketCard.tsx:27-30`.

### `/markets/` hub Hero (`/markets/`)

- **Before:** Hero rendered eyebrow/H1/sub but no first-viewport CTA — orientation only.
- **After:** Hero has primary CTA "Begin a private market brief" → `/contact/?intent=market-brief` and secondary CTA "Explore the markets" → `#primary-markets` (anchor-jumps to first market grid). Section gets `id="primary-markets"` + `scroll-mt-28` to land cleanly under the sticky header.
- **Verification:** `src/app/markets/page.tsx:82-91`.

### Buyer/Seller intent passthrough (`/buyers/` and `/sellers/`)

- **Before:** Both pages routed CTAs to `/contact/` with no intent context.
- **After:** Buyer CTAs include `?intent=buyer`; seller CTAs include `?intent=seller`. (When GHL endpoint lands, this metadata round-trips into a custom field for routing.)
- **Verification:** `src/app/buyers/page.tsx:115,126`; `src/app/sellers/page.tsx:115`.

### Form ergonomics (`/contact/`, `/valuation/`)

- **Before:** Inputs/textarea/select at `text-sm` (14px) — triggers iOS Safari zoom-on-focus on first field.
- **After:** All form controls at `text-base` (16px) — iOS Safari does not zoom; touch accuracy improves; AA-friendly.
- **Verification:** `src/app/contact/page.tsx`, `src/app/valuation/page.tsx` — class string change confined to `px-4 py-3 text-base text-navy-800 focus:border-brass-400 focus:outline-none`.

### Sticky-header anchor jumps (every route)

- **Before:** No `scroll-padding-top` — hash-link landings hid first heading under the fixed nav bar.
- **After:** `scroll-padding-top: calc(5.25rem + env(safe-area-inset-top))` on `html` — anchor jumps clear the header on every viewport including iOS notch/home-indicator devices.
- **Verification:** `src/app/globals.css:46-50`.

### AnswerFirst Q&A (`/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`)

- **Before:** Q&A rendered as `<h2>` + paragraph — no FAQPage schema; hardcoded `id="answer-first-heading"` (duplicate-id risk if reused on a single page).
- **After:** Each block emits its own FAQPage JSON-LD (Q+A as Question + acceptedAnswer); heading id uses `useId()` for guaranteed uniqueness; h2 gets `[text-wrap:balance]`; answer paragraph gets `[text-wrap:pretty]`; section padding moved to approved `py-16 lg:py-20` cadence.
- **Verification:** `src/components/AnswerFirst.tsx:1-93`; live verify on `/buyers/` shows `"@type":"FAQPage"` block (count went from 0 to 1 on these pages).

### Faq accordion summary (every page using Faq)

- **Before:** Summary rows had compact spacing; tap target close to but not assured at 44 px floor.
- **After:** Summary `min-h-[44px]` enforced; question gets `[text-wrap:balance]`; answer gets `[text-wrap:pretty]`. h2 also gets `[text-wrap:balance]`.
- **Verification:** `src/components/Faq.tsx:13-37`.

### Footer touch + aria-current (every page)

- **Before:** Footer links plain text anchors; no `min-height`; no `aria-current` indicator for current route.
- **After:** All footer link rows wrapped in `NavLink` (client component) with `min-h-[44px]` and `aria-current="page"` when route matches; legal-link row gets `min-h-[28px]` (legal links are smaller by design but still tappable).
- **Verification:** `src/components/SiteFooter.tsx`; `src/components/NavLink.tsx`.

### PlaceSchema county threading (`/markets/[slug]/`)

- **Before:** PlaceSchema emitted `addressRegion: "FL"` and `containedInPlace: AdministrativeArea Florida` — no county discrimination, so AEO entities for `/markets/boca-raton/` and `/markets/fort-lauderdale/` were ambiguous on jurisdiction.
- **After:** PlaceSchema accepts optional `county` prop; when present, `containedInPlace` becomes `AdministrativeArea county`, with state nested. Boca Raton + Delray Beach now correctly emit Palm Beach County; Fort Lauderdale + neighborhoods emit Broward County. JSON-LD block count went 148 → 153 (+5 from AnswerFirst FaqSchema across 5 pages).
- **Verification:** `src/components/schema/PlaceSchema.tsx`; `src/app/markets/[slug]/page.tsx:100-106`.

### Skip-link (`/`, every route — focus state)

- **Before:** `.skip-link:focus` only — no `:focus-visible`; outline absent in forced-colors mode.
- **After:** Both `:focus` and `:focus-visible` have explicit brass-400 outline + offset; survives forced-colors / Windows High Contrast modes.
- **Verification:** `src/app/globals.css:123-127`.

### REALTOR® keyword metadata (every page)

- **Before:** `keywords` had lowercase `"realtor"` — non-compliant descriptive usage per NAR Marks Manual (Card 4 RECOMMENDATION_PENDING).
- **After:** Keywords use `"REALTOR®"` consistently; descriptive phrases include the federal mark. (Body-copy descriptive uses are still pending per Card 4 — this fix is metadata-only.)
- **Verification:** `src/app/layout.tsx:38-46`.

## What still feels imperfect

These were not fixed cycle-6 — either deferred to Tier 2 / Tier 3 or gated externally.

- **Mailto silent failure** — UX layer still routes through `mailto:` with no completion state. Half-A (UX-only fallback) shippable now but flagged NOT safe-to-implement-now by lanes 5 + 9 absent principal direction on consent posture; half-B (real GHL endpoint + TCPA mechanics) is Tier 4 GHL-gated.
- **IntentRouter** still flat — three intent cards equally weighted; "Begin →" tertiary copy is still decision-first not relationship-oriented. Lane 1, 2, 3 convergence — but resolution is voice-adjacent and requires principal direction (Tier 3).
- **Heading hierarchy** still fully `--font-display` for h1-h6. Lane 1 + Lane 4 want h3+ pivoted to body-font; that's a Brand Contract evolution and Tier 3.
- **Hero motion ceremony** absent — Lane 1 F4. Tier 3.
- **Market template homogeneity** — all 13 markets render the same scaffold. Lane 1 F1 Tier 3.
- **MarketCard variants** — no archetype variation. Lane 1 F3 Tier 3.
- **Per-market `objectPosition` + richer alt text** — Lane 6 F3 + F4 — Tier 1 not shipped this cycle (architecture cost on data layer + content edits across 13 markets); queued for cycle 7.
- **Cycle-5 hero shadow stack** flagged as "over-strong" by Lane 4 F7 — preserved unchanged per mission boundary (cycle-5 fixes are correct; do not re-litigate). The cycle-6 scrim deepening at the content band addresses the underlying contrast issue without touching the shadow stack.
- **OG generator** still hard-codes 7 markets — Lane 6 F1 Tier 1 deferred (script edit, not UI).
- **Card 1 license** still rendered when truthy in `src/lib/mia.ts` — Lane 8 F5, Lane 9 F1; OPEN.
- **Card 4 REALTOR®** descriptive in body copy ("Fort Lauderdale REALTOR®") — Lane 9 F2; OPEN.
- **Card 5 combined REALTOR®+MLS logo** in footer trust strip — Lane 9 F4; OPEN.
- **DMCA placeholder** at `src/app/dmca/page.tsx` — Lane 9 F9; legal-cycle territory.

## Routes that need manual human review

- `/contact/` — concierge framing is text-additive; structural reframe deferred to Tier 3 (Lane 3 F9).
- `/valuation/` — single-step form is heavy on intake before establishing relationship; 2-step refactor deferred to Tier 3 (Lane 2 F7).
- `/about/` — credentials section pivots to data-table too early in the narrative arc (Lane 1 F6); deferred (voice-adjacent).
- `/markets/[slug]/` (each of 13) — homogeneity flagged across lanes 1, 4, 6; archetype variants are the Tier-3 fix.
- All hero image-mode routes — manually verify the new content-band scrim doesn't darken bright imagery in unintended ways. Visual review against `/tmp/mia-cycle6-design-after/*_desktop.png` recommended.

## Changes deferred to avoid drift

- shadcn/ui Sheet adoption — would replace the hand-rolled drawer focus-manager; queued for cycle 7 with explicit principal sign-off.
- shadcn/ui Accordion adoption — current `<details>`/`<summary>` Faq is a11y-good; replacing it adds keyboard-arrow navigation but introduces dependency churn. Queued.
- Tailwind v4 GA upgrade — when shipped; dedicated cycle.

## Audit telemetry post-implementation

```
typecheck: ✓
lint: ✓
build: ✓
audit:images: 10 PASS · 0 WARN · 0 FAIL (preserved)
audit:brand: 9 PASS · 0 WARN · 0 FAIL (preserved)
audit:seo: ✓ 0 warnings
audit:schema: 153 JSON-LD blocks across 27 pages, all parse (was 148 — +5 from AnswerFirst FaqSchema)
audit:links: ✓ 1244 internal links resolve
audit:completeness: 14 PASS · 2 WARN · 0 FAIL (preserved — known mailto + img-dim warns)
audit:stale-terms: ✓ clean

Live staging post-deploy:
  ETag: didrenptbrb4* (was didpufmmopa8*)
  last-modified: 2026-05-09T01:36:40Z (was 00:23:14Z)
  HTTP 200 across all 25 routes
```
