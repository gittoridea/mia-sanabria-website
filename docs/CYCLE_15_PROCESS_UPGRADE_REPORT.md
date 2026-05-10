# Cycle 15 — Process Upgrade Report (2026-05-10)

> Durable lessons from Cycle 15 worth carrying into the Website Production Loop skill.

## Lesson 1 — Date governance for content libraries

When the principal asks "1 post per month over the last 12 months" the implementer's first instinct is to backdate publish dates to fit the request. **That is the wrong instinct.** Every backdated post is a fabrication that future audits, the principal's own review, and any AI scraper will eventually reveal. The correct response is to honestly publish current-dated posts and use a separate editorial field — `topicMonth` in this cycle — to organize the library as a 12-month guide series.

**Carried forward to skill v0.4.0:**
- New rule: "Honest dates only. `datePublished` and `dateModified` reflect actual publication. Editorial framing (topicMonth, seasonalFocus, marketCycleMonth) is separate and never confused with publish history."
- New audit pattern: `audit:insights` (or equivalent) enforces "no datePublished older than 7 days at audit time without an explicit `editorial.republished_from` field documenting the original publication date."

## Lesson 2 — Lead-capture architecture can ship before form wiring

The pattern Cycle 15 proved out: ship the **components, attribution scheme, and acknowledgement routes** as a complete UI surface that does not depend on the CRM/form-endpoint integration. CTAs route to existing inquiry pages with URL attribution params; thank-you routes exist as stubs ready for the eventual GHL redirect target; the architecture document fully specifies the GHL/n8n mapping for the next engineering cycle.

This is materially different from "ship a contact form that POSTs to /dev/null and hope". The user gets a complete conversion surface; the operator gets a clean substrate for the next cycle's wiring.

**Carried forward to skill v0.4.0:**
- New phase pattern: "Lead-capture surfaces ship in 3 layers — Layer A: components + attribution params (no GHL needed). Layer B: thank-you/redirect targets (stubs, noindex). Layer C: GHL form action + webhook + pipeline tags (requires unblocked GHL)."
- Each layer is independently shippable and useful in isolation.

## Lesson 3 — Sitewide content weaving is a first-class pass

Cycles 1-14 treated cross-page linking as an audit concern (reverse-link curation in Cycle 14). Cycle 15 elevated it to a first-class architectural pass: a `RelatedInsightsModule` component that takes either a `marketSlug` (data-driven) or an explicit `slugs` array (editorial), and is wired into 7 distinct page surfaces in one cycle.

The result is +867 internal links in one cycle without any per-page hand-coding. The data model + reusable module did the work.

**Carried forward to skill v0.4.0:**
- New pattern: "When introducing a new content surface (insights, listings, case studies), build the module that surfaces them on existing pages BEFORE the surface itself feels complete. Sitewide weaving is the conversion gain."

## Lesson 4 — audit:insights as a content governance layer

The audit script caught real defects within minutes of being written:
- 6 explicit FAILs on first run (county-conflation regex too loose; market-link min was checking only primary; banned phrase matched even in negative-assertion context)
- Iterative tightening produced a clean 535/0/0 audit
- The audit is now load-bearing infrastructure — if a future post drifts on dates, fabrication, schema, or county tagging, the chain breaks.

**Carried forward to skill v0.4.0:**
- New rule: "Every new content category gets an audit script before the category ships at scale. Content libraries without an audit drift; with an audit, drift is mechanical to detect."
- New audit-design pattern: county-consistency check requires positive-assertion regex (NOT a substring match) so negation patterns ("Boca is in Palm Beach, not Broward") don't false-fail.

## Lesson 5 — Forge race-scope-drift defended successfully

Per `feedback_forge_race_scope_drift.md` (2026-05-08), background Forge content writers + main-thread infrastructure edits race even with explicit DO-NOT-touch contracts. Cycle 15's defense:
- Main thread authored all 12 posts as TypeScript data files (no Forge content-write spawn)
- Forge invoked ONLY post-EXECUTE for separate-context VERIFY (Rule 2b) and Cato cross-vendor audit (Rule 2a)
- Zero file conflicts; zero scope drift

**Carried forward to skill v0.4.0:**
- Operational rule: "For content-heavy cycles, prefer main-thread authoring + Forge post-EXECUTE VERIFY over parallel-Forge content-write."
- Document the race-defense pattern so future cycles don't relitigate.

## Lesson 6 — `audit:completeness` should treat noindex routes correctly

The 4 thank-you routes are intentionally noindex (per the lead-capture architecture). The default `audit:completeness` sitemap-coverage check flagged them as "built but missing from sitemap" — which is exactly the wrong feedback. The check needed an exclusion path for `/thank-you/*`.

**Carried forward to skill v0.4.0:**
- New rule: "When introducing intentionally-noindex routes (thank-you, redirect targets, internal admin), update the completeness audit's exclusion list in the same commit. Don't ship the routes without the exclusion."

## Lesson 7 — SEO meta length is the silent killer

audit:seo enforces ≤60 chars title and ≤160 chars description. Of the 12 posts initially shipped, 13 separate title/description fields exceeded the limit. The audit caught all 13; the iterative trimming was tractable but cost roughly 15 minutes.

**Carried forward to skill v0.4.0:**
- Operational rule: "For content libraries, set seoTitle ≤55 chars and seoDescription ≤150 chars in the editorial map. Build in headroom — the build tooling sometimes appends suffixes (' | Brand') that push over."

## Cycle-counter update

Skill version: v0.3.4 → **v0.4.0** (minor bump for the new content + lead-capture phase patterns).
