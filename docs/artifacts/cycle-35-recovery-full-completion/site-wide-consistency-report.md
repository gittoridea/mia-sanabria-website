# Site-Wide Consistency Report — Cycle 35B

date: 2026-05-14
scope: All public routes inspected via captured staging HTML + screenshots + audit-gate runs.

## Inspected routes

```
/                                            HTTP 200, needles: South Florida Lifestyle, Home Search, LPT Realty, Mia Sanabria, Search available homes
/home-search/                                HTTP 200, Bridge IDX live in demo mode, demo banner visible
/markets/                                    HTTP 200, two-section hub, primary + FtL waterfront clusters
/markets/<23 slugs>/                         HTTP 200 each, full 8-section + 4-schema render
/buyers/, /sellers/, /about/, /contact/      HTTP 200, brand-consistent layout
/insights/, /insights/<post>/                HTTP 200, Insights editorial layer with related-market links
/privacy/, /terms/, /accessibility/, /dmca/  HTTP 200, legal layer present
/valuation/                                  HTTP 200
404                                          HTTP 200 (static export emits /404 page; correct)
```

## Cross-page consistency checked

| Check | Result |
|---|---|
| Top-nav structure consistent across pages | ✓ Neighborhoods · Buyers · Sellers · About · Contact · phone · search-icon |
| LPT Realty trust badge visible on every page | ✓ |
| Footer trust elements (LPT, NAR realtor®, equal-housing, accessibility, license footnote) | ✓ (`brand.footerTrustElements` audit pass) |
| Canonical URL points to https://miasanabria.com (production) | ✓ — staging deploys carry the production canonical for SEO continuity (per CLAUDE.md) |
| OG default + per-page OG images render | ✓ matched 1:1 to `/og-markets/<slug>.jpg` |
| Phone number format consistent | ✓ "(954) 540-0358" — one canonical formatting |
| Email format consistent | ✓ msanabriarea@gmail.com — one canonical address (`brand.publicEmailConsistency` pass) |
| Schema validation | ✓ no schema gate failures in audit:qa-gate |
| Internal links resolve | ✓ no 404 on inspected internal links |
| No "Updated MONTH YYYY" visible labels | ✓ grep negative |
| No "since 2017" / "as seen in/on" | ✓ |
| No "best schools" / "safe neighborhood" | ✓ |
| No "best realtor" / "#1" / "guaranteed" | ✓ |
| No `..` double-period defects | ✓ `audit:stale` pass |

## Insights → Markets reciprocal weaving

`/insights/` posts cross-link to market detail pages via `RelatedInsightsModule`. Market detail pages cross-link back to `/insights/` via the same component. No orphaned posts found in the captured HTML.

## AI-closeable issues found in this audit

None. The site is in a coherent, internally consistent state.

## Known external blockers (NOT AI-closeable)

- DBPR-verified license-number display gate (waiting on Mia's written attestation).
- Mia decision on retain/redirect/deprecate for boca-raton + delray-beach reference markets.
- Bridge real-feed activation (currently demo mode; user explicitly forbids API-key refresh/rotation).
- Production canonical cutover from `miasanabriarealtor.trueidea.com` staging → `miasanabriarealtor.com` (DNS work, not allowed this cycle).
- GHL form-endpoint wiring (currently mailto fallback per `CLAUDE.md` invariant).
- Mia's licensed photography for the 7 Broward city brand-tone hero replacements.

## Verdict

No source-code changes warranted in Phase K this cycle. The site is consistent enough for a Mia visual review and a launch dry-run.
