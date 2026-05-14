# Copy Tone & Length Ranges

> Cycle 34 Phase 6.

## Allowed tone

- polished
- warm
- local
- editorial
- confident
- restrained luxury
- useful for buyers and sellers
- specific without overclaiming

## Disallowed tone

- hype
- generic brochure copy
- verifiable-sounding but unsourced claims
- luxury clichés ("white-glove", "bespoke", "concierge")
- demographic targeting (any phrase implying who a neighborhood is "for")
- fake certainty ("you will love", "definitely")
- fluffy AI filler ("in today's market", "as we all know")

## Length ranges (neighborhood pages)

| Block | Words |
|---|---|
| Hero subheading | 25–45 |
| Mia's perspective | 90–140 |
| Lifestyle | 80–120 |
| Housing/property pattern | 80–130 |
| Buyer guidance | 70–110 |
| Seller guidance | 70–110 |
| FAQ answer (each) | 30–70 |
| **Total visible neighborhood copy** | **typically 550–900** |

Going over 900 words on a single neighborhood page is allowed if the surplus is buyer/seller-specific guidance, not filler.

## Length ranges (other pages)

| Page | Hero sub | Body |
|---|---|---|
| Homepage `/` | 35-65 words | Modular; no fixed total |
| `/buyers/` | 30-50 | 600-900 |
| `/sellers/` | 30-50 | 600-900 |
| `/about/` | 30-50 | 250-450 short bio + 600-900 long bio |
| `/contact/` | 25-40 | minimal — page is conversion-first |
| `/insights/[slug]/` | varies | 800-2200 |
| `/markets/` hub | 30-50 | 200-300 |

## Voice anchors (from `~/.claude/PAI/USER/PROJECTS/MiaSanabria/`)

- **Mia's anchor line:** "If I don't know the answer, I will find it." (already in `src/lib/site.ts` `anchorLine`)
- **Positioning:** Fort Lauderdale REALTOR® with adjacent practice in Boca Raton and Delray Beach.
- **Avoid:** "luxury concierge", "white-glove", "bespoke", "exclusive clientele", "high-net-worth", "off-market access" — all on the disallowed-tone list per `BSS_REALTOR_COMPLIANCE_GATE.md`.
