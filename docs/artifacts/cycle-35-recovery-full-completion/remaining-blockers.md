# Remaining Blockers — Cycle 35B

date: 2026-05-14
purpose: Classify every gap that was NOT closed this cycle, by owner. AI-closeable items have already been closed; only genuinely-external blockers remain.

## Mia (principal client)

| Gap | Why blocked | Best minimum-friction path |
|---|---|---|
| DBPR-verified license-number written attestation | Site components gate display on a separate verified flag; `mia.ts:54` carries the number as `unverified.licenseNumber` until Mia confirms in writing. | One Mia text/email: "Yes, SL3405877 is correct — display permitted." |
| Licensed photographic heroes for the 7 Broward cities | Brand-tone editorial cards are working at staging; Mia's licensed photos would lift visual depth for Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise. | Mia uploads 7 hero JPGs (any aspect; site auto-crops via Tailwind `object-position`) plus a one-line license attestation. |
| Boca Raton + Delray Beach retain/redirect/deprecate decision | The two Palm Beach County reference markets are live but outside Mia's canonical Broward working set. | Mia confirms one of three: retain, redirect to a Broward neighbor, or deprecate (302 to `/markets/`). |
| Designation list publication | `mia.ts:55` lists `["PSA","RENE","CDPE","ABR","SFR","AHWD"]` in the `unverified` block; site won't surface them until verified-attestation flag flips. | Same Mia attestation as license number — one approval covers both. |

## Torrey (operator)

| Gap | Why blocked | Best minimum-friction path |
|---|---|---|
| Bridge real-feed activation | Requires API-key refresh/rotation + Bridge dataset switch; explicitly forbidden in this session. | Run Cycle 33C with Torrey-approved Bridge ops; not a Mia-website cycle. |
| GHL form-endpoint wiring | Currently mailto fallback (per `CLAUDE.md`). Live wiring requires GHL endpoint URL + custom fields + honeypot + Turnstile. | Torrey provisions the endpoint in GHL, supplies the URL/Turnstile site key, then Cycle 36 wires it. |
| Production cutover `miasanabriarealtor.com` | DNS work + Dokploy app rebinding; explicit out-of-scope per session rules. | Cycle 37 (Cutover Window) — DNS swap + production rollback plan in place + Mia visual sign-off. |
| Token rotation / Bridge dataset move | Explicit out-of-scope this session. | Coordinated Cycle 33C with Bridge support. |

## Counsel / broker / Cato

| Gap | Why blocked | Best minimum-friction path |
|---|---|---|
| `/dmca/` USCO + in-process language | `audit:legal` raises a WARN; acceptable for staging, BLOCKED for production cutover per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`. | Counsel-approved rewrite (or accept the existing language) before production cutover. |
| Broker (LPT Realty) sign-off on the marketing claims | Standard supervised-broker review for a REALTOR® website. | LPT Realty broker reviews the staging URL before production cutover. |
| Cato cross-vendor audit on E4/E5 ISA | Per `~/.claude/PAI/USER/PROJECTS/PROJECTS.md`, Cato runs at the end of VERIFY on E4/E5 ISAs. Cycle 35B is E4; a Cato pass would surface Anthropic-family blind spots. | Run Cato against the staging URL + this cycle's artifacts in a follow-on. |

## Bridge / GHL / Google / DNS

| Gap | Why blocked | Best minimum-friction path |
|---|---|---|
| Bridge MLS feed live (real listings, not demo) | Bridge dataset activation + token rotation by Bridge support. | Coordinated Cycle 33C. |
| GHL form endpoint + custom fields + honeypot + Turnstile + success/fail UI | GHL provisioning + endpoint URL in Torrey's GHL sub-account. | Cycle 36. |
| Google Analytics 4 ID, GTM container, Search Console verification, Google Business Profile | Google identity moves + Torrey approval. | Cycle 36. |
| DNS swap miasanabriarealtor.trueidea.com → miasanabriarealtor.com | DNS A/AAAA/CNAME records at the registrar, plus Dokploy rebinding. | Cycle 37 (Cutover Window). |

## AI (still-closeable in future cycles, but not in 35B scope)

| Gap | Why blocked this cycle | Best minimum-friction path |
|---|---|---|
| Inline `compareTo` widget on each neighborhood page (currently rendered as comparisonContext prose only on Fort Lauderdale) | Out of 35B scope; would be a UX enhancement, not a defect. | A future cycle could lift `comparisonContext` rendering to all featured neighborhoods. |
| Schema.org `Service` + `Offer` JSON-LD for the buyer/seller services (currently only `RealEstateAgent` is emitted) | Same — UX enhancement, not a defect. | Future cycle. |
| Image lazy-loading + AVIF generation pipeline | Existing JPGs are acceptable; AVIF would reduce bytes for the photographic heroes. | Future cycle. |
| Migrating the legacy `MARKETS` entries (12 legacy slugs not on Mia's canonical working set) into a `cluster: "legacy"` taxonomy | Out of 35B scope; would require Mia's retain/redirect/deprecate decision per slug. | Cycle 35C, gated on Mia decisions. |

## Smallest next mission (repeated from `claim-vs-reality.md`)

Mia provides:

1. DBPR-verified attestation (license + designations).
2. Licensed photography (or explicit "keep cards") for the 7 Broward cities.
3. Retain/redirect/deprecate decision on boca-raton + delray-beach.

Cycle 35C closes those in a single follow-on commit.

Cycle 36 wires GHL forms, GA4, GTM, Search Console, Google Business Profile.

Cycle 37 cuts production over DNS.

That's the runway to a customer-visible production `miasanabriarealtor.com`.
