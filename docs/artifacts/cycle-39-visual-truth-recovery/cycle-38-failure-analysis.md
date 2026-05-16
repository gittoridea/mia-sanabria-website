# Cycle 38 — Failure Analysis

date: 2026-05-16

## What Cycle 38 claimed

Cycle 38 final reports (`staging-live-verification-report.md`, `claim-vs-reality.md`)
asserted `final_result: live_verified` with:

- All 14 image assets HTTP 200 + byte-for-byte match repo.
- `<img src="/markets/<slug>.jpg">` present in raw HTML + rendered DOM for all seven.
- `audit:neighborhood-images-deep` 23/23 PASS at staging base.
- `audit:home-bridge-search` 8/8 PASS at staging base.
- Homepage hero asset `/hero/mia-home-hero.jpg` HTTP 200 + decoded.
- Floating search card visible at 375/768/1280/1440.
- Bridge mode `demo` (honest, banner shown).

## What the operator now says is still wrong

1. Seven neighborhood images did NOT visually update.
2. Homepage hero regressed.
3. Homepage "Search listings" is not properly wired to Bridge.
4. Other issues discovered on live review.

## Why Cycle 38's PASS reports are consistent with the operator's experience

Cycle 38 regenerated the seven images in place at the SAME unversioned asset
URLs:

- `/markets/<slug>.jpg`
- `/og-markets/<slug>.jpg`
- `/hero/mia-home-hero.jpg`

Each check Cycle 38 ran is structurally satisfied even if the operator's
browser is still serving the prior bytes:

| Cycle 38 check | Why it does not prove visual freshness |
|----------------|---------------------------------------|
| HTTP 200 | True for any extant file at the path |
| `content-length == repo bytes` | True from the origin; not what Chrome's HTTP cache returns when revalidating with `If-None-Match` |
| `<img src="/markets/<slug>.jpg">` in DOM | Tag exists; says nothing about pixel content |
| `google-chrome --headless=new --dump-dom` decodes JPEG | Server-side fetch, isolated profile, no operator cache state |
| `audit:neighborhood-images-deep` byte size / dimension gates | Structural — the framed-canvas defect of Cycle 37 also passed these gates |

The operator's Chrome (with persistent on-disk cache, possibly with
service-worker remnants from earlier visits) can revalidate with the prior
ETag, see a 304-equivalent flow, and render the cached previous pixels — even
though the origin holds new bytes. CDN/proxy edge layers add a second axis of
the same ambiguity.

## Was Cycle 38 visual? Yes, but not visual enough

Cycle 38 captured 40 staging screenshots and locally inspected them. But the
screenshots were taken from a fresh google-chrome --headless profile that has
no shared cache with the operator's actual browser, so they cannot reproduce
the operator-visible defect class. Vision-grade verification is necessary;
shared-cache verification is also necessary; Cycle 38 had only the former.

## Did Cycle 38 use versioned image URLs?

No. Every regenerated asset overwrote the same unversioned URL. This is the
single largest mechanical reason the fix did not land in the operator's
browser.

## Did Cycle 38 prove the actual miasanabria.com visible hero?

No. `reference-hero-extraction-report.md` openly states the visible hero in
the body HTML is rendered via two empty `<div>` siblings with CSS background
images. Cycle 38 did NOT extract those computed background-image URLs — it
instead used the `<meta property="og:image">` value (the same composition
served to social-share scrapers, hosted on `vibe.filesafe.space`). The
mission brief disallows this substitution: "do not use og:image unless proven
to be the actual visible hero background." Cycle 38 left this as an unproven
substitution.

## Did Cycle 38 prove homepage search in a live JS browser session?

No. `homepage-hero-staging-final-report.md` lines 52-53 explicitly say:
"BridgeSearch URL-param auto-search behavior. This requires JS execution
after URL params arrive; the static-HTML curl + dump-dom channels do not
exercise it. … an end-to-end live click-through with Interceptor or a
Playwright session would be the next hardening step. Queued in
remaining-blockers.md."

Cycle 38 marked the wiring as "implemented" but never proved it end-to-end
under real JS execution.

## Which parts must be fixed, reverted, or hardened in Cycle 39

| Item | Action |
|------|--------|
| Seven neighborhood image asset paths | **Versioned** — move to `/markets/<slug>-cycle39.jpg` + `/og-markets/<slug>-cycle39.jpg`. Update `src/lib/mia.ts` helpers, `src/lib/markets.ts` heroImage literals, and `src/app/markets/[slug]/page.tsx` og:image URL. |
| Homepage hero asset path | **Versioned** — `/hero/mia-home-hero-cycle39.jpg`. Re-probe the actual visible miasanabria.com hero via computed `background-image` before deciding whether to keep or replace the Cycle 38 asset bytes. |
| `audit-neighborhood-images-deep.ts` | **Harden** — fail if any of the seven slugs reference unversioned paths in source OR live DOM. |
| `scripts/test-home-search-bridge-e2e.ts` | **New** — google-chrome --headless=new navigates `/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero`, waits with `--virtual-time-budget=15000`, dumps DOM, asserts `data-bridge-runtime-mode` is one of `live\|demo\|fallback\|error`, asserts a results region renders, screenshots the result. |
| `scripts/probe-reference-hero-visual.ts` | **New** — fetches `https://miasanabria.com/`, extracts CSS `background-image` URLs from hero section via head-less rendering, compares against the Cycle 38 OG asset, downloads the proven asset to versioned local hero path. |
| Cycle 38 PASS narrative | **Supersede** — Cycle 39's reports replace Cycle 38's "live_verified" claim for these surfaces. |

## Anti-regression rule for future cycles

If a fix is "regenerate this asset," the asset URL **must** be versioned. The
audit suite has to treat any silent in-place asset replacement as a hard
failure for visually-significant assets (hero, market cards, OG images).
