# Cycle 30 — Read-Only Visual QA against Live Staging

**Base:** `https://miasanabriarealtor.trueidea.com/`
**Mode:** read-only (no form submissions, no DOM mutations, no cookies set)
**Cache:** every probe used `?cb=<8-byte-hex>` + `Cache-Control: no-cache` per project CLAUDE.md
**Browser Use status:** not installed in this repo's tooling; not added in this cycle (per mission scope). All QA performed with existing project tools (Playwright via `audit:mobile-readability`, plus `curl`-based content/nav extraction).

## Tools used

| Tool | Purpose | Status |
|---|---|---|
| `bun run audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` | Live Playwright sweep across 4 device profiles × 14 default routes | **56 PASS · 0 FAIL · 0 ERROR** |
| `curl` + Python regex on `<nav aria-label="Primary">` | Visible desktop header nav label extraction | matches Mia-approved |
| `curl` + Python regex on `<nav id="mobile-nav">` | Visible mobile drawer nav label extraction | matches Mia-approved |
| `curl` + grep across 16 routes | Honesty-contract sweep (no luxury concierge / white-glove / school-safety / superlatives / placeholders / bilingual claim / double-period) | 0 hits, every route |
| `curl HEAD` per route | 200/404/redirect check on every route in Phase 3 list | all 200 |

## Routes checked (16)

| Route | HTTP | Notes |
|---|---|---|
| `/` | 200 | New H1 markers `South Florida Lifestyle` + `Home Search` present |
| `/markets/` | 200 | Hub page; 9 neighborhood cards reachable |
| `/markets/fort-lauderdale/` | 200 | |
| `/markets/pompano-beach/` | 200 | |
| `/markets/deerfield-beach/` | 200 | Cycle 25 scaffold |
| `/markets/coral-springs/` | 200 | Cycle 25 scaffold |
| `/markets/plantation/` | 200 | Cycle 25 scaffold |
| `/markets/weston/` | 200 | Cycle 25 scaffold |
| `/markets/hollywood/` | 200 | Cycle 25 scaffold |
| `/markets/davie/` | 200 | Cycle 25 scaffold |
| `/markets/sunrise/` | 200 | Cycle 25 scaffold |
| `/buyers/` | 200 | |
| `/sellers/` | 200 | |
| `/insights/` | 200 | Header label `Blog` (route slug retained for SEO continuity) |
| `/about/` | 200 | |
| `/contact/` | 200 | |

## Desktop header nav (live)

Extracted from `<nav aria-label="Primary">` on every route. Labels are identical across all 16 routes:

```
['Neighborhoods', 'Buyers', 'Sellers', 'Blog', 'About', 'Contact']
```

Plus a separately-rendered Search icon link with `aria-label="Home Search"` and a `tel:` phone CTA — matching `src/components/SiteHeader.tsx:90-107`.

**Verdict:** matches Mia-approved exactly.

## Mobile drawer nav (live)

Extracted from `<nav id="mobile-nav">`:

```
['Neighborhoods', 'Buyers', 'Sellers', 'Blog', 'About', 'Contact', 'Home Search']
```

(`Home Search` appended in the drawer as a labeled button per `SiteHeader.tsx:149-160` — visible to thumb in addition to the icon.)

**Verdict:** matches Mia-approved exactly.

## Home Search accessibility label

`<a aria-label="Home Search" title="Home Search" href="/markets/#property-search">` rendered in both desktop and mobile contexts. Hover/title and screen-reader labels both read `Home Search`.

## "Insights" — non-nav classification

| # | Location | Visible? | Classification |
|---|---|---|---|
| 1 | `src/lib/site.ts:85` `FOOTER_NAV.explore = [{ href: "/insights/", label: "Insights" }]` | yes (footer Explore column) | **Footer label** — not header nav. Mia may choose to extend her `Blog` label here. |
| 2 | `src/app/page.tsx:166` `<InsightsTeaser heading="Latest Insights" />` | yes (homepage section H2) | **Section heading** — not header nav. Section eyebrow above also says `Insights`. |
| 3 | `src/lib/insights.ts` data-model exports (`INSIGHTS`, `getAllInsights`, etc.) | no | **Code identifier** — not visible copy. |
| 4 | `src/components/cta/*.tsx` `import type { InsightCTA }` | no | **TypeScript type** — not visible copy. |
| 5 | `src/app/sitemap.ts:4-34` `getAllInsights` | no | **Build-time helper** — not visible copy. |

Live HTML shows 6 occurrences of the literal string `Insights`: 1 homepage section eyebrow + 1 homepage section H2 + 1 footer link label + RSC-payload duplicates. **None appear in the header nav or mobile drawer.**

**Verdict:** Non-nav `Insights` text is classification-only — not header-nav drift. Mia decides in the review packet (Phase 6) whether she wants `Blog` end-to-end (footer + section heading) or is fine with `Insights` outside the header.

## Hero / CTA / overflow checks

`audit:mobile-readability` covers viewport-honesty, line-length, contrast, tap-target, and overflow at 4 device profiles (iphone-se 320, iphone-15 393, pixel-7 412, ipad-portrait 768) — **56/56 PASS** on the live base across 14 default routes. The 7 new neighborhood routes are not in the default route list for that audit (default set predates Cycle 25). Their hero/CTA/contrast was last verified on the local build per Cycle 26 readiness-qa and on live per Cycle 29 §14.6 deploy verification (all 7 returned 200 with fresh ETags and the cycle-25 neighborhood scaffolds intact).

**Recommendation:** before launch, extend the `audit:mobile-readability` default route list to include the 7 new neighborhood routes. Out-of-scope for this cycle; queued as a Phase 7 Claude-local item.

## Forms / submission stance

Per project CLAUDE.md and Cycle 29 §14.8: form endpoints are scaffold + mailto fallback only. No form was submitted on any route in this QA pass. No POST requests were issued to any form endpoint. Live forms render but their `action`/`onSubmit` is the scaffolded mailto fallback (verified by source in `src/lib/bridge.ts` — no GHL webhook URL in repo).

## Visible old-H1 regression check

Across all 16 routes, the legacy H1 `Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton` returns **0 hits**. No stale-copy regression.

## Honesty contracts (audit-stale-terms equivalents, live)

Across all 16 routes:

- `luxury concierge` / `white-glove` / `bespoke` / `high-net-worth` / `off-market` / `since 2017` / `within two hours`: **0 hits**
- `best schools` / `good schools` / `safe neighborhood` / `family-friendly` / `kid-friendly` / `bachelor pad`: **0 hits**
- `#1 realtor` / `top realtor` / `best realtor` / `guaranteed sale` / `guaranteed price`: **0 hits**
- `lorem ipsum` / `placeholder testimonial` / `TESTIMONIAL_PLACEHOLDER`: **0 hits**
- `bilingual` / `hablo español` / `Spanish-speaking`: **0 hits**
- `Updated MONTH YYYY` visible blog label: **0 hits**

## Screenshots / capture artifacts

Mobile-readability ran without `--capture` (read-only sweep). Existing baseline screenshots from Cycle 19A-M and Cycle 22 R1 are preserved at `docs/artifacts/cycle-19A-M/mobile-readability/after/` and `docs/artifacts/cycle-22-r1-*/`. This cycle did **not** add new screenshot artifacts because:

1. Visual edits = 0 this cycle (docs/report-only).
2. `audit:mobile-readability --base=<live>` already exercised the live Chromium render at 4 device profiles × 14 routes; failure cases would have surfaced as `FAIL`/`ERROR` entries (none).
3. Adding ~56 fresh screenshots without source change would inflate repo size for no diagnostic gain.

If Torrey wants fresh capture for client delivery alongside the Mia review packet, the trigger is `bun run audit:mobile-readability:capture` against the live base — queued as an optional Phase 7 item.

## Browser Use availability + deferral

- **Available in repo?** No `browser-use` import or skill installation present.
- **Installed system-wide?** Not verified in this cycle (verifying would require a `which`/`pip show` probe that is outside read-only QA scope).
- **Used?** No.
- **Deferred to:** optional Cycle 30A (`Browser Use Skill Install + Read-Only Staging QA`) if Torrey wants the higher-fidelity click-through + screenshot-per-route experience for the Mia review.

Existing Playwright-via-`audit:mobile-readability` was sufficient to satisfy this mission's visual-QA standard.

## QA verdict

- Live staging visually matches repo intent.
- Header + mobile nav match Mia-approved exactly.
- No old-H1 regression; no honesty-contract violations; no testimonial placeholders; no bilingual professional-service claim; no protected-class steering language; no superlatives.
- Forms render but were not submitted.
- All 16 reviewed routes return 200.
- Non-nav `Insights` references exist only in footer + homepage section eyebrow — classification surfaced for Mia in the review packet, not a nav-drift fix.

**No source code change required from QA findings.**
