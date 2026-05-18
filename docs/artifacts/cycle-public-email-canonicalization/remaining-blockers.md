# Remaining Blockers — Public Email Canonicalization

**Cycle:** `cycle-public-email-canonicalization`
**Date:** 2026-05-18
**Status at close:** mission objective met on staging; one external blocker recorded.

---

## AI-closeable (this cycle delivered everything in this column)

| Item | Status |
|------|--------|
| Public email canonical on all repo-controlled surfaces (`miasanabriarealtor.trueidea.com`) | **DONE** — 12/12 routes verified |
| Source single-point-of-mutation discipline (one `MIA.contact.email` constant feeds footer / pages / JSON-LD / mailto / metadata) | **DONE** — already in place; this cycle leveraged it |
| Regression-blocking audit (`scripts/audit-public-email.ts`) wired into `audit:all` | **DONE** |
| Existing audit canonical-references updated (`audit-rendered-visual`, `audit-brand-consistency`, `audit-insights`) | **DONE** |
| Residual public-site stale-string check (accessibility@agent3000, sunandbreeze, Klein Morgan, Family Homes Where Memories) | **DONE** — 0 hits on every public route |
| Validation gates | **DONE** — typecheck, lint, build, audit:all, audit:public-email, audit:qa-gate, audit:mobile-readability, audit:no-fabrications all green |
| Staging deploy (Dokploy) with ETag flip + needle confirmation | **DONE** — EXIT_CODE:0, ETag flipped, needle live in ~46s |
| Live cache-busted body verification | **DONE** — see `live-verification-report.md` |
| Cycle commit + push to `origin/main` | **DONE** — `c4fd1f2` |
| Cycle artifacts + ISA changelog | **DONE** — `docs/artifacts/cycle-public-email-canonicalization/` |

## External / out-of-scope blockers

| Item | Class | Owner | Why it's not in this cycle |
|------|-------|-------|----------------------------|
| `miasanabria.com` still serves the **legacy React-SPA** showing `msanabriarea@gmail.com` (1 occurrence on homepage). | EXTERNAL / DNS / principal-decision | Mia (legacy SPA) + Torrey (DNS cutover decision) | This repo does not build `miasanabria.com` today. The production cutover plan is to swap DNS so the Next.js site at `miasanabriarealtor.trueidea.com` becomes `miasanabria.com`. Mission brief: "Do not change DNS. Do not cut over production." Also locked by `~/.claude/CLAUDE.md` and `docs/mia-client-decision-record.md`. |
| Branded mailbox `mia@miasanabria.com` provisioning (MX records + mailbox at the provider) | EXTERNAL / DNS / principal-decision | Torrey + Mia + DNS/email provider | Out of repo scope. The site asserts the address; the address must actually be deliverable before the production cutover. |
| Update GHL backend lead-routing if msanabriarea@gmail.com is currently the routing target | EXTERNAL / GHL / principal-decision | Torrey + Mia | Mission brief: "Do not make GHL writes." Legacy gmail address is explicitly allowed to remain as private/backend routing per the new canonical contract. |
| Production-readiness assertion | NOT YET | — | Mission brief explicitly forbids claiming production readiness. Staging-only verification is what this cycle commits to. |
| Schema.org / GBP / Knowledge Panel email update on third-party surfaces | EXTERNAL / SEO / principal-decision | Torrey + Mia | Out of scope. Once the production cutover lands, this repo's JSON-LD will surface the new canonical to crawlers naturally. |

## What an operator (Torrey) should do next, in order

1. **Validate `mia@miasanabria.com` deliverability** before any production cutover (send a test, confirm MX, confirm spam reputation).
2. **Confirm GHL routing** for the contact form is correctly fanning to whatever inbox Mia actually monitors. If it routes to `msanabriarea@gmail.com` today, that's allowed by the new contract (private/backend), but verify it still fires.
3. **Schedule the production cutover** as its own bounded mission (DNS flip + 301 redirects from `miasanabriarealtor.com`). The `audit:public-email` gate added this cycle will then enforce the canonical on the production hostname automatically.
4. **Notify Mia** that the email surfaced on her site is now `mia@miasanabria.com` and confirm she wants it that way going live (this is a principal decision to land in `docs/mia-client-decision-record.md`).

## Notes on the new contract's edge cases

- `msanabriarea@gmail.com` appearing in **prior-cycle audit reports** under `reports/` and in **historical ISA log entries** is preserved as DOC_ONLY / REPORT_ARTIFACT. The new audit (`audit-public-email.ts`) scans `out/` only, so these historical artifacts do not produce false positives.
- `audit-brand-consistency` (`brand.publicEmailConsistency`) scans `src/` only and now rejects `msanabriarea@gmail.com` if it returns to source code.
- `audit-insights` rejects `msanabriarea@gmail.com` and `mia@miasanabriarealtor.com` as banned phrases in editorial body copy.
- `audit-rendered-visual` (`STALE_NEEDLES`) catches either legacy variant if it sneaks into rendered HTML.

Three independent layers of defense for the same invariant.
