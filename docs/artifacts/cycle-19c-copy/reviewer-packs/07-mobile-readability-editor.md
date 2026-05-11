# Reviewer Pack 07 — Mobile Readability Copy Editor

**Cycle:** 19C-COPY · **Reviewer role:** Mobile Readability Copy Editor · **Generated:** 2026-05-11

## Executive summary

Scoped to mobile-risk routes per `docs/artifacts/cycle-19c-copy/copy-inventory.md` (Home, Fort Lauderdale, Pompano Beach, Boca Raton, Delray Beach, Insights index). The seven worst small-viewport readers all share two structural defects:

1. **Hero subtitles run as two-clause sentences with embedded geography enumeration.** At 320–375px these wrap onto 5–7 lines inside the navy `data-hero-copy-panel` and crowd the primary CTA into the lower 30% of the fold. Pompano Beach and Boca Raton are the worst offenders (`market.intro` 56 and 45 words respectively, both naming three or more places before the verb-phrase resolves).
2. **Cards and lead paragraphs are paragraph-shaped, not card-shaped.** The doctrine asks for 1–2 sentences per card; the homepage `HOME_VALUE_PROPS`, the FL "diligence snapshot" teaser, and the Insights index intro paragraph all run 3–4 sentences with multiple commas and em-dashes that compound at narrow measure.

The locked footer pattern from the doctrine (`SITE.tagline` followed by the two-sentence brand line) is the right target. The footer **currently doubles geography** — `SITE.tagline` already enumerates "Eastern Fort Lauderdale, Boca Raton, and Delray Beach" and is then immediately followed by "Real estate guidance for luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach buyers and sellers, delivered with discretion and rigor" — six geography mentions stacked at the start of the footer column. Replacing the trailing sentence with the doctrine-locked "Expect a patient conversation delivered with discretion and nuance" closes that loop and matches the cycle-19C voice contract.

No banned-term hits were introduced in any proposal; every diligence-substance noun (survey, dock, seawall, bridge clearance, reserves, milestone, route-to-inlet, Hillsboro Inlet, CRA) is preserved verbatim.

CTA labels were checked at 320px against the actual `lg:px` and `text-[9px]` token chain in `Hero.tsx`. The two longest sitewide labels — "Begin a Private Buyer Brief" (Fort Lauderdale hero) and "Begin a Private Conversation" (home hero) — already wrap onto two lines inside the panel at 320px even with `whitespace-normal text-balance` set. One shorter alternative is proposed for the FL market hero where the noun-stack ("Private Buyer Brief") collides with the `Confidential Valuation` secondary.

Eight findings follow. All are **Category 1 (site/content/design defect)** unless otherwise noted; none require source-ledger review except where called out.

---

### Finding 1: Footer lead paragraph doubles geography

- **Route / file:** `src/components/SiteFooter.tsx` (paragraph composed from `SITE.tagline` in `src/lib/site.ts` + the inline trailing sentence)
- **Current copy:** "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Real estate guidance for luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach buyers and sellers, delivered with discretion and rigor."
- **Proposed copy:** "Private guidance for waterfront and luxury homes from Fort Lauderdale to Boca Raton and Delray Beach. Expect a patient conversation delivered with discretion and nuance."
- **Reason:** This is the doctrine's locked footer pattern verbatim (`CYCLE_19C_COPY_DOCTRINE.md` §"Footer pattern"); current copy enumerates the three primary geographies twice in adjacent sentences, the exact smell flagged in the doctrine's "Avoid" list.
- **Risk if changed:** `SITE.tagline` is reused in `metadata`, OG cards, and several schema files — the change must replace the in-footer paragraph only, not edit `SITE.tagline` itself. The audit `audit:stale` greps "Eastern Fort Lauderdale" presence; replacing the footer text does not remove that string sitewide.
- **Factual / source-ledger review required:** no
- **Category:** 1

---

### Finding 2: Pompano Beach hero subtitle wraps 6–7 lines at 375px

- **Route / file:** `src/lib/markets.ts` — `markets[].slug === "pompano-beach"`, `intro` field
- **Current copy:** "Pompano Beach is a northeastern Broward city framed by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The market pairs a public beachfront and the redeveloped Fisher Family Pier with deepwater Intracoastal residences and an active offshore reef-dive corridor — at relative value to Fort Lauderdale and Boca Raton."
- **Proposed copy:** "A northeastern Broward city between Lauderdale-by-the-Sea and Hillsboro Beach. Public beachfront, the rebuilt Fisher Family Pier, deepwater Intracoastal residences, and an active reef-dive corridor — at relative value to Fort Lauderdale and Boca Raton."
- **Reason:** Drops the 56-word two-sentence frame to ~38 words across two sentences. Geography mention is preserved but compressed (Pompano named once via context; Lauderdale-by-the-Sea / Hillsboro Beach kept as orienting landmarks). One idea per sentence per doctrine.
- **Risk if changed:** `market.intro` is also used in `metadata.description`, OG description (`/markets/pompano-beach/`), and `PlaceSchema.description`. Trimming under ~140 chars is fine for OG; meta description builder in `[slug]/page.tsx` clamps to 158 chars, so the shorter version stays safe.
- **Factual / source-ledger review required:** no (no claim changes; all preserved nouns are from the existing Pompano source ledger)
- **Category:** 1

---

### Finding 3: Boca Raton hero subtitle stacks five abstract nouns before the verb

- **Route / file:** `src/lib/markets.ts` — `markets[].slug === "boca-raton"`, `intro` field
- **Current copy:** "Boca Raton gives buyers a broad set of options, from coastal condominiums and single-family neighborhoods to club communities. The right match depends on lifestyle, fees, commute, schools, building condition, and long-term ownership goals."
- **Proposed copy:** "Boca Raton ranges from coastal condominiums to single-family neighborhoods and club communities. The right match turns on lifestyle, fees, building condition, and ownership horizon."
- **Reason:** Compresses 45 words to ~28. Drops "commute" and "schools" because **schools** is a Fair-Housing-steering risk flagged in the project CLAUDE.md honesty contract ("no 'best schools' / 'good schools' / 'safe neighborhood'"); even a neutral mention in a hero sub invites the steering audit failure.
- **Risk if changed:** Removes "schools" from the public-facing hero sub. This is intentional and matches the existing audit contract. Same `market.intro` reuse caveat as Finding 2 (metadata + OG + PlaceSchema).
- **Factual / source-ledger review required:** yes — confirm with principal that removing the "commute / schools" phrase from the hero is acceptable; the substantive school discussion can stay in long-form copy where context exists.
- **Category:** 1 + 5 (Fair Housing compliance lens)

---

### Finding 4: Home value-prop "Brokerage relationships" card is paragraph-shaped

- **Route / file:** `src/app/page.tsx` — `HOME_VALUE_PROPS[1]`
- **Current copy:** "Quiet introductions when Mia's brokerage and ownership relationships across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach surface a fit. Access varies by market and timing."
- **Proposed copy:** "Quiet introductions when Mia's brokerage and ownership relationships surface a fit in the markets she covers. Access varies by market and timing."
- **Reason:** Card-grid cards should be 1–2 short sentences for mobile scannability. The "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach" enumeration here is the exact "repeated geography in same paragraph" smell — and the same three markets are already named in the section header, the adjacent AnswerFirst block, and the footer above the fold.
- **Risk if changed:** Soft SEO loss of an "Eastern Fort Lauderdale / Boca / Delray" cluster in the home `out/index.html`; mitigated by the H1, the AnswerFirst paragraph, the IntentRouter, and the FeaturedMarketsPager all still naming each market explicitly. Net string count drops by 1 instance per market in `audit:stale`, all still well above zero.
- **Factual / source-ledger review required:** no
- **Category:** 1

---

### Finding 5: Fort Lauderdale "diligence snapshot" teaser paragraph too dense

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` — Section 6.5 aside (`Waterfront diligence snapshot`)
- **Current copy:** "Three brand-quality checklists, written in Mia's voice, drawn from the same Eastern Fort Lauderdale diligence sequence used on private engagements. No email required."
- **Proposed copy:** "Three checklists in Mia's voice — drawn from the diligence sequence she uses on private engagements. No email required."
- **Reason:** Drops "brand-quality" (luxury-as-filler adjective; not earning its place per doctrine) and the repeated "Eastern Fort Lauderdale" (the entire page is the Fort Lauderdale market page; the geography is implicit). Brings the teaser body from 27 words to ~20, well inside card scannability budget at 320px width.
- **Risk if changed:** The "Eastern Fort Lauderdale" string count on `/markets/fort-lauderdale/` drops by 1 (current inventory: 18). No effect on the three PDF download links, the disclaimer, or the "Request a private brief instead" CTA.
- **Factual / source-ledger review required:** no
- **Category:** 1

---

### Finding 6: Fort Lauderdale market hero CTA wraps two lines at 320px

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` line 410 — `Hero` `ctaPrimary.label`
- **Current copy:** "Begin a Private Buyer Brief"
- **Proposed copy:** "Request a Buyer Brief"
- **Reason:** At 320×568 with the `text-[9px] min-[360px]:text-[10px] min-[375px]:text-[13px]` token chain in `Hero.tsx`, "Begin a Private Buyer Brief" is the only sitewide primary CTA label that overflows two lines inside the brass pill at the iPhone SE viewport. Trimming "Begin a Private" → "Request a" preserves the brief-first framing while giving the panel a one-line CTA across 320/375. The home hero CTA ("Begin a Private Conversation") stays as-is because the home hero panel allocates more vertical room and the phrase is a stronger brand anchor.
- **Risk if changed:** "Buyer brief" intent token is preserved (the `?intent=buyer-brief` query param in the href continues to work); the label change has no effect on the GHL form-fallback honesty contract because the form endpoint is still mailto. Marginal change to the "Private" cluster repetition on the FL page (the panel already shows "A decision, not a default" and "Fort Lauderdale rewards a written brief" within the next viewport-height of scroll).
- **Factual / source-ledger review required:** no
- **Category:** 1

---

### Finding 7: Fort Lauderdale prelude paragraph reads as one 75-word sentence chain on mobile

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` — Section 1.5 first paragraph
- **Current copy:** "For luxury and waterfront buyers, the city resolves into four or five distinct sub-markets that trade on different fundamentals. For sellers, the work that earns the right price is property-specific, not slogan-driven. The pages that follow are organized around the conversations Mia handles privately before any address is opened — for buyers, the brief; for sellers, the valuation and the buyer-profile decision."
- **Proposed copy:** "For luxury and waterfront buyers, the city resolves into four or five distinct sub-markets. For sellers, the work that earns the right price is property-specific, not slogan-driven. The pages that follow are organized around the conversations Mia handles privately before any address is opened."
- **Reason:** The third sentence's em-dash trailing clause ("for buyers, the brief; for sellers, the valuation and the buyer-profile decision") restates split paths that are already named two scrolls below in the buyer/seller playbook section headings. At 320px the dash + semicolon construction wraps awkwardly and competes with the second prelude paragraph's "30-minute private call" payload. Cutting it preserves the framing without restating downstream structure.
- **Risk if changed:** Removes one explicit mention of the "buyer brief / valuation / buyer-profile decision" triad in the hero-adjacent prose. Each component still appears in the buyer playbook eyebrow, the valuation aside, and the seller playbook intro respectively. No schema, no internal links, no FAQ entries reference this exact phrase.
- **Factual / source-ledger review required:** no
- **Category:** 1

---

### Finding 8: Insights index intro paragraph runs 5 commas + 3 geographies in one breath

- **Route / file:** `src/app/insights/page.tsx` — first body paragraph under "A twelve-part editorial library"
- **Current copy:** "These briefs are written for the buyers and sellers Mia works with directly — luxury and waterfront across Eastern Fort Lauderdale, Boca Raton, Delray Beach, and the surrounding municipalities. Each brief is built to make the first private conversation more productive: it frames what to verify on a specific address, how to separate similar markets, and where the leverage points sit before any introduction is made."
- **Proposed copy:** "These briefs are written for the buyers and sellers Mia works with directly across the Eastern Fort Lauderdale, Boca Raton, and Delray Beach corridor. Each brief is built to make the first private conversation more productive — what to verify on a specific address, how to separate similar markets, and where the leverage points sit."
- **Reason:** Drops the "luxury and waterfront" repeat (already in the H1 directly above), folds the "surrounding municipalities" tail (vague filler), and removes the trailing "before any introduction is made" clause (the doctrine's "throat-clearing" pattern in tail position). Compression from ~70 words to ~55, mean-sentence-length drop from 35w to ~27w — clears the doctrine's 28-word soft limit.
- **Risk if changed:** Removes one "luxury and waterfront" instance from `out/insights/index.html` (current count: 3); H1 still carries it. The "and the surrounding municipalities" hedge is the only place on the Insights index that signals service beyond the three primary markets — confirm with principal whether the Insights index should still gesture toward Lighthouse Point / Hillsboro Mile / Pompano-area coverage; if yes, restore as a separate sentence rather than a comma-trailing clause.
- **Factual / source-ledger review required:** yes — principal call on the "surrounding municipalities" gesture.
- **Category:** 1 + 3 (principal scope decision on the geography hedge)

---

## Open questions for principal review

1. Finding 3 removes "schools" from the Boca Raton hero sub on Fair-Housing-steering grounds. Confirm this is the right standard for hero/sub copy — if so, do we want a sitewide sweep for the same risk in `lifestyle`, `buyerGuidance`, and FAQ fields?
2. Finding 8 trims the "surrounding municipalities" gesture on the Insights index. Should the Insights surface explicitly name Lighthouse Point / Hillsboro Mile / Pompano Beach as in-scope, or keep the corridor frame tight on the three primary markets?
3. Finding 6 changes only the FL primary CTA. Should the same compression run on the home-hero "Begin a Private Conversation" label, or is the longer phrase the locked brand anchor at the front door?
