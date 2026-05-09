=== AUDIT_START ===
# Lane 6 — Shared Lane Prelude — Cycle 6 Findings

## Finding 1 — Stale OG market rendering pipeline only covers legacy subset
- **Severity:** high
- **Page/Component:** `scripts/render-images.ts` + `public/og-markets/*.jpg`
- **Observation:** The generator list is hard-coded to 7 markets, while runtime routing/assets now expose 13 active markets (`src/lib/markets.ts` + `/tmp/mia-cycle5-fix-after/*`). This creates silent skew: re-running the OG pipeline can miss six routes or produce stale OG outputs despite `public/og-markets` already containing 13 images.
- **Recommended fix:** Replace hard-coded market slugs with a data-driven source from `src/lib/markets.ts`, and gate generation against the canonical market set.
- **Validation:** Add a CI check in image audit scope that compares generated og list against `src/lib/markets.ts` slugs and fails on count/slugs mismatch.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby's-style editorial systems publish neighborhood imagery via repeatable generators so the gallery set stays complete and synchronized.

## Finding 2 — OG generator still sources SVG placeholders instead of deliverable JPG heroes
- **Severity:** medium
- **Page/Component:** `scripts/render-images.ts` + `public/markets/*.svg` + `public/markets/*.jpg`
- **Observation:** The generator path is wired to vector placeholders while production visuals are JPEG 1200×1500 hero assets; this is a recipe for quality divergence if the script is run and can inject non-photographic placeholders into brand channels.
- **Recommended fix:** Remove SVG source usage from image-render pipeline and enforce JPG source-of-truth for market hero/OG rendering.
- **Validation:** Scripted file-type assertion: only `.jpg` from `public/markets` accepted as render inputs; block CI on placeholder-only renders.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes’ visual system is strict about source asset discipline and avoids fallback placeholders in production renders.

## Finding 3 — `MarketCard` has no per-market crop control, causing subject drift risk
- **Severity:** high
- **Page/Component:** `src/components/MarketCard.tsx`
- **Observation:** Card media uses `object-cover` with default center positioning and no `objectPosition` override. For 1200×1500 hero portraits in a 4:5 container, facades/balconies/waterline edges can be cut unpredictably across breakpoints.
- **Recommended fix:** Add `imageObjectPosition`/`imageFocus` to market metadata and apply per-card positioning in `MarketCard` (`style={{ objectPosition: market.imageObjectPosition }}`).
- **Validation:** Automated visual diff across sm/md/lg breakpoints for all market cards (screenshot set in `/tmp/mia-cycle5-fix-after/` plus regression baseline).
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem-style layouts preserve architecture subject framing with explicit focal control rather than default center crops.

## Finding 4 — Market/hero alt text is generic and fails luxury-descriptive specificity
- **Severity:** medium
- **Page/Component:** `src/components/MarketCard.tsx`, `src/app/markets/[slug]/page.tsx`
- **Observation:** Both card and market hero alt patterns are essentially templated (`${market.name} luxury real estate`), which under-describes scene narrative and weakens editorial feel, accessibility richness, and AEO texture.
- **Recommended fix:** Move alt to market-level descriptive fields (e.g., “waterfront skyline at golden hour,” “canal-facing marina terrace”) and include one story cue per market image.
- **Validation:** Lightweight type-safe `alt` assertion in `src/lib/markets.ts` and spot-check against Lighthouse axe-a11y/field quality.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Carroll Group’s luxury editorial cards pair city/market name with context-specific copy and richer descriptive language.

## Finding 5 — Route-level OG strategy under-differentiates non-conversion content
- **Severity:** medium
- **Page/Component:** `src/app/layout.tsx`, `src/app/insights/page.tsx`, `src/app/accessibility/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
- **Observation:** Shared default OG (`/og-default.jpg`) is still used across editorial/utility routes, while only selected conversion and market routes have dedicated imagery. This weakens route-level editorial identity and social discoverability consistency.
- **Recommended fix:** Define route-specific OG assets for high-traffic narrative pages (`/insights`, `/about`, legal pages as needed) and wire explicit `openGraph` image per route.
- **Validation:** Add audit script asserting each canonical top-route has explicit OG and optionally map to a uniqueness policy (default only by exception).
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s uses distinct social cards for different sections, reinforcing brand tone beyond conversion funnels.

## Finding 6 — No image-style taxonomy for time-of-day/vantage consistency across hero surfaces
- **Severity:** medium
- **Page/Component:** `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/markets/page.tsx`, `src/app/markets/[slug]/page.tsx`, `src/components/Hero.tsx`
- **Observation:** Hero rendering lacks any metadata-driven “tone” dimension (twilight/golden-hour/waterfront-from-water vs terrace perspective) beyond the raw image file; all routes share similar overlay behavior. This prevents intentional curation and creates drift risk in long-term luxury positioning.
- **Recommended fix:** Introduce explicit `heroMood` and `heroPerspective` fields in market data and map to Hero preset classes (without changing tokens/font/theme).
- **Validation:** Add a visual review checklist + automated manifest check enforcing every hero entry has an approved mood/perspective annotation.
- **Safe to implement now:** yes
- **Principal-approval required:** yes
- **Benchmark:** Senada Adzem consistently signals cinematic mood at section level, not only via shared treatment overlays.

## Finding 7 — No evidence of distinct-market image narratives in schema
- **Severity:** medium
- **Page/Component:** `src/lib/markets.ts`
- **Observation:** Aside from filenames and copy, markets do not include any “story” or “signature shot” metadata tying each photo to a specific neighborhood narrative (e.g., skyline, marina, terrace, bay edge), so cards can read as one cataloged family rather than distinct market narratives.
- **Recommended fix:** Add per-market `editorialCue` fields (1–3 phrases) and expose them in card hover/caption or internal curation tooling.
- **Validation:** Add a review schema in audit docs and lint guard to require at least one cue per market.
- **Safe to implement now:** yes
- **Principal-approval required:** yes
- **Benchmark:** Ryan Serhant-style destination storytelling keeps each area visually and linguistically differentiated while staying within one luxury system.

## Finding 8 — Legacy SVG market files remain in public asset space and can be misused
- **Severity:** low
- **Page/Component:** `public/markets/*.svg`
- **Observation:** SVG text-placeholder files remain in the same namespace as production JPG heroes. While not currently rendered, this mixed namespace increases accidental reuse risk and increases maintenance ambiguity.
- **Recommended fix:** Remove `.svg` placeholders from public-serving scope or move them under a clearly non-public `/assets/prototypes/` path and document source policy.
- **Validation:** Asset sanity script that flags non-jpg files in `public/markets` unless explicitly exempted.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes’ asset pipelines avoid mixed placeholder/production namespaces that can contaminate production pulls.

## Finding 9 — Mia portrait asset contract conflicts with lane inventory path
- **Severity:** low
- **Page/Component:** `src/app/about/page.tsx`, `public/mia-headshot.jpg` (expected `public/images/headshot-mia-1024.png` per lane note)
- **Observation:** The lane checklist references `/public/images/headshot-mia-1024.png`, but the repo stores `mia-headshot.jpg` at root public. Today’s runtime uses `/mia-headshot.jpg`, so the asset contract for future lanes/automation is fragile.
- **Recommended fix:** Standardize a single canonical headshot path in a shared constant and either move/alias the file or update all references + lane documentation.
- **Validation:** Add a pre-build asset existence assertion for the canonical headshot path used by build, page, and CMS/OG consumers.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant’s brand implementations keep portrait assets on strict single-source contracts to prevent editorial drift.

## Finding 10 — No provenance or AI-authenticity audit gate for market/origin images
- **Severity:** medium
- **Page/Component:** `src/lib/markets.ts`, `public/markets/*.jpg`, `public/og-markets/*.jpg`
- **Observation:** There is no machine-readable provenance manifest (capture source, photographer, shoot date, retouch policy) or AI-vs-real marker in the image metadata path. Given cycle-6 scrutiny around AI-visible drift, this is an audit gap.
- **Recommended fix:** Add `src/lib/image-assets.ts` (or JSON sidecar) with fields like `sourceType`, `capturedBy`, `captureDate`, `approvedBy`; gate CI on missing manifest entries before merge.
- **Validation:** Extend `audit:images` or add `audit:image-provenance` that fails when metadata is missing or stale.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s editorial rigor is supported by clear provenance and production handoff practices, which protect editorial trust.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"lane-6-image-art-direction","verdict":"concerns","completeness":"full","top_concerns":["Image pipeline has stale and ambiguous source handling for market OG generation","No per-market art-direction metadata to guarantee distinctive luxury waterfront storytelling"],"findings_count":10,"high_severity_count":2,"safe_now_count":10,"benchmark_references":10}
=== AUDIT_END ===
