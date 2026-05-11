# Cycle 20 — IDX / Search Surface Audit

> Source: `docs/artifacts/cycle-20-agency-qa/idx-search-audit.md`
> Component under review: `src/components/IdxEmbed.tsx` (51 lines)
> Hosting route: `/` (homepage only). There is **no `/search` route** in `src/app/`.
> Iframe src: `https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=`
> Mission packet non-negotiable: **preserve the current iframe IDX implementation. Do not recommend replacing IDX in this cycle.**

## 1. IDX surface inventory

| Property | Value |
|---|---|
| Implementation type | `<iframe>` |
| Vendor | Matrix MLS (`sef.mlsmatrix.com`, Southeast Florida MLS) |
| Account ID in URL | `idx=10bd1eab` |
| Hosting route | `/` only (rendered after `InsightsTeaser`, before `CTAStrip`) |
| Section heading | "Search available Southeast Florida listings." |
| Wrapper copy | "Use the embedded search as a starting point, then contact Mia for a property-specific review, current comparable sales, and next-step guidance." |
| Iframe attributes | `title="Southeast Florida property search"`, `width=1200`, `height=900`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"` |
| Responsive sizing | Tailwind `min-h-[760px] w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/2] lg:min-h-[800px]` |
| Fallback | `<noscript>` containing direct link to `searchUrl`, styled "Open the Southeast Florida property search." |

## 2. What is already good (preserve verbatim)

This is one of the better embedded-iframe implementations in the codebase. Specifically:

- **Iframe has a meaningful `title` attribute** — "Southeast Florida property search" — satisfies WCAG 4.1.2 / pa11y `iframe-has-title`. (Many iframe embeds in the wild ship with no title.)
- **`loading="lazy"` is present** — defers the third-party load below the fold, preserving Core Web Vitals on the homepage.
- **`referrerPolicy="strict-origin-when-cross-origin"`** — limits referrer information leaked to sef.mlsmatrix.com.
- **`<noscript>` fallback link** — covers the rare-but-real case of disabled JavaScript by linking directly to the public IDX URL.
- **Responsive aspect ratios** — explicit Tailwind classes adapt the iframe across breakpoints rather than letting the iframe's intrinsic 1200×900 dimensions dictate.
- **Semantic section + heading id** — `<section aria-labelledby="idx-heading">` with the heading carrying `id="idx-heading"` is proper aria-labelledby wiring.

**Do not modify any of the above.** They are explicit checkboxes that an a11y/SEO auditor (or principal-side counsel reviewing pre-cutover) would flag the absence of.

## 3. Live behavior (per-breakpoint spot-check)

| Viewport | Iframe rendered height | Visible content | Notes |
|---|---|---|---|
| 320×568 (iPhone SE) | ~400px aspect-[4/5] | search form visible, results scroll inside iframe | Matrix's mobile layout is workable but cramped — outside Mia's control |
| 375×667 (iPhone X) | ~466px aspect-[4/5] | same | same |
| 414×896 (iPhone Pro Max) | ~516px aspect-[4/5] | same | same |
| 768×1024 (iPad) | ~528px aspect-[16/11] | desktop-class layout begins | wrapper sets `min-h-[760px]` so iframe is never tiny |
| 1280×800 (desktop) | 800px+ min, aspect-[3/2] | full Matrix search UI | comfortable |

The wrapper sizing is genuinely responsive. The iframe's *interior* is a third-party render Mia cannot style.

## 4. Audit findings

### IDX-1 — IDX iframe is the highest-traffic lead-leak surface on the site

**Finding:** Anyone who searches via the embedded iframe and submits a Matrix-side "Save Search" / "Contact Agent" / sign-up form is captured by the IDX vendor's lead system, not Mia's. There is no integration between Matrix's lead capture and Mia's eventual GHL CRM. Visitors who interact with the iframe and then drop off may believe they have left a trail with Mia when they have not.

**Severity:** P1. **Owner-type:** 3 (principal decision — IDX vendor relationship + how aggressively to redirect search traffic into Mia's CRM).

**Evidence:**
- `src/components/IdxEmbed.tsx` line 2: `searchUrl = "https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or="`
- No `postMessage` listener, no event wiring, no analytics on iframe interaction (cross-origin iframe → out of reach for client-side instrumentation).

**Recommendations (wrapper-only, no iframe replacement):**

1. **Add a "After you search, talk to Mia" CTA strip immediately below the iframe.** One sentence + a `Begin a Private Conversation` button → `/contact/?source=home-idx-handoff` (the query param is the attribution hook for the Phase-11 GHL cutover). Cost: 6 lines of JSX in `IdxEmbed.tsx`, no behavior change. Tier-2 candidate for this cycle if budget; otherwise next cycle.
2. **Mention the search→conversation handoff in the wrapper paragraph** that already exists. Current line 16: "Use the embedded search as a starting point, then contact Mia for a property-specific review, current comparable sales, and next-step guidance." This already does this work — no edit needed unless tightening.
3. **Long-term (out of scope this cycle):** principal-side conversation with the IDX vendor about lead-routing. Matrix sends leads to the listing agent on each property; Mia is presumably the buyer's agent for many of those interactions but the vendor's UX doesn't route there. This is a business-relationship issue, not a code issue.
4. **Anti:** do NOT inject a "Mia" header overlay onto the iframe (cross-origin → can't be done cleanly), do NOT wrap the iframe in a "Talk to Mia" interstitial that fires on interaction (cross-origin → can't detect).

### IDX-2 — IDX is only on the home page; no dedicated `/search` route

**Finding:** The homepage embeds `IdxEmbed`. There is no `/search` route in `src/app/`. Visitors looking for a dedicated search page won't find one.

**Severity:** P3. **Owner-type:** 3 (principal decision).

**Evidence:**
- `find src/app -name "page.tsx"` enumeration confirms no `search/` directory.
- `src/app/page.tsx` line 127: `<IdxEmbed />`.

**Recommendations:** Defer. Adding `/search` is a small lift (a route that renders `IdxEmbed` standalone) but creates a second indexable surface duplicating homepage content. Principal decision. If pursued, ensure canonical = `/` and add `<link rel="canonical">` to avoid duplicate-content SEO penalty.

### IDX-3 — Iframe focus / keyboard nav

**Finding:** Cross-origin iframes silently swallow keyboard focus into their internal DOM, which is fine for a search UI (users expect tab to land in the search field), but `globals.css` line 157 adds `iframe:focus-visible` styling — this confirms keyboard-focus styling is considered.

**Severity:** P3 → already addressed. **Owner-type:** 1 (site).

**Evidence:** `src/app/globals.css:157`.

**Recommendation:** Preserve. No change.

### IDX-4 — Fallback link in `<noscript>` is the only IDX path for no-JS users

**Finding:** The `<noscript>` fallback links to `searchUrl` directly. For users with JS disabled, this is honest and works. For users on browsers that block iframes per CSP / EU privacy modes, the iframe will fail silently — there is no script-side detection or "we noticed the search didn't load" message.

**Severity:** P3. **Owner-type:** 1 (site).

**Recommendation:** Defer. The current behavior is acceptable. A future hardening pass could add an `iframe.onload` timeout that swaps in the fallback link if the iframe doesn't load within N seconds.

### IDX-5 — Wrapper copy doesn't push the value of "talking to Mia" over "searching alone"

**Finding:** Current wrapper copy (line 16): "Use the embedded search as a starting point, then contact Mia for a property-specific review, current comparable sales, and next-step guidance." This is fine. It does NOT lean into the AEO-friendly framing that Mia's value over a generic IDX search is curation and access. A future micro-edit could sharpen this.

**Severity:** P3. **Owner-type:** 1 (site) — copy editor discretion.

**Recommendation:** Tier-2 candidate. Defer to a copy-pass cycle.

### IDX-6 — Iframe `sandbox` attribute is absent

**Finding:** No `sandbox` attribute on the iframe. For a trusted vendor (Matrix MLS) this is normal; adding `sandbox` would break the search UI's internal navigation and form submits.

**Severity:** P3. **Owner-type:** 1 (site).

**Recommendation:** Preserve. Do not add `sandbox` to a trusted vendor iframe.

## 5. Things explicitly NOT recommended

- ❌ Replacing the iframe with a server-rendered IDX via API (out of scope, mission non-negotiable #1).
- ❌ Adding a `?_=` cache-bust to the iframe `src` (would defeat Matrix's own caching and pad the search URL with noise).
- ❌ Wrapping the iframe in a "consent required" interstitial — Matrix MLS is a trusted real-estate-industry vendor and gating is a UX tax.
- ❌ Cloning the iframe to a `/search` route as a duplicate surface — see IDX-2.

## 6. Summary

**Verdict:** the IDX surface is already in the top-quartile of embedded-iframe real-estate implementations. The only material finding is **IDX-1** (lead leak to vendor) which is a principal-decision business issue, not a code defect.

**Cross-references to issue matrix:** IDX-1 → ISS-004 (P1); IDX-2 → ISS-011 (P3); IDX-3/4/5/6 → no matrix row (preserve).
