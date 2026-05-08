# Team B — Visual QA / Missing Image Inspector (Cycle 4)

## Verdict (one sentence)
`audit:all` is blocked by an environment-sensitive failure and the image-integrity checks currently required in-cycle are not yet structurally enforced, but image file existence for rendered and referenced assets is currently complete across the required catalog.

## Top 10 findings (numbered, each with severity / file / fix / validation / safe-now / approval-required)

1. severity: high | file: [scripts/render-images.ts](/home/torrey/code/mia-sanabria-website/scripts/render-images.ts) | fix: replace hard-coded target lists with `MARKETS`-driven derivation so all 13 market hero JPGs and 13 `og-markets` variants are always generated/validated in one pass | validation: compare generated set count/manifest against `public/markets/*.jpg` and `public/og-markets/*.jpg` every run | safe-now: yes | approval-required: no
2. severity: high | file: [scripts/audit-completeness.ts](/home/torrey/code/mia-sanabria-website/scripts/audit-completeness.ts), [package.json](/home/torrey/code/mia-sanabria-website/package.json) | fix: make report writing directory configurable/optional (or no-op in read-only mode) so `bun run audit:all` does not fail before image checks run | validation: re-run `bun run audit:all` with `EROFS` simulation and require exit 0 or clearly tagged infra warning only | safe-now: yes | approval-required: no
3. severity: medium | file: [package.json](/home/torrey/code/mia-sanabria-website/package.json) | fix: add `audit:images` script + insert into `audit:all` pipeline between `audit:seo` and `audit:completeness` (or before it) so image integrity is a first-class gate | validation: break a known image path and confirm audit fails with an explicit image-missing finding | safe-now: yes | approval-required: yes
4. severity: medium | file: [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx) | fix: add explicit per-route image contract in audit that each market route emits an image-mode Hero and that every `market.heroImage` path resolves to `/markets/<slug>.jpg` | validation: parse source route files + static outputs and assert hero image presence on market pages | safe-now: yes | approval-required: no
5. severity: medium | file: [src/app/not-found.tsx](/home/torrey/code/mia-sanabria-website/src/app/not-found.tsx), [src/app/legal pages](/home/torrey/code/mia-sanabria-website/src/app/privacy/page.tsx) | fix: confirm whether 404 is expected to carry OG; if yes, add explicit `openGraph.images` with `/og-default.jpg` (or 404-specific image) for parity with legal route checks | validation: parse `openGraph.images` for legal routes + canonical 404 route and compare expected set | safe-now: yes | approval-required: yes
6. severity: medium | file: [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx) | fix: make `imageAlt` required when `background="image"` and validate with compile-time type guard or lint rule to prevent empty functional image alt values in future edits | validation: introduce type-level/tsc check or eslint custom rule and confirm compile blocks missing `imageAlt` | safe-now: yes | approval-required: no
7. severity: medium | file: [scripts/render-images.ts](/home/torrey/code/mia-sanabria-website/scripts/render-images.ts), [public/markets/](/home/torrey/code/mia-sanabria-website/public/markets/) | fix: move from manual one-off render targets to contract-backed manifest generation so `public/markets/*.jpg` and `public/og-markets/*.jpg` are treated as build artifacts with expected count checks | validation: assert 13+13 generation output plus dimension checks each run | safe-now: yes | approval-required: no
8. severity: low | file: [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx), [src/app/markets/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx) | fix: create an explicit "hero contract matrix" in audit (`should-have-image` routes vs decorative/solid routes) to stop ambiguity and future regressions | validation: assert each route’s expected hero mode is present and matches implementation | safe-now: yes | approval-required: no
9. severity: low | file: [public/](/home/torrey/code/mia-sanabria-website/public/mia-headshot-256.jpg), [src/](/home/torrey/code/mia-sanabria-website/src/) | fix: either wire `mia-headshot-256.jpg` into real usage (avatar variants/social cards) or explicitly mark it as optional artifact to avoid false expectations in audits | validation: `rg -n "mia-headshot-256\\.jpg"` should be non-zero only when intended | safe-now: yes | approval-required: no
10. severity: low | file: [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx), [src/components/MarketCard.tsx](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/components/MeetMia.tsx](/home/torrey/code/mia-sanabria-website/src/components/MeetMia.tsx) | fix: codify expected `next/image` artifact behavior in sentinel: allow fill only for whitelisted hero/card patterns with `sizes`; warn/fail when unrecognized fill appears to keep cycle-3 warning class bounded | validation: baseline should remain only whitelisted fill callsites and no silent new warnings | safe-now: yes | approval-required: no

## scripts/audit-images.ts proposed spec

- inventory step
  - Crawl `public/` and build image index for:
    - `public/markets/<slug>.jpg` (expected 13, from `MARKETS` in `src/lib/markets.ts`)
    - `public/og-markets/<slug>.jpg` (expected 13, same slug list)
    - `public/services/{buyers,contact,sellers,valuation}.jpg`
    - `public/og-{buyers,sellers,valuation,contact,default}.jpg`
    - `public/mia-headshot.jpg`, `public/mia-headshot-256.jpg`, `public/mia-og.jpg`, `public/logos/*`
  - Validate dimensions + file kind:
    - market hero: 1200×1500
    - market OG: 1200×630
    - service OG: 1200×630
    - mia-og: 1200×630
    - mia-headshot: 1024×1024
    - mia-headshot-256: 256×256
    - logo PNG: must be PNG; prefer alpha channel presence where applicable.
- per-page rendered-image check
  - Parse all page and component source files in `src/app` and `src/components` for:
    - `<Image ... src="...">`, `<img ... src="...">`, and `background-image` / `url(...)` patterns.
  - Resolve local URLs beginning with `/`.
  - Assert existence under `public/`.
  - For pages with `Hero` `background="image"`:
    - assert `imageSrc` path exists
    - assert resulting rendered page includes a hero image mode (not silent fallback to plain color) unless route explicitly whitelisted as non-visual.
  - For `Hero` image mode, `imageAlt` should be required by type or sentinel check.
  - For `next/image`:
    - if `fill`, require `sizes` present
    - require `priority` on above-the-fold whitelisted contexts (`Hero`, header logo); allow lazy default for cards/list items.
- OG resolution check
  - Parse `openGraph.images` / `twitter.images` per route metadata.
  - Resolve `url` fields with either absolute `SITE.url` interpolation or direct absolute paths.
  - Fail if any path missing, remote URL in route-scoped metadata intended as local share asset, or dimension mismatch from expected OG contract.
  - Ensure every legal route and root has local OG metadata if policy says required.
- placeholder pattern check
  - Flag any image path matching:
    - `placeholder`, `temp`, `tmp`, `dummy`, `sample`, `fallback`, `default` (case-insensitive)
    - `url("...svg")` and any production `<Image>`/`<img>` path ending in `.svg` unless explicitly whitelisted.
  - Produce path+file evidence for manual review.
- alt + dimension check
  - Fail on functional images with empty/missing alt and no `aria-hidden`.
  - Require explicit `width/height` for non-fill `Image`; allow fill as documented exception (BRAND contract).
  - For `Image` without width/height and without `fill`, fail immediately.
- threshold and exit code rules
  - `FAIL` (exit code 1):
    - missing local file for any resolved image path
    - unresolved route OG image
    - missing required image-set counts
    - placeholder/forbidden pattern hits
    - missing alt on functional image
    - `fill` image without `sizes` outside whitelist
  - `WARN` (exit code 0 unless escalated):
    - unused variant file not wired (`mia-headshot-256`) while marked expected
    - mobile-crop/manual review flags for 4:5 portrait images (object-position ambiguity)
    - AI-authenticity/manual visual QA pending
  - `FAIL` summary JSON printed to stdout plus optional JSON report path.
  - `audit:all` should treat this as mandatory pre-completeness gate.

## Anti-criteria check
- ✅ No inventing facts about Mia.
- ✅ No correction of market county attributions in this report.
- ✅ No recommendation to abandon static-export.
- ✅ No recommendations for DNS/Cloudflare/GHL production writes.
- ✅ No mention of Boca/Delray/Palm Beach as a single county.

## Evidence appendix
- model_used: gpt-5.3-codex-spark
- team: B Visual QA
- reasoning_effort: xhigh
- sandbox: read-only
- audit script outputs captured during run:
  - `ls public/markets/` → 13 JPGs + 7 SVG placeholders present (20 entries total in folder listing).
  - `ls public/og-markets/` → 13 files.
  - `ls public/services/` → `buyers.jpg`, `contact.jpg`, `sellers.jpg`, `valuation.jpg`.
  - `ls public/og-*.jpg` → `og-buyers.jpg`, `og-contact.jpg`, `og-default.jpg`, `og-sellers.jpg`, `og-valuation.jpg`.
  - `ls public/mia-*` → `mia-headshot.jpg` (1024×1024), `mia-headshot-256.jpg` (256×256), `mia-headshot.svg`, `mia-og.jpg` (1200×630).
  - `ls public/logos/` → `lpt-realty.png`, `realtor-r.png`, `equal-housing.png`.
  - `bun run audit:all 2>&1 | tail -30` → fails with `EROFS: read-only file system, open .../reports/audit-completeness.json`.
  - `rg -rE 'src="/[^"]+\.(jpg|jpeg|png|webp|svg|gif)"' src/` → only local `/`-prefixed references found; no remote-image `src`.
  - `rg -rE 'imageSrc|heroImage|MIA..image|images:' src/` → hero/market references all exist; all 13 `market.heroImage` resolved to `public/markets`.
  - Per-market check performed against `src/lib/markets.ts` slugs: all referenced `heroImage` paths exist in `public/`.
  - `<img>` direct usage: none found in `src/app`/`src/components`; only `next/image` usages plus CSS background URL absence in codebase.

{"team":"B","verdict":"concerns","completeness":"partial","top_concerns":["render-images.ts hardcoded market/OG lists","audit:all fails in read-only environments","missing audit-images gate","per-route OG image resolver not enforced","not-found lacks explicit OG image metadata","Hero alt fallback can be empty","hero mode contract not explicitly codified","mia-headshot-256 unused","unused SVG placeholder assets","fill-image warning baseline not codified","missing mobile-crop/AI-authenticity automation"],"findings_count":10,"high_severity_count":2,"safe_now_count":8,"missing_assets_count":0}
