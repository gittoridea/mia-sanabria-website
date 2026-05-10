# Audit Featured Markets Report

**Generated:** 2026-05-10T21:11:51.954Z

**Summary:** 17 PASS · 0 WARN · 0 FAIL · 0 SKIP

## Results

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `featured.order.firstPageMatchesPrincipal` | ✅ | First 6 entries of HOMEPAGE_FEATURED_ORDER match principal Cycle 16 §1 first-page direction | Order: fort-lauderdale, boca-raton, palm-beach, victoria-park, lighthouse-point, delray-beach |
| `featured.pageSize.is6` | ✅ | HOMEPAGE_FEATURED_PAGE_SIZE is 6 | HOMEPAGE_FEATURED_PAGE_SIZE = 6 |
| `featured.pager.rendered` | ✅ | Featured Markets pager renders on homepage with accessible label | aria-label="Featured markets pagination" present in /index.html |
| `featured.homepage.firstPagePresent` | ✅ | All 6 first-page featured market routes present in homepage HTML | Routes found for: fort-lauderdale, boca-raton, palm-beach, victoria-park, lighthouse-point, delray-beach |
| `featured.market.fort-lauderdale` | ✅ | Featured market fort-lauderdale has page + hero + OG + sitemap entry | route=/markets/fort-lauderdale/, hero=ok, og=ok, sitemap=ok |
| `featured.market.coral-ridge` | ✅ | Featured market coral-ridge has page + hero + OG + sitemap entry | route=/markets/coral-ridge/, hero=ok, og=ok, sitemap=ok |
| `featured.market.victoria-park` | ✅ | Featured market victoria-park has page + hero + OG + sitemap entry | route=/markets/victoria-park/, hero=ok, og=ok, sitemap=ok |
| `featured.market.boca-raton` | ✅ | Featured market boca-raton has page + hero + OG + sitemap entry | route=/markets/boca-raton/, hero=ok, og=ok, sitemap=ok |
| `featured.market.palm-beach` | ✅ | Featured market palm-beach has page + hero + OG + sitemap entry | route=/markets/palm-beach/, hero=ok, og=ok, sitemap=ok |
| `featured.market.delray-beach` | ✅ | Featured market delray-beach has page + hero + OG + sitemap entry | route=/markets/delray-beach/, hero=ok, og=ok, sitemap=ok |
| `featured.market.lighthouse-point` | ✅ | Featured market lighthouse-point has page + hero + OG + sitemap entry | route=/markets/lighthouse-point/, hero=ok, og=ok, sitemap=ok |
| `featured.market.rio-vista` | ✅ | Featured market rio-vista has page + hero + OG + sitemap entry | route=/markets/rio-vista/, hero=ok, og=ok, sitemap=ok |
| `featured.market.harbor-beach` | ✅ | Featured market harbor-beach has page + hero + OG + sitemap entry | route=/markets/harbor-beach/, hero=ok, og=ok, sitemap=ok |
| `featured.market.las-olas-isles` | ✅ | Featured market las-olas-isles has page + hero + OG + sitemap entry | route=/markets/las-olas-isles/, hero=ok, og=ok, sitemap=ok |
| `featured.market.bay-colony` | ✅ | Featured market bay-colony has page + hero + OG + sitemap entry | route=/markets/bay-colony/, hero=ok, og=ok, sitemap=ok |
| `featured.market.bermuda-riviera` | ✅ | Featured market bermuda-riviera has page + hero + OG + sitemap entry | route=/markets/bermuda-riviera/, hero=ok, og=ok, sitemap=ok |
| `featured.marketsIndex.complete` | ✅ | /markets/ index links to every market in ALL_MARKET_SLUGS | 15 markets linked |