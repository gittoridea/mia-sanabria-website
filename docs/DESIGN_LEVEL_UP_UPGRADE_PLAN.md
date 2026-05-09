# Design Level-Up Upgrade Plan — Cycle 6 + Forward

**Authored:** 2026-05-09
**Cycle:** 6 (design level-up)
**Authority:** `docs/CYCLE_6_DESIGN_LEVEL_UP_SYNTHESIS.md`. Every item below cites the lane(s) that produced it.
**Default rule:** Do not silently advance past an OPEN principal-decision card. Brand System Contract is LOCKED. Cycle-5 fixes are PRESERVED.

## Tiering legend

- **Ship now (0–2h)** — Tier 1; safe-to-implement, no principal approval needed.
- **Near-term (2–6h)** — Tier 2; safe-to-implement, no principal approval needed; larger scope.
- **Strategic (1–2d)** — Tier 3; principal direction required; touches voice/brand/architecture.
- **Stack architecture / later** — Cycle 7+ candidates; per `docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md`.
- **Principal-decision gated** — OPEN cards 1, 2, 4, 5, 6.
- **GHL-gated** — needs the GHL endpoint + TCPA mechanics.
- **Do-not-change** — preserved.

---

## Ship now (0–2h)

This is cycle-6's implementation lane.

### Mobile + accessibility hardening
1. **Mobile drawer focus trap + ESC + body scroll lock + `aria-modal`** — `src/components/SiteHeader.tsx`. Lane 5 F3, Lane 7 F6. Hand-rolled focus-manager (interim until shadcn Sheet adoption in cycle 7). ~45-60min.
2. **Header menu icon 40→48px + ≥8px gap** — `src/components/SiteHeader.tsx`. Lane 5 F4. ~10min.
3. **scroll-padding-top on `html`** — `src/app/globals.css`. Lane 5 F2. `scroll-padding-top: calc(5.25rem + env(safe-area-inset-top))`. ~5min.
4. **Form controls 14px → 16px (text-base)** — `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`. Lane 5 F6, Lane 7 F4. ~15min.
5. **aria-current on header + footer nav anchors** — `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`. Lane 7 F7. Use `usePathname()` from `next/navigation`. ~20min.
6. **AnswerFirst `useId()` for unique heading id** — `src/components/AnswerFirst.tsx`. Lane 7 F10. ~5min.
7. **Skip link `:focus-visible` + forced-colors safety** — `src/app/globals.css`. Lane 7 F9. (Verify skip link exists; sharpen styles.) ~10min.

### Visual hardening — contrast + typography
8. **Hero scrim deepen at content band (preserve cycle-5 H1 shadow)** — `src/components/Hero.tsx`. Lane 5 F8, Lane 7 F1+F2. Add a content-band darker overlay (e.g., `from-navy-900/60 via-navy-900/45 to-transparent` localized to content band) without touching the cycle-5 H1 shadow. ~30min.
9. **MarketCard "Explore Area" `text-brass-300` → `text-cream-50`** — `src/components/MarketCard.tsx`. Lane 7 F3. ~3min.
10. **MarketCard h3 — remove `tracking-[0.05em]`** — `src/components/MarketCard.tsx`. Lane 4 F9. ~2min.
11. **Hero H1 weight standardize** — `src/components/Hero.tsx`. Lane 4 F1. (Per Brand Contract cycle-5 lock, image-mode keeps `font-bold`; cream/navy variants stay `font-semibold`. Variant-specific weight is intentional. Mark this lane finding NOT IMPLEMENTED with rationale, OR retune to a unified token if Brand Contract evolves. **Decision: leave as-is, log in `## Decisions`** — cycle-5 lock.)
12. **`[text-wrap:balance]` on shared `h2` in `SectionHeading`, `Faq`** — Lane 4 F3. ~5min.
13. **`[text-wrap:pretty]` on long-body containers** — `Faq.tsx` answer block, `AnswerFirst.tsx` body. Lane 4 F4. ~10min.
14. **`AnswerFirst` py-14 → py-16 (cadence alignment)** — `src/components/AnswerFirst.tsx`. Lane 4 F6. ~2min.

### Conversion + UX polish
15. **Markets hub Hero — add primary CTA** — `src/app/markets/page.tsx`. Lane 3 F2. ~15min.
16. **Buyer/seller intent passthrough** — buyers/sellers CTA → `/contact/?intent=buyer|seller`; pre-seed `intent` field. Lanes 2 F3, 3 F8. ~30min.
17. **Privacy trust strip in form panel header** — `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`. Lane 2 F9. ~20min.

### Image / art direction polish
18. **Per-market `objectPosition` + richer alt text** — `src/lib/markets.ts` add `imageObjectPosition` + `imageAlt` per market; `MarketCard.tsx` consumes. Lane 6 F3, F4. ~45min.
19. **Remove `.svg` placeholders from `public/markets/`** — Lane 6 F8. ~3min.
20. **Sync OG generator slug list to `markets.ts`** — `scripts/render-images.ts` or `scripts/generate-og-images.ts` (verify which exists). Lane 6 F1. ~15min.

### SEO/AEO hardening
21. **AnswerFirst `FaqSchema` emission** — Lane 8 F1. Add optional `emitSchema` (default true) prop, render `FaqSchema` payload. ~30min.
22. **PlaceSchema county threading** — `src/components/schema/PlaceSchema.tsx`, `src/lib/markets.ts`. Lane 8 F4. ~15min.
23. **Service-page schema continuity (PersonSchema on /buyers, /sellers, /valuation)** — Lane 8 F3. ~30min.
24. **REALTOR® keyword casing in metadata** — `src/app/layout.tsx`. Lane 9 F3. ~5min.

### Compliance / documentation
25. **Sync `docs/PRINCIPAL_DECISION_REGISTER.md` Card 3 status** — Lane 9 F10. Card 3 was DECIDED cycle-5 (per BRAND_SYSTEM_CONTRACT.md), but the register still says OPEN. Add explicit "DECIDED 2026-05-08, supersedes prior OPEN" entry; do NOT silently re-write. ~10min.

### Build + audit hygiene
26. **Verify audit chain passes after each batch.** Run `bun run typecheck && bun run lint && bun run build && bun run audit:all && bun run audit:images && bun run audit:brand` after each subgroup of changes.

**Total ship-now estimate:** 4-6 hours.

---

## Near-term (2–6h)

### Visual rhythm
- **Asymmetric grid on About value-cards** — `src/app/about/page.tsx` line ~136. Lane 4 F10. ~1h.
- **Width ladder consolidation** — `Faq` (4xl) and `AnswerFirst` (3xl) inset rationale; document the ladder pattern. Lane 4 F5. ~1.5h.
- **Narrative interstitials in market template** — `src/app/markets/[slug]/page.tsx` between property-cards/FAQ/related-cards. Lane 4 F8. ~1.5h.

### Conversion polish
- **CTA token classes (`cta-primary`/`cta-secondary`/`cta-tertiary`)** — Lane 3 F4. Centralize button styling; `audit:brand` regression check. ~1.5h.
- **Eyebrow tracking utility classes** — `--tracking-eyebrow-primary` (0.4em) and `--tracking-eyebrow-secondary` (0.3em) in `globals.css`; refactor consumers. Lane 4 F2. ~1h.

### Mobile / image
- **IDX iframe responsive `min-h` floors** — `src/components/IdxEmbed.tsx`. Lane 5 F10. ~30min.
- **Hero secondary CTA contrast on image bg** — Lane 5 F8 (separate from C7 fix above). Add tuned text-shadow/contrast token to secondary CTA on image variant. ~30min.
- **Route-specific OG for non-conversion pages** — `/insights/`, `/about/`, `/privacy/`, `/terms/`, `/dmca/`, `/accessibility/`. Lane 6 F5. ~2h (generation + wiring).

### SEO/AEO
- **AnswerFirst Q+A first-sentence-direct rewrites** — Lane 8 F2. Tighten 5 cycle-5 AnswerFirst blocks. ~1h.
- **Per-route Twitter metadata** — Lane 8 F6. Add `twitter: {...}` on `/buyers/`, `/sellers/`, `/valuation/`, `/markets/[slug]/`. ~1h.
- **Internal-link density on non-market hubs** — `/about/`, `/contact/`, `/insights/` add 1-2 contextual links. Lane 8 F8. ~45min.
- **Title/description HNWI micro-intent rewrites** — Lane 8 F10. ~1.5h (audit + write + verify).

### Image taxonomy
- **Image provenance manifest** — `src/lib/image-assets.ts` with `sourceType`, `capturedBy`, `captureDate`, `approvedBy` per public asset. Lane 6 F10. ~2h.
- **Mia portrait single-canonical-path constant** — `src/lib/site.ts` add `HEADSHOT_PATH`; refactor consumers. Lane 6 F9. ~30min.

### Audit hardening
- **`audit:images-provenance` sentinel** — Lane 6 F10 follow-up. ~1.5h.

**Total near-term estimate:** 12-18 hours (cycle 7 territory).

---

## Strategic (1–2d) — principal direction required

These are the cycle's force-multiplier moves. Each requires principal call.

- **IntentRouter copy + 4th path + hierarchy** — Lanes 1 F5, 2 F4, 3 F1. Voice-adjacent. Likely shipped together as a coherent intent-architecture refactor.
- **Heading system pivot (h3+ → body-font)** — Lane 1 F2. Brand Contract update; visible everywhere.
- **Hero motion ceremony (entrance stagger; honors prefers-reduced-motion)** — Lane 1 F4. Adds motion language to Brand Contract.
- **Market template archetype variants** — Lanes 1 F1, F3. Architectural; introduces 2-3 page compositions (coastal/in-town/gated) and MarketCard variants.
- **Image taxonomy + heroMood/heroPerspective** — Lane 6 F6, F7. Feeds new photography brief; gates re-shoot scope.
- **Concierge intake structural reframe** — Lane 3 F9 (contact page becomes a concierge protocol, not channel options). Lane 2 F7 (valuation 2-step).
- **Cycle-7 polish:** card-cluster narrative interstitials (could be Tier 2 if minor; Tier 3 if structural).

---

## Stack architecture / later

Per `docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md`. Each is a discrete cycle 7+ candidate.

- **shadcn Sheet adoption** — replaces hand-rolled mobile drawer; eliminates the focus-manager interim. ~4-6h.
- **shadcn Accordion adoption** — replaces native `<details>` Faq pattern (currently good a11y, but Accordion adds keyboard-arrow nav). ~2-3h.
- **shadcn Dialog/Tabs/Tooltip seeded** — copy-only, ready for use when needed. ~1h each.
- **shadcn Toast** — paired with GHL endpoint cycle for form-submit confirmation. ~1-2h.
- **Tailwind v4 GA upgrade** — when shipped; dedicated cycle.
- **TS branded primitives + `BuildSchema<T>` helper** — additive sharpening. ~3-4h.
- **Tailwind token extractions:** `--shadow-hero`, `--gradient-overlay-image-hero`, `--easing-luxury`. ~3h.

---

## Principal-decision gated

**Cards 1, 2, 4, 5, 6 OPEN — DO NOT silently resolve.** Each blocks downstream work:

- **Card 1 — License rendering** (Lane 8 F5, Lane 9 F1). Reading B recommended; principal authorizes the `licenseNumber: null` change.
- **Card 2 — TCPA mechanics** (Lane 9 F7). Mechanics gated by GHL cycle.
- **Card 4 — REALTOR® descriptive vs member-name-adjacent** (Lane 9 F2). Principal authorizes the cycle-5/cycle-7 content-sprint scope.
- **Card 5 — Combined REALTOR®+MLS logo** (Lane 9 F4). Principal authorizes asset swap.
- **Card 6 — Spanish hreflang** (no cycle-6 lane proposed touching this; preserved).
- **Card 3 — DECIDED cycle-5 (luxury/waterfront tagline)** (Lane 9 F10). DOCUMENTATION sync only — register file needs the DECIDED status entry to match the brand contract; no code change.

---

## GHL-gated

- **Real intake endpoint** for `/contact/` and `/valuation/` (Lanes 2 F1, F2; Lane 3 F6, F7; Lane 5 F7; Lane 9 F6).
- **TCPA mechanics** (Lane 9 F7) — checkbox + signature + per-number authorization + audit log.
- **Toast** post-submit confirmation states (paired with shadcn Toast adoption).
- **Lead-routing metadata** (intent, market, urgency) round-trip into GHL custom fields.

---

## Do-not-change (preservation list)

- **Cycle-5 fixes** — luxury/waterfront tagline, hero H1 shadow stack, hero scrim composition (we DEEPEN at content band, not replace), AEO answer-first blocks, audit:images + audit:brand sentinels.
- **Brand System Contract** — all tokens, all components per the locked spec.
- **Project ISA structural pattern** — twelve-section frame, ID-stability rule.
- **OPEN principal-decision cards** — 1, 2, 4, 5, 6 stay OPEN; Card 3 stays DECIDED.
- **Geographic guardrail** — Boca Raton + Delray Beach = Palm Beach County (NEVER Broward or Miami-Dade). Verified clean across all market data.
- **No fabricated facts** — license, designations, MLS, sales, awards, languages, brokerages-worked-at.

---

## Re-read against mission

User explicitly asked for ten outputs in the final response: mission result, commits, pushed status, 9-lane audit output paths, stack architecture verdict, design improvements shipped, shadcn/Payload recommendations, audit results, deploy/live verification, screenshot paths, updated matrix/doc paths, remaining blockers, next 3 actions, next-session prompt path. All addressed in cycle-6 closeout (Phase 9 doc).
