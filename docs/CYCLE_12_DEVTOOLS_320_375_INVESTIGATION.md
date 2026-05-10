# Cycle 12 — DevTools/CDP 320 / 375 Investigation

**Date:** 2026-05-10
**Tool:** chrome `--headless=new --remote-debugging-port` + Bun WebSocket CDP client
**Probe scripts:** `/tmp/cdp-probe-mia.ts` (computed-style + bbox extraction) · `/tmp/cdp-fullpage-mia.ts` (full-page screenshot via `Page.captureScreenshot { captureBeyondViewport: true }`)
**Live URL:** `https://miasanabriarealtor.trueidea.com/`
**ETag at probe:** `dieozfbl845c2qf6` (Cycle 11 final deploy)

---

## Mission

Cycle 11 closed PASS_WITH_MINOR_CONCERNS · principal-visible-logo-issue: RESOLVED · GPT-5.5 strict verdict: FAIL on 320/375 narrow-mobile residuals — three within-cycle iterations on a 320 EHO label clip didn't visually resolve. Cycle 12 Phase 2's job: produce computed-style + bounding-box evidence to either prove the clip is real (and route to Phase 4 surgical fix) or prove it is a perception artifact (and HARD-STOP further iteration).

This phase is read-only. No source changes are made here; verdict drives Phase 4.

## Method

The CDP probe approach addresses the F6 finding from Cycle 11 — chrome `--dump-dom` clamps to ~500px regardless of `--window-size`, but the CDP `Emulation.setDeviceMetricsOverride` honors the requested viewport authoritatively. Every measurement below is taken from the live staging URL (not local) at `Emulation.setDeviceMetricsOverride { width: 320, height: 568, mobile: true, deviceScaleFactor: 1 }`. Each probe waits 4 seconds after `Page.loadEventFired` to let Cinzel + Montserrat fonts fully apply (`document.fonts.ready === "loaded"` confirmed in every probe).

Two independent channels compared:
1. **CDP DOM** — `getComputedStyle` + `getBoundingClientRect` + `Range.getClientRects` (line-fragment rects).
2. **CDP screenshot** — `Page.captureScreenshot { format: "png", captureBeyondViewport: true }` at the same emulated viewport, full-page render. Cropped to the relevant region for visual inspection.

If both channels agree the element fits within viewport, the GPT-5.5 strict-pixel verdict was a perception artifact and no fix is required. If they disagree, the screenshot channel is what the user actually sees → fix.

## Findings — `/accessibility/` at 320×568

### Document-level

```
viewport: { innerWidth: 320, innerHeight: 568, devicePixelRatio: 1 }
document: { clientWidth: 320, scrollWidth: 320, bodyScrollWidth: 320, horizontalOverflow: false }
fonts: { ready: true }
```

**`scrollWidth === clientWidth === 320` ⇒ no horizontal overflow on the page at all.**

### EHO label — `<span class="block max-w-[10rem] [overflow-wrap:anywhere] [word-break:break-word] font-display text-[10px] uppercase tracking-[0.16em] ...">Equal Housing Opportunity</span>`

Computed style:

| Property | Value |
|---|---|
| display | `block` ✅ |
| max-width | `160px` (= `max-w-[10rem]`) ✅ |
| width | `160px` ✅ |
| overflow-wrap | `anywhere` ✅ |
| word-break | `break-word` ✅ |
| font-family | `Cinzel, "Cinzel Fallback", Cinzel, "Times New Roman", serif` |
| font-size | `10px` |
| letter-spacing | `1.6px` (= `tracking-[0.16em]` × 10px = 1.6px) ✅ |
| line-height | `15px` |
| text-transform | `uppercase` |

Bounding box of the `<span>`:

```
{ x: 80, y: 4658.39, width: 160, height: 30, right: 240, bottom: 4688.39 }
```

`right: 240` is well inside the 320 viewport (320 − 240 = 80px right margin).

Range-rect line breakdown (the actual rendered glyph runs):

```
line 1: { x: 106.27, y: 4658.39, width: 107.45, height: 14, right: 213.72 }   "EQUAL HOUSING"
line 2: { x: 113.94, y: 4673.39, width: 92.13,  height: 14, right: 206.06 }   "OPPORTUNITY"
```

**Both lines fit comfortably inside the 160px column. No clipping.**

### LPT and REALTOR® labels (companion check)

| Label | width | right | clip? |
|---|---:|---:|:-:|
| LPT REALTY | 74.42px | 197.20 | no |
| REALTOR® | 60.67px | 190.33 | no |

All three trust-strip labels fit centered within their 160-px columns at 320. The trust-strip row is rendered correctly.

### Screenshot channel — `/tmp/mia-cycle12-acc320-footer.png`

The full-page CDP screenshot at 320×568 (cropped to footer region y=4400-4877) shows:

- LPT REALTY — single line, centered
- REALTOR® — single line, centered  
- EQUAL HOUSING / OPPORTUNITY — TWO lines, both centered, no clip
- "© 2026 Mia Sanabria. All rights reserved." — single line, fits
- Privacy Policy · Terms of Service · Accessibility · DMCA — wrapped to two rows, all fit

**Screenshot agrees with DOM: no clipping.**

## Findings — `/` (homepage) at 320×568

### Document-level

```
viewport: { innerWidth: 320, innerHeight: 568, devicePixelRatio: 1 }
document: { clientWidth: 320, scrollWidth: 320, bodyScrollWidth: 320, horizontalOverflow: false }
```

**Zero horizontal overflow on the home page at 320.**

### Hero (image-mode, navy panel)

| Element | width | right | white-space / overflow-wrap | clip? |
|---|---:|---:|---|:-:|
| heroEyebrow `Mia Sanabria · REALTOR® with LPT Realty` | 262 | 292 | normal / break-word | no |
| heroHeading `Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.` | 262 | 292 | normal / break-word | no (4 lines) |
| heroSub `A small, deliberate practice — private representation for buyers and sellers of distinctive coastal residences.` | 262 | 292 | normal / anywhere | no (3 lines) |
| heroCtaPrimary `Begin a Private Conversation` | 262 | 292 | normal / normal | no |
| heroCtaSecondary `Request Home Valuation` | 262 | 292 | normal / normal | no |
| heroPanel | 288 | 304 | — | no |

Every element's `right` ≤ 304, well inside the 320 viewport. The hero panel uses `padding-left: 12px, padding-right: 12px` (Tailwind `p-3`) at 320, with the inner content at width 262. Cinzel-Bold-700 H1 wraps to 4 lines via the `<wbr />` soft-break hints inserted in Cycle 9.

### AnswerFirst H2 — `What kind of real estate does Mia Sanabria specialize in?`

| Property | Value |
|---|---|
| display | block |
| width | 288 |
| right | 304 |
| max-width | none (parent `mx-auto max-w-3xl px-4` constrains) |
| overflow-wrap | anywhere |
| font-size | 20px (`text-xl` at 320) |
| line-height | 28px |

Bounding box `right: 304` < viewport 320 ⇒ no clip. Wraps to ~4 lines, all visible.

### Screenshot channel — `/tmp/mia-cycle12-home320-hero.png` + `/tmp/mia-cycle12-home320-answerfirst.png` + `/tmp/mia-cycle12-home320-footer.png`

Full-page CDP screenshots cropped to hero / answer-first / footer regions. Visual inspection (saved as PNGs in `/tmp/`):

- Hero: editorial-luxury panel, brass left border, Cinzel-Bold H1 wrapping cleanly, both CTAs visible and fit.
- AnswerFirst: "THE PRACTICE" eyebrow + H2 wrapping in 3-4 lines + body text wrapping cleanly.
- Footer: same uniform monochrome trust-strip with EHO 2-line wrap, cleanly centered.

**Screenshot agrees with DOM at every probe point: no clipping anywhere.**

## Findings — `/markets/fort-lauderdale/` at 320×568

`document.scrollWidth: 320, horizontalOverflow: false`. Probe samples:

| Element | width | right | clip? |
|---|---:|---:|:-:|
| EHO label | 160 | 240 | no (2-line wrap) |
| heroEyebrow | 262 | 292 | no |
| heroHeading | 262 | 292 | no |
| heroSub | 262 | 292 | no |
| heroCtaPrimary | 262 | 292 | no |

Screenshot of FL hero at 320: "WATERFRONT, CITY, AND BEACH / LIVING IN MIA'S HOME MARKET." H1 in two lines, "Inquire About Fort Lauderdale →" CTA fits cleanly. **No clipping.**

## Findings — `/markets/` at 375×812

Full-page CDP screenshot of `/markets/` at 375×812. Hero panel at 343px wide (within 375 viewport), Hero CTAs at width 301px (within 375), AnswerFirst H2 at width 343. All elements fit. Visual: editorial-luxury panel rendering, "SOUTHEAST FLORIDA'S MOST COVETED COASTAL COMMUNITIES." Cinzel-Bold H1 wrapping to 2 lines, both CTAs visible. **No clipping.**

## Verdict

| Element / route | DOM (CDP probe) | Screenshot (CDP full-page) | Verdict |
|---|---|---|---|
| EHO label, `/accessibility/` 320 | within viewport, 2-line wrap | within viewport, 2-line wrap | **screenshot illusion (Cycle 11)** — no clip |
| EHO label, `/` 320 | within viewport, 2-line wrap | within viewport, 2-line wrap | **screenshot illusion** — no clip |
| Hero eyebrow / H1 / sub / CTAs, `/` 320 | within viewport | within viewport | **screenshot illusion** — no clip |
| AnswerFirst H2, `/` 320 | within viewport, 3-4 line wrap | within viewport | **screenshot illusion** — no clip |
| Hero panel, `/markets/fort-lauderdale/` 320 | within viewport | within viewport | **screenshot illusion** — no clip |
| Hero panel, `/markets/` 375 | within viewport | within viewport | **screenshot illusion** — no clip |

**The Cycle 11 GPT-5.5 strict-pixel verdict ("320px footer clips Equal Housing label / 320 + 375 hero clipping / below-hero H2 clipping") was a perception artifact — the rendered DOM has zero horizontal overflow and the live screenshot channel renders identically to the DOM.** Most plausible cause: GPT-5.5 mis-read the legitimate 2-line wrap of `EQUAL HOUSING` / `OPPORTUNITY` as a single-line clip pattern (Cinzel uppercase + tight letter-spacing + 2-line break can resemble a clip artifact in low-resolution screenshot review). The hero/H2 claims may have been over-generalized from the EHO mis-read.

## Phase 4 implication: HARD-STOP — no narrow-mobile source changes ship this cycle

Phase 4's gate ("Phase 4 only fires when Phase 2 verdict ∈ {real clipping}") is HONORED with documented hard-stop:

- The 320 EHO label is not clipped — span has `display: block; max-width: 160px; overflow-wrap: anywhere; word-break: break-word`, all confirmed via `getComputedStyle`. Range-rect line breakdown shows clean 2-line wrap inside the 160px column. Screenshot agrees.
- The 320/375 Hero/H2 are not clipped — every element's bbox `right` is ≤ viewport width.
- `document.scrollWidth === viewport innerWidth` on every probed route ⇒ no horizontal overflow at the document level.

**No code shipped in Phase 4. Cycle 12 closes the D5/D6/EHO residuals with computed-style + screenshot proof rather than chasing a phantom defect with another iteration cycle.**

Cato's defensive `min-w-0` recommendation on flex children is sound theoretical practice but **not a bug fix here** — every parent chain probed already constrains its children via explicit `max-w-*` or `w-full` at narrow viewports, so adding `min-w-0` would be infrastructure-without-proven-need (which Cato itself flagged as a Claude-family-typical scope-creep failure mode). Document the recommendation as a future defensive pattern; do not ship it as a fix.

## Reproducibility

Anyone can replay this investigation:

```bash
# DOM probe
bun /tmp/cdp-probe-mia.ts /accessibility/ 320x568
bun /tmp/cdp-probe-mia.ts / 320x568
bun /tmp/cdp-probe-mia.ts / 375x812
bun /tmp/cdp-probe-mia.ts /markets/fort-lauderdale/ 320x568

# Full-page screenshot via CDP
bun /tmp/cdp-fullpage-mia.ts /accessibility/ 320x568 /tmp/mia-cycle12-fullpage-accessibility-320.png
bun /tmp/cdp-fullpage-mia.ts / 320x568 /tmp/mia-cycle12-fullpage-home-320.png
bun /tmp/cdp-fullpage-mia.ts /markets/fort-lauderdale/ 320x568 /tmp/mia-cycle12-fullpage-fl-320.png
```

Both probe scripts and the cropped evidence PNGs are preserved at `/tmp/mia-cycle12-*.png` for the duration of this session. The investigation is fully reproducible from the live URL — no snapshot artifacts required.

## Lesson for the skill

When a strict-pixel reviewer flags a "clip" residual that three within-cycle iterations failed to resolve despite confirmed CSS in HTML + bundle:

1. **The next probe is computed-style + bounding-box, not another CSS iteration.** The CSS is correct; the question is whether it's interpreting the rendered output correctly.
2. **Both channels (CDP DOM + CDP full-page screenshot) must be triangulated.** DOM-only could miss a font-load-timing issue; screenshot-only could be misread by a vision model.
3. **A vision-model verdict on a multi-line wrap can be a false positive.** The 2-line wrap of an uppercase letterspaced phrase visually approximates a single-line clip pattern. When the reviewer is GPT-5.5 reading thumbnail-quality PNG crops, this kind of mis-read is a recognized failure mode.
4. **HARD-STOP discipline:** if both DOM and screenshot agree the element fits, the cycle ships the evidence (this document) and closes the residual without code change. Iterating into the third or fourth cycle without computed-style proof is an Algorithm-doctrine violation.

Codified in skill v0.3.4 as HARD gate #24 — *"strict-pixel reviewer flags a clip → next probe is CDP computed-style + full-page screenshot before any further CSS iteration."*
