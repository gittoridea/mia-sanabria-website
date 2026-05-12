# Team 1 — Decision Reconciler

**Files inspected:** Cycle 22 packets at `docs/artifacts/cycle-22-remaining-gap-closure/{MIA_DECISION_PACKET.md, copy-claims-closure.md, remaining-work-register.md, FINAL_REMAINING_LIST_FOR_TORREY.md}`.

## Approved-now items (Cycle 22-R1 implements)

| # | Decision | Source ref | Files affected |
|---|---|---|---|
| A1 | Homepage H1: keep Pompano Beach | Mia §1 | `src/app/page.tsx:84` — NO CHANGE (already says Pompano) |
| A2 | FL miaQuote rewrite | Mia §2.1 | `src/lib/markets.ts:132` — UPDATED to approved replacement |
| A3 | Boca miaQuote rewrite | Mia §2.2 | `src/lib/markets.ts:364` — UPDATED |
| A4 | Palm Beach miaQuote rewrite | Mia §2.3 | `src/lib/markets.ts:443` — UPDATED |
| A5 | Delray miaQuote rewrite | Mia §2.4 | `src/lib/markets.ts:514` — UPDATED |
| A6 | Lighthouse Point miaQuote rewrite | Mia §2.5 | `src/lib/markets.ts:594` — UPDATED |
| A7 | Deploy to staging | mission | Dokploy deploy after commit |
| B8 | Production domain = `miasanabriarealtor.com` | Mia §3 | `src/lib/site.ts:7` — NO CHANGE (PRODUCTION_URL already set correctly) |

## TBD items (carried to TOMORROW_REMAINING_ITEMS.md)

- B9 Branded email/domain
- B10 Phone/call-tracking
- C11 Lead-magnet gating (current honest fallback preserved)

## Legal/compliance items (still routed to LEGAL_COMPLIANCE_PACKET)

Unchanged from Cycle 22 — F.S. 475.278 brokerage classification refinement, TCPA PEWC refinement, DBPR verification, NAR confirmation, SEF MLS broker reciprocity, /privacy/, /terms/, /accessibility/, /dmca/, PDF disclaimers, REALTOR®/EHO/MLS legal review.

## GHL/Google/cutover blocked items

Unchanged from Cycle 22 — all 10 GHL deps, all 6 GA/SC/GBP deps, all 4 DNS/cutover deps.

## Decision divergence — site metadata constants

Mia approved keeping the homepage H1 with "Pompano Beach" as the visible emphasis (replacing "Delray Beach" in the Cycle 21 version). However, `src/lib/site.ts:24-25` (SITE.description + SITE.tagline) and `src/lib/mia.ts:34` (MIA.tagline) describe Mia's *practice scope* — "Eastern Fort Lauderdale, Boca Raton, and Delray Beach" — and feed Google search snippet, OG/Twitter previews, and JSON-LD Person.description. These constants are NOT rippled because:

- They describe scope-of-practice (where Mia transacts), not homepage feature emphasis.
- Mia's actual practice includes Delray Beach as a primary triad city (per AnswerFirst block on the homepage, per mia.ts:53 administrativeArea, per existing market pages).
- Rippling would change OG/meta facts about where Mia does business, not just where she features on the homepage hero.

`src/components/Hero.tsx:32-33` `homeHeroHeading` constant is ALSO not rippled — it's the sentinel that triggers a special mobile wbr-wrapping branch (`L34-42`) for an earlier H1 string. The current H1 ("Pompano Beach") doesn't match the sentinel and falls through to default rendering. Updating the sentinel to match the new H1 would activate the wbr branch but the wbr JSX still names "Delray" — rewriting both would require fresh mobile screenshots at 320/375/414/768 (Cycle 19A-M flow), which is out of E3 scope this cycle.

**Risk:** zero functional regression — both divergences are deliberate.
**Implementation safe now:** YES (5 miaQuote rewrites only).
**Item remains blocked for tomorrow:** SITE.description/SITE.tagline/MIA.tagline ripple decision + Hero.tsx homeHeroHeading + wbr-wrapping rewrite (combined: "metadata-ripple" item, queue if Mia wants the scope-statement to also de-emphasize Delray in favor of Pompano).
