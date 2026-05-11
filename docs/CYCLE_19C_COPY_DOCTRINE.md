# Cycle 19C-COPY — Mia Site Copy Doctrine

> Authored 2026-05-11 during Cycle 19C-COPY. The voice target for sitewide copy compression on `miasanabriarealtor.trueidea.com`. Use this doctrine when editing any page, FAQ, CTA, footer, or PDF source on the Mia Sanabria website.

## Audience

Serious waterfront and luxury buyers and sellers in eastern Broward and southern Palm Beach counties, mostly Eastern Fort Lauderdale finger isles, eastern Boca Raton, eastern Delray Beach, and Pompano Beach waterfront. They are not browsing — they are deciding. They want diligence substance, not SEO filler. Many have done at least one prior waterfront transaction; few want to be sold to.

## Voice

- **Private** — the page reads like the start of a private conversation, not a mailer.
- **Patient** — sentences breathe; the writer is not in a hurry.
- **Precise** — every claim is specific (canal width, bridge clearance, 4-point sequence). No hand-waving.
- **Calm** — no superlatives unless verifiable.
- **Useful** — every paragraph teaches or moves the reader closer to a decision.
- **Luxury without bragging** — strong nouns, restrained adjectives, no "elite" / "premier" / "world-class".
- **Advisory without sounding legal** — friendly clarity, not a disclaimer document.
- **Discreet without implying secret inventory** — never imply MLS-bypass, off-market access, or private inventory streams.
- **Specific without SEO stuffing** — name places once, name diligence variables specifically, then move on.

## Avoid

- Repeated geography in the same paragraph. "Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach" inside one sentence and again in the next is a smell.
- Stacking "luxury and waterfront" multiple times in one paragraph.
- "Guidance" used mechanically as filler ("expert luxury guidance for buyers and sellers across…"). One "guidance" per section, max.
- Throat-clearing intros ("In today's competitive market…", "Whether you are buying or selling…", "When it comes to…").
- Sentence chains with multiple "and"s and commas before reaching the noun.
- Compliance overclaim language: "definitive access point", "exclusive access", "private access" to homes/inventory, "guaranteed", "off-market", "private inventory", "MLS bypass".
- Response-time promises ("same-business-day response", "within X hours").
- Fake freshness ("just listed", "new listings every week") unless source-ledger-backed and current.
- Awards, languages, credentials, MLS/IDX claims, brokerage affiliations not verified in source ledger.
- Legal/insurance/tax/inspection advice — refer to the appropriate professional.

## Preferred patterns

- **One idea per sentence.** If a sentence has two ideas joined by "and" or a comma, ask whether splitting reads sharper.
- **One CTA per section** where practical. Two CTAs only when buyer and seller paths split naturally.
- **Strong nouns, restrained adjectives.** "Guidance" over "expert luxury guidance." "Survey" over "thorough survey review." Adjectives earn their place when they carry real information ("4-point survey", "fixed-bridge clearance").
- **Short explanatory copy + clear next action.** Set context in one or two sentences, then point to the next step.
- **Geography once per paragraph.** First mention is the full named place; subsequent references use pronouns or "the area" / "the corridor" / "these isles".
- **Preserve waterfront diligence substance.** Survey, dock, seawall, bridge clearance, route-to-inlet, insurance/4-point, AVM skepticism — these are the reason this site is useful. Do not delete them to make pages shorter.
- **Preserve disclaimers and source-ledger lines verbatim.** Compression cannot delete a required disclaimer. If a disclaimer feels heavy, leave it heavy.
- **Compliance language preserved.** REALTOR®, brokerage name, license number, Equal Housing Opportunity, MLS attribution — verbatim or improved presentation, never removed.

## Decision rules

- If a paragraph is over 55 words and the extra words do not add diligence substance, compress.
- If a sentence is over 28 words and splitting preserves meaning, split.
- If a phrase repeats inside the same paragraph, replace the second instance with a pronoun or remove it.
- If a CTA repeats inside the same section twice with different verbs, pick one.
- If a section header restates the next paragraph's first sentence, kill the duplication (usually drop the redundant intro sentence).
- If a disclaimer is required, keep it.
- If a factual claim is not in the source ledger, remove the claim.
- If you cannot tell whether a claim is in the source ledger, treat it as not in the ledger.

## Banned-term list (mirrored in `audit:copy-density`)

- "definitive access point"
- "exclusive access"
- "guaranteed access"
- "off-market access"
- "private inventory"
- "MLS bypass"
- "same-business-day response"
- "within 24 hours" (as a response-time promise)
- "world-class" / "premier" / "elite" used as undifferentiated luxury filler

## Footer pattern (locked for this cycle)

> "Private guidance for waterfront and luxury homes from Fort Lauderdale to Boca Raton and Delray Beach. Expect a patient conversation delivered with discretion and nuance."

Two sentences. One enumeration of geography. Ends on brand voice ("discretion and nuance"). Compliance-clean.

## Reviewer-pack format (binding for Cycle 19C-COPY)

Each reviewer-pack finding must include, in markdown:

```
### Finding {N}: {short title}

- **Route / file:** `{path}`
- **Current copy:** "{verbatim excerpt}"
- **Proposed copy:** "{verbatim proposal}"
- **Reason:** {one-sentence justification grounded in this doctrine}
- **Risk if changed:** {what could go wrong — schema, SEO, compliance, CTA loss, etc.}
- **Factual / source-ledger review required:** yes | no
- **Category:** 1 site/content/design defect | 2 tool/process defect | 3 principal decision | 4 GHL/ops dependency | 5 legal/compliance dependency | 6 launch/cutover dependency
```

A pack must include at least 3 findings or an explicit "no findings within scope" with rationale.
