# Audit Rendered Visual Report

**Generated:** 2026-05-10T01:33:24.518Z
**Mode:** live
**Base:** https://miasanabriarealtor.trueidea.com
**Concurrency:** 3
**Routes:** 25
**Viewports:** 320x568, 375x812, 768x1024, 1280x800, 1440x900

**Summary:** 12 PASS · 1 WARN · 0 FAIL · 1 SKIP

## Results by category

### Rendered Images

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.images.allRendered` | ✅ PASS | Every non-lazy image renders with naturalWidth>0, renderedWidth>0, opacity>0 | 0 broken images across 125 probes |

### Market Index

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.marketCards.allVisibleOnIndex` | ✅ PASS | /markets/ index renders ≥10 market cards with imgVisible=true | 13 visible cards (best viewport: 320x568) |
| `rendered.principalReportedMarkets.visible` | — SKIP | Lighthouse Point, Coral Ridge, Palm Beach cards visible on /markets/ (1280×800) | /markets/ at 1280x800 not probed |

### Hero

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.hero.headingFitsPanel` | ✅ PASS | Hero heading stays inside the copy panel (no right-edge clipping) | 0 offenders across 125 probes |
| `rendered.hero.eyebrowFitsPanel` | ✅ PASS | Hero eyebrow stays inside the copy panel (no right-edge clipping) | 0 offenders across 125 probes |
| `rendered.hero.subFitsPanel` | ✅ PASS | Hero sub-paragraph stays inside the copy panel (no right-edge clipping) | 0 offenders across 125 probes |
| `rendered.hero.primaryCtaAboveFoldDesktop` | ✅ PASS | Hero primary CTA stays above the fold at desktop viewports (1280x800 + 1440x900) | 0 desktop probes show primary CTA below fold |
| `rendered.hero.primaryCtaTextFits` | ✅ PASS | Hero primary CTA text does not tail-clip (scrollWidth > clientWidth) | 0 primary-CTA tail-clips |
| `rendered.hero.secondaryCtaTextFits` | ✅ PASS | Hero secondary CTA text does not tail-clip | 0 secondary-CTA tail-clips |

### Mobile

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.mobile.noHorizontalOverflow` | ✅ PASS | No horizontal overflow at mobile viewports (≤768) | 0 mobile probes show horizontal overflow |

### CTAs

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.ctas.contrastVisible` | ✅ PASS | Every CTA in the viewport has WCAG large-text contrast ≥3.0:1 | 0 CTAs below contrast threshold |

### Stale Strings

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.staleStrings.absent` | ✅ PASS | No legacy / placeholder / template-residue strings appear in rendered text | 0 stale-string hits across rendered surfaces |

### Email

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.canonicalEmail.consistent` | ✅ PASS | Only the canonical email address (msanabriarea@gmail.com) appears in rendered text | single canonical email rendered: msanabriarea@gmail.com |

### Probe Health

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.errors.zero` | ⚠️ WARN | Zero probe-internal errors and zero chrome runner errors | 4 (route × viewport) pairs reported probe/runner errors |

## Failures and warnings — details

### ⚠️ `rendered.errors.zero`

**Description:** Zero probe-internal errors and zero chrome runner errors

**Evidence:** 4 (route × viewport) pairs reported probe/runner errors

```json
{
  "offenders": [
    {
      "route": "/",
      "viewport": "768x1024",
      "errors": [
        "no probe sentinel; title=Fort Lauderdale REALTOR® | Waterfront &amp; Luxury Homes"
      ]
    },
    {
      "route": "/",
      "viewport": "1280x800",
      "errors": [
        "no probe sentinel; title=Fort Lauderdale REALTOR® | Waterfront &amp; Luxury Homes"
      ]
    },
    {
      "route": "/markets/",
      "viewport": "1280x800",
      "errors": [
        "no probe sentinel; title=Featured Markets — Southeast Florida | Mia Sanabria"
      ]
    },
    {
      "route": "/markets/fort-lauderdale/",
      "viewport": "1440x900",
      "errors": [
        "no probe sentinel; title=Fort Lauderdale Luxury Real Estate | Mia Sanabria"
      ]
    }
  ]
}
```
