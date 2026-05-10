# Cycle 11 — Footer Logo / Trust-Strip Deep Audit

**Captured:** 2026-05-10T02:43–02:50Z
**Surface:** `https://miasanabriarealtor.trueidea.com` (footer trust strip)
**Source files:**
- `src/components/SiteFooter.tsx:114-144` (FooterTrustMark layout)
- `public/logos/lpt-realty.png` (1097 × 1097, RGBA)
- `public/logos/realtor-r.png` (257 × 118, RGBA — combined REALTOR®+MLS mark)
- `public/logos/equal-housing.png` (150 × 161, RGBA)

**Principal review (2026-05-09):** *"The footer logos/trust-strip items — LPT Realty, REALTOR®, Equal Housing Opportunity — look inconsistent."*

---

## 1. Visual evidence

Captured `/tmp/mia-cycle11-footer-before/footer-only-404-{375,1280}.png` against live staging. The 375-wide capture clearly shows the three trust marks rendered with three DIFFERENT visual treatments:

| Mark | What renders today (BEFORE) |
|---|---|
| **LPT Realty** | Faintly-visible white-on-white "LPT" inside a `bg-white/95` square tile (`h-10 w-10`). The tile shows; the logo content does not. |
| **REALTOR®** | The combined REALTOR®+MLS+MULTIPLE LISTING SERVICE mark, rendered with its own border + text on transparent background → dark stroke on dark navy → low contrast. |
| **Equal Housing Opportunity** | Black house glyph + black "EQUAL HOUSING OPPORTUNITY" baked-in text → black on navy → barely visible. |

Three different treatments + three different visibility outcomes is the root cause of the "looks inconsistent" complaint.

## 2. Pixel-truth from `sharp` metadata

```
public/logos/lpt-realty.png        1097 × 1097  RGBA  pixelMean R/G/B 63.7 · alphaMean 62.6   →  white-on-transparent (mostly transparent)
public/logos/realtor-r.png         257 × 118    RGBA  pixelMean R/G/B 137.8 · alphaMean 176.1 →  combined R+MLS mark, dark-on-transparent + transparent gaps
public/logos/equal-housing.png     150 × 161    RGBA  pixelMean R/G/B 0.2 · alphaMean 117.2   →  black-on-transparent
```

| Asset | Visible on white bg? | Visible on navy bg? |
|---|:-:|:-:|
| LPT (white-on-transparent) | ❌ | ✅ |
| REALTOR®+MLS (dark-on-transparent) | ✅ | low contrast |
| EHO (black-on-transparent) | ✅ | ❌ |

The current footer puts LPT on a `bg-white/95` tile (best for dark-on-transparent assets but **wrong** for white-on-transparent — invisibility) and the other two directly on navy (best for white-on-transparent but **wrong** for black-on-transparent — invisibility). Each of the three asset types is paired with the **wrong** background.

## 3. Sizing inconsistency (separate axis)

| Mark | Source aspect | Rendered size | Tailwind class |
|---|:-:|:-:|---|
| LPT | 1:1 (square) | 40 × 40 px | `h-10 w-10 rounded-sm bg-white/95 p-1` |
| REALTOR®+MLS | 2.18:1 (wide rect) | ~60 × 28 px | `h-7 w-auto` |
| EHO | 0.93:1 (slight portrait) | ~37 × 36 px | `h-9 w-auto` |

Three different heights (40 / 28 / 36 px), three different aspect treatments (square / wide / portrait-square), no shared baseline. Even if all three were perfectly visible, the strip would still feel ad-hoc.

## 4. Label semantic mismatch (separate axis)

The footer renders external `<span>` labels under each mark:
- LPT logo → label "LPT Realty" ✅ matches asset
- REALTOR®+MLS combined logo → label "REALTOR®" ⚠ **misleading** — the asset visually says "REALTOR® · MULTIPLE LISTING SERVICE · MLS" but the label says only "REALTOR®"
- EHO logo with baked-in text → label "Equal Housing Opportunity" ⚠ **redundant** — the asset already contains this text

The label↔asset coupling needs intention. For Cycle 11 visual scope, I keep the labels as-is and unify visual treatment.

## 5. Compliance constraints (PRINCIPAL_DECISION_REGISTER read)

- **Card 4 (REALTOR® mark descriptive usage)** — `RECOMMENDATION_PENDING`. Touches *content* (member-name-adjacent rewriting). **Out of Cycle 11 scope** (requires content sprint).
- **Card 5 (Combined REALTOR®+MLS footer graphic)** — `RECOMMENDATION_PENDING`. Recommendation: replace with separate NAR mark; remove MLS attribution until Mia confirms MLS membership/jurisdiction. **Asset replacement requires principal authorization** — out of Cycle 11 scope.
- **Mission boundary** (this prompt): "Do NOT work on REALTOR®/MLS legal decisions beyond visual/spacing/asset consistency." — visual treatment is in scope; asset swap is not.
- **NAR Membership Marks Manual** explicitly permits monochrome variants of the REALTOR® mark in single-color treatments (white-on-dark and black-on-light are both allowed).
- **HUD EHO** mark monochrome variants are widely accepted.
- **LPT Realty** is brand-discretionary; white-on-navy IS the canonical brand color (per `public/source-assets/logo-on-navy-preview.png`).

**Conclusion:** a uniform monochrome white-on-transparent treatment via CSS filter is compliance-safe AND visually coherent.

## 6. Recommended fix (Cycle 11 — visual-only, compliance-safe)

### 6.1 Treatment

Apply uniform CSS filter `[filter:brightness(0)_invert(1)] opacity-80` to all three trust-mark images:

| Asset | Before filter | After filter |
|---|---|---|
| LPT (white-on-transparent) | white pixels visible only on dark | `brightness(0)` → black; `invert(1)` → white. **Result: white-on-transparent (unchanged)** ✅ |
| REALTOR®+MLS (dark-on-transparent) | dark pixels visible only on light | `brightness(0)` → black-on-transparent; `invert(1)` → **white-on-transparent** ✅ |
| EHO (black-on-transparent) | black pixels visible only on light | `brightness(0)` → still black; `invert(1)` → **white-on-transparent** ✅ |

All three render as discreet white silhouettes at 80% opacity on the deep-navy footer.

### 6.2 Sizing

Unify rendered height to `h-10` (40 px) on desktop, `h-9` (36 px) on mobile:

| Mark | New class |
|---|---|
| LPT | `h-9 w-9 lg:h-10 lg:w-10` (preserves square aspect; brand-correct) |
| REALTOR®+MLS | `h-9 lg:h-10 w-auto` (scales width by aspect; preserves combined-mark legibility) |
| EHO | `h-9 lg:h-10 w-auto` (scales by aspect; the slight-portrait shape stays) |

### 6.3 Background

Remove `bg-white/95 p-1` from LPT tile (no longer needed once LPT renders white-on-navy via filter). All three marks sit directly on the navy footer surface.

### 6.4 Spacing + alignment

- Existing `gap-6 lg:gap-10` is good; widen to `gap-8 lg:gap-12` for more luxury breathing room.
- `lg:flex-row lg:items-center lg:justify-center` preserves the current centered horizontal layout on desktop.
- `flex-col items-center text-center` mobile stacking preserves; gap stays compact on narrow viewports.

### 6.5 Labels

Keep current labels ("LPT Realty", "REALTOR®", "Equal Housing Opportunity") and styling (`font-display text-[10px] uppercase tracking-[0.3em] text-cream-200/80`). They become consistent typographic rhythm under the unified silhouettes.

### 6.6 Aspect-ratio compromise

The REALTOR®+MLS asset is 2.18:1 (wide), so at `h-10` it renders ~87 px wide vs. LPT 40 × 40 and EHO ~37 × 40. The visual centers won't perfectly align on mass alone. Two mitigations:
- Use `flex` with `justify-center` so the strip is centered as a row, not as individual columns (avoids visual "drift" at narrow widths).
- Accept the slight width disparity as honest — the assets are what they are; equal heights + monochrome treatment is the best achievable luxury feel without an asset swap.

If the aspect disparity reads poorly in the AFTER screenshots, the next step is a **principal-authorized asset crop** (extract just the R-block from the combined R+MLS asset). That requires Card 5 authorization. Defer.

## 7. Anti-criteria (what this fix MUST NOT do)

- ❌ MUST NOT change the SEMANTIC of any compliance asset (REALTOR®/MLS combined stays combined; EHO stays EHO; LPT stays LPT).
- ❌ MUST NOT swap to a NAR-clean R-only asset (Card 5 authorization required).
- ❌ MUST NOT alter the legal text labels under each mark.
- ❌ MUST NOT add new colors / fonts / tokens.
- ❌ MUST NOT regress the existing `audit:brand` `footerTrustElements` sentinel.
- ❌ MUST NOT introduce glassmorphism / gradient borders.

## 8. Validation method

| Check | Tool | Expected post-fix |
|---|---|---|
| All three marks visible on navy | full-page screenshot @ 320 + 375 + 768 + 1280 | white silhouettes at 80% opacity, all three discernible |
| Uniform height | screenshot pixel measurement | h-9 mobile / h-10 desktop ±1px |
| `audit:brand` `footerTrustElements` | `bun run audit:brand` | PASS (preserved sentinel) |
| `audit:images` LPT/REALTOR/EHO assets | `bun run audit:images` | PASS (assets unchanged) |
| GPT-5.5 visual judgment | predeploy + live acceptance | PASS or PASS_WITH_MINOR_CONCERNS |

## 9. Decision log

- **D-Cycle11-03 (2026-05-10T02:50Z):** Footer trust-strip fix scope = **visual-only monochrome white treatment via CSS filter**. Asset swap (Card 5) deferred — requires principal authorization. Asset semantics preserved. Filter approach validated on all three asset types via brightness/invert algebra.
- **D-Cycle11-04 (2026-05-10T02:50Z):** Reject `bg-white/95 p-1` tile retention. The white tile only existed to make LPT visible; once LPT renders correctly via filter, the tile becomes anti-luxury.

---

**Phase 4 result: ✅ Footer trust-strip root cause identified at three levels (visibility / sizing / semantic-coupling). Visual-only fix specified, compliance-safe. Card 5 boundary respected — asset swap not attempted. Implementation ready for Phase 7.**
