# NEXT SESSION TRIGGER — After Cycle 7 Live Visual Recovery

> Use this as the next prompt body. It is **not** generic — it is grounded in the actual residual issues observed after Cycle 7 deployed at HEAD `8600a5e` on 2026-05-09.

---

## Context the next session must hold

- Cycle 7 closed out at `~/code/mia-sanabria-website/`, HEAD `8600a5e` deployed and verified live at `https://miasanabriarealtor.trueidea.com/` (ETag `die7ha04szcw2mxs`, last-modified `2026-05-09 ~13:50 UTC`).
- Cycle 7 fixed: hero H1 readability (3-layer overlay + neutral text-shadow + Cinzel-700 properly loaded), Mia profile image quality (74KB → 116KB headshot, new 800×1000 mia-profile.jpg), CTA contrast on hero secondary, About profile-section frame.
- Cycle 7 added two hardening sentinels in `audit:brand`: `heroNoNavyGlowHalo` (FAIL on regression) + `heroOverlayLayers` (verifies cycle-7 structural overlay).

## Residual issues observed at end of Cycle 7

1. **Hero H1 reads soft-luxury rather than stark-editorial.** Cinzel-700 is loaded and rendering correctly. Drop shadow is neutral. But at large display sizes the H1 still has a "luxury soft" quality vs newspaper-stark. Token + structural audits PASS — this is a JUDGMENT call about visual feel.
2. **Token audits cleared illegibility but didn't *prove* readability.** `audit:brand.heroH1ContrastTokens` checks for tokens (text-shadow, overlay gradient, bold). It does NOT verify rendered pixel contrast. A regression to a different broken pattern could pass token-grep while failing pixels.
3. **`audit:completeness` carries 2 pre-existing WARN.** 28 img attribute issues (likely missing width/height — CLS risk) and 2 mailto forms classified separately from live-ghl forms. Not blocking but accumulates.

---

## Mission for the next session

**Title:** Cycle 8 — Hero Editorial Strength Pass + Pixel-Contrast Audit Hardening

Pick whichever scope the principal authorizes:

### Scope A (low effort, ~30-60 min): Pixel-contrast audit hardening

- Add a new audit script: `scripts/audit-hero-pixel-contrast.ts`.
- For each image-mode hero in built `out/`, render the page in headless Chrome at 1440×900 and 375×812, locate the H1 by `data-hero-heading="true"`, sample N pixels of H1 letters and N pixels of the immediately-surrounding background, compute WCAG AA contrast ratio (≥ 4.5:1 for normal text, ≥ 3:1 for large text — large applies here).
- Wire into `audit:all`.
- Effect: rendered-output regression on heroes will be caught before push.

### Scope B (medium effort, ~60-120 min): Hero editorial-strength iteration

- Goal: make hero H1 feel newspaper-stark, not luxury-soft, while preserving cinematic photo behind.
- Try **content-card pattern**: wrap eyebrow + H1 + sub in a `bg-navy-900/85` card with brass-300 left-edge accent (no `backdrop-blur` — forbidden by brand audit).
- OR try **font-extrabold + 1px text-stroke**: load Cinzel weight 800; add `-webkit-text-stroke:0.5px rgba(0,0,0,0.4)` for crisp letterform; preserve current overlay system.
- Verify in 5 viewports (320, 375, 768, 1280, 1440); deploy; verify live; capture before/after.

### Scope C (medium effort, ~60-90 min): Pre-existing WARN cleanup

- Walk every `<img>` lacking explicit `width`/`height` in built HTML; add explicit dimensions where Next/Image isn't already handling it.
- Audit the 2 mailto forms — convert to real GHL endpoints if Mia has provided them, or document why they remain mailto.
- Bring `audit:completeness` to 16 PASS / 0 WARN.

## Strict boundaries (preserved from Cycle 7)

Do NOT:
- Touch GHL wiring beyond converting documented mailto stubs.
- Touch license rendering, REALTOR® mark decisions, combined REALTOR®/MLS logo decisions, Spanish hreflang, TCPA mechanics — these stay queued for a principal-decision cycle.
- Modify DNS, .com production, Cloudflare, GHL production.
- Build a lead magnet.
- Install Payload/Postgres or migrate the CMS.
- Add shadcn/ui except as a tiny local primitive fixing a confirmed visible defect.

## Success criteria

Cycle 8 succeeds only if:

1. **For Scope A:** new pixel-contrast audit runs, asserts ≥ 4.5:1 across all hero pages, and is wired into `audit:all`. A deliberately-broken hero (e.g., lighter overlay) FAILS the audit.
2. **For Scope B:** rendered H1 reads stark-bold across 5 viewports; live verification matches local build; existing audits still pass.
3. **For Scope C:** `audit:completeness` returns 0 WARN; CLS metric (if measurable) improves on home + market pages.
4. ALL changes are committed to a single dated branch, pushed, deployed, and live-verified before the next-session-trigger doc is written.
5. Live screenshot baseline captured BEFORE editing; AFTER baseline captured post-deploy; `docs/PRODUCTION_READINESS_HANDOFF_*_CYCLE_8_*.md` references both.

## Read first

Before starting Cycle 8:

1. `~/code/mia-sanabria-website/ISA.md` — project ISA
2. `docs/PRODUCTION_READINESS_HANDOFF_LIVE_VISUAL_RECOVERY_CYCLE_7_2026-05-09.md` — this cycle's closeout
3. `src/components/Hero.tsx` — current Hero implementation
4. `src/app/layout.tsx` — Cinzel weight loading
5. `scripts/audit-brand-consistency.ts` — current sentinels (esp. cycle-7 additions)
6. `/tmp/mia-cycle7-live-defect-after/` — current live AFTER baseline

## Trigger phrase

> "Cycle 8 on Mia. Read the cycle 7 closeout. Pick Scope A (pixel-contrast audit hardening), Scope B (hero editorial-strength iteration), or Scope C (completeness WARN cleanup). Capture live BEFORE screenshots. Make the change. Deploy. Verify live. Write closeout."
