# Principal Decision Register — Mia Sanabria Realtor Site

**Purpose:** ambiguous constraint readings + content-policy decisions that require explicit principal authorization. The Website Production Loop skill v0.2.0 §6 mandates these be surfaced as decision cards rather than silently resolved.

**Status taxonomy:**

- `OPEN` — awaiting principal decision
- `RECOMMENDATION_PENDING` — researched, awaiting principal review
- `DECIDED` — principal has made the call; cite the source-of-truth and date
- `STALE` — situation changed; re-surface as new card

---

## Card 1 — License-rendering interpretation

- **Status:** OPEN (raised cycle-3, restated cycle-4)
- **Surface:** `src/lib/mia.ts:45` currently has `licenseNumber: "SL3405877"`; `src/components/SiteFooter.tsx` renders it via `MIA.unverified.licenseNumber ? render : null`
- **Constraint:** ISA §Constraints line 54 — "license # / designations / languages / display office stay placeholder in production until Mia confirms in writing"

### Two coherent readings

**Reading A:** "placeholder" includes the `unverified.*` namespace flag — the comment at `src/lib/mia.ts:40-44` justifies this as "cited across multiple public-web sources" pending DBPR primary-source. Render is acceptable because the data layer marks it unverified; null-guard prevents future regression.

**Reading B:** "placeholder" means the rendered HTML must be null until DBPR primary-source confirmation. The current truthy field bypasses the constraint. Per cycle-4 Team E (compliance-severity classifier), this is a `statutory-borderline` issue — the FREC requires the brokerage's stated license number to be accurate, and rendering an unverified number invites a "false advertising" interpretation. Cycle-3 Team A + Team B + Team D + Team E + Cato all hold this reading.

### Recommendation

**Reading B** is the safer reading. Action if approved:

```typescript
// src/lib/mia.ts:45 — change
licenseNumber: "SL3405877" as string | null,
// to
licenseNumber: null as string | null,
```

Restore once Mia confirms DBPR-verified in writing. The `unverified.*` namespace plus the null-guard already in place prevents the rendered string from ever appearing without explicit Mia approval.

### Authorization required

Principal must answer: A, B, or "stay current state until Mia confirms." Do not silently advance.

---

## Card 2 — TCPA mechanics on contact + valuation forms

- **Status:** RECOMMENDATION_PENDING (raised cycle-3 Cato §11.1, restated cycle-4 Team E)
- **Surface:** `src/app/contact/page.tsx:188-194`, `src/app/valuation/page.tsx:170-176` — TCPA-disclosure prose was added in cycle-3
- **Constraint:** Florida § 501.059 ("prior express written consent" standard) + 2024 FCC one-to-one consent rule (47 CFR § 64.1200)

### Finding

Cycle-3 added consent **prose** but no consent **mechanics** (no checkbox, no signature, no timestamp, no number-specific authorization). Florida § 501.059 + FCC require an affirmative consent mechanism, not submit-as-consent. Cycle-3 synthesis title overstated the change as "TCPA-compliant text added" — corrected in cycle-4 closeout to "TCPA-disclosure prose added (mechanics deferred to GHL form-wiring cycle)."

### Recommendation

Mechanics deferral is acceptable for staging. Production-grade TCPA compliance requires GHL form-wiring + checkbox-with-timestamp-and-IP audit log. Do NOT claim TCPA-compliant in marketing copy or schema until mechanics ship. Status flag in repo: `<project_root>/docs/COMPLIANCE_GATE_*.md` — TCPA axis = PARTIAL until mechanics ship.

### Authorization required

Principal acknowledges the staging-vs-production distinction; cycle-5 GHL form-wiring expected to close.

---

## Card 3 — Brand voice "family-homes" framing vs HNWI luxury-first positioning

- **Status:** DECIDED — 2026-05-08 (cycle 5) — luxury/waterfront tagline locked. Supersedes prior OPEN status.
- **Decision source of truth:** `docs/BRAND_SYSTEM_CONTRACT.md` §Tone & voice. Tagline now: `"Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach."`
- **Implementation status:** Tagline shipped cycle 5 (commits `b40a174`, `8cf6353`); audit chain enforces no `Family Homes Where Memories Are Made` regressions via `audit:stale-terms`.
- **Historical record (preserved):** prior tagline was `"Fort Lauderdale REALTOR® | Waterfront, Luxury, and Family Homes Where Memories Are Made"` in `src/lib/mia.ts`.

### Two coherent readings

**Reading A (current state):** Mia's authentic positioning includes family-warmth as a differentiator vs. clinically-luxury competitors. The tagline is HER voice. Family-friendly framing serves Eastern FtL buyers who include relocating families with kids.

**Reading B (Team C / Gemini cycle-3 / Team D cycle-4):** HNWI luxury buyers don't search for "Family Homes Where Memories Are Made" — they search for "deepwater waterfront estate," "private dock access," "off-market trophy property." The current tagline targets a less-affluent segment than the rest of the site claims to. Disconnect between brand voice and positioning.

### Recommendation

This is a content-strategy call, not a technical correctness call. Possible compromises:

1. Keep the tagline; layer a "private consultation" / "advisory" narrative on top of it on /about/ for HNWI vector
2. Change tagline to more luxury-vector ("Eastern Fort Lauderdale waterfront, luxury, and concierge representation")
3. Maintain dual messaging — homepage tagline soft, /buyers/ + /sellers/ + /about/ luxury-vector

### Authorization (recorded)

Principal authorized cycle-5 luxury/waterfront tagline; cycle-6 design lanes preserve this decision and do not propose family-homes reversion. Cycle-9 Lane Compliance Guardrail Finding 10 surfaced the prior register-vs-contract drift; this card update closes that drift.

---

## Card 4 — REALTOR® mark descriptive usage

- **Status:** RECOMMENDATION_PENDING (raised cycle-3 Team E, restated cycle-4 Team E)
- **Surface:** `src/lib/site.ts:21`, `src/app/about/page.tsx:59`, `src/app/contact/page.tsx:21`, `src/app/page.tsx:79` — "Fort Lauderdale REALTOR®" as descriptive phrase. `src/app/layout.tsx:40` — lowercase `"realtor"` in keywords.
- **Constraint:** NAR Membership Marks Manual — "the term must always be capitalized when referring to a member"; descriptive usage ("Fort Lauderdale REALTOR®") is non-compliant

### Recommendation

Cycle-5 content sprint: replace descriptive phrasing with member-name-adjacent usage ("Mia Sanabria, REALTOR®"); capitalize "REALTOR" in keywords; remove combined REALTOR®+MLS footer graphic until MLS membership confirmed.

### Authorization required

Principal acknowledges the cycle-5 content-sprint scope; defer specific edits to that cycle.

---

## Card 5 — Combined REALTOR®+MLS footer graphic

- **Status:** RECOMMENDATION_PENDING (raised cycle-3 Team E, restated cycle-4 Team E as `statutory-borderline`)
- **Surface:** `src/components/SiteFooter.tsx:120` — uses `public/logos/realtor-r.png` as if it were a pure NAR mark, but the local asset is a combined `REALTOR®` + `MLS` graphic
- **Constraint:** NAR/MLS attribution is structurally significant for IDX compliance; combined mark blurs trademark domains

### Recommendation

Replace with separate NAR mark; remove MLS attribution until Mia confirms MLS affiliation/jurisdiction in writing.

### Authorization required

Principal authorizes a swap of the footer trust-mark asset to a pure NAR REALTOR® mark.

---

## Card 6 — Spanish hreflang for SE FL Hispanic markets

- **Status:** OPEN (raised cycle-3 Cato §11.6, cycle-4 Team D)
- **Surface:** `src/app/layout.tsx` — `alternates.languages = { "en-US": SITE.url, "x-default": SITE.url }`. No `es` entry currently.
- **Constraint:** ISA defers Spanish-language status until Mia confirms language proficiency in writing

### Two coherent readings

**Reading A:** Defer Spanish hreflang entirely until Mia confirms Spanish proficiency AND Mia confirms `/es/` localized routes are warranted.

**Reading B (Team D cycle-4):** Use self-referential English alternates now (`en-US` / `en` / `x-default`) and add `es-*` only once real localized `/es` pages are published and tested 200. The current state already does Reading B for `en-US` + `x-default` — the question is whether to add `es-US` self-referencing English (placeholder for future).

### Recommendation

**Stay with Reading A** until Mia confirms language status. Do not emit `hreflang="es-*"` to non-existent `/es/` routes; do not pre-emptively claim Spanish coverage. Schema marketing claim ≠ language reality.

### Authorization required

Principal acknowledges the deferral; cycle following Mia language confirmation can ship `/es/` routes + corresponding hreflang.

---

## How this register is used

- Each cycle's OBSERVE phase reads this register; OPEN cards are surfaced in the cycle's mission intake
- Each cycle's LEARN phase appends new cards if surfaced; updates existing cards' status
- DECIDED cards stay in the register as historical record; do not re-flag in subsequent cycles
- The register file is committed to the project repo so the decision history is durable
