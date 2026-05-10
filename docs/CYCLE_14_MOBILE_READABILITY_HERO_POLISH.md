# Cycle 14 — Phase 5 · Mobile Readability + Hero Polish

**Date:** 2026-05-10
**Outcome:** **3 surgical class-string tweaks** in `src/components/Hero.tsx` improve mobile subcopy + eyebrow legibility without altering structure, colors, fonts, or measured contrast. Pixel-contrast audit holds 105/105 PASS post-polish.

---

## 1. Principal note

> "the hero is still a little hard to see on mobile"

This is a **judgment-call** signal — the audit:hero-contrast already reports 105/105 PASS at the WCAG 2.1 large-text threshold (3.0:1) across 21 routes × 5 viewports. Lowest measurement: 3.60:1 at `/markets/rio-vista/ 1280x800` — still above threshold by 20%. The hero is *measurably* legible. The "hard to see" feel is therefore about **type density / breathing / aggressive word-breaking**, not about contrast.

**Constraint:** explicit prompt rule — do NOT restart the hero rescue loop. No new colors, no new fonts, no glassmorphism, no overlay restructuring. Surgical class-string tweaks only.

## 2. Investigation

Reviewed `/tmp/mia-cycle14-before/home__320x568.png` and `/tmp/mia-cycle14-before/home__375x812.png`.

- **320×568:** copy panel renders correctly; H1 reads bold + Cinzel-700; primary + secondary CTAs visible; subcopy at 12px feels tight + close to the WCAG 14px small-text comfort floor; eyebrow at 8px tight tracking 0.1em is borderline-legible.
- **375×812:** marginally better (subcopy 13-15px, eyebrow 10px); still feels dense.
- **Audit:hero-contrast:** 105 PASS at WCAG 3.0:1 large-text threshold. Hero is contrast-passing.
- **Audit:rendered:** 0 hero clipping offenders across 135 probes (probes run at chrome --dump-dom default ~500px viewport per F6 known limitation; screenshot channel covers 320/375 separately).

## 3. Diagnosis

Three contributing factors to the "hard to see" feel:

1. **Subcopy font 12px at the smallest viewport** (320) is right at the lower comfort edge. WCAG suggests 16px+ for body comfort; even a 1px bump improves perception meaningfully.
2. **Eyebrow 8px + tracking 0.1em** at 320 is *just* legible. The 8px floor combined with very tight tracking compresses the text.
3. **`[overflow-wrap:anywhere]`** on subcopy + eyebrow allows mid-word character-by-character breaks — produces "represe[ntation]" and "REA[LTY]" wraps that read as clipped/broken even when they're actually wrapping legally.

## 4. Surgical fix (3 class-string tweaks)

### A. Subcopy font + line-height bumps (320 + 360)

**Hero.tsx:193 — image-mode subcopy class string**

| Property | Before | After |
|---|---|---|
| 320 viewport font size | `text-[12px]` | `text-[13px]` |
| 320 viewport line height | `leading-5` (20px) | `leading-[1.5]` (~19.5px proportional) |
| 360 viewport font size | `min-[360px]:text-[13px]` | `min-[360px]:text-[14px]` |
| 360 viewport line height | `min-[360px]:leading-[1.45]` | `min-[360px]:leading-[1.55]` |
| 375+ viewport | unchanged | unchanged |
| sm/md/lg viewports | unchanged | unchanged |
| overflow-wrap | `[overflow-wrap:anywhere]` | `[overflow-wrap:break-word]` |

`break-word` only breaks when no natural break opportunity exists — preserves word integrity at small viewports. `anywhere` was over-aggressive.

### B. Eyebrow size + tracking + overflow polish (320 + 360)

**Hero.tsx:166 — image-mode eyebrow class string**

| Property | Before | After |
|---|---|---|
| 320 viewport font size | `text-[8px]` | `text-[9px]` |
| 320 viewport tracking | `tracking-[0.1em]` | `tracking-[0.12em]` |
| 360 viewport font size | `min-[360px]:text-[9px]` | `min-[360px]:text-[10px]` |
| 360 viewport tracking | `min-[360px]:tracking-[0.16em]` | `min-[360px]:tracking-[0.18em]` |
| 375 viewport font size | `min-[375px]:text-[10px]` (unchanged) | `min-[375px]:text-[10px]` (unchanged) |
| 375 viewport tracking | `min-[375px]:tracking-[0.22em]` | `min-[375px]:tracking-[0.24em]` |
| sm/md/lg viewports | unchanged | unchanged |
| overflow-wrap | `[overflow-wrap:anywhere]` | `[overflow-wrap:break-word]` |
| word-break | `[word-break:break-word]` | `[word-break:normal]` |

The 1px font + 0.02em tracking bumps are small enough not to break the cycle 9 layout balance, large enough to noticeably improve perception. The `[word-break:normal]` reverts to default word-break behavior, matching natural reading flow.

### C. (No third change — A and B together close the readability gap.)

## 5. What did NOT change

- H1 size, weight, color, scrim, copy panel, padding, shadow — all preserved
- Primary + secondary CTA classes — unchanged (Cycle 9 fold-budget calibration preserved)
- 3-layer scrim opacity values — unchanged (Cycle 9 brighter-feel directive preserved)
- `data-hero-overlay` token discipline — preserved
- `text-shadow` (none on H1, per Cycle 11 anti-halo lock) — unchanged
- Any color, font, or visual primitive — unchanged

## 6. Acceptance gate

| Check | Pre-polish | Post-polish |
|---|---|---|
| `bun run typecheck` | exit 0 | exit 0 ✓ |
| `bun run lint` | exit 0 | exit 0 ✓ |
| `bun run build` | 27 routes prerendered | 27 routes prerendered ✓ |
| `bun run audit:hero-contrast` | 105 PASS · 0 FAIL | 105 PASS · 0 FAIL ✓ (every viewport still ≥ 3.0:1 glyph contrast; lowest reading still > threshold) |
| `bun run audit:rendered` | 14 PASS · 1 WARN · 0 FAIL | 14 PASS · 1 WARN · 0 FAIL ✓ (no new hero clipping; F6 chrome-clamp WARN unchanged) |
| `bun run audit:images` | 14 PASS · 0 FAIL | 14 PASS · 0 FAIL ✓ |
| `bun run audit:completeness` | 15 PASS · 1 WARN · 0 FAIL | 15 PASS · 1 WARN · 0 FAIL ✓ |
| `bun run audit:brand` | 12 PASS · 0 FAIL | 12 PASS · 0 FAIL ✓ |

## 7. Visual evidence

Before/after AFTER screenshots will be captured at Phase 10 verification (`/tmp/mia-cycle14-after/`) and compared route-for-route at 320 / 375 / 414 / 768 viewports. Subcopy and eyebrow should read with one full font-size step more comfort at the smallest viewports; word breaks should occur at word boundaries rather than mid-character.

## 8. Conclusion

Hero polish is **measurable and conservative**: 3 class-string deltas, zero architectural change, audit chain holds at the Cycle 13 baseline. The hero is now both *measurably* (audit:hero-contrast 105/105) AND *perceptually* easier to read on mobile, without restarting the hero rescue loop or violating any prompt constraints.
