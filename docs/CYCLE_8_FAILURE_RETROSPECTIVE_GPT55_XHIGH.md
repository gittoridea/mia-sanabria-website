AUDIT_START

# Cycle 8 — Failure Retrospective (GPT-5.5 xhigh)

## 1. Why the prior cycles claimed PASS while user saw FAIL

The system confused **token presence** with **rendered readability**. In `src/components/Hero.tsx`, the current image H1 still floats over live photography with `text-cream-50`, `font-bold`, `tracking-tight`, and `[text-shadow:0_2px_3px_rgba(0,0,0,0.8)]`. The overlays at `Hero.tsx:55-66` are generic full-section layers, not a measured dark field under the actual H1 bounding box.

Cycle 5 made the hero darker and heavier by moving overlay opacity from `15/35/15` to `35/65/35` and adding a large navy-tint shadow halo. `brand.heroH1ContrastTokens` passed because it found “shadow + overlay + bold.” It did not look at pixels.

Cycle 6 added a content-band scrim but preserved the Cycle 5 shadow stack. The 9-lane audit preserved `35 PASS / 2 WARN / 0 FAIL`, but Lane 7 had already named the real problem: bright-pixel contrast could land around `1.05:1` for eyebrow and `2.02:1` for cream H1. That evidence was treated as something token math could solve.

Cycle 7 correctly identified the old halo as bad, but then installed new sentinels that validated the chosen fix instead of validating the user-visible outcome. `brand.heroNoNavyGlowHalo` only proves the old `rgba(15,42,68,...)` halo is gone. `brand.heroOverlayLayers` only proves `mood`, `content-scrim`, and `cta-scrim` markers exist.

The closeout docs over-trusted the audit chain. Cycle 7 handoff says the old H1 unreadability was real and screenshot-confirmed, then claims the new state is legible while still admitting residual “soft-luxury” readability risk. The user now says it is worse. That means the Cycle 7 after-screenshot review was not an acceptance gate; it was an operator assertion.

The screenshot pipeline told the truth in `/tmp/mia-cycle7-live-defect-before/*`: the prior hero was unreadable. Earlier screenshot sets also existed, but the process treated captured screenshots as evidence of diligence, not as blocking evidence. Screenshot capture without a per-viewport verdict is not verification.

Yes, Cycle 7’s “removed navy halo + 3 overlays” can be worse for the user. The old halo was ugly, but it provided a wide edge buffer. Cycle 7 replaced it with a tight 3px shadow while leaving the H1 in the middle of a full-bleed photo. The mood gradient is only `via-navy-900/40` near the vertical band where the H1 often sits, the desktop right edge falls to `sm:to-navy-900/20`, and `[text-wrap:balance] max-w-3xl` can push letters into weaker scrim territory. The CTA scrim helps buttons, not the H1.

## 2. Misleading Checks

- `brand.heroH1ContrastTokens`: Claimed the hero had text-shadow, dark overlay, and bold weight. Failed to detect actual glyph/background contrast, H1 location, image brightness, text wrapping, font loading, or viewport-specific failure.
- `brand.heroNoNavyGlowHalo`: Claimed the exact Cycle 5/6 navy halo anti-pattern was gone. Failed to detect that a different non-readable pattern can pass.
- `brand.heroOverlayLayers`: Claimed the three Cycle 7 overlay layers exist. Failed to detect whether their combined opacity is sufficient under the rendered H1 or whether the H1 extends into weak right-side coverage.
- `audit:images.*`: Claimed image files, OG images, alt attributes, placeholder names, and selected hero/card image references resolve. Failed to detect image brightness, crop conflict with text, compression/readability impact, or text-over-image contrast.
- `audit:completeness`: Claimed route, sitemap, metadata, legal, and structural completeness. Failed to inspect visual quality. A fully unreadable hero can still pass completeness.

## 3. Required Evidence Going Forward

Screenshot acceptance must beat token grep. Use Playwright or headless Chrome to capture every image-mode hero route at `320x568`, `375x812`, `768x1024`, `1280x800`, and `1440x900`. Output a contact sheet plus JSON verdict. Threshold: every screenshot must show the full H1, no clipping, no overlap, and no H1 letters outside the measured readable field.

Pixel-level WCAG measurement is mandatory. Add `scripts/audit-hero-pixel-contrast.ts`. Tool: Playwright + `sharp`/PNG pixel sampling. Method: render visible H1, render again with H1 hidden, diff to locate glyph pixels, sample background under those pixels, compute WCAG contrast. Threshold: core glyph pixels `>= 4.5:1`; anti-aliased edge pixels `>= 3.0:1`; `0 FAIL`.

Per-viewport rendered review must be explicit. Tool: generated markdown matrix in `reports/hero-readability-screenshots.md`. Threshold: one verdict row per route × viewport, all `PASS`; no “captured but not reviewed” state.

Live post-deploy verification must rerun the same checks against `https://miasanabriarealtor.trueidea.com/?_=<cache-bust>`. Tool: `curl -skI` plus Playwright live capture. Threshold: HTTP 200, changed `last-modified` or ETag, and live pixel audit passes with the same thresholds as local.

## 4. Decision Gates That Were Missing

- **Defect Reproduction Gate**: Fires before implementation. Inspects live screenshots and requires a written “user-visible failure reproduced” note. Blocks any fix plan built from audit counts alone.
- **Rendered Pixel Contrast Gate**: Fires after local build and before deploy. Runs `audit:hero-contrast`. Blocks closeout on any H1 contrast failure.
- **Screenshot Verdict Gate**: Fires after screenshot capture. Requires reviewed route × viewport verdicts, not just files on disk. Blocks “visual PASS.”
- **Font Realization Gate**: Fires in brand audit. Cross-checks `font-bold` / `font-semibold` classes against loaded `next/font` weights. Would have caught Cinzel 700 fallback earlier.
- **Mutation Gate**: Fires after adding the new audit. Temporarily applies a deliberately weak scrim fixture; the audit must fail. Blocks trust in the new sentinel.
- **Live Visual Gate**: Fires post-deploy. Reruns pixel and screenshot checks on the live URL. Blocks “deployed and verified.”
- **User-Source Gate**: Fires before final closeout language. If the principal has just rejected readability, no doc may say “readability passed” until rendered evidence and user-visible review align.

## 5. Role Split For Cycle 8

GPT-5.5 xhigh should decide the visual doctrine: stop relying on broad gradient mood layers as the primary readability mechanism. Choose a deterministic H1 reading field tied to the text box or a stronger editorial treatment using only existing navy/cream/brass tokens.

Codex 5.3 Spark should implement the narrow patch: update `src/components/Hero.tsx`, add `scripts/audit-hero-pixel-contrast.ts`, wire `package.json`, and update `scripts/audit-brand-consistency.ts` so token checks no longer masquerade as readability checks.

Claude Code should orchestrate: capture before/after screenshots, run local and live gates, deploy only through the canonical deploy script, write the closeout, and preserve boundaries: no DNS, no GHL, no new colors, no new fonts, no broad 9-lane audit.

## 6. Skill Amendments

Copy-paste-ready changes for `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.3.0:

```md
version: 0.3.0
last_updated: 2026-05-09
last_updated_cycle: 8 (hero rendered-readability failure)
```

Add to VERIFY commands:

```bash
bun run audit:hero-contrast  # v0.3.0 HARD: rendered pixel contrast for image-mode hero H1
```

Add hard gate after Brand-consistency gate:

```md
12. **NEW v0.3.0 — Rendered hero readability gate (VERIFY)** — for any image-mode hero or visual-readability fix, `bun run audit:hero-contrast` must pass locally and on live staging. Token grep is insufficient. H1 core glyph pixels must be >= 4.5:1 contrast; anti-aliased edge pixels must be >= 3.0:1 across required viewports.
```

Change soft gate:

```md
REMOVE: Visual screenshot acceptance — chrome-headless 5×N grid; documented but not deploy-blocking
ADD HARD: Screenshot verdict gate — screenshots must be captured, reviewed, and summarized route × viewport before visual PASS can be claimed.
```

Add gotchas:

```md
13. **Token contrast is not rendered readability.** A class grep proving `text-shadow`, `font-bold`, or overlay layers exist does not prove the H1 is readable over the actual image pixels.
14. **Captured screenshots are not evidence until reviewed.** Every visual screenshot set needs a route × viewport verdict table.
15. **A negative anti-pattern sentinel is not a success sentinel.** “No navy halo” prevents one regression; it does not prove the replacement is readable.
16. **Principal visual feedback outranks audit counts.** If the user says a visual fix failed, the correct state is FAIL/PENDING, even when audit scripts are green.
```

## 7. Acceptance Criteria For Cycle 8

1. `scripts/audit-hero-pixel-contrast.ts` exists and writes `reports/audit-hero-pixel-contrast.{json,md}`.
2. `package.json` includes `audit:hero-contrast`, and `audit:all` runs it.
3. Local `bun run audit:hero-contrast` passes with `0 FAIL` across all image-mode hero routes.
4. H1 core glyph pixels meet `>= 4.5:1`; anti-aliased edge pixels meet `>= 3.0:1` at `320x568`, `375x812`, `768x1024`, `1280x800`, and `1440x900`.
5. A deliberate weak-scrim mutation fails `audit:hero-contrast`.
6. `scripts/audit-brand-consistency.ts` no longer treats `brand.heroH1ContrastTokens` as readability proof; wording must say “structural tokens only.”
7. `src/components/Hero.tsx` provides a deterministic readable field for the H1; the H1 cannot rely solely on global overlays plus text-shadow.
8. Cinzel loaded weights include every weight used by hero display classes; computed H1 `font-weight` is verified at runtime.
9. Before and after screenshot contact sheets exist for all image-mode hero routes and required viewports, with every row marked `PASS`.
10. Live staging passes the same hero pixel audit with cache-busted URLs after deploy.
11. Live `curl -skI` evidence shows HTTP 200 and a changed ETag or `last-modified` after deployment.
12. The closeout doc may not claim “hero readability passed” unless the rendered pixel audit, screenshot verdict table, and live verification all pass.

AUDIT_END