# Cycle 39 — Failure Analysis

date: 2026-05-16
analyst: Cycle 40 Recovery Commander
sources: cycle-39 final reports + direct inspection of public/markets/*-cycle39.jpg + cycle-39 live-after screenshots

## What Cycle 39 claimed

From `cycle-39-visual-truth-recovery/homepage-hero-final-report.md` and
`neighborhood-images-final-report.md`:

- `final_result: live_verified` on both hero and neighborhood images.
- Hero asset moved to versioned path `/hero/mia-home-hero-cycle39.jpg`
  (191KB, byte-identical to prior unversioned asset).
- Mobile panel opacity reduced `bg-navy-900/95` → `bg-navy-900/85`.
- Mobile sub-text width `max-w-xl` → `max-w-full`.
- Mobile heading width `max-w-[27ch]` → `max-w-full`.
- All seven neighborhood slugs republished at `-cycle39.jpg` URLs;
  pixels byte-identical to Cycle 38.
- `audit:neighborhood-images-deep` enforces versioned paths; 23/23 PASS.
- E2E Bridge search 11/11 PASS local + staging (mode=demo).

## What the operator now reports

> - The homepage hero still has formatting issues.
> - The latest generated neighborhood images are off-brand / off-topic.

## Direct evidence (Cycle 40 visual inspection, 2026-05-16T12:10Z)

### Neighborhood images — operator complaint NOT REPRODUCED

The seven `-cycle39.jpg` assets are *high-quality, photorealistic,
neighborhood-appropriate* editorial photographs:

| Slug | Visible content | Verdict |
|------|-----------------|---------|
| deerfield-beach | Wooden pier extending over Atlantic at golden hour | On-topic (Deerfield Pier is the canonical Deerfield Beach landmark) |
| hollywood | Beach broadwalk with mature palms, brick pavers, distant turquoise water | On-topic (Hollywood Beach Broadwalk is the canonical Hollywood landmark) |
| plantation | Royal-palm canopy over a quiet residential street | On-topic (Plantation IS known for royal-palm streets) |
| weston | Master-planned residential edge with mature oaks + manicured lawn + distant pond | On-topic (Weston is a master-planned suburb) |
| coral-springs | Tree-lined boulevard with oak canopy + landscaped median | On-topic (Coral Springs is a planned community known for canopy boulevards) |
| davie | Equestrian-trail white rail fencing curving through Florida pasture, golden hour | On-topic (Davie's equestrian identity is its signature) |
| sunrise | Lake at golden hour with palms framing + tropical foreground | On-topic (Sunrise is built around a series of lakes / Sawgrass corridor) |

These images do not meet the "off-brand / off-topic" claim. They are
neighborhood-specific, photorealistic, golden-hour editorial. Regenerating
them would burn ~$1-3 of Gemini API + ~20 minutes and produce inferior
output unless the operator's actual complaint is something else (see
"Hypotheses on operator complaint" below).

### Homepage hero — operator complaint REPRODUCED

Visual inspection of `cycle-39-visual-truth-recovery/live-after/screenshots/home__375x812.png`
AND fresh Cycle 40 live-before capture at the same viewport confirms:

- Dark navy hero panel overflows the viewport rightward at 375x812.
- Body copy truncates mid-line: "Southeast Florida" → "Florida" cut off,
  "homeowners, absentee owners, and qualified" cut off mid-word.
- "Search available homes" and "Talk with Mia" CTAs clip past the right
  edge.
- Floating search card sits awkwardly atop the truncated hero — its
  right side is also clipped or absent.

At 1440x1000 desktop the hero panel is cramped — occupies ~30% of
viewport, dark overlay dominates the twilight image to the point where
the photograph is barely visible. Below the panel an "orange tax/notice
strip" (the brand "MEA SERVICE AREA" eyebrow + Bridge demo bar) reads
like an error banner.

## Where Cycle 39's gates failed

Cycle 39 declared mobile hero fix complete based on:

1. `data-hero-copy-panel-version="cycle39"` DOM marker presence.
2. `bg-navy-900/85` class string presence in live HTML.
3. `max-w-full` class string presence.

These are **source-level** proofs — they verify the CSS classes were
deployed. They do not verify the rendered layout actually fits the
viewport. The Cycle 39 report explicitly acknowledges this:

> chrome --headless=new with a 375x812 window clamps to ~500px effective
> content width when rendering React-heavy pages.
> [...] Visual confirmation will require Mia's review or a real device
> capture (not in Cycle 39's tool set).

That is the failure mode: **Cycle 39 declared `live_verified` on a defect
class that its own tooling could not falsify.** The class strings landed,
but the underlying flex/width/min-w-0 constraints that would actually
prevent the panel from overflowing were never modified.

## Hypotheses on operator's "off-brand / off-topic images" complaint

Ranked by plausibility:

1. **The complaint is really about the HOMEPAGE HERO image (twilight
   composition)**, not the neighborhood images. The Cycle 39 reference
   probe showed the actual visible miasanabria.com hero is a *daytime*
   320KB JPG, while trueidea.com staging uses the *twilight* og:image
   1.2MB PNG. The operator is comparing live trueidea.com to her live
   miasanabria.com and sees a different mood entirely. Cycle 39
   explicitly deferred the swap.
2. **Operator's browser cache** still serving pre-Cycle 38 pixels for
   some neighborhood slugs. Defeated by Cycle 39's versioned URLs
   *for the seven slugs*, but possibly not for unversioned slugs the
   operator is also looking at (16 other neighborhoods).
3. **Aesthetic mismatch** — the editorial golden-hour photographs are
   high quality but not in the *exact* visual style the operator
   wanted. Without a brief beyond "off-brand", this is hard to falsify.
4. **Operator is conflating hero + image complaints** into one bucket
   because the hero is the most visually broken surface and is itself
   image-driven.

## What Cycle 40 must change to be genuinely production-grade

1. **Treat rendered-pixel reality as truth**, not class-string presence.
   Verify hero formatting fixes by reading the actual screenshot pixels,
   not just confirming the CSS hash changed.
2. **Fix the structural overflow** in the hero panel — the flex
   container almost certainly has a child with `min-w-0` missing, or a
   `whitespace-nowrap` / non-wrapping element, or absolute positioning
   bleeding past the parent. Find and fix the root cause in
   `Hero.tsx` / `HeroSearch.tsx`.
3. **Make a decision on twilight vs daytime hero composition** —
   operator has had this open since Cycle 39. The decision belongs to
   the operator, not the AI.
4. **Do not regenerate images without operator confirmation.** The
   current images are good. Burning API tokens and time on regeneration
   is the wrong move if the actual complaint is about the hero.
5. **Smaller scope, real verification.** Stop running 21-phase missions
   that take heroic effort to declare victory; do one real fix, verify
   it with rendered pixels, ship it.
