# Approved Mia Decisions — Implementation Record (Cycle 22-R1)

**Commit:** `6650c1f` `feat(MIA-SITE-CYCLE-22-R1): implement approved Mia decision copy updates`
**Live (dev/staging):** https://miasanabriarealtor.trueidea.com/ — ETag flipped from `dig4vprowpog*` → `digazs0gnm68*` across 11 routes.
**Deploy time:** 149s via Dokploy app `XJSRlvH-91ZtUsh0RPGvo`.

## Decisions implemented

| # | Decision | Implementation | Live evidence |
|---|---|---|---|
| **A1** | Homepage H1 keeps Pompano Beach | NO source change — `src/app/page.tsx:84` already says "Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton." | Live grep `/` → "Fort Lauderdale, Pompano Beach, and Boca Raton" hits=1 |
| **A2** | FL miaQuote rewrite (Mia §2.1 approved) | `src/lib/markets.ts:132` — "Known as the Venice of America, Fort Lauderdale is built around more than 165 miles of inland canals — the geography that anchors the deepwater yachting market." | Live homepage hits=1; live `/markets/fort-lauderdale/` hits=1 |
| **A3** | Boca miaQuote rewrite (Mia §2.2 approved) | `src/lib/markets.ts:364` — "Boca Raton's distinctive layer is Addison Mizner's Mediterranean Revival architecture, ocean-access estate sections, and a balance between resort feel and a full-time residential community." | Live homepage hits=1 |
| **A4** | Palm Beach miaQuote rewrite (Mia §2.3 approved) | `src/lib/markets.ts:443` — "Palm Beach is a small barrier-island town defined by architectural review, generational tenure, and three distinct sections — North End, Mid-Town, and South End." | Live homepage hits=1 |
| **A5** | Delray miaQuote rewrite (Mia §2.4 approved) | `src/lib/markets.ts:514` — "Delray Beach — the Village by the Sea — is organized around a walkable Atlantic Avenue downtown. Proximity to Atlantic is the dominant pricing variable; the residential heart spans Lake Ida, Tropic Isle, and the A1A beach corridor." | Live homepage hits=1 |
| **A6** | Lighthouse Point miaQuote rewrite (Mia §2.5 approved) | `src/lib/markets.ts:594` — "Lighthouse Point is a small Broward city north of Pompano Beach, known for finger-isle canals with no-fixed-bridge ocean access via the Hillsboro Inlet — a defining feature for yacht-capable single-family residences." | Live homepage hits=1 |
| **A7** | Deploy to dev/staging | Dokploy deploy 149s; ETag flipped across all 11 probed routes | post-deploy ETag `digazs0gnm68*` ≠ pre-deploy `dig4vprowpog*` |
| **B8** | Production domain = `miasanabriarealtor.com` | NO source change — `src/lib/site.ts:7` PRODUCTION_URL already = "https://miasanabriarealtor.com" | confirmed via `grep -E PRODUCTION_URL src/lib/site.ts` |

## Banned-phrase removal (live)

| Banned phrase | Live `/markets/{market}/` hits |
|---|---|
| `undisputed yachting` | 0 |
| `absolute zenith` | 0 |
| `absolute pinnacle` | 0 |
| `perfectly captures` | 0 |
| `ultra-luxurious` | 0 |
| `unparalleled standard` | 0 |
| `globally recognized` | 0 |
| `ultimate sanctuary` | 0 |
| `same business day` | 0 (on `/thank-you/`) |

Source-level grep: `grep -ciE 'undisputed yachting\|absolute zenith\|absolute pinnacle\|perfectly captures\|ultra-luxurious\|unparalleled standard\|globally recognized\|ultimate sanctuary' src/lib/markets.ts` → **0**.

## Deliberate non-changes (documented divergence)

| Item | Reason left unchanged |
|---|---|
| `src/lib/site.ts` `SITE.description` + `SITE.tagline` | Describe Mia's PRACTICE SCOPE (FL/Boca/Delray). Feed OG/meta/JSON-LD. Validly differs from homepage H1 feature emphasis (FL/Pompano/Boca). |
| `src/lib/mia.ts` `MIA.tagline` | Same — practice-scope description, not homepage emphasis. |
| `src/components/Hero.tsx` `homeHeroHeading` constant | Sentinel for old-H1 mobile wbr-wrapping branch. Current H1 doesn't match — falls through to default render. Rewriting both sentinel + wbr JSX requires fresh mobile screenshots at 320/375/414/768 (Cycle 19A-M flow) — out of E3 scope. |

## Regression guards (all green)

- ✅ Above-fold trust row absent (audit:trust-row 51/51 PASS).
- ✅ Visible "evergreen" absent (audit:stale clean).
- ✅ PDFs standalone (audit:lead-magnets 4/4 PASS, no shell bleed).
- ✅ Same-business-day absent (live grep hits=0).
- ✅ IDX iframe preserved (live grep `sef.mlsmatrix.com` hits=1 on homepage; audit-completeness IDX 5/5).
- ✅ Staging noindex preserved (`robots.txt` `Disallow: /`).
- ✅ No secrets logged in any artifact or commit message.
- ✅ GHL unconnected (env empty, no source edits to forms).
- ✅ GA/GTM/SC/GBP unconnected (no `<Script>` injected).
- ✅ Hidden lead-source inputs (Cycle 21 A9) preserved on `/contact/` + `/valuation/`.

## TBD items routed to TOMORROW_REMAINING_ITEMS.md

- B9 Branded email / from-domain.
- B10 Phone / call-tracking.
- C11 Lead-magnet gating (current honest fallback preserved).
- C14 REALTOR® / EHO / MLS final legal review (Cycle 24).
