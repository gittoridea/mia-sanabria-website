# Mia Sanabria — Decision Packet (Cycle 22)

> **One reviewable list to walk through with Mia on a call.**
> Each row has a question, the recommended default, and a checkbox for approve / reject / needs-edit.
> Source: Cycle 20-21 outstanding principal items + new domain/email/phone decisions.

## How to use this packet

1. Walk Mia through each section in order. None are blockers for each other.
2. For every row, mark exactly one: **✅ Approve** | **✏️ Edit** | **❌ Reject**.
3. Items left blank are deferred to a future call.
4. Torrey commits the decisions back to repo in the next cycle.

---

## 1. Homepage H1 — canonical triad (P1 from Cycle 21 B1)

The homepage currently says **"Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton."** The site constants (`site.ts`, `mia.ts`, `Hero.tsx`) say **"Eastern Fort Lauderdale, Boca Raton, and Delray Beach."** The two triads need to agree.

| # | Option | What changes | Recommendation |
|---|---|---|---|
| 1A | Triad = **Eastern Fort Lauderdale + Boca Raton + Delray Beach** (current constants) | `src/app/page.tsx:84` heading rewritten | **Recommended** — matches the practice MeetMia/AnswerFirst describe; Pompano Beach is a covered market but not a Tier-1 |
| 1B | Triad = **Fort Lauderdale + Pompano Beach + Boca Raton** (current homepage) | `src/lib/site.ts:25` + `src/lib/mia.ts:34` + `src/components/Hero.tsx:33` rewritten | Aligns site to homepage; demotes Delray to secondary |
| 1C | Triad = **Eastern Fort Lauderdale + Boca Raton + Palm Beach** | all four files rewritten | Strongest luxury alignment; abandons Delray as Tier-1 |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 2. `miaQuote` rewrites (P1 from Cycle 21 B2 — 5 market strings)

Current strings carry SEO-purple overclaim language ("absolute zenith", "unparalleled", "ultimate", "exclusive", "globally recognized", "perfectly captures"). Proposed replacements stay descriptive and let the architecture/geography do the work.

### 2.1 Fort Lauderdale — `src/lib/markets.ts:131`

- **Current:** "Known globally as the 'Venice of America,' Fort Lauderdale is the **undisputed** yachting capital of the world."
- **Recommended replacement:** "Known as the Venice of America, Fort Lauderdale is built around more than 165 miles of inland canals — the geography that anchors the deepwater yachting market."

**Mia: ✅ / ✏️ / ❌**

### 2.2 Boca Raton — `src/lib/markets.ts:363`

- **Current:** "Boca Raton represents the **absolute zenith** of South Florida luxury living — renowned globally for its pristine beaches, Mediterranean Revival architecture, and **an unparalleled standard of living**."
- **Recommended replacement:** "Boca Raton's distinctive layer is Addison Mizner's Mediterranean Revival architecture, ocean-access estate sections, and a balance between resort feel and a full-time residential community."

**Mia: ✅ / ✏️ / ❌**

### 2.3 Palm Beach — `src/lib/markets.ts:442`

- **Current:** "Palm Beach stands as the **absolute pinnacle** of generational wealth and **exclusivity**."
- **Recommended replacement:** "Palm Beach is a small barrier-island town defined by architectural review, generational tenure, and three distinct sections — North End, Mid-Town, and South End."

**Mia: ✅ / ✏️ / ❌**

### 2.4 Delray Beach — `src/lib/markets.ts:513`

- **Current:** "Delray Beach **perfectly captures the essence** of vibrant coastal luxury. Known as the 'Village by the Sea,' this dynamic enclave **seamlessly blends** the energetic, culturally rich atmosphere of a world-class downtown with the secluded, **ultra-luxurious** lifestyle of South Florida's **most coveted** coastlines."
- **Recommended replacement:** "Delray Beach — the Village by the Sea — is organized around a walkable Atlantic Avenue downtown. Proximity to Atlantic is the dominant pricing variable; the residential heart spans Lake Ida, Tropic Isle, and the A1A beach corridor."

**Mia: ✅ / ✏️ / ❌**

### 2.5 Lighthouse Point — `src/lib/markets.ts:593`

- **Current:** "Lighthouse Point is the **ultimate sanctuary** for the avid boater and yachtsman — an **exclusive** nautical enclave **globally recognized** for its pristine deep-water canals, offering seamless, no-fixed-bridge access to the Atlantic Ocean via the Hillsboro Inlet."
- **Recommended replacement:** "Lighthouse Point is a small Broward city north of Pompano Beach, known for finger-isle canals with no-fixed-bridge ocean access via the Hillsboro Inlet — a defining feature for yacht-capable single-family residences."

**Mia: ✅ / ✏️ / ❌**

---

## 3. Production domain (P1 from Cycle 21 9.6 + mission-brief discrepancy)

Repo currently treats `miasanabriarealtor.com` as the production cutover target (`src/lib/site.ts:7`). Earlier mission brief had named `miasanabria.com`. Decide once:

| Option | What it means | Recommendation |
|---|---|---|
| 3A | `miasanabriarealtor.com` is canonical; `miasanabria.com` redirects (301) | **Recommended** — matches existing brand surfaces (Direct Axess host, business cards, GBP if present); no rename across 50+ pages |
| 3B | `miasanabria.com` is canonical; `miasanabriarealtor.com` redirects | Cleaner / shorter; requires Direct Axess sunset coordination + brand surface refresh; ~12 hours of cleanup |
| 3C | Both serve content directly | Not recommended — duplicate content, SEO penalty risk |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 4. Branded email / from-domain

The site currently lists `msanabriarea@gmail.com`. At GHL cutover the form `Reply-to` and outbound nurture emails will land in this inbox. Three paths:

| Option | What it means | Recommendation |
|---|---|---|
| 4A | Keep `msanabriarea@gmail.com` | Lowest cost. SPF/DKIM/DMARC on @gmail.com is Google-managed — Mia controls nothing. Deliverability is fine for one-off replies, weak for bulk nurture. |
| 4B | `mia@miasanabriarealtor.com` via Google Workspace | **Recommended** — branded, full SPF/DKIM/DMARC control, calendar+drive integration; ~$6/mo |
| 4C | `mia@miasanabria.com` (after 3B if chosen) | Same as 4B but on the shorter domain |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 5. Phone / call tracking

Site has 11+ `tel:+19545400358` links going to Mia's personal cell. At GHL cutover, three options:

| Option | What it means | Recommendation |
|---|---|---|
| 5A | Keep personal cell — no call tracking | Lowest friction; zero attribution; calls are invisible to CRM |
| 5B | Provision GHL phone (or Twilio→GHL) — replace `MIA.contact.phoneTel` with tracked number | **Recommended** — call metadata appears in GHL contact view; rollback path: revert constant if routing fails |
| 5C | Dual-route — keep personal cell for SMS only; tracked number for voice | Twice the work; recommended only if Mia takes SMS heavily |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 6. Lead-magnet gating

3 PDFs currently ungated and only linked from `/markets/fort-lauderdale/`:
- Waterfront Buyer Due Diligence Checklist
- Luxury Seller Pre-Listing Checklist
- Fort Lauderdale Waterfront Valuation Prep Sheet

| Option | What it means | Recommendation |
|---|---|---|
| 6A | All ungated — open downloads | Lowest friction; PDFs serve as top-of-funnel awareness assets; no CRM attribution |
| 6B | All gated behind short form (email + name) | Grows CRM list; adds friction; aligns with BSS productization story |
| 6C | **Bifurcated** — gate the Buyer Due Diligence checklist (highest intent); leave Seller + Valuation prep sheets ungated as awareness | **Recommended** — captures the high-intent download, keeps low-friction discovery |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

## 6b. Surface PDFs on `/sellers/` + `/valuation/`?

Today only `/markets/fort-lauderdale/` links the PDFs. Cycle 21 B7 deferred surfacing them on the matching hub pages.

- 6b-A: surface Seller prep on `/sellers/`; Valuation prep on `/valuation/` — **Recommended**
- 6b-B: leave only on FL page

**Mia: ✅ / ✏️ / ❌**

---

## 7. Response-time stance (post-GHL)

When GHL is wired, the thank-you pages and form copy must reflect reality. Current page already says "Mia will respond personally — confidentially — when she has the time to give it the attention it deserves." Three options to formalize:

| Option | What it means | Recommendation |
|---|---|---|
| 7A | No response-time promise anywhere — keep "she will respond personally" | **Recommended** — honesty contract preserved; matches current copy |
| 7B | Soft window ("most replies within 1–2 business days") | Concrete; Mia must be able to honor it consistently |
| 7C | Hard window ("same business day") | **Not recommended** — banned per CLAUDE.md honesty contract |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 8. License display

Footer currently renders "FL Sales Associate License #SL3405877" reading from `MIA.unverified.licenseNumber`. The `unverified` part is a code-level guard until DBPR primary-source confirmation.

| Option | What it means | Recommendation |
|---|---|---|
| 8A | Mia confirms `SL3405877` is correct → DBPR verification + flip `licenseNumber` to `verified` field | **Recommended if number is correct** |
| 8B | Mia provides correct number → update + verify | required if not 8A |
| 8C | Hide license number until verified | not recommended — REALTOR® disclosure best practice favors visible license |

**Mia: ✅ / ✏️ / ❌ → choice = ____**

---

## 9. REALTOR® / EHO / MLS mark presentation

Footer shows three logos: LPT Realty, REALTOR® R, Equal Housing Opportunity. Stack/wording is standardized.

| Question | Current | Recommendation |
|---|---|---|
| Keep LPT Realty logo + brokerage name in footer? | Yes — both | **Recommended** — REALTOR® disclosure best practice |
| Keep REALTOR® R logo? | Yes | **Recommended** — but requires NAR membership written confirmation (legal packet) |
| Keep EHO logo? | Yes | **Recommended** — non-negotiable for Fair Housing |
| Add brokerage license + address near footer? | LPT name + Mia's license only | **Recommended addition** for cutover: tiny "Brokerage: LPT Realty LLC · Florida License: \[\]" line if Mia/LPT supplies |

**Mia: ✅ / ✏️ / ❌ on each row**

---

## 10. Copy voice acceptance (post-Cycle 19C compression)

Cycle 19C compressed copy across hubs/markets/insights into a deliberately tight, geography-led voice (less "luxury concierge", more "where the boats fit"). The compression is in place now (commit `c304740`).

| Question | Recommendation |
|---|---|
| Does the current voice land for Mia? | If yes → accept and move forward; if no → call out specific pages/blocks and we'll re-pass |
| Is there a section that feels "not me" or "too austere"? | If yes → name pages |
| Should the geography-first emphasis stay? | **Recommended yes** — matches honesty contract; differentiates from agent peers |

**Mia: ✅ / ✏️ / ❌**

---

## Decisions tally (Mia / Torrey fill at end of call)

- [ ] §1 Homepage triad: ____
- [ ] §2.1 FL miaQuote: ____
- [ ] §2.2 Boca miaQuote: ____
- [ ] §2.3 Palm Beach miaQuote: ____
- [ ] §2.4 Delray miaQuote: ____
- [ ] §2.5 Lighthouse Point miaQuote: ____
- [ ] §3 Production domain: ____
- [ ] §4 Branded email: ____
- [ ] §5 Phone / call tracking: ____
- [ ] §6 Lead-magnet gating: ____
- [ ] §6b PDF surfacing on /sellers/+/valuation/: ____
- [ ] §7 Response-time stance: ____
- [ ] §8 License display: ____
- [ ] §9 Mark presentation: ____
- [ ] §10 Voice acceptance: ____

**Packet length: ≈ 175 lines.** Designed to be reviewed in one 30–45 minute call.
