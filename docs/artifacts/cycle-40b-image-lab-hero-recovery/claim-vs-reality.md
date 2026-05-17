# Cycle 40C — Claim vs Reality

> Ground-truth audit of what was claimed vs what was verified. Updated as
> Phase 9 + Phase 11 complete.

## Cycle 40B (8095c78) — what was claimed in the prior session

| Claim | Reality | Source |
|-------|---------|--------|
| Cycle 40B image lab generated 21 candidates, 7 winners selected | TRUE — image-candidate-scorecards.md + image-manifest.md present + 7 cycle40b assets in `public/markets/` + `public/og-markets/` | 8095c78 commit; on-disk files |
| Homepage hero swapped from twilight to daytime waterfront | TRUE — `src/app/page.tsx imageSrc="/hero/mia-home-hero-cycle40b.jpg"` | source grep |
| Defensive mobile hero CSS landed | TRUE — Hero.tsx + HeroSearch.tsx + globals.css contain the 5-layer defenses | source grep |
| Local staging deploy completed successfully | **FALSE** — prior session's deploy-and-verify exited with EXIT_CODE:1 on `audit:images` because markets.ts wasn't updated | docs/.../logs/staging-deploy-20260516-210340.log |
| 375/390 overflow is a chrome --headless artifact | **TRUE, but unproven at the time** — Cycle 40C Playwright probe is the conclusive proof | cycle40c-mobile-hero-proof.md |

## Cycle 40C — what is claimed in this session

| Claim | Reality | Source |
|-------|---------|--------|
| markets.ts wired to cycle40b paths for all seven slugs | TRUE — d851494 commit; on-disk grep shows seven cycle40b heroImage entries | git log; src/lib/markets.ts |
| audit:images now passes (the original deploy blocker) | TRUE — 14 PASS / 0 WARN / 0 FAIL; both `everyMarketCardImagePresent` and `everyMarketPageHeroImagePresent` resolve all 23 markets | local run 22:16:00; reports/audit-images.json |
| audit:all chain passes | TRUE — completed at 22:15Z; 21 audits all PASS | docs/.../logs/cycle40c-audit-all.log |
| audit:image-creative-acceptance passes | TRUE — 7/7 slugs + all docs present | local run |
| audit:home-bridge-search passes | TRUE — 8/8 PASS | local run |
| Mobile hero is real-browser-safe at 320..1440 | TRUE — Playwright probe shows panel=vp-32 at every viewport up to 768, docScroll === vp, hasHorizontalScroll false at every viewport | /tmp/probe-widths.ts output; cycle40c-mobile-hero-proof.md |
| Capture-baseline artifact is decisively a screenshot pipeline issue, not a real defect | TRUE — Playwright with same chromium binary shows correct rendering; the chrome `--window-size` headless mode is the misleading variable | comparison of three independent capture methods |
| Cycle 40C commit equals origin/main HEAD | TRUE | `git rev-parse HEAD` && `git rev-parse origin/main` both return d851494 |
| Staging deploy succeeded with `?cb=<hex>` cache-bust + needle | TRUE — EXIT_CODE:0 in 172s; needle present; new live ETag diklqh3jne2o541d | tmux log |
| Live homepage hero is visually safe at 320..1440 | TRUE — Playwright live probe + visual inspect of 9 viewport captures all PASS | live-after-cycle40c/screenshots/; widths-probe.json |
| Live seven Cycle 40B neighborhood images visible | TRUE — all 7 cycle40b paths present in /markets/ index + each detail page; visually inspected at 1280 | live HTML grep + screenshots |
| Live Bridge E2E passes | TRUE — 11/11 PASS, mode=demo | bridge-e2e-final-report.md |
| Bridge mode on live is truthful | TRUE — mode=demo with honest banner per Cycle 33B doctrine | live HTML grep |
| Old IDX absent on live | TRUE — audit:no-old-idx 480 files PASS + live HTML grep clean of mlsmatrix.com | staging-live-verification-report.md |
| Final deployed commit equals origin/main HEAD | TRUE — both d851494; no follow-up alignment deploy needed | final-deploy-alignment-report.md |
| Secrets safe through Cycle 40C | TRUE — source clean, build clean, staged-patch clean, live HTML clean, env presence-only | secret-safety-report.md |
| Production readiness | **NOT CLAIMED** — cycle 40C is staging-only; production cutover, GHL endpoint wire-up, DNS swap remain external | mission brief explicit guardrail |

## Anti-claims (things I will NOT assert without evidence)

- "Mia approved the new hero" — operator/Mia gate, not AI.
- "Production-ready" — explicit mission-brief guardrail.
- "Real-device tested on iPhone 13/14/15" — Playwright probe is decisive for code-side verification; Mia/Torrey actual-device test is the closing gate.
- "GHL endpoints wired" — out of cycle 40C scope; form fields route to Bridge or mailto as currently designed.
- "Bridge tokens rotated or any external credential touched" — NONE.

## Truthfulness posture

Every claim above is either:

- backed by a concrete file + line / log / command output, or
- explicitly marked `<fill after Phase 9>` / `<fill after Phase 11>`.

Speculative claims are not acceptable for closeout. If Phase 9 / Phase 11 surfaces a contradiction, the corresponding row is amended in this document and the broader red-team-final-review.md is updated.
