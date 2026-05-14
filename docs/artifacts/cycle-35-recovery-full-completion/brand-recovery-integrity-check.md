# Brand Recovery Integrity Check — Cycle 35B

date: 2026-05-14
purpose: Verify the semantic Bridge demo-warning exception added in commit `3530d5f` is intact, narrow, and continues to pass `audit:brand`.

## Recovery commit presence

```
git log 3530d5f --pretty=oneline --no-walk
3530d5f fix(MIA-SITE-CYCLE-35): allow semantic Bridge demo warning in brand audit
git rev-parse HEAD       3530d5fa25e736d705b6d8bd00d34f5a809040e4
git rev-parse origin/main 3530d5fa25e736d705b6d8bd00d34f5a809040e4
```

- Recovery commit was successfully pushed to `origin/main` before the SSH disconnect.
- HEAD == origin/main — fast-forward not needed.

## Semantic markers present in source

```
src/components/bridge/BridgeListingCard.tsx:49:            data-brand-exception="demo-warning"
src/components/bridge/BridgeSearch.tsx:52:          data-brand-exception="demo-warning"
src/components/bridge/BridgeSearch.tsx:124:      data-brand-exception="demo-warning"
```

Three semantic markers, all confined to the Bridge demo UI (Bridge demo banner, Bridge error warning, Bridge demo listing-card badge). Matches the recovery-commit narrative.

## Audit logic remains narrow

`scripts/audit-brand-consistency.ts` exception is keyed to:

- Constant `BRAND_EXCEPTION_MARKER = /data-brand-exception\s*=\s*["']demo-warning["']/`
- Window of `BRAND_EXCEPTION_WINDOW_LINES = 8` lines around the hit
- Single recognized category (`demo-warning`), with a comment noting that adding new categories requires editing the constant and the `brand-audit-demo-warning` artifact
- `allowedHits` are reported separately from `hits` in the JSON so the exception is auditable and not silently consumed.

## audit:brand current result

```
✓ brand.noForbiddenColors — no off-brand color tokens (3 allowed by data-brand-exception="demo-warning")
✓ brand.noForbiddenFonts
✓ brand.noForbiddenInBuilt
✓ brand.footerTrustElements
✓ brand.siteFooterStructure
✓ brand.siteFooterTrustStripAria
✓ brand.mobileNavPresent
✓ brand.heroH1ContrastTokens
✓ brand.heroNoNavyGlowHalo
✓ brand.heroNoCycle7WeakOverlay
✓ brand.heroOverlayLayers
✓ brand.publicEmailConsistency

Summary: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP
```

## Answers

- Was 3530d5f present? **Yes — locally and on origin/main.**
- Was it pushed? **Yes — before SSH disconnect.**
- Are the semantic markers present? **Yes — three, all bound to Bridge demo UI.**
- Does audit:brand pass? **Yes — 12 PASS, 0 FAIL.**
- Does the exception remain limited to Bridge demo warning UI? **Yes — the regex only matches `data-brand-exception="demo-warning"`, no other category is recognized.**
- Could unrelated amber tokens still fail? **Yes — any off-brand color token outside the 8-line window of a `demo-warning` marker is reported as a normal hit. The exception cannot mask brand drift elsewhere.**

Verdict: **recovery commit is intact and behaving exactly as designed.** Cycle 35B may proceed to Phase C.
