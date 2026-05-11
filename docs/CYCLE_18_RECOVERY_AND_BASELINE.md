# Cycle 18 — Recovery & Baseline

**Date:** 2026-05-10
**Effort:** E5 (classifier-driven; max effort)
**HEAD at start:** `9b7f828` (Cycle 17 closeout)
**Live ETag at start:** `dife89spr4sg4nrd` · last-modified `Sun, 10 May 2026 23:42:25 GMT` · HTTP 200

---

## 1. Working tree

- `git status --short` → clean
- `git log --oneline -10` → Cycle 17 closeout `9b7f828` on top, prior cycles 16/15/14 below
- `git rev-parse HEAD` → `9b7f8286bcf83ed6cd6c26743e1a811902dc7e1b`
- `git ls-remote origin main` → in sync (`9b7f828…`)

## 2. Local toolchain

| Probe | Result |
|---|---|
| `bun run typecheck` | exit 0 (`tsc --noEmit`) |
| `bun run lint` | exit 0 (`✔ No ESLint warnings or errors`) |
| `bun run build` | exit 0; static export OK |
| `bun run audit:trust-logos` | 30 PASS · 0 WARN · 0 FAIL |
| `bun run audit:fort-lauderdale-v3` | 11 PASS · 0 WARN · 0 FAIL |

`bun run audit:all:stable` queued in parallel; expected to confirm Cycle 17 final state of **1067 PASS · 4 WARN · 0 FAIL across 15 audits**.

## 3. Live deployment probe

```
HTTP/2 200
etag: "dife89spr4sg4nrd"
last-modified: Sun, 10 May 2026 23:42:25 GMT
cache-control: public, max-age=300, s-maxage=600, must-revalidate
content-security-policy: …  (CSP intact)
```

## 4. Site inventory at baseline

| Surface | Count | Notes |
|---|---:|---|
| Markets in `MARKETS` (`src/lib/markets.ts`) | **15** | `fort-lauderdale, coral-ridge, victoria-park, boca-raton, palm-beach, delray-beach, lighthouse-point, rio-vista, harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes, hillsboro-mile, bay-colony, bermuda-riviera` |
| Featured markets | 12 | per `FEATURED_MARKETS` |
| Homepage featured-pager order | 12 | locked in `HOMEPAGE_FEATURED_ORDER` |
| Insights posts | 12 | `src/data/insights/01..12-*.ts` |
| Total static routes (built) | 27+ | `/`, `/about/`, `/contact/`, `/buyers/`, `/sellers/`, `/valuation/`, `/markets/`, 15 × `/markets/[slug]/`, `/insights/`, 12 × `/insights/[slug]/`, `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, `/thank-you/*`, `/sitemap.xml`, `/robots.txt`, 404 |

## 5. Cycle 18 carry-forward — confirmed problem state at baseline

### 5a. Visible blog "Updated …" label (mission Phase 2)

Live HTML probe (`/insights/why-automated-valuations-miss-luxury-waterfront/`):

```bash
$ grep -oE "Updated [A-Z][a-z]+( [0-9]{4})?" /tmp/mia-live-insight.html | head
Updated May 2026
Updated May 2026
```

Source: `src/lib/insights.ts:328-330` — `getVisibleDateForPost` returns a `secondary: "Updated <Month YYYY>"` line for the `evergreen-month` mode. Article page (`src/app/insights/[slug]/page.tsx:158-168`) renders it as a `<time dateTime={post.dateModified}>…` element. `InsightCard` does NOT render the secondary — only `editorialMonthLabel`. So the visible "Updated …" label appears in **article pages only**, twice per page (header + reading-time row + closing footer's editorial label uses `editorialMonthLabel`, not "Updated").

**Removal target:** delete `secondary` from the `evergreen-month` branch of `getVisibleDateForPost`. The article page conditional `{visibleDate.secondary ? (<time …>…</time>) : null}` then renders nothing. Schema-side (`buildArticleSchema` → JSON-LD) keeps `dateModified` honest.

### 5b. Hillsboro Mile in `South Florida cities and towns` section (mission Phase 5)

Live HTML probe (`/markets/`):

```
"Eastern Fort Lauderdale neighborhoods" → renders as the secondary section heading
"Hillsboro Mile" → present (currently appears in primary "South Florida cities and towns")
```

Source: `src/lib/markets.ts:982` — Hillsboro Mile carries `cluster: "primary"`. The `/markets/page.tsx` partition routes `cluster: "primary"` markets to the section headed **"South Florida cities and towns."** (line 67). `cluster: "neighborhood"` markets route to **"The Fort Lauderdale waterfront and in-town clusters."** (line 84).

**Move target:** introduce a third cluster value (e.g., `"northern-broward-waterfront"`), reassign Hillsboro Mile to it, render section #2 with `[neighborhood ∪ northern-broward-waterfront]`, and rename heading to honor the geographic distinction without claiming Hillsboro Mile is Fort Lauderdale.

### 5c. Pompano Beach absent (mission Phase 6)

`grep -E "pompano" src/lib/markets.ts src/lib/mia.ts` → 0 matches.
`ls public/markets/ | grep pompano` → 0 matches.
`ls out/markets/ | grep pompano` → 0 matches.

**Add target:** new `pompano-beach` market entity, slug, image, OG, route, schema, sitemap, internal links.

### 5d. Fort Lauderdale page — V3 in place, V4 needed (mission Phases 3+4)

Source: `src/components/markets/FortLauderdaleV2.tsx` (621 lines) carries Cycle 17 V3 lift:
hero precision frame; `"A decision, not a default"` prelude; 7-card waterfront framework (insurance/4-point as emphasized 7th card); 6-peer comparison with `V3_PEER_POINTERS`; 5-step buyer playbook with anti-pattern aside; 5-step seller playbook with anti-pattern aside + Insights cross-link; 9 FAQs (5 from `market.faqs` + 4 V2-specific); 4-CTA strip.

**V4 target:** preserve filename + export name (route stability); deepen Buyer's Comparison cohort (add Pompano Beach + 13-market editorial); extend due-diligence framework (canal width / turning basin / outdoor living explicit cards); extend buyer playbook (financing/cash/insurance step); extend seller playbook (insurance/flood/elevation documents step + photography/narrative); FAQs 8 → 10-12 with new V4-specific entries; replace `audit:fort-lauderdale-v3` with `audit:fort-lauderdale-standard` checking V4 markers.

## 6. Specialist availability

```
$ bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json
available: ["forge", "cato", "perplexity"]
missing:   ["anvil"]
```

- **Forge** — `~/.local/bin/codex` w/ oauth (`~/.codex/auth.json`). PASS.
- **Cato** — same binary, `--sandbox read-only` accepted. PASS.
- **Anvil** — binary not found. Tombstoned for this cycle (Forge is the working alternative).
- **Perplexity** — `OPENROUTER_API_KEY` present. PASS.

## 7. Carry-forward WARNs (expected — both tracked, neither blocking)

| Audit | WARN | Reason |
|---|---|---|
| `audit:completeness` | `forms.classification` (2 mailto) | Lead capture currently mailto pending GHL form wiring (Cycle 18+ engineering, prereq-gated). |
| `audit:rendered` | `viewportSanity` mismatches (54/135 probes) | chrome `--dump-dom` mobile-clamp limitation; documented in Cycle 16 process upgrade. |

## 8. Cycle 18 work registered (taskboard)

15 tasks created under TaskCreate (P0..P15). Order, dependencies, and gates documented in PLAN phase below.

---

**Recovery + baseline OK. Working tree clean. Toolchain green. Cycle 18 begins from a known-good state.**
