# Cycle 34 — Compliance Review

> Phase 14 deliverable. Targeted scan for Fair Housing, FREC superlative, fabricated-testimonial, ranking, school, safety, "luxury concierge" cliché, demographic-targeting, and visible "Updated MONTH YYYY" patterns across `src/` and `public/`.

## Method

```bash
git grep -niE 'best (school|realtor)|good school|top (realtor|school)|safe(st)? (neighborhood|area)|family-friendly|kid-friendly|bachelor pad|exclusive clientele|high-net-worth|off-market|guaranteed (sale|price)|white-glove|luxury concierge|bespoke|since 2017|within two hours|bilingual|hablo español|Spanish-speaking|placeholder testimonial|lorem ipsum|Updated [A-Z][a-z]+ 20[0-9]{2}|#1 realtor' \
  -- 'src/' 'public/' ':!*.svg'
```

Run 2026-05-14, Cycle 34 Phase 14.

## Result

**2 hits — both in guard-comments, none user-facing.**

| File | Line | Hit | Classification |
|---|---|---|---|
| `src/data/lead-magnets/index.ts` | 15 | `*   - No fabricated off-market guarantees, MLS-access promises, or` | **Guard comment** — explicitly forbids the pattern. Not user-facing. **Keep.** |
| `src/lib/insights.ts` | 325 | `/** Optional secondary line, e.g. "Updated May 2026". Cycle 18: not emitted by 'evergreen-month' mode. */` | **Guard comment** — documenting that the "Updated MONTH YYYY" label is intentionally NOT emitted, per the visible-label ban in `CLAUDE.md`. **Keep.** |

Both hits are protective code/comment that defends against the banned patterns. Removing them would weaken the guards. They are **not violations**.

## Existing audits that enforce this

| Audit | Enforces |
|---|---|
| `audit:no-fabrications` | 0 hits — runs against built `out/` HTML, catches anything that leaks into shipped pages |
| `audit:stale` | Catches "luxury concierge", "white-glove", "bespoke", "high-net-worth", "off-market", "since 2017", "within two hours", "as seen in/on", "best schools", "good schools", "safe neighborhood", "family-friendly", "bachelor pad", "kid-friendly", "#1 realtor", "top realtor", "best realtor", "guaranteed sale/price", double-period defect, "Updated MONTH YYYY" labels |
| `audit:legal` | DMCA, REALTOR®, FL governing law, footer legal links, GHL conditional language |
| `audit:about` | License # not in About body, sales volume claims absent, award claims absent, testimonial placeholders absent, LPT Realty present |

All four pass this cycle (verified 2026-05-14).

## Bridge demo honesty (cross-check)

Per CLAUDE.md and the brief, Bridge demo mode must remain honest. Verified:

- `src/lib/bridge.ts` — config layer; no copy that misrepresents demo as live.
- `src/components/bridge/BridgeSearch.tsx` — renders the Bridge IDX widget; demo banner remains a component-owned concern (no copy override in this cycle).
- `/home-search/` page metadata: `robots: { index: false, follow: true }` — correct while Bridge in demo mode.

## Brokerage attribution (cross-check)

- Footer renders `Mia Sanabria, LPT Realty, LLC` and license # `SL3405877`.
- `audit:legal` confirms terms page carries REALTOR® definition + FL governing law.
- `audit:about` confirms LPT Realty present, license # absent from About body.

## Cycle 34 implementation diff — compliance review

Two edits in this cycle:

1. `src/app/page.tsx` — Hero eyebrow `Mia Sanabria · REALTOR® with LPT Realty` → `South Florida Lifestyle`; CTA target/label updates.
2. `src/app/home-search/page.tsx` — Hero eyebrow `Search Listings` → `South Florida Lifestyle`; added in-page anchor CTA.

Neither introduces any banned phrase. The new eyebrow phrase "South Florida Lifestyle" is a geographic/lifestyle theme, not a protected-class or ranking claim. **Compliance-safe.**

## Open compliance items (NOT addressed this cycle)

| Item | Owner | Status |
|---|---|---|
| DMCA USCO certificate (in-process language allowed for staging, blocked for production) | Mia + counsel | Per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md` |
| Languages list (`MIA.unverified.languages`) confirmation | Mia | Currently `["English"]`; Spanish was flagged but never confirmed |
| Years-licensed claim | Mia | `MIA.experience.since = null` |
| Display office address | Mia | Currently `null` |
| Mia attestation of designations (PSA, RENE, CDPE, ABR, SFR, AHWD) | Mia | Verbal-confirmed Cycle 24 R2; written attestation pre-cutover gate |

None of these block this cycle's polish.

---

Generated 2026-05-14 by Cycle 34 Phase 14.
