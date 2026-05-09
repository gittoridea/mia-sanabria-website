AUDIT_START

## Verdict

**FAIL** — the deploy fixes the navy-on-navy contrast root cause, but live screenshots still show clipped mobile copy and missing desktop/laptop CTAs, so production acceptance is not met.

## Hero readability — live verdict

**FAIL.**

| Axis | Verdict | Rationale |
|---|---|---|
| Desktop / laptop | FAIL | 1440 H1 contrast is readable, but CTAs are not visible; 1280×800 clips the home hero stack before the full heading/sub/CTAs render. |
| Tablet | PASS | 768×1024 home evidence shows the H1, subcopy, and CTAs readable on the navy panel. |
| Mobile-medium | FAIL | 375×812 live home, buyers, and Harbor Beach screenshots clip right-edge heading/subcopy text. |
| Mobile-small | FAIL | No 320 live capture was provided; current local 320 evidence still clips home/buyers text and cuts CTA area. |

## Difference vs cycle 7 live state

Cycle 7 showed the H1 effectively navy-on-navy over photography, especially in `home-375.png` and `home-1440.png`. Cycle 8 is materially better on contrast: the H1 is cream on a solid navy panel with a brass edge, and the image remains visible around it.

The remaining problem changed shape: it is no longer primarily contrast; it is layout clipping. Cycle 8 live `home_mobile-md.png`, `buyers_mobile-md.png`, and `markets_harbor-beach_mobile-md.png` still hide text at the right edge, and desktop/laptop CTA rows are not reliably visible.

## CTA visibility — live verdict

**FAIL.** Mobile 375 shows CTAs on inspected routes, but 1440 desktop and 1280 laptop evidence do not show the CTA row on key routes, and 320 local evidence cuts the primary CTA region.

## Luxury feel — live verdict

**FAIL.** The design direction is luxury-consistent, but clipped text and absent CTAs are not production-grade execution.

## Cycle 5/6/7 root cause — fixed in production?

**Confirmed fixed for the navy-on-navy root cause.** The live hero now uses a cream H1 on a deterministic navy panel instead of relying on dark text/shadow over image pixels. This does not clear the separate layout/visibility failures.

## Cycle-8 acceptance criteria scorecard

| # | Status | Notes |
|---:|---|---|
| 1 | PASS | `data-hero-copy-panel`, `bg-navy-900/95`, brass left border present. |
| 2 | PASS | Eyebrow, H1, and subcopy are inside the panel. |
| 3 | PASS | CTA DOM is outside/after the panel. |
| 4 | PASS | Cycle-7 weak overlay/text-shadow anti-patterns are absent from `Hero.tsx`. |
| 5 | PARTIAL | Pixel sentinel exists, but threshold was relaxed from original 4.5:1 and live mode returns zero samples. |
| 6 | PASS | Local sentinel covers required routes/viewports and more. |
| 7 | PARTIAL | JSON records route/viewport/sample counts, but not original “min contrast + screenshot path” exactly. |
| 8 | PASS | `audit:hero-contrast` exists and is in `audit:all`. |
| 9 | PASS | Brand audit now treats hero tokens as structural and checks panel structure. |
| 10 | FAIL | Required closeout-grade screenshot verdict is not satisfied; 320 live evidence is missing and reviewed PNGs fail. |
| 11 | PARTIAL | Build/type/brand are green, but live hero audit is all WARN and original contrast threshold changed. |
| 12 | PASS | WebsiteProductionLoop v0.3.0 contains rendered hero readability/live visual gates. |

## Remaining minor concerns

- **High:** Mobile text clipping remains at 375 and 320 on long-copy routes.
- **High:** CTA visibility is still inconsistent, especially desktop/laptop and 320.
- **High:** `audit:hero-contrast --live` is not a valid live pass signal: current report is `0 PASS · 95 WARN`.
- **Medium:** The audit still does not assert full H1/subcopy/CTA bounding-box visibility.
- **Low:** Slight right-edge tightness should be solved through layout/wrapping, not `overflow-hidden`.

## Closeout language permission

**No.** Do not authorize “Hero readability PASS in production” because live visual evidence still fails on clipping/CTA visibility and the live pixel audit produced only WARN rows.

AUDIT_END