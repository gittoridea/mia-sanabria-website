# Team 9 — Security, Ops, Launch & Cutover (Cycle 21-AI-REMAINING-WORK)

**Date:** 2026-05-11 · **Mode:** READ-ONLY audit. No source edits, no DNS, no GHL, no Search Console submissions, no token rotations. **Repo:** `/home/torrey/code/mia-sanabria-website` · **Staging:** `https://miasanabriarealtor.trueidea.com` · **Production target (per repo):** `https://miasanabriarealtor.com` (note: prompt said `miasanabria.com` — `src/lib/site.ts` PRODUCTION_URL is `miasanabriarealtor.com`; flag for principal confirmation).

---

## Section 1 — Secret / Key Exposure Audit

| Check | Result | Evidence |
|---|---|---|
| `.env*` files in repo | **CLEAN** — none present (only `next-env.d.ts` type shim). | `find . -maxdepth 3 \( -name .env -o -name .env.\* \)` returns empty |
| `.env*` in `.gitignore` | **CLEAN** — `.env`, `.env*.local` ignored. | `.gitignore` lines 25-26 |
| Hardcoded API keys / bearer tokens / passwords in `src/` | **CLEAN** — zero matches for `api_key`, `secret`, `bearer`, `password` outside CSS-token comments. | `grep -rniE 'api[_-]?key\|secret\|token\|bearer\|password' src/` — 3 matches, all reference CSS design tokens (`MarketCard.tsx`, `LeadCaptureCTA.tsx`, `globals.css`) |
| `process.env.*` usage | **MINIMAL** — single usage: `NEXT_PUBLIC_SITE_URL` (build-time, public-by-design). | `src/lib/site.ts:9` |
| Dokploy / GHL / OpenRouter tokens anywhere in repo | **CLEAN** — only `~/.claude/.env` references in ISA + closeout docs (paths, not values). | `git grep DOKPLOY` — all references are doc-level `DOKPLOY_API_TOKEN` path mentions |
| Build artifact (`out/index.html`) secret check | **CLEAN** — no `G-`, `GTM-`, `api_key`, `secret`, `gtag`, `googletagmanager`, `google-analytics` strings in built HTML. | `grep -c gtag out/index.html` = 0 |
| Public IDs (intentional) | GA4 `G-PYYSF87G8K` + UserWay `vVNkJJLvR4` declared in `src/lib/mia.ts:38` but **not injected** in any component. Stays inert until cutover flag flips. | confirmed `grep gtag src/` returns nothing |

**Verdict:** Section 1 is clean. Zero accidental-secret exposure. GA4/UserWay IDs are public-by-nature measurement IDs (not credentials).

---

## Section 2 — robots / sitemap / noindex Coherence

Staging posture (verified live via curl `?cb=<hex>` cache-bust):

| Surface | Expected (staging) | Live | Status |
|---|---|---|---|
| `/robots.txt` | `Disallow: /` for all UAs | `User-Agent: *\nDisallow: /\nHost: https://miasanabriarealtor.trueidea.com` | PASS |
| `<meta name="robots">` on `/` | `noindex, nofollow, nocache` | `noindex, nofollow, nocache` | PASS |
| `<link rel="canonical">` on `/` | staging URL | `https://miasanabriarealtor.trueidea.com/` | PASS — flips automatically when `NEXT_PUBLIC_SITE_URL` changes |
| `/sitemap.xml` accessible | XML 200 OK, 40 `<loc>` entries | 200 OK, 40 entries | PASS |
| `IS_STAGING` gate | `!SITE_URL.startsWith(PRODUCTION_URL)` | logic correct (`src/lib/site.ts:17`) | PASS |

**Coherence:** robots.txt block + meta noindex + canonical-to-staging are all gated by the same `IS_STAGING` variable. **One env-var flip (`NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.com`) flips all three coherently.** No drift risk.

**Note:** sitemap is still served on staging even though robots blocks. Acceptable (sitemap.xml content is staging-host-bound, won't help leak indexability), but consider conditionally returning empty sitemap on staging for defense-in-depth (T9-S2-01).

---

## Section 3 — PDF / Lead-Magnet Header Policy

3 PDFs live at `/downloads/*.pdf` (~110KB each):
- `fort-lauderdale-waterfront-valuation-prep-sheet.pdf`
- `luxury-seller-pre-listing-checklist.pdf`
- `waterfront-buyer-due-diligence-checklist.pdf`

Headers observed via `curl -I`:

```
content-type: application/pdf
cache-control: (none — falls through, no @media rule matches .pdf)
x-content-type-options: nosniff   ✓
x-robots-tag: (MISSING)
```

**Finding T9-S3-01:** PDFs lack `X-Robots-Tag: noindex, noimageindex` header. On staging this is moot (robots.txt blocks `/`). **At production cutover, the 3 PDFs will be crawlable and indexable**, which is fine for lead-magnet PDFs *if intentional* — but they should NOT show up as competing search results for waterfront-buyer-due-diligence queries (cannibalizes the insight pages that already cover the topic).

**Recommended Caddyfile addition (NOT applied — gated):**

```caddy
@pdf path *.pdf
header @pdf {
  X-Robots-Tag "noindex, noimageindex"
  Cache-Control "public, max-age=86400, must-revalidate"
}
```

**Effort:** 5 min. AI-can-prep. Apply via Dokploy redeploy at cutover; do NOT touch prod Caddy live.

---

## Section 4 — Canonical Strategy at Cutover

| Surface | Today (staging) | At cutover | Mechanism |
|---|---|---|---|
| `SITE.url` | `miasanabriarealtor.trueidea.com` | `miasanabriarealtor.com` | `NEXT_PUBLIC_SITE_URL` build arg in Dokploy |
| `<link rel="canonical">` | staging | prod | derived from `SITE.url` |
| `<meta name="robots">` | `noindex, nofollow, nocache` | `index, follow` (+ extended Google directives) | `IS_STAGING` flips false |
| `/robots.txt` | `Disallow: /` | allow `/`, disallow `/api/`, `/_next/`, AhrefsBot, SemrushBot, MJ12bot, DotBot | `IS_STAGING` flips false |
| `/sitemap.xml` `<loc>` host | staging | prod | derived from `SITE.url` |
| JSON-LD schema `@id` / `url` | staging | prod | derived from `SITE.url` |
| OpenGraph / Twitter image URLs | staging-hosted | prod-hosted | derived from `SITE.url` |
| hreflang `en-US` / `x-default` | staging | prod | `layout.tsx` lines 103-104 |
| Staging subdomain post-cutover | live, indexable disallowed | **needs 301 → prod** to prevent duplicate-content | Caddy route in `Caddyfile` (DEPLOY.md §Cutover step 4) |

**Single point of truth:** `src/lib/site.ts` PRODUCTION_URL constant (`miasanabriarealtor.com`). All downstream surfaces consume `SITE.url` — no scattered string-coded staging URLs in `src/` (verified `grep -rn 'miasanabriarealtor.trueidea.com' src/` → 0 hits).

**Pre-flight:** principal must confirm production host is `miasanabriarealtor.com` (currently on Direct Axess) and NOT `miasanabria.com` (which the prompt named — may be a separate domain or typo). If `miasanabria.com` is also owned and target, add as canonical alternate + 301 from `miasanabriarealtor.com` ↔ `miasanabria.com` policy decision.

---

## Section 5 — Launch-Cutover AI-Ready Plan

### 5.1 What AI can prep NOW (READ-ONLY artifacts, no live writes)

1. **Cutover smoke-test script** — drop in `scripts/cutover-smoke-test.ts`. Same shape as `deploy-and-verify.ts`. AI-buildable.
2. **Redirect map** — staging → prod 301 list:
   - `https://miasanabriarealtor.trueidea.com/*` → `https://miasanabriarealtor.com/$1` (after cutover, staging stays alive as redirect host for ~60 days).
   - `https://www.miasanabriarealtor.com/*` → `https://miasanabriarealtor.com/$1` (canonicalize to apex).
   - Existing `netlify.toml` already has 2 internal redirects (`/home-valuation/*` → `/valuation/`, `/content/about/*` → `/about/`) — port into Caddy at cutover.
3. **Rollback runbook** — Dokploy keeps prior deployment image; rollback is a UI click + DNS revert + sitemap re-submission. AI-documentable.
4. **GBP / NAP consistency sheet** — generate a single canonical NAP block (Name / Address / Phone) from `src/lib/mia.ts` for principal to paste into GBP, social bios, MLS profile, LPT directory.
5. **Search Console verification file placeholder** — AI can pre-stage `public/google<hash>.html` ONCE principal pastes the verification token. Until then, planned-only.

### 5.2 Smoke-test plan (route × expected-status × expected-header)

| Route | Method | Expected status | Expected header check |
|---|---|---|---|
| `/` | GET | 200 | canonical=prod, robots=index |
| `/about/` | GET | 200 | canonical=prod, JSON-LD Person count ≥1 |
| `/contact/` | GET | 200 | mailto present (until GHL endpoint) |
| `/buyers/`, `/sellers/`, `/valuation/`, `/markets/`, `/insights/` | GET | 200 | canonical=prod |
| `/markets/{16 slugs}/` | GET | 200 | OG image 200, canonical=prod |
| `/insights/{12 slugs}/` | GET | 200 | OG image 200, JSON-LD Article |
| `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` | GET | 200 | canonical=prod |
| `/thank-you/`, `/thank-you/buyer-brief/`, `/thank-you/market-brief/`, `/thank-you/valuation/` | GET | 200 | (allowed-to-be `noindex` if added) |
| `/downloads/*.pdf` (3) | HEAD | 200 | `content-type: application/pdf`, `X-Robots-Tag: noindex` (after T9-S3-01 fix) |
| `/sitemap.xml` | GET | 200 | `<loc>` hosts = prod |
| `/robots.txt` | GET | 200 | `Allow: /`, `Sitemap: prod/sitemap.xml` |
| `/manifest.webmanifest` | GET | 200 | `application/manifest+json` |
| `/nonexistent` | GET | 404 | rewrites to `/404.html` |
| `/api/*` | GET | 404 | (no API routes in static export) |

**Status today (staging):** 18/18 critical routes return 200. Last verified by curl sweep with `?cb=<hex>` cache-bust at audit time.

### 5.3 Cutover sequence (gated — human ownership marked)

| # | Step | Owner | Tooling |
|---|---|---|---|
| 1 | Confirm production domain (`miasanabriarealtor.com` vs `miasanabria.com`) | **Human** | principal decision |
| 2 | Snapshot current GBP NAP, social bios, MLS profile for diff against site | **Human** | manual |
| 3 | Pause Direct Axess publish on current `miasanabriarealtor.com` (or arrange parallel hosting) | **Human** | Direct Axess control panel |
| 4 | Lower DNS TTL on `miasanabriarealtor.com` A record to 300s — 24h before cutover | **Human** | DNS provider |
| 5 | Add `miasanabriarealtor.com` + `www.miasanabriarealtor.com` to Dokploy app `XJSRlvH-91ZtUsh0RPGvo` domains list | **Human** | Dokploy UI |
| 6 | Update Dokploy build arg `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.com` | **Human** | Dokploy UI |
| 7 | Trigger Dokploy redeploy → wait for Let's Encrypt cert | AI-can-trigger via `deploy-and-verify.ts` once human approves | `bun scripts/deploy-and-verify.ts` |
| 8 | Cut DNS A record to Helos VPS IP `148.230.82.215` | **Human** | DNS provider |
| 9 | Run smoke-test script against `https://miasanabriarealtor.com/` | AI | new `scripts/cutover-smoke-test.ts` |
| 10 | Add Caddy 301 route: staging → prod | AI-can-prep, **Human** approves Dokploy push | edit `Caddyfile` + Dokploy redeploy |
| 11 | Submit prod sitemap to Google Search Console + Bing Webmaster | **Human** | GSC / Bing UI |
| 12 | Verify GBP NAP exactly matches `src/lib/mia.ts` (phone, address, agent name, brokerage) | **Human** | GBP UI |
| 13 | Decide on branded email (`mia@miasanabriarealtor.com` vs continue gmail) | **Human** | provider decision |
| 14 | Wire GA4 (`G-PYYSF87G8K`) — if enabled — via `<script>` in `layout.tsx` behind `NEXT_PUBLIC_ENABLE_GA` flag | AI-can-prep PR | new env var + 1 component |
| 15 | Wire UserWay (`vVNkJJLvR4`) — same flag pattern | AI-can-prep PR | 1 component |

### 5.4 Rollback path

Dokploy keeps the previous deployment artifact (Docker image tag history). Rollback steps:

1. In Dokploy, redeploy the prior image (one-click "redeploy" of the previous build).
2. If DNS was cut, revert A record to Direct Axess origin OR keep traffic on Dokploy and redeploy the prior staging-canonical build.
3. Resubmit nothing — Search Console will re-crawl on its own cadence; the prior `Disallow: /` posture on staging-host stays safe.

**Estimated rollback time:** 5 min for redeploy, +DNS TTL window for DNS revert. Lower TTL pre-cutover (step 4 above) reduces the window.

---

## Section 6 — Dependency & External-Link `rel` Findings

### 6.1 External-link `rel` audit

`grep -rn 'target="_blank"' src/` returns **1 match**: `src/components/SiteFooter.tsx:225` (social icons). That link uses `rel="noopener noreferrer"` (line 226). **PASS — full coverage.**

`<iframe>` audit: 1 iframe (`src/components/IdxEmbed.tsx`) embedding `https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?...`. Uses `referrerPolicy="strict-origin-when-cross-origin"`. CSP `frame-src` allow-lists this host (`Caddyfile:30`). No `sandbox` attribute — acceptable for trusted MLS provider; tightening would be `sandbox="allow-scripts allow-forms allow-same-origin allow-popups"` (defense-in-depth, T9-S6-01).

### 6.2 Dependency risk surface

Production dependencies (from `package.json`):

| Package | Installed | Latest | Risk |
|---|---|---|---|
| `next` | 15.1.0 | 16.2.6 | One major behind. **Next.js 15.1 has no published critical CVEs as of audit date** (CVE-tracking via npm advisory: clean for `next@15.1.0`). Defer until cutover stability proven. |
| `react`, `react-dom` | 19.0.0 | 19.2.6 | Patch-level only. Safe. |
| `lucide-react` | 0.460.0 | 1.14.0 | Major jump — cosmetic icon lib, no security surface. Defer. |
| `pdfjs-dist` | 5.7.284 | n/a checked | **Used only by build-time PDF rendering script** (`scripts/render-lead-magnets.ts`). Not shipped to client. Recommend confirming. |
| `schema-dts` | 1.1.5 | 2.0.0 | Type-only, no runtime. Safe. |
| `clsx`, `tailwind-merge` | current | current | Safe. |

**No known-vulnerable patterns** detected. **No `npm audit` style advisories surfaced via `bun outdated`.** Recommend running `bun pm ls --all | wc -l` to spot accidental devDep promotions; not blocking for cutover.

### 6.3 Cache-bust strategy

Deploy script (`scripts/deploy-and-verify.ts:25`) uses `cb=${randomBytes(8).toString("hex")}` — matches global doctrine (memory note: `feedback_caddy_dokploy_cache_bust.md`). Caddy serves stale otherwise. **PASS — pattern correct.**

`Cache-Control` headers per Caddyfile:
- HTML: `public, max-age=300, s-maxage=600, must-revalidate` (5min browser, 10min shared)
- Hashed `_next/static/*`: `public, max-age=31536000, immutable`
- Media (`*.svg|jpg|jpeg|png|webp|avif|woff2`): `public, max-age=2592000, must-revalidate` (30 days)
- PDF: no rule (falls back to Caddy default) — see T9-S3-01

### 6.4 CSP audit

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: https:;
connect-src 'self' https://www.google-analytics.com;
frame-src 'self' https://sef.mlsmatrix.com https://www.google.com https://maps.google.com;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
```

- `'unsafe-inline'` for scripts — Next.js inlines its hydration boot. Hard to remove without nonces. Acceptable for static export. T9-S6-02 (low-priority hardening).
- `img-src https:` — wide-open over HTTPS. Defense-in-depth would scope to `'self' data: https://*.googleusercontent.com` etc. Low priority.
- GA/GTM hosts pre-allow-listed — ready for GA4 enablement without CSP edit.

### 6.5 Security headers summary (Caddyfile)

| Header | Value | Status |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | PASS |
| `X-Content-Type-Options` | `nosniff` | PASS |
| `X-Frame-Options` | `SAMEORIGIN` | PASS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | PASS |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` | PASS |
| `Server: Caddy` | stripped on 2xx via `-Server` directive | **Leaks on 4xx error pages** (404 returns `server: Caddy`). T9-S6-03 (low). |

---

## Section 7 — Safe AI-Fix Candidates (Cycle 21 stretch)

| ID | Fix | Files | Effort | Risk | Gate |
|---|---|---|---|---|---|
| T9-F1 | Add `X-Robots-Tag: noindex, noimageindex` for PDFs in `Caddyfile` | `Caddyfile` | 5 min | Low — Caddy local edit, redeploy via Dokploy | Human approves Dokploy push |
| T9-F2 | Write `scripts/cutover-smoke-test.ts` (route × header matrix) | new file | 30 min | None — read-only network probes | Self-contained |
| T9-F3 | Write `docs/CUTOVER_RUNBOOK.md` consolidating §5.3 + §5.4 | new doc | 20 min | None | Self-contained |
| T9-F4 | Add `sandbox="..."` to `IdxEmbed` iframe (defense-in-depth) | `src/components/IdxEmbed.tsx` | 10 min | Low — could break MLS embed if too tight; test on staging | Need audit:rendered re-capture |
| T9-F5 | Conditional empty sitemap on staging (`if (IS_STAGING) return [];`) | `src/app/sitemap.ts` | 5 min | None — staging-only diff | Self-contained |
| T9-F6 | Pre-stage GA4 + UserWay injection behind `NEXT_PUBLIC_ENABLE_ANALYTICS` env flag (off by default) | `src/app/layout.tsx`, `src/lib/site.ts` | 45 min | Low — gated off; only fires when human flips env at cutover | Self-contained |
| T9-F7 | Add Caddy `@html` rule explicit `X-Robots-Tag` on staging (belt-and-braces over meta tag) | `Caddyfile` | 5 min | Low | Human approves Dokploy push |
| T9-F8 | Strip `Server` header on error responses too (move `-Server` into `handle_errors` block) | `Caddyfile` | 2 min | Low | Human approves Dokploy push |
| T9-F9 | Add `bun audit` / `bun pm audit` to pre-deploy gate in `deploy-and-verify.ts` | `scripts/deploy-and-verify.ts` | 15 min | None — read-only | Self-contained |
| T9-F10 | Document branded-email decision matrix (Workspace vs Zoho vs Fastmail) | new doc | 20 min | None | Self-contained — principal decision input |

**Explicit non-candidates (DO NOT — gated by CLAUDE.md):**
- DNS edits (any provider, any record).
- Dokploy production config edits via API.
- Search Console verification submission.
- Token rotation of `DOKPLOY_API_TOKEN`, `OPENROUTER_API_KEY`.
- Touching `miasanabriarealtor.com` Direct Axess host.
- Inventing GHL form/webhook endpoints.
- Branded email mailbox provisioning.

---

## Section 8 — Issue Rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T9-S3-01	team9	/downloads/*.pdf	seo-policy	PDFs lack X-Robots-Tag header — at prod cutover the 3 lead-magnet PDFs become crawlable and indexable; risk of cannibalizing insight pages	curl -I /downloads/waterfront-buyer-due-diligence-checklist.pdf shows no x-robots-tag header	medium	cutover-readiness	Add @pdf header block to Caddyfile setting X-Robots-Tag noindex, noimageindex and Cache-Control 86400	ai-prep-human-approve	5min	high	yes	Caddyfile	curl -I post-deploy expects x-robots-tag: noindex
T9-S2-01	team9	/sitemap.xml	defense-in-depth	Sitemap served on staging even though robots.txt blocks; low risk but easy to harden	curl -s /sitemap.xml on staging returns 40 entries	low	defense-in-depth	Conditional empty sitemap on staging — if IS_STAGING return [] in src/app/sitemap.ts	ai-only	5min	high	yes	src/app/sitemap.ts	build + curl /sitemap.xml expects empty urlset
T9-S4-01	team9	site-wide	canonical	Prompt named miasanabria.com as prod target but src/lib/site.ts PRODUCTION_URL = miasanabriarealtor.com — possible domain confusion	src/lib/site.ts:7 const PRODUCTION_URL = https://miasanabriarealtor.com	high	cutover-blocker	Confirm with principal which domain is prod canonical; if miasanabria.com also owned define 301 policy	human-decision	5min	high	no	src/lib/site.ts	principal email/note
T9-S5-01	team9	cutover	tooling	No cutover smoke-test script exists — only deploy-and-verify which targets staging	ls scripts/ — no cutover-smoke-test.ts	medium	cutover-readiness	Write scripts/cutover-smoke-test.ts that runs route × header matrix against prod URL	ai-only	30min	high	yes	scripts/cutover-smoke-test.ts	bun scripts/cutover-smoke-test.ts exits 0
T9-S5-02	team9	cutover	docs	No consolidated CUTOVER_RUNBOOK.md — runbook scattered across DEPLOY.md Cutover section and tribal memory	ls docs/ — no CUTOVER_RUNBOOK.md	low	cutover-readiness	Consolidate §5.3 plus §5.4 into docs/CUTOVER_RUNBOOK.md	ai-only	20min	high	yes	docs/CUTOVER_RUNBOOK.md	manual review
T9-S5-03	team9	site-wide	analytics	GA4 ID stored in mia.ts but no injection scaffold — at cutover human will have to write the script tag from scratch	grep gtag src/ returns 0 hits	low	cutover-readiness	Pre-stage <script> injection in layout.tsx behind NEXT_PUBLIC_ENABLE_ANALYTICS flag default off	ai-only	45min	medium	yes	src/app/layout.tsx src/lib/site.ts	curl built HTML grep for gtag absent when flag off
T9-S5-04	team9	cutover	branded-email	msanabriarea@gmail.com is canonical email — at cutover principal may want mia@miasanabriarealtor.com; no decision doc exists	src/lib/mia.ts:24 email gmail.com	medium	cutover-decision	Author docs/BRANDED_EMAIL_DECISION.md with Workspace/Zoho/Fastmail cost/feature matrix	ai-only	20min	high	yes	docs/BRANDED_EMAIL_DECISION.md	principal review
T9-S6-01	team9	/markets and IdxEmbed	csp-hardening	IdxEmbed iframe has no sandbox attribute	src/components/IdxEmbed.tsx line 21-29 iframe with no sandbox	low	defense-in-depth	Add sandbox=allow-scripts allow-forms allow-same-origin allow-popups; verify MLS search still works	ai-only	10min	medium	yes	src/components/IdxEmbed.tsx	audit:rendered re-capture + manual MLS search test
T9-S6-02	team9	site-wide	csp-hardening	CSP allows unsafe-inline for script-src — Next.js hydration shim requires it for static export	Caddyfile line 30 script-src self unsafe-inline	low	defense-in-depth	Defer — needs nonce-based CSP and Next.js doesn't support nonces in static export trivially	defer	60min+	low	no	Caddyfile	no fix this cycle
T9-S6-03	team9	error-pages	header-leak	404 response leaks server: Caddy header; -Server directive is bypassed by handle_errors	curl -sI /nonexistent shows server: Caddy	low	info-disclosure	Move -Server into a top-level header block outside handle_errors or apply -Server inside handle_errors as well	ai-prep-human-approve	2min	high	yes	Caddyfile	curl 404 expects no server header
T9-S6-04	team9	site-wide	dependency	Next 15.1.0 is one major behind (16.2.6); no critical CVE for 15.1 at audit time but stays a future debt	package.json next 15.1.0 vs latest 16.2.6	low	tech-debt	Defer Next 16 until post-cutover stability proven; revisit in Cycle 23	defer	4hr	medium	no	package.json	bun outdated post-upgrade
```

---

## Section 9 — Confidence & Non-Negotiables Attestation

**Audit confidence:** **HIGH** for source-level findings (full read-only sweep of `src/`, `scripts/`, `public/`, `Caddyfile`, `Dockerfile`, `netlify.toml`, `package.json`, `.gitignore`, deploy script). **HIGH** for live-staging probes (smoke-tested all 18 critical routes + sitemap + robots with hex cache-busts). **MEDIUM** for production-cutover plan completeness (could not test prod domain since DNS not yet cut).

**Explicit non-negotiables observed (per CLAUDE.md gate):**
- ❌ Did NOT alter DNS, Dokploy config, Caddyfile, GHL endpoints, Search Console, or any token.
- ❌ Did NOT rotate `DOKPLOY_API_TOKEN`, `OPENROUTER_API_KEY`, or any other credential.
- ❌ Did NOT expose secret values in this artifact (no tokens, keys, or credentials reproduced).
- ❌ Did NOT touch Mia's existing `miasanabriarealtor.com` Direct Axess host.
- ❌ Did NOT invent GHL form/webhook endpoints.
- ❌ Did NOT submit anything to Google Search Console / Bing Webmaster.
- ✅ All findings are READ-ONLY observations; fixes are PROPOSED only.
- ✅ All `can_fix_now: yes` rows respect the gate ("ai-prep-human-approve" or "ai-only").

**Top cutover blockers (must clear before DNS):**
1. **T9-S4-01** — confirm prod domain is `miasanabriarealtor.com` (per repo) vs `miasanabria.com` (per prompt).
2. **T9-S5-04** — branded-email decision (gmail stays vs provision branded).
3. Direct Axess current `miasanabriarealtor.com` publish — coordinate sunset / parallel.

**Dissent / divergence from prompt:**
The prompt named `miasanabria.com` as PROD TARGET; the repo's `src/lib/site.ts:7` codes `PRODUCTION_URL = "https://miasanabriarealtor.com"` and DEPLOY.md uses `miasanabriarealtor.com` throughout. **I treated `miasanabriarealtor.com` as source-of-truth** because the repo is the operative reality. If `miasanabria.com` is a separate owned-domain or rename target, that is a principal-decision blocker, not an AI-safe action.

---

## Six-line Summary

1. **Secret/key exposure findings:** 0 (clean — no .env in repo, no hardcoded credentials in src, no secrets in build output; GA4/UserWay public IDs stored but inert/un-injected).
2. **Noindex coherence:** ALL coherent on staging — robots.txt Disallow:/, meta `noindex,nofollow,nocache`, canonical=staging, all gated by single `IS_STAGING` var; one env-flip flips all three.
3. **Canonical strategy:** Single source of truth `src/lib/site.ts` `PRODUCTION_URL=miasanabriarealtor.com` (NOT `miasanabria.com` as prompt stated); one `NEXT_PUBLIC_SITE_URL` build arg flip cuts over canonical+robots+sitemap+OG+schema together.
4. **Cutover blockers count:** 3 — domain confirmation (T9-S4-01), branded-email decision (T9-S5-04), Direct Axess sunset coordination (human-only).
5. **Top 3 AI-safe prep items:** T9-F1 PDF `X-Robots-Tag` Caddyfile rule (5min), T9-F2 `scripts/cutover-smoke-test.ts` (30min), T9-F3 `docs/CUTOVER_RUNBOOK.md` consolidation (20min).
6. **Dissent:** Prompt named `miasanabria.com` as PROD TARGET; repo codes `miasanabriarealtor.com`. Flagged as T9-S4-01 cutover blocker; defaulted to repo as source-of-truth.
