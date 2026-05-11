# Team 3 — IDX / Search Experience Report
Cycle 21-AI-REMAINING-WORK · 2026-05-11 · Read-only inspection

> NON-NEGOTIABLE: Iframe IDX is preserved. All recommendations are wrapper/copy/handoff/a11y layer.

---

## 1. Current IDX wrapper inventory (file:line evidence)

| Surface | File | Line(s) | Note |
|---|---|---|---|
| Iframe component (sole implementation) | `src/components/IdxEmbed.tsx` | 1-42 | Single component; not parameterized; not used elsewhere |
| Iframe `src` (actual provider) | `src/components/IdxEmbed.tsx` | 2 | `https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=` |
| Iframe element + attrs | `src/components/IdxEmbed.tsx` | 21-29 | `title`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`. **No** `sandbox`, **no** `allow=`, **no** `name=` |
| Wrapper copy (before iframe) | `src/components/IdxEmbed.tsx` | 11-19 | Eyebrow "Property Search", H2, 1 paragraph |
| Wrapper copy (after iframe) | n/a | n/a | **None** — iframe is last child before noscript fallback |
| Noscript fallback | `src/components/IdxEmbed.tsx` | 30-37 | Anchor to same `searchUrl` |
| Section anchor target | `src/components/IdxEmbed.tsx` | 6, 13 | `aria-labelledby="idx-heading"`; section has **no `id`** for in-page jump links |
| Homepage placement | `src/app/page.tsx` | 10, 127 | Placed after `ValueProps` ("The Practice"), before `InsightsTeaser` |
| Market pages embed | `src/app/markets/[slug]/page.tsx` | — | **None** — IDX appears only on homepage |
| Buyers/Sellers pages embed | `src/app/buyers/page.tsx`, `src/app/sellers/page.tsx` | — | **None** |
| Global iframe focus style | `src/app/globals.css` | 157-162 | `iframe:focus-visible` brass outline — present |
| CSP allow for provider | `Caddyfile` | 27 | `frame-src 'self' https://sef.mlsmatrix.com …` — already allowlisted |
| IDX disclaimer (footer) | `src/components/SiteFooter.tsx` | 107-110 | "IDX listings provided for consumers' personal, non-commercial use" — present |
| Contact form (handoff target) | `src/app/contact/page.tsx` | 109-197 | `mailto:` action; **no** hidden `source` field |
| Valuation form (handoff target) | `src/app/valuation/page.tsx` | 102-187 | `mailto:` action; **no** hidden `source` field |

Note: mission brief references `https://miasanabria.com/search` as IDX target. Actual src is the Matrix sef provider URL. The `miasanabria.com/search` URL is **not present** in the repo. Treating sef Matrix URL as the live target.

---

## 2. Wrapper findings (a11y, mobile, copy, fallback, attribution gap)

### 2.1 Accessibility
- **A11Y-OK:** `<iframe title="Southeast Florida property search">` present (NVDA/JAWS will announce it). Section labelled via `aria-labelledby="idx-heading"`.
- **A11Y-OK:** Iframe gets brass `outline` on `:focus-visible` (global rule, `globals.css:157`).
- **A11Y-MED:** Iframe has no `id` and section has no `id`. Skip links / keyboard users have no anchor to jump past it (and the embedded Matrix form contains many tab stops). Recommend `id="property-search"` on the section + visually-hidden "Skip search" link.
- **A11Y-LOW:** No `aria-describedby` on the iframe pointing to wrapper copy, so the relationship between the introductory sentence and the embedded experience is implicit.
- **A11Y-LOW:** No "Open in new tab" fallback for users who can't operate the embedded grid (kiosk browsers, screen-magnification users, very narrow viewports where Matrix wraps poorly).

### 2.2 Mobile responsive behavior
- **MOBILE-HIGH:** Hardcoded `width="1200" height="900"` attributes (line 24-25) conflict with the Tailwind classes. The class chain (`min-h-[760px] w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/2] lg:min-h-[800px]`) wins via CSS, but the HTML attrs are dead weight and confuse audit tools. The Matrix IDX UI is a desktop-first ASP.NET grid — at 320px-414px viewports it horizontally scrolls inside the iframe (cannot be fixed by the wrapper, but **can** be signaled to the user).
- **MOBILE-MED:** Section uses `py-20 lg:py-28` and full-bleed iframe width with no internal `padding-inline` clamp at small viewports — the iframe touches the screen edge with no breathing room from the `bg-cream-50` band.
- **MOBILE-LOW:** Default iframe `scrolling` behavior is implicit (`auto`). On iOS Safari, nested-scroll inside iframe sometimes traps gestures. No `scrolling="auto"` declared, no momentum-scroll override.

### 2.3 Copy
- **COPY-MED:** Wrapper paragraph (line 17-19) is the only context: *"Use the embedded search as a starting point, then contact Mia for a property-specific review, current comparable sales, and next-step guidance."* — accurate and on-voice, but does **not** mention (a) it's an external Matrix MLS search, (b) the data freshness/source, (c) what to do if the embed fails to load.
- **COPY-MED:** No after-iframe call-to-action paragraph. A visitor who scrolls past Matrix lands directly in `InsightsTeaser`. No anchor like "Found a property worth a conversation? Begin a private inquiry →".
- **COPY-LOW:** Eyebrow says "Property Search" — fine, but the H2 "Search available Southeast Florida listings" buries the implicit promise of contact/handoff that drives BSS strategy.

### 2.4 Fallback / blocked-iframe state
- **FALLBACK-HIGH:** `<noscript>` is the **only** fallback. It does not fire when (a) the user has JS but the provider domain is blocked (corporate firewall, content blocker, ad blocker mis-categorizing Matrix), or (b) the iframe loads but returns an error/empty page, or (c) CSP downstream proxy strips frames. There's no `onError` handler, no visible-after-N-seconds skeleton, no "If the search doesn't appear, click here to open it in a new tab" prose. A blocked iframe today gives the user a silent white box.
- **FALLBACK-MED:** No `<a href={searchUrl} target="_blank" rel="noopener">Open search in new window</a>` link in the visible flow. Tablet users on iframe-restricted browsers (some Brave configs, in-app webviews) get a dead section.

### 2.5 Attribution gap (the lead-capture handoff)
- **ATTRIBUTION-HIGH:** A user who finds a property in the embedded Matrix grid cannot stay on `miasanabriarealtor.trueidea.com` to contact Mia about it. Matrix's "contact agent" flow is provider-owned — it routes wherever the IDX subscription points, **not** through this site's contact form. The site's `/contact/` form has no `source` field, no `property` field, no `mls_id` field. There is no captured "I saw MLS-12345 in your embedded search" signal.
- **ATTRIBUTION-HIGH:** Contact form action is `mailto:` (line 111 of `contact/page.tsx`). No hidden inputs to carry origin context. If a user clicks "Contact Mia" inside Matrix, they leave the site entirely; if they manually navigate to `/contact/`, no breadcrumb travels with them.
- **ATTRIBUTION-MED:** No prompt above the iframe like "Found a listing? Note the MLS # — the contact form has a field for it" — which would close the gap **without** GHL form integration.
- **ATTRIBUTION-LOW:** No `referrerPolicy` divergence between iframe and contact-form CTAs. Site cannot distinguish "user clicked Begin a Private Conversation from the IDX section" vs. "from the hero." Adding an anchor query string (`/contact/?source=idx-search`) on the CTA-after-iframe (which doesn't exist yet) would solve this with zero JS.

### 2.6 Sandbox / referrer / permissions
- **SEC-MED:** No `sandbox` attribute. Matrix needs `allow-scripts allow-same-origin allow-forms allow-popups`, which is essentially "everything," so sandbox-as-defense-in-depth here yields marginal benefit and high risk of breakage. **Recommendation: do not add `sandbox` unless validated against provider.** Documented as a deliberate non-fix.
- **SEC-OK:** `referrerPolicy="strict-origin-when-cross-origin"` set (line 28) — appropriate.
- **SEC-LOW:** No `allow=` permissions-policy attribute. Caddy already sends a parent-page `Permissions-Policy` denying geolocation/camera/microphone/payment (Caddyfile:25), which propagates by default. No action needed.

---

## 3. Safe improvement candidates (proposed snippets)

All changes are wrapper-only. No iframe `src` change. No provider swap. No data-claim additions.

### 3.1 Add visible fallback link + section anchor (HIGH-value, LOW-effort)

```tsx
// src/components/IdxEmbed.tsx
<section
  id="property-search"
  aria-labelledby="idx-heading"
  className="bg-cream-50 py-20 lg:py-28"
>
  <div className="mx-auto max-w-7xl px-4 lg:px-8">
    {/* ... existing eyebrow + H2 + paragraph ... */}
    <div className="mt-10 overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
      <iframe
        title="Southeast Florida property search (external MLS Matrix)"
        src={searchUrl}
        className="min-h-[760px] w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/2] lg:min-h-[800px]"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
    {/* Always-visible fallback link (works whether iframe loaded or not) */}
    <p className="mt-4 text-sm text-navy-800/70">
      Search not displaying?{" "}
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-brass-400 underline-offset-2"
      >
        Open the property search in a new tab
      </a>
      .
    </p>
  </div>
</section>
```

**Rationale:** Removes silent-fail mode; adds a stable in-page anchor (`#property-search`) navigation/skip-links can target; honest description for screen readers ("external MLS Matrix"); removes the dead `width`/`height` HTML attributes whose values were never authoritative.

### 3.2 Add after-iframe handoff CTA with source attribution (HIGH-value, LOW-effort)

```tsx
// inside IdxEmbed.tsx, after the iframe wrapper
<div className="mt-8 rounded-sm border border-brass-400/25 bg-brass-400/5 p-5 lg:p-6">
  <p className="font-display text-lg text-navy-800">
    Found a residence worth a closer look?
  </p>
  <p className="mt-2 text-[15px] leading-relaxed text-navy-800/80">
    Note the MLS # and begin a private conversation. Mia will pull current comparable
    sales, ownership history where available, and dock or HOA specifics relevant to
    that residence.
  </p>
  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
    <a
      href="/contact/?source=idx-search"
      className="inline-flex items-center justify-center rounded-full bg-navy-800 px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
    >
      Begin a Private Inquiry
    </a>
    <a
      href="/valuation/?source=idx-search"
      className="inline-flex items-center justify-center rounded-full border border-navy-800/20 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400"
    >
      Request a Valuation
    </a>
  </div>
</div>
```

### 3.3 Add hidden source field to contact + valuation forms (MED-value, LOW-effort)

Forms currently `mailto:`. Add a hidden `source` input that reads `?source=` from the URL on render. Because the export is static, the safe pattern is a tiny client component that hydrates the value, or — even simpler for static export — a stamped hidden input populated by a single `<Script strategy="afterInteractive">` snippet that copies `URLSearchParams.get("source")` into a hidden field. This carries through to the `mailto:` body via `encType="text/plain"`, surfacing `source=idx-search` in the email Mia receives.

```tsx
// inside both contact and valuation <form>:
<input type="hidden" name="source" id="lead-source" defaultValue="direct" />
```

```tsx
// one-time Script tag in app layout, or a tiny client component:
<Script id="lead-source-stamp" strategy="afterInteractive">{`
  try {
    var s = new URLSearchParams(location.search).get('source');
    var el = document.getElementById('lead-source');
    if (s && el) { el.value = s.replace(/[^a-z0-9_-]/gi,'').slice(0,32); }
  } catch (_) {}
`}</Script>
```

**Net effect:** when a user clicks the new IDX-section CTA, the mailto email Mia receives includes `source=idx-search`. Direct mailto fallback continues working. Zero GHL/webhook dependency. Compatible with the project's "no invented endpoints" rule.

### 3.4 Refine wrapper copy (LOW-value, LOW-effort)

Before iframe — append one sentence to existing paragraph:

> "Use the embedded search as a starting point, then contact Mia for a property-specific review, current comparable sales, and next-step guidance. The search is provided by Matrix MLS — data reflects participating Southeast Florida brokerages."

Removes ambiguity about what powers the search; carries the same "deemed reliable but not guaranteed" honesty already in the footer.

### 3.5 Mobile breathing room (LOW-value, LOW-effort)

Add `px-1 sm:px-0` to the iframe container, or wrap iframe in an inner div with `px-2 sm:px-3 lg:px-0` to give a small inset on phone widths so the embed isn't edge-to-edge against the cream band. Visual edit — would trigger the `audit:mobile-readability:capture` requirement per project CLAUDE.md line 57.

### 3.6 Deliberate non-fixes (documented)

- **Do not add `sandbox`** — Matrix's embedded grid uses forms, popups, scripts, and same-origin storage. The only sandbox value that wouldn't break it is essentially permissive; adding it for theater is worse than omitting it.
- **Do not replace iframe with custom IDX/RESO API integration** — out of scope per non-negotiable.
- **Do not add a GHL webhook** — explicitly forbidden by project CLAUDE.md (line 41) until Torrey approves an endpoint.
- **Do not add an iframe-loaded postMessage listener** — Matrix does not emit a listing-selection event from the standard public widget; building it without provider support is speculative.

---

## 4. Issue rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T3-IDX-001	team3	/	a11y	Section has no id; no skip-search affordance	src/components/IdxEmbed.tsx:5-8	medium	Keyboard users tab through dozens of Matrix controls with no skip	Add id=property-search to section + visually-hidden Skip Search link before iframe	site	S	high	yes	src/components/IdxEmbed.tsx	bun run audit:rendered + axe sweep
T3-IDX-002	team3	/	fallback	Silent failure when iframe blocked (corp firewall, content blocker, in-app webview)	src/components/IdxEmbed.tsx:21-37 only noscript fallback	high	User sees empty white band with no recourse	Add always-visible Open in new tab link below iframe	site	S	high	yes	src/components/IdxEmbed.tsx	manual test with frame-blocker
T3-IDX-003	team3	/	attribution	No after-iframe handoff CTA — flow dead-ends into InsightsTeaser	src/app/page.tsx:127 followed directly by InsightsTeaser	high	IDX-engaged user must navigate manually; lead intent decays	Add Found a residence card with Begin Private Inquiry + Request Valuation CTAs each carrying ?source=idx-search	site	S	high	yes	src/components/IdxEmbed.tsx	visual diff + click verification
T3-IDX-004	team3	/contact/ /valuation/	attribution	Forms carry no source attribution; mailto receives no origin signal	src/app/contact/page.tsx:109-111 src/app/valuation/page.tsx:102-105	high	Mia cannot tell which lead came from IDX vs hero vs intent router	Hidden source input + tiny URLSearchParams script that stamps it before submit	site	S	high	yes	contact/page.tsx valuation/page.tsx layout or new client cmp	submit form locally observe mailto body
T3-IDX-005	team3	/	mobile	Iframe is edge-to-edge at small viewports against cream band	IdxEmbed.tsx:20 outer div, no horizontal inset	low	Visual polish — content touches viewport edge on 320-414	Wrap iframe in inner padding container	site	XS	medium	yes	src/components/IdxEmbed.tsx	audit:mobile-readability:capture at 320 375 414
T3-IDX-006	team3	/	html-hygiene	Hardcoded width=1200 height=900 dead attributes superseded by class	IdxEmbed.tsx:24-25	low	None functional; misleading to audits and future maintainers	Remove width/height HTML attrs keep Tailwind aspect classes	site	XS	high	yes	src/components/IdxEmbed.tsx	bun run typecheck + visual diff
T3-IDX-007	team3	/	copy	Wrapper copy does not name the provider or data source	IdxEmbed.tsx:16-19	low	Honesty/clarity — user does not know it is external Matrix	Append one sentence naming Matrix MLS and SE FL participating brokerages	site	XS	medium	yes	src/components/IdxEmbed.tsx	bun run audit:stale audit:no-fabrications
T3-IDX-008	team3	/	a11y	iframe title is accurate but generic; could state external	IdxEmbed.tsx:22	low	SR users get less context	Update title to Southeast Florida property search external MLS Matrix	site	XS	high	yes	src/components/IdxEmbed.tsx	NVDA verification
T3-IDX-009	team3	/	a11y	No aria-describedby connecting wrapper paragraph to iframe	IdxEmbed.tsx:21-29	low	Implicit relationship	Add id to paragraph and aria-describedby on iframe	site	XS	medium	yes	src/components/IdxEmbed.tsx	axe sweep
T3-IDX-010	team3	site-wide	scope	IDX appears only on homepage; no market-page entry to search	src/app/markets/[slug]/page.tsx no IdxEmbed import	low	Principal decision — possibly intentional	Confirm with principal; if desired add IDX deep-link CTA per market	principal	S	low	no	per market page	principal sign-off
```

---

## 5. Confidence + dissent

**Confidence: HIGH** on findings 1-9 (read-only inspection of finite surface — one component, two forms, one homepage). All evidence is file:line cited.

**Confidence: MED** on finding T3-IDX-010 — the absence of IDX on market pages may be a deliberate principal decision to keep the homepage as the single "search" surface and use market pages as editorial/SEO destinations. Not flagging as an issue, surfacing as a question.

**Dissent / open questions:**

1. The mission brief names `https://miasanabria.com/search` as the IDX target. The actual iframe `src` is `sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=`. No reference to `miasanabria.com/search` exists in this repo. If `miasanabria.com/search` is a planned Direct Axess-hosted page that should be the iframe target instead, that is a **provider-swap decision** and out of scope for this team — flag to principal.

2. Recommendation T3-IDX-004 (source attribution via hidden input + client-side stamp script) requires adding one `<Script>` tag in a static-export-compatible way. The repo has not previously added client-side scripts of this kind. Alternative: encode `source` directly into the `mailto:` action URL by reading `searchParams` in the page-level server component — but Next.js 15 static export does not pass `searchParams` to pages during export, so the stamp must run client-side. Worth a quick design check before implementation.

3. The recommendation set is intentionally narrow. There is a **larger** unresolved question — whether the current Matrix iframe is the right long-term IDX experience at all for a luxury-positioned practice — but that question is explicitly out of scope (non-negotiable: preserve iframe IDX). Flagging the question's existence; not arguing it.

---

*End — Team 3 report. Read-only. No source edits performed.*
