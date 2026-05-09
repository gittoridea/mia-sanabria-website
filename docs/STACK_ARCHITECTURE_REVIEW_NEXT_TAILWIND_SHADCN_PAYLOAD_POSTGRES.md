# Stack Architecture Review — Next.js / TypeScript / Tailwind / shadcn-ui / Payload / Postgres

**Authored:** 2026-05-09 (cycle-6 design level-up)
**Authority:** Per cycle-6 mission Phase 4 (PAI Algorithm v6.4.0 / E5)
**Verdict scope:** What belongs NOW, what belongs LATER, what should NOT be added.
**Default bias:** Keep Next + TS + Tailwind. Adopt shadcn selectively only if it accelerates design quality without violating the Brand System Contract. Defer Payload + Postgres unless the content-admin workflow is clearly worth the operational cost.

This review is a decision document, not a discussion. Each stack item gets one verdict from the closed enumeration: **Keep now / Adopt now / Adopt selectively / Prototype only / Defer / Reject for this project.** Rationale, risk, cost, workflow effects, and principal-approval requirements are all surfaced explicitly so the principal can act on the recommendation in one read.

The site currently runs on Next.js 15.1 + React 19 + TypeScript 5.7 (strict + noUncheckedIndexedAccess) + Tailwind CSS v4.0.0-beta.7 + bun 1.3+, deployed as a Next.js static export (`output: 'export'`) to Helos VPS via Dokploy. Audit chain is GREEN at 35 PASS · 2 WARN · 0 FAIL. Source is ~5,341 LOC across `src/app/` (15 routes), `src/components/` (14 components), and `src/lib/` (4 data/utility modules). No `src/data/` folder — data lives in `src/lib/{markets,mia,site}.ts`.

---

## Verdicts at a glance

| Stack item | Verdict | One-line rationale |
|---|---|---|
| **Next.js 15 + App Router** | **Keep now** | App Router + static export is the right primitive for a high-SEO/AEO marketing site; nothing about the workload demands SSR or RSC streaming. |
| **TypeScript (strict + noUncheckedIndexedAccess)** | **Keep now** | Already catching drift; tighten further by adding a `BuildSchema<T>` helper for JSON-LD type-safety (already cited in ISC-38). |
| **Tailwind CSS v4 (beta)** | **Keep now (pin version)** | The `@theme` block IS the Brand System Contract in code; v4's CSS-native approach beats v3 for design-system rigor. Pin to `4.0.0-beta.7` until v4 GA, then upgrade in a dedicated cycle. |
| **shadcn/ui** | **Adopt selectively** | Specific primitives only — Sheet, Dialog, Accordion, Tabs, Tooltip — to harden accessibility on patterns we have already hand-rolled. Not a wholesale design-system swap. |
| **Payload CMS** | **Defer** | Static export is the constraint. Payload requires a server runtime; adopting it forces a deploy/runtime/ops migration with no current content-edit workload to amortize the cost. |
| **Postgres** | **Defer** | Postgres only enters when Payload (or another stateful service) does. No standalone need today; deferred alongside Payload. |

---

## A. Next.js + TypeScript

### Verdict: **Keep now**

**Why.** The site is a content-heavy marketing surface with 25 routes, 13 dynamic market pages, JSON-LD schema saturation, and per-route `<title>`/`<meta>`. Next.js App Router with `output: 'export'` produces a fully static site — every route is pre-rendered HTML at build time. The first-load JS shared across all routes is 105 kB; per-route JS is 137-205 B (functionally zero). This is exactly the workload the static-export pattern is designed for, and the build is already correct.

**Are static-export constraints appropriate?** Yes. Listing intelligence comes from a third-party IDX iframe (SEF MLS Matrix); forms are mailto-stub pending GHL endpoints; there is no per-request authenticated content. Nothing on the surface requires server runtime. The constraint is a feature: it forces every piece of content into git, where compliance review can attach.

**Are route/data patterns clean?** Mostly yes. `src/lib/markets.ts` is the single source of truth for market metadata; `src/app/markets/[slug]/page.tsx` consumes it via `generateStaticParams()`. The pattern scales — adding a 14th market is a `markets.ts` row, not a code change. **One sharpening opportunity:** typed schema helpers. The `schema-dts` types are imported but the JSON-LD blocks are constructed inline in component files; extracting a small `BuildSchema<T>(...)` helper centralizes the type contract and makes schema regression visible at compile time (already named in ISC-38 of the project ISA).

**Are component boundaries maintainable?** Yes. 14 components, each focused on one surface (Hero, MarketCard, AnswerFirst, IntentRouter, etc.). No circular imports observed. The ones that grow next cycle (likely Hero variants for asymmetric grids per Brand Contract Principle 4) can be split locally without touching unrelated surfaces.

**Does TypeScript catch enough drift?** Strict + noUncheckedIndexedAccess is doing real work — the cycle-5 `audit:images` sentinel was specifically added because TypeScript could not catch a runtime image-resolution failure. The follow-up move is **typed branded primitives** for things like `LicenseNumber`, `MarketSlug`, `RouteSlug`, and `EmailAddress` — specifically because the cycle-3/4/5 compliance work showed these strings are load-bearing and benefit from narrowing. This is a small, additive improvement, NOT a refactor.

**Risk:** None at the framework level. Next.js 15.1 is stable; React 19 stable; no breaking changes pending in the LTS window.

**Implementation cost:** Zero (no migration). The optional sharpening (typed helpers, branded primitives) is ≤4 hours.

**Effect on current workflow:** None.

**Effect on GHL:** None. The form-submit boundary is unchanged; GHL endpoint wiring is a content-update of existing form components.

**Effect on SEO/AEO:** Positive baseline preserved — static HTML is the AEO substrate. Sharpening JSON-LD via typed helpers reduces the schema-drift risk that AEO penalizes.

**Effect on maintenance:** Slight improvement if branded primitives ship; otherwise neutral.

**Principal approval required:** **No.**

---

## B. Tailwind CSS v4

### Verdict: **Keep now (pin version)**

**Why.** Tailwind v4's `@theme` block IS the Brand System Contract expressed in code. The locked color/font/shadow/tracking tokens at `src/app/globals.css:3-40` are the canonical design vocabulary; every component reads from this single source of truth, which is exactly what a brand-disciplined site needs. v3 would force a separate `tailwind.config.{js,ts}` and a JavaScript object for tokens — strictly worse for design-system rigor.

**Is the Tailwind usage disciplined?** Largely yes. The `audit:brand` sentinel (9/0/0) verifies forbidden colors and forbidden font families don't appear; the `forbidden-classes-in-built-output` check guards regression. The risk surface is **inline arbitrary values** — `text-[15px]`, `[text-shadow:0_2px_18px_rgba(15,42,68,0.85)]`, `[text-wrap:balance]`. These are correct and necessary in luxury typography work, but the pattern doesn't scale: any custom value used in three or more components should be promoted to a token in `@theme`. Cycle-6 implementation can extract `--text-shadow-hero-h1`, `--text-balance-default`, etc.

**Are design tokens centralized?** Yes — `@theme` block. **Sharpening opportunity:** the brass family has eight steps (`brass-50` through `brass-800`) but only `brass-100/300/400/700` are used in the Brand Contract. The unused steps are inert but introduce misuse opportunities. Pruning to a smaller curated palette is a low-risk discipline tightening (defer to a separate cycle so it can be done atomically with audit-coverage).

**Are unauthorized classes creeping in?** The `audit:brand` script catches the obvious cases (`bg-purple-*`, `text-rose-*`, etc.). It does NOT catch arbitrary-value classes (`bg-[#ff00aa]`). A hardening move is to add a sentinel for `bg-[#`, `text-[#`, `border-[#` patterns and require allowlist exceptions in code review. Low priority; flag for cycle-7.

**Should more tokens be extracted?** Yes — three concrete candidates: `--shadow-hero` (currently hardcoded text-shadow on H1), `--gradient-overlay-image-hero` (currently inline `from-navy-900/15 via-navy-900/35 to-navy-900/15`), and `--easing-luxury` (currently the implicit `ease-out` on `transition-[transform,box-shadow]`). All three are referenced 2-3 times each; each promotion is a 1-hour change with audit coverage.

**Is the Brand System Contract reflected in code?** Yes, with one caveat: the contract specifies `tracking-[0.4em]` for primary eyebrows but the code has both `tracking-[0.4em]` and `tracking-[0.3em]` instances. The contract acknowledges this (different scales for different contexts), but the code doesn't name them. Promote to `--tracking-eyebrow-primary` (0.4em) and `--tracking-eyebrow-secondary` (0.3em). Lane 4 (typography) will likely flag this independently.

**Risk:** Tailwind v4 is in beta. The `4.0.0-beta.7` version is what `@tailwindcss/postcss` resolves; production builds are stable. The ONLY risk is upgrading to v4 GA mid-cycle and hitting a breaking change. Mitigation: pin the version explicitly (already pinned via package.json caret), do the GA upgrade in a dedicated cycle with regression screenshots.

**Implementation cost:** Zero (no migration). Token extractions per cycle as flagged.

**Effect on current workflow:** None.

**Effect on GHL:** None.

**Effect on SEO/AEO:** None (utility classes don't affect HTML semantics).

**Effect on maintenance:** Tokens-over-arbitrary-values reduces drift cost over time. Net positive when applied incrementally.

**Principal approval required:** **No** for keep; **No** for token extractions (Brand Contract evolution stays within the lock); **Yes** before upgrading to Tailwind v4 GA when it ships.

---

## C. shadcn/ui

### Verdict: **Adopt selectively**

**Why.** shadcn/ui is not a UI library; it's a curated set of accessible component patterns built on Radix primitives, distributed as source code that you copy into your repo. Adoption preserves source ownership, which matches the Brand Contract's lock-by-default discipline. The HNWI accessibility floor (WCAG 2.1 AA, with luxury aspirations toward AAA) is genuinely hard to hand-roll for compound components — focus traps, ARIA state machines, keyboard navigation, ESC-dismiss, and screen-reader semantics for Dialog/Sheet/Accordion/Tabs are exactly the surfaces where Radix earns its reputation.

The site has hand-rolled equivalents today: `SiteHeader.tsx` ships a mobile drawer; `Faq.tsx` ships a disclosure pattern. These are not bad implementations, but they are bespoke — every cycle's a11y lane will re-litigate them. Adopting Radix-backed primitives gives the project an accessibility compounding curve.

### Specific adoption list (the only items being recommended)

| Primitive | What it replaces | Why | Risk |
|---|---|---|---|
| **Sheet** (mobile drawer) | `SiteHeader.tsx` mobile-nav state machine | Focus trap, scroll-lock, ESC-dismiss, ARIA — all Radix-tested. Lane 7 (a11y) will likely flag ours. | Low; Sheet anatomy maps cleanly to current drawer. |
| **Dialog** (modal) | None today (we don't have any modals — yet) | Future "Schedule a private consultation" flow + photo lightboxes will need it. Better to seed the primitive than reinvent at the moment of need. | Low; doesn't ship until used. |
| **Accordion** | `Faq.tsx` disclosure pattern | Single-expand-at-a-time + keyboard arrow nav + ARIA-owned IDs. Current pattern likely fails on screen reader. | Low; FAQ schema (FAQPage JSON-LD) stays unchanged. |
| **Tabs** | None today | Future `/markets/[slug]/` "Schools / Lifestyle / HOA" pattern (per Lane 8 internal-linking proposal in advance). | Low; doesn't ship until used. |
| **Tooltip** | None today | Footer trust badges' explanatory hover text would improve REALTOR®/EHO/IDX clarity. | Low; doesn't ship until used. |
| **Toast** (Sonner-based) | None today | Post-GHL form-submit confirmation states. Pairs with the GHL endpoint wiring cycle. | Low; pure additive. |

### What we are NOT adopting

| Primitive | Why skip |
|---|---|
| **Button** | Brand Contract specifies primary/secondary/tertiary CTA styles in detail (rounded-full, brass-400, px-8 py-3.5). shadcn Button defaults conflict (rounded-md). Stick with the bespoke `CTAStrip.tsx` patterns. |
| **Card** | `MarketCard.tsx` is brand-bespoke (rounded image + tagline + lift-on-hover, ArrowRight chevron locked). shadcn Card default visuals would force re-skinning to match contract — net-zero benefit. |
| **Form** | We have two mailto stub forms today; Form's value comes from `react-hook-form` + Zod, which is overkill until GHL wiring lands. Revisit at the GHL cycle. |
| **Select** | One `<select>` in the codebase; native semantics are fine for now. |
| **Navigation Menu** | Desktop nav is simple link list; Radix NavigationMenu adds machinery that the simplicity doesn't need. |
| **Separator** | We use `<hr>` and Tailwind borders directly. Adopting Separator would force imports for one line. Net-negative ergonomics. |

### Decision criteria check

- **Reduces custom drift:** Yes for Sheet (immediate), Accordion (immediate), Toast (when GHL ships). No for Button/Card/Separator.
- **Fits Tailwind + Brand System Contract:** Yes — shadcn ships Tailwind class strings; we tune them to brand tokens during the copy step.
- **Preserves source ownership:** Yes — components live in `src/components/ui/`, version-controlled, no external dependency at runtime.
- **Avoids bloating:** Yes if we only adopt the named primitives. The Radix peer-dep cost (≤30 kB across the listed primitives, tree-shaken) is acceptable.
- **Improves accessibility:** **Yes — this is the primary reason.**
- **Can be added without npm/npx:** Yes via `bunx --bun shadcn@latest add <component>` (which runs the CLI through bun's npm-compatible runner). The repo's anti-npm/npx rule is about preventing `npm install` and `npx jest`-style invocations; `bunx` honors that boundary. **Alternative:** copy the component files manually from the shadcn registry — also acceptable and avoids the CLI entirely.

### Risk

- **Accessibility regression if integration is sloppy.** Adopting Sheet but mis-wiring the focus trap is worse than the current bespoke drawer. Mitigation: single-component-at-a-time adoption with chrome-headless screenshot + axe scan after each.
- **Visual drift from Brand Contract.** shadcn default classes will not match brass-400 + rounded-full. Mitigation: every adopted component gets a brand-token re-skin in the same commit.
- **Peer-dep version pin.** Radix primitives version-pin separately; bun handles this cleanly via bun.lock.

### Implementation cost

- Sheet (replaces hand-rolled drawer): 4-6 hours including a11y verify
- Accordion (replaces FAQ disclosure): 2-3 hours
- Toast (added when GHL ships): 1-2 hours
- Dialog/Tabs/Tooltip seeded but unused: 1 hour each (copy-paste + brand re-skin only)

### Effect on current workflow

- Adds `src/components/ui/` directory containing copied shadcn components (curated subset only).
- No build-tooling changes; shadcn output is React + Tailwind, exactly what's already in use.
- `audit:brand` scope expands to cover ui/ folder (one-line change).

### Effect on GHL

- Toast becomes useful WHEN GHL endpoints land (form-submit confirmation states). No GHL-side change.

### Effect on SEO/AEO

- None directly. Accordion preserves `<details>`/`<summary>` semantics by default (or aria-equivalent).
- Slight positive: Sheet's correct ARIA reduces the chance of search-engine perceived UX issues (rarely measured, but real).

### Effect on maintenance

- **Net positive over multi-cycle horizon.** The a11y lane stops re-litigating compound-component primitives; the brand lane focuses on the brand-bespoke surfaces (Hero, CTA, MarketCard) where the differentiation lives.

### Principal approval required

- **Yes, lightweight.** Principal approves the curated list (Sheet, Dialog, Accordion, Tabs, Tooltip, Toast) and the rule "Button, Card, Form, Select, Navigation Menu, Separator stay bespoke for now." Each adoption ships in its own commit; principal has revert authority.

---

## D. Payload CMS + Postgres

### Verdict: **Defer**

(Both Payload and Postgres deferred together — Postgres has no independent reason to enter the stack on this project absent Payload.)

**Why defer.** Three independent reasons, each sufficient on its own:

1. **Payload requires a server runtime; the site requires a static export.** Payload runs as a Next.js project in non-static mode (or Express); the admin panel and the API are server-rendered. Adopting Payload forces `output: 'export'` to drop, which means: (a) deploy substrate moves from "single-static-bucket-via-Caddy" to "Node.js server with managed processes"; (b) Lighthouse and AEO posture has to be re-validated post-migration; (c) build-vs-runtime determinism shifts. Each is a multi-cycle cost.

2. **The content-edit workload doesn't justify the cost yet.** The site's content surface is: 25 routes, 13 markets, 0 active blog posts, ≤6 unique copy blocks per market, 1 Mia bio, 5 FAQ blocks. Content changes ship as TypeScript edits to `src/lib/markets.ts`/`src/lib/mia.ts`/`src/lib/site.ts` — git is the CMS. Mia is not a content editor today; Torrey edits via PR. Compliance review attaches to the PR (where the principal-decision register lives). Bringing in Payload to manage 6 content shapes the team isn't editing creates an admin panel with no users.

3. **GHL is the CRM, not a content tool.** A common reason for adopting Payload is "we need a database for X"; that database is usually for forms, lead routing, or content. Forms route to GHL (when wired); lead-routing metadata lives in GHL; content lives in git. There is no "X" that Payload would address.

### Question matrix (all six cited explicitly)

- **Does Mia's site need an admin panel?** No today; possibly later if Mia begins editing copy directly OR insights/blog scales past ~30 posts.
- **Who would edit content?** Today: Torrey via PR. Mia rarely. Future: Mia for blog posts IF the blog matures.
- **Are Insights/blog/market pages changing often enough to justify CMS?** No. `/insights/` is currently an empty hub. Market pages stabilize after authoring; copy changes are quarterly at most.
- **Does GHL remain CRM-only?** Yes. CRM ≠ CMS.
- **Would Payload help with:**
  - blog publishing — only IF blog scales past 30 posts AND Mia self-edits.
  - market page content management — slight benefit; current TS-as-content is auditable, type-safe, git-versioned. Net neutral.
  - image/media library — modest benefit; current `public/` directory + `audit:images` sentinel covers integrity. Net neutral.
  - compliance-reviewed content — **negative**; Payload's draft/publish model bypasses git's compliance-attach pattern. Compliance review against PR is stronger than against an admin-panel save.
  - lead routing metadata — N/A; that's GHL territory.
  - preview workflow — modest benefit; today's Vercel-style preview-per-PR is achievable via static-deploy preview branches.
  - content versioning — git already provides this.
- **Would Postgres add unnecessary hosting and ops overhead right now?** Yes. Backups, monitoring, schema migrations, connection pooling — all real costs without a current return.
- **Would Payload conflict with current static-export/deploy path?** Yes. Static export goes away; deploy substrate changes; runtime monitoring required.
- **Would it require moving from static export to server runtime?** Yes.
- **What would migration cost and risk be?** Roughly 40-80 hours dedicated cycle; risk includes Lighthouse regression, deploy-substrate change at Helos VPS, ops surface for Postgres.

### Risk of adopting now

- **Reversibility:** very low. Once content lives in Postgres, rolling back to git-as-CMS requires an export pipeline.
- **AEO regression:** static HTML is the AEO substrate; SSR-rendered HTML is fine but introduces hydration and runtime variance.
- **Compliance attach surface lost:** PR-based review is the strongest pattern for legal/compliance approval today.

### Implementation cost (if adopted)

- 40-80 hours dedicated cycle: schema design, content migration, admin-panel UX, deploy-substrate change, ops setup. None of this is value-creating for cycle 6.

### Effect on current workflow

- **If adopted:** content team needs admin training; PR-as-compliance-checkpoint is replaced by admin-panel-as-checkpoint (weaker).
- **If deferred:** unchanged.

### Effect on GHL

- None either way. Payload doesn't replace CRM; GHL doesn't manage content.

### Effect on SEO/AEO

- **If adopted now:** regression risk; static HTML beats hydrated SSR for AEO baseline.
- **If deferred:** unchanged baseline preserved.

### Effect on maintenance

- **If adopted now:** new ops surface (Postgres backups + Payload version pinning + admin auth + email integration). Significant ongoing cost.
- **If deferred:** unchanged.

### Principal approval required

- **Yes**, if adopting. Defer-now does not require approval — it is the default per cycle-6 mission boundaries.

### Re-evaluation criteria (when to revisit)

Revisit Payload when ALL of the following are true:
- Insights/blog has ≥ 30 published posts AND active editorial calendar
- Mia self-edits ≥ 1 post per month OR the team includes a non-engineer content editor
- A separate need for Postgres has emerged (e.g., listing intake, custom CRM, gated content)
- The compliance-via-PR pattern has demonstrably failed at least once in production

If those conditions arrive, the migration runs as an architecture spike (separate cycle, separate ISA, no design-cycle bundling).

### Alternative if exploration is desired

A **prototype-only spike** is acceptable: a separate branch (`spike/payload-poc`) implementing a single-collection Payload demo (e.g. Insights), targeting a localhost-only deploy, with an explicit "spike-only, no production commitment" tag. Cost ≈ 8-12 hours; output is a decision aid, not a production pathway. Not recommended for cycle 6 (out of scope per mission); flagged for principal awareness.

---

## Summary table for handoff

| Stack item | Verdict | Approval needed | Cost | Cycle to ship |
|---|---|---|---|---|
| Next.js + TypeScript | Keep now | No | 0h | n/a (in production) |
| TS sharpening (BuildSchema, branded primitives) | Keep now (additive) | No | ≤4h | Cycle 7 |
| Tailwind v4 (pinned beta) | Keep now | No | 0h | n/a |
| Tailwind token extractions (shadow-hero, gradient-overlay, eyebrow-tracking) | Keep now (additive) | No | ≤3h | Cycle 6 (if Lane 4 flags) |
| shadcn Sheet | Adopt selectively | Light approval | 4-6h | Cycle 7 candidate |
| shadcn Accordion | Adopt selectively | Light approval | 2-3h | Cycle 7 candidate |
| shadcn Dialog/Tabs/Tooltip | Adopt selectively (seed only) | Light approval | 1h each | Cycle 7 candidate |
| shadcn Toast (paired w/ GHL) | Adopt selectively | Light approval | 1-2h | GHL cycle |
| shadcn Button/Card/Form/Select/Nav/Separator | Reject for this project | No | n/a | n/a |
| Payload CMS | Defer | n/a (default) | n/a | revisit when criteria met |
| Postgres | Defer | n/a (default) | n/a | revisit alongside Payload |

## Cross-link

- Brand System Contract: `docs/BRAND_SYSTEM_CONTRACT.md` (LOCKED — every shadcn re-skin must respect this)
- Principal Decision Register: `docs/PRINCIPAL_DECISION_REGISTER.md` (Cards 1, 2, 4, 5, 6 OPEN; design polish must not silently resolve them)
- Project ISA: `~/code/mia-sanabria-website/ISA.md` (system of record)
- Algorithm: `~/.claude/PAI/ALGORITHM/v6.4.0.md`
- Skill: `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.2.0

## Next-cycle expectation

If the principal approves, cycle 7 implements the **Tailwind token extractions** (low risk, 3h) and the **shadcn Sheet adoption** (4-6h with a11y verify). Subsequent cycles add Accordion + the seeded primitives as their host surfaces emerge. Payload + Postgres re-evaluation is queued for "when re-evaluation criteria above are met" — no cycle assigned.
