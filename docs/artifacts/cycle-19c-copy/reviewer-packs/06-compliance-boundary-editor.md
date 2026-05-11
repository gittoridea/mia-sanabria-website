# Cycle 19C-COPY — Reviewer pack 06: Compliance Boundary Editor

> Role: catch sitewide overclaims — response-time promises, off-market /
> MLS-bypass implications, unsupported credentials/awards/reviews, implied team
> or partners, legal/insurance/tax/inspection advice phrased as authoritative,
> and presentation of REALTOR®, MLS, brokerage, license number, and Equal
> Housing Opportunity. Doctrine reference: `docs/CYCLE_19C_COPY_DOCTRINE.md`
> §"Avoid" + banned-term list (lines 22-33, 56-66). Pattern bank
> reference: `scripts/audit-no-fabrications.ts`.

## Executive summary

Eight findings. The compliance posture is **mostly clean** — the existing
`audit-no-fabrications.ts` regex bank has already deterministically excluded
the highest-risk strings (years-experience fabrication, transaction-volume
fabrication, fastest/instant response, off-market guarantee, languages
claim). The remaining risk is **softer-form copy that implies the same
things** without tripping the regexes:

1. The contact page renders a literal **"Response Window: Same business
   day / After-hours inquiries returned the following morning"** service
   promise in both visible DOM and FAQPage JSON-LD. This contradicts the
   doctrine's banned-term list line 64 ("same-business-day response") and the
   `audit-no-fabrications` `same-business-day-response` gate. Source: it is
   spelled "Same business day" (with a space) rather than the hyphenated
   form the regex catches — a regex-escape, not a doctrine-compliance.
2. The contact page FAQ states **"Private listing discussions, valuation
   conversations, and acquisition planning are handled discreetly and
   never appear on any marketing list"** — visible DOM + FAQPage schema.
   "Private listing discussions" implies a stream of private listings; this
   sits on the doctrine line-28 boundary of "private inventory" / "off-market
   access" framing.
3. The sellers page meta description and rendered intro promise **"private
   brokerage relationships"** as a deliverable. This is a marketable
   relationship claim, not an off-market guarantee, but the phrasing
   structurally implies a private broker network that produces listings.
4. The disclaimer **"Not legal, insurance, inspection, marine survey,
   engineering, tax, or lending advice"** appears only on
   `/markets/fort-lauderdale/` and the three downloadable checklist pages.
   The Boca Raton, Delray Beach, and Pompano Beach market pages give
   diligence checklists ("Buyers should add dockage and bridge-clearance
   review", "milestone-inspection and reserve status", "hurricane and
   salt-air maintenance history") with no licensed-pro deferral or
   disclaimer. The valuation, buyers, sellers, about, contact, and home
   pages also lack a sitewide professional-advice disclaimer.
5. The license-credential label is **inconsistent**: footers (sitewide) say
   "FL Sales Associate License # SL3405877"; `/terms/` body and the three
   downloadable checklist pages say "FL License # SL3405877". Florida FREC
   convention is the longer form; the shorter form is the lazy variant.
6. The home page renders **"the right residence often surfaces through
   introduction rather than the open MLS"** in a Bay-Colony specific
   paragraph also embedded on `/` and `/markets/bay-colony/`. In Bay-Colony
   context this is defensible market description; on the home page it can
   read as a generalized MLS-bypass implication.
7. The home page also renders **"The working pre-introduction pass for
   sellers who choose the quieter path"** as a CTA-style label for the
   private-market-conversation card. "Pre-introduction" and "quieter path"
   are the soft-form of MLS-bypass framing.
8. The Fort Lauderdale market page miaQuote field reads **"the undisputed
   yachting capital of the world"** — superlative without a verifiable
   source. Doctrine line 14 ("no superlatives unless verifiable"). This is
   a quote attributed to Mia, so it is principal copy, but it still ships
   in JSON-LD and Open Graph.

**Findings classes checked with NO findings within scope:**

- **"definitive access point" / "exclusive access" / "guaranteed access" /
  "off-market access" / "private inventory" / "MLS bypass" / "MLS database
  access" / "direct MLS access" (literal strings):** zero hits.
  Evidence: `grep -roiE "(definitive access|exclusive access|guaranteed
  access|off-market access|private inventory|MLS bypass|direct MLS|MLS
  database)" out/ src/ public/` → no matches.
- **Unsupported credentials / awards / designations** (Five-Star, Top
  Producer, Million-Dollar Club, Circle of Excellence, CRS, GRI, ABR,
  SRES, etc.): zero hits in visible copy. Evidence: refined grep over
  rendered HTML, all hits were false positives ("FEMA flood zone
  designation", "zoning designation").
- **Languages-spoken claims:** zero hits. Evidence: `grep -oiE "speaks?
  \d+ languages|fluent in \d+ languages|bilingual|trilingual|languages
  spoken"` → no matches.
- **Client reviews / testimonials / star ratings:** zero hits.
  Evidence: all "reviews" occurrences in `/valuation/` are the verb form
  ("Mia reviews architectural era") — no testimonial UI, no star widget,
  no review schema.
- **Implied team / partners / associates:** zero hits. Evidence: `grep
  -oiE "(our team|the team|team of|joined the team|associates include|
  partnered with|partners include)"` → no matches in rendered copy.
- **24/7 / around-the-clock / always-available claims:** zero hits.
  Evidence: `grep -oiE "(24/7|around the clock|always available|reach
  out anytime|available anytime|available 24)"` → no matches.
- **REALTOR® mark casing:** lowercase `realtor` appears only in URL
  slugs and image asset filenames (`/realtor-r.png`,
  `miasanabriarealtor.trueidea.com`). Visible copy is consistently
  `REALTOR®` or `REALTORS®` with the federally registered mark.
- **Equal Housing Opportunity presence:** the `equal-housing.png` logo
  + "Equal Housing Opportunity" text-label render in every sitewide
  footer. Evidence: present in `out/index.html`, `out/about/index.html`,
  `out/contact/index.html`, all four legal pages, and every market
  page.
- **IDX disclaimer:** "All information is deemed reliable but not
  guaranteed. IDX listings provided for consumers' personal,
  non-commercial use; not for redistribution." renders in every page
  footer. Evidence: grep over all routes returns the disclaimer string
  on every rendered HTML.

> Format note: I find seven flag-worthy items + one "should add" gap (the
> sitewide professional-advice disclaimer). The pack documents all eight
> below.

---

### Finding 1: Contact page literal "Same business day" service promise

- **Route / file:** `/contact/` —
  `src/app/contact/page.tsx` lines 32 (FAQPage schema) + 103
  (Response Window stat tile)
- **Current copy:**
  - Visible DOM, in a `dl`/`dd` Response Window tile:
    > "Response Window — Same business day — After-hours inquiries
    > returned the following morning"
  - FAQPage JSON-LD `acceptedAnswer` for "How does Mia handle a private
    inquiry?":
    > "Inquiries received during business hours are reviewed and replied
    > to during the same business day; after-hours messages are returned
    > the following morning. For urgent matters, call (954) 540-0358
    > directly."
- **Proposed copy:**
  - Stat tile: replace the "Response Window" tile with **"Reply
    cadence — Personally reviewed; reply by the next business day where
    possible."** OR remove the tile entirely. Do not promise a window.
  - FAQ answer: **"Inquiries are reviewed personally and answered
    privately. For time-sensitive matters, call (954) 540-0358."** Drops
    the "same business day" promise and the after-hours commitment.
- **Reason:** Doctrine banned-term list line 64 explicitly bans
  "same-business-day response"; the doctrine §"Avoid" line 29 bans
  response-time promises. `audit-no-fabrications.ts` already pattern-bans
  the hyphenated form (`Same-business-day response`); the contact page
  currently ships the space-separated form (`Same business day`), which
  is a regex-escape but a doctrine violation.
- **Risk if changed:** (a) FAQ JSON-LD `text` field changes — verify
  `audit:schema` does not assert verbatim text on this question.
  (b) Removing the Response Window stat tile loses one of three visible
  stats — visual rhythm may need a replacement tile (license #?
  service area? brokerage?). (c) Contact-page CTA copy is referenced
  elsewhere — search for "Same business day" across `src/` before edit.
- **Factual / source-ledger review required:** yes — the principal
  has historically chosen to omit response-time promises this cycle
  (per `audit-no-fabrications.ts` header comment "Cycle 19B-FL Q2
  approval (which Mia chose to omit this cycle)"). Confirm she has not
  re-approved.
- **Category:** 5 legal/compliance dependency

---

### Finding 2: "Private listing discussions" framing in contact FAQ

- **Route / file:** `/contact/` —
  `src/app/contact/page.tsx` (FAQPage entry "Is the initial consultation
  confidential?")
- **Current copy:**
  > "Yes — every initial conversation is treated as confidential.
  > Private listing discussions, valuation conversations, and
  > acquisition planning are handled discreetly and never appear on any
  > marketing list."
- **Proposed copy:**
  > "Yes — every initial conversation is treated as confidential.
  > Pricing conversations, valuation reviews, and acquisition planning
  > are handled privately and are not used for marketing follow-up."
- **Reason:** "Private listing discussions" implies a class of listing
  Mia has access to that the public does not. Even if the intent is
  "discussions about a listing, conducted privately," the noun phrase
  reads as "discussions of private listings." Doctrine line 18
  ("Discreet without implying secret inventory") + banned-term list line
  61 ("private inventory") + §"Avoid" line 28
  ("'private access' to homes/inventory").
- **Risk if changed:** FAQPage JSON-LD `text` value changes — schema
  audits that verify exact-text-match would fail. Confirm
  `scripts/audit-schema.ts` does not assert this string. Also: the
  rewrite drops the word "listing", which is a CTR keyword on FAQ
  rich-results — accept the SEO cost in exchange for compliance.
- **Factual / source-ledger review required:** no
- **Category:** 5 legal/compliance dependency

---

### Finding 3: "Private brokerage relationships" in sellers meta + intro

- **Route / file:** `/sellers/` —
  `src/app/sellers/page.tsx` (page metadata + hero/intro)
- **Current copy:**
  > "Tailored marketing for Southeast Florida residences — editorial
  > photography, private brokerage relationships, and strategic pricing
  > for market velocity."
- **Proposed copy:**
  > "Tailored marketing for Southeast Florida residences — editorial
  > photography, professional broker outreach, and strategic pricing
  > calibrated for market velocity."
- **Reason:** "Private brokerage relationships" reads as a deliverable
  ("we will introduce your listing to a private broker network"), which
  is structurally the off-market / MLS-bypass implication the doctrine
  forbids (lines 18, 28, 61). "Professional broker outreach" describes
  the same activity without the secret-network framing.
- **Risk if changed:** Meta description changes affect SERP CTR and
  `audit:seo` snapshot. Confirm `audit-seo` does not assert verbatim
  meta-description text. Also: this string appears in OG tags;
  social-card preview will refresh after deploy.
- **Factual / source-ledger review required:** no
- **Category:** 5 legal/compliance dependency

---

### Finding 4: Professional-advice disclaimer is not sitewide

- **Route / file:** every page that gives diligence/insurance/inspection
  guidance — currently disclaimer present only on
  `/markets/fort-lauderdale/`, `/downloads/luxury-seller-pre-listing-checklist/`,
  `/downloads/waterfront-buyer-due-diligence-checklist/`,
  `/downloads/fort-lauderdale-waterfront-valuation-prep-sheet/`. Missing on
  `/markets/pompano-beach/`, `/markets/boca-raton/`, `/markets/delray-beach/`,
  `/valuation/`, `/buyers/`, `/sellers/`, `/about/`, `/contact/`, `/`,
  `/insights/*` posts, and all legal pages other than `/dmca/`.
- **Current copy:** disclaimer renders in FL page footer micro-strip:
  > "Not legal, insurance, inspection, marine survey, engineering, tax,
  > or lending advice."
  No equivalent on the other listed pages. Pompano page tells buyers to
  "weigh CRA timelines and the construction context" + "milestone-inspection
  and reserve status (for condominium)"; Delray page tells buyers to "add
  dockage and bridge-clearance review on top of the standard single-family
  checks"; none defer to a licensed professional.
- **Proposed copy:** add the same micro-strip to the **sitewide layout
  footer** (`src/components/SiteFooter.tsx` or equivalent) just above the
  IDX disclaimer. Single line, 11px text, same tone as the existing
  Fort Lauderdale instance. This means it ships on every route — legal
  pages, market pages, blog posts, downloads, home, contact, about.
- **Reason:** Doctrine §"Avoid" line 32 ("Legal/insurance/tax/inspection
  advice — refer to the appropriate professional") + line 17 ("Advisory
  without sounding legal"). Once one page on the site gives this kind
  of advice (and several do), all the pages need the same deferral.
- **Risk if changed:** (a) Footer height grows by one row sitewide —
  mobile-readability artifacts may need re-capture. (b) The legal pages
  (`/dmca/`, `/terms/`, `/privacy/`, `/accessibility/`) already have
  similar deferrals in body copy; sitewide footer would double-stamp on
  those pages — acceptable. (c) `audit:rendered` snapshot of footer
  changes — re-capture mobile-readability artifacts at 320/375/414/768.
- **Factual / source-ledger review required:** no
- **Category:** 5 legal/compliance dependency

---

### Finding 5: License-credential label inconsistent across pages

- **Route / file:** `/terms/` body copy and three downloadable checklist
  pages — `src/app/terms/page.tsx`, `src/app/downloads/*/page.tsx`.
- **Current copy:**
  - Sitewide footer (`SiteFooter` component): **"FL Sales Associate License
    # SL3405877"**.
  - `/terms/` body paragraph + three downloads pages:
    **"FL License # SL3405877"**.
- **Proposed copy:** standardize on **"FL Sales Associate License #
  SL3405877"** everywhere — that is the canonical FREC term and the
  form the sitewide footer already uses. Replace the three downloads-page
  and one terms-page body instances of "FL License #" with the longer
  form.
- **Reason:** Doctrine §"Preferred patterns" line 44 ("Compliance
  language preserved... verbatim or improved presentation, never
  removed"). Two presentations of the same regulated identifier on the
  same site is a credibility tax with no upside.
- **Risk if changed:** Trivial — string replace. Confirm
  `audit:no-fabrications`, `audit:legal`, and any audits that match
  on "FL License #" verbatim are not pinned to the short form.
- **Factual / source-ledger review required:** yes — confirm with
  principal that "Sales Associate" is the correct FREC license class
  (yes, per SL prefix), so the longer label is accurate.
- **Category:** 5 legal/compliance dependency

---

### Finding 6: "Surfaces through introduction rather than the open MLS" on home

- **Route / file:** `/` (home) — Bay-Colony-spotlight paragraph also
  re-rendered on `/markets/bay-colony/`. Source: market data file
  (likely `src/lib/markets.ts` → `bay-colony.miaQuote` or similar
  long-form description) consumed by both the home featured-markets
  pager and the dedicated Bay Colony page.
- **Current copy:**
  > "Buyers should expect a longer search horizon and treat the
  > neighborhood as a relationship-driven market rather than a
  > public-listing market — the right residence often surfaces through
  > introduction rather than the open MLS."
- **Proposed copy:**
  > "Buyers should expect a longer search horizon. The neighborhood
  > trades less frequently than the broader market, and serious
  > buyers benefit from a patient, well-briefed search alongside
  > standard MLS coverage."
- **Reason:** "Surfaces through introduction rather than the open MLS"
  generalizes — on the dedicated Bay Colony page it describes a real
  market characteristic of a 70-home gated peninsula. On the home
  page, where it appears in a featured-markets pager card, it reads as
  a marketing claim about Mia's process across the entire site.
  Doctrine line 18 + line 28.
- **Risk if changed:** This string lives in a shared data file —
  editing it changes both `/` and `/markets/bay-colony/`. Either edit
  both pages identically OR fork the copy. Audit `audit:featured-markets`
  for verbatim assertions.
- **Factual / source-ledger review required:** yes — confirm with
  principal whether Bay Colony deserves a distinct, scarcity-led
  description on its own page vs. a more general description in the
  home pager.
- **Category:** 5 legal/compliance dependency

---

### Finding 7: "Pre-introduction pass" and "quieter path" CTA framing on home

- **Route / file:** `/` — home page seller-CTA card.
- **Current copy:**
  > "Private-market conversations require different preparation than
  > MLS listings — documentation, photography brief, dockage proof, and
  > strategic discretion. The working pre-introduction pass for sellers
  > who choose the quieter path."
- **Proposed copy:**
  > "A pre-listing preparation pass for sellers considering a careful,
  > deliberate market entry — documentation, photography brief, dockage
  > proof, and strategic discretion. Standard MLS marketing follows once
  > the residence is ready."
- **Reason:** "Pre-introduction pass" + "quieter path" are softer
  synonyms for "off-market introduction." Doctrine line 28 bans the
  framing ("private access" / "MLS bypass"). "Pre-listing preparation"
  is the honest equivalent: pre-listing prep is a real service, and
  saying "MLS marketing follows" anchors the activity to the public
  market rather than an alternative to it.
- **Risk if changed:** Home-page card copy — possibly schema-asserted.
  Check `audit:seo`, `audit:completeness`, and `audit:rendered`
  snapshots. The phrase "private-market conversations" appears in
  several places (home, FL market, downloads) — only the home-page
  CTA card needs the rewrite; the diligence prose elsewhere uses the
  phrase neutrally.
- **Factual / source-ledger review required:** no
- **Category:** 5 legal/compliance dependency

---

### Finding 8: "Undisputed yachting capital of the world" superlative

- **Route / file:** `/markets/fort-lauderdale/` —
  `src/lib/markets.ts` (`fort-lauderdale.miaQuote` field) — also emitted
  in JSON-LD `description` and OG tags via this data source.
- **Current copy:**
  > "Known globally as the 'Venice of America,' Fort Lauderdale is the
  > undisputed yachting capital of the world."
- **Proposed copy:**
  > "Known globally as the 'Venice of America,' Fort Lauderdale is
  > widely recognized as one of the world's leading yachting centers —
  > home to the Fort Lauderdale International Boat Show (FLIBS), the
  > largest in-water boat show by exhibitor count."
- **Reason:** Doctrine voice rule line 14 ("no superlatives unless
  verifiable"); §"Avoid" line 25 (filler) implicitly. "Undisputed
  yachting capital of the world" is a marketing superlative with no
  authoritative source. FLIBS-largest-by-exhibitor-count is
  verifiable from FLIBS / Show Management public materials and
  carries the same brand value without the superlative.
- **Risk if changed:** This is attributed to Mia as a quote
  ("miaQuote"). Editing changes principal-voice content — must be
  principal-approved. Also: schema `description` and OG `og:description`
  may reference this string; rebuild verifies.
- **Factual / source-ledger review required:** yes — confirm with
  principal that the FLIBS-largest framing is acceptable and that the
  Venice-of-America nickname stays. Also: FLIBS-largest-by-exhibitor
  must be confirmed against current show data (it has held that ranking
  for years but verify).
- **Category:** 3 principal decision (Mia owns the quote) + 5
  legal/compliance dependency (superlative risk)

---

## Audit-script alignment notes

- `scripts/audit-no-fabrications.ts` already pattern-bans the six classes
  documented in its header (off-market guarantee, transaction volume,
  years experience, languages, fastest/instant response, hyphenated
  same-business-day). **Finding 1** above is a regex-escape — the contact
  page ships "Same business day" (with space) which the
  `Same-business-day` regex does not catch. Recommend either (a)
  extending the regex in `audit-no-fabrications.ts` to include the
  space-separated form, or (b) fixing the contact page so the gap
  becomes moot. Both are cheap.
- `scripts/audit-stale-terms.ts` per project CLAUDE.md governs the
  luxury-as-practice / Fair Housing / FREC-superlative banned-term
  catalog. **Finding 8** (superlative) and **Finding 3** (private
  brokerage relationships) may already be in scope — confirm by reading
  `scripts/audit-stale-terms.ts` and extending the catalog if not.
- The compliance posture is mature — the framework is in place,
  the regex coverage is reasonable, and the cycle's job here is to
  close the soft-form gaps, not rebuild scaffolding.
