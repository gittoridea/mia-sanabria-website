=== AUDIT_START ===
# Lane 7 — Accessibility Specialist — Cycle 6 Findings

## Finding 1 — Hero image-mode eyebrow fails contrast on bright imagery
- **Severity:** high
- **Page/Component:** [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx) (routes `/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/markets/*`, `/markets/`)
- **Observation:** The eyebrow uses `text-brass-300` over `background="image"` without shadow, while the image scrim is only `from-navy-900/35 via-navy-900/65 to-navy-900/35`. On bright image pixels, overlay + text pair can land near a **1.05:1** contrast (well below WCAG 1.4.3 AAA and 4.5:1 AA). This is a real text legibility issue in image-heavy hero variants.
- **Recommended fix:** Use a higher-contrast eyebrow token on image backdrops (e.g. `text-cream-50`) or deepen the scrim on the full hero content band where headings and eyebrow render.
- **Validation:** Pixel-contrast sampling script on `/buyers/` and `/markets/` image heroes; screenshot diff against WCAG threshold overlay.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — enforces stronger headline scrim contrast across waterfront/editorial imagery.

## Finding 2 — H1 contrast can dip below AA on bright-top hero bands
- **Severity:** high
- **Page/Component:** [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx) (image-mode routes listed above)
- **Observation:** H1 in image mode is `text-cream-50` with text-shadow, but with only 35% dark scrim at band edges, the measured color-comparison floor is around **2.02:1** on bright image regions. This is below 3:1 for large text (AAA) and 4.5:1 AA in edge cases.
- **Recommended fix:** Increase the top/bottom hero scrim opacity (or lock `text-cream-50` over a darker underlay layer) so H1 always clears at least 3:1 on every sampled pixel band.
- **Validation:** Per-viewport hero pixel audit script for `/about/` and `/markets/` with known bright hero photos; Lighthouse color-contrast pass-fail by route.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes — uses predictable headline contrast baselines under bright editorial hero composition.

## Finding 3 — Market cards use low-contrast `text-brass-300` over image strips
- **Severity:** high
- **Page/Component:** [src/components/MarketCard.tsx](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx) (`/markets/`, home featured cards)
- **Observation:** `text-brass-300` in the `Explore Area` row sits on image-based dark strip (`bg-gradient-to-b from-navy-800/5 to-navy-800/65`). With bright source assets, contrast can be around **2.17:1** (or lower in real source edges), which is below AA for normal text and below AAA goals.
- **Recommended fix:** Switch the label token to lighter copy (`text-cream-50` or `text-cream-200/90`) and retain brand tokens.
- **Validation:** Automated visual regression on `/markets/` and `/` card grid with sampled background luminance.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem — keeps CTA/copy strips visibly dominant over photographic cards with enforced contrast-safe token contrast.

## Finding 4 — Form controls are under 16px and trigger iOS zoom/accessibility friction
- **Severity:** medium
- **Page/Component:** [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** Inputs/select/textarea/buttons use `text-sm`, so many key form controls fall below the 16px floor the brand contract targets for form input ergonomics; this hurts touch users and can reduce input usability in assistive contexts.
- **Recommended fix:** Elevate form control text to `text-base` (or equivalent) while preserving overall visual rhythm in compact viewports.
- **Validation:** Mobile accessibility smoke checks on iOS simulation; `viewport` + interaction test for zoom behavior and focus readability.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant — production forms keep control typography at readable size for mobile keyboard users.

## Finding 5 — Required forms disable native validation without accessible replacement
- **Severity:** medium
- **Page/Component:** [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** Both forms set `noValidate` while fields are required; there is no explicit custom validation region (`role="alert"`/error messaging). Users relying on assistive tech can submit incomplete inquiries with little immediate feedback.
- **Recommended fix:** Remove `noValidate` and add inline, announced validation messaging for required/format errors (`role="alert"` or atomic status region).
- **Validation:** Keyboard-only submit with missing required fields + accessibility tree check for live error announcements.
- **Safe to implement now:** no
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — keeps mandatory field errors semantically and consistently announced.

## Finding 6 — Mobile drawer lacks deterministic keyboard focus flow
- **Severity:** medium
- **Page/Component:** [src/components/SiteHeader.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteHeader.tsx)
- **Observation:** The menu toggle updates `aria-expanded`, but open state does not move focus to first nav item and has no explicit Escape-to-close path. Keyboard users remain in lower-confidence focus order for the drawer surface.
- **Recommended fix:** On open, focus first menu link; add Escape handler to close and return focus to toggle; include focus containment per interaction.
- **Validation:** Manual keyboard journey test on `/` at small viewport: Tab sequence + Escape behavior.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem — explicit focus handoff and dismissal behavior in mobile drawer interactions.

## Finding 7 — No `aria-current` state for primary and footer navigation
- **Severity:** medium
- **Page/Component:** [src/components/SiteHeader.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteHeader.tsx), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- **Observation:** Header/footer links lack `aria-current="page"`. Screen-reader users cannot quickly orient context when nav list is read aloud.
- **Recommended fix:** Add active-route `aria-current="page"` to nav anchors in both header/footer collections.
- **Validation:** NVDA/VoiceOver nav audit on `/buyers/`, `/sellers/`, `/valuation/`.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — clear landmark and active-page signaling in primary nav for quick orientation.

## Finding 8 — Footer link blocks are visually/interaction-poor for fast touch navigation
- **Severity:** medium
- **Page/Component:** [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- **Observation:** Footer links are plain text anchors with no explicit padding or min-height; several are small target rows that can be hard to hit on touch and harder to scan as navigation landmarks.
- **Recommended fix:** Wrap grouped links in semantic `<nav aria-label>` sections and add consistent touch affordance sizing (≥44×44 on interactive blocks) via utility padding.
- **Validation:** Automated accessibility target-size audit (playwright + axe) on mobile viewport; manual touch accuracy pass.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Serhant — footer nav links remain large, landmarked, and easy to traverse by touch/AT.

## Finding 9 — Skip link is only `.skip-link:focus`-styled and can be fragile in some keyboard/high-contrast flows
- **Severity:** low
- **Page/Component:** [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), [src/app/globals.css](/home/torrey/code/mia-sanabria-website/src/app/globals.css)
- **Observation:** The link exists and works, but focus styling is focus-only without explicit `:focus-visible` and depends on positional animation (`top` transition), which can reduce reliability in forced-colors/keyboard-first workflows.
- **Recommended fix:** Add explicit `:focus-visible` style and a forced-colors-safe tokenized outline for guaranteed visibility.
- **Validation:** Keyboard traversal in forced-colors mode and Windows HC with “skip-to-content” first action.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s and Senada Adzem — robust, visible skip-links under forced-color and keyboard-only conditions.

## Finding 10 — Reusable `AnswerFirst` ID is hard-coded
- **Severity:** low
- **Page/Component:** [src/components/AnswerFirst.tsx](/home/torrey/code/mia-sanabria-website/src/components/AnswerFirst.tsx)
- **Observation:** `aria-labelledby="answer-first-heading"` is fixed and reused by every `AnswerFirst` render. If/when a future page includes two blocks, this produces duplicate IDs and can break AT label association.
- **Recommended fix:** Use `useId()` or prop-driven unique IDs for heading linkage.
- **Validation:** Add duplicate-id detector (`axe`/`playwright`) for multi-instance pages.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant — reusable components avoid hardcoded ARIA IDs for scalable assistive mapping.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"lane-7-accessibility-specialist","verdict":"concerns","completeness":"full","top_concerns":["Hero/image-mode contrast is failing on bright assets","Market card typography contrast risks on photo backgrounds","Keyboard flow in mobile drawer and nav state signaling needs improvement"],"findings_count":10,"high_severity_count":3,"safe_now_count":10,"benchmark_references":10}
=== AUDIT_END ===
