# Cycle 39 — Neighborhood Images Final Report

date: 2026-05-16

## Fields

```yaml
target: https://miasanabriarealtor.trueidea.com/markets/
deploy: 889b2c2 (Cycle 39 staging)
markets_index_http_status: 200
seven_neighborhood_detail_http_status: 200 (each)

seven_neighborhoods_versioned_card_path_in_live_dom:
  deerfield-beach: /markets/deerfield-beach-cycle39.jpg (3+ refs across captured surfaces)
  hollywood: /markets/hollywood-cycle39.jpg (3+ refs)
  plantation: /markets/plantation-cycle39.jpg (7+ refs — related-links)
  weston: /markets/weston-cycle39.jpg (5+ refs)
  coral-springs: /markets/coral-springs-cycle39.jpg (5+ refs)
  davie: /markets/davie-cycle39.jpg (6+ refs)
  sunrise: /markets/sunrise-cycle39.jpg (6+ refs)

seven_neighborhoods_unversioned_src_in_live_dom:
  all_seven: false (0 occurrences across 10 captured live HTMLs)

seven_neighborhoods_live_asset_status:
  deerfield-beach hero+og: HTTP 200, bytes match repo (199686 / 106052)
  hollywood hero+og: HTTP 200, bytes match repo (271516 / 130344)
  plantation hero+og: HTTP 200, bytes match repo (379393 / 186532)
  weston hero+og: HTTP 200, bytes match repo (405135 / 185248)
  coral-springs hero+og: HTTP 200, bytes match repo (394510 / 198915)
  davie hero+og: HTTP 200, bytes match repo (263928 / 133336)
  sunrise hero+og: HTTP 200, bytes match repo (222571 / 122791)

audit_neighborhood_images_deep_live_pass: true   # 23/23, Cycle 39 versioned enforcement active
audit_images_local_pass: true                     # 14/0/0 via helpers
audit_no_old_idx: true                            # 480 files scanned, 0 hits
no_photo_available_in_dom: false                  # 0 placeholders across 10 captured HTMLs

cache_class_defeated: true
  reason: |
    Every versioned URL is structurally new — there is no cache key the
    operator's browser, Cloudflare, Caddy, or service worker has ever
    fetched at `/markets/<slug>-cycle39.jpg` or
    `/og-markets/<slug>-cycle39.jpg`. Stale-pixel rendering is mechanically
    impossible.

final_result: live_verified
```

## What changed vs Cycle 38

- 7 affected slugs' card image path: `/markets/<slug>.jpg` → `/markets/<slug>-cycle39.jpg`.
- 7 affected slugs' OG image path: `/og-markets/<slug>.jpg` → `/og-markets/<slug>-cycle39.jpg`.
- `src/lib/mia.ts` helpers (`getMarketImagePath`, `getMarketOgImagePath`)
  consult `MIA_CYCLE_39_VERSIONED_SLUGS: ReadonlySet<MarketSlug>` and
  append `-cycle39` suffix for set members.
- `src/lib/markets.ts` heroImage literals updated for the 7 slugs.
- `src/app/markets/[slug]/page.tsx` og:image meta routed through
  `getMarketOgImagePath` helper.
- `scripts/audit-images.ts` + `scripts/audit-neighborhood-images-deep.ts`
  consult the helpers; the deep audit gains hard-FAIL on missing
  `-cycle39.` suffix AND on live-DOM presence of unversioned paths for
  any versioned slug.

## What did NOT change

- The 16 non-affected slugs (fort-lauderdale, coral-ridge, victoria-park,
  boca-raton, palm-beach, delray-beach, lighthouse-point, rio-vista,
  harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes,
  hillsboro-mile, pompano-beach, bay-colony, bermuda-riviera) and their
  OG variants. Their card images remain at the unversioned path.
- The pixel content of the 7 affected images. Cycle 38's Gemini-generated
  photorealistic editorial JPEGs are byte-identically reused at the
  versioned paths.

## Operator-visible outcome (the test that matters)

When Mia next loads `https://miasanabriarealtor.trueidea.com/markets/`:

- Her browser sees `src="/markets/<slug>-cycle39.jpg"` for each of the
  seven affected slugs.
- It has never fetched that URL before, so it fetches fresh bytes from
  Caddy (cache-control: public, max-age=300, s-maxage=600).
- The fresh bytes are the Cycle 38 photorealistic editorial JPEGs (palm
  trees, beaches, twilight skies, sunset waterfront, mature canopy).
- The "stale framed-canvas pixel" rendering she may have been seeing is
  permanently eliminated for these URLs.

## What this report does NOT promise

- Promises Mia will subjectively prefer the Cycle 38 image compositions.
  That is an editorial judgment for Mia + the operator.
- Promises old browser cache state will be discarded for OTHER cached
  URLs (e.g., shared CSS chunks, JS chunks) — Caddy's max-age applies to
  those and the operator's browser revalidates against ETag normally.
  The 7 image URLs are the surface this cycle defeats; other surfaces
  rely on standard cache-control headers.

## Anti-regression rule (PERMANENT)

Any future asset republish that is visually significant (hero, market
cards, OG images, social-share previews) MUST republish at a new
versioned URL. The `audit:neighborhood-images-deep` enforcement makes
the rule mechanical for the seven affected slugs and serves as the
template for any future versioned-asset set.
