# Continuation Prompt — Next Cycle Trigger

> Pastebin-ready prompt for the next AI session. Drop the next mission's principal-typed brief here when ready; this file is the handoff template.

---

## Suggested next cycles (in priority order)

### Option A — Email deliverability + GHL routing audit (operator-driven, AI assists)

Verify `mia@miasanabria.com` is deliverable (MX records pointed at the provider, mailbox actually receives mail, not blacklisted). Verify GHL contact-form routing still fires to whatever inbox Mia monitors. This is principal-decision territory; the AI's job is to surface the question with the right evidence, not to write GHL.

### Option B — Production cutover bounded mission

DNS flip from the legacy React-SPA at `miasanabria.com` to the Next.js build currently at `miasanabriarealtor.trueidea.com`. Out-of-band coordination with Mia and DNS owner. Pre-flight: confirm `audit:public-email` still green, confirm `IS_STAGING` flips correctly when `NEXT_PUBLIC_SITE_URL` points to production, confirm 301 redirects from `miasanabriarealtor.com`. Hard constraint: do not flip without Mia's explicit go.

### Option C — Continue the BSSClientStrategy artifact for Mia (separate-track work)

Per `PAI/USER/PROJECTS/PROJECTS.md`, BSSClientStrategy is "Active, Mission ISA shell ready" and Mia is its bar test. Not technical-site work — strategy artifact work.

---

## Verbatim prompt for next AI session (copy-paste-ready)

```
MISSION: Mia Sanabria Website — production-cutover dry run (NO actual DNS change, NO production cutover).

Start in:
/home/torrey/code/mia-sanabria-website

Prior-cycle context:
- Public email canonical landed 2026-05-18: mia@miasanabria.com
- Cycle artifact set: docs/artifacts/cycle-public-email-canonicalization/
- Commit at handoff: c4fd1f2

Primary objective:
Produce a production-cutover readiness check WITHOUT executing any cutover.

Hard constraints (unchanged):
- Do not change DNS.
- Do not cut over production.
- Do not make GHL writes.
- Do not contact Mia or third parties.
- Do not claim production readiness.
- Do not invent facts.
- Do not bypass any of the existing audit gates.

What to deliver:
1. Run the full audit chain on current main (bun run audit:all). Record results.
2. Run bun run audit:public-email and confirm canonical=mia@miasanabria.com still green.
3. Spot-check production https://miasanabria.com/ and document whether it is still serving the legacy React-SPA (Cloudflare-fronted, msanabriarea@gmail.com still visible) or whether something has changed.
4. Inventory the 301-redirect plan from the prior decision record (docs/mia-client-decision-record.md). Document gaps.
5. Inventory deliverability of mia@miasanabria.com — DNS MX record check via dig, that's it. Do not send mail. Do not log in to providers.
6. Produce: cutover-readiness-report.md under docs/artifacts/cycle-prod-cutover-readiness/.

End in:
- audit chain green
- readiness report committed
- continuation prompt for the actual cutover mission (separate, principal-authorized)
```
