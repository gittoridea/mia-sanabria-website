# Cycle 30B — Lane A: Launch Definition-of-Done

**Author lens:** Mission Commander / Launch DoD Officer
**Inputs reviewed:** `docs/artifacts/cycle-30-mia-staging-review/launch-blocker-matrix.md`, `torrey-action-list.md`, `MIA_SESSION_REPORT.md` §15, current git state, `docs/mia-client-decision-record.md`.
**Purpose:** keep launch truth honest. Prevent staging visibility from becoming a production-readiness overclaim. Lock the exact launch-gate sequence.

## Cardinal rule

> **Staging visible ≠ production ready.** Staging at `https://miasanabriarealtor.trueidea.com` is a private review URL with `robots: noindex,nofollow`. Until DNS cutover lands and every launch-critical gate below is green or has an explicit recorded launch-exception approval, no operator, doc, or report may make a "ready for launch" claim.

Any Cycle-N artifact that says or implies the site is production-ready without all gates green is a doctrine violation and must be banner-fixed in the next cycle.

## Launch-gate sequence (today → production)

Sequence is **not optional**. Each row blocks every row below it.

| # | Gate | Owner | Closes when | Evidence required at close |
|---|---|---|---|---|
| **G1** | Mia returns marked-up review packet | Mia | She marks each page with 🛑 / ⚠️ / ✅ / 📅, confirms the 9-neighborhood roster, confirms `miasanabria.com` final canonical, answers 9 specific questions in `mia-review-packet.md` | Marked-up packet saved at `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions" |
| **G2** | Cycle 31 — Mia Review Decisions Application | Torrey + Claude | Every 🛑 + ⚠️ item is applied as a copy/code edit; ✅ + 📅 items deferred with rationale; site re-staged | Cycle 31 commit + green `audit:qa-gate` + green `audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` |
| **G3** | Counsel ships final DMCA USCO designation language | Counsel | Counsel sends final designation text to Torrey; `/dmca/` page updated to remove "in-process" wording | `audit:legal` shows `legal.dmca.uscoFlag` flips from WARN to PASS |
| **G4** | Cato cross-vendor compliance re-audit returns no criticals | external Cato auditor | Cato runs in VERIFY phase of a pre-cutover E4/E5 ISA mission and returns structured JSON with no critical-severity findings | Cato JSON archived under `docs/artifacts/cycle-XX/cato-compliance-review.json` |
| **G5** | GHL forms wired (Cycle 32) | Torrey + Claude | Torrey provides GHL endpoint URL + custom field IDs + workflow IDs; Claude wires `src/lib/bridge.ts` form-submit (or replacement) with honeypot + Turnstile + success/fail UI states; Torrey confirms one test lead lands in GHL pipeline | Cycle 32 commit + at least one successful end-to-end test from staging → GHL workflow → notification |
| **G6** | GA4 / GTM / Consent Mode v2 wired (Cycle 34) | Torrey + Claude | Torrey provisions GTM container ID; Claude installs GTM in `src/app/layout.tsx`; Consent Mode v2 banner renders pre-default-deny; GA4 fires post-consent only | Cycle 34 commit + GA4 Realtime view shows test pageview from staging |
| **G7** | Photos placed for Mia's priority cities (if any) | Mia provides → Torrey + Claude place | Mia ships photo assets + license confirmation; Claude swaps placeholders | Cycle 31/32 commit; `audit:images` passes |
| **G8** | Testimonials placed (if any) | Mia provides → Torrey + Claude place | Mia ships FB or Realtor.com exact-text + reviewer name + written permission screenshot for each; Claude renders with source attribution | Cycle 31/32 commit; `audit:no-fabrications` 0 hits |
| **G9** | Final pre-cutover dry run | Torrey + Claude | All G1-G8 green; `audit:all` exits 0; live staging mirrors all G2-G8 decisions; rollback plan documented in `DEPLOY.md` | Green `audit:all` log archived |
| **G10** | DNS cutover (Cycle 36) | Torrey + DNS owner + Mia | Flip `miasanabria.com` A/AAAA → Helos VPS IP `148.230.82.215`; bind `miasanabria.com` + `www.` in Dokploy; LE issues cert; redeploy with `NEXT_PUBLIC_SITE_URL=https://miasanabria.com`; 301 from `miasanabriarealtor.trueidea.com` → `https://miasanabria.com` | live `https://miasanabria.com/` returns 200 with `<link rel="canonical" href="https://miasanabria.com/">`; new ETag visible; sitemap URLs all resolve under new host |
| **G11** | Post-cutover smoke test + 24-48 h watch (Cycle 37) | Torrey + Claude | Full route sweep on `miasanabria.com`; `audit:mobile-readability --base=https://miasanabria.com` 56+ PASS; no regression; sitemap submitted to GSC + Bing | Cycle 37 commit + GSC submission screenshot saved off-repo |
| **G12** | GBP + legacy 301 + Direct Axess unhook | Torrey + Mia + DNS | GBP "Website" field → `https://miasanabria.com`; legacy `miasanabriarealtor.com` Direct Axess host unhooked; 301 from `miasanabriarealtor.com/*` → `https://miasanabria.com` matching path | GBP audit screenshot; `curl -I https://miasanabriarealtor.com/` returns 301 to canonical |

**Production = G1 through G12 closed.** Anything earlier is staging or pre-launch.

## "Do not start before" list

| Activity | Do not start until |
|---|---|
| Cycle 31 Mia Review Decisions Application | G1 closed |
| Cycle 32 GHL Forms wiring | Torrey has the GHL endpoint URL + field IDs in hand (no chat-paste of values) |
| Cycle 33 Bridge runtime implementation | Torrey decides runtime path (iframe v1 / API SSR / Worker broker) AND credentials are placed in Dokploy/CF secrets, not in repo |
| Cycle 34 GA4/GTM | Torrey has GTM container ID provisioned |
| Cycle 35 Legal / CATO closure | G3 (DMCA designation) text from counsel in hand |
| Cycle 36 DNS cutover | G1, G2, G3, G4, G5, G6 closed (G7, G8 optional but recommended) OR explicit launch-exception JSON recorded per "Launch exception template" below |
| Cycle 37 Post-cutover smoke | G10 closed |

## Launch exception template (use sparingly)

If Torrey or Mia chooses to launch with a known gap (e.g. testimonials missing, photos placeholder-only, Bridge IDX still iframe), capture the exception in `docs/mia-client-decision-record.md` §"Launch exceptions" with this shape:

```yaml
- exception_id: LE-NNNN
  cycle: CycleXX
  date: YYYY-MM-DD
  gap: "<one line summary>"
  approved_by: ["torrey", "mia"]   # both must be named explicitly
  approval_evidence: "<path to telegram screenshot OR git commit OR email saved off-repo>"
  scope: "<what is allowed to ship without this gap closed>"
  follow_up_cycle: "<which cycle closes the gap post-launch>"
  follow_up_deadline: YYYY-MM-DD
  rollback_trigger: "<exact symptom that should trigger rollback>"
```

A gap without a recorded exception is **not approved to launch**. "Implicit acceptance" is not approval.

## Rollback readiness checklist

| # | Item | Status | Source |
|---|---|---|---|
| R1 | Dokploy keeps N previous builds; one-click "Rollback" available in app `XJSRlvH-91ZtUsh0RPGvo` | ✓ | Cycle 29 §14.8; project CLAUDE.md |
| R2 | `git revert <hash> && git push origin main` triggers Dokploy redeploy via webhook | ✓ | `DEPLOY.md` Rollback section |
| R3 | DNS A flip is reversible (DNS owner can re-flip to legacy host) | ✓ in principle; depends on DNS owner TTL — should pre-shorten TTL 24 h before cutover | DNS owner playbook |
| R4 | Staging subdomain `miasanabriarealtor.trueidea.com` stays live during cutover as safety net | ✓ until 301 from staging → canonical is configured | Cycle 30 launch-blocker matrix row 21 |
| R5 | `NEXT_PUBLIC_SITE_URL` build-arg is reversible (revert Dokploy config + redeploy) | ✓ | `DEPLOY.md` Cutover section |
| R6 | Rollback decision tree: symptom → action → owner | ⚠️ — not yet drafted as standalone runbook; embedded in `DEPLOY.md` | Pre-cutover cycle should formalize |
| R7 | "Who has authority to call rollback" written down | ⚠️ — implicit Torrey; should be explicit pre-cutover | Pre-cutover cycle |

**Pre-cutover task:** formalize R6 + R7 into a `docs/ROLLBACK_RUNBOOK.md`. Out of scope for Cycle 30B.

## Minimum safe cutover criteria

This is the minimum bar to fire G10 (DNS cutover) without an exception:

1. G1, G2, G3, G4, G5, G6 all closed (Mia signoff + edits applied + DMCA designation final + Cato green + GHL wired + GA4/GTM wired).
2. `audit:all` exits 0 on local build with no new criticals.
3. `audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` ≥ 56 PASS · 0 FAIL · 0 ERROR.
4. `audit:legal` shows 0 FAIL and the DMCA `uscoFlag` row is PASS (not WARN).
5. `audit:no-fabrications` 0 hits.
6. Narrow secret-assignment scan on repo + `out/` returns no token-shaped values.
7. DNS TTL pre-shortened to ≤300s on `miasanabria.com` ≥24 h before cutover.
8. Mia has been explicitly notified of the cutover time window.
9. Rollback runbook (R6 + R7) finalized.
10. No active incidents on Hermes / Dokploy / Helos VPS.

## Honesty contract enforcement

Until G10 is closed, every doc and report must:

- Frame `https://miasanabriarealtor.trueidea.com/` as **staging / private review**.
- Frame `https://miasanabria.com` as **target final canonical**, not "live production."
- Frame `miasanabriarealtor.com` (legacy) as **Mia's existing Direct Axess host — do not touch**.
- Not claim production readiness.
- Not claim launch readiness without listing which gates are closed and which remain open.

Any doc that violates this in active doctrine (not cycle-dated historical artifact) is a launch-risk surface and should be banner-fixed. Cycle 30 fixed `CUTOVER_PACKET.md`, `MIA_IDEAL_PRODUCTION_STATE.md`, `NEXT_SESSION_TRIGGER.md`; Cycle 30B adds the banner to `ISA.md`.

## Recommended future mission (this lane)

After G10 closes, run a "Launch DoD Refresh" cycle that:
- Promotes G1–G9 from open to closed in this file
- Updates the active canonical doctrine across all docs (ISA Vision, MIA_IDEAL_PRODUCTION_STATE §11) — rewriting body, not just banners, since the doctrine is now permanently `miasanabria.com`
- Archives all "stale launch target" banners (they served their purpose pre-cutover)
- Writes a post-mortem of which gates slipped and why

## DoD for this lane (Cycle 30B)

- [x] Launch-gate sequence G1–G12 written
- [x] "Do not start before" list locked
- [x] Launch exception template provided
- [x] Rollback readiness checklist captured
- [x] Minimum safe cutover criteria locked
- [x] Honesty-contract enforcement rule recorded

**Lane A status:** closed for Cycle 30B scope. The next lane to use this is Cycle 31 (which gates on G1).
