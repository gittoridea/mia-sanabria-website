# Email + Stale-Contact Inventory — Public Email Canonicalization Cycle

**Date:** 2026-05-18
**Repo HEAD at scan:** `3a02d0c`
**Scan command:**

```
rg -n 'msanabriarea@gmail\.com|mia@miasanabria\.com|mia@miasanabriarealtor\.com|accessibility@agent3000\.com|sunandbreeze|Klein Morgan|kleinmorgan|Family Homes Where Memories' --hidden -g '!node_modules' -g '!.next' -g '!out' -g '!.git'
```

Plus a second pass against `out/` (built static export).

---

## New canonical contract (locked this cycle)

- **Public displayed email everywhere a public email appears: `mia@miasanabria.com`.**
- **Legacy `msanabriarea@gmail.com`** may persist only in explicitly non-public surfaces (backend lead routing, historical doc/ISA logs, prior-cycle audit-report snapshots) — and must be flagged when it does.
- **`mia@miasanabriarealtor.com`** is forbidden on every surface (already enforced; no change).
- **Public rendered HTML must contain 0 instances of `msanabriarea@gmail.com` after this cycle.**

---

## Classification table

| File | Line(s) | Token(s) found | Class | Action |
|------|---------|----------------|-------|--------|
| `src/lib/mia.ts` | 24 | `msanabriarea@gmail.com` | **PUBLIC_RENDERED** (single source of truth — all public surfaces read `MIA.contact.email`) | **FLIP to `mia@miasanabria.com`** |
| `src/lib/mia.ts` | 44 | `Klein Morgan` (in code comment) | DOC_ONLY (comment-only; not rendered) | Keep — provenance citation, not template residue |
| `src/components/SiteFooter.tsx` | 82, 86 | indirect via `MIA.contact.email` | PUBLIC_RENDERED | Inherits flip; no edit |
| `src/app/contact/page.tsx` | 91, 92, 111, 129, 130 | indirect via `MIA.contact.email` | PUBLIC_RENDERED + MAILTO | Inherits flip; no edit |
| `src/app/about/page.tsx` | (uses MIA.contact.serviceCore) | indirect | (no email displayed directly) | No-op |
| `src/app/privacy/page.tsx` | 72, 73, 172, 173, 240, 241, 262, 263 | indirect | PUBLIC_RENDERED + MAILTO | Inherits flip; no edit |
| `src/app/terms/page.tsx` | 220, 221 | indirect | PUBLIC_RENDERED + MAILTO | Inherits flip; no edit |
| `src/app/accessibility/page.tsx` | 105, 106 | indirect | PUBLIC_RENDERED + MAILTO | Inherits flip; no edit |
| `src/app/dmca/page.tsx` | 75, 76, 144, 145 | indirect | PUBLIC_RENDERED + MAILTO | Inherits flip; no edit |
| `src/app/valuation/page.tsx` | 105 | indirect (in mailto action) | MAILTO | Inherits flip; no edit |
| `src/components/schema/PersonSchema.tsx` | 17 | indirect | SCHEMA_JSONLD | Inherits flip; no edit |
| `src/components/schema/ContactPageSchema.tsx` | 31 | indirect | SCHEMA_JSONLD | Inherits flip; no edit |
| `src/components/schema/RealEstateAgentSchema.tsx` | 16 | indirect | SCHEMA_JSONLD | Inherits flip; no edit |
| `scripts/audit-brand-consistency.ts` | 417–418, 444 | `msanabriarea@gmail.com` literals in allowed-set + description | AUDIT_LOGIC | Update canonical to `mia@miasanabria.com`; allow legacy if `--allow-legacy` enabled (documented backend usage only) |
| `scripts/audit-rendered-visual.ts` | 116, 124 | `ALLOWED_EMAIL` literal | AUDIT_LOGIC | Flip `ALLOWED_EMAIL` to new canonical; add `msanabriarea@gmail.com` to `STALE_NEEDLES` |
| `scripts/audit-insights.ts` | 36–37, 86 | docstring + non-canonical anti-pattern | AUDIT_LOGIC | Update docstring; add `msanabriarea@gmail.com` to anti-pattern set |
| `scripts/audit-rendered-visual.ts` | (existing) | `mia@miasanabriarealtor.com` already in STALE_NEEDLES | AUDIT_LOGIC | No change — already forbidden |
| `scripts/audit-legal.ts` | 124–138 | reads `MIA.contact.email` dynamically | AUDIT_LOGIC | No change — auto-adapts |
| `scripts/audit-images.ts` | 488–518 | counts distinct emails, no literal | AUDIT_LOGIC | No change — still expects exactly 1 distinct address |
| `scripts/audit-about.ts` | 50, 51 | `Klein Morgan`, `sunandbreeze` | AUDIT_LOGIC | No change — already enforced as forbidden |
| `scripts/audit-stale-terms.ts` | 36–55 | `Klein Morgan`, `kleinmorgan`, `sunandbreeze`, `accessibility@agent3000.com` | AUDIT_LOGIC | No change — already enforced as forbidden |
| `scripts/audit-qa-gate.ts` | 168, 171 | `Klein Morgan`, `sunandbreeze` | AUDIT_LOGIC | No change |
| `ISA.md` | many | historical narrative of the prior `mia@miasanabriarealtor.com → msanabriarea@gmail.com` flip + tagline + Klein-Morgan strip | DOC_ONLY | Append a new cycle entry; do **not** rewrite prior history |
| `reports/audit-*.{json,md}` | many | snapshots from last audit run | REPORT_ARTIFACT | Regenerated on next `bun run audit:all` |
| `reports/copy-density.json` | 1604 | quoted page string containing `msanabriarea@gmail.com` | REPORT_ARTIFACT | Regenerated post-rebuild |

---

## Built-output (`out/`) inventory (pre-cycle)

```
out/**/index.html        — msanabriarea@gmail.com: present on 27+ pages (1–2 occurrences per page; mailto + visible text)
out/**/index.txt         — same count (Next.js exports a .txt sidecar per page)
out/**/                  — mia@miasanabriarealtor.com: 0 occurrences
out/**/                  — mia@miasanabria.com: 0 occurrences  ← the gap this cycle fills
out/**/                  — Klein Morgan / kleinmorgan / sunandbreeze / accessibility@agent3000.com / "Family Homes Where Memories": 0 occurrences each
```

**Phase 4 residual scan result: all four extra targets already absent from `out/`.** No additional Phase 4 work required this cycle beyond regression-blocking the canonical flip.

---

## What changes (single point of mutation in `src/`)

```
src/lib/mia.ts:24
-    email: "msanabriarea@gmail.com",
+    email: "mia@miasanabria.com",
```

Every public surface (footer, header, about, contact, valuation, accessibility, privacy, terms, dmca, JSON-LD `ContactPage` / `Person` / `RealEstateAgent` / `Organization` / `LocalBusiness`) reads `MIA.contact.email`. The flip propagates to all of them on rebuild.

## Audit-script updates required (so the audit chain doesn't immediately fail after the flip)

1. `scripts/audit-brand-consistency.ts`: allowed-set `msanabriarea@gmail.com` → `mia@miasanabria.com`; description updated.
2. `scripts/audit-rendered-visual.ts`: `ALLOWED_EMAIL` `msanabriarea@gmail.com` → `mia@miasanabria.com`; **add** `msanabriarea@gmail.com` to `STALE_NEEDLES` so future regressions are caught.
3. `scripts/audit-insights.ts`: anti-pattern set gains `\bmsanabriarea@gmail\.com\b` (legacy public email forbidden on public surfaces); docstring updated.

## New audit (regression block)

`scripts/audit-public-email.ts` — fails the build if any of these are true on the latest `out/`:

- Any rendered HTML page contains `msanabriarea@gmail.com`.
- Any rendered HTML page contains `mia@miasanabriarealtor.com`.
- Any of the critical public routes (`/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, `/valuation/`) is missing `mia@miasanabria.com` where a public contact email should appear (contact / accessibility / dmca always; privacy / terms always; about / valuation if the route already renders the constant — soft-checked).

Wired into `package.json` as `audit:public-email` and included in `audit:all`.

---

## Out of scope this cycle

- DNS or MX record changes for `miasanabria.com`.
- GHL backend lead-routing email reconfiguration (msanabriarea@gmail.com may remain there).
- Production cutover or DNS swap.
- Klein Morgan / sunandbreeze / accessibility@agent3000.com residual cleanup (already complete).
- The off-repo SPA at `miasanabria.com` if it is not built from this repo (verify in Phase 7).
