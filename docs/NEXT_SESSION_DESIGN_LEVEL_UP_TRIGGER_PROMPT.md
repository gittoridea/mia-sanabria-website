# Next Session — Design Level-Up Trigger Prompt

> Paste-ready prompt for the cycle that follows priority-fix cycle 5. Engineered to drive an intense expert-design audit + ranked design upgrade plan + safe implementation pass — NOT another generic audit cycle.

---

```
/effort max

MISSION: Mia Sanabria Website — Design Level-Up Cycle (Expert Multi-Lane Design Audit + Ranked Upgrade Plan + Safe Implementation)

Continue ~/code/mia-sanabria-website/ ISA. Do NOT start a new ISA. Do NOT re-run the cycle-3/4 generic 6-7-team audit pattern; this cycle is design-specific and lane-specialized.

Primary objective:
Audit the entire visual design system at world-class luxury-realtor production-company standard and lift the site's design baseline from "production-grade with cycle-3/4/5 corrections" to "competitive with the top-tier luxury realtor sites a discerning buyer expects." Goal is structural design improvement, not redesign drift.

The benchmark is intentional: the site should be visually competitive with — and where possible, more disciplined than — top-100 SE Florida luxury realtor sites (e.g. The Carroll Group's tone, Senada Adzem's cinematic discipline, Tim Elmes' authority, Ryan Serhant-tier polish, the One Sotheby's editorial system). The cycle's question: "Would a high-end production agency ship this?" If the answer is "yes with reservations," the design must move closer to "yes, confidently."

READ FIRST (gate-blocking — fail any gap):
1. ISA.md (cycle-5 mission section)
2. docs/PRODUCTION_READINESS_HANDOFF_PRIORITY_2_4_FIXES_2026-05-08.md (cycle-5 closeout)
3. docs/PRINCIPAL_DECISION_REGISTER.md (6 cards — only Card 3 is DECIDED; Cards 1, 2, 4, 5, 6 still OPEN — DO NOT silently resolve)
4. docs/BRAND_SYSTEM_CONTRACT.md (locked visual system; supersession requires principal authorization)
5. docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md (cycle-4 baseline; refresh required this cycle)
6. docs/CYCLE_5_PRIORITY_FIX_AFTER.md (post-cycle-5 visual state; before/after screenshot paths)
7. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 (skill governs this cycle's composition)
8. reports/audit-images.md, reports/audit-brand-consistency.md, reports/audit-completeness.md (current chain state — 33 PASS / 2 WARN / 0 FAIL)
9. /tmp/mia-cycle5-fix-after/ (70 post-cycle-5 PNGs across 14 routes × 5 viewports — these are the visual baseline you're auditing)
10. src/components/* (every component — Hero, MarketCard, AnswerFirst, MeetMia, IntentRouter, IdxEmbed, SiteHeader, SiteFooter, CTAStrip, ValueProps, SectionHeading, Faq, ContactCard if present)
11. src/app/globals.css (the @theme block + any global rules)
12. src/lib/markets.ts (13-market data + market-page template state)

DESIGN LANE STRUCTURE — 9 expert specialist lanes (NOT the cycle-3/4 7-team pattern):

Lane 1 — CREATIVE DIRECTOR (system-level visual audit)
- The site's overall design system: typographic system, color application, spacing rhythm, image art-direction, motion language, hierarchy. Does it feel like one coherent product, or a Frankenstein of components?
- What design principle is the site articulating? Is it consistent? What design principle SHOULD it articulate?
- What 5 design moves would make this site visibly distinct from the 99 other Eastern FtL realtor sites?

Lane 2 — LUXURY REAL ESTATE UX SPECIALIST
- HNWI buyer journey, page rhythm from discovery to private consultation, intent routing, market-page conversion, confidentiality signaling, "private inquiry" UX, post-submission UX
- Compare against the conversion architecture of top-tier sites
- Where does an HNWI bounce? Specifically, on /, /about/, /buyers/, /sellers/, /valuation/, /contact/, /markets/

Lane 3 — CONVERSION DESIGNER
- CTA hierarchy across all 25 routes; primary/secondary/tertiary tokens; tap-target consistency; visual weight at decision points; form completion path; lead-capture friction (mailto state ack + GHL future state)
- Above-the-fold value: each page's first viewport should clarify the page goal; failures are catastrophic
- Concierge framing on /contact/ — currently text-additive; how to make it structural?

Lane 4 — TYPOGRAPHY & LAYOUT SPECIALIST
- Type pairing (Cinzel display + Montserrat body) — any miss-grade pairings, weight cascades, leading misses, letter-spacing inconsistencies, eyebrow tracking drift
- Text alignment, hyphenation, widow/orphan control, [text-wrap:balance] discipline
- Layout grids: max-w-7xl + px-4 lg:px-8 consistency; section padding cadence; container variants
- Asymmetric grid opportunities (per Brand System Contract Principle 4)

Lane 5 — MOBILE QA SPECIALIST (no compromise)
- 320 / 375 / 414 / 768 / 1024 — full sweep
- Touch targets ≥44×44; tap-area gap ≥8px
- Sticky-header anchor jumps (scroll-padding-top)
- Safe-area-inset on iOS bottom-fixed
- maximum-scale=5 (not 1) preserved
- 16px form input font-size to prevent iOS Safari zoom
- Mobile drawer focus trap, ESC dismiss, scroll-lock when open
- Orientation change behavior

Lane 6 — IMAGE / ART DIRECTION SPECIALIST
- Hero images: composition, color grading, subject framing, time-of-day consistency
- Market hero portraits: 1200×1500 q88 mozjpeg — any signs of AI-fill aesthetic that should be replaced post-Mia-shoot
- Mia headshot: 1024² real photo (Card 3 already decided luxury/waterfront — Mia's photography needs match)
- OG images: per-route OG strategy; should every route have a unique OG, or only conversion pages?
- Card image crops: 4:5 aspect; subject preservation across breakpoints
- Twilight / golden-hour / waterfront-from-water perspective opportunities

Lane 7 — ACCESSIBILITY SPECIALIST
- WCAG 2.1 Level AA bar (target stated in /accessibility/)
- Keyboard reach across all interactive surfaces
- Focus-visible styles (cycle-4 added to footer social — sweep elsewhere)
- ARIA labels: nav, drawer, hero overlays, decorative images
- Skip-to-content link — does it exist? Should it?
- Screen-reader semantics for SectionHeading, IntentRouter, AnswerFirst components
- Color-contrast pixel measurement (NOT just token check) on hero H1, brass eyebrow on cream, brass-3 on cream-200, etc.

Lane 8 — SEO / AEO STRATEGIC LAYER
- Cycle-5 added 5 AEO answer-first blocks; refine the question framing for AI-citation likelihood
- Schema saturation across surfaces (Person + RealEstateAgent + LocalBusiness + Place + FAQPage + Article + Breadcrumbs + Service)
- Internal-link density beyond the markets cluster
- Topic-cluster /insights/ expansion candidates (3 essays — do not write essays this cycle; PROPOSE the 3 with title + AEO target query)

Lane 9 — COMPLIANCE GUARDRAIL
- Re-check the 6 PRINCIPAL_DECISION_REGISTER cards against any design changes proposed by lanes 1-8
- Catch any lane proposing unauthorized design changes (color, font, glassmorphism, license rendering, REALTOR® mark)
- Verify proposed copy doesn't introduce fabricated facts or compliance overclaims

Each lane MUST:
- Run on `gpt-5.3-codex-spark` (or principal-directed alternative — log explicitly)
- Use `--sandbox read-only` + `< /dev/null` + AUDIT_START/AUDIT_END delimiters
- Respect the WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 §1a concurrency cap (≤2 same-model concurrent)
- Produce EXACTLY 10 findings, each with: title, severity (critical|high|medium|low), file/component reference, recommended fix, validation method, safe-to-implement-now (yes|no), principal-approval-required (yes|no)
- Reference at least 1 specific screenshot path in `/tmp/mia-cycle5-fix-after/` per finding (anchor each finding to visual evidence)
- Cite a non-Mia luxury-realtor benchmark ONCE per finding when proposing a higher bar (e.g. "compare against Senada Adzem's hero typography rhythm")
- End with structured JSON verdict: `{"team":"<lane>","verdict":"pass|concerns|fail","completeness":"full|partial","top_concerns":[...],"findings_count":10,"high_severity_count":N,"safe_now_count":N,"benchmark_references":N}`

Output:
- Each lane writes to `docs/codex-spark-audits/cycle-6/lane-{1..9}-<slug>.md`

PHASE-BY-PHASE EXECUTION:

PHASE 0 — Baseline:
- typecheck + lint + build + audit:all + audit:images + audit:brand all green
- git status clean
- 70 fresh chrome-headless screenshots at 20s virtual-time-budget
- Verify Caddy serves cycle-5 commit (b40a174 or later)

PHASE 1 — 9-Lane Expert Design Audit (Spark, ≤2 concurrent, batched):
- Dispatch lanes 1-9 in 5 batches of 2 (last batch of 1)
- Each lane reads its own brief + screenshot grid + relevant source files
- All complete or principal-overridden before synthesis

PHASE 2 — Synthesis + Ranked Design Upgrade Plan:
Produce `docs/DESIGN_LEVEL_UP_SYNTHESIS_2026-05-XX.md` covering:
- Cross-lane CONVERGENCE (≥3 lanes flagging the same surface — highest confidence)
- CONTRADICTIONS surfaced (where lanes disagree on direction)
- WORLD-CLASS GAPS — what top-tier luxury realtor sites have that this site doesn't
- HIGH-IMPACT MOVES we have not previously considered (the cycle's force-multiplier)
- WHAT TO PRESERVE (the cycle-5 fixes are correct; do not re-litigate)

Produce `docs/DESIGN_LEVEL_UP_UPGRADE_PLAN.md` ranked into:
- Tier 1 — Immediate (≤2h, no principal decision required)
- Tier 2 — Near-term (2-6h, no principal decision required)
- Tier 3 — Strategic (1-2d, requires principal direction)
- Tier 4 — Gated-external (Mia photography / GHL / DNS / etc.)
- Tier 5 — World-class polish (optional, post-cutover)

PHASE 3 — Safe Implementation Pass:
- Tier 1 + Tier 2 only this cycle (Tier 3+ goes to next cycle or principal review)
- Use `isolation: "worktree"` if multi-file write-conflict risk
- Run audit:all + audit:images + audit:brand after each meaningful batch
- DO NOT introduce new colors, fonts, or design tokens (Brand System Contract LOCKED)
- DO NOT silently resolve OPEN principal-decision cards
- DO NOT propose redesign drift unless you can show the principal a specific reason

PHASE 4 — Verification + Deploy + Live Verify:
- typecheck + lint + build + audit:all green
- bun scripts/deploy-and-verify.ts --no-lighthouse
- Wait for Caddy flip
- Cache-bust verify all changed routes
- Capture after-screenshots
- Refresh BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md with cycle-6 cell deltas
- Refresh WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md if any cell moved

PHASE 5 — Closeout:
- `docs/PRODUCTION_READINESS_HANDOFF_DESIGN_LEVEL_UP_<DATE>.md` (15+ section closeout)
- ISA append (Decisions / Changelog / Verification)
- Skill v0.3.0 stress-test note (per cycle-4 Team F: v0.3.0 spec was warranted; if cycle-6 surfaces design-specific lessons, those feed v0.3.0)
- Reflection JSONL with schema_version 6.4.0
- Commit + push

ANTI-CRITERIA (HARD — BLOCK ON VIOLATION):
- No new color tokens / font families / glassmorphism / gradient borders / neon edges
- No silent resolution of PRINCIPAL_DECISION_REGISTER Cards 1, 2, 4, 5, 6 (unrelated to design)
- No fabricated facts (license, designations, MLS, sales, awards, Spanish, brokerages-worked-at)
- No claim of regulatory compliance unless mechanics ship
- No DNS / Cloudflare / .com cutover / GHL prod writes / lead magnet build
- No PAI infrastructure edits outside this project
- No geographic-guardrail violation (Boca/Delray remain Palm Beach County; nothing called Miami-Dade)
- No legal copy rewrite without flag
- No statutory-binary downgraded to "concerns"
- No redesign drift — every proposed change must cite a specific finding from a specific lane
- No "the model will figure it out" — every implementation has a test harness or sentinel script

SUCCESS CRITERIA:
- All 9 lanes complete with 10 findings each (90 findings total)
- Synthesis produces ≥3 clear cross-lane convergence findings
- ≥5 Tier-1/Tier-2 design upgrades shipped
- Audit chain green: ≥33 PASS · 2 WARN · 0 FAIL preserved (or improved)
- Live deploy + Caddy flip + cache-bust verified
- Cycle-6 closeout ranks the next 3 design moves (Tier 3+)
- The site moves visibly closer to top-tier luxury realtor benchmark
- Card 3 stays DECIDED; Cards 1/2/4/5/6 stay OPEN unchanged

FINAL RESPONSE MUST INCLUDE:
- Mission result
- 9 lane outputs (file paths)
- Synthesis report (file path)
- Ranked upgrade plan (file path)
- Tier-1/Tier-2 commits
- Audit results (post-cycle-6)
- Deploy / live verification evidence
- Updated matrices
- Cycle-7 next-session prompt (or "ready for principal review")

Algorithm: PAI v6.4.0. Use the WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 spec.

Effort: E5 (`/effort max` explicit override of any classifier output).
```

---

## Notes for the cycle-6 operator

- **This is NOT a generic audit cycle.** Cycle-3/4 ran the standard 6-7 expert-team pattern. Cycle-6 is design-specialized: 9 lanes specifically tuned to the visual / conversion / accessibility / typography / image axes. Do NOT regress to the cycle-3/4 lane structure.
- **The benchmark is real.** Cycle-6 must reference actual luxury-realtor sites by name. The cycle-5 closeout flagged Carroll Group / Senada Adzem / Tim Elmes / Ryan Serhant / One Sotheby's as the comparison set; principal can amend.
- **The screenshot grid IS the substrate.** /tmp/mia-cycle5-fix-after/ has 70 PNGs across 14 routes × 5 viewports — every finding should anchor to specific screenshot file paths. Without visual evidence, a finding is a hypothesis, not a finding.
- **Principal-decision register is sacred.** Cards 1, 2, 4, 5, 6 are NOT design questions — they're compliance/voice/positioning questions answered separately. Cycle-6 design lanes propose against the current state; they do NOT propose to resolve those cards. Card 3 IS the brand voice decision and stays DECIDED.
- **Cycle-5 fixes are CORRECT — do not re-litigate.** The new tagline, image heroes on /markets/ + /about/, hero H1 contrast, AEO answer-first blocks, and audit sentinel expansion are the cycle-6 starting baseline. Lanes evaluate quality at THIS baseline; they don't propose reverting cycle-5 work.
- **Use the WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 spec discipline.** ≤2 same-model concurrent Spark dispatches. `--sandbox read-only`. `< /dev/null`. AUDIT_START/AUDIT_END delimiters. Per-lane structured verdict JSON on LAST line. Compliance severity taxonomy at synthesis. Live-staging verification gate at VERIFY. Principal-decision register pattern preserved.
- **Skill v0.3.0 stress-test queued.** Cycle-4 Team F said v0.3.0 spec is warranted; cycle-6 design-specific learnings feed that spec. If a non-realtor vertical is available, the v0.3.0 stress-test happens in cycle-7, not cycle-6.
