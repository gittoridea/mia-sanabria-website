# Team 7 — Accessibility, Performance, Technical QA

**Generated:** 2026-05-11
**Mode:** Read-only audit (no source edits)
**Live:** https://miasanabriarealtor.trueidea.com/
**Repo:** /home/torrey/code/mia-sanabria-website/

## Executive summary

Baseline accessibility is materially strong — skip-link, ARIA landmarks, focus-visible ring,
44px tap-target floor in CSS, mobile-drawer focus-trap with Escape, valid heading order on
every route sampled, 318/318 `<img>` tags carry alt attributes, hero glyph contrast 15:1+
on every route. `bun run typecheck`, `bun run lint`, and `audit:images`, `audit:links`,
`audit:mobile-readability` are clean.

Real gaps are scoped: (1) image weight 6.0 MB across 16 market heroes served as un-optimized
JPGs because `next.config.ts` has `images: { unoptimized: true }` for static export — LCP +
data-cost opportunity; (2) PDF download anchors lack the `download` attribute and the
"PDF" file-type marker is `aria-hidden`, so screen readers announce only the title
without indicating it's a PDF; (3) hero CTAs at the 320 px viewport use `py-2.5 text-[9px]`
≈ 36 px tall — below the WCAG 2.5.5 44 px target floor (the CSS `@media (max-width:640px)`
44 px floor uses `:where()` 0-specificity, so the explicit `py-2.5` utility wins).

---

## Section 1 — Accessibility findings

| Route | Issue | Severity | WCAG |
|---|---|---|---|
| All routes (`Hero.tsx`) | Mobile hero CTA at <360px viewport is ~36px tall (`py-2.5 text-[9px]`), below 44px floor | P2 | 2.5.5 (AA) |
| `/markets/fort-lauderdale/` | PDF download links: filetype marker (`↓ PDF`) is `aria-hidden`, link accessible name is just the title — screen reader user does not learn it's a PDF | P2 | 1.3.1, 2.4.4 |
| `/markets/fort-lauderdale/` | PDF download links lack `download` attribute — file opens in browser viewer instead of downloading; meaningful for assistive-tech and slow-connection users | P3 | best-practice |
| `MarketCard.tsx` | Card alt-text is generic: `${name} luxury real estate` (16× identical pattern). Functional but not descriptive — `markets.ts` has `heroImageAlt` defined; the card hardcodes a generic string and ignores it | P3 | 1.1.1 |
| `/contact/`, `/valuation/` | Form has no inline validation error region (`aria-live` / `role="alert"`); only `noValidate` + `mailto:` fallback. Errors from browser surface natively. Acceptable for mailto-only forms; flag for when GHL endpoint lands | P3 | 3.3.1 |
| `/contact/` | "Areas of Interest" `<select>` has no associated empty-state validation pattern (defaultValue="" + disabled option) — fine for now, but the field has no `required` so submission with default is allowed; user intent may be lost | P3 | 3.3.2 |
| Sitewide | No `aria-current="page"` directly on nav `<a>` (delivered via Tailwind `aria-[current=page]` class pattern from `NavLink`) — verified working on live HTML | OK | 2.4.8 |
| `IdxEmbed.tsx` | `<iframe title>` present, `<noscript>` fallback present, `loading="lazy"` present | OK | 4.1.2, 2.4.4 |
| Sitewide | Skip-link, `<main id="main">`, `<header>`, `<nav aria-label="Primary">`, `<footer aria-labelledby="footer-heading">` | OK | 1.3.1, 2.4.1 |
| `SiteHeader.tsx` mobile drawer | Focus-trap, Escape closes, `aria-expanded`, `aria-controls`, `aria-modal`, focus restoration on close | OK | 2.1.1, 2.1.2 |
| `globals.css` | Global `a/button/input/textarea/select/summary/iframe:focus-visible` ring at 2px brass-400 outline-offset 3px; `prefers-reduced-motion` honored | OK | 2.4.7, 2.3.3 |
| All routes | Heading order verified on `/`, `/markets/fort-lauderdale/`, `/insights/`, `/insights/fort-lauderdale-waterfront-buyer-guide/`, `/buyers/`, `/sellers/`, `/contact/`, `/about/` — no skipped levels | OK | 1.3.1, 2.4.6 |
| `SiteHeader.tsx` | Decorative logo `<img alt="" aria-hidden="true">` correctly hidden | OK | 1.1.1 |
| Hero contrast | Glyph contrast 15.33–15.93 across 110 viewport×route combinations | OK | 1.4.3 (AAA) |

## Section 2 — Performance findings

| Area | Finding | Severity |
|---|---|---|
| Image format | `next.config.ts` has `images: { unoptimized: true }` (required by `output: "export"`). All market heroes are JPGs at 238–600 KB. No WebP / AVIF served. Total `/public/markets/` = 6.0 MB. Sitewide opportunity: pre-build sharp pipeline to emit `.webp` next to each `.jpg` and use `<picture>` with `<source type="image/webp">` fallback. Estimated savings: 40–60% per asset = 2.5–3.5 MB sitewide. | P2 |
| LCP | Home hero `markets/fort-lauderdale.jpg` is 238 KB JPG preloaded (`<link rel="preload" as="image">`) — fine for desktop, fat for 3G mobile. WebP would drop to ~95–140 KB. | P2 |
| CLS | `next/image fill` with `sizes` declared on Hero, MarketCard, MeetMia, About headshot — width/height correctly inferred by Next. No CLS risk identified. | OK |
| Lazy loading | `next/image` auto-applies `loading="lazy"` except on `priority` (hero + first 3 market cards). Verified on live HTML for below-fold cards (`loading="lazy"` present). IDX iframe `loading="lazy"`. | OK |
| Fonts | Cinzel + Montserrat via `next/font/google` with `display: "swap"`, preloaded with `crossorigin="" type="font/woff2"`. | OK |
| Cache | Caddy: `cache-control: public, max-age=300, s-maxage=600, must-revalidate` on HTML. Static assets through Next chunks get content-hashed filenames; standard. | OK |
| HTTP/3 | `alt-svc: h3=":443"` advertised. HSTS preloaded. | OK |

## Section 3 — Image audit

- `audit:images` (cached): **14 PASS / 0 WARN / 0 FAIL**. 318/318 `<img>` carry alt. 49/49 `og:image` resolve. All 16 markets have card + hero + OG images. No placeholder filenames. No remote `<img>` URLs.
- Manual: alt text quality is generic on `MarketCard.tsx` — `${market.name} luxury real estate` repeated 16×. `markets.ts` has richer `heroImageAlt` strings (e.g. `"Fort Lauderdale waterfront luxury residence with Intracoastal view"`) that the card does not consume. Low-risk wire-up; safe fix candidate.
- File sizes (largest 5): `sea-ranch-lakes.jpg 599K`, `coral-ridge.jpg 571K`, `victoria-park.jpg 551K`, `harbor-beach.jpg 447K`, `delray-beach.jpg 444K`. All within JPEG quality budget but WebP/AVIF would halve them.
- Format: 7 JPG + 4 PNG on the FL market page sample. PNG used for logos (correct — transparency required).
- No oversized images detected for their intended display size; aspect ratios match crop targets.

## Section 4 — Technical QA

| Check | Result |
|---|---|
| `bun run typecheck` | exit 0 (no errors) |
| `bun run lint` | exit 0 (no warnings/errors) |
| `bun run audit:links` | 2,425 internal links across 49 pages — all resolve |
| `bun run audit:images` | 14 PASS / 0 FAIL |
| `bun run audit:mobile-readability` | 56 PASS / 0 FAIL (contract-presence check) |
| `bun run audit:hero-contrast` (cached) | 110 PASS / 0 FAIL |
| `bun run audit:rendered` | Port 4173 already in use — skipped this session (other audit holding port) |
| External links | Only Mia's 4 social URLs on `/about/`. All carry `target="_blank" rel="noopener noreferrer"` via `FooterSocial` component pattern. |
| CSP | Defined at Caddy: default-src 'self', script-src includes Google Tag Manager + Analytics, frame-src includes sef.mlsmatrix.com + google maps. Strict-Transport-Security 2y + preload. X-Frame-Options SAMEORIGIN. |
| Dep warnings | `next 15.1.0`, `react 19.0.0` (current major). No bun-incompatible deps in `package.json`. `eslint-config-next 15.1.0` matches Next major. |
| Lighthouse | Cannot run from this headless sandbox without launching Chrome with `--remote-debugging-port`. Documented and skipped; recommend running locally via `lighthouse https://miasanabriarealtor.trueidea.com/ --form-factor=mobile`. |
| 404 handling | `not-found.tsx` returns rendered fallback with h1 + CTAs back to `/` and `/markets/` — accessible. |

## Section 5 — Safe fix candidates

Ranked by impact/effort. Each is read-only-of-source-now; queue as separate fix PRs.

1. **Wire `MarketCard.tsx` alt to `market.heroImageAlt`** (1-line change). Loses generic
   `"${market.name} luxury real estate"`, gains specific descriptions already curated in
   `markets.ts`. Pure value-add; no token/visual change. WCAG 1.1.1. *(Source change deferred per non-edit mandate.)*
2. **Hero CTA tap-target at 320–359px**. Bump `py-2.5` → `py-3` and minimum text size to
   `text-[10px]` so the rendered button hits 44 px. The 360px+ branch already meets the
   floor. Visual review needed because this is the locked Cycle 9 "Approach C-refined"
   layout — coordinate with Team 4 before changing.
3. **Add `download` attribute + visible-text PDF marker on lead-magnet links**. In
   `FortLauderdaleV2.tsx` (lines 826, 835, 844), change the `aria-hidden` `↓ PDF`
   span to a visible `(PDF)` text token, and add `download` to each `<Link>`.
4. **Pre-build sharp WebP/AVIF pipeline + `<picture>` wrapper around `next/image`**.
   Larger effort; biggest payoff. Static export means Next can't auto-optimize, so a
   `scripts/build-modern-images.ts` step before `next build` is the path. Pair with
   Team 6 if they own image pipeline.
5. **Stop using `focus:outline-none` on form inputs**. Currently safe because
   `globals.css :focus-visible` rule overrides, but the utility is misleading and a
   future Tailwind plugin tweak could flip the order. Remove `focus:outline-none` from
   `Field`, `<select>`, `<textarea>` in `contact/page.tsx` + `valuation/page.tsx` and
   trust `:focus-visible` global. Cosmetic only.

## Section 6 — Issue rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T7-001	team7	all	a11y	Mobile hero CTA <360px is ~36px tall (py-2.5 text-[9px])	src/components/Hero.tsx:71,87	P2	WCAG 2.5.5 fail at iPhone SE 320	Bump to py-3 text-[10px] in <375 branch	dev	S	HIGH	no	src/components/Hero.tsx	chrome --headless screenshot at 320x568 + measure button bbox
T7-002	team7	markets/fort-lauderdale	a11y	PDF download links have aria-hidden filetype marker; download attr missing	src/components/markets/FortLauderdaleV2.tsx:826-849	P2	Screen-reader users don't learn it's a PDF; opens in browser not download	Replace aria-hidden span with visible (PDF) text + add download attr	dev	S	HIGH	no	src/components/markets/FortLauderdaleV2.tsx	curl + grep for download= and PDF text on /markets/fort-lauderdale/
T7-003	team7	all market cards	a11y	MarketCard alt is generic; markets.ts has curated heroImageAlt unused	src/components/MarketCard.tsx:29 vs src/lib/markets.ts heroImageAlt	P3	WCAG 1.1.1 quality; brand voice undelivered	Replace alt={`${market.name} luxury real estate`} with alt={market.heroImageAlt ?? `${market.name} luxury real estate`}	dev	XS	HIGH	no	src/components/MarketCard.tsx	curl + grep for specific alt strings on /markets/ and home
T7-004	team7	all	perf	Static-export uses unoptimized images; 6.0MB JPGs across 16 markets; no WebP/AVIF	next.config.ts:6; public/markets/*.jpg du -sh = 6.0M	P2	LCP cost on 3G; data cost for mobile users	Add scripts/build-modern-images.ts (sharp WebP+AVIF pipeline pre-build) + <picture> wrapper component	dev	M	HIGH	no	scripts/build-modern-images.ts (new); src/components/Hero.tsx; src/components/MarketCard.tsx	Lighthouse mobile LCP before/after; bytes per image
T7-005	team7	contact valuation	a11y	Form inputs use focus:outline-none; relies on globals.css :focus-visible to restore ring	src/app/contact/page.tsx:155,179,248; src/app/valuation/page.tsx:148,260	P3	Cosmetic; works correctly today via global cascade	Remove focus:outline-none utility; trust :focus-visible global	dev	XS	HIGH	no	src/app/contact/page.tsx; src/app/valuation/page.tsx	keyboard tab + visual focus-ring verification with chrome --headless
T7-006	team7	contact	a11y	No live error region for client-side validation errors (noValidate + mailto)	src/app/contact/page.tsx:115	P3	Acceptable for mailto-only; flag for GHL cutover	When GHL endpoint lands, add role=alert region tied to aria-describedby for failed fields	dev	M	MED	no	src/app/contact/page.tsx	manual tab + submit + screen-reader verify
T7-007	team7	all	tech	No Lighthouse run available from this sandbox	N/A	P3	Unmeasured CWV baseline	Run `lighthouse https://miasanabriarealtor.trueidea.com/ --form-factor=mobile --quiet --chrome-flags=--headless` locally and attach JSON to next cycle handoff	dev	XS	HIGH	no	—	Lighthouse JSON artifact
T7-008	team7	all	tech	audit:rendered + audit:hero-contrast both want port 4173 — port-guard exists but session collision blocked re-run this audit	scripts/lib/port-guard.ts referenced in CLAUDE.md	P3	Audit chain interruption only	No code change — usage discipline; document in audit:all README	dev	XS	HIGH	no	—	Run audit:all from clean shell
```

## Section 7 — Confidence + dissent

**Confidence: HIGH** on a11y findings (verified against live HTML + source). **HIGH** on
file-size measurements (du output). **MED** on tap-target (CSS pixel math from utility
classes; eyeball-grade not screenshot-grade — actual button height at 320×568 must be
measured with Chrome devtools to confirm 36 vs 40 vs 44 px). **MED** on T7-004 estimated
savings (40–60% is an industry-typical WebP-vs-JPG range; per-asset numbers will vary).

**Dissent.** Two findings on the boundary:

- **T7-003 (generic alt text).** A reasonable counter: card alt is functional and
  consistent; replacing 16 strings with longer descriptions adds page weight and might
  not be a meaningful improvement for sighted users with vision (the heading + tagline
  immediately below already describe each card). Recommend HIGH-confidence ship anyway
  because `heroImageAlt` is curated copy already paid for; not using it is waste, and
  AT users get richer context.
- **T7-005 (focus:outline-none).** Pure code-hygiene; no observable user-facing impact
  today. Could be SKIP. Including only because removing the utility eliminates a future
  cascade-flip footgun.

**Honesty disclosure.** I could not run Lighthouse in this session (no browser-with-remote-
debugging available). All performance findings are structural (config + file sizes +
preload behavior on live HTML) — not measured Core Web Vitals.

---

**6-line summary**

- A11y issues: 6 (1 × P2 tap-target, 1 × P2 PDF link semantics, 4 × P3 form/alt-quality polish); baseline strong (skip-link, focus-trap, contrast 15:1, all 318 imgs have alt)
- Perf issues: 1 × P2 (6.0MB JPGs un-optimized due to static-export + no WebP/AVIF pipeline); LCP/CLS otherwise clean
- Alt-text gaps: 0 missing; 16 generic on MarketCard despite curated heroImageAlt available in markets.ts
- Broken links: 0 (2,425 internal links verified by audit:links)
- Top 3 P1/P2 fixes: (1) wire MarketCard alt to markets.ts heroImageAlt, (2) PDF link download attr + visible (PDF) text, (3) hero CTA py-3 at <360px to clear 44px floor
- Dissent: T7-003 (generic alt may be intentional consistency — defended ship; AT wins); T7-005 (cosmetic only — could be skipped); could not run Lighthouse from sandbox so CWV unmeasured
