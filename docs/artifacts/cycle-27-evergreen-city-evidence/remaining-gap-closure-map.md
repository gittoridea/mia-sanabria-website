# Cycle 27 — Remaining Gap Closure Map

**Generated:** 2026-05-13
**Scope:** Every open gap between current site state and production readiness, categorized by who can close it.

## Structure

- **A) Closed locally this cycle.**
- **B) Local safe to close next** (no external dependency).
- **C) Blocked by Torrey approval / credentials.**
- **D) Blocked by Mia content / voice / photo decision.**
- **E) Blocked by counsel / legal / broker compliance.**
- **F) Blocked by GHL / Google / DNS / deployment.**
- **G) Blocked by Bridge runtime / credentials / middleware architecture.**
- **H) Deferred post-launch optimization.**

Each row: current claim, evidence, owner, next action, risk if skipped, launch-critical (Y/N), can-Claude-close-locally (Y/N), suggested next mission.

---

## A — Closed locally this cycle

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| A.1 — Source ledger for Fort Lauderdale + Pompano Beach | `source-ledger.md` FTL-1 … FTL-6, POM-1 … POM-5 | Cycle 27 | Closed | Reduced source-traceability for the 2 anchor cities | N | Y | — |
| A.2 — Per-city evidence briefs × 9 | `city-briefs/*.md` | Cycle 27 | Closed | Future cycles re-derive ICP framing | N | Y | — |
| A.3 — Mia ICP assimilation guide | `mia-icp-assimilation-guide.md` | Cycle 27 | Closed | Future copy-edit cycles drift from Mia voice | N | Y | — |
| A.4 — Copy crosswalk | `copy-crosswalk.md` | Cycle 27 | Closed | Risk surfaces re-investigated next cycle | N | Y | — |
| A.5 — Source policy and banned-source taxonomy | `source-policy.md` | Cycle 27 | Closed | Future research drifts from primary-source discipline | N | Y | — |

## B — Local safe to close next (no external dependency)

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| B.1 — `audit-rendered-visual.json` now 1.4 MB / 50,153 lines | Cycle 26 `bloat-review.md` flag F1 | Tooling | Decide: summarize JSON in git, move to side path, or `.gitignore` historical detail. Document choice in a tooling cycle. | Slower clones / harder diffs over time | N | Y | Cycle 28 (tooling: rendered-visual emission policy) |
| B.2 — Hero-contrast `audit:hero-contrast` runs `--samples=1` and occasionally flakes; `audit:hero-contrast:stable` runs `--samples=3` | `package.json` scripts ; `reports/audit-hero-pixel-contrast.{json,md}` | Tooling | Decide whether the stable variant becomes default in CI. Currently 0 FAIL in 2026-05-13 runs. | Occasional flake noise in red-flag triage | N | Y | Cycle 28 (audit policy alignment) |
| B.3 — Mobile-readability `--cycle=` / `--outDir=` flag support shipped Cycle 26 | `scripts/audit-mobile-readability.ts` | Tooling | Confirm Cycle 28 captures use the new flag path rather than the legacy hardcoded path. Update CI invocation when ready. | Captures land in wrong directory | N | Y | Cycle 28 (capture path migration) |
| B.4 — Cycle 25 placeholder hero JPGs still in production | `public/markets/*.jpg` for the 7 Cycle 25 cities | Mia content (asset) + main session (swap) | When Mia provides licensed photography, swap and re-run `render:og-insights` for OG cards. Brand-tone abstract placeholder is the current intentional state. | Less honest visual; brand-tone abstract is functional but not photographic | N | N (needs Mia photos) | Cycle 29 (photo cutover when Mia delivers assets) |
| B.5 — Optional FTL FAQ "yachting capital of the world" softening | `src/lib/markets.ts` `fort-lauderdale` FAQ 1 ; flagged FTL-FAQ-1 in `copy-crosswalk.md` | Editorial / Mia | If Mia approves, soften to "one of the world's leading yachting cities" or source to MIASF | Industry-association language is technically defensible ; mild overclaim | N | N (Mia-blocked editorial decision) | Cycle 28 if Mia approves the edit |
| B.6 — Optional internal-link addition: Pompano Beach in Fort Lauderdale `internalLinks` | `src/lib/markets.ts` slug `fort-lauderdale` | Editorial | Add `pompano-beach` to the array for symmetric peer navigation | Slightly weaker city-to-city navigation | N | Y | Cycle 28 (navigation polish) |
| B.7 — `audit:rendered` `rendered.hero.primaryCtaAboveFoldDesktop` FAILs on `/markets/davie/` at 1280x800 only | Phase 9 run 2026-05-13 ; same probe PASSed in Cycle 26 `f4d9a4b` with zero `src/` change in Cycle 27 ; deterministic on re-run (not flake). 1440x900 still passes. | Tooling | Investigate: (a) Davie hero composition (intro length / wrap behavior at 1280) ; (b) probe environment (Chrome version, font cache) ; (c) consider tightening the hero or accepting 1280x800 as borderline. **Classification:** environmental/borderline, NOT a Cycle 27 source regression. | Sub-optimal hero rendering at the smallest desktop viewport for one city | N | Y | Cycle 28 (rendered-visual probe / Davie hero composition) |

## C — Blocked by Torrey approval / credentials

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| C.1 — Unpushed local commits (5 commits ahead of origin/main) | `git status --ahead-behind` 2026-05-13 | Torrey | Decide push window ; review the 5 commits ; push to origin/main when ready | Local-only history is fragile if the workstation fails | Y (for any production launch) | N (cannot push without Torrey decision) | Cycle 28 (push window + review) |
| C.2 — DOKPLOY_API_TOKEN, NETLIFY_AUTH_TOKEN, GHL credentials, GA4 ID | `~/.claude/.env` per project `CLAUDE.md` | Torrey | Never written to repo. Used only via env-loaded scripts. | Credentials in repo = compliance failure | Y (any deploy / GHL wiring) | N | Cycle 28 (cutover packet review) |
| C.3 — `IS_STAGING` defaulting state per environment | `src/lib/site.ts` (review where IS_STAGING is read) | Torrey | When ready to launch, confirm production branch sets non-staging vars | Site indexes correctly only when production | Y | N | Cycle 28 (cutover packet review) |

## D — Blocked by Mia content / voice / photo decision

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| D.1 — "Most coveted" superlative in MeetMia H2 + markets-hub H1 | `src/components/MeetMia.tsx:31` ; `src/app/markets/page.tsx:63` ; `audit-no-fabrications.ts:77-79` | Mia | Mia decides: keep, soften, or replace. Pre-cleared for editorial-only change. | Mild superlative overclaim ; not Fair-Housing risk | N | N | Cycle 28 (Mia content review) |
| D.2 — FTL FAQ "yachting capital of the world" | `src/lib/markets.ts` `fort-lauderdale` FAQ 1 | Mia | Decide softening or source attribution | Mild overclaim | N | N | Cycle 28 |
| D.3 — 7 Cycle 25 cities use brand-tone abstract hero placeholders | `public/markets/{deerfield-beach,coral-springs,plantation,weston,hollywood,davie,sunrise}.jpg` | Mia | Provide licensed photography or approve continued use of brand-tone placeholders for launch | Less photographic warmth ; intentional brand-tone state currently | N | N (needs Mia assets) | Cycle 29 |
| D.4 — Mia headshot at `public/mia-headshot.jpg` — confirm current is the canonical photo | `src/components/MeetMia.tsx:13` | Mia | Confirm or replace | Brand-coherence small risk | N | N | Cycle 28 |
| D.5 — Testimonial / review capture | None in repo | Mia | If desired, capture exact source URLs + written permission for any review Mia wants surfaced. Cycle policy: no review text without permission-backed source. | No social proof ; intentional honesty-contract state | N | N | Cycle 30+ |
| D.6 — REALTOR® R logo display gated on NAR/Florida Realtors/BPSR membership | `docs/mia-client-decision-record.md` "Designations approved" ; `src/lib/mia.ts:54-58` | Mia | Provide written attestation + membership card cross-check (CATO-03 dependency) | Cannot legally display the R logo without compliance | Y (for full About page) | N | Cycle 28 |
| D.7 — Mia DBPR primary-source license confirmation | `src/lib/mia.ts:42-58` `unverified` block | Mia | DBPR portal screenshot capture | Pre-production gate for moving `licenseNumber` out of `unverified` | Y (for full About page) | N | Cycle 28 |

## E — Blocked by counsel / legal / broker compliance

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| E.1 — 4 legal pages (Privacy, Terms, TCPA PEWC, ADA) | `qa-gate-matrix` carries 4 `high` warnings CATO-01..08 ; per session report and project CLAUDE.md | Legal counsel + LPT Realty broker | Counsel review of current copy ; broker compliance sign-off | Cannot launch without legal approval | Y | N | Cycle 28+ (legal pack review) |
| E.2 — PDF lead-magnet disclaimers | `src/data/lead-magnets/index.ts` ; `audit:lead-magnets` | Legal counsel | Disclaimers reviewed for FREC + Fair Housing posture | Cannot publish lead magnets to production CTA without legal-clean disclaimers | N (legal review can run in parallel) | N | Cycle 28+ |
| E.3 — GA4 consent banner / cookie disclosure | Currently no GA4 ID surfaced (`MIA.tracking.ga4Id` resolves to `null` per `src/lib/mia.ts:39-40`) | Legal + Torrey | Decide consent model before GA4 ID is set | Compliance risk if GA4 fires without consent in EU traffic regions | N (depending on policy) | N | Cycle 28+ |

## F — Blocked by GHL / Google / DNS / deployment

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| F.1 — Contact form endpoint (currently mailto fallback) | `src/components/SiteFooter.tsx:82` confirms `mailto:${MIA.contact.email}` ; no GHL endpoint live | Torrey + GHL sub-account | Wire GHL form endpoint + webhook ; ship custom fields ; honeypot + Turnstile ; success/fail UI | Forms either fail silently or expose Mia's email in markup | Y | N (no endpoint to write to) | Cycle 28 (GHL form wiring) |
| F.2 — GA4 Measurement ID | `MIA.tracking.ga4Id` resolves null | Torrey | Create GA4 property ; set env var ; verify event firing | No analytics for launch | N (can ship without and add post-launch) | N | Cycle 28 |
| F.3 — GTM container | None | Torrey | Optional ; some teams ship without GTM and use direct GA4 only | No tag-manager flexibility | N | N | Cycle 29 |
| F.4 — Google Search Console verification | None | Torrey | Add verification meta or DNS record after canonical cutover | Slower SC indexing visibility | N | N | Cycle 28 |
| F.5 — Google Business Profile (GBP) | None | Mia / Torrey | Claim or align Mia's existing GBP to `miasanabria.com` | Local search visibility | N | N | Cycle 29 |
| F.6 — Sitemap currently shipped at `out/sitemap.xml` | `audit:route-inventory` confirms 47 routes ; site builds the sitemap from `MARKETS` + `MIA_APPROVED_NEIGHBORHOODS` | Torrey (deploy) | Confirm sitemap reaches production at canonical URL after cutover | Crawlers miss new routes | N (auto-generated) | N | Cycle 28 |
| F.7 — DNS cutover from `miasanabriarealtor.com` (Direct Axess) to `miasanabria.com` (Dokploy) | `docs/mia-client-decision-record.md` "Canonical domain" ; `src/lib/site.ts` `PRODUCTION_URL` already updated to canonical | Torrey + Mia | DNS swap with 301 redirects from legacy ; brand-email reissue | Site at canonical domain serves wrong content / no content | Y (for full launch) | N (DNS is out of Claude scope per project CLAUDE.md) | Cycle 28+ |
| F.8 — Dokploy production env vars / Caddy cache-flip | Project `CLAUDE.md` `Cache + verify` ; Cycle 21+ live-verification pattern | Torrey | Confirm Caddy ETag flips on deploy ; cache-busting `?cb=` pattern verified | Stale content served | Y | N | Cycle 28 |
| F.9 — Rollback plan | None codified | Torrey | Document the rollback path: previous Dokploy image + DNS revert + GHL form revert | Live regression with no recovery path | Y | N | Cycle 28 |

## G — Blocked by Bridge runtime / credentials / middleware architecture

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| G.1 — Bridge IDX runtime decision | `src/lib/bridge.ts:64` `BRIDGE_INTEGRATION_LIVE = false` ; Cycle 24 R2 hero-search is plain HTML scaffold linking to `#property-search` | Torrey + LPT Realty broker (for Bridge data agreement) | Decide: (a) skip Bridge entirely and ship with the existing Matrix MLS iframe ; (b) wire Bridge with credentials and replace inline search ; (c) replace with a third-party IDX vendor | Inline search currently inert ; users land on anchor + Matrix iframe | N (Matrix iframe works) | N (no Bridge credentials present) | Cycle 30+ (Bridge middleware architecture) |
| G.2 — Bridge `client_id` / `secret_id` / `server_token` / `browser_token` | `src/lib/bridge.ts` scaffold has env-var names only ; no values | LPT broker / Torrey | Obtain Bridge agreement + credentials ; store in `~/.claude/.env` ; never repo | Bridge cannot fire without credentials | N until G.1 decided | N | Cycle 30+ |
| G.3 — IDX market / city filter UX | None | Torrey | After G.1, design city/price/beds filter UX | Less buyer-friendly search | N | N (depends on G.1) | Cycle 30+ |

## H — Deferred post-launch optimization

| Gap | Evidence | Owner | Next action | Risk if skipped | Launch-critical | Claude-close? | Suggested next mission |
|---|---|---|---|---|---|---|---|
| H.1 — Mobile LCP / image pipeline tuning | `audit:mobile-readability` runs at 320/375/414/768 ; current pass | Tooling | Profile hero images for LCP after photo cutover (D.3) ; consider AVIF | Sub-optimal Core Web Vitals | N | Y partial | Cycle 30+ |
| H.2 — Legacy markets retain/de-emphasize strategy | `src/lib/mia.ts:174-187` carries the approved 9 ; legacy 14 listed in `copy-crosswalk.md` "Legacy East-FL" | Mia (long-term) | Decide whether the legacy 14 stay long-term, get redirected to neighborhood pages of the 9, or migrate to dedicated legacy hub | SEO weight currently distributed across all 23 slugs | N | N | Cycle 31+ |
| H.3 — Route migration `/markets/` → `/neighborhoods/` 301 alias | `docs/mia-client-decision-record.md` "Navigation" notes the alias as a future cycle | Torrey + Mia | Add 301 alias when ready ; not safe to do unilaterally | Naming consistency with nav label | N | N | Cycle 31+ |
| H.4 — Insights route `/insights/` → `/blog/` 301 alias | Same | Same | Same | Same | N | N | Cycle 31+ |
| H.5 — IDX market / city filter UX (post G.1 decision) | None | Torrey | After G.1 | Search UX richness | N | N | Cycle 31+ |
| H.6 — Insights / blog cross-linking across the 9 cities | None | Mia + main session | Cross-link insights to the 9 cities once Mia approves the editorial brief set | Slightly weaker editorial graph | N | Y (after Mia approval) | Cycle 31+ |
| H.7 — `audit:rendered-visual` output size strategy | See B.1 | Tooling | See B.1 | Diff churn | N | Y | See B.1 |

## Launch-critical summary

Items that block a production launch:

- **C.1** — Unpushed commits review/push
- **C.3** — Staging vs production env config
- **D.6** — REALTOR® R logo display written attestation
- **D.7** — Mia DBPR license primary-source confirmation
- **E.1** — Legal counsel + broker sign-off on 4 legal pages
- **F.1** — Contact form wiring (currently mailto fallback)
- **F.7** — DNS cutover
- **F.8** — Dokploy + Caddy verification
- **F.9** — Rollback plan codification

Everything else is either documentation-grade, post-launch optimization, or a Mia editorial decision.

## Smallest next mission after Cycle 27

The smallest viable next mission is **Cycle 28 — Mia content review + GHL form wiring + push window decision**. That mission packs:

1. Mia decisions on D.1 (most coveted), D.2 (yachting capital), D.4 (headshot), D.6 (R logo), D.7 (DBPR).
2. Push window for C.1 (review and push the 5 local commits to `origin/main`).
3. GHL form endpoint wiring for F.1.
4. Optional B.1 / B.5 / B.6 small fixes.

This is the right "next mission" because it bundles Mia-decision dependencies (which take a single conversation) with the highest-impact launch-critical Torrey decision (GHL form + push window). Legal / DNS / Bridge are necessarily further-out and benefit from being scheduled separately when counsel and Bridge architecture are ready.
