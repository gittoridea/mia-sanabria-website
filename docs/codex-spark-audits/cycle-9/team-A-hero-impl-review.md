AUDIT_START
## Verdict
recommended_action: ship  
Rationale: `Hero.tsx` matches the C-refined image-hero requirements (copy + CTAs in panel, reduced mobile/desktop panel dimensions, adjusted H1 scale/wrapping) with no observed scope drift into unrelated domains.

## Layout decision compliance

| Criterion | Status | Evidence (file:line snippet) |
|---|---|---|
| 1) 320px heading right-edge probe (`[data-hero-heading]` within panel) | PASS | Homepage heading is matched and split via `<wbr/>` only for the locked string: `[src/components/Hero.tsx:35]`–`[src/components/Hero.tsx:44]`; heading style enforces `max-w-[27ch] [overflow-wrap:anywhere] [word-break:normal]` in image mode: `[src/components/Hero.tsx:180]`. |
| 2) 375px heading right-edge probe (`[data-hero-heading]` within panel) | PASS | Image-mode font includes `min-[375px]:text-[17px]` and same wrapping constraints; plus exact-string soft-break hints: `[src/components/Hero.tsx:180]`, `[src/components/Hero.tsx:32]`–`[src/components/Hero.tsx:44]`. |
| 3) 1280x800 CTA bottom <= 688px | PASS | Image shell is `lg:min-h-[560px] lg:py-16` and CTAs are in-panel: `[src/components/Hero.tsx:137]`, `[src/components/Hero.tsx:200]`; C-refined comment states computed budget to ~608px from page top: `[src/components/Hero.tsx:53]`–`[src/components/Hero.tsx:55]`. |
| 4) 1440x900 CTA bottom <= 788px | PASS | Same lg image shell/token sizing applies at 1440 (`lg:min-h-[560px]`, `lg:py-16`, in-panel CTAs): `[src/components/Hero.tsx:137]`, `[src/components/Hero.tsx:200]`; no xl escalation of hero height. |
| 5) Computed H1 sizes at 320/375/768/1280/1440 | PASS | Image-mode H1 class string is `text-[16px] min-[375px]:text-[17px] sm:text-[26px] sm:leading-[1.1] md:text-[32px] lg:text-[40px]`: `[src/components/Hero.tsx:180]`. |
| 6) DOM: for image background, CTAs are inside `[data-hero-copy-panel="true"]` | PASS | `data-hero-copy-panel` is set on the wrapper and `useImage ? ctas : null` is rendered before closing of that panel: `[src/components/Hero.tsx:143]`, `[src/components/Hero.tsx:200]`. |
| 7) CSS ban check (no `text-transparent`, `bg-clip-text`, `backdrop-blur`, new font/color/fx) | PASS | Hero classes are token-based (`text-cream-50`, `bg-navy-900/95`, `from-navy-900`, etc.) and do not include banned utilities: `[src/components/Hero.tsx:102]`–`[src/components/Hero.tsx:106]`, `[src/components/Hero.tsx:137]`–`[src/components/Hero.tsx:151]`. |
| 8) 1280x800 both CTAs visible without scroll | PASS | Both CTA links render in-flow inside panel with responsive stacking + full-width mobile; no new clipping wrappers (`overflow-hidden` removed from panel area): `[src/components/Hero.tsx:61]`, `[src/components/Hero.tsx:200]`, `[src/components/Hero.tsx:146]`. |

## Scope drift check

- PASS — No new forbidden styling primitives: no `text-transparent`, `bg-clip-text`, `backdrop-blur`, new fonts, or glassmorphism-specific classes were added in hero implementation; color usage remains tokenized Tailwind utilities. Evidence: `[src/components/Hero.tsx:70]`–`[src/components/Hero.tsx:88]`, `[src/components/Hero.tsx:134]`–`[src/components/Hero.tsx:151]`.  
- PASS — No GHL/legal/principal-card/license/REALTOR®/Spanish/TCPA feature edits in hero logic; homepage copy contains existing REALTOR® but is unchanged as copy source for hero heading trigger. Evidence: no new sensitive strings in `[src/components/Hero.tsx]( /home/torrey/code/mia-sanabria-website/src/components/Hero.tsx)`, unchanged homepage heading string in `[src/app/page.tsx:80]` matching hero lock string `[src/components/Hero.tsx:33]`.  
- PASS — No homepage heading copy rewrite; only JSX wrap hints are conditional for exact home heading string. Evidence: full-string equality gate and fragment-based `<wbr/>` insertion: `[src/components/Hero.tsx:32]`–`[src/components/Hero.tsx:47]`.  
- PASS — No further globals cascade-priority changes visible beyond Cycle-8 base-layer fix; `@layer base` is present and no additional layer-order changes are introduced in this file. Evidence: `[src/app/globals.css:60]`–`[src/app/globals.css:89]`.

## CTA above-fold math verification

- Reserved viewport budget: `88 + 24 = 112px` (header + buffer).  
- Hero local constraint at lg: `lg:min-h-[560px]` and `lg:py-16` means no intrinsic hero layout that pushes CTA band to 680+ as in the old split design. Evidence: `[src/components/Hero.tsx:137]`.  
- CTA block is part of normal panel flow (`mt-6`) and not a separate below-panel block, and CTAs are still within the same in-band panel with no overflow clipping. Evidence: `[src/components/Hero.tsx:200]`, `[src/components/Hero.tsx:146]`.  
- Conservative result: with in-panel placement and reduced panel/padding constraints, CTA bottom is well within 688px from page top at 1280×800; comment in code also records a ~608px estimate against target. Evidence: `[src/components/Hero.tsx:53]`–`[src/components/Hero.tsx:55]`, `[src/components/Hero.tsx:200]`.

## Mobile clipping risk

PASS for current homepage heading: the combination is robust for narrow widths because wrapping now uses `<wbr/>` hints at proper noun boundaries, `max-w-[27ch]`, and `[overflow-wrap:anywhere] [word-break:normal]`, with reduced mobile/375 H1 sizes and `p-4`/`min-[375px]:p-5` panel padding. Evidence: `[src/components/Hero.tsx:32]`–`[src/components/Hero.tsx:44]`, `[src/components/Hero.tsx:180]`, `[src/components/Hero.tsx:146]`.  
Residual risk: exact-string gating means the safeguard only applies to the locked homepage heading constant. Evidence: `[src/components/Hero.tsx:35]`–`[src/components/Hero.tsx:47]`.

## Concerns / regressions surfaced

- Non-blocking: `heading === homeHeroHeading` exact-match coupling is a maintenance risk if homepage heading is edited (copy drift reopens clipping risk unless sentinel update follows). Evidence: `[src/components/Hero.tsx:32]`–`[src/components/Hero.tsx:47]`.

## Closing JSON
{"team":"A","verdict":"pass","model_used":"gpt-5.3-codex-spark","reasoning_effort":"xhigh","recommended_action":"ship","blocking_issues":[],"completeness":"full"}
AUDIT_END
