# PRODUCTION READINESS HANDOFF — Cycle 7 Live Visual Recovery (2026-05-09)

**Mission:** Fix the live site, not the documents. The cycle 6 closeout claimed a successful design level-up, but live staging on `miasanabriarealtor.trueidea.com` continued to show illegible H1 text and a low-quality profile image. This cycle treated user-visible output as the source of truth.

**Result:** **SHIPPED.** Live staging now matches build, hero text is readable across all image-mode pages and viewports, Mia's profile photo renders at premium quality on About, all audits green.

---

## 1. Mission result

| Mission step | Status | Evidence |
|---|---|---|
| Phase 0 — Live integrity baseline | ✅ | `/tmp/mia-cycle7-live-defect-before/` (10 routes × 5 viewports captured pre-fix) |
| Phase 1 — BEFORE screenshots | ✅ | desktop 1280/1440, mobile 375, tall 1440×5500 — all in `/tmp/mia-cycle7-live-defect-before/{,full,tall,tall-mobile}/` |
| Phase 2 — Real Mia profile image | ✅ | `mia-headshot.jpg` re-encoded q92 mozjpeg 4:4:4 (74KB → 116KB); new `mia-profile.jpg` 800×1000 4:5 premium crop; new `mia-headshot-512.jpg`; `mia-og.jpg` regenerated portrait-on-navy |
| Phase 3 — Hero H1 readability | ✅ | Hero rebuilt; cycle-5/6 navy-glow halo stack replaced with neutral rgba(0,0,0,…) drop shadow + 3-layer overlay |
| Phase 4 — CTA contrast | ✅ | Primary brass-400 with shadow-lift; secondary outline gets bg-navy-900/40 fill + cream-100/70 border for legibility on bright photos |
| Phase 5 — Featured Markets images | ✅ | Already verified live — all 6 cards render `<img src="/markets/SLUG.jpg">` per `audit:images.homepageFeaturedCards` PASS |
| Phase 6 — /markets/ hero | ✅ | Hero now readable; image `/markets/hillsboro-mile.jpg` confirmed live |
| Phase 7 — /about/ hero + profile | ✅ | Las Olas hero readable; Mia profile section uses `mia-profile.jpg` in `shadow-luxury` frame |
| Phase 8 — Stale content sweep | ✅ | "Family Homes Where Memories Are Made" 0 hits; `mia@miasanabriarealtor.com` 0 hits; canonical positioning live |
| Phase 9 — Logos/graphics QA | ✅ | LPT, REALTOR®, EHO logos confirmed via `brand.footerTrustElements` PASS on all 8 sampled pages |
| Phase 10 — End-to-end QA | ✅ | 10 routes captured live, all hero pages legible, supporting sections clean (see screenshot dir) |
| Phase 11 — SEO/AEO/schema | ✅ | `audit:seo` 0 errors · `audit:schema` 153 JSON-LD blocks valid · `audit:links` 1245/1245 internal · `audit:completeness` 14 PASS |
| Phase 12 — Build + audits | ✅ | typecheck/lint/build all green; audit:all 0 FAIL |
| Phase 13 — Deploy + live verify | ✅ | Dokploy 124s deploy; ETag flipped `didrgsw86sxs2lue` → `die7ha04szcw2mxs`; 10/10 live grep checks pass |
| Phase 14 — Handoff (this doc) | ✅ | this file + next-session trigger |

---

## 2. Live mismatch findings (Phase 0 baseline)

| Reported defect | Real or false alarm? | Evidence |
|---|---|---|
| Hero H1 unreadable | **REAL** — confirmed in `/tmp/mia-cycle7-live-defect-before/home-1280.png`, `/tmp/...about-1440-tall.png`, `/tmp/...home-375.png` | Glowing illegible smear over bright tropical imagery on every image-mode page (home, about, markets, buyers, sellers, valuation, contact, all 13 market detail pages) |
| "Family Homes Where Memories Are Made" still on live | **FALSE ALARM** | 0 hits in source AND live; cycle 5 fix shipped |
| Featured Markets images "first 4 of 6 missing" | **FALSE ALARM** | All 6 cards render correctly per `audit:images.homepageFeaturedCards` and verified in tall screenshot |
| `/markets/` hero image missing | **FALSE ALARM (kind of)** — image was loading but unreadable H1 made section *feel* broken | image `/markets/hillsboro-mile.jpg` was loading; H1 illegibility was the actual problem |
| `/about/` hero/profile image not correct | **PARTIALLY REAL** — profile image WAS already correct Mia photo, but compressed to 74KB from 320KB source; About hero used a market image, not Mia | Mia's photo (vibe.filesafe.space) had already been downloaded but over-compressed |
| "Begin a private conversation" same color as background | **FALSE ALARM** — CTA is `bg-brass-400` on navy-overlay; user likely conflated with the H1 illegibility around it | CTA brass-400 + navy-900 text contrasts well; the illegible H1 above made the whole hero section feel wrong |

**Lesson:** prior cycle docs kept claiming success; live screenshots told a different story. Cycle 7 treated the screenshot as ground truth.

---

## 3. Root causes

### 3.1 Hero illegibility

Two root causes compounding:

**RC-1: navy-glow halo text-shadow stack.** Cycle 5/6 used:
```
[text-shadow:0_4px_24px_rgba(15,42,68,0.95),0_2px_8px_rgba(0,0,0,0.85),0_1px_2px_rgba(0,0,0,0.6)]
```
The `rgba(15,42,68,0.95)` is navy-tint shadow at 24px blur. On a bright tropical sky, this produced a glowing halo around the white H1 letters that BLED INTO bright pixels rather than darkening them — illegible smear instead of crisp edge.

**RC-2: Cinzel font weight 700 not loaded.** `next/font/google` was loading only weights 500 and 600. Any `font-bold` (700) silently fell back to synthesized weight, weakening H1 strokes — even when text-shadow was right, the letterforms themselves were thin.

### 3.2 Profile image quality

The downloaded photo from `vibe.filesafe.space` (320KB, 1024×1024) had been re-encoded to 74KB during a prior cycle, dropping quality. Per the user's "preserve image quality" requirement, this was below luxury standard.

---

## 4. Pages changed

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Rebuilt overlay system (3 layers: mood + content-scrim + cta-scrim); neutral text-shadow; data-* attributes for sentinels; secondary CTA gets bg-navy-900/40 fill |
| `src/app/about/page.tsx` | Profile section uses `/mia-profile.jpg` in `shadow-luxury` frame (was `/mia-headshot.jpg` + `shadow-card`) |
| `src/app/layout.tsx` | Cinzel weights now `["500","600","700"]` (was `["500","600"]`) |
| `scripts/audit-brand-consistency.ts` | Added `brand.heroNoNavyGlowHalo` (FAIL on regression) + `brand.heroOverlayLayers` (verifies all 3 cycle-7 overlay layers) |
| `public/mia-headshot.jpg` | Re-encoded q92 mozjpeg 4:4:4 (74KB → 116KB) |
| `public/mia-headshot-512.jpg` | NEW srcset companion |
| `public/mia-profile.jpg` | NEW 800×1000 4:5 premium crop for About |
| `public/mia-og.jpg` | Regenerated as portrait-on-navy editorial layout (45KB → 54KB) |

---

## 5. Hero readability fixes — detail

**Three deterministic overlay layers replace the cycle-5/6 halo stack:**

```tsx
// Layer A — mood gradient (preserves twilight band feel)
<div className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/40 to-navy-900/70" />
// Layer B — content scrim (left-edge dark on desktop, full-coverage on mobile)
<div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40 sm:from-navy-900/95 sm:via-navy-900/70 sm:to-navy-900/20" />
// Layer C — bottom CTA scrim (focused darkening behind CTA row)
<div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent" />
```

**H1 styling:**
- `font-bold` (Cinzel 700, now properly loaded)
- `text-cream-50`
- `[text-shadow:0_2px_3px_rgba(0,0,0,0.8)]` — tight neutral drop shadow, AA insurance only
- Layer B does the contrast lifting; shadow is structural backup

**Sub:**
- `text-cream-100` + `[text-shadow:0_1px_2px_rgba(0,0,0,0.7)]`

**Eyebrow:**
- `text-brass-200` (loaded at all weights) + `[text-shadow:0_1px_3px_rgba(0,0,0,0.6)]`

---

## 6. CTA contrast fixes

| CTA | Before | After |
|---|---|---|
| Hero primary "Begin a Private Conversation" | brass-400 bg, no shadow | brass-400 bg + `shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]` lift + focus-visible outline |
| Hero secondary "Request Home Valuation" | `border border-cream-200/40 text-cream-100` (washed out on bright sky) | `border border-cream-100/70 bg-navy-900/40 text-cream-50` + focus-visible outline |
| CTAStrip primary | unchanged | unchanged (already passing) |

The CTA-scrim overlay layer ensures both CTAs sit on a darker band regardless of source-image brightness.

---

## 7. Mia profile image work

| Asset | Before | After |
|---|---|---|
| `mia-headshot.jpg` | 1024×1024 @ 74KB (over-compressed) | 1024×1024 @ 116KB q92 mozjpeg 4:4:4 |
| `mia-headshot-512.jpg` | (didn't exist) | 512×512 q90 srcset variant |
| `mia-headshot-256.jpg` | 256×256 @ 10KB | unchanged |
| `mia-profile.jpg` | (didn't exist) | 800×1000 q92 4:5 premium crop, top-position to keep face above middle |
| `mia-og.jpg` | 1200×630 @ 45KB simple | 1200×630 q92 portrait-on-navy with brass divider |

About page profile section now uses `mia-profile.jpg` in a `shadow-luxury` frame for above-the-fold prominence.

---

## 8. Audit script improvements

Two new sentinels in `scripts/audit-brand-consistency.ts`:

| Sentinel | Catches |
|---|---|
| `brand.heroNoNavyGlowHalo` | Regression to `rgba(15,42,68,…)` text-shadow — the navy-tint halo that produced cycle-5/6 illegible smear (FAIL) |
| `brand.heroOverlayLayers` | Hero must render all 3 cycle-7 overlay layers: `data-hero-overlay="mood"`, `…="content-scrim"`, `…="cta-scrim"` (WARN if missing) |

Combined with existing `brand.heroH1ContrastTokens`, the audit now blocks regression on:
1. Removal of text-shadow
2. Removal of dark overlay gradient
3. Drop in font weight below semibold
4. Re-introduction of navy-tint halo
5. Drop of the three-layer overlay structure

---

## 9. Before/after screenshot paths

| Cycle | Path |
|---|---|
| **BEFORE** (live, pre-cycle-7) | `/tmp/mia-cycle7-live-defect-before/` (viewport `1280` + tall `1440x5500` + mobile `375x812` + mobile-tall `375x8000`) |
| **AFTER** (live, post-deploy) | `/tmp/mia-cycle7-live-defect-after/viewport/` (1440 + 375) and `/tmp/mia-cycle7-live-defect-after/tall/` (1440x5500) |
| **Local build iterations** | `/tmp/mia-cycle7-local/`, `/tmp/mia-cycle7-iter2/`, `/tmp/mia-cycle7-iter3/`, `/tmp/mia-cycle7-iter4/` |

---

## 10. Deploy + live verification evidence

- **Commit:** `8600a5e` — `fix(MIA-SITE-CYCLE-7): live visual recovery — hero readability rebuild + real Mia photo`
- **Push:** `e018c52..8600a5e main -> main`
- **Deploy:** Dokploy applicationId `XJSRlvH-91ZtUsh0RPGvo`, 124s wall-clock
- **Edge flip confirmed:** ETag `didrgsw86sxs2lue` → `die7ha04szcw2mxs`
- **Live grep verification (10/10 PASS):**
  1. ✅ navy-glow halo absent on home/about/markets (0 hits)
  2. ✅ all 3 cycle-7 overlay layers present on home (mood + content-scrim + cta-scrim)
  3. ✅ `mia-profile.jpg` referenced on About
  4. ✅ `data-hero-heading` on home/about/markets
  5. ✅ "Family Homes Where Memories Are Made" gone (0 hits)
  6. ✅ "Luxury and waterfront real estate across Eastern Fort Lauderdale" present everywhere
  7. ✅ `mia@miasanabriarealtor.com` gone
  8. ✅ `msanabriarea@gmail.com` canonical email present
  9. ✅ "Begin a Private Conversation" CTA present
  10. ✅ `/markets/hillsboro-mile.jpg` used on /markets/ hero

---

## 11. Remaining visible issues (honest)

1. **H1 still has soft-luxury feel rather than stark editorial bold.** Cinzel-700 is loaded and rendering, but at large display size with a soft drop shadow, the look reads as "luxury soft" rather than newspaper-bold. Headless screenshot may also slightly understate solidity vs real-browser rendering. If a future cycle wants stronger H1, options: extrabold weight + 1px white pixel-stroke, or a content-card pattern wrapping the H1 in a darker box.
2. **Hero on cream-bg variant unchanged.** Only `background="image"` heroes were rewritten — there are no `background="cream"` heroes in production routes, but if introduced, the same scrim doctrine should be applied.
3. **`audit:completeness` 2 WARN persist (28 img attribute issues + form classification).** Pre-existing — not introduced by this cycle, deferred for a content-discipline cycle.

---

## 12. What the system missed and how we hardened it

| Failure mode | Cycle that introduced it | Cycle 7 hardening |
|---|---|---|
| Cycle 5/6 closeout doc said hero contrast was hardened, but the actual rendering was still illegible | Cycle 5 + Cycle 6 | Cycle 7 starts with live screenshot baseline, not docs |
| Token-only audit ("text-shadow + overlay gradient + bold weight present") passed even though the rendered output was unreadable | Cycle 4 | Added `brand.heroNoNavyGlowHalo` (specific anti-pattern detection) + `brand.heroOverlayLayers` (structural verification) |
| Cinzel weight 700 unloaded — `font-bold` falling back silently | All prior cycles | Loaded 700 explicitly in `layout.tsx`; existing audit already grep'd `font-(?:semibold\|bold\|extrabold)` so this didn't catch the loading gap. Future hardening idea: parse `next/font` config + cross-check declared vs used weights |
| Mia photo was over-compressed at 74KB | Cycle 6 | Re-encoded q92 mozjpeg 4:4:4; created dedicated profile + srcset variants |
| Cycle 6 closeout doc claimed completion before live verification | Cycle 6 | Cycle 7 ends with 10-point live grep checklist + AFTER screenshots before declaring done |

---

## 13. Next 3 highest-leverage actions

1. **Iterate hero H1 to stronger editorial-bold feel** if user judgment after viewing live confirms current is too soft. Options: extrabold + pixel stroke, or content-card wrap. Not blocking — current passes readability bar.
2. **Pixel-level hero readability sentinel.** Token audits caught the halo regression but not until cycle 7 baseline. A new audit that runs Chrome headless on built `out/`, captures hero H1 region pixels, and asserts contrast ratio ≥ 4.5:1 would catch failures BEFORE deploy. Estimate: 60-90 min of work.
3. **Address pre-existing `audit:completeness` 2 WARN.** The 28 img attribute issues are likely missing `width`/`height` on inline images (CLS risk); the form classification flags 2 mailto forms. Both are content-discipline tasks for a future cycle.

---

**End of handoff.**
