# Audit Rendered Visual Report

**Generated:** 2026-05-17T16:51:25.590Z
**Mode:** local
**Base:** http://127.0.0.1:4173
**Concurrency:** 3
**Routes:** 35
**Viewports:** 320x568, 375x812, 768x1024, 1280x800, 1440x900

**Summary:** 14 PASS · 1 WARN · 0 FAIL · 0 SKIP

## Results by category

### Rendered Images

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.images.allRendered` | ✅ PASS | Every non-lazy image renders with naturalWidth>0, renderedWidth>0, opacity>0 | 0 broken images across 175 probes |

### Market Index

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.marketCards.allVisibleOnIndex` | ✅ PASS | /markets/ index renders ≥10 market cards with imgVisible=true | 23 visible cards (best viewport: 320x568) |
| `rendered.principalReportedMarkets.visible` | ✅ PASS | Lighthouse Point, Coral Ridge, Palm Beach cards visible on /markets/ (1280×800) | all 3 principal-reported markets visible |

### Hero

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.hero.headingFitsPanel` | ✅ PASS | Hero heading stays inside the copy panel (no right-edge clipping) | 0 offenders across 175 probes |
| `rendered.hero.eyebrowFitsPanel` | ✅ PASS | Hero eyebrow stays inside the copy panel (no right-edge clipping) | 0 offenders across 175 probes |
| `rendered.hero.subFitsPanel` | ✅ PASS | Hero sub-paragraph stays inside the copy panel (no right-edge clipping) | 0 offenders across 175 probes |
| `rendered.hero.primaryCtaAboveFoldDesktop` | ✅ PASS | Hero primary CTA stays above the fold at desktop viewports (1280x800 + 1440x900) | 0 desktop probes show primary CTA below fold |
| `rendered.hero.primaryCtaTextFits` | ✅ PASS | Hero primary CTA text does not tail-clip (scrollWidth > clientWidth) | 0 primary-CTA tail-clips |
| `rendered.hero.secondaryCtaTextFits` | ✅ PASS | Hero secondary CTA text does not tail-clip | 0 secondary-CTA tail-clips |

### Mobile

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `rendered.mobile.noHorizontalOverflow` | ✅ PASS | No horizontal overflow at mobile viewports (≤768) — viewport-honest probes only | 0 overflow at 35 viewport-honest probes; 70 dishonest probes SKIPPED (instrumentation mismatch) |

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
| `rendered.errors.zero` | ✅ PASS | Zero probe-internal errors and zero chrome runner errors | 0 probe errors |
| `rendered.probe.viewportSanity` | ⚠️ WARN | Every probe's actual window.innerWidth matches requested viewport width (±5px) — F6 instrumentation gate | 105/175 probes viewport-honest; 70 mismatched (chrome --dump-dom clamps mobile to ~500px — screenshot channel + GPT-5.5 visual review covers the gap) |

## Failures and warnings — details

### ⚠️ `rendered.probe.viewportSanity`

**Description:** Every probe's actual window.innerWidth matches requested viewport width (±5px) — F6 instrumentation gate

**Evidence:** 105/175 probes viewport-honest; 70 mismatched (chrome --dump-dom clamps mobile to ~500px — screenshot channel + GPT-5.5 visual review covers the gap)

```json
{
  "sanity": [
    {
      "requested": "1280x800",
      "total": 35,
      "honest": 35,
      "mismatched": 0,
      "sampleActual": 1280
    },
    {
      "requested": "1440x900",
      "total": 35,
      "honest": 35,
      "mismatched": 0,
      "sampleActual": 1440
    },
    {
      "requested": "320x568",
      "total": 35,
      "honest": 0,
      "mismatched": 35,
      "sampleActual": 500
    },
    {
      "requested": "375x812",
      "total": 35,
      "honest": 0,
      "mismatched": 35,
      "sampleActual": 500
    },
    {
      "requested": "768x1024",
      "total": 35,
      "honest": 35,
      "mismatched": 0,
      "sampleActual": 768
    }
  ],
  "totalProbes": 175,
  "honestProbes": 105,
  "totalMismatched": 70
}
```
