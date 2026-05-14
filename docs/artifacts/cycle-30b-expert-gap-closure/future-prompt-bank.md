# Cycle 30B — Future Mission Prompt Bank

> Paste-ready future Claude prompts for every gated mission. Each prompt is self-contained: paste it into a fresh raw Claude Code CLI session in the project working directory and it works without prior conversation context.
>
> Every prompt carries the same invariants: working directory, expected state, non-negotiables, no `.env` reads unless explicitly necessary and value-redacted, no secrets printed, no push/deploy unless specifically authorized, claim-vs-reality table, validation gates, commit policy, completion standard, no production-readiness claim unless DoD is actually met.

## Index

| Cycle | Title | Gate(s) it closes | Owner inputs required first |
|---|---|---|---|
| 30A | Browser Use Skill Install + Read-Only Staging QA | (optional) richer visual QA | Torrey decision to install |
| 31 | Mia Review Decisions Application | G1 → G2 | Mia returns marked-up review packet |
| 31A | Mia Feedback Intake + Decision Record Update | feeder for G2 | Mia replies in any form |
| 32 | GHL Forms + Lead Routing | G5 | Torrey provides GHL endpoint + field/workflow IDs + Turnstile keys |
| 33 | Bridge Runtime Architecture | Bridge launch-decision | Torrey decides runtime; credentials in Dokploy/CF secrets externally |
| 34 | Google/GTM/Consent/Search Console/GBP Setup | G6 | Torrey provisions GTM container |
| 35 | Legal/CATO Closure | G3 + G4 | Counsel-final DMCA designation text |
| 36 | DNS/Dokploy Canonical Cutover to miasanabria.com | G10 | G1–G9 closed or LE exceptions recorded |
| 37 | Post-Cutover Smoke Test + Rollback Watch | G11 + G12 | Cycle 36 closed |
| X | Photos/Testimonials Application | G7 + G8 | Mia provides photos + license + testimonial exact text + permission |

---

## Cycle 30A — Browser Use Skill Install + Read-Only Staging QA

```
# BSS / MIA SITE — CYCLE 30A BROWSER USE SKILL INSTALL + READ-ONLY STAGING QA

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Install Browser Use as a PAI skill and run a read-only per-route screenshot deck against TrueIdea staging for the Mia review companion. This is install + read-only QA. Not a write mission.

## Non-negotiables
- No .env reads. No secrets.
- No form submissions on live staging.
- No clicks that fire payment / signup / outbound contact flows.
- Default to incognito; cookies cleared between sessions.
- All Browser Use sessions logged + sanitized of any credential material.
- One local commit max. No push unless explicitly authorized.
- No production-readiness claim.

## Phase 0 — Preflight
- Verify HEAD is in a clean state (git status --short empty; ahead 0; behind 0).
- Verify `~/.claude/PAI/skills/BrowserUse/` does not already exist (or document the installed version).
- Verify Browser Use Python package can install via `pip install --user browser-use` (DO NOT install yet — just verify pypi reachable).

## Phase 1 — Install
- Set up a project-managed venv at `.venv-browser-use/` (NOT global).
- Install `browser-use` + `playwright`.
- Run `playwright install chromium`.
- Register skill spec at `~/.claude/PAI/skills/BrowserUse/SKILL.md` per PAI skill format.

## Phase 2 — Read-only sweep
- Capture all 16 reviewed routes from Cycle 30 visual-qa.md at iphone-15 + ipad-portrait + 1440p desktop.
- Save under `docs/artifacts/cycle-30A-browser-use-install/captures/`.
- No form submission, no outbound to non-trueidea.com host.

## Phase 3 — Verify safety policy
- Confirm session logs are sanitized.
- Confirm no .env contents echoed.
- Confirm no GHL/Google/Bridge endpoints contacted.

## Phase 4 — Validation gates
- bun run typecheck, lint, build, audit:qa-gate (should not be affected by Browser Use install).

## Phase 5 — Commit
One local commit: feat(MIA-SITE-CYCLE-30A): install Browser Use skill + capture read-only staging deck

## Completion standard
- Browser Use installed, scoped to project venv
- 48+ captures saved under docs/artifacts/cycle-30A-*/
- No live writes
- No secrets exposed
- Optional: recorded click-through video referenced in Mia review-packet send addendum

Do not claim production readiness.
```

---

## Cycle 31 — Mia Review Decisions Application

```
# BSS / MIA SITE — CYCLE 31 MIA REVIEW DECISIONS APPLICATION

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Walk Mia's marked-up review-packet response. Tag each item with bucket. Apply 🛑 + ⚠️ items as code/copy edits. Defer ✅ + 📅 with rationale. Stage on TrueIdea (no production cutover).

## Pre-requisite
Mia's response is captured in `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions" per the `mia-feedback-intake-template.md` schema. If not, stop and do not start.

## Non-negotiables
- No new claims (audit:no-fabrications stays 0)
- No school/safety/family-friendly/protected-class/ranking language
- No fabricated testimonials
- No GHL/Google/Bridge/DNS/Dokploy live writes
- No production canonical change
- No .env reads
- One local commit; push only on Torrey approval

## Phase 0 — Preflight
- Verify HEAD = origin/main, clean working tree
- Verify Mia's decision record file exists with at least one MIA-DEC-NNNN row
- Verify staging is still current (cache-busted live probe)

## Phase 1 — Decision walk
For each MIA-DEC-NNNN row:
- Read action_class
- If claude_local_closable == yes AND bucket in (must-change, prefer-change): apply
- If bucket == okay-for-v1: defer with note
- If bucket == post-launch: defer with note
- If clarification-needed: stop and document the open question; do not guess

## Phase 2 — Apply
- copy-edit: edit the named file with exact replacement quote from Mia
- nav-label: edit `src/lib/site.ts` NAV/FOOTER_NAV/section-eyebrow as Mia decided
- image-swap: only if Mia supplied the asset + license (Lane K rules); otherwise defer
- testimonial-add: only with exact source text + permission evidence (Lane K rules)
- route-add: only if Mia explicitly authorized AND it's not /neighborhoods/ or /blog/ slug migration
- data-add / data-remove: per the named file in src/lib/

## Phase 3 — Validate
- bun run typecheck, lint, build
- bun run audit:qa-gate (critical=0 stays the gate)
- bun run audit:no-fabrications (0 hits)
- bun run audit:legal (no regression)
- bun run audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com

## Phase 4 — Stage deploy (optional)
If Torrey explicitly authorizes a Dokploy redeploy:
- bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="<phrase from updated copy>"

## Phase 5 — Commit
One local commit: feat(MIA-SITE-CYCLE-31): apply Mia review decisions <N> closed / <M> deferred

## Completion standard
- Every MIA-DEC-NNNN row has status: closed | deferred | clarification-needed
- All audits green
- No production-readiness claim
- Hand back to Mia for final sign-off OR proceed to Cycle 32 if signed off

Do not claim production readiness.
```

---

## Cycle 31A — Mia Feedback Intake + Decision Record Update

```
# BSS / MIA SITE — CYCLE 31A MIA FEEDBACK INTAKE

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Mia replied in some format (text, voice note, Telegram, marked-up PDF). Convert her response into MIA-DEC-NNNN rows per `docs/artifacts/cycle-30b-expert-gap-closure/mia-feedback-intake-template.md`. Append to `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions".

## Inputs Torrey provides in the prompt
- Mia's raw response text (paraphrase OK; flag `paraphrase: true`)
- Source: telegram | sms | email | voice_note | call_summary
- Saved evidence path (off-repo screenshot or text dump)

## Non-negotiables
- No invented decisions
- No "implicit acceptance" rows
- One local commit
- No push without authorization
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Mia's response captured in the prompt or pointed to via off-repo path

## Phase 1 — Decompose
- Split Mia's response into atomic decisions
- For each, fill the MIA-DEC-NNNN row schema (id, surface, quote, paraphrase flag, bucket, action_class, target_file, claude_local_closable, external_dependency, notes)

## Phase 2 — Write
- Append rows to `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions"
- Update §header with received_at + via + canonical-confirmed status + roster-confirmed status

## Phase 3 — Validate
- bun run typecheck, lint (no source changes expected)
- Grep the appended block for any malformed YAML

## Phase 4 — Commit
One local commit: docs(MIA-SITE-CYCLE-31A): capture Mia review decisions <N> rows from <source>

## Completion standard
- N MIA-DEC-NNNN rows captured
- Header completed
- Cycle 31 paste-ready for application

Do not claim production readiness.
```

---

## Cycle 32 — GHL Forms + Lead Routing

```
# BSS / MIA SITE — CYCLE 32 GHL FORMS + LEAD ROUTING

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Wire site forms to Mia's GHL sub-account. No live production writes until staging end-to-end is green. Honeypot + Turnstile + success/fail UI + rate limit.

## Pre-requisite
Torrey provides (in terminal/env paste, NEVER chat):
- GHL Inbound Webhook URL (treat as semi-secret)
- GHL custom field IDs (14 fields per ghl-forms-readiness-dossier.md)
- GHL workflow IDs (7 form types)
- Cloudflare Turnstile site key (public) + secret key (worker-only)
- Runtime choice: G-A (CF Worker / CF Pages Function — recommended) or G-B (Next Route Handler with non-static build)

## Non-negotiables
- No webhook URL pasted into chat
- No custom field IDs pasted into chat
- No workflow IDs pasted into chat
- No live production lead created until staging test workflow is verified
- No .env values printed
- No production canonical change
- One local commit max
- No push without authorization
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Verify cycle 30B `ghl-forms-readiness-dossier.md` exists
- Verify Cycle 31 Mia decisions on form copy applied first

## Phase 1 — Runtime
- G-A: scaffold a CF Worker (or CF Pages Function) under `worker/` at the repo root with a single `/api/lead` route
- G-B: switch `next.config.ts` from static export to standalone; add `src/app/api/lead/route.ts`

## Phase 2 — Wire forms
- Replace `<form action="mailto:...">` in `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`, and CTA components with POST to `/api/lead`
- Add Turnstile widget to each form
- Add honeypot field

## Phase 3 — Worker logic
- Validate Turnstile token via siteverify
- Validate honeypot (silent 200 if filled)
- Rate-limit per IP
- Sanitize user-provided fields
- POST to GHL Inbound Webhook with field mapping per form-type → workflow ID
- Return 200/4xx for the frontend to render success/fail UI

## Phase 4 — Test
- Local: mock-server POST verifies field mapping
- Staging end-to-end: Torrey provides TEST workflow ID; submit one test from staging; verify lead lands in test workflow only
- Honeypot test: simulate bot submission, expect silent 200, no GHL lead
- Turnstile failure: expect 401/403, graceful UI fallback
- Final production end-to-end: Torrey submits one "TEST — please ignore" with real workflow ID

## Phase 5 — Validate
- bun run typecheck, lint, build
- audit:qa-gate, audit:legal (consent text intact above submit), audit:no-fabrications
- Narrow secret scan on repo + out/ + worker/: no token-shaped values

## Phase 6 — Commit
One local commit: feat(MIA-SITE-CYCLE-32): wire GHL Inbound Webhook + Turnstile + honeypot

## Completion standard
- All 7 form types post to /api/lead → GHL workflow
- Thank-you redirects firing
- Honeypot + Turnstile + rate-limit verified
- audit:no-fabrications + audit:legal still green
- No webhook URL, field IDs, or workflow IDs in repo or chat
- Rollback path: env var unset → 503 → mailto fallback

Do not claim production readiness.
```

---

## Cycle 33 — Bridge Runtime Architecture

```
# BSS / MIA SITE — CYCLE 33 BRIDGE RUNTIME ARCHITECTURE

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Implement the Bridge IDX runtime per the architecture chosen by Torrey + Mia + (counsel for IDX disclaimer). Server token NEVER ships client-side under any option.

## Pre-requisite
- Torrey records the runtime choice in `docs/mia-client-decision-record.md` §"Bridge runtime decision" (Option A: CF Worker proxy / Option B: Next.js Route Handler with non-static build / Option C: iframe-only v1 with LE-NNNN exception / Option D: browser token if Bridge docs authorize)
- Credentials placed in Dokploy env "Secret" or CF Worker secret store, never in repo or chat

## Non-negotiables
- BRIDGE_SECRET_ID, BRIDGE_SERVER_TOKEN, BRIDGE_CLIENT_ID stay server-only
- BRIDGE_INTEGRATION_LIVE flips to true only when all DoD items pass
- SanitizedListing is the only shape across the proxy boundary
- IDX disclaimer + brokerage attribution rendered alongside listings
- No production canonical change
- One local commit max
- No push without authorization
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Cycle 30B `bridge-runtime-readiness-dossier.md` exists
- Runtime choice recorded
- Credentials externally placed (verify by env-var name only)

## Phase 1 — Implement runtime per choice
- Option A: CF Worker at /api/bridge/* with secret store
- Option B: Next.js Route Handler with Dokploy build mode change
- Option C: stay on MLS Matrix iframe; record LE-NNNN; skip Phases 2-4 except validation
- Option D: NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN only

## Phase 2 — Sanitization boundary
- Proxy returns only SanitizedListing[] per src/lib/bridge.ts
- Reject any response field outside the schema

## Phase 3 — Wire frontend
- Hero search posts to /api/bridge/search
- Property detail pages SSR or fetch via proxy
- Listing cards render SanitizedListing

## Phase 4 — Compliance
- IDX disclaimer (SEF MLS reciprocity)
- Brokerage attribution (LPT Realty)
- Anti-scraping: rate limit + no archival cache > IDX-allowed TTL
- Counsel sign-off on disclaimer placement

## Phase 5 — Validate
- bun run typecheck, lint, build
- audit:qa-gate, audit:legal, audit:no-fabrications
- Narrow secret scan on repo + out/: no BRIDGE_* token values

## Phase 6 — Commit
One local commit: feat(MIA-SITE-CYCLE-33): wire Bridge IDX via <Option A/B/C/D> with sanitized proxy

## Completion standard
- BRIDGE_INTEGRATION_LIVE = true (if Option A/B/D)
- No BRIDGE_* values in repo, chat, screenshots, build logs
- Sanitized listings render with disclaimer
- audit:no-fabrications still 0 hits
- Rollback: BRIDGE_INTEGRATION_LIVE = false → fallback to iframe (Option C)

Do not claim production readiness.
```

---

## Cycle 34 — Google/GTM/Consent/Search Console/GBP Setup

```
# BSS / MIA SITE — CYCLE 34 GOOGLE / GTM / CONSENT / SEARCH CONSOLE / GBP

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Wire GTM + GA4 (G-PYYSF87G8K) + Consent Mode v2 default-deny. Search Console / Bing / GBP submission gated on DNS cutover (Cycle 37 fires those).

## Pre-requisite
Torrey provides (env or terminal, NEVER chat):
- GTM container ID (GTM-XXXXXXX)
- GA4 measurement ID confirmed: G-PYYSF87G8K (or replacement if changed)

## Non-negotiables
- No GA4/GTM container created via Google API (Torrey provisions via UI)
- Default-deny analytics_storage until user consent
- Cookies, scrolling, outbound events fire post-consent only
- No PII in GA4 events
- One local commit max; no push without auth
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Cycle 30B google-measurement-readiness-dossier exists
- Torrey confirms GTM container exists in tagmanager.google.com

## Phase 1 — Install GTM snippet
- Edit `src/app/layout.tsx`: add GTM snippet (head + body parts) using the provided GTM-XXXXXXX
- Add CSP allowance for googletagmanager.com (verify already present per Cycle 23)

## Phase 2 — Consent Mode v2 default-deny
- Build src/components/consent/ConsentBanner.tsx with Accept all / Reject all / Customize
- Banner posts dataLayer events for consent grant/deny
- localStorage key consent.mia.v1 with 13-month expiry

## Phase 3 — GTM tags (Torrey configures in tagmanager.google.com UI)
- Consent Initialization trigger
- GA4 Config tag firing post-consent
- form_submit / cta_click / phone_click / email_click event tags
- (Do NOT publish GTM container until staging test verified)

## Phase 4 — Validate
- bun run typecheck, lint, build
- audit:qa-gate, audit:legal (privacy/consent copy intact)
- Manually verify: visit staging in incognito → consent banner shows → reject → no GA4 hit → accept → GA4 Realtime fires within 30s

## Phase 5 — Commit
One local commit: feat(MIA-SITE-CYCLE-34): wire GTM + GA4 + Consent Mode v2 default-deny

## Completion standard
- GTM snippet in head + body
- Consent banner ships
- One Realtime test pageview verified
- audit:legal green
- No GA4 ID hardcoded outside config constant
- Rollback: comment out GTM script → no Google traffic

GSC + Bing + GBP submission deferred to post-cutover Cycle 37.

Do not claim production readiness.
```

---

## Cycle 35 — Legal/CATO Closure

```
# BSS / MIA SITE — CYCLE 35 LEGAL / CATO CLOSURE

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Close G3 (DMCA USCO designation finalized) and G4 (Cato cross-vendor re-audit green). No legal advice produced — counsel-supplied text only.

## Pre-requisite
- Counsel delivers final DMCA USCO designation text + contact details (email saved off-repo)
- Counsel sign-off on TCPA + F.S. 475.278 + IDX disclaimer + testimonial attribution rules

## Non-negotiables
- No legal advice from Claude
- No claim-altering copy without counsel evidence
- Cato runs read-only; findings flow into corrective sub-mission if needed
- One local commit max; no push without auth
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Cycle 30B legal-cato-readiness-dossier exists
- Counsel evidence path noted in commit message (off-repo)

## Phase 1 — DMCA finalization
- Replace "in-process" language on `src/app/dmca/page.tsx` with counsel-supplied final text
- Verify `audit:legal` legal.dmca.uscoFlag flips WARN → PASS

## Phase 2 — TCPA + F.S. 475.278 + IDX disclaimer + testimonials reconcile
- Walk Cycle 30B legal-cato-readiness-dossier counsel-question table
- Apply each counsel decision as a `src/app/<page>/page.tsx` edit or as an LE-LEGAL-NNNN exception

## Phase 3 — Cato re-audit
- Spawn Cato subagent on E4/E5 mission with 10-axis BSS compliance template
- Cato returns structured JSON to docs/artifacts/cycle-35-*/cato-compliance-review.json
- Archive .md rendered version

## Phase 4 — Corrective sub-cycle (if Cato finds anything)
- Open findings classified: launch-critical / non-critical
- Close launch-critical OR record LE exceptions
- Non-critical findings → defer to post-launch

## Phase 5 — Validate
- bun run typecheck, lint, build
- audit:legal (no WARN on uscoFlag), audit:qa-gate, audit:no-fabrications
- All Cato critical findings closed or excepted

## Phase 6 — Commit
One local commit: feat(MIA-SITE-CYCLE-35): close G3 DMCA + G4 Cato re-audit (<N> findings closed / <M> excepted)

## Completion standard
- audit:legal 100% PASS
- Cato re-audit JSON archived, 0 critical findings open
- All counsel decisions either applied or recorded as LE exception
- Broker (LPT) sign-off captured off-repo

Do not claim production readiness.
```

---

## Cycle 36 — DNS/Dokploy Canonical Cutover to miasanabria.com

```
# BSS / MIA SITE — CYCLE 36 DNS / DOKPLOY CANONICAL CUTOVER

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Flip the live canonical from staging to https://miasanabria.com. This is the production cutover.

## Pre-requisite
ALL of the following gates closed (or LE exceptions recorded):
- G1 Mia signed off
- G2 Cycle 31 decisions applied
- G3 DMCA designation final
- G4 Cato re-audit green
- G5 GHL forms wired (Cycle 32)
- G6 GA4/GTM wired (Cycle 34)
- (G7 + G8 photos + testimonials = optional with LE exception)

Plus:
- DNS TTL on miasanabria.com pre-shortened to ≤ 300s ≥ 24 hours ago
- Mia notified of cutover time window
- Rollback runbook finalized (`docs/ROLLBACK_RUNBOOK.md`)
- No active incidents

## Non-negotiables
- Pre-cutover dry run via /etc/hosts override before public DNS flip
- Server token / IDX credentials never in repo
- ETag flip verified post-deploy with cache-buster
- One local commit max; push allowed only after dry-run green
- No production-readiness CLAIM until G10 verifies live canonical

## Phase 0 — Preflight
- All gates green or LE exception JSON files exist
- HEAD clean

## Phase 1 — Dokploy domain bind
- UI: app XJSRlvH-91ZtUsh0RPGvo → Domains
- Add miasanabria.com (HTTPS enabled)
- Add www.miasanabria.com (HTTPS enabled)
- Wait for LE cert issuance (Traefik logs)

## Phase 2 — Dry run via /etc/hosts
- Local /etc/hosts override: miasanabria.com → 148.230.82.215
- Browse https://miasanabria.com via override
- Verify canonical link, sitemap host, OG URLs all on miasanabria.com

## Phase 3 — Build with new env
- Set NEXT_PUBLIC_SITE_URL=https://miasanabria.com in Dokploy build args
- Trigger redeploy
- Verify build picks up env

## Phase 4 — DNS flip
- DNS owner flips miasanabria.com A → 148.230.82.215
- Wait for TTL propagation (≤ 300s)
- Cache-busted probe: curl -ksI https://miasanabria.com/?cb=$(node -e ...)
- ETag flipped + last-modified fresh

## Phase 5 — Cutover verification
- All 21 routes return 200 via mobile-readability default sweep
- audit:legal still PASS
- audit:no-fabrications 0 hits
- Live HTML: <link rel="canonical" href="https://miasanabria.com/">, no noindex,nofollow

## Phase 6 — Staging 301
- Add Caddy redir: miasanabriarealtor.trueidea.com → https://miasanabria.com (matching path)
- Redeploy
- Verify curl -I against staging returns 301

## Phase 7 — Commit + tag
One local commit: feat(MIA-SITE-CYCLE-36): production cutover to miasanabria.com
Tag: v1.0.0-launch

Push only when verified green.

## Completion standard
- https://miasanabria.com/ returns 200 with correct canonical
- All routes 200 under new host
- 301 from staging configured
- Cycle 37 smoke test scheduled

Production-readiness claim now allowed IFF all gates green and verification probes all pass.
```

---

## Cycle 37 — Post-Cutover Smoke Test + Rollback Watch

```
# BSS / MIA SITE — CYCLE 37 POST-CUTOVER SMOKE TEST + ROLLBACK WATCH

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
24-48 hour watch after cutover. Smoke test all routes against https://miasanabria.com. Submit GSC + Bing sitemap. Update GBP. Add legacy 301 once Direct Axess unhooks.

## Pre-requisite
Cycle 36 cutover committed + tagged + verified.

## Non-negotiables
- No GHL / Bridge / Google API live writes that weren't part of Cycle 34
- GSC + Bing + GBP updates via UI by Torrey + Mia, not via API
- No production-readiness claim erasure

## Phase 0 — Preflight
- HEAD = tag v1.0.0-launch
- Cycle 36 cutover commit verified

## Phase 1 — Smoke test (T+30min)
- curl all 21 default routes; expect 200
- audit:mobile-readability --base=https://miasanabria.com
- audit:legal, audit:no-fabrications, audit:qa-gate
- Lighthouse on Home + Markets hub + 1 neighborhood

## Phase 2 — GSC + Bing (T+2h, requires DNS TXT for verification)
- DNS owner adds GSC TXT verification record
- Add property in GSC, verify
- Submit https://miasanabria.com/sitemap.xml
- Same for Bing Webmaster
- Inspect top 10 URLs

## Phase 3 — GBP (T+24h, Mia performs)
- Mia updates GBP "Website" to https://miasanabria.com
- Confirm category, hours, attributes
- First GBP Post: launch announcement

## Phase 4 — Direct Axess unhook (when ready, may be days later)
- Mia/Torrey/DNS owner unhooks miasanabriarealtor.com from Direct Axess
- Repoint A record to 148.230.82.215
- Add domain to Dokploy
- Add Caddy 301: miasanabriarealtor.com/* → https://miasanabria.com/* (matching path)
- Klein Morgan agent page removal request in GSC URL Removal tool

## Phase 5 — Watch (T+24-48h)
- Monitor uptime
- Monitor GA4 Realtime
- Monitor any GHL incoming-lead errors
- Document any incidents

## Phase 6 — Validate + commit
- audit:all exits 0 under new host
- Commit: docs(MIA-SITE-CYCLE-37): post-cutover smoke + GSC/Bing/GBP/legacy 301

## Completion standard
- 24+ hours uptime green
- GSC + Bing both verified + sitemap submitted
- GBP synced
- Legacy 301 in place (if Direct Axess unhooked)
- No critical incidents

Production-readiness claim retained.
```

---

## Cycle X — Photos/Testimonials Application

```
# BSS / MIA SITE — CYCLE X PHOTOS / TESTIMONIALS APPLICATION

You are Claude Code CLI operating in the Mia Sanabria website repo.

Working directory: /home/torrey/code/mia-sanabria-website

## Mission
Apply photos Mia provided + testimonials she captured from Facebook / Realtor.com (with exact text + written permission).

## Pre-requisite
- Mia decisions captured per Cycle 31A intake
- Photos delivered at the asset paths Torrey designated (off-repo staging dir or via secure transfer)
- License/permission evidence saved off-repo
- Testimonials in YAML per `photos-testimonials-readiness-dossier.md` intake template

## Non-negotiables
- No image without explicit Mia or licensor permission
- No paraphrased testimonial rendered as direct quote
- No invented review
- audit:no-fabrications must stay 0 hits
- One local commit max; no push without auth
- No production-readiness claim

## Phase 0 — Preflight
- HEAD clean
- Asset paths verified to exist (no `git add`-ing of secrets accidentally)
- Permission evidence path noted

## Phase 1 — Photo placement
- Place provided assets at public/markets/<slug>.jpg or public/people/mia-sanabria.jpg
- Run image optimization (sharp, with LD_LIBRARY_PATH per knowledge_sharp_libvips_linux_runtime)
- Update src/lib/markets.ts if asset paths changed
- Verify alt text in `<Image>` components

## Phase 2 — Testimonial render
- Add src/lib/testimonials.ts data file with the YAML rows
- Build src/components/Testimonials.tsx renderer with source attribution per dossier
- Place on Home + Markets/<slug> + Sellers (per surface list in each row)

## Phase 3 — Validate
- bun run typecheck, lint, build
- audit:images (size budgets, alt text), audit:no-fabrications (0 hits), audit:qa-gate, audit:legal
- Manual: open each surface; verify testimonial attribution renders correctly

## Phase 4 — Commit
One local commit: feat(MIA-SITE-CYCLE-X): place Mia photos + testimonials with source attribution

## Completion standard
- All assets placed with permission record
- Testimonials render with "via Facebook" / "via Realtor.com" attribution
- audit:no-fabrications still 0 hits
- audit:images passes

Do not claim production readiness.
```

---

## How to use this bank

1. Torrey opens a fresh Claude Code session in the repo working directory.
2. Copy the entire prompt for the appropriate cycle (including the markdown fence).
3. Paste into the session.
4. The session has full context to execute. No prior conversation memory needed.
5. If a prerequisite is missing, the prompt's Phase 0 will stop and report the missing input.

## Prompt versioning

Each prompt above is version 1.0 (Cycle 30B). If a future cycle changes invariants (e.g., adds a new validation gate), update the relevant prompt in-place with a header note like `# v1.1 (Cycle 30C — added <gate>)`. Do not branch multiple versions in this file; keep one current version per cycle.
