# Next Session — Trigger Prompt (Post-Cycle-6 Design Level-Up)

> Paste-ready prompt for cycle 7. Engineered from cycle-6's actual findings — not generic continuation. Cycle 6 shipped 18 Tier-1 design improvements + a stack architecture decision. Cycle 7 lands the Tier-2 backlog + principal-direction-gated voice/brand pivots if approved + opens the door to shadcn Sheet adoption.

---

```
/effort high

MISSION: Mia Sanabria Website — Cycle 7 (Tier-2 Backlog + Principal-Direction Decisions + shadcn Sheet Adoption)

Continue ~/code/mia-sanabria-website/ ISA. Do NOT scaffold a fresh ISA. Cycle 6 closed clean — 35 PASS · 2 WARN · 0 FAIL audit chain; commit 7f8800c on origin/main; live at miasanabriarealtor.trueidea.com (ETag didrenptbrb4*); 75 before/75 after screenshots in /tmp/mia-cycle6-design-{before,after}/.

CYCLE 7 SCOPE (three workstreams in priority order):

WORKSTREAM A — Principal-direction unlocks (BEFORE any Tier-2 implementation)

Surface these decisions; do not silently choose:

1. **IntentRouter restructure** — Lanes 1+2+3 converged on flat hierarchy. Three sub-decisions:
   - Copy retune: "I may sell" → "Discuss a private selling strategy" (Lane 3 F1)
   - Add fourth "I'm exploring" path? (Lane 2 F4) — voice-adjacent
   - Add primary-intent visual hierarchy? (Lane 1 F5) — composition change
   Recommend: Decision Card with 3 options + recommendation; principal must choose before cycle-7 BUILD.

2. **shadcn Sheet adoption** — replaces hand-rolled mobile drawer focus-manager (cycle-6 interim).
   - Cost: 4-6h with a11y verify
   - Sign-off: confirm curated list (Sheet, Dialog, Accordion, Tabs, Tooltip, Toast) per docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md
   - Decision: yes / cycle-8 / not at all

3. **Hero motion ceremony** — Lane 1 F4 (entrance stagger w/ prefers-reduced-motion).
   - Adds motion language to Brand Contract
   - Decision: aesthetic call

If principal returns YES on (1), (2), or (3): execute as Workstream B priorities below. If NO, defer and move to Workstream C only.

WORKSTREAM B — Tier-2 implementation pass (no principal direction needed)

These are queued from cycle 6 § "Deferred to Tier 2":

1. CTA token classes — cta-primary / cta-secondary / cta-tertiary (Lane 3 F4) — ~1.5h
2. Per-market objectPosition + richer alt text in src/lib/markets.ts (Lane 6 F3+F4) — ~45min
3. Service-page PersonSchema continuity on /buyers/, /sellers/, /valuation/ (Lane 8 F3) — ~30min
4. Per-route Twitter metadata for /buyers/, /sellers/, /valuation/, /markets/[slug]/ (Lane 8 F6) — ~1h
5. AnswerFirst Q+A first-sentence-direct rewrites (Lane 8 F2) — ~1h
6. Title/description HNWI micro-intent rewrites (Lane 8 F10) — ~1.5h
7. Internal-link density on non-market hubs (Lane 8 F8) — ~45min
8. IDX iframe responsive min-h floor (Lane 5 F10) — ~30min
9. Privacy trust strip in form headers (Lane 2 F9) — ~20min
10. Asymmetric grid on About value-cards (Lane 4 F10) — ~1h
11. Width ladder consolidation + documentation (Lane 4 F5) — ~1.5h
12. Narrative interstitials in market template (Lane 4 F8) — ~1.5h
13. Eyebrow tracking utility classes (--tracking-eyebrow-primary/secondary) (Lane 4 F2) — ~1h
14. Hero secondary CTA contrast on image bg (Lane 5 F8 sub-finding) — ~30min
15. Form noValidate + accessible error region (Lane 7 F5) — ~1.5h
16. Image provenance manifest src/lib/image-assets.ts + audit:images-provenance sentinel (Lane 6 F10) — ~3.5h
17. Mia portrait single-canonical-path constant (Lane 6 F9) — ~30min
18. OG generator slug list sync to markets.ts (Lane 6 F1) — ~15min

Cap at 6-8h work this cycle; the rest queue to cycle 8.

WORKSTREAM C — /insights/ topic-cluster scaffolding (PROPOSAL only)

Lane 8 F9 proposed 3 essays:
- "Las Olas Isles lot-profile traps for waterfront buyers" — target: "waterfront homes Las Olas Isles dockage"
- "Palm Beach County waterfront lot types: why no-fixed-bridge access matters" — target: "Palm Beach County waterfront lot profile checklist"
- "Boca Raton vs Delray Beach waterfront buyer checklist" — target: "waterfront homes in Boca Raton vs Delray Beach"

DO NOT write the essays cycle 7. Output a content brief with title, target query, expected length, AEO entity expectations (Article + FAQPage), and rough outline. Principal + Mia decide editorial cadence in a separate cycle.

READ FIRST (gate-blocking):

1. ISA.md (cycle 6 mission section)
2. docs/PRODUCTION_READINESS_HANDOFF_DESIGN_LEVEL_UP_CYCLE_6_2026-05-09.md (cycle 6 closeout)
3. docs/PRINCIPAL_DECISION_REGISTER.md (Cards 1, 2, 4, 5, 6 still OPEN; Card 3 DECIDED)
4. docs/CYCLE_6_DESIGN_LEVEL_UP_SYNTHESIS.md (convergence map)
5. docs/DESIGN_LEVEL_UP_UPGRADE_PLAN.md (Tier 2 list)
6. docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md (verdicts per stack item)
7. docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md (cycle-6 cell deltas at top)
8. docs/BRAND_SYSTEM_CONTRACT.md (LOCKED visual system)
9. /tmp/mia-cycle6-design-after/ (cycle-6 visual baseline)
10. src/components/* (every component touched cycle 6 — Hero, MarketCard, AnswerFirst, SiteHeader, SiteFooter, NavLink, Faq, SectionHeading, schema/PlaceSchema)

PHASE 0 — Baseline:

- typecheck + lint + build green
- audit:all + audit:images + audit:brand all green
- live staging ETag is didrenptbrb4* (cycle 6) — verify
- /tmp/mia-cycle7-before/ snapshot if implementing

PHASE 1 — Principal Decision Cards (BEFORE BUILD):

Surface 3 decision cards from Workstream A. Either get principal sign-off or defer. Do not silently advance.

PHASE 2 — Implementation pass:

Approved Workstream A items first (if any) — commit per item with audit chain green between batches.

Then Workstream B Tier-2 items in priority order:
- CTA token classes (foundational; many later changes consume)
- Per-market objectPosition + alt (data layer first)
- Service-page schema continuity
- AnswerFirst Q+A rewrites
- Title/description rewrites
- Internal-link density
- Per-route Twitter metadata
- IDX iframe responsive min-h
- Privacy trust strip
- Asymmetric grid About
- Form noValidate + error region
- Eyebrow tracking utility classes
- Hero secondary CTA contrast
- Image provenance + audit sentinel
- Mia portrait constant
- Width ladder docs + interstitials in market template (lower priority)

Cap at 6-8h.

PHASE 3 — Insights brief (Workstream C):

Write docs/INSIGHTS_TOPIC_CLUSTER_BRIEF.md with the 3 essays' titles, target queries, AEO entities, outlines. No essay drafts.

PHASE 4 — Verify + deploy + live verify:

Deploy via bun scripts/deploy-and-verify.ts --no-lighthouse; cache-bust verify changed routes; capture /tmp/mia-cycle7-after/ snapshot.

PHASE 5 — Closeout:

docs/PRODUCTION_READINESS_HANDOFF_CYCLE_7_<DATE>.md (15+ section)
ISA append (Decisions / Changelog / Verification per cycle-7 ISCs)
Reflection JSONL with schema_version 6.4.0
docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_7.md
Commit + push

ANTI-CRITERIA (HARD — same as cycle 6):
- No new color tokens / font families / glassmorphism / gradient borders / neon edges
- No silent resolution of OPEN principal-decision cards
- No fabricated Mia facts
- No claim of regulatory compliance unless mechanics ship
- No DNS / Cloudflare / .com cutover / GHL prod writes / lead magnet build
- No PAI infrastructure edits outside this project
- No geographic-guardrail violation
- No legal copy rewrite without flag
- No statutory-binary downgraded to "concerns"
- No regression of cycle-6 design improvements

SUCCESS CRITERIA:
- Workstream A surfaces 3 decision cards; principal returns approve/defer/reject (no silent decisions)
- Workstream B ships 6-10 Tier-2 design upgrades (within 8h cap)
- Workstream C produces /insights/ brief (no essays drafted)
- Audit chain green: 35 PASS · 2 WARN · 0 FAIL preserved or improved (preferably 36 PASS · 1 WARN with one of the 2 WARNs resolved)
- Live deploy + Caddy flip + cache-bust verified
- shadcn Sheet adopted IF principal approves (cycle 7 priority); else queued cycle 8
- ISA append + cycle-7 closeout + cycle-8 trigger prompt

FINAL RESPONSE MUST INCLUDE:
- Mission result
- 3 principal-decision cards with recommendations
- Workstream B implementation list with file:line references
- Workstream C brief path
- Audit results
- Deploy/live verification evidence
- Updated matrices
- Cycle-8 next-session prompt path

Algorithm: PAI v6.4.0
Skill: docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 (consider whether v0.3.0 spec amendment is warranted from cycle-7 lessons; defer if no repeatable failures)

Effort: E3 (`/effort high`) — substantial multi-file work but bounded scope. Use `/effort max` only if Workstream A unlocks all three principal-direction items AND requires shadcn Sheet adoption + market template archetype kickoff in same cycle.
```

---

## Cycle 7 Operator Notes

- **The principal-decision cards are the lever.** If even ONE of (1)/(2)/(3) returns YES, cycle 7 has its theme. If all three return DEFER, cycle 7 is a pure Tier-2 backlog cycle.
- **Codex Spark is NOT required cycle 7** — the audit substrate is the cycle-6 9-lane output. Cycle 7 implements; it does NOT re-audit unless the implementation introduces regressions, in which case use single-lane verification (Cato or advisor).
- **shadcn Sheet adoption recipe:** copy components from shadcn registry without `npx`/`npm` (per repo rules). Use `bunx --bun shadcn@latest add sheet` if approval includes the CLI, else manual copy from https://ui.shadcn.com/docs/components/sheet (recipe in stack architecture review).
- **Tailwind v4 GA upgrade is OUT OF SCOPE cycle 7.** Pin remains `4.0.0-beta.7`. When v4 GA ships, dedicated cycle.
- **Card 3 status drift is closed** as of cycle 6. PRINCIPAL_DECISION_REGISTER now reflects DECIDED with cycle-5 supersession note.
