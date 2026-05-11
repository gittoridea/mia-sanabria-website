# Cycle 19B-FL-R1 — Lead-Magnet PDF Failure Analysis

**Captured:** 2026-05-11 (local UTC at run time)
**Inputs analyzed:** live `/downloads/*.pdf` artifacts pulled with cache-busting from `https://miasanabriarealtor.trueidea.com/` (homepage ETag at capture: `difoq8ktm3gg4pcu`).

## Verdict

All three Cycle 19B-FL lead-magnet PDFs are produced by printing the Next.js static-export HTML route at `/downloads/{slug}/`. Because that route inherits the App Router root layout, every PDF contains the full site shell (skip link, header, mobile nav, global trust row, site footer with stacked logo marks and link list). The user-facing failure mode is "the PDF looks like somebody printed our website", not "the PDF is missing a section." The fix is structural: the generator must source from a standalone HTML document that does not pass through `src/app/layout.tsx`.

## Evidence — failure classes confirmed

Source: `pdftotext` via `pdfjs-dist@5.7.284` against the live PDFs. Page numbers are 1-indexed.

| # | Failure class | Confirmed | Evidence (verbatim) |
|---|---------------|-----------|---------------------|
| 1 | `Skip to main content` in PDF | YES (all 3) | Page 1 of every PDF begins with literal `Skip to main content` |
| 2 | Site header / brand block | YES (all 3) | Page 1: `MIA SANABRIA  REALTOR® · LPT Realty` |
| 3 | Site nav list | YES (all 3) | Page 1: `Home  Markets  Buyers  Sellers  Home Valuation  About  Contact  (954) 540-0358` (rendered twice — desktop + mobile menu copies) |
| 4 | Above-fold trust row | YES (all 3) | Page 1: `REALTOR® · LPT Realty LLC · FL License #SL3405877 · Fort Lauderdale-based` |
| 5 | Site footer text marker | YES (all 3) | Page 4: literal text `Site footer` |
| 6 | Footer link list | YES (all 3) | Page 5: `Privacy Policy  Terms of Service  Accessibility  DMCA` |
| 7 | Duplicate logo / mark glyphs (text-shipping fallback) | YES (all 3) | Page 4: `LPT Realty LPT Realty`, `REALTOR® REALTOR®`, `Equal Housing Opportunity Equal Housing Opportunity` |
| 8 | PDF begins below the fold of page 1 | YES (all 3) | Page 1: title `Waterfront Buyer Due Diligence Checklist` appears AFTER `Skip to main content` + brand block + mobile-nav copy + trust row — i.e. real content starts ~⅓ of the way down page 1 |
| 9 | Banned phrase "same business day" leaked through | YES (1 of 3, valuation prep sheet) | Page 3: `Mia or her team will confirm the next-step timeline within the same business day.` — violates the same-business-day prohibition |
| 10 | Embedded `file://` URIs from layout-relative anchors | YES (all 3) | PDF `/URI` entries: `file:///accessibility/`, `file:///dmca/` — local-file-resolved links from the footer rendered into a static HTML printed via `file://` |
| 11 | "Mia's own engagements" claim | YES (2 of 3 — buyer, seller) | Page 1: `mirrors the seller-side diligence Mia coordinates privately on her own engagements` — flagged for hedging per spec |

Stream/strings-grep cross-check (`strings <pdf> | grep -iE …`):

```
/URI (file:///accessibility/)
/URI (file:///dmca/)
/URI (https://www.instagram.com/mia_sanabria_realtor/)
```

These URI entries are direct evidence that the PDF inherited the footer link list AND that the relative `<a href="/accessibility/">` form was resolved against the local `file://` base — both consequences of printing the static-export HTML through `file://` rather than a standalone document.

## Root cause (One-Iceberg)

| Iceberg layer | Cause |
|---------------|-------|
| **Event** | PDFs visibly contain skip link, header, trust row, footer, duplicated logos, footer link list |
| **Pattern** | Every PDF artifact across all three slugs shows the same shell-bleed — not a per-slug bug |
| **Structure** | `scripts/render-lead-magnets.ts:49-50` reads `out/downloads/{slug}/index.html` and prints it via Chrome `--print-to-pdf`. That HTML is a Next.js App Router page whose root layout `src/app/layout.tsx:99-119` wraps every child in `<SiteHeader />`, the skip-link `<a href="#main">Skip to main content</a>`, `<TrustRow />`, `<main>`, and `<SiteFooter />`. The print sequence has no opt-out for App Router root layout. |
| **Mental model** | "If we make a route, we can print the route." This model is wrong for Next.js App Router — nested routes can't escape the root layout. PDFs require a separate document, not a nested route. |

## Fix architecture (committed for BUILD)

1. **Replace the source.** The PDF generator stops reading from `out/downloads/{slug}/index.html`. It generates a standalone HTML file at `.tmp/lead-magnets/{slug}.html` whose `<head>` and `<body>` are 100% authored by the generator — no React, no Next.js layout, no shared header/footer. Chrome `--print-to-pdf` prints that standalone HTML.
2. **Render via Chrome.** Continue using `google-chrome --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf` (already linux-server-validated in `scripts/render-lead-magnets.ts`). Standalone HTML uses `@page { size: Letter; margin: 0.75in; }` and `@media print` rules.
3. **Embed CSS inline.** No external stylesheet — the standalone HTML embeds all CSS in `<style>` to avoid `file://` cross-origin / missing-asset problems.
4. **Keep `/downloads/[slug]/` HTML routes noindex.** They become harmless source-of-truth previews, not the print source. They stay `robots: { index: false, follow: false }` and stay out of the sitemap. Their existence does not affect the PDF.
5. **Audit hardens against this failure class.** `audit:lead-magnets` extracts text from each PDF via `pdfjs-dist` and FAILS on any of: `Skip to main content`, `Site footer`, `LPT RealtyLPT Realty` (or `LPT Realty LPT Realty`), `REALTOR®REALTOR®` (or `REALTOR® REALTOR®`), `Equal Housing OpportunityEqual Housing Opportunity` (or `Equal Housing Opportunity Equal Housing Opportunity`), `Privacy Policy`, `Terms of Service`, `Accessibility`, `DMCA`, the old above-fold trust-row string, `same-business-day` / `same business day`, `Mia's own engagements`.
6. **Visual gate.** Audit also renders page 1 of each PDF to PNG (via `pdfjs-dist` canvas) under `docs/artifacts/cycle-19b-fl-r1/pdf-renders/after/{slug}/page-N.png` and writes a manifest. Gemini 3.1 Flash-Lite is then optionally invoked for visual review; PASS/FAIL routes through the manifest, not Gemini's prose.

## Out of scope (this cycle)

- Boca Raton V2 page.
- New market rollouts.
- GHL form integration (mailto fallback remains).
- Schema broadening beyond regression-prevention.
- Off-fold trust-row redesign (decision: do not replace; keep brokerage identity in footer + About + Contact + PDF disclosure footer only).

## Artifacts

- Baseline PDFs (the broken ones, frozen for evidence): `docs/artifacts/cycle-19b-fl-r1/pdf-renders/before/{slug}.pdf`
- After-state PDFs: `docs/artifacts/cycle-19b-fl-r1/pdf-renders/after/{slug}.pdf` (Phase 3 BUILD output)
- Page renders: `docs/artifacts/cycle-19b-fl-r1/pdf-renders/{before,after}/{slug}/page-N.png` (Phase 4 audit output)
- Codex Spark JSON: `docs/artifacts/cycle-19b-fl-r1/codex-spark-pdf-audit-review.json` (Phase 8)
- Gemini visual: `docs/artifacts/cycle-19b-fl-r1/gemini-visual-review.md` (Phase 8)
- Cato verdict: `docs/artifacts/cycle-19b-fl-r1/cato-compliance-verdict.json` (Phase 8)
