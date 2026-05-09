# Cycle 9 — Screenshot verdict matrix (local-after)

**Generated:** deterministic per-route × per-viewport scoring against the screenshots in this snapshot. Heuristics are color-cluster-based; see `docs/codex-spark-audits/cycle-9/team-C-verdict-matrix.md` § Limitations for known false-positive / false-negative shapes.

**Axes:**
- **H1 clipping** — does the heading text touch / extend past the right edge of the viewport?
- **CTA above-fold** — is a brass-400 pill visible in the bottom half of the viewport?
- **Contrast** — is there a deterministic dark-panel + cream-text reading field with luminance contrast ≥ 4.5:1?
- **Visual quality** — composite (PASS only when all three are PASS).

| route | 320x568 H1 clipping | 320x568 CTA above-fold | 320x568 Contrast | 320x568 Visual quality | 375x812 H1 clipping | 375x812 CTA above-fold | 375x812 Contrast | 375x812 Visual quality | 768x1024 H1 clipping | 768x1024 CTA above-fold | 768x1024 Contrast | 768x1024 Visual quality | 1280x800 H1 clipping | 1280x800 CTA above-fold | 1280x800 Contrast | 1280x800 Visual quality | 1440x900 H1 clipping | 1440x900 CTA above-fold | 1440x900 Contrast | 1440x900 Visual quality |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /about/ | FAIL | FAIL | PASS | FAIL | PARTIAL | FAIL | PASS | FAIL | PARTIAL | FAIL | PASS | FAIL | PARTIAL | FAIL | PASS | FAIL | PARTIAL | FAIL | PASS | FAIL |
| /buyers/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /contact/ | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL |
| /markets/ | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /markets/boca-raton/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /markets/delray-beach/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /markets/fort-lauderdale/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /markets/harbor-beach/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | PARTIAL | PASS | PASS | PARTIAL | FAIL | PASS | PASS | FAIL |
| /markets/las-olas-isles/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | PARTIAL | PASS | PASS | PARTIAL | FAIL | PASS | PASS | FAIL |
| /markets/sea-ranch-lakes/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /markets/seven-isles/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | PARTIAL | PASS | PASS | PARTIAL | FAIL | PASS | PASS | FAIL |
| /markets/victoria-park/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | PARTIAL | PASS | PASS | PARTIAL | FAIL | PASS | PASS | FAIL |
| /sellers/ | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | PASS | PASS | FAIL | FAIL | PASS | PASS | FAIL |
| /valuation/ | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | FAIL | PASS | FAIL |

## Counts by axis
- **320x568** — 0 PASS · 0 PARTIAL · 15 FAIL
- **375x812** — 0 PASS · 0 PARTIAL · 15 FAIL
- **768x1024** — 0 PASS · 0 PARTIAL · 15 FAIL
- **1280x800** — 0 PASS · 4 PARTIAL · 11 FAIL
- **1440x900** — 0 PASS · 0 PARTIAL · 15 FAIL

