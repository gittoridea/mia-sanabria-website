# Audit Images Report

**Generated:** 2026-05-14T17:13:20.561Z

**Summary:** 14 PASS · 0 WARN · 0 FAIL · 0 SKIP

## Results by category

### Image Resolution

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.localFilesResolve` | ✅ | Every <img> referencing a local /public/* path resolves to an actual file | 397 <img> tags across 57 pages — all local references resolve |
| `images.ogImagesResolve` | ✅ | Every og:image referencing a local /public/* path resolves to an actual file | 57 og:image entries across 57 pages — all local references resolve |
| `images.twitterImagesResolve` | ✅ | Every twitter:image referencing a local /public/* path resolves to an actual file | 0 broken twitter:image references |

### Production Polish

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.noPlaceholderFilenames` | ✅ | No images use placeholder/lorem/todo/sample/untitled filenames | no placeholder filenames detected |

### Accessibility

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.altPresent` | ✅ | Every <img> has an alt attribute (empty alt for decorative is acceptable) | 397 <img> tags — all have alt attribute |

### Static Export Integrity

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.noUnresolvableRemote` | ✅ | No <img> uses a remote URL that bypasses the static-export pipeline (warns; does not fail) | no remote <img> URLs detected |

### Asset Inventory

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.requiredAssetsExist` | ✅ | Every Brand-Contract-required asset (headshot, logos, OG defaults, 15 market heroes) exists in public/ | all required assets present |

### Featured Markets

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.homepageFeaturedCards` | ✅ | Homepage Featured Markets section renders an <img> for each of the 6 first-page featured market cards | all 6 first-page featured cards render <img src="/markets/SLUG.jpg"> |
| `images.everyMarketCardImagePresent` | ✅ | Every market in MARKETS renders <img src=/markets/<slug>.jpg> on /markets/ index | all 23 markets have card images on /markets/ |

### Hub Pages

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.hubPageHeroImage` | ✅ | /markets/ and /about/ hero sections render an <img> (image-mode Hero) | 2 hub pages — all render image-mode hero |

### Market Pages

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.everyMarketPageHeroImagePresent` | ✅ | Every market page /markets/<slug>/ renders <img src=/markets/<slug>.jpg> in its hero | all 23 market pages have a hero image |

### OG Images

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.everyMarketOgImageExists` | ✅ | Every market has an OG image at /og-markets/<slug>.jpg AND its page emits og:image referencing it | all 23 markets have OG image asset + reference |

### Principal-Reported Markets (Cycle 9 Addendum)

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.principalReportedMarkets` | ✅ | Lighthouse Point, Coral Ridge, Palm Beach — card image on /markets/, hero image on page, OG file + OG reference | all 3 principal-reported markets PASS — Lighthouse Point, Coral Ridge, Palm Beach |

### Email Consistency

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.publicEmailConsistency` | ✅ | Exactly one canonical public email address appears in rendered HTML | single canonical email: msanabriarea@gmail.com |
