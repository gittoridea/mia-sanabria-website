# Validation Report — Public Email Canonicalization

**Cycle:** `cycle-public-email-canonicalization`
**Date:** 2026-05-18
**Commit at validation:** `c4fd1f2`

---

## Gate-by-gate results

| Gate | Result | Evidence |
|------|--------|----------|
| `bun run typecheck` | PASS | `tsc --noEmit` exited 0 |
| `bun run lint` | PASS | `✔ No ESLint warnings or errors` |
| `bun run build` | PASS | 57 HTML pages produced under `out/` |
| `bun run audit:public-email` | PASS | `audit-public-email: PASS (57 html files scanned; canonical=mia@miasanabria.com)` |
| `bun run audit:all` | PASS | exit 0; no FAIL lines in chain output |
| `bun run audit:no-fabrications` | PASS | `audit-no-fabrications — 0 hits` |
| `bun run audit:route-inventory` | PASS | 48 sitemap routes reconcile to filesystem |
| `bun run audit:qa-gate` | PASS | 56 routes · critical 0 · high 4 · medium 1 · low 56 (critical 0 is the gating threshold; pre-existing high count carried over from prior cycles) |
| `bun run audit:mobile-readability` | PASS | 84 PASS · 0 FAIL · 0 ERROR (no visual edits this cycle; mobile-readability:capture re-capture not required) |
| `bun run audit:legal` | PASS | 18 PASS · 1 WARN · 0 FAIL (1 WARN is pre-existing USCO designated-agent registration pending — CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md) |
| `bun run audit:brand` | PASS | 12 PASS · 0 WARN · 0 FAIL — `brand.publicEmailConsistency` reports single canonical email = `mia@miasanabria.com` |
| `bun run audit:images` (`publicEmailConsistency`) | PASS | exactly one distinct email rendered across pages: `mia@miasanabria.com` |
| `bun run audit:rendered` (canonicalEmail.consistent) | PASS | `single canonical email rendered: mia@miasanabria.com` |

## Built-output spot-check (`out/`)

| Token | Occurrences | Status |
|-------|-------------|--------|
| `mia@miasanabria.com` | 57 HTML pages (each route's `index.html` + `index.txt`) | PASS — canonical present |
| `msanabriarea@gmail.com` | 0 | PASS — legacy removed |
| `mia@miasanabriarealtor.com` | 0 | PASS — branded variant removed |
| `accessibility@agent3000.com` | 0 | PASS — residual already clean |
| `sunandbreeze` | 0 | PASS — residual already clean |
| `Klein Morgan` / `kleinmorgan` | 0 | PASS — residual already clean |
| `Family Homes Where Memories Are Made` | 0 | PASS — residual already clean |

## Audits that did not need to run / are not applicable

- `bun run audit:image-creative-acceptance` — not in `audit:all`; no image changes this cycle.
- `bun run audit:trust-logos` — covered by trust-row.
- `bun run audit:mobile-readability:capture` — would re-capture screenshots; not required because there were **no visual edits** this cycle (only constant values + audit scripts).

## What the green chain does not validate

- DNS / production cutover.
- GHL lead-routing / backend email config (out of scope).
- Live production at `https://miasanabria.com` (Mia's legacy React-SPA, not this repo's build) — see live-verification-report.md.
- Email delivery (no SMTP gate exists in this stack).

## Conclusion

Validation gates required by the mission brief are all green. The single
remaining acceptance condition is live staging verification (Phase 7).
