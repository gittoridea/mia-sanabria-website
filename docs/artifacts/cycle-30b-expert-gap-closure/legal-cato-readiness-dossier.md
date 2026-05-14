# Lane J — Legal / Compliance / CATO Readiness Dossier

**Author lens:** Legal / Compliance / CATO Readiness Advisor (**not** legal advice)
**Scope:** prepare counsel + broker + CATO review. No legal advice provided. No legal copy rewrites this cycle.
**Inputs reviewed:** `src/app/{privacy,terms,accessibility,dmca}/page.tsx`, `audit:legal` Cycle 30B output (18 PASS · 1 WARN · 0 FAIL), Cycle 22 `cato-compliance-review.md`, Cycle 30 `legal-cato` references in launch-blocker matrix, project CLAUDE.md honesty contracts.

## Open legal items (block production cutover)

| Item | Current state | Status |
|---|---|---|
| **DMCA USCO designation** | `audit:legal` `legal.dmca.uscoFlag` returns **WARN**: "USCO + in-process language present (acceptable for staging; BLOCKED for production cutover per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`)." Page `/dmca/` carries placeholder "USCO in-process" language. | **OPEN — counsel** |
| **Cato cross-vendor compliance re-audit** | Last green: Cycle 22 `cato-compliance-review.md`. Cato re-run not executed since cycles 23-30 added substantive content (insights library, 7 new neighborhood pages, hero search scaffold, canonical-domain change). | **STALE — Cato re-run required pre-cutover** |
| **TCPA PEWC consent text wired to forms** | Cycle 22 wrote the consent text; Cycle 32 (GHL Forms) wires it to actual form submissions. | **GATED on Cycle 32** |
| **F.S. 475.278 brokerage-relationship disclosure** | Present on `/about/` + footer per Cycle 22 audit. Verify re-rendering survives any Cycle 31 copy edits. | **VERIFY post-Cycle-31** |
| **IDX disclaimer + reciprocity (SEF MLS)** | Iframe-based MLS Matrix is the v1 IDX surface. Disclaimer rendered alongside the iframe per Cycle 21 team3-idx-search.md. If Cycle 33 ships Bridge Option A or B, the disclaimer needs re-validation against the new rendering. | **CONDITIONAL on Bridge runtime choice** |
| **Fair Housing language** | EHO statement in `SiteFooter.tsx` per Cycle 22. `audit:legal` confirms. | **CLOSED** |
| **REALTOR® rendering compliance (NAR)** | All-caps + ® across the site per Cycle 22 trademark audit. `audit:no-fabrications` 0 hits. | **CLOSED — re-verify post-Cycle-31** |
| **Florida CCPA "Do Not Sell My Personal Information"** | Link in `/privacy/` per Cycle 22. Banner toggle (Lane H) wires the opt-out to GTM Consent Mode. | **TEXT CLOSED; WIRING gated on Cycle 34** |
| **GDPR (EU traffic)** | Out of scope v1; default-deny consent banner from Cycle 34 covers safe baseline. | **DEFERRED** |
| **CASL (Canada)** | Out of scope v1. | **DEFERRED** |
| **Testimonial attribution** | No testimonials in repo. Any addition (Cycle 31/32) must carry source attribution (FB or Realtor.com), exact text, written permission. | **GATED on Mia capture** |
| **License # / designations / address rendering** | `MIA.unverified.*` blocks rendering until Mia confirms in writing per Cycle 22 fact ledger v2. `audit:no-fabrications` enforces. | **CLOSED at policy level — pending Mia values** |
| **Klein Morgan stale brokerage residue** | Mia's legacy Direct Axess site has Klein Morgan agent page indexed. Post-cutover Search Console URL Removal task. | **POST-CUTOVER (Cycle 37)** |

## Counsel questions (to surface in Cycle 35)

When Cycle 35 (Legal/CATO Closure) fires, ask counsel:

1. **DMCA**: provide final USCO designation text and contact details to replace the "in-process" placeholder on `/dmca/`. Confirm whether `https://miasanabria.com/dmca/` is the correct hosting URL for the designation.
2. **TCPA PEWC**: confirm the Cycle 22 consent copy is still current as of 2026-05 (FCC Reassigned Numbers Database rule changes, recent ATDS-definition jurisprudence).
3. **F.S. 475.278**: confirm the Brokerage Relationship Disclosure placement (footer + About) satisfies the statutory "in print or via electronic medium" requirement.
4. **IDX disclaimer**: SEF MLS reciprocity for v1 iframe path; whether Bridge IDX (Cycle 33 Option A/B) requires substantively different disclaimer language.
5. **Testimonial attribution rules**: confirm "exact-text from FB or Realtor.com with written permission" satisfies FREC + FTC endorsement guidelines (Rule 16 CFR Part 255).
6. **Klein Morgan residue**: any takedown / DMCA / GSC URL Removal action needed for the legacy indexed pages, beyond simple 301 redirect to canonical.
7. **Spanish-language claim**: Mia's languages spoken status — bilingual / English-only / Spanish — counsel + Mia must agree before any visible "habla español" copy ships. Cycle 30 verified **0 hits** on bilingual claim on live; staying silent is the safest path until Mia confirms.

## Broker questions (LPT Realty)

1. Brokerage signage / disclosure placement: any LPT-specific requirement beyond "LPT Realty" attribution in footer + About?
2. License number disclosure timing: LPT broker requires individual agent license # on every web surface, or page-level placement (About + footer) only?
3. Print versus electronic medium: any LPT-specific rule for the F.S. 475.278 disclosure rendering format on web?
4. Approved photo / branded asset use: LPT logo asset, brokerage colors — any constraints on Mia's site that conflict with the current Cinzel/Montserrat editorial-luxury palette?

## CATO re-audit requirements (Cycle 35)

The Cato subagent (`~/.claude/agents/Cato.md`) runs at the end of VERIFY on E4/E5 ISA missions. Cycle 35 spawns Cato with:

- Inputs: live `miasanabriarealtor.trueidea.com` (pre-cutover) OR `miasanabria.com` (post-cutover) per timing.
- Scope: 10-axis BSS compliance template per `docs/BSS_REALTOR_COMPLIANCE_GATE.md`:
  1. Stale-term sweep
  2. Voice-anchor coherence
  3. PUBLIC_FACT_LEDGER §1/§2/§7 separation
  4. JSON-LD validity + schema-dts type compliance
  5. Per-page metadata (title ≤60c, description ≤160c, canonical, OG, Twitter card)
  6. Accessibility (axe-core / Lighthouse a11y ≥95)
  7. Performance (Lighthouse perf ≥90, LCP ≤2.5s, CLS ≤0.1)
  8. FREC + NAR compliance (REALTOR® rendering, brokerage disclosure)
  9. Analytics consent gating (gated on Cycle 34 completion)
  10. Anti-criteria (no DNS / GHL / Mia-surface writes from this codebase)

Cato output goes to `docs/artifacts/cycle-35-*/cato-compliance-review.json` (structured) + `.md` (rendered).

Cato is **read-only**; it does not fix issues. Findings flow into a Cycle 35.5 (or Cycle 36 pre-cutover) corrective sub-mission.

## Launch exception template (legal-specific)

If Torrey/Mia choose to launch with a known legal gap (e.g., DMCA designation still "in-process" because counsel timing), record per `launch-doD.md` LE template:

```yaml
- exception_id: LE-LEGAL-NNNN
  cycle: Cycle36
  date: YYYY-MM-DD
  gap: "DMCA designation still 'in-process' (USCO designation hand-off pending)"
  approved_by: ["torrey", "mia", "counsel"]
  approval_evidence: <off-repo path to counsel email/note>
  scope: "Launch with /dmca/ page carrying current language; do not change DMCA copy without counsel."
  follow_up_cycle: "Cycle37.5 — DMCA Designation Update"
  follow_up_deadline: YYYY-MM-DD (≤ 30 days post-launch)
  rollback_trigger: "Counsel changes mind / DMCA takedown request received"
```

## Future paste-ready legal closure prompt

See `future-prompt-bank.md` → "Cycle 35 — Legal/CATO Closure."

## DoD for Cycle 35 (when it fires)

- [ ] Counsel's final DMCA USCO designation text in hand; `/dmca/` page edited to reflect
- [ ] `audit:legal` `legal.dmca.uscoFlag` returns PASS (no WARN)
- [ ] Counsel sign-off on TCPA + F.S. 475.278 + IDX disclaimer + testimonial attribution
- [ ] Broker (LPT) sign-off on disclosure placement + license rendering
- [ ] Cato re-audit JSON archived; 0 critical findings
- [ ] Any open Cato findings either closed in code or recorded as LE exceptions
- [ ] `audit:all` exits 0 after legal copy edits
- [ ] No new claims (`audit:no-fabrications` 0 hits)

## Reminder

This dossier is operational preparedness, not legal advice. Counsel + broker + Cato must perform their own reviews. Cycle 30B authors none of those reviews.
