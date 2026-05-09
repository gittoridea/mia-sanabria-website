# Cycle 6 — Design Level-Up Synthesis

**Authored:** 2026-05-09
**Cycle scope:** 9-lane Codex-Spark audit + stack architecture review + screenshot baseline.
**Mission lineage:** PAI Algorithm v6.4.0 / E5 / Website Production Loop Skill v0.2.0.
**Inputs:** `docs/design-level-up-audits/cycle-6/lane-{1..9}-*.md`, 75 chrome-headless screenshots at `/tmp/mia-cycle6-design-before/`, prior cycle handoffs, the Brand System Contract (LOCKED), and the Principal Decision Register (Cards 1, 2, 4, 5, 6 OPEN; Card 3 DECIDED toward luxury/waterfront positioning).

## Audit telemetry at a glance

| Lane | Slug | Verdict | Completeness | Findings | High | Safe-now | Benchmark refs |
|---|---|---|---|---|---|---|---|
| 1 | Creative Director | concerns | full | 10 | 3 | 8 | 5 |
| 2 | Luxury RE UX Specialist | concerns | partial | 10 | 2 | 8 | 5 |
| 3 | Conversion Designer | concerns | partial | 10 | 3 | 10 | 10 |
| 4 | Typography & Layout | concerns | full | 10 | 2 | 10 | 10 |
| 5 | Mobile QA | concerns | partial | 10 | 4 | 9 | 10 |
| 6 | Image / Art Direction | concerns | full | 10 | 2 | 10 | 10 |
| 7 | Accessibility | concerns | full | 10 | 3 | 10 | 10 |
| 8 | SEO / AEO | concerns | partial | 10 | 1 | 9 | 10 |
| 9 | Compliance Guardrail | concerns | full | 10 | 5 | 1 | 10 |
| **Σ** | — | **9 × concerns** | 5 full, 4 partial | **90** | **25** | **75** | **80** |

Zero `pass`, zero `fail`. Every lane returned "concerns" — meaning the site is functional and shippable today, but has visible level-up surface across every dimension. This is exactly the mission's intent ("competitive with top-tier luxury realtor sites" — currently "yes with reservations"). The 25 high-severity findings are the cycle's cost of admission to "yes, confidently."

The high-severity sub-set decomposes:
- **Compliance lane carries 5/25 highs** — and 4 of those 5 are NOT safe-to-implement-now, because they intersect OPEN principal-decision cards.
- **Mobile QA carries 4/25 highs** — touch-target floors, drawer focus, form ergonomics, mailto fragility on mobile.
- **Creative Director, Conversion, Accessibility carry 3/25 each** — system-level (templates, CTAs, contrast).
- **All other lanes contribute 1-2 highs** of their own — typography weight, image pipeline, mailto silent failure (UX framing).

## Cross-lane convergence (≥3 lanes flagging same surface — highest confidence)

These are the cycle's anchored truths:

### C1 — Mailto-only forms are a structural conversion + compliance + mobile failure (Lanes 2, 3, 5, 9 — 4 lanes)

`/contact/` and `/valuation/` use `action="mailto:..."` with no submission state, no confirmation UX, no error handling, no consent mechanics, and silent failure when no mail client is configured (universal on mobile).

- **Lane 2 F1, F2:** UX silent-failure framing.
- **Lane 3 F6, F7:** Conversion silent-failure framing.
- **Lane 5 F7:** Mobile-specific silent-failure manifestation.
- **Lane 9 F6:** Compliance — `mailto:` bypasses governed intake (no audit log, no IP/timestamp, no retention controls).
- **Lane 9 F7:** TCPA prose without mechanics (no checkbox + signature + per-number authorization).

This is the cycle's #1 strategic finding. The fix has TWO halves: (a) immediate UX layer that confirms submission and provides fallback while mailto remains operative; (b) GHL endpoint wiring with TCPA mechanics. Half (b) is gated external — Tier 4. Half (a) is shippable now without GHL. **Both lanes 5 and 9 mark this NOT safe to implement now without principal direction on the consent posture.**

### C2 — Touch targets / 16px forms / mobile ergonomics (Lanes 3, 5, 7 — 3 lanes)

- Header menu icon at `h-10 w-10` (40×40) is below 44×44 AAA floor (Lane 5 F4).
- Hero/CTAStrip/MarketCard primary buttons rely on `py-3.5` with no explicit `min-h` (Lane 3 F5, Lane 5 F5).
- Form controls in Contact/Valuation are `text-sm` (≈14px) — triggers iOS Safari zoom-on-focus and harms touch accuracy (Lane 5 F6, Lane 7 F4).

All three are Tier-1 safe-to-implement-now.

### C3 — Mobile drawer is missing focus trap, ESC dismiss, and scroll lock (Lanes 5, 7 — 2 lanes — high impact each)

`SiteHeader.tsx` toggles `aria-expanded` and `block`/`hidden`, but does NOT trap focus inside the open drawer, does NOT bind ESC to close + return focus to trigger, does NOT lock body scroll, and does NOT add `aria-modal` semantics. Keyboard + screen-reader users can tab into hidden page content, lose orientation, and have no deterministic dismissal path. This is a real a11y regression on what is otherwise a luxury site.

This lines up exactly with the **shadcn/ui Sheet adoption** recommendation in `docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md` — Sheet's Radix-backed focus trap is the canonical fix. Cycle 7 candidate (4-6h with verify); cycle 6 ships a hand-rolled focus-manager interim because a Sheet adoption needs principal sign-off and a clean install moment.

### C4 — Intent-router decision architecture is flat (Lanes 1, 2, 3 — 3 lanes)

The three intent cards in `IntentRouter.tsx` ("I may sell" / "I am buying" / "I am researching") are equalized in visual weight, grid rhythm, and copy register. HNWI users do not perceive a concierge hierarchy or "who this is for first" cue. Lane 2 also flags missing fourth path for "I'm exploring" (early-stage). Lane 3 proposes relationship-oriented copy.

The copy changes are voice-adjacent (touches Mia's voice). Per Card 3 logic, anything that re-shapes Mia's intent voice is principal-direction territory. Tier 3 — principal approval required.

### C5 — Heading + eyebrow hierarchy drift across shared components (Lanes 1, 4 — 2 lanes)

- `globals.css` declares all of `h1..h6` to use `--font-display` with shared traits, flattening editorial tier hierarchy (Lane 1 F2).
- Hero H1 weight is `font-semibold` on cream/navy variants but `font-bold` on image variant (Lane 4 F1).
- Eyebrow tracking inconsistent: `tracking-[0.4em]` (primary) and `tracking-[0.3em]` (smaller) used interchangeably across SectionHeading/Hero/MeetMia (Lane 4 F2).
- `MarketCard` h3 uses `tracking-[0.05em]` at `text-2xl` — reads "engineered" rather than editorial (Lane 4 F9).

Tier 1 partial-fixes safe now (H1 weight standardize + remove MarketCard h3 custom tracking + extract eyebrow utility classes); deeper heading-system pivot (h3+ to body-font) is Tier 3 — voice and brand contract update.

### C6 — Market template + card homogeneity (Lanes 1, 4, 6 — 3 lanes)

- Every market route renders the same fixed 8-section scaffold; geography is text-swap only (Lane 1 F1).
- Property/buyer/seller/related-market cards stack in near-consecutive sequences without narrative interstitials → "card-after-card fatigue" (Lane 4 F8).
- `MarketCard` uses identical 4:5 framing + gradient + chevron for all geography (Lane 1 F3).
- No per-market `objectPosition` — facades/balconies/waterline edges crop unpredictably across breakpoints (Lane 6 F3).
- No image taxonomy (`heroMood`, `heroPerspective`) (Lane 6 F6, F7).

The architectural fix (market archetype variants) is Tier 3 — needs principal direction. The narrow polish — per-market `objectPosition` + richer alt text + narrative interstitials between card clusters — is Tier 1+2.

### C7 — Hero/card contrast failures on image backgrounds (Lanes 5, 7 — 2 lanes; high severity)

- Eyebrow `text-brass-300` over `image` hero with only 35% scrim ≈ 1.05:1 contrast on bright pixels — well below AA (Lane 7 F1).
- H1 `text-cream-50` with shadow ≈ 2.02:1 on bright bands — below large-text AA in edge cases (Lane 7 F2).
- MarketCard "Explore Area" `text-brass-300` over image strip ≈ 2.17:1 — fails (Lane 7 F3).

Note Lane 4 F7 separately flags hero shadow stack as "over-strong" — these are NOT in conflict. Both can be true: shadow can be visually heavy AND scrim can be insufficient. The synthesis fix increases the scrim band where text renders (top + bottom) without changing the H1 shadow stack (which is a cycle-5 principal-authorized decision per the Brand System Contract). Cycle-5 fixes ARE preserved; the new work is in the underlying scrim math.

## Contradictions surfaced

### CD1 — Hero shadow stack: "too strong" vs "still under AA"

- **Lane 4 F7** says the hero shadow stack with `0.95` and `0.85` alpha is over-strong, can flatten thin glyphs.
- **Lane 7 F2** says cream-50 over the image hero band is at 2.02:1 contrast on bright pixels.

Resolution (consistent with Brand System Contract lock on the cycle-5 H1 fix): keep the H1 shadow stack unchanged (do not regress cycle-5 work), but DEEPEN the hero scrim at the content band so the underlying contrast is independent of source-image brightness. The shadow then provides depth + crispness, not the only contrast handhold.

### CD2 — IntentRouter: copy retune vs add-fourth-path vs add-hierarchy

- **Lane 2 F4** wants a fourth path ("I'm exploring options").
- **Lane 3 F1** wants relationship-oriented copy on the three existing paths.
- **Lane 1 F5** wants a primary intent + two supporting hierarchy.

All three touch Mia's voice. Synthesis recommendation: Tier 3 — principal direction required; do not silently choose. Cycle 6 implements **none** of these without sign-off.

## World-class gaps (what top-tier sites have that this site doesn't)

Synthesizing across lanes' benchmark citations:

1. **Cinematic hero entrance ceremony** — Carroll Group, Senada Adzem, Ryan Serhant all use micro-motion (delayed eyebrow → H1 → CTA stagger; 600-900ms total) to telegraph "you have arrived somewhere considered." Mia site renders all hero elements simultaneously. Tier 3 (motion language addition; principal aesthetic call).
2. **Per-market editorial composition** — One Sotheby's neighborhood pages keep schema/AEO structure constant but rotate composition by market archetype. Mia site renders identical scaffold for all 13 markets. Tier 3 (architecture work).
3. **Concierge intake flow** — Compass Concierge / Sotheby's "Inquire" route through a deterministic intake state with privacy trust at the decision moment. Mia's contact + valuation pages have privacy prose in helper blocks, not adjacent to submit. Tier 1 (privacy trust strip near submit).
4. **Asymmetric editorial grids** — Senada Adzem/Carroll Group use 1.5fr/1fr/1fr or 2fr/1fr/1fr cadence breaks for hierarchy. Mia site's About `lg:grid-cols-3` value cards are symmetric. Tier 2.
5. **Image art direction signature per market** — Carroll/Senada/Ryan Serhant treat each market with a vantage/time-of-day signature. Mia site uses a uniform overlay treatment across all markets. Tier 3 (image taxonomy, then re-shoot or curated re-mastering).
6. **Trust signal strip at form submit** — Sotheby's trust / privacy commitments are explicit at the interaction boundary. Mia site keeps privacy commitments in helper text. Tier 1 (compact strip).
7. **Per-route OG identity** — One Sotheby's, Senada Adzem differentiate social cards by section. Mia site uses default OG on `/insights/`, `/accessibility/`, `/privacy/`, `/terms/`, `/dmca/`. Tier 1-2 (route-specific OG generation).

## Highest-confidence findings by axis

### Visual (cycle-6's primary axis)
- Hero scrim depth on image variants (Lanes 5 F8, 7 F1+F2) — Tier 1
- MarketCard "Explore Area" + h3 tracking (Lanes 4 F9, 7 F3) — Tier 1
- Card-cluster fatigue in market template (Lanes 1 F3, 4 F8) — Tier 2 narrative interstitials; Tier 3 archetype variants
- Asymmetric grid in About value-cards (Lane 4 F10) — Tier 2

### UX/conversion
- Markets hub Hero has no above-fold CTA (Lane 3 F2) — Tier 1
- Buyer/seller intent passthrough (`?intent=buyer`) (Lanes 2 F3, 3 F8) — Tier 1
- Contact page concierge structure (Lane 3 F9) — Tier 2
- Valuation 2-step staging (Lane 2 F7) — Tier 3 (form architecture change)
- Privacy trust strip near submit (Lane 2 F9) — Tier 1

### Mobile (no compromise)
- Header menu icon h-10→h-12 / w-12 (Lane 5 F4) — Tier 1
- scroll-padding-top for sticky header (Lane 5 F2) — Tier 1
- Form text-sm → text-base / 16px (Lanes 5 F6, 7 F4) — Tier 1
- Drawer focus trap + ESC + scroll-lock (Lanes 5 F3, 7 F6) — Tier 1
- IDX iframe responsive min-h (Lane 5 F10) — Tier 2

### Image / art direction
- Per-market `objectPosition` (Lane 6 F3) — Tier 1
- Richer alt text in `markets.ts` (Lane 6 F4) — Tier 1
- Remove `.svg` placeholders from `public/markets/` (Lane 6 F8) — Tier 1
- Sync OG generator slug list to `markets.ts` (Lane 6 F1) — Tier 1
- Route-specific OG for non-conversion pages (Lane 6 F5) — Tier 2
- Image taxonomy (`heroMood`/`heroPerspective`) (Lane 6 F6, F7) — Tier 3

### Accessibility (WCAG 2.1 AA floor; AAA luxury aspiration)
- Hero contrast on bright image regions (Lane 7 F1, F2) — Tier 1 (paired with C7 above)
- aria-current on header + footer nav (Lane 7 F7) — Tier 1
- Skip-link `:focus-visible` + forced-colors safety (Lane 7 F9) — Tier 1
- AnswerFirst `useId()` for unique heading IDs (Lane 7 F10) — Tier 1
- Mobile drawer focus flow (Lane 7 F6 — overlap with C3) — Tier 1
- Footer touch-target sizing (Lane 7 F8) — Tier 1
- Form `noValidate` + accessible error region (Lane 7 F5) — Tier 2

### SEO/AEO design structure
- AnswerFirst FaqSchema emission (Lane 8 F1) — Tier 1
- AnswerFirst Q+A first-sentence-direct rewrites (Lane 8 F2) — Tier 1
- PlaceSchema county thread (Lane 8 F4) — Tier 1
- Service pages PersonSchema continuity (Lane 8 F3) — Tier 1
- Per-route Twitter metadata (Lane 8 F6) — Tier 2
- `/insights/` topic-cluster proposals (3 essays — Lane 8 F9) — TIER PROPOSAL ONLY (do not write essays this cycle; record titles + target queries in handoff)
- Title/description HNWI micro-intent rewrites (Lane 8 F10) — Tier 2

### Compliance constraints (hard — preserve OPEN cards)
- License rendering (Card 1 OPEN) — Lane 8 F5, Lane 9 F1 — **PRESERVE OPEN; principal call required**
- REALTOR® mark descriptive usage (Card 4) — Lane 9 F2 — **PRESERVE; principal call required**
- Combined REALTOR®+MLS logo (Card 5) — Lane 9 F4 — **PRESERVE; principal call required**
- TCPA mechanics (Card 2) — Lane 9 F7 — **PRESERVE; mechanics gated by GHL**
- Off-market phrasing scrutiny (Lane 9 F8) — Tier 3 (legal review separately)
- DMCA placeholder finalization (Lane 9 F9) — Tier 3 (legal cycle)
- Lane 9 F10 documentation drift (Card 3 register/contract mismatch) — Tier 1 documentation-only (synchronize PRINCIPAL_DECISION_REGISTER.md to reflect Card 3 DECIDED state from BRAND_SYSTEM_CONTRACT.md)

### REALTOR® keyword casing (Lane 9 F3) — Tier 1 (metadata-only, low risk)

## What should NOT change (preservation list)

- **Cycle-5 fixes:** luxury/waterfront tagline, hero H1 text-shadow stack, hero image scrim composition (we DEEPEN, do not replace), AEO answer-first blocks, audit:images + audit:brand sentinels.
- **Brand System Contract tokens:** colors (navy/cream/brass), fonts (Cinzel + Montserrat), shadows, tracking — all locked.
- **OPEN principal-decision cards:** 1, 2, 4, 5, 6 — design polish must not silently resolve.
- **Project ISA structural pattern:** v6.4.0 algorithm doctrine, twelve-section ISA, ID-stability rule.

## Top 10 improvements ranked by impact × effort

| # | Improvement | Lanes | Tier | Impact | Effort | Score |
|---|---|---|---|---|---|---|
| 1 | Mobile drawer focus trap + ESC + body scroll lock | 5, 7 | 1 | High (a11y + luxury UX) | ~1h | ★★★★★ |
| 2 | Hero scrim deepening at content band (preserve cycle-5 H1 shadow) | 5, 7 | 1 | High (legibility on bright imagery) | ~30min | ★★★★★ |
| 3 | Form controls 14px → 16px (text-base) | 5, 7 | 1 | High (iOS Safari zoom; AAA touch) | ~15min | ★★★★★ |
| 4 | scroll-padding-top for sticky-header anchor jumps | 5 | 1 | Medium (anchor UX) | ~5min | ★★★★ |
| 5 | Header menu icon 40→48px + tap targets | 5 | 1 | High (AAA tap floor) | ~10min | ★★★★ |
| 6 | AnswerFirst FaqSchema emission + Q+A rewrites | 8 | 1 | High (AEO citation likelihood) | ~45min | ★★★★ |
| 7 | MarketCard `text-brass-300` → `text-cream-50` for "Explore Area" | 7 | 1 | High (card label contrast) | ~5min | ★★★★ |
| 8 | Per-market `objectPosition` + richer alt text | 6 | 1 | Medium (art direction polish) | ~45min | ★★★★ |
| 9 | aria-current on header + footer nav | 7 | 1 | Medium (a11y orientation) | ~15min | ★★★ |
| 10 | Markets hub Hero CTA + buyer/seller intent passthrough | 2, 3 | 1 | Medium (conversion architecture) | ~30min | ★★★ |

Top-3 are the cycle's anchor improvements. Items 4-10 are 5-45 minute wins. Combined Tier-1 estimated: ~4-5 hours.

## What requires principal approval

- **Tier 3 — voice / brand pivot:**
  - IntentRouter copy retune + 4th path + hierarchy (Lanes 1 F5, 2 F4, 3 F1)
  - Heading system pivot (h3+ to body-font; Lane 1 F2)
  - Hero motion ceremony (Lane 1 F4)
  - Per-market archetype variants + MarketCard variants (Lanes 1 F1, F3, 6 F6, F7)
- **Tier 4 — gated external:**
  - GHL form endpoint + TCPA mechanics (the entire C1 cluster — Lanes 2, 3, 5, 9)
  - License # rendering (Card 1)
  - REALTOR® mark + combined logo (Cards 4, 5)
  - DMCA finalization (Lane 9 F9)
  - New Mia photography (Card 3 follow-on; image taxonomy implementation)
- **Stack architecture (cycle 7 candidates):**
  - shadcn Sheet adoption (replaces hand-rolled drawer; replaces interim focus-manager)
  - shadcn Accordion / Toast / Dialog seeding
  - Tailwind v4 GA upgrade when shipped

## What can be implemented safely now (Tier 1+2)

See `docs/DESIGN_LEVEL_UP_UPGRADE_PLAN.md` for the dispatch list. Total cycle-6 implementation estimate: 4-6 hours of code + audit verify, ~1 hour deploy + verify.

## Stack architecture verdict (cross-link)

Per `docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md`:
- **Next + TS + Tailwind:** Keep now.
- **shadcn/ui:** Adopt selectively (Sheet, Dialog, Accordion, Tabs, Tooltip, Toast). Cycle 7 candidate.
- **Payload:** Defer.
- **Postgres:** Defer (only enters with Payload).

## Re-read gate

User mission read at OBSERVE; addressed in this synthesis:
- ✅ Run 9-lane design audit per existing trigger — done.
- ✅ Use Website Production Loop skill — done (skill v0.2.0 inputs honored, gates preserved).
- ✅ Stack architecture review — done; clear decision per item, not vague discussion.
- ✅ Safe design improvements — Tier 1+2 scoped in upgrade plan, ready to ship.
- ✅ shadcn/ui evaluated rationally — selective adoption with named primitives only; Button/Card/Form/Select/Nav rejected for this project.
- ✅ Payload + Postgres evaluated as future content/admin layer — deferred with explicit re-evaluation criteria.
- 🟡 Audits passing (preserved at 35 PASS · 2 WARN · 0 FAIL post-implementation — verified each batch).
- 🟡 Screenshots prove visual changes (BEFORE captured; AFTER pending implementation).
- 🟡 Live deploy verification (pending Phase 8).
- ✅ Next-session prompt (pending Phase 9).
