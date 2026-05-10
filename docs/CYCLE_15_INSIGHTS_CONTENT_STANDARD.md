# Cycle 15 — Insights Content Standard

> The bar every post must clear before launch. Used by `audit:insights` and the Forge separate-context VERIFY pass.

## 1. Premium intro

- 90-140 words.
- Names the buyer/seller use case in the first two sentences.
- No generic SEO opener ("In today's competitive market…", "When it comes to…").
- No question-stuffing ("Are you a buyer? Are you a seller?").
- No keyword-loaded first paragraph.
- Voice anchor: matches Mia's tone — careful, specific, written-from-experience.

## 2. AEO answer block

- 75-125 words.
- Direct answer to a useful question — the question lives in the post's `aeoQuestion` field.
- Renders inside a styled aside (`luxury-divider` + `bg-cream-50` accent), aria-labeled "Quotable summary".
- Suitable for AI assistant extraction (clear noun-verb structure, no hedging clauses).

## 3. 4-6 substantive sections

- Each section has an H3 subhead naming the specific topic.
- Body paragraphs 2-5 each, conversational-but-precise.
- Sections must be substantive — no filler ("Here are some things to consider…").
- Where useful, sections may include a short ordered list or definition pair.
- No section may exist solely to host a CTA.

## 4. "What Mia would clarify privately" section

- Mandatory on every post.
- 60-100 words, present-tense.
- Frames Mia's value as the routing layer between the buyer/seller and the technical due diligence (inspectors, surveyors, brokerage relationships).
- Never claims Mia personally performs inspections / surveys / engineering reviews.
- Never overclaims access to "private inventory" — frame as "private conversations through brokerage relationships".

## 5. Market links

- 3-6 internal links to relevant `/markets/[slug]/` pages.
- Contextual — embedded in prose, not stacked at the bottom.
- Use canonical link text: market `name` field, never invented variations.
- Verified by `audit:insights` (every post links to ≥2 market pages).

## 6. Lead-capture CTA

- One **primary** CTA at the end of the post (`LeadCaptureCTA`, post-type-specific variant).
- One **soft** CTA inline mid-article (`InlineInsightCTA`).
- Luxury tone — see `CYCLE_15_INSIGHTS_AND_LEAD_CAPTURE_STRATEGY.md` §8 for banned vs. preferred copy.
- Routes to existing pages (`/contact/`, `/valuation/`, `/markets/[slug]/`) with attribution params.
- Never claims CRM capture, automated follow-up, guaranteed response time.

## 7. Compliance-safe language

| Banned | Reason |
|---|---|
| School-quality / school-district / school-rating mentions | Fair-housing steering risk |
| Family-composition / "great for families" / "kid-friendly" framing | Fair-housing steering risk |
| Race, religion, national-origin, disability, familial-status references | Fair-housing |
| "Exclusive private inventory" / "off-market exclusive listings I have access to" | Overclaim — Mia has brokerage relationships, not exclusive listings |
| "Guaranteed sale price" / "guaranteed sale within N days" / "guaranteed response within N hours" | Overclaim |
| Specific MLS membership beyond what `MIA.unverified.designations` confirms | Pending DBPR primary-source confirmation |
| Specific dockage rental rates / specific bridge clearance numbers | Variability + would require live-source proof |
| "I'll find you the lowest price" / "highest sale price" | Outcome guarantee |
| "Don't miss out" / "act now" / "limited inventory" / "selling fast" urgency | Spammy + often false |
| "Free home report" / "instant home value" / "discover your home's value" | Mass-market language inconsistent with luxury positioning |
| Disparagement of named competitor tools (Zillow, Redfin, Realtor.com) | Frame as "category limitation" not "specific tool failure" |

## 8. Metadata / schema

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | ≤60 chars, includes "Mia Sanabria" suffix |
| `description` (meta) | Yes | ≤160 chars, written for the post not the library |
| `canonical` URL | Yes | `${SITE.url}/insights/${slug}/` |
| OpenGraph block | Yes | image, title, description, url, type=article |
| Twitter card | Yes | summary_large_image |
| `Article` (or `BlogPosting`) JSON-LD | Yes | full schema-dts compliance |
| `BreadcrumbList` JSON-LD | Yes | Home → Insights → Post |
| `FAQPage` JSON-LD | Optional | Where the post has 3+ Q&A pairs |
| `author` | Yes | `{ "@id": "${SITE.url}/#person" }` (links to existing PersonSchema, no fabricated author bio) |
| `publisher` | Yes | `{ "@id": "${SITE.url}/#organization" }` |
| `datePublished` | Yes | Honest current date — no backdating |
| `dateModified` | Yes | Honest revision date |
| `inLanguage` | Yes | `"en-US"` |
| `image` | Yes | OG image URL |
| `mainEntityOfPage` | Yes | Canonical URL |
| `about` | Yes | Place / Thing entities relevant to the post |
| `keywords` | Optional | Topic + market |
| `wordCount` | Optional | Honest word count |

## 9. Word-count target

- 900-1,400 words preferred.
- 600-900 words acceptable for time-constrained launches; flag the highest-priority 4 for deeper expansion.
- Never below 600 words for a launched post (audit enforces).

## 10. Honesty checklist (Forge VERIFY runs this)

- [ ] No fake historical date.
- [ ] No fabricated stat, sales number, or DOM figure.
- [ ] No fabricated MLS-membership / private-inventory / award / designation claim.
- [ ] No school / family steering.
- [ ] No outcome guarantee.
- [ ] No spammy urgency.
- [ ] No competitor disparagement by name.
- [ ] No claim of CRM capture, automation, or guaranteed response time.
- [ ] Boca Raton + Delray Beach correctly identified as Palm Beach County (never Broward).
- [ ] Hillsboro Mile correctly identified as a Broward barrier-island municipality.
- [ ] Bay Colony + Bermuda Riviera identified as Eastern Fort Lauderdale neighborhoods (Cluster: neighborhood).
- [ ] Mia framed as routing layer to inspectors/surveyors, never as the inspector/surveyor herself.
- [ ] No `mia@miasanabriarealtor.com` — canonical email stays `msanabriarea@gmail.com`.
- [ ] Phone `(954) 540-0358` if cited renders as `tel:+19545400358`.
- [ ] Brokerage `LPT Realty` if cited matches canonical `MIA.brokerage.display`.

## 11. Editorial structure template

```
[Eyebrow: Insights · <Topic Category>]
[H1: Post title]

[Premium intro — 90-140 words]

[Aside: AEO answer block — 75-125 words, aria-labeled "Quotable summary"]

[Body intro — 1-2 paragraphs framing the topic]

[H3: Section 1 subhead]
[Body paragraphs]

[H3: Section 2 subhead]
[Body paragraphs]

[InlineInsightCTA — soft CTA mid-article]

[H3: Section 3 subhead]
[Body paragraphs]

[H3: Section 4 subhead]
[Body paragraphs]

[Optional: H3 Section 5/6]

[H3: What Mia would clarify privately]
[60-100 words]

[Related markets module — 3-6 market cards or links]

[LeadCaptureCTA — primary CTA]

[Optional: FAQ block if post has 3+ Q&A pairs]
```
