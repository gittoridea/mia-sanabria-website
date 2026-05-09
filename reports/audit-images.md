# Audit Images Report

**Generated:** 2026-05-09T01:38:05.632Z

**Summary:** 10 PASS · 0 WARN · 0 FAIL · 0 SKIP

## Results by category

### Image Resolution

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.localFilesResolve` | ✅ | Every <img> referencing a local /public/* path resolves to an actual file | 189 <img> tags across 27 pages — all local references resolve |
| `images.ogImagesResolve` | ✅ | Every og:image referencing a local /public/* path resolves to an actual file | 27 og:image entries across 27 pages — all local references resolve |
| `images.twitterImagesResolve` | ✅ | Every twitter:image referencing a local /public/* path resolves to an actual file | 0 broken twitter:image references |

### Production Polish

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.noPlaceholderFilenames` | ✅ | No images use placeholder/lorem/todo/sample/untitled filenames | no placeholder filenames detected |

### Accessibility

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.altPresent` | ✅ | Every <img> has an alt attribute (empty alt for decorative is acceptable) | 189 <img> tags — all have alt attribute |

### Static Export Integrity

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.noUnresolvableRemote` | ✅ | No <img> uses a remote URL that bypasses the static-export pipeline (warns; does not fail) | no remote <img> URLs detected |

### Asset Inventory

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.requiredAssetsExist` | ✅ | Every Brand-Contract-required asset (headshot, logos, OG defaults, 13 market heroes) exists in public/ | all required assets present |

### Featured Markets

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.homepageFeaturedCards` | ✅ | Homepage Featured Markets section renders an <img> for each of the 6 featured market cards | all 6 featured cards render <img src="/markets/SLUG.jpg"> |

### Hub Pages

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.hubPageHeroImage` | ✅ | /markets/ and /about/ hero sections render an <img> (image-mode Hero) | 2 hub pages — all render image-mode hero |

### Email Consistency

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `images.publicEmailConsistency` | ✅ | Exactly one canonical public email address appears in rendered HTML | single canonical email: msanabriarea@gmail.com |
