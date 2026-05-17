# Cycle 40C — Image State Recovery

> Confirms that all seven Cycle 40B neighborhood image assets exist on disk,
> are git-tracked, and that the source-side wire-up is in the working tree
> ready for commit.

## Asset presence on disk

```yaml
public/markets:
  deerfield-beach-cycle40b.jpg: 287K (git-tracked in 8095c78)
  hollywood-cycle40b.jpg:        246K (git-tracked in 8095c78)
  plantation-cycle40b.jpg:       384K (git-tracked in 8095c78)
  weston-cycle40b.jpg:           207K (git-tracked in 8095c78)
  coral-springs-cycle40b.jpg:    363K (git-tracked in 8095c78)
  davie-cycle40b.jpg:            239K (git-tracked in 8095c78)
  sunrise-cycle40b.jpg:          261K (git-tracked in 8095c78)
public/og-markets:
  deerfield-beach-cycle40b.jpg:  142K (git-tracked in 8095c78)
  hollywood-cycle40b.jpg:         88K (git-tracked in 8095c78)
  plantation-cycle40b.jpg:       188K (git-tracked in 8095c78)
  weston-cycle40b.jpg:           126K (git-tracked in 8095c78)
  coral-springs-cycle40b.jpg:    186K (git-tracked in 8095c78)
  davie-cycle40b.jpg:            107K (git-tracked in 8095c78)
  sunrise-cycle40b.jpg:          123K (git-tracked in 8095c78)
public/hero:
  mia-home-hero-cycle40b.jpg:    315139 bytes (git-tracked in 8095c78)
  mia-home-hero-cycle40b-og.jpg: 149774 bytes (git-tracked in 8095c78)
```

All fourteen neighborhood assets + the two hero assets are committed and on disk.

## Source references

`src/lib/markets.ts` (working tree, uncommitted) now points to the cycle40b paths for all seven slugs:

```text
src/lib/markets.ts:1349:    heroImage: "/markets/deerfield-beach-cycle40b.jpg",
src/lib/markets.ts:1424:    heroImage: "/markets/hollywood-cycle40b.jpg",
src/lib/markets.ts:1498:    heroImage: "/markets/plantation-cycle40b.jpg",
src/lib/markets.ts:1572:    heroImage: "/markets/weston-cycle40b.jpg",
src/lib/markets.ts:1647:    heroImage: "/markets/coral-springs-cycle40b.jpg",
src/lib/markets.ts:1721:    heroImage: "/markets/davie-cycle40b.jpg",
src/lib/markets.ts:1796:    heroImage: "/markets/sunrise-cycle40b.jpg",
```

Cycle40b version markers + audit scripts referencing the cycle40b suffix are in:

- `src/lib/mia.ts` (`CYCLE_40B_VERSION_SUFFIX`)
- `src/components/HeroSearch.tsx` (`data-hero-search-version="cycle40b"`)
- `src/components/Hero.tsx` (`data-hero-overflow-version="cycle40b"`, `data-hero-cta-version="cycle40b"`, `data-hero-copy-panel-version`)
- `src/app/page.tsx` (`imageSrc="/hero/mia-home-hero-cycle40b.jpg"`)
- `scripts/generate-neighborhood-images-v3.ts`
- `scripts/export-cycle40b-winner.ts`
- `scripts/audit-neighborhood-images-deep.ts` (live HTML probe requires `-cycle40b` strings to appear in `/markets/` index + per-slug detail page)
- `scripts/audit-image-creative-acceptance.ts` (asset presence under `public/markets/<slug>-cycle40b.jpg` + `public/og-markets/<slug>-cycle40b.jpg`)

## Winner selection (from prior session)

From `image-candidate-scorecards.md` + `image-art-direction-review.md` already on disk (8095c78):

```yaml
deerfield-beach: cand-1
hollywood:       cand-3
plantation:      cand-2
coral-springs:   cand-2
davie:           cand-1
sunrise:         cand-2
weston:          (verify against export-cycle40b-winner trail)
```

Note: weston winner index not visible in prior transcript snippet — the `image-provenance-ledger.md` row + scorecard total decides it.

## Conclusion

- All assets exist and are committed.
- Source-side wire-up is staged in the working tree.
- No regeneration needed.
- The remaining work is: validate locally → commit markets.ts → deploy → live-verify.
