# Audit Completeness Report

**Generated:** 2026-05-09T14:10:26.257Z

**Summary:** 14 PASS · 2 WARN · 0 FAIL · 0 SKIP

## Results by category

### Sitemap coverage

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.sitemap.builtInSitemap` | ✅ | Every public built route is in sitemap.xml | 25 built · 25 in sitemap · 0 missing |
| `completeness.sitemap.sitemapInBuilt` | ✅ | Every sitemap route resolves to a built page | 0 unresolved |

### Compliance

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.legal.routesExist` | ✅ | Required legal routes /privacy/, /terms/, /dmca/, /accessibility/ are built | all 4 legal routes built |
| `completeness.footer.trust` | ✅ | Footer trust elements (LPT, license, EHO, REALTOR, 4 policy links) on sampled pages | all 7 sampled pages carry full footer trust set |

### SEO/AEO

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.metadata.allPresent` | ✅ | Every core/legal/market page has title + description + canonical + og:title + og:description + og:url + og:image | 0 field issues across 25 pages |
| `completeness.metadata.uniqueTitles` | ✅ | Each core/legal/market page has unique <title> | 25 unique titles across 25 pages |
| `completeness.metadata.uniqueDescriptions` | ✅ | Each core/legal/market page has unique <meta description> | all descriptions unique |
| `completeness.og.imagesResolve` | ✅ | Every page's og:image resolves to a local file in out/ | all og:images resolve |

### Local Authority

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.markets.wordFloor` | ✅ | Market pages have ≥200 visible words | all 13 market pages exceed 200-word floor |

### Design/Display Integrity

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.images.dimsAltPlaceholder` | ⚠️ | Core-page <img> tags have alt + width/height + no placeholder names | 28 img attribute issues |
| `completeness.images.localFilesExist` | ✅ | Local image references resolve to files in out/ | all referenced local images exist |

### Forms/CTAs

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.forms.classification` | ⚠️ | Form actions classified: live-ghl / mailto / disabled / other | 2 forms · 0 live-ghl · 2 mailto · 0 disabled · 0 other |

### Blog

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.blog.inNav` | ✅ | Insights/blog link present in homepage nav (header or footer) | insights linked from homepage |
| `completeness.blog.inSitemap` | ✅ | /insights/ in sitemap.xml | /insights/ in sitemap |
| `completeness.blog.articleSchema` | ✅ | /insights/ emits at least one Article JSON-LD | Article schema present |

### Schema

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `completeness.schema.valid` | ✅ | All JSON-LD blocks parse and carry @type | 149 JSON-LD blocks across 25 pages · 0 broken |

## Failures and warnings — details

### ⚠️ `completeness.images.dimsAltPlaceholder`

**Description:** Core-page <img> tags have alt + width/height + no placeholder names

**Evidence:** 28 img attribute issues

```json
{
  "issues": [
    {
      "route": "/",
      "img": "/markets/fort-lauderdale.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/mia-headshot.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/fort-lauderdale.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/victoria-park.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/boca-raton.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/delray-beach.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/harbor-beach.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/",
      "img": "/markets/las-olas-isles.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/about/",
      "img": "/markets/las-olas-isles.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/about/",
      "img": "/mia-profile.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/contact/",
      "img": "/services/contact.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/buyers/",
      "img": "/services/buyers.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/sellers/",
      "img": "/services/sellers.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/valuation/",
      "img": "/services/valuation.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/fort-lauderdale/",
      "img": "/markets/fort-lauderdale.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/fort-lauderdale/",
      "img": "/markets/las-olas-isles.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/fort-lauderdale/",
      "img": "/markets/harbor-beach.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/fort-lauderdale/",
      "img": "/markets/victoria-park.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/fort-lauderdale/",
      "img": "/markets/coral-ridge.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/coral-ridge/",
      "img": "/markets/coral-ridge.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/coral-ridge/",
      "img": "/markets/fort-lauderdale.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/coral-ridge/",
      "img": "/markets/victoria-park.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/coral-ridge/",
      "img": "/markets/lighthouse-point.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/victoria-park/",
      "img": "/markets/victoria-park.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/victoria-park/",
      "img": "/markets/fort-lauderdale.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/victoria-park/",
      "img": "/markets/rio-vista.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/victoria-park/",
      "img": "/markets/las-olas-isles.jpg",
      "problem": "missing width/height"
    },
    {
      "route": "/markets/victoria-park/",
      "img": "/markets/coral-ridge.jpg",
      "problem": "missing width/height"
    }
  ]
}
```

### ⚠️ `completeness.forms.classification`

**Description:** Form actions classified: live-ghl / mailto / disabled / other

**Evidence:** 2 forms · 0 live-ghl · 2 mailto · 0 disabled · 0 other

```json
{
  "live-ghl": [],
  "mailto": [
    {
      "route": "/contact/",
      "action": "mailto:msanabriarea@gmail.com?subject=Private%20Inquiry%20%E2%80%94%20Mia%20Sanabria",
      "type": "mailto"
    },
    {
      "route": "/valuation/",
      "action": "mailto:msanabriarea@gmail.com?subject=Valuation%20Request%20%E2%80%94%20Mia%20Sanabria",
      "type": "mailto"
    }
  ],
  "disabled": [],
  "other": []
}
```
