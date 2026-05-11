# Reviewer Pack 03 — Buyer ICP Editor

**Cycle:** 19C-COPY · **Scope:** buyer-facing copy (`/buyers/`, Fort Lauderdale buyer playbook + buyer FAQs, sitewide buyer FAQs, waterfront-buyer-due-diligence checklist PDF). · **Reviewer:** Buyer ICP Editor. · **Date:** 2026-05-11.

## Executive summary

The buyer-facing copy is more compliance-clean than it is sharp. Diligence substance (survey, dock, seawall, bridge clearance, route-to-inlet, 4-point, AVM skepticism) is intact and should stay intact — that material is the entire reason a serious waterfront buyer reads past the hero. What hurts the page is not the diligence; it is the **hedging stacked on the hedges**: "if you'd like", "feel free", "a short conversation is the first step", repeated geography, and three different ways of saying "informally available residences" in three adjacent paragraphs. A serious waterfront buyer reading this page should feel that Mia already assumes they are serious. Today the page reads like it is auditioning for them.

This pack focuses on three categories of edit:

1. **CTAs presuming serious intent** (replace "begin a private conversation" patterns that read like a low-friction inquiry funnel with verbs that name the next decision — submit a brief, request a parcel review, schedule a 30-minute call).
2. **Hedging compression** (the "informally available residences" / "availability varies by market and timing" / "what Mia maintains is the brokerage relationships" triple-hedge collapses to one disclosure, used once).
3. **Throat-clearing removal** (the buyer playbook opener "The first 60-90 minutes is conversation" and the contact-strip "A short private conversation is the first step" both delay the reader before saying anything; tighten and name what the conversation produces).

Compliance-substantive substance is preserved: no diligence variable is removed, no disclaimer is touched, no banned terms are introduced.

9 findings. All Category 1 (site/content/design defect) except where noted.

---

### Finding 1: Buyers hero sub-line over-enumerates geography and adds soft brag

- **Route / file:** `out/buyers/index.html` (source: `src/app/buyers/page.tsx` Hero `sub`)
- **Current copy:** "Mia represents buyers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach — every brief written before the first showing, every closing attended in person."
- **Proposed copy:** "Mia represents buyers across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Every brief is written before the first showing; every closing is attended in person."
- **Reason:** Doctrine "Avoid": repeated geography in one paragraph (three "Eastern" prefixes when the area context is already established). Splitting the em-dash chain into two sentences reads sharper per "One idea per sentence." Drops the soft "every…every" parallelism that scans as a vow.
- **Risk if changed:** Three-county geography enumeration appears here, in the hero, and in the meta description — losing one "Eastern" qualifier risks SEO drift on "Eastern Boca Raton" intent. Mitigation: the same "Eastern" prefix already appears in the meta description (preserved) and in the AnswerFirst paragraph immediately below the hero.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 2: AnswerFirst paragraph (#127w) drifts past the doctrine paragraph budget

- **Route / file:** `out/buyers/index.html` (source: `src/app/buyers/page.tsx` `AnswerFirst` `answer`)
- **Current copy:** "A successful luxury or waterfront acquisition in Eastern Fort Lauderdale begins with a precise brief, not a public IDX scroll. Decisions turn on dock specifics — length, water depth, fixed-bridge clearance, and the route to the inlet — plus architectural era, lot orientation, hurricane shutters, flood elevation, and HOA or country-club access. Curated showings (three to five carefully matched residences, not thirty) outperform large-list tours every time. Mia activates her brokerage and ownership relationships across Las Olas Isles, Harbor Beach, Rio Vista, and the in-town clusters to surface relevant residences — including informally available opportunities those relationships uncover. Title, financing, and inspection partners stay matched to the residence's price tier."
- **Proposed copy:** "A serious Eastern Fort Lauderdale acquisition begins with a written brief, not a public IDX scroll. Decisions turn on the verifiable variables — dock length, water depth, fixed-bridge clearance, route to the inlet, architectural era, lot orientation, hurricane shutters, flood elevation, and HOA or country-club access. Three to five carefully matched showings outperform thirty mismatches. Mia's brokerage and ownership relationships across Las Olas Isles, Harbor Beach, Rio Vista, and the in-town clusters surface relevant residences, including any informally available. Title, financing, and inspection partners are matched to the residence's price tier."
- **Reason:** Paragraph reads 127 words; doctrine threshold is 55. Compressing the dock list into one inline series and replacing the verb "activates" (consultant-speak) with the plain noun "relationships … surface" preserves every diligence variable while cutting ~30 words. "Outperform every time" is also a soft brag; "outperform thirty mismatches" carries the contrast more concretely.
- **Risk if changed:** This paragraph is the FAQPage schema's `acceptedAnswer.text` and is duplicated inline in a `<script type="application/ld+json">` block. Both the visible paragraph AND the JSON-LD copy must change in sync, or schema drifts from rendered. Recommend a copy ID so the renderer pulls both from one constant.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 3: Buyer process — collapse the triple-hedge on "informally available"

- **Route / file:** `out/buyers/index.html` and Fort Lauderdale (source: `src/app/buyers/page.tsx` `BUYER_PROCESS[1].body`, `ValueProps` item 0 body, `BUYER_FAQ` Q3 answer; `src/components/markets/FortLauderdaleV2.tsx` `BUYER_PLAYBOOK[5].body`, FAQ Q3, CTAStrip sub)
- **Current copy:** Three near-identical paragraphs across one page: "Mia activates her brokerage and ownership relationships to surface relevant residences — including any informally available opportunities those relationships uncover. Access varies by market and timing." (phase 2) ··· "Residences surfaced through the brokerage and ownership relationships Mia has built over time — including any informally available opportunities those relationships uncover. Availability varies by market and timing." (value-prop 01) ··· "A short private conversation is the first step. From there, Mia sources the right residences across her core markets — including any informally available opportunities her brokerage relationships uncover." (CTA strip)
- **Proposed copy:** Standardize on a single sentence used at most twice on the page, second mention shortened. Phase 02: "Mia's brokerage and ownership relationships surface residences that match the brief, including any informally available. Availability varies by market and timing." Value-prop 01: "Residences surface through relationships built over years across these markets." (drop the "informally available" repeat — it's already said in phase 02). CTA strip sub: "A 30-minute call is enough to define the brief. From there, Mia works the relationships against it." (no third repeat).
- **Reason:** The same idea — quietly available inventory, hedged — is stated three times on `/buyers/` and twice more on `/markets/fort-lauderdale/`. Doctrine "If a phrase repeats inside the same paragraph, replace the second instance with a pronoun or remove it" extends naturally to repeated phrasing across same-page sections. The hedged disclosure is doctrinally required but should only need to land once. CTA-strip "A short private conversation is the first step" is exactly the "if you'd like to talk" hedging pattern the scope flagged.
- **Risk if changed:** OfferCatalogSchema item 2 ("Brokerage-Relationship Sourcing") names "activation of Mia's brokerage and ownership relationships … including informally available opportunities" verbatim — JSON-LD must stay synced with the visible value-prop. The "Availability varies by market and timing" disclosure is a doctrine guardrail against off-market overclaim; keep it on phase 02 (which carries the action) and only optionally on the FAQ.
- **Factual / source-ledger review required:** no (preserves the disclosure; only reduces repetition)
- **Category:** 1 site/content/design defect

---

### Finding 4: FAQ "Do I have to be local…" — drop the soft "No" lead and compress

- **Route / file:** `out/buyers/index.html` (source: `src/app/buyers/page.tsx` `BUYER_FAQ[0]`)
- **Current copy:** "No. A meaningful portion of Mia's buyers are relocating from the Northeast, Midwest, California, and internationally. Virtual showings, video tours, and remote-closing coordination are routine."
- **Proposed copy:** "A significant share of Mia's buyers are relocating from the Northeast, Midwest, California, and internationally. Virtual showings, video walk-throughs, and remote-closing coordination are routine."
- **Reason:** The "No." answer to "Do I have to be local" is doctrinally fine but reads like a customer-service FAQ on a brokerage with a high local-walk-in mix. A relocating HNW buyer reading this page wants to be told *what* is routine, not reassured *that* it's allowed. Same diligence substance, sharper. "Significant share" reads less hedged than "meaningful portion."
- **Risk if changed:** This Q&A is mirrored in the FAQPage JSON-LD. Both must update.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 5: FAQ "Will I see privately offered residences…" — kill the second "informally available" hedge

- **Route / file:** `out/buyers/index.html` (source: `src/app/buyers/page.tsx` `BUYER_FAQ[2]`)
- **Current copy:** "When Mia knows your brief in detail, she shares any relevant opportunities her brokerage relationships surface — including informally available residences when those exist. Availability varies by market and timing; the brief is what enables the right introduction at the right moment."
- **Proposed copy:** "When the brief is detailed, Mia shares any relevant opportunities her brokerage relationships surface. The brief is what makes the right introduction possible at the right moment; availability still varies by market and timing."
- **Reason:** "Informally available residences when those exist" is the third repetition of the same hedge on this page (see Finding 3) and verges on the doctrine-banned overclaim register. The compliance-required "availability varies" disclosure is preserved verbatim, moved to a position that lands harder. The new opening ("When the brief is detailed") presumes the reader is serious, per scope.
- **Risk if changed:** JSON-LD FAQ must sync. The "informally available" / "availability varies" pair is the doctrinal honesty guardrail against off-market overclaim — both elements must remain somewhere on the page (Finding 3 already keeps "Availability varies by market and timing" in phase 02; this finding keeps it in the FAQ answer too). Do not drop both.
- **Factual / source-ledger review required:** yes (re-read after Finding 3 lands; the disclosure must remain present somewhere visible above the FAQ at least once)
- **Category:** 1 site/content/design defect

---

### Finding 6: CTAStrip — make the secondary verb presume intent

- **Route / file:** `out/buyers/index.html` (source: `src/app/buyers/page.tsx` `CTAStrip` `sub`; also `/markets/fort-lauderdale/` buyer-CTA panel)
- **Current copy:** "Tell Mia what you're looking for." / "A short private conversation is the first step. From there, Mia sources the right residences across her core markets — including any informally available opportunities her brokerage relationships uncover."
- **Proposed copy:** Heading: "Send Mia your brief." Sub: "A 30-minute call is enough to define the brief. From there, the search narrows to two or three serious candidates."
- **Reason:** "Tell Mia what you're looking for" reads like a saved-search prompt; "Send Mia your brief" presumes the reader has done the work. "A short private conversation is the first step" is the exact hedge the scope identified ("if you'd like to talk"). The 30-minute number is already used elsewhere on the site (`/markets/fort-lauderdale/` prelude: "The shortlists … happen in a 30-minute private call, not on a search page") and is the right concrete container.
- **Risk if changed:** "Tell Mia what you're looking for" is also the call-to-action heading on the Pompano Beach and Boca Raton market pages. If the new heading is adopted here, the parallel headings on neighbor pages should be revisited in a separate finding to avoid voice drift (out of scope for buyer-ICP pack). No schema risk.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 7: Fort Lauderdale buyer playbook step 01 — drop "first 60-90 minutes is conversation" framing

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` `BUYER_PLAYBOOK[0].body` (rendered at `/markets/fort-lauderdale/` § Buyer playbook)
- **Current copy:** "The first 60-90 minutes is conversation. Lifestyle anchors, timeline, vessel profile, architectural preference, and target price band. The brief filters listings; aesthetic enthusiasm does not. Relocation briefs add a remote-first phase, then a defined in-person stage."
- **Proposed copy:** "The brief is a written priority hierarchy: lifestyle anchors, timeline, vessel profile, architectural preference, target price band. It filters listings; aesthetic enthusiasm does not. Relocation briefs add a remote-first phase before any in-person stage."
- **Reason:** "The first 60-90 minutes is conversation" reads as both filler and a soft response-time promise (~"a meeting that lasts 60-90 minutes"). The doctrine bans response-time promises and discourages throat-clearing intros. Naming the *output* (a written priority hierarchy) rather than the *duration of the meeting* lands sharper and makes the next sentence flow logically. Diligence substance preserved verbatim.
- **Risk if changed:** None — no schema, no SEO term loss. The "30-minute call" duration anchor lives elsewhere on the same page (Finding 6) and is the cleaner duration claim to retain.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 8: Fort Lauderdale buyer FAQ Q3 — compress the saved-search-vs-brief framing

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` `FORT_LAUDERDALE_V2_FAQS[2]` (rendered at `/markets/fort-lauderdale/` § FAQ)
- **Current copy:** "A saved-search alert surfaces listings; a private buyer brief surfaces decisions. The brief is a written priority hierarchy — lifestyle anchors, vessel profile, architectural era, dockage requirements, timing — that becomes the filter applied to public listings and, where the brokerage relationships surface a fit, to pre-market introductions. Mia's role is to read the brief carefully enough to rule out three quarters of the market before any address is opened, then narrow to the two or three residences a serious search should actually consider."
- **Proposed copy:** "A saved-search alert surfaces listings; a buyer brief surfaces decisions. The brief is a written priority hierarchy — lifestyle anchors, vessel profile, architectural era, dockage requirements, timing. Mia uses it to rule out three quarters of the market before any address is opened, then narrows to the two or three residences worth seeing."
- **Reason:** ~80 words → ~55. Doctrine sentence-length threshold (28 words) violated by sentence two (44 words via the em-dash chain). The "where the brokerage relationships surface a fit, to pre-market introductions" clause is the *same* idea already covered three times on the upstream page (Finding 3) — removing it here removes a repeated hedge, not a unique fact. The diligence substance (priority hierarchy, rule out 75% before any address opened) is preserved verbatim. "Worth seeing" is plainer than "a serious search should actually consider."
- **Risk if changed:** This FAQ is rendered via the data-driven FAQ block; verify whether it also emits to a FAQPage JSON-LD on the Fort Lauderdale page. If yes, JSON-LD must sync.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 9: Buyer PDF intro paragraph — name the audience, not the document

- **Route / file:** `public/downloads/waterfront-buyer-due-diligence-checklist.pdf` (source: `src/data/lead-magnets/index.ts` first magnet `intro`)
- **Current copy:** "A working checklist for serious buyers of Fort Lauderdale waterfront residences. The list is organized by the diligence sequence Mia uses to structure private buyer-side conversations — survey first, water and dock data next, insurance underwriting before the offer. Each item is a question to bring to a licensed specialist, not a substitute for one."
- **Proposed copy:** "For serious buyers of Eastern Fort Lauderdale waterfront residences. Work through the sections in the order they appear — survey first, water and dock data next, insurance underwriting before the offer. Each item is a question to bring to a licensed specialist, not a substitute for one."
- **Reason:** "A working checklist for…" is a generic document-self-description that the title of the PDF already gives the reader. Leading with "For serious buyers of …" mirrors the buyer-ICP framing and removes the throat-clearing intro pattern. The "Mia uses to structure private buyer-side conversations" clause is recursive (it tells the buyer what the document does *for Mia*, not what it does for *them*); replacing it with an imperative ("Work through the sections in order…") sharpens the direction. Specialist-deferral disclaimer preserved verbatim. The "Eastern" qualifier is added because the rest of the document treats Eastern Fort Lauderdale as the implicit scope.
- **Risk if changed:** PDF must be re-rendered by `scripts/render-lead-magnets.ts`; the existing `audit-lead-magnets.ts` regression-checks the standalone HTML for banned phrases and structural invariants but does not check intro wording. Confirm the PDF byte-size sanity floor (`MIN_PDF_BYTES = 10_000`) is still cleared after the change. The "Mia coordinates; licensed specialists confirm" honesty contract is preserved in the existing `howToUse`, `specialists` items, and disclaimer block.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

## Notes on what was NOT changed (defended substance)

- All nine waterfront variables on the FL page (dock, seawall, bridge clearance, route-to-inlet, canal width, lot orientation, architectural era, flood/elevation, insurance/4-point) preserved verbatim — this is the diligence substance the scope explicitly protects.
- AVM-skepticism content on `/insights/why-automated-valuations-miss-luxury-waterfront/` was not touched (out of buyer-FAQ scope; lives on the seller-side reviewer pack).
- All disclaimers, REALTOR® / LPT Realty / FL License #SL3405877 / EHO strings preserved verbatim.
- Buyer PDF source-ledger, checklist items, red flags, specialist roster, "Mia coordinates; licensed specialists confirm" line, and PDF use agreement preserved verbatim.
- The hedged "Availability varies by market and timing" language is preserved (only its repetition reduced from 3x → 1-2x on the same page).
- No banned terms introduced. Verified against: "definitive access point", "exclusive access", "guaranteed access", "off-market access", "private inventory", "MLS bypass", "same-business-day response", "within 24 hours", "world-class", "premier", "elite", "white-glove", "bespoke", "high-net-worth", "off-market", "since 2017", "within two hours", "as seen in/on", "best schools", "good schools", "safe neighborhood", "family-friendly", "kid-friendly", "#1 realtor", "top realtor", "best realtor", "guaranteed sale/price".
