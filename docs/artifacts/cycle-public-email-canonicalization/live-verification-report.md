# Live Verification Report — Public Email Canonicalization

**Cycle:** `cycle-public-email-canonicalization`
**Date:** 2026-05-18
**Commit live:** `c4fd1f2`
**Staging base:** `https://miasanabriarealtor.trueidea.com`
**Deploy log:** `docs/artifacts/cycle-public-email-canonicalization/logs/staging-deploy-20260518-171805.log`
**Live grep log:** `docs/artifacts/cycle-public-email-canonicalization/logs/live-verify-output-20260518.txt`

---

## Deploy outcome (Dokploy)

- Pre-flight `audit:completeness` gate: **PASS** (16 pass, 1 warn, 0 fail).
- Deploy duration: **173s** (Dokploy `status=done`).
- Wait-for-needle on `/`: `mia@miasanabria.com` confirmed present after ~46s.
- ETag flipped (`dim4lvp27fgg53pu-gzip`).
- `last-modified` did not change on the homepage even with cache-bust headers — Caddy/origin artifact. Body grep on the cache-busted URL is the authoritative truth and confirms the new bundle is live.
- **EXIT_CODE: 0.**

## Live cache-busted body grep — 12 public routes

Each route fetched with a fresh `?cb=<8-byte-hex>` cache-buster and `Cache-Control: no-cache` / `Pragma: no-cache` headers, then body-grepped:

| Route | HTTP | `mia@miasanabria.com` | `msanabriarea@gmail.com` | `mia@miasanabriarealtor.com` | `accessibility@agent3000.com` | `sunandbreeze` | `Klein Morgan` | `Family Homes Where Memories` |
|------|------|-----------------------|---------------------------|-------------------------------|--------------------------------|-----------------|-----------------|-------------------------------|
| `/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/about/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/contact/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/buyers/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/sellers/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/valuation/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/markets/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/insights/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/privacy/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/terms/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/accessibility/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/dmca/` | 200 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |

**12/12 routes PASS:** canonical present everywhere a public email surfaces; zero legacy/branded/stale residue.

> Per-route hit counts are intentionally low (1 each). The `MIA.contact.email` constant is referenced from the footer + page-specific blocks; many routes show the email only via the footer (single occurrence on legal pages because the footer renders it once and the page body either repeats it once for contact/dmca/privacy or relies on footer alone for buyers/sellers/markets/insights/about).

## Sitemap + robots

| Surface | HTTP | Bytes | Notes |
|---------|------|-------|-------|
| `/sitemap.xml` | 200 | 9,367 | served by Next.js static export, includes all 48 sitemap routes |
| `/robots.txt` | 200 | 73 | staging robots (noindex on non-canonical host) — unchanged by this cycle |

## Production domain `https://miasanabria.com/`

Per the mission brief, also checked the canonical production hostname:

```
status=200
canonical (mia@miasanabria.com) present: 0
legacy   (msanabriarea@gmail.com)  present: 1
branded  (mia@miasanabriarealtor.com) present: 0
React-SPA marker (<div id="root">): 1
Next.js marker (/_next/):            0
Server header: cloudflare
<title>: "Mia Sanabria | Luxury Real Estate in Southeast Florida"
meta name="description": "Discover Southeast Florida's most exclusive real estate with Mia Sanabria. Specializing in luxury waterfront estates in Boca Raton, Fort Lauderdale, and Palm Beach."
```

**Determination:** `miasanabria.com` is **NOT built from this repo today.** It is Mia's **legacy React-SPA** fronted by Cloudflare — the same surface described in `ISA.md` line 23 ("Mia Sanabria currently runs a React-SPA at `miasanabria.com` ... luxury concierge framing, IDX iframe, 6-market hub").

This Next.js repo's production cutover plan (per `src/lib/site.ts:4-8` and `docs/mia-client-decision-record.md`) is to take over `miasanabria.com` after DNS cutover, but that cutover is **explicitly out of scope this cycle** per the mission brief ("Do not change DNS. Do not cut over production.") and per global doctrine (`~/.claude/CLAUDE.md`).

**Live legacy email at `miasanabria.com`** (`msanabriarea@gmail.com` × 1) is therefore an **EXTERNAL BLOCKER**, not an AI-closeable defect. It will resolve automatically when DNS cutover lands and this repo's build replaces the legacy SPA. Until then, the legacy SPA is editable only by whoever maintains it (Mia or the legacy hosting account owner — not this repo).

## Conclusion

- Mission objective (public email canonical on the surface this repo controls) is fully achieved on `https://miasanabriarealtor.trueidea.com`.
- The legacy production surface `https://miasanabria.com` retains the legacy email by external operating constraint, recorded as an external blocker resolvable only via DNS cutover (out of scope per mission brief and CLAUDE.md).

No production readiness is being claimed. Staging is what we asserted; staging is what is verified.
