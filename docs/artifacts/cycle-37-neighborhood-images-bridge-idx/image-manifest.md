# Cycle 37 — Neighborhood Image Manifest

| Slug | Hero path | Hero bytes | OG path | OG bytes | Provenance | Source |
|------|-----------|-----------:|---------|---------:|------------|--------|
| coral-springs | /markets/coral-springs.jpg | 334,930 | /og-markets/coral-springs.jpg | 164,733 | ai-generated-illustrative | gemini-2.5-flash-image |
| davie | /markets/davie.jpg | 146,742 | /og-markets/davie.jpg | 83,631 | ai-generated-illustrative | gemini-2.5-flash-image |
| deerfield-beach | /markets/deerfield-beach.jpg | 178,459 | /og-markets/deerfield-beach.jpg | 81,645 | ai-generated-illustrative | gemini-2.5-flash-image |
| hollywood | /markets/hollywood.jpg | 136,189 | /og-markets/hollywood.jpg | 107,879 | ai-generated-illustrative | gemini-2.5-flash-image |
| plantation | /markets/plantation.jpg | 260,806 | /og-markets/plantation.jpg | 124,673 | ai-generated-illustrative | gemini-2.5-flash-image |
| sunrise | /markets/sunrise.jpg | 104,091 | /og-markets/sunrise.jpg | 73,323 | ai-generated-illustrative | gemini-2.5-flash-image |
| weston | /markets/weston.jpg | 177,481 | /og-markets/weston.jpg | 139,743 | ai-generated-illustrative | gemini-2.5-flash-image |

## Replaced placeholders (size before)

| Slug | Hero before (bytes) | Hero after (bytes) | OG before | OG after |
|------|--------------------:|-------------------:|----------:|---------:|
| coral-springs | 63,053 | 334,930 | 41,455 | 164,733 |
| davie | 56,100 | 146,742 | 36,189 | 83,631 |
| deerfield-beach | 65,360 | 178,459 | 42,843 | 81,645 |
| hollywood | 60,552 | 136,189 | 39,495 | 107,879 |
| plantation | 59,175 | 260,806 | 38,652 | 124,673 |
| sunrise | 57,304 | 104,091 | 37,080 | 73,323 |
| weston | 58,247 | 177,481 | 37,954 | 139,743 |

All 7 generated assets cleared the deep image audit thresholds (≥80 KB hero, ≥60 KB OG, ≥1200×1500 hero, ≥1200×630 OG).

## Untouched markets (real photography preserved)

`fort-lauderdale, coral-ridge, victoria-park, boca-raton, palm-beach, delray-beach, lighthouse-point, rio-vista, harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes, hillsboro-mile, bay-colony, bermuda-riviera, pompano-beach` — 16 existing photographic assets unchanged. `audit:neighborhood-images-deep` PASS 23/23 confirms no regression.
