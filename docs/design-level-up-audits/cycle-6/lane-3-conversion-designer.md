=== AUDIT_START ===
# Lane 3 — CONVERSION DESIGNER — Cycle 6 Findings

## Finding 1 — Refine the home intent gateway copy to signal relationship framing
- **Severity:** medium
- **Page/Component:** `src/components/IntentRouter.tsx`
- **Observation:** The funnel cards use decision-first labels like `I may sell`, `I am buying`, `I am researching`, and end with generic `Begin →` copy. For luxury conversion flow, this reads as a branching menu more than a concierge invitation, and can feel transactional at first fold.
- **Recommended fix:** Switch labels to relationship-oriented outcomes (e.g., “Discuss a private selling strategy,” “Explore discreet buyer options,” “Compare markets before any public search”) while preserving the three paths.
- **Validation:** Run a first-click path test on `/` and check that >80% of users understand next step without scroll.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — intent blocks use unmistakable relationship-oriented language before listing exploration.

## Finding 2 — Markets index has no private-conversation CTA above the fold
- **Severity:** high
- **Page/Component:** `src/app/markets/page.tsx`
- **Observation:** The markets page `Hero` has no `ctaPrimary`/`ctaSecondary`, so the first viewport presents a gallery-style orientation without a clear next action toward a private conversation. This misses the lane goal that every core route should funnel toward direct initiation.
- **Recommended fix:** Add a hero-level primary CTA (“Start a private market brief”) plus a secondary utility CTA (e.g., “Compare market intelligence”) and keep the existing `CTAStrip` as tertiary reinforcement.
- **Validation:** Visual-flow audit: measure CTA visibility and click share in first viewport on 1366 and iPhone breakpoints.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby's — neighborhood entry pages anchor quickly into a guided consultation path.

## Finding 3 — Market-detail pages have competing primary CTAs that dilute choice architecture
- **Severity:** medium
- **Page/Component:** `src/app/markets/[slug]/page.tsx`
- **Observation:** In both buyer and seller asides, users see stacked full-width buttons that are visually equivalent in emphasis (`Request Private Consultation`, `Request Valuation`, `How Mia Represents Buyers/Sellers`, `Begin a Buyer Conversation`, etc.), creating no clear top-of-funnel action hierarchy.
- **Recommended fix:** Enforce one primary action per intent state (one “start private conversation” CTA), with secondary links moved below the fold or visually reduced.
- **Validation:** Track CTA click entropy: reduce non-primary CTA clicks in first 10 seconds by at least 30%.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem — asymmetric but disciplined action architecture, where one decisive CTA dominates each intent block.

## Finding 4 — CTA semantics are not standardized across shared components
- **Severity:** low
- **Page/Component:** `src/components/Hero.tsx`, `src/components/CTAStrip.tsx`, `src/app/sellers/page.tsx`, `src/app/buyers/page.tsx`
- **Observation:** Primary/secondary CTA tokens are not normalized centrally: class/weight/placement varies by usage (`Hero`, `CTAStrip`, inline page CTAs). On a luxury surface, this creates subtle inconsistency across Home/Buyers/Sellers/Valuation/Markets.
- **Recommended fix:** Add explicit CTA token classes (`cta-primary`, `cta-secondary`, `cta-tertiary`) and consume them uniformly in all major shared blocks.
- **Validation:** Add a style regression check that flags any new page using CTA class names not in the approved token map.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes — clear, restrained token hierarchy across pages keeps conversion intent legible.

## Finding 5 — Touch targets for primary actions are likely below WCAG floor on key routes
- **Severity:** high
- **Page/Component:** `src/components/Hero.tsx`, `src/components/CTAStrip.tsx`, `src/app/markets/[slug]/page.tsx`, `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`
- **Observation:** Several key actions use `py-3` / `py-3.5` with compact line treatment and no `min-h` constraints (`rounded-full`/`inline-flex` buttons). On mobile, this risks <44px hit area and violates the required touch-floor/comfort expectation.
- **Recommended fix:** Standardize primary/secondary buttons to minimum `min-h-[44px]` with generous `gap` + vertical rhythm; enforce this in shared CTA components.
- **Validation:** Run a Playwright/a11y sweep over all 25 routes checking button/link bounding boxes for both dimensions and spacing.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant — conversion buttons remain large-touch and breathable on dense mobile funnels.

## Finding 6 — Mailto-only contact form has no guaranteed form-completion feedback
- **Severity:** high
- **Page/Component:** `src/app/contact/page.tsx`
- **Observation:** The form submits to `mailto:` via `method="post"` and `encType="text/plain"`, with helper copy confirming it opens the user’s email app. If no mail client is configured, users get no submission state and drop off without confirmation.
- **Recommended fix:** Keep mailto as fallback, but add a guarded client-side completion state layer that explicitly confirms draft handoff, supports copy-to-clipboard body, and keeps an explicit immediate-call alternative.
- **Validation:** Test on desktop and mobile with no configured local client; require a visible success/fail UI state before route interaction ends.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — form handoffs include deterministic “submission acknowledged” behavior even in constrained lead capture stages.

## Finding 7 — Valuation intake currently has the same hidden form failure mode
- **Severity:** high
- **Page/Component:** `src/app/valuation/page.tsx`
- **Observation:** The valuation form mirrors the same `mailto:`/`text/plain` transport (`action=mailto:...`) and no in-page success path, so a private valuation request can fail silently exactly at the highest-intent CTA.
- **Recommended fix:** Add the same completion-state and fallback mechanism as /contact, and include a pre-filled `intent=valuation` context field for downstream routing.
- **Validation:** Capture and replay form submissions with no mail client to confirm explicit recovery path and no dead-end behavior.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — high-value inquiry paths always preserve intent and completion signaling even before backend integration.

## Finding 8 — Route intent context is lost between entry CTA and intake form
- **Severity:** medium
- **Page/Component:** `src/app/buyers/page.tsx`, `src/app/sellers/page.tsx`, `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`, `src/app/markets/[slug]/page.tsx`
- **Observation:** Multiple entry points lead users to `/contact/` or `/valuation/` with no shared intake prefill; the only explicit intent query observed is one buyer-side link (`/contact/?intent=buyer`), which is inconsistent across routes.
- **Recommended fix:** Normalize intent passthrough (`intent`, `market`, `originRoute`) on all relevant CTA links and prepopulate hidden intake fields in both forms.
- **Validation:** Automated route test that clicks each entry CTA and verifies rendered form includes retained intent metadata.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — conversion funnels preserve visitor intent state before first-response handoff.

## Finding 9 — Contact route remains text-additive instead of structurally concierge
- **Severity:** medium
- **Page/Component:** `src/app/contact/page.tsx`
- **Observation:** The page has three direct channels and a form, but `/contact/` currently reads as “communication options,” not a concierge protocol. It does not visibly stage the intake sequence (brief framing → qualification → private response path), so high-intent users are still self-directing rather than being guided.
- **Recommended fix:** Add a structured concierge block with 2–3 expected-intake steps (goal, timeline, discretion tier) and explicit next-step outcomes.
- **Validation:** Qualitative UX check: verify users can state their goal from first screen without reading supporting paragraphs.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant — strong service-led surfaces clearly show the next private-step before the form.

## Finding 10 — Mobile-touch spacing remains uneven beyond primary CTAs
- **Severity:** low
- **Page/Component:** `src/components/SiteHeader.tsx`, `src/components/Faq.tsx`
- **Observation:** Header links on desktop have no explicit tap-size floor, and FAQ `summary` rows rely on compact spacing around small glyphs. Across 25 routes this creates inconsistent motor ergonomics and accidental taps.
- **Recommended fix:** Add explicit mobile-safe spacing and minimum hit targets to repeated nav and FAQ touch controls without changing visual identity.
- **Validation:** Add a route-wide a11y/tap-target script for interactive elements beyond buttons (links, FAQ toggles, icon-only controls).
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes — high-end luxury flows keep support controls equally touch-comfortable, not just hero CTAs.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"conversion-designer","verdict":"concerns","completeness":"partial","top_concerns":["Markets flow lacks a consistent private-conversation first action in first viewport","Global conversion forms can silently fail because of mailto completion behavior","CTA hierarchy and tap-target sizing are not standardized across key shared components"],"findings_count":10,"high_severity_count":3,"safe_now_count":10,"benchmark_references":10}
=== AUDIT_END ===
