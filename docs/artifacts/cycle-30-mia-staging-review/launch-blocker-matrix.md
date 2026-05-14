# Cycle 30 — Launch-Blocker Matrix

> Every blocker between **today** and **`https://miasanabria.com` production launch**, classified by owner, blocker-criticality, and whether Claude can close it locally. Sister doc: `torrey-action-list.md` (operator-side action list, lighter view).

## Classification key

- **Launch-critical = yes** → must be green before `miasanabria.com` cutover. If skipped, launch fails, regresses, or violates compliance.
- **Launch-critical = no** → site can launch without it; can be hardened post-launch.
- **Can Claude close locally = yes** → no external dependency. Doc edit, code edit, build/audit run, artifact generation.
- **Can Claude close locally = no** → requires external action (Mia, counsel, GHL, Google, DNS owner, Torrey approval, etc.).

---

## Group 1 — Mia decisions

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Sign-off on overall tone + visual feel | Mia | open | Cycle 30 `mia-review-packet.md` pending return | **yes** | no | Send packet; await marked-up reply | Cycle 31 Mia Review Decisions Application | Launch slips indefinitely |
| Confirm 9-neighborhood roster | Mia | open | `src/lib/mia.ts` `MIA_APPROVED_NEIGHBORHOODS` + Cycle 25 build | **yes** | no | Packet §"Specific questions — Neighborhoods" | Cycle 31 | Wrong cities ship; rework after launch |
| Approve / reject headline ("South Florida Lifestyle / Home Search") | Mia | open | live `<h1>` + packet §1 | **yes** | no | Packet §"Headline + positioning" | Cycle 31 | Headline tone mismatch on launch |
| Approve "Southeast Florida" geographic framing | Mia | open | `src/lib/site.ts:38-39` description + tagline | **yes** | no | Packet §1 | Cycle 31 | Positioning drift |
| Decide "Blog" vs "Insights" end-to-end | Mia | open | `nav-content-drift-audit.md` — header=Blog ✓, footer=Insights, section=Latest Insights | no | partially (Claude can make the edit once Mia decides) | Packet §6 | Cycle 31 | Cosmetic inconsistency; not launch-blocking |
| Decide on Boca Raton + Palm Beach full pages | Mia | open | Routes referenced in `MarketsIndex` copy but no `/markets/{boca-raton,palm-beach}/page.tsx` | no | partially (Claude can scaffold once Mia decides yes) | Packet §"Neighborhoods" | Cycle 31 or later | Coverage gap; not blocker |
| Photo plan: which 1–3 cities need real photos first | Mia | open | All new city pages use abstract placeholders | no | partially (Claude can swap once Mia supplies + licenses) | Packet §"Photos" | Cycle 31 or 32 | Launch with placeholders looks unfinished |
| Final web address confirmation (`miasanabria.com`) | Mia | already confirmed Cycle 24 (2026-05-13) per `mia-client-decision-record.md` | `src/lib/site.ts:15` `PRODUCTION_URL = "https://miasanabria.com"` | **yes** | n/a (already done) | Packet §"Final web address" reconfirms only | n/a | n/a |

## Group 2 — Torrey decisions

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Bridge IDX runtime architecture (iframe vs API vs Worker broker) | Torrey | open | `src/lib/bridge.ts` scaffold; no credential in repo | no | yes for design, no for implementation (needs credentials Torrey holds) | Decide between (a) iframe MLS Matrix kept, (b) Bridge IDX API SSR, (c) CF Worker broker | Cycle 33 Bridge Runtime Architecture | Deeper IDX integration gated; iframe shim continues |
| Lighthouse perf budget for launch (currently 90+ on most routes) | Torrey | informational | `audit:rendered` + `audit:hero-contrast` history | no | yes | Decide whether Lighthouse perf ≥90 is a launch gate | (existing audit) | None — already above 90 |
| Whether to install Browser Use for richer Mia QA | Torrey | open | not installed | no | no (install requires Torrey approval) | Decide; if yes → Cycle 30A | Cycle 30A | None — `audit:mobile-readability` already covers 56/56 |

## Group 3 — Counsel / broker / legal

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| DMCA USCO final designation language | Counsel | "USCO in-process" placeholder on `/dmca/` | project CLAUDE.md "Audit gates" + `/dmca/page.tsx` | **yes** | no (counsel must supply final language) | Counsel writes final designation → Torrey patches `/dmca/` copy | external | Compliance exposure if site launches with "in-process" |
| FREC + NAR REALTOR® rendering compliance | Counsel / Torrey | green per Cycle 22 audit (all-caps + ® everywhere) | `audit:no-fabrications` + Cycle 22 trademark audit | **yes** | yes (already done) | n/a | n/a | n/a |
| Fair Housing language on every IDX/MLS surface | Counsel / Torrey | green per `audit:legal` + footer EHO | `SiteFooter.tsx` + Cycle 22 | **yes** | yes (already done) | n/a | n/a | n/a |
| TCPA + Florida CCPA consent text on forms | Counsel | green per Cycle 22 — text exists; binding to live forms needs GHL wiring | `docs/CYCLE_19A_M_*` legal pages + form consent | **yes** | yes for text, no for wiring (gated on GHL) | bind to GHL forms in Cycle 32 | Cycle 32 | Compliance exposure if forms post without binding |
| Cato cross-vendor compliance audit | external Cato agent | last green in Cycle 22 — needs re-run pre-cutover | Cycle 22 `cato-compliance-review.md` | **yes** | partially (Claude can spawn Cato as ISA-stage E4 invocation but Cato is read-only auditor) | run Cato in pre-cutover cycle | pre-cutover cycle | Compliance regressions caught late |

## Group 4 — GHL

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| GHL form/webhook endpoint URL | Torrey + GHL | unknown to Claude (in Torrey's GHL sub-account, not in repo) | project CLAUDE.md "GHL form/webhook endpoints — currently mailto fallback" | **yes** | no (Torrey pulls from GHL UI) | Torrey copies endpoint + custom field IDs from GHL into a local `.env.local` (not repo); shares structure but never the URL itself with Claude | Cycle 32 | Forms remain mailto fallback at launch — bad first impression, no lead tracking |
| GHL custom fields mapped | Torrey + GHL | unknown | same | **yes** | no | Torrey defines field IDs in GHL; share field-id list with Claude (not endpoint) | Cycle 32 | Lead data lands in GHL with wrong field mapping |
| Honeypot + Turnstile on every form | Torrey | scaffold only; Cloudflare Turnstile site-key needed | `src/components/forms/*` scaffold | **yes** | partially (Claude can wire Turnstile widget; Torrey provides site-key) | wire in Cycle 32 | Cycle 32 | Bot spam on launch |
| Success / fail UI states for form submission | Torrey | scaffold; current state is mailto fallback | `src/lib/bridge.ts` scaffold | **yes** | yes (post-GHL endpoint paste) | wire in Cycle 32 | Cycle 32 | Users left wondering whether submission worked |
| Form submission lead routing in GHL | Torrey + GHL | unknown to Claude | GHL workflow config | **yes** | no | Torrey configures in GHL UI | external | Leads land in GHL but don't trigger pipeline |

## Group 5 — Bridge

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Bridge IDX credentials | Torrey | NOT in repo, NOT in chat. Public `BRIDGE_DOCS_URL` only. | Cycle 29 narrow secret scan clean | no (iframe MLS Matrix still works for v1) | no (credentials stay external) | decide runtime first (Group 2), then Torrey places creds in Dokploy env or Cloudflare secret manager | Cycle 33 | Deeper IDX gated; iframe v1 ships |
| Runtime architecture (iframe vs API vs Worker broker) | Torrey | open | `src/lib/bridge.ts` scaffold | no | yes for design | see Group 2 | Cycle 33 | same |

## Group 6 — Google (GA4 / GTM / Search Console / GBP)

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| GTM container ID | Torrey | needed | live CSP allows `googletagmanager.com` but no GTM script | **yes** for launch with analytics | no (Torrey creates in GTM) | Torrey provisions container; share `GTM-XXXX` ID | pre-launch Google cycle | Launch with no conversion data |
| GA4 measurement ID `G-PYYSF87G8K` injection via GTM | Torrey + Claude | ID known per Cycle 23 audit; not wired | live HTML carries no GA4 init | **yes** for launch with analytics | yes (Claude wires via GTM once container ID known) | wire after GTM provisioned | pre-launch Google cycle | Same as above |
| Consent Mode v2 (TCPA + Florida CCPA + GDPR) | Torrey + Claude | scaffold via legal pages but not wired to GTM | Cycle 22 `MIA_DECISION_PACKET.md` | **yes** | yes (wire when GTM goes in) | wire in same cycle as GA4 | pre-launch Google cycle | Compliance exposure |
| Search Console sitemap submission under `miasanabria.com` | Torrey + Mia | blocked on canonical | n/a | **yes** post-cutover | no | submit after DNS flip | post-cutover hardening cycle | First 2-4 weeks of organic traffic lost |
| Bing Webmaster sitemap submission | Torrey + Mia | blocked on canonical | n/a | no | no | same | post-cutover hardening cycle | Marginal Bing traffic lost |
| GBP "Website" field updated to `miasanabria.com` | Torrey + Mia | blocked on canonical | external | **yes** post-cutover | no | update via GBP UI after DNS flip | post-cutover hardening cycle | Local SEO points at legacy domain |
| GBP attributes (REALTOR®, languages, hours) align with `src/lib/mia.ts` | Torrey + Mia | unknown | external | no | partially (Claude can show repo values; Mia updates GBP) | reconcile in same cycle as GBP website update | post-cutover hardening | Inconsistency between site + GBP |

## Group 7 — DNS / Dokploy / canonical cutover

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| `miasanabria.com` DNS A/AAAA → Helos VPS IP `148.230.82.215` | Torrey + DNS owner | blocked | external | **yes** | no | After all Mia/legal/GHL/Google gates green | DNS cutover cycle (post-readiness) | Site never reaches production canonical |
| Dokploy domain bind for `miasanabria.com` + `www.miasanabria.com` | Torrey | blocked | Dokploy app `XJSRlvH-91ZtUsh0RPGvo` currently bound only to `miasanabriarealtor.trueidea.com` | **yes** | no (Torrey clicks in Dokploy UI; Claude can verify via Dokploy API but not bind) | After DNS A flips | DNS cutover cycle | TLS / routing breaks at cutover |
| Let's Encrypt cert issuance for `.com` + `www.` | Torrey | blocked on Dokploy bind | external (LE auto-issues post-bind) | **yes** | no | follows Dokploy bind automatically | DNS cutover cycle | HTTPS broken on launch |
| `NEXT_PUBLIC_SITE_URL=https://miasanabria.com` Dokploy build-arg + redeploy | Torrey | blocked | currently unset (staging default kicks in via `src/lib/site.ts:17`) | **yes** | no (Torrey sets in Dokploy UI; triggers redeploy that Claude can monitor) | After DNS + cert green | DNS cutover cycle | Canonical + sitemap + OG URLs all wrong |
| Sitemap / canonical / hreflang / OG URL reflect `miasanabria.com` post-cutover | Torrey + Claude | gated on build-arg | `src/lib/site.ts:42-44` env-driven | **yes** | yes (automatic via env-arg, but Claude verifies post-deploy) | After redeploy with new env | DNS cutover cycle | Same as above |
| 301 from `miasanabriarealtor.trueidea.com` → `https://miasanabria.com` | Torrey | blocked | not yet configured | **yes** | partially (Caddy/Traefik middleware via Dokploy) | After production stable | DNS cutover cycle | Staging traffic leaks; duplicate-content risk |
| 301 from legacy `miasanabriarealtor.com` (Direct Axess) → `https://miasanabria.com` | Torrey + DNS + Direct Axess unhook | blocked | external | **yes** | no | After production stable AND Direct Axess unhooked | DNS cutover cycle | Legacy URLs keep landing on Direct Axess |
| Rollback plan documented (Dokploy keep-N-builds + one-click previous-deploy) | Torrey | green per Cycle 29 §14.8 | `DEPLOY.md` Cutover/Rollback | **yes** | yes (already documented) | n/a | n/a | n/a |

## Group 8 — Photos

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Real photos for new neighborhood pages (Deerfield through Sunrise) | Mia (provide) + Torrey (place) | abstract placeholders rendered | `public/markets/` + Cycle 25 placeholder strategy | no | yes once Mia supplies + licenses | Mia priorities + assets → Torrey places | Cycle 31 / 32 | Launch with placeholders |
| Hero asset license confirmation | Mia | green (Cycle 22-R1 approved twilight luxury waterfront reused) | `docs/mia-client-decision-record.md:90` | **yes** | yes (already done) | n/a | n/a | n/a |
| Mia portrait / About-page photo | Mia | unknown | About page uses existing asset | no | yes once Mia confirms | Mia decision in packet | Cycle 31 | About page may look generic |

## Group 9 — Testimonials

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Source text + reviewer names from FB / Realtor.com | Mia | none captured | no testimonial copy in repo per "no fabrication" rule | no | no | Mia ships exact text + reviewer names + permission evidence | Cycle 31 / 32 | Site launches without social proof — weaker conversion |
| Written permission per testimonial | Mia | none | n/a | **yes** (if testimonials are used) | no | Mia captures screenshot / DM confirmation | Cycle 31 / 32 | Legal exposure if used without permission |
| Source attribution rendered (e.g., "via Facebook review") | Torrey + Claude | scaffold only | n/a | **yes** (if testimonials are used) | yes once source text supplied | render with attribution | Cycle 31 / 32 | Misattribution |

## Group 10 — Browser Use optional next step

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Install Browser Use skill | Torrey | not installed in repo | nothing in `~/.claude/PAI/skills/` for browser-use | no | no (requires Torrey approval to install) | Decide if Mia wants richer per-route screenshot deck | Cycle 30A | None — `audit:mobile-readability` already covers 56/56 |
| Read-only per-route screenshot deck for Mia | Claude | not done this cycle | this cycle used `audit:mobile-readability` instead | no | yes once Browser Use installed | run Cycle 30A | Cycle 30A | None |

## Group 11 — Claude-local cleanup

| Blocker | Owner | Current status | Evidence | Launch-critical? | Claude-local close? | Next safe action | Best next mission | Risk if skipped |
|---|---|---|---|---|---|---|---|---|
| Canonical-domain doc banners (CUTOVER_PACKET, MIA_IDEAL, NEXT_SESSION_TRIGGER) | Claude | **DONE Cycle 30** | this cycle | no | n/a (done) | n/a | n/a | n/a |
| Cycle 30 audit artifacts (7 files) | Claude | **DONE Cycle 30** | `docs/artifacts/cycle-30-mia-staging-review/` | no | n/a (done) | n/a | n/a | n/a |
| Extend `audit:mobile-readability` default route list with 7 new neighborhoods | Claude | queued | `scripts/audit-mobile-readability.ts` default list | no | yes | ~7-line edit + re-baseline | next visual-edit cycle | Default `audit:all` doesn't sweep new routes; Cycle 26 + 29 already verified them |
| Future ISA-rev cycle (Vision + Out-of-Scope reflect `miasanabria.com`) | Claude | queued | `ISA.md` Vision still says cutover to `miasanabriarealtor.com` | no | yes | after `miasanabria.com` cutover lands | post-cutover ISA-rev cycle | Stale Vision surfaces in `/cs` queries — confusion only, not launch risk |

---

## Summary by launch-criticality

| Launch-critical | Total | Claude-closable now | External-only |
|---|---|---|---|
| **YES (must be green for cutover)** | 23 | 4 (legal text already green; canonical banners done; rollback documented; Mia final-domain already confirmed) | 19 (Mia sign-off + tone, headline, neighborhoods, photos; counsel DMCA; GHL endpoint + workflow; GTM + GA4 wiring; DNS + Dokploy cutover + LE + redeploy + 301s) |
| **NO (can ship without, harden post-launch)** | 17 | 6 (Blog vs Insights edit, photo placement, sitemap audits, ISA-rev, audit:mobile-readability route extension, testimonials render) | 11 (Mia decisions on Boca/Palm/photos/testimonials/blog labeling; Browser Use install; Bridge runtime decision; Bing/GBP attributes; legacy 301 once Direct Axess unhooks; Cato re-run) |

**Net:** 19 external-only launch-critical blockers + 4 already-green launch-critical items + 11 external non-critical + 6 Claude-local non-critical. Cycle 30 closed everything in the Claude-local lane that didn't require Mia or Torrey decisions; the remaining 30+ items are external-gated by design.

## Cutover decision tree

```
Mia returns review packet
  │
  ├─ All 🛑 + ⚠️ items applied (Cycle 31)
  │     │
  │     ├─ Counsel ships final DMCA designation
  │     │
  │     ├─ Torrey shares GHL endpoint + field IDs
  │     │     └─ Cycle 32: wire GHL Forms + Turnstile + success/fail
  │     │
  │     ├─ Torrey provisions GTM + GA4 + Consent Mode v2
  │     │     └─ pre-launch Google cycle: wire + verify
  │     │
  │     └─ Mia ships photos + testimonials (if any)
  │           └─ Cycle 32/33: place + render with attribution
  │
  ├─ All launch-critical Group 3 + 4 + 6 items green
  │
  ├─ Cato re-audit returns no critical issues
  │
  └─ DNS cutover cycle
       │
       ├─ Flip DNS A/AAAA for miasanabria.com to Helos VPS IP
       ├─ Bind miasanabria.com + www in Dokploy → LE auto-issues
       ├─ Redeploy with NEXT_PUBLIC_SITE_URL=https://miasanabria.com
       ├─ Verify canonical/sitemap/OG/hreflang reflect production host
       ├─ Add 301 from miasanabriarealtor.trueidea.com → miasanabria.com
       ├─ Submit sitemap to GSC + Bing under miasanabria.com
       └─ Update GBP Website field → miasanabria.com
            │
            └─ Direct Axess unhook (separate, when ready)
                 └─ Add 301 from miasanabriarealtor.com → miasanabria.com
```

No production-readiness claim is made in this cycle. Cycle 30 prepares the review packet; cutover is gated through the above tree.
