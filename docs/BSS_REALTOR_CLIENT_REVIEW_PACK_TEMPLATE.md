# BSS Realtor — Client Review Pack Template

> The artifact the operator hands the client to review the staging site before cutover.
> Designed for a single review session of ~30-45 minutes.
> Fill in client-specific values; structure stays.

## Cover sheet

```
Site:           https://<client>realtor.trueidea.com  (staging)
Production:     https://<client>realtor.com           (cutover-pending)
Build commit:   <hash>
Audit verdict:  PASS — stale 0 hits, schema 100/100, links 669/669, seo 0 errors
Compliance gate: PASS / FAIL — see Compliance Gate doc per axis
Date prepared:  YYYY-MM-DD
Operator:       <name>
```

## Section 1 — Screenshot inventory

For each of the listed routes, paste:
- Full-page screenshot (desktop)
- Mobile-width screenshot (375px wide)
- Filename: `<route>-<viewport>.png` under `docs/review-pack/<client>/screenshots/`

Routes:
- `/` (Home)
- `/about/`
- `/contact/`
- `/buyers/`
- `/sellers/`
- `/valuation/`
- `/markets/` (hub)
- 1 representative `/markets/<slug>/` (the client's strongest market)
- `/insights/`
- `/privacy/`, `/terms/`, `/accessibility/`
- `/404` (branded 404 — proves rollback/recovery posture)

Use **Interceptor** for screenshots — not agent-browser. Real-Chrome screenshots catch font/rendering quirks that headless misses.

## Section 2 — Fact confirmation matrix

For every §2 candidate in the fact ledger, the client must confirm or refute in writing.

| Field | Current placeholder | Client-confirmed value | Status |
|-------|---------------------|------------------------|--------|
| License # | null in production | _______ | ☐ confirm ☐ refute ☐ defer |
| Designations | empty array | _______ | ☐ confirm ☐ refute ☐ defer |
| Languages beyond English | none | _______ | ☐ confirm ☐ refute ☐ defer |
| Years licensed | null | _______ | ☐ confirm ☐ refute ☐ defer |
| Display office address | null | _______ | ☐ confirm ☐ refute ☐ defer |
| Markets list | (the 7 in `markets.ts`) | swaps requested? | ☐ confirm ☐ swap ☐ defer |

**Rule:** confirmed values move to fact ledger §1 with `verified-at: <date>`, `source: client-confirmed in writing — <date>`. Refuted values move to §3. Deferred values stay in §2.

## Section 3 — Photography checklist

| Asset | Spec | Provided? | Notes |
|-------|------|-----------|-------|
| Headshot | ≥ 1200px wide, professional, recent | ☐ | usage rights confirmed |
| Hero image | ≥ 1920×1080, on-brand | ☐ | optional — placeholder SVG works for staging |
| 3–5 lifestyle shots | natural settings, on-brand | ☐ | for About + Insights |
| Market hero images | ≥ 1200×800 each, recognizable | ☐ | one per featured market |
| Property photos | high-res, no MLS watermark | ☐ | only if client owns rights |
| Logo (client + brokerage) | SVG preferred | ☐ | brokerage logo per LPT/etc. usage rules |

## Section 4 — Copy approval checklist

For every page, client confirms:

| Page | Voice register | Body claims | Schema claims | CTA wording |
|------|----------------|-------------|---------------|-------------|
| Home | ☐ | ☐ | ☐ | ☐ |
| About | ☐ | ☐ | ☐ | ☐ |
| Contact | ☐ | ☐ | ☐ | ☐ |
| Buyers | ☐ | ☐ | ☐ | ☐ |
| Sellers | ☐ | ☐ | ☐ | ☐ |
| Valuation | ☐ | ☐ | ☐ | ☐ |
| Markets hub | ☐ | ☐ | ☐ | ☐ |
| Each market page | ☐ | ☐ | ☐ | ☐ |
| Insights hub | ☐ | ☐ | ☐ | ☐ |
| Privacy/Terms/Accessibility | ☐ (last-updated date current?) | n/a | n/a | n/a |

**Rule:** Any "needs change" item moves into a follow-up commit. Client should not feel obligated to approve copy they don't yet love — the site is iterable.

## Section 5 — Functional walkthrough

In Mia's review session, walk through:

1. **Phone link** — tap on mobile, confirm dialer opens with correct number.
2. **Email link** — tap on mobile, confirm mail client opens with correct address.
3. **Calendar embed** — show placeholder, demonstrate where the real link will go after approval.
4. **Forms** — show that they currently submit to placeholder; demonstrate the GHL packet (separate doc) where the real endpoints will land.
5. **IDX** — scroll the iframe, confirm MLS feed renders, listings appear.
6. **404** — visit `/this-page-does-not-exist`, confirm branded 404 page appears.
7. **Mobile menu** — open + navigate, confirm every page reachable.
8. **Search Console / analytics** — show the placeholder state, the eventual injection plan.

## Section 6 — Compliance gate evidence

Paste the Compliance Gate verdict (PASS/FAIL per axis from `BSS_REALTOR_COMPLIANCE_GATE.md`) here. If any FAIL: list the axis + remediation owner + ETA.

## Section 7 — Open items

| Item | Owner | Due |
|------|-------|-----|
| (filled in during review) | | |

## Section 8 — Sign-off

```
- [ ] Client reviewed all routes in Section 1 — date: ____
- [ ] Client confirmed every fact in Section 2 (or moved to defer) — date: ____
- [ ] Client provided / approved photography per Section 3 — date: ____
- [ ] Client approved copy per Section 4 — date: ____
- [ ] Client walked through functional checklist (§5) — date: ____
- [ ] Compliance Gate (§6) PASS — date: ____
- [ ] All open items (§7) have owner + due date — date: ____

By signing below, the client authorizes BSS to proceed to production cutover per the Launch / Cutover Checklist.

Client: _____________________  date: ____
Operator: ___________________  date: ____
```

## Anti-patterns

- **Do not** ship the review pack with any §2 candidate already populated in copy. The pack exists precisely to gate that.
- **Do not** include items in this pack that the client doesn't actually need to act on — review fatigue is real.
- **Do not** ship without screenshots; the operator's word is not evidence.
- **Do not** schedule cutover until every box in §8 is checked.
