# Cycle 39 — Neighborhood Image Root Cause

date: 2026-05-16

## Symptom (operator-reported, Cycle 39)

"Seven neighborhood images still did not visually update" after Cycle 38's
republish.

## Cycle 38 fix (background)

Cycle 38 root-caused the Cycle 37 framed-canvas defect (paintings on white
gallery walls baked into the JPEGs) and republished all seven slugs with
Gemini 2.5 Flash Image + a hardened prompt + perimeter-whiteness
validator. The new JPEGs are photorealistic editorial compositions; a
fresh-cache headless Chrome profile renders them correctly.

## What Cycle 39 root-caused additionally

Cycle 38 wrote the new JPEGs to the SAME unversioned URLs:

```
/markets/<slug>.jpg
/og-markets/<slug>.jpg
```

This is the silent-failure pattern. Any operator-visible browser, CDN
edge, service worker, or HTTP cache layer that had previously fetched
the Cycle 37 framed-canvas pixels at those URLs can:

1. Revalidate with the prior ETag.
2. Receive a 304 Not Modified OR receive the new payload but apply a
   cached transformation.
3. Render the prior pixels.

Cycle 38's verification ran in a fresh headless Chrome profile that had
no shared cache state with the operator's actual browser. The "23/23
PASS" was structurally true but operator-visually false.

## Cycle 39 fix

Republish the seven slugs at versioned filenames:

```
/markets/<slug>-cycle39.jpg
/og-markets/<slug>-cycle39.jpg
```

The URL change forces every browser, every proxy, every edge cache to
fetch the new bytes on first sight — there is no prior cache key to match.
The operator's Chrome MUST request fresh bytes the first time it loads
a versioned URL.

This fix class — versioned-URL republish — is the only way to defeat
shared-cache ambiguity. Any future asset republish that does NOT change
the URL will reintroduce this failure class.

## Audit-boundary anti-regression

`scripts/audit-neighborhood-images-deep.ts` was extended this cycle:

1. For any slug in `MIA_CYCLE_39_VERSIONED_SLUGS`, the resolved card path
   AND OG path MUST contain the `-cycle39.` suffix. A missing suffix is a
   hard FAIL.
2. When `--base=<url>` is provided, the audit fetches the live
   `/markets/` index AND each `/markets/<slug>/` detail and FAILS if the
   unversioned `src="/markets/<slug>.jpg"` appears in the rendered HTML
   for any versioned slug.

Both checks block the audit's PASS exit code so any reversion of the
versioning fix would be caught at audit-time, not in operator-visible
production.

## Generation-boundary anti-regression (deferred from Cycle 38)

Folding the perimeter-whiteness validator from
`scripts/generate-neighborhood-images-v2.ts` into
`scripts/audit-neighborhood-images-deep.ts` is still deferred — Cycle 38
caught the framed-canvas defect class at the generation boundary; an
audit-boundary catch would harden against future asset swaps that bypass
the generator. Queued for a future cycle.

## Honest classification

The Cycle 37 defect was a BYTES problem (framed-canvas paintings).
The Cycle 38 BYTES were fixed; the URL was not. The Cycle 39 URLS
are fixed. Both Cycle 38 and Cycle 39 were necessary; either alone
was insufficient.
