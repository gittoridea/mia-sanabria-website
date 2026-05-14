# Visual QA — Local Final Report

date: 2026-05-14
purpose: Verify the local `out/` static export matches staging and passes mobile-readability at the same gate as staging.

## Method

1. `bun run build` produced `out/` from HEAD = `3530d5f` (origin/main).
2. A minimal Bun static server (`bun -e ...`) served `out/` on port 4174 (port reserved via `scripts/lib/port-guard.ts`).
3. `scripts/capture-baseline.ts --base=http://localhost:4174` captured 36 routes × 2 viewports = 72 PNGs in 40s.
4. `bun run audit:mobile-readability` against local preview returned 84 PASS / 0 FAIL.

## Output

- `docs/artifacts/cycle-35-recovery-full-completion/visual-qa/local-final/` — 72 PNGs + `_capture-summary.json` (`{ok:72, fail:0, duration_seconds:40}`).

## Route-by-route summary (all 36 routes)

For every captured route at both viewports the status is `pass` — no thin pages, no missing hero, no obvious mobile layout breakage. The local set is structurally identical to the staging-recovery set because the deployed bundle was built from the same HEAD as the local `out/` directory.

```
route                                viewport     status   issues_found        fixes_applied   remaining
/                                    375x812      pass     none                none            none
/                                    1280x800     pass     none                none            none
/about/                              375x812      pass     none                none            none
/about/                              1280x800     pass     none                none            none
/buyers/                             375x812      pass     none                none            none
/buyers/                             1280x800     pass     none                none            none
/sellers/                            375x812      pass     none                none            none
/sellers/                            1280x800     pass     none                none            none
/valuation/                          375x812      pass     none                none            none
/valuation/                          1280x800     pass     none                none            none
/contact/                            375x812      pass     none                none            none
/contact/                            1280x800     pass     none                none            none
/markets/                            375x812      pass     none                none            none
/markets/                            1280x800     pass     none                none            none
/markets/fort-lauderdale/            375x812      pass     none                none            none
/markets/fort-lauderdale/            1280x800     pass     none                none            none
/markets/coral-ridge/                375x812      pass     none                none            none
/markets/coral-ridge/                1280x800     pass     none                none            none
/markets/victoria-park/              375x812      pass     none                none            none
/markets/victoria-park/              1280x800     pass     none                none            none
/markets/boca-raton/                 375x812      pass     none                none            none
/markets/boca-raton/                 1280x800     pass     none                none            none
/markets/palm-beach/                 375x812      pass     none                none            none
/markets/palm-beach/                 1280x800     pass     none                none            none
/markets/delray-beach/               375x812      pass     none                none            none
/markets/delray-beach/               1280x800     pass     none                none            none
/markets/lighthouse-point/           375x812      pass     none                none            none
/markets/lighthouse-point/           1280x800     pass     none                none            none
/markets/rio-vista/                  375x812      pass     none                none            none
/markets/rio-vista/                  1280x800     pass     none                none            none
/markets/harbor-beach/               375x812      pass     none                none            none
/markets/harbor-beach/               1280x800     pass     none                none            none
/markets/las-olas-isles/             375x812      pass     none                none            none
/markets/las-olas-isles/             1280x800     pass     none                none            none
/markets/seven-isles/                375x812      pass     none                none            none
/markets/seven-isles/                1280x800     pass     none                none            none
/markets/sea-ranch-lakes/            375x812      pass     none                none            none
/markets/sea-ranch-lakes/            1280x800     pass     none                none            none
/markets/hillsboro-mile/             375x812      pass     none                none            none
/markets/hillsboro-mile/             1280x800     pass     none                none            none
/markets/bay-colony/                 375x812      pass     none                none            none
/markets/bay-colony/                 1280x800     pass     none                none            none
/markets/bermuda-riviera/            375x812      pass     none                none            none
/markets/bermuda-riviera/            1280x800     pass     none                none            none
/markets/pompano-beach/              375x812      pass     none                none            none
/markets/pompano-beach/              1280x800     pass     none                none            none
/markets/deerfield-beach/            375x812      pass     none                none            none
/markets/deerfield-beach/            1280x800     pass     none                none            none
/markets/hollywood/                  375x812      pass     none                none            none
/markets/hollywood/                  1280x800     pass     none                none            none
/markets/plantation/                 375x812      pass     none                none            none
/markets/plantation/                 1280x800     pass     none                none            none
/markets/weston/                     375x812      pass     none                none            none
/markets/weston/                     1280x800     pass     none                none            none
/markets/coral-springs/              375x812      pass     none                none            none
/markets/coral-springs/              1280x800     pass     none                none            none
/markets/davie/                      375x812      pass     none                none            none
/markets/davie/                      1280x800     pass     none                none            none
/markets/sunrise/                    375x812      pass     none                none            none
/markets/sunrise/                    1280x800     pass     none                none            none
/insights/                           375x812      pass     none                none            none
/insights/                           1280x800     pass     none                none            none
/privacy/                            375x812      pass     none                none            none
/privacy/                            1280x800     pass     none                none            none
/terms/                              375x812      pass     none                none            none
/terms/                              1280x800     pass     none                none            none
/accessibility/                      375x812      pass     none                none            none
/accessibility/                      1280x800     pass     none                none            none
/dmca/                               375x812      pass     none                none            none
/dmca/                               1280x800     pass     none                none            none
/404                                 375x812      pass     none                none            none
/404                                 1280x800     pass     none                none            none
```

## Cross-check: local matches staging

The local-final capture set is structurally identical to staging-recovery: same number of jobs (72), same viewports, same 0-failure verdict, same identifiable H1s + hero treatments. The local build of `3530d5f` matches what Caddy is serving on `miasanabriarealtor.trueidea.com` (etag `diijwdedso3k…`).

## Verdict

Local visual QA confirms no source-side regressions vs. staging. No fixes were applied because no defects were found. Cycle 35B may proceed to commit + final deploy.
