# BSS Realtor — GHL Integration Packet Template

> The pre-implementation document operator + client agree on **before** any GHL writes happen.
> Output of every BSS realtor onboarding — owned by Torrey, signed by Client, stored in `docs/<client>-ghl-packet-v<X.Y>.md`.
> This template **describes** the integration; the actual GHL UI work happens only after sign-off.

## Sections

1. Sub-account configuration
2. Form-mapping matrix
3. Calendar embed
4. Tag taxonomy
5. Workflows / auto-replies
6. Pipeline + opportunity stages
7. Email + SMS sender identity
8. Reporting / dashboards
9. Off-ramps (rollback, disable, export)

---

## 1. Sub-account configuration

| Setting | Value | Source / Confirmation |
|---------|-------|----------------------|
| Sub-account name | `<Client Marketing Name>` | client confirm |
| Time zone | America/New_York (or per client) | client confirm |
| Currency | USD | default |
| Branding logo URL | `<asset path>` | client-provided |
| Brand color | `<hex>` matching site theme | site `SITE.themeColor` |
| Phone number (display) | `<as in fact ledger §1>` | ledger |
| Email (display) | `<as in fact ledger §1>` | ledger |
| Domain | `<client domain>` (post-cutover only) | gated |
| GBP linkage | yes/no/pending | client + GBP audit |

## 2. Form-mapping matrix

For each form on the site, map every field to a GHL contact field. No field appears on the site that doesn't map.

| Site form | Site field | GHL contact field | Required? | Notes |
|-----------|-----------|-------------------|-----------|-------|
| `/valuation/` | Property address | `address` (Address1) | yes | |
| `/valuation/` | First name | `firstName` | yes | |
| `/valuation/` | Last name | `lastName` | yes | |
| `/valuation/` | Email | `email` | yes | |
| `/valuation/` | Phone | `phone` | optional | E.164 normalize on submit |
| `/contact/` (general) | First name | `firstName` | yes | |
| `/contact/` (general) | Email | `email` | yes | |
| `/contact/` (general) | Message | `customField.inquiryMessage` | yes | |
| `/buyers/` (intent) | First name + email | `firstName` + `email` | yes | tag = `intent: buyer` |
| `/sellers/` (intent) | First name + email | `firstName` + `email` | yes | tag = `intent: seller` |

**Rule:** ≤ 4 visible fields per form. Anything beyond 4 collected via follow-up workflow, not first submission.

**Submit endpoint:** placeholder `/api/submit-<form>` until GHL form ID provided. Once provided, the codebase changes one constant per form (no per-page edits).

## 3. Calendar embed

| Setting | Value |
|---------|-------|
| Calendar widget URL | placeholder iframe until client provides |
| Embed location(s) | `/contact/` (primary), Tier-1 CTA on Home + Buyers + Sellers |
| Booking duration | 30 min default; client may change |
| Round-robin / individual | client decides |
| Reminder cadence | 24h email + 1h SMS (default; client may change) |
| Buffer time | 15 min default |
| Notification destinations | client's working email + (optional) Slack/Telegram |

Until client provides URL: leave a placeholder iframe + a "Schedule a call" button that opens `mailto:<client.email>?subject=...` as fallback. Site does NOT block waiting for the calendar.

## 4. Tag taxonomy

Standard tags applied automatically by inbound forms. Client may extend.

| Tag | Trigger | Purpose |
|-----|---------|---------|
| `lead.source: <client>-website` | every form submission | distinguish website leads from referral / GBP / paid |
| `lead.intent: buyer` | `/buyers/` form | route to buyer workflow |
| `lead.intent: seller` | `/sellers/` form | route to seller workflow |
| `lead.intent: valuation` | `/valuation/` form | route to valuation workflow |
| `lead.intent: general` | `/contact/` form | route to general workflow |
| `lead.market: <slug>` | (future) market-page CTA | hyper-local routing |
| `lead.consent: marketing` | checkbox on form | required before any drip enrollment |

**Rule:** no tag applied without an explicit form trigger. No silent tagging via cookies / behavior tracking.

## 5. Workflows / auto-replies

Each form intent has at minimum: an instant auto-reply (email + SMS if phone) and a 24-hour "any questions?" follow-up. Anything beyond requires client sign-off.

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `wf.buyer.welcome` | tag `lead.intent: buyer` added | (1) instant email reply [≤ 60s] (2) SMS optional (3) operator notification (4) 24h follow-up email |
| `wf.seller.welcome` | tag `lead.intent: seller` added | same shape |
| `wf.valuation.welcome` | tag `lead.intent: valuation` added | same shape + "we'll prepare your CMA in 24-48h" copy |
| `wf.general.welcome` | tag `lead.intent: general` added | same shape, lighter copy |

**Rule:** auto-reply copy must be approved by client. No drip sequence without explicit consent tag.

## 6. Pipeline + opportunity stages

| Stage | Definition | Move-trigger |
|-------|------------|--------------|
| New | inbound, not yet contacted | form submission |
| Contacted | first reply sent | manual or auto |
| Qualified | call / meeting taken | manual |
| Active | actively touring or under-contract / under-listing | manual |
| Closed-Won | transaction closed | manual |
| Closed-Lost | not moving forward | manual + reason |
| Nurture | longer-term, not active | manual |

## 7. Email + SMS sender identity

| Setting | Value |
|---------|-------|
| From-name | `<Client Marketing Name>` |
| From-email | `<client domain email>` (e.g. `mia@miasanabriarealtor.com`) — requires DKIM/SPF |
| Reply-to | same |
| SMS sender | dedicated number provisioned in GHL |
| Footer | physical address (per CAN-SPAM) + unsubscribe link |
| List-Unsubscribe header | required |

## 8. Reporting / dashboards

| Dashboard | Cadence | Data source |
|-----------|---------|-------------|
| Lead volume | weekly | GHL contact created |
| Lead source mix | monthly | tag `lead.source` |
| Workflow performance | monthly | open/click/reply rates |
| Pipeline velocity | monthly | stage transitions |

## 9. Off-ramps

| Off-ramp | How |
|----------|-----|
| Rollback any workflow | toggle off in GHL UI; site is unaffected |
| Disable a form | revert site form `action=` to placeholder; rebuild + deploy |
| Export contacts | GHL native CSV export; backed up monthly |
| Sub-account suspend | toggle in GHL UI; tied site continues to work in placeholder mode |

## Sign-off block (operator + client)

```
- [ ] Client confirmed sub-account configuration (§1) — date: ____
- [ ] Client confirmed form-mapping matrix (§2) — date: ____
- [ ] Client confirmed calendar embed (§3) — date: ____
- [ ] Client confirmed tag taxonomy (§4) — date: ____
- [ ] Client confirmed workflow/auto-reply copy (§5) — date: ____
- [ ] Client confirmed pipeline stages (§6) — date: ____
- [ ] Client confirmed sender identity + DKIM/SPF records (§7) — date: ____
- [ ] Client confirmed dashboards + reporting cadence (§8) — date: ____
- [ ] Client + operator agreed on off-ramps (§9) — date: ____

Signed (Client): _____________________
Signed (Operator): ___________________
```

## Mia-specific note

Mia's GHL packet is **out of scope** for the 2026-05-07 mission run. This template will be filled in with Mia's specific values once the operator + Mia walk through it together. Until then: every form on `miasanabriarealtor.trueidea.com` posts to a placeholder `/api/submit-*` endpoint that returns 200 without storing data.
