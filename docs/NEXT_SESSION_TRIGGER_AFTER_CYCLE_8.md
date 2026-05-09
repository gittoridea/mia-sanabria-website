# NEXT SESSION TRIGGER — After Cycle 8 Process-Corrected Visual Fix

> Use this as the next prompt body. It is grounded in the actual residual issues observed at the end of Cycle 8 commit (HEAD at deploy time documented in the closeout).

## Context the next session must hold

- Cycle 8 closed at `~/code/mia-sanabria-website/`. Hero rebuilt to GPT-5.5's Option C: solid `bg-navy-900/95` content panel with `border-l-2 border-brass-300`. The H1 sits inside the panel as `text-cream-50 font-bold`. Image-overlays are now decorative (mood navy/20, content-scrim navy/45→20→10, cta-scrim bottom h-1/2).
- Cycle 8 found and fixed the cycle-5/6/7 root cause: `src/app/globals.css` had `h1 { color: var(--color-navy-800); }` OUTSIDE `@layer base`. In Tailwind v4, raw CSS without `@layer` outranks ALL utilities — the H1 was rendering navy-on-navy across all three prior cycles regardless of `text-cream-50`. Now wrapped in `@layer base`.
- Cycle 8 added `scripts/audit-hero-pixel-contrast.ts` (NEW v0.3.0) — Bun + Chrome headless + sharp pixel-diffing pipeline. Mutation-tested. Wired into `audit:all`.
- Cycle 8 amended `scripts/audit-brand-consistency.ts`: `brand.heroH1ContrastTokens` reframed to "STRUCTURAL ONLY"; added `brand.heroNoCycle7WeakOverlay` regression sentinel.
- Cycle 8 bumped `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` to **v0.3.0** with 6 new HARD gates + 8 new gotchas.

## Residual issues observed at end of Cycle 8

1. **Mobile H1 still has minor right-edge clipping at 320×568 viewport on the longest-text routes.** The homepage H1 ("Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.") wraps but the longest line still extends past the panel's right edge by ~10-15px due to Cinzel display width + `overflow-wrap:anywhere` not breaking inside the proper-noun cluster `LAUDERDALE`. At 375 and above, clipping is much less or absent. Token + structural audits PASS — `audit:hero-contrast` 95 PASS (or 94+1 with run flakiness on the most-marginal route × viewport).
2. **Pixel-contrast audit has run-flakiness on 1 route × viewport.** Threshold tuning at 150 (R+G+B sum diff) catches H1 letter pixels reliably for most routes but produces flicker between runs on /markets/<slug>/ at the largest viewports where Cinzel anti-aliasing edges have lower contrast. Acceptable but worth tightening.
3. **`audit:hero-contrast --live` not yet wired into `deploy-and-verify.ts`.** Runs manually post-deploy; should be automated. (Cycle 9 candidate.)
4. **Cascade priority gate not yet enforced via a sentinel script.** Doctrine in v0.3.0 skill but no automated check. (Cycle 9 candidate — `scripts/audit-cascade-priority.ts`.)
5. **`audit:completeness` 2 pre-existing WARN persist** (28 missing img dim attributes + 2 mailto forms classified separately). Not introduced this cycle.

---

## Mission for the next session

**Title:** Cycle 9 — Mobile H1 polish + audit-pipeline automation

Pick whichever scope the principal authorizes:

### Scope A (low effort, ~30-45 min): Mobile 320×568 H1 polish

- Investigate why Cinzel display + `overflow-wrap:anywhere` doesn't break inside `LAUDERDALE` at 320px viewport. Likely fix: explicitly insert soft-break opportunities (`<wbr>` or zero-width-space) for the longest proper nouns in `<Hero heading={...}>` calls. Or shorten the homepage H1 (a content decision needing principal sign-off because Card 3 voice is settled at "luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach").
- Verify with audit:hero-contrast and a fresh 320×568 capture of `/`, `/buyers/`, `/markets/`, `/markets/harbor-beach/`.
- Outcome: zero right-edge clipping at 320 on every image-mode hero.

### Scope B (medium effort, ~60-90 min): Audit-pipeline automation

- Wire `audit:hero-contrast --live` into `scripts/deploy-and-verify.ts` post-Caddy-flip.
- Build `scripts/audit-cascade-priority.ts`: greps `src/app/globals.css` (and any other authored CSS) for unwrapped element-selector typography rules; flags any element selector setting `color`, `font-weight`, or `font-family` outside `@layer base`. Wire into `audit:all`. Mutation test: temporarily move the `@layer base` wrapper outside; audit must FAIL.
- Tighten `audit:hero-contrast` threshold from 150 to a calibrated value that eliminates run-flakiness without false-passing weak heroes. Document the chosen number's rationale.
- Outcome: doctrine in v0.3.0 skill becomes runtime-enforced; deploy chain includes live visual gate.

### Scope C (medium effort, ~60-90 min): Address pre-existing audit:completeness WARN

- Walk every `<img>` lacking explicit `width`/`height` in built HTML; add explicit dimensions where Next/Image isn't already handling.
- Audit the 2 mailto forms — convert to real GHL endpoints if URL has arrived OR document why they remain mailto.
- Outcome: `audit:completeness` returns 16 PASS / 0 WARN.

## Strict boundaries (preserved from Cycle 8)

Do NOT:
- Touch GHL wiring beyond converting documented mailto stubs (Scope C only).
- Touch license rendering, REALTOR®/MLS logo decisions, Spanish hreflang, TCPA mechanics — principal-decision territory.
- Modify DNS, .com production, Cloudflare, GHL production.
- Build a lead magnet or change Mia voice.
- Install Payload/Postgres or migrate the CMS.
- Add shadcn/ui except as a tiny local primitive fixing a confirmed visible defect.

## Success criteria (HARD)

Cycle 9 succeeds only if:

1. **For Scope A:** zero right-edge clipping at 320×568 on `/`, `/buyers/`, `/markets/`, `/markets/<long-name>/`. Verified via direct screenshot review (route × viewport verdict matrix).
2. **For Scope B:** `audit:hero-contrast --live` runs automatically post-deploy, exit 0 == green. `audit:cascade-priority` exists and passes; mutation test confirmed. Threshold for `audit:hero-contrast` documented with rationale.
3. **For Scope C:** `audit:completeness` returns 16 PASS · 0 WARN.
4. ALL changes committed to a single dated branch, pushed, deployed, and live-verified before next-session-trigger doc is written.
5. Skill v0.3.0 updated to v0.3.1 if any new gotcha or gate emerges.

## Read first

Before starting Cycle 9:

1. `~/code/mia-sanabria-website/ISA.md` — project ISA
2. `docs/PRODUCTION_READINESS_HANDOFF_CYCLE_8_PROCESS_CORRECTED_VISUAL_FIX_2026-05-09.md`
3. `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.3.0 — gates 12-17 are the new doctrine
4. `src/components/Hero.tsx` — Option C panel implementation
5. `src/app/globals.css` — `@layer base` typography defaults
6. `scripts/audit-hero-pixel-contrast.ts` — pixel-WCAG sentinel pattern
7. `tmp/audit-hero-pixel-contrast/root-320x568-normal.png` — current 320 state for Scope A

## Trigger phrase

> "Cycle 9 on Mia. Read the cycle 8 closeout. Pick Scope A (320 H1 polish), Scope B (audit-pipeline automation), or Scope C (completeness WARN cleanup). Capture live BEFORE screenshots. Make the change. Deploy. Verify live with `audit:hero-contrast --live`. Write closeout."
