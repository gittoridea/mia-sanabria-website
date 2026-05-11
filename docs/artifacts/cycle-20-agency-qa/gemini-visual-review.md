# Cycle 20 — Gemini Visual Review (skipped this cycle)

**Verdict: skipped.**

## Why

The Gemini visual reviewer (Gemini 3.1 Flash-Lite or equivalent) was scoped in the mission packet to do "broad screenshot review across homepage, Fort Lauderdale, markets, buyers, sellers, contact, valuation, insights, IDX/search, and PDFs … identify visual hierarchy issues, wordiness, mobile density, CTA clarity, luxury feel, iframe/search issues, and trust gaps."

The prerequisite for that pass is **fresh screenshots at 320/375/414/768/1280 across ~15 routes** (≈75 captures). Cycle 20 explicitly Tier-3-deferred the screenshot capture (see `ui-ux-design-system-audit.md`) because the local environment lacks Lighthouse + reliable headless capture tooling beyond `audit:mobile-readability:capture`, and the artifact-generation budget was routed to GHL + issue matrix instead.

Running Gemini visual review against the existing `docs/artifacts/cycle-19A-M/mobile-readability/after/` baseline (last captured 2026-05-08-ish) would produce a review against stale visuals, which is worse than no review.

## Fallback

- Visual regression guards via existing audit suite: `audit-hero-pixel-contrast` 110/110, `audit-rendered-visual` clean, `audit-brand-consistency` clean, `audit-mobile-readability` baseline preserved.
- `idx-search-audit.md` documents IDX iframe quality at code-only depth (iframe title, lazy load, responsive sizing, noscript fallback all confirmed).
- `copy-consistency-audit.md` covers wordiness, repetition, CTA clarity at code-Read depth.

## Named follow-up

**Cycle 21-UI-UX-SCREENSHOTS prompt** (from `ui-ux-design-system-audit.md`):

> Mission: Capture fresh screenshots at 320/375/414/768/1280 across all named routes. Then invoke Gemini visual review via the `GeminiResearcher` agent over the new captures. Save Gemini output as `docs/artifacts/cycle-21-ui-ux/gemini-visual-review.md` with finding-per-route structure. Compare to Cycle 19A-M baseline; surface any visual regression as P0/P1 in a Cycle 21 issue matrix.

This deferral is honest: an actual visual review needs actual visual material, and Cycle 20's budget was committed to architectural artifacts (GHL plan + issue matrix) instead.
