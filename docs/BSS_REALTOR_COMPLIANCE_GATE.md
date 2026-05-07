# BSS Realtor — Compliance Gate

> A pass/fail gate every BSS realtor surface must clear before public launch.
> Covers FREC ad rules, Fair Housing, brokerage attribution, license-number display, IDX/MLS terms, and accessibility statement.
> Verified by audit scripts where possible; manual review is the residue.

## Why a single gate

Real estate is one of the most heavily-regulated marketing surfaces in the United States. The cost of a compliance miss isn't a slow drip — it's a complaint to the state real estate commission, a HUD steering review, an MLS attribution dispute, or an ADA accessibility lawsuit. Each one freezes the practice and risks the brokerage relationship. The compliance gate exists so a single check at launch (and any major refresh) covers every category.

## Categories

### 1. FREC ad rules (Florida; substitute equivalent state regulator for non-FL realtors)

- **License number** displayed on every page footer when present, OR explicit placeholder when absent (must not show as "0000000" or empty string)
- **Brokerage name** in legal form on every page footer
- **No superlatives without substantiation** — "#1 realtor", "top realtor", "best realtor", "most experienced", "leading agent" require a cited source AND the source must be verifiable (no fabricated rankings)
- **No guaranteed-outcome claims** — "guaranteed sale", "guaranteed price", "guaranteed timeline" trigger FREC review even when caveated; rephrase to "targeted" / "strategic" / "planned"
- **No fabricated media** — "as seen in/on" requires the publication name + URL; if the operator can't link the specific feature, the phrase must come out
- **No unverified designations** — AHWD, SFR, PSA, RENE, ABR, CRS, etc. require issuing-body confirmation; they are §2 candidates until the client confirms in writing

**Audit gate:** `bun run audit:stale` — extended to include the full FREC superlative + fabricated-media pattern set. Exits 1 on any hit.

### 2. Fair Housing (federal)

The 7 protected classes (race, color, religion, national origin, sex, familial status, disability) — plus state additions where applicable — define what kinds of language trigger HUD steering review. The compliance gate forbids common steering phrases even when the operator's intent is innocent:

- **"good schools" / "best schools"** → describe distance to specific schools by name without quality claim
- **"safe neighborhood"** → describe physical features (gated community, on-site security) without safety claim
- **"family-friendly"** → describe physical features (parks, playgrounds) without familial-status framing
- **"bachelor pad" / "kid-friendly"** → describe property type or feature without familial-status framing
- **"upscale"** / **"prestigious"** when used to describe demographics → describe property tier instead

**Plus the legal must-haves:**
- Equal Housing Opportunity (EHO) statement on every page footer
- IDX/MLS surfaces specifically include the EHO line
- No demographic targeting in copy (race, color, religion, national origin, sex, familial status, disability)

**Audit gate:** `bun run audit:stale` for steering phrases + manual EHO grep on IDX surfaces.

### 3. Brokerage attribution

- **Brokerage name** in legal form (e.g. "LPT Realty LLC") in footer of every page
- **Brokerage display name** ("LPT Realty") allowed in copy
- **Brokerage office address** in schema where required by state ad rules
- **No prior-brokerage residue** — every prior brokerage name in the client's history is added to the per-client `audit-stale-terms` FORBIDDEN list

**Audit gate:** `bun run audit:stale` (per-client forbidden set) + manual footer review.

### 4. License-number display

- **License # known and confirmed:** rendered in footer + About + JSON-LD (RealEstateAgent / Person `knowsAbout` or equivalent slot)
- **License # not yet confirmed:** the field MUST default `null` and the rendering component MUST runtime-guard the access (no empty string in HTML)
- **License # disputed/expired:** treated as §3 refuted in fact ledger; rendered nowhere

**Audit gate:** the unverified-block doctrine is enforced at the data layer (`<client>.unverified.licenseNumber`); the SEO audit can be extended to assert the License-# slot in PersonSchema is either populated OR explicitly null-guarded.

### 5. IDX / MLS attribution

- **IDX iframe host** allow-listed in CSP `frame-src` directive
- **MLS terms of use** (where applicable) — IDX feed agreement may require attribution line "Provided courtesy of <MLS>" near the iframe
- **No listing claim attribution mismatches** — never claim a listing is "Mia's" when MLS records show another listing agent or another brokerage of record (§5 historical only)
- **Fair Housing on IDX surfaces** — the IDX section must visibly carry the EHO statement (the iframe doesn't render the host site's footer)

**Audit gate:** CSP grep + manual MLS attribution review.

### 6. Accessibility statement

- **Statement page exists** at `/accessibility/`
- **Names target standard** — current best practice is WCAG 2.2 AA (Mia's site already targets this)
- **Names remediation contact** — email or form link visible on the statement page
- **Names ongoing-effort posture** — no claim of "fully accessible"; the statement should describe remediation as ongoing
- **Last updated date** present and within last 12 months

**Audit gate:** manual review of `/accessibility/` body content.

### 7. Privacy & data handling

- **Privacy Policy** at `/privacy/` enumerates analytics + tracking + form-handler vendors **actually wired** (not aspirational; if GA4 isn't injected yet, don't list it)
- **Cookie consent** gates Layer 2/3 trackers when injection happens
- **Form data storage** — describe what happens to inquiry submissions (CRM destination, retention period)

**Audit gate:** manual review of `/privacy/` body against actual injection state in `layout.tsx` and form `action=` endpoints.

### 8. No live data on staging

- **Form endpoints are placeholder** until GHL form mapping signed off
- **No real lead/contact/customer data** submitted from staging environment
- **No analytics IDs firing** on staging without explicit operator approval

**Audit gate:** grep `<form action=` for live URL patterns; grep `googletagmanager.com` / `google-analytics.com` for unintentional injection.

## Pass criteria (must ALL be true)

| # | Criterion | Probe |
|---|-----------|-------|
| 1 | `bun run audit:stale` exits 0 | bash exit code |
| 2 | `bun run audit:seo` exits 0 | bash exit code |
| 3 | EHO statement visible on every page footer | grep `Equal Housing` in `out/**/*.html` |
| 4 | License-# slot is either populated (with confirmed §1 number) OR runtime-null-guarded | inspect `<Schema>` components + grep production HTML for the slot |
| 5 | Accessibility statement names standard + remediation contact + last-updated within 12 months | manual `/accessibility/` review |
| 6 | Privacy policy enumerates only actually-wired vendors | manual `/privacy/` vs `layout.tsx` diff |
| 7 | No live form endpoints in staging | grep `<form action=` |
| 8 | No analytics IDs firing in staging without operator approval | grep `gtag\|googletagmanager.com` |
| 9 | Per-client prior-brokerage residue all in `audit-stale-terms` FORBIDDEN list | inspect script |
| 10 | CSP `frame-src` allow-lists IDX MLS host | `curl -I` + grep |

## Failure handling

- Any FAIL blocks `phase: complete` on the project ISA.
- The first FAIL is logged in the ISA `## Verification` with the failing axis, the evidence, and a remediation owner.
- A FAIL must not be patched silently — every fix lands as a separate commit so the audit history is auditable.
- Re-run the full gate after every remediation; fixing one axis can introduce a regression in another.

## Empirical anchor

The Mia Sanabria build (2026-05-07) cleared all 10 axes with two known gated items:
- License # / designations / Spanish / display office: §2 candidates kept null in production until Mia's written confirmation.
- Live analytics injection: deferred behind `NEXT_PUBLIC_ENABLE_GA` flag (per operator decision; not yet wired).
