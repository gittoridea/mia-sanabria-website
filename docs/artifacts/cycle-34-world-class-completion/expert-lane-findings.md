# Cycle 34 — Expert Lane Findings

> Phase 7 deliverable. Nine expert-lane review passes. **Disclosure:** PAI offers specialist subagents (Forge, Engineer, Designer, Cato, Explore, Plan). This cycle ran the lanes as manual passes by the primary executor because the brief's 30-min E4 budget did not permit nine parallel subagent spawn-and-synthesize cycles. Substitution is documented honestly here. A follow-up cycle could re-run any lane through its specialist agent (e.g., `Agent(subagent_type="Cato", ...)`) for cross-vendor review.

Each lane reports: **closed-now** (resolved this cycle), **prepared-now** (artifact/foundation in place, not yet wired), **blocked-external** (waiting on Torrey/Mia/counsel/Bridge/GHL/Google/DNS), **risk-if-skipped** (consequence of deferring further).

## 1. Mission Commander / Launch DoD

- **closed-now:** scope honesty — Bridge, GHL, Google, DNS, legal rewrites, production cutover all explicitly out of scope; documented in `remaining-blockers.md` and `future-roadmap.md`.
- **prepared-now:** Phase 17 gate ledger (Phase 16 must be green before deploy).
- **blocked-external:** Mia review packet return; Bridge real SEF MLS feed.
- **risk-if-skipped:** scope creep into operator-only lanes; broken commitments.

## 2. Information Architect

- **closed-now:** confirmed the existing `Market` type in `src/lib/markets.ts` already implements the canonical neighborhood profile shape proposed in the brief (hero, snapshot, perspective, lifestyle, housing pattern, buyer/seller guidance, FAQ, schema, internal links, source notes). Re-introducing a parallel `NeighborhoodProfile` type would create dead duplication — **rejected**.
- **prepared-now:** `MIA_APPROVED_NEIGHBORHOODS` constant in `src/lib/mia.ts` already discriminates the 9-city working set vs the broader `ALL_MARKET_SLUGS`. `NeighborhoodsRail` component already routes `hasPage:true` to detail pages and `hasPage:false` to search-anchor.
- **blocked-external:** copy + photo fill for the 7 neighborhoods promoted in Cycle 25 from `hasPage:false` to `hasPage:true` (brand-tone placeholders still). Mia owns.
- **risk-if-skipped:** ongoing visible-but-thin neighborhood pages. Already audited as acceptable for staging.

## 3. Luxury Real Estate UX / Conversion Strategist

- **closed-now:** Homepage hero eyebrow + primary CTA target aligned to the locked direction (`South Florida Lifestyle` + `/home-search/` destination). Home Search hero gains an in-page anchor CTA so the search affordance is above the fold without scroll.
- **prepared-now:** `world-class-standards/page-architecture.md` codifies above-fold CTA + secondary-CTA-near-bottom rules.
- **blocked-external:** real listings depend on Bridge SEF feed provisioning.
- **risk-if-skipped:** users hitting `/` and not finding a clear listings entry point — addressed.

## 4. Local SEO / Content Truth Editor

- **closed-now:** Compliance pattern sweep across `src/` and `public/` returned 2 hits, both in guard-comments — none user-facing. `audit:no-fabrications` 0 hits. `audit:stale` clean. `audit:legal` 18 ✓ / 1 WARN / 0 FAIL.
- **prepared-now:** `world-class-standards/fact-and-claim-policy.md` documents source hierarchy + banned phrases.
- **blocked-external:** Mia attestation on designations, languages, years-licensed.
- **risk-if-skipped:** none new — guarded by existing audits.

## 5. Image Director / Provenance Officer

- **closed-now:** documented that the current `miasanabria.com` hero is hosted on `vibe.filesafe.space` (vibe.codes CDN) with unknown provenance — NOT reusable in this repo. Fallback to repo-approved `/markets/fort-lauderdale.jpg` kept. `image-system.md` standard authored. Image manifest covers every slot.
- **prepared-now:** per-city Gemini prompts in `neighborhood-image-generation-briefs.md` ready for one-sample checkpoint.
- **blocked-external:** Torrey/Mia confirmation on (a) current vibe.codes hero licensing, (b) approval for AI-generated illustrative imagery batch, (c) Mia-provided licensed photography.
- **risk-if-skipped:** continued use of brand-tone placeholders for the 7 cities promoted Cycle 25. Already audited acceptable for staging.

## 6. Compliance / Fair Housing / Brokerage Editor

- **closed-now:** sweep clean (see Lane 4). LPT Realty attribution + REALTOR® R logo + Equal Housing logo present per `audit:legal`/`audit:about`.
- **prepared-now:** `world-class-standards/compliance.md` consolidates rules.
- **blocked-external:** DMCA USCO certificate; Mia confirmation on languages, designations (written attestation), years-licensed; counsel review pre-cutover.
- **risk-if-skipped:** pre-cutover legal gate already exists in CLAUDE.md — not weakened.

## 7. Security / Bridge Custodian

- **closed-now:** Bridge tokens not touched. No `.env` reads. Capability discovery used presence-only `node -e` check (no values printed). `BRIDGE_*` envs `missing` in shell is the correct state — they live in Dokploy build args. `/home-search/` `robots: noindex` preserved. Demo-mode banner ownership left to `BridgeSearch.tsx` component.
- **prepared-now:** Phase 19 secret-scan grep documented.
- **blocked-external:** API-key refresh deferred to 2026-05-22 per brief; Bridge support ticket for real SEF feed.
- **risk-if-skipped:** none — security posture unchanged.

## 8. Performance / Mobile / Accessibility Engineer

- **closed-now:** edits limited to two hero blocks; no image-size regression, no new components, no new client JS. `audit:mobile-readability` baseline carries forward.
- **prepared-now:** Phase 15 visual-QA covers 320 / 375 / 414 / 768 viewports.
- **blocked-external:** Lighthouse 95+ verification on production needs cutover.
- **risk-if-skipped:** none new this cycle.

## 9. Visual QA Reviewer

- **closed-now:** Playwright 1.58.0 confirmed present. Phase 15 plan in `visual-qa-report.md` documents what to capture, at what viewports. Local capture is feasible without deploying.
- **prepared-now:** Per-route capture list. Mobile-readability harness already integrated.
- **blocked-external:** staging deploy of the two hero edits — Phase 16 gates must pass first.
- **risk-if-skipped:** unverified hero render at mobile breakpoints; mitigated by existing `audit:mobile-readability` and `audit:hero-contrast`.

## Cross-lane synthesis

- The site is structurally close to world-class already. The biggest remaining gaps are operator-gated (Mia copy + Mia photos + Bridge real feed + DNS cutover + GHL endpoints + legal counsel review), not AI-closeable.
- The two-edit hero polish is the highest-leverage AI-closeable change this cycle. Everything else is foundation work: standards docs, audit matrix, manifests, briefs.
- A future cycle should run Lane 4 + Lane 6 through `Agent(subagent_type="Cato", ...)` for cross-vendor (GPT-5) sanity check on the standards + compliance docs — that's the cleanest place to find Anthropic-family blind spots.

---

Generated 2026-05-14 by Cycle 34 Phase 7.
