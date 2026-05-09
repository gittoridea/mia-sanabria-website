# Brand System Contract — Mia Sanabria Realtor Site

**Authored:** 2026-05-08 PM
**Authority:** This is the locked visual system. Any change requires explicit principal approval and a Decisions log entry in the project ISA.
**Source of truth in code:** `app/globals.css` (`@theme` block), `src/lib/site.ts`, `src/lib/mia.ts`, `tailwind.config` (implicit via Tailwind v4)
**Empirical anchor:** verified against the live staging surface as of commit `0fced7d` (2026-05-08 18:38 GMT)

This contract is the rule book. The next session's Designer lane must respect it; deviations are justified in the Decisions log, not silently applied.

## Tone & voice

- **Voice:** "Personal by design, not by claim." Editorial, considered, not pushy. First-person where Mia is speaking, third-person where the site is describing her.
- **Anchor lines:**
  - Tagline: `Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.` (`MIA.voice.tagline`) — updated 2026-05-08 cycle 5 per principal direction; supersedes the prior "Family Homes Where Memories Are Made" tagline (PRINCIPAL_DECISION_REGISTER Card 3 → DECIDED toward luxury/waterfront positioning)
  - Positioning: `Fort Lauderdale REALTOR®` (`MIA.voice.positioning`)
  - Anchor line: `If I don't know the answer, I will find it.` (`MIA.voice.anchorLine`)
- **Forbidden voice:** corporate jargon ("synergy", "leveraging", "best-in-class"), realtor-template clichés ("your dream home awaits", "let me find your forever home"), generic luxury platitudes ("redefining luxury", "elevated experience").

## Color system

All values are CSS variables in `app/globals.css` `@theme` block, mapped to Tailwind v4 utility classes.

| Token | Hex | Usage |
|---|---|---|
| `--color-navy-800` | `#0F2A44` | primary background for navy hero/footer; primary text on cream |
| `--color-navy-900` | (darker navy) | hero overlay gradient |
| `--color-cream-50` | `#fdfaf5` | primary text on navy (H1, hero body); page bg light surface 1 |
| `--color-cream-100` | `#faf3e7` | page bg light surface 2 (IntentRouter, alternate sections) |
| `--color-cream-200` | `#f5efe6` | secondary text on navy; subtle borders |
| `--color-cream-300` | `#ede4d3` | structural borders + dividers on dark surfaces |
| `--color-cream-400` | `#e0d3ba` | muted accent (rare) |
| `--color-brass-100` | `#e8dab7` | offset card behind headshot frame; subtle accent block |
| `--color-brass-300` | brass mid | borders on brass-bordered images; hover-state accents |
| `--color-brass-400` | brass-bright | primary CTA fill (`bg-brass-400 text-navy-900`) |
| `--color-brass-700` | brass-deep | small uppercase tracking text on cream surfaces (eyebrow on cream) |
| `--color-soft-black` | `#1A1A1A` | global body text fallback |
| `--color-white` | `#FFFFFF` | LPT logo background pad in dark footer |

**Forbidden additions:** no third primary color introduced without principal approval. The only colors a new component may use are: `navy-800`, `navy-900`, `cream-{50,100,200,300}`, `brass-{100,300,400,700}`, `soft-black`, `white`. Adding a new accent (e.g. coral, sage) violates the contract.

**Contrast minimums (WCAG 2.1 AA):**
- Body text on cream surface: ≥ 4.5:1 (`navy-800` on `cream-50`/`cream-100` passes)
- Body text on navy surface: ≥ 4.5:1 (`cream-50` on `navy-800` passes; `cream-200/90` on `navy-800` passes for sub-text)
- Large text (≥18pt): ≥ 3:1
- Decorative elements may go below; never apply contrast minimums to `aria-hidden` SVGs

## Typography

| Token | Family | Usage |
|---|---|---|
| `font-display` | Cinzel via `next/font/google` | All H1, H2, H3 + brass eyebrows + footer headings |
| `font-sans` | Montserrat via `next/font/google` | All body, sub-text, form labels, button text |

**Loading discipline:**
- Both fonts are loaded via `next/font/google` (self-hosted via Next.js); preconnect emitted automatically
- `font-display: swap` is set; chrome-headless screenshots at `--virtual-time-budget=20000` capture post-swap state (12000ms is too short — surfaces font-loading paint artifacts per process-improvement note)

**Heading sizes (Tailwind classes):**
- H1: `text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight [text-wrap:balance]`
- H2: `text-3xl sm:text-4xl font-display`
- H3: `text-xl font-display`
- Eyebrow: `text-xs uppercase tracking-[0.4em] font-display` (use `tracking-[0.3em]` on smaller eyebrows like service philosophy headings)

**Body sizes:**
- Hero sub: `text-lg sm:text-xl text-cream-200/90 [text-wrap:pretty]`
- Body: `text-[15px]` to `text-[17px]` leading-relaxed
- Small: `text-sm` (footer + secondary)
- Micro: `text-xs` (license, copyright, breadcrumb)

## Component rules

### Hero (`src/components/Hero.tsx`)

- Three modes: `background="navy"` (default), `background="cream"`, `background="image"`.
- `background="image"` requires `imageSrc` + `imageAlt`; renders `<Image fill priority sizes="100vw">` + dark overlay gradient `from-navy-900/15 via-navy-900/35 to-navy-900/15` (per principal "brighter feel" directive — **do not darken without explicit principal approval**).
- H1 over `image` background gets text-shadow `[text-shadow:0_2px_18px_rgba(15,42,68,0.85),0_1px_3px_rgba(0,0,0,0.65)]` (Cato concern resolution — **do not remove**).
- H1 over `cream` background uses `text-navy-800`; over `navy`/`image` uses `text-cream-50`.
- Hero padding mobile `py-28` (was `py-24` — **do not regress**); desktop `lg:py-40`.

### CTA buttons

- **Primary** (`bg-brass-400 text-navy-900`): rounded-full, `px-8 py-3.5 text-sm font-semibold tracking-wide`, hover `bg-brass-300`, ArrowRight icon `h-4 w-4` aria-hidden. **Do not regress to `px-7 py-3 font-medium`** (weakens hierarchy).
- **Secondary** (`border border-cream-200/40 text-cream-100`): rounded-full, same `px-8 py-3.5` for size parity (or `px-7 py-3` if outdoor variant), hover `border-brass-300 text-brass-300`.
- **Tertiary** (text link): `hover:text-brass-300` underline-on-hover, no chip.
- **Tap target ≥ 44 × 44 CSS px** with ≥ 8 px gap (WCAG 2.5.5 AAA). Pill CTAs already meet this; small inline links should also satisfy when standalone.

### Cards

- **MarketCard:** rounded image + tagline below; hover lift `hover:-translate-y-0.5` with `transition-[transform,box-shadow]`; chevron is `ArrowRight` (do not switch to `ArrowUpRight` — visual-consistency lock).
- **IntentRouter cards:** brass eyebrow + Cinzel heading + Montserrat sub + brass arrow → cream surface variant.
- **Service-philosophy items (about page):** numbered `01 · 02 · 03` brass-tracking labels + Cinzel heading + body.
- **Anti:** no glassmorphism, no gradient borders, no neon edge effects.

### Sections — structural

- Section vertical padding: `py-20 lg:py-28` for primary sections; `py-16 lg:py-20` for secondary; `py-14` for footer.
- Container: `mx-auto max-w-7xl px-4 lg:px-8`.
- Luminance ripple discipline: home flow is navy(hero) → cream-50 (MeetMia) → cream-100 (IntentRouter) → cream-50 → cream-100 → navy(footer). Adjacent same-color sections forbidden without a divider.

## Image treatment

| Use | Required size | Format | Source |
|---|---|---|---|
| Mia headshot (square, schema.org Person.image canonical) | 1024×1024 | JPEG q88 mozjpeg | `public/mia-headshot.jpg` |
| Mia avatar (header / drawer / mini-card) | 256×256 | JPEG q88 | `public/mia-headshot-256.jpg` |
| Mia OG (social-share landscape) | 1200×630 | JPEG q86 | `public/mia-og.jpg` |
| Market hero (portrait) | 1200×1500 | JPEG q88 | `public/markets/<slug>.jpg` |
| Market OG (landscape) | 1200×630 | JPEG q88 | `public/markets/og-<slug>.jpg` (post-cycle) |
| Service portrait | 1200×1500 | JPEG q86 | `public/services/<slug>.jpg` |
| Service OG | 1200×630 | JPEG q86 | `public/og-<slug>.jpg` |
| Default site OG | 1200×630 | JPEG q88 | `public/og-default.jpg` |
| LPT logo | 1097×1097 native | PNG transparent | `public/logos/lpt-realty.png` |
| MLS REALTOR® logo | 257×118 | PNG transparent | `public/logos/realtor-r.png` |
| EHO logo | 150×161 | PNG transparent | `public/logos/equal-housing.png` |

**Optimization pipeline:** all photos pass through sharp + mozjpeg q88 (q86 for OG variants where extra compression is acceptable). LPT logo + brass logos preserve transparency.

**Anti-AI-feeling rules:**
- No DALL-E/Midjourney aesthetic markers (overly stylized lighting, surreal architecture, AI-perfect symmetry without grain)
- AI-generated market hero portraits acceptable as INTERIM until Mia provides real photography
- Mia's headshot must be the principal-supplied real photo (current 1024² source from vibe.filesafe.space)
- Decorative scene photography (interior shots, neighborhood street views, waterfront sunset) acceptable AI fill if labeled in repo notes; replace with real shoots post-launch

**Alt text discipline:**
- Decorative images: `alt=""` AND `aria-hidden="true"`
- Functional images: descriptive alt text including subject + context (e.g. `Mia Sanabria, REALTOR® with LPT Realty`)
- Hero background image: alt describes what's pictured (`Twilight luxury waterfront residence in Fort Lauderdale`); when a hero is purely scenic, an empty alt with screen-reader-friendly context elsewhere is acceptable

## CTA rules

- **Primary CTA per page** — exactly one, calling the user to the highest-value action for that page:
  - Home: `Schedule a Conversation` → `/contact/`
  - About: `Schedule a Private Conversation` → `/contact/`
  - Buyers: `Begin a Buyer Conversation` → `/contact/?intent=buyer`
  - Sellers: `Request a Listing Conversation` → `/contact/?intent=seller`
  - Valuation: `Request a Valuation` → form on page
  - Insights essays: `Schedule a Conversation` → `/contact/`
  - Lead magnet landing: `Get the Guide` → form on page
- **Secondary CTA** — softer conversion path, never competing visually with primary:
  - About link / Markets link / Insights link, always rendered as secondary `border border-cream-200/40` button OR text link
- **No tertiary CTAs cluttering the section.** A page may have a primary + secondary in hero, plus a `<CTAStrip>` at section close; nothing else.

## Footer rules

The footer is a trust signal, not navigation overflow. Three structural rows:

1. **Four-column grid** (`lg:grid-cols-4`):
   - Col 1: `MIA SANABRIA` brand mark + positioning eyebrow + brand body + 4 social icons (Facebook, Instagram, LinkedIn, YouTube)
   - Col 2: `EXPLORE` heading + 5 nav links (Featured Markets / Buying / Selling / Home Valuation / Insights)
   - Col 3: `ABOUT` heading + About + Contact + phone tel + email mailto
   - Col 4: `BROKERAGE` heading + legal address block + license # (null-guarded) + IDX disclaimer

2. **Trust strip** (`aria-label="Industry affiliations"` — full-width row):
   - LPT Realty logo + label
   - MLS REALTOR® logo + label
   - Equal Housing Opportunity logo + label
   - Each rendered via `<FooterTrustMark>` subcomponent (logo + Cinzel uppercase tracking-[0.3em] label)

3. **Copyright row** (full-width):
   - `© <year> Mia Sanabria. All rights reserved.` left
   - 4 legal links right (Privacy / Terms / Accessibility / DMCA)

**Rules:**
- License # rendered ONLY when `MIA.unverified.licenseNumber` is non-null; null-guarded conditional preserved
- Brokerage name `LPT Realty LLC` legal form per FREC § 61J2-10.025; brokerage display name `LPT Realty` allowed in copy elsewhere
- IDX disclaimer ALWAYS present in BROKERAGE column even if iframe is not on the current page
- Each footer trust mark must carry an explicit text label adjacent (NAR display-rules best practice)

## Compliance & disclosure

- **EHO statement on every page footer** (sentinel: literal `Equal Housing Opportunity` string in built HTML; audit-completeness checks 7 sampled routes)
- **REALTOR®** rendered with all-caps + ® symbol everywhere except domain/username contexts (per NAR Membership Marks Manual)
- **License # rendering:** `FL Sales Associate License #SL3405877` in footer; null-guarded; populated only via `MIA.unverified.licenseNumber`. Never assert as DBPR-verified until Mia confirms.
- **TCPA + Florida § 501.059 + CCPA hybrid consent** required on every form submission point (already in `/terms/` body + must be echoed below form fields in plain language for the lead magnet)
- **Florida § 501.171 breach-notification** referenced in Privacy
- **17 USC § 512** DMCA procedure live at `/dmca/` (USCO designated-agent registration TODO inline)

## Mobile rules

- **Breakpoints:** Tailwind defaults: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
- **Test viewports** (mandatory): 320×568 (iPhone SE), 375×812 (iPhone 15), 414×896 (Pixel 7), 768×1024 (iPad portrait), 1024+ (laptop)
- **Touch targets:** ≥ 44 × 44 CSS px with ≥ 8 px gap (WCAG 2.5.5 AAA)
- **No `:hover`-only affordances** — every CTA must be reachable via tap
- **No `maximum-scale=1, user-scalable=no` viewport meta** (forbidden — breaks WCAG 1.4.4 Resize Text). Site uses `maximum-scale=5` per layout.tsx.
- **Form input font-size ≥ 16px** to prevent iOS Safari focus-zoom (per `docs/RESEARCH_MOBILE_A11Y.md`)
- **Sticky-header `scroll-padding-top`** to handle anchor-jumps + back-nav scroll-restore
- **`100dvh` instead of `100vh`** on hero where viewport-height-dependent (handles iOS Safari URL bar collapse)
- **Bottom-fixed CTAs** must honor `env(safe-area-inset-bottom)` on iOS

## Screenshot acceptance criteria

For visual evidence in audit cycles + handoff docs:

- **Tool:** `google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars`
- **Capture flag:** `--screenshot=<file>` with `--window-size=<W>,<H>`
- **Render budget:** `--virtual-time-budget=20000` (20s) — **mandatory minimum** to avoid Cinzel font-display:swap paint artifacts (12s is too short; produces low-contrast H1 false-positives)
- **Cache-bust query:** append `?_=$(date +%s)` to URL when targeting live staging post-deploy (per memory `feedback_caddy_dokploy_cache_bust.md`)
- **Coverage:** 5 viewports × N routes; minimum routes = home + about + 1 service page + 1 market detail + 1 lead magnet/guide page + 1 legal
- **Acceptance per screenshot:**
  - H1 rendered in correct color (cream-50 on navy/image; navy-800 on cream)
  - Brass eyebrow present and readable on its surface
  - Primary CTA visible above-the-fold on mobile (375×812 minimum)
  - Photo not stretched, not pixelated, dimensions match repo source-of-truth
  - Footer trust strip + copyright row visible on every viewport (or scroll-evidence if below fold)
  - No layout shift between adjacent viewports (320 → 375 → 414 should be a gradual reflow, not a snap)

**Visual evidence reject criteria:**
- H1 invisibly low-contrast (re-capture at higher virtual-time-budget; if persists, escalate to CSS investigation)
- CTA missing chevron icon
- Brass eyebrow absent on hero (component contract violation)
- Footer trust strip missing logos (logo path drift; investigate)
- Image rendering as broken-image icon (URL fingerprint failure)

## Drift detection

- `bun run audit:completeness` is the structural-drift guardrail. Runs `audit:all`. Required green before deploy.
- `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md` is the page-by-page coverage map. Refresh each cycle.
- Cato cross-vendor re-audit per memory `feedback_cato_structured_verdict_prompt.md` after each design-affecting commit at E4/E5.

## Cross-references

- `app/globals.css` — `@theme` token block (canonical color + font definitions)
- `src/components/Hero.tsx` — Hero component contract enforced
- `src/components/SiteFooter.tsx` — footer 3-row structure
- `src/components/MarketCard.tsx` — card hover lift + chevron rules
- `src/components/CTAStrip.tsx` — section-close CTA rules
- `src/lib/site.ts` — SITE constants
- `src/lib/mia.ts` — MIA voice + brokerage + contact constants
- `docs/RESEARCH_MOBILE_A11Y.md` — mobile + accessibility deep-audit research
- `docs/RESEARCH_COMPLIANCE_LOGOS.md` — official asset URLs + regulatory citations
- `docs/COMPLIANCE_GATE_2026_05_08.md` — 10-axis Compliance Gate verdict
- `docs/PRODUCTION_READINESS_AUDIT_2026_05_08.md` + `_PM.md` — 22-pillar scorecards
