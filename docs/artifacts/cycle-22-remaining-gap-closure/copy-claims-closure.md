# Copy / Claims Closure (Cycle 22 — Team 3)

> Read-only inventory of every remaining copy/claims gap with a disposition: **ship-now-safe**, **queue-to-Mia-packet**, or **already-resolved**.
> No source edits shipped this cycle; all taste-sensitive items routed to `MIA_DECISION_PACKET.md`.

## 1. `miaQuote` strings — overclaim language

Cycle 21 B2. 5 strings flagged. ALL 5 are taste-sensitive → queued to Mia (packet §2). Anti-criteria ISC-35 prevented shipping replacements unilaterally.

| File:line | Market | Overclaim phrases | Disposition |
|---|---|---|---|
| `src/lib/markets.ts:131` | Fort Lauderdale | "undisputed" | Mia §2.1 |
| `src/lib/markets.ts:363` | Boca Raton | "absolute zenith", "unparalleled", "renowned globally" | Mia §2.2 |
| `src/lib/markets.ts:442` | Palm Beach | "absolute pinnacle", "exclusivity" | Mia §2.3 |
| `src/lib/markets.ts:513` | Delray Beach | "perfectly captures the essence", "seamlessly blends", "ultra-luxurious", "most coveted" | Mia §2.4 |
| `src/lib/markets.ts:593` | Lighthouse Point | "ultimate sanctuary", "exclusive", "globally recognized" | Mia §2.5 |

Anti regression check: `bun run audit:no-fabrications` and `bun run audit:stale` both report 0 hits — none of the overclaim words trigger the existing audits (they're SEO-purple but not in the banned-claim list). If Cycle 23 ships approved replacements, no audit changes are needed; the replacements are objectively shorter and use descriptive geography.

## 2. Homepage H1 three-way drift

Cycle 21 B1.

| File:line | Current text |
|---|---|
| `src/app/page.tsx:84` (heading prop) | "Fort Lauderdale, Pompano Beach, and Boca Raton." |
| `src/lib/site.ts:25` (tagline) | "Eastern Fort Lauderdale, Boca Raton, and Delray Beach." |
| `src/lib/mia.ts:34` (tagline) | "Eastern Fort Lauderdale, Boca Raton, and Delray Beach." |
| `src/components/Hero.tsx:33` (DEFAULT_HEADING constant) | "Eastern Fort Lauderdale, Boca Raton, and Delray Beach." |
| `src/components/Hero.tsx:39-41` (wbr-split visible text in unused default render path) | "...dale, Boca Raton, and Delray..." |

The Hero.tsx default constant + wbr render path are not used when page.tsx passes its own `heading` prop, but they're still in the file as the "canonical" version. Mia decision (§1) picks the canonical triad; ~30-minute AI edit aligns the other ~4 files in one commit. Anti-criteria ISC-36 prevented shipping.

## 3. Response-time language

Cycle 19C banned "same business day" / "within X business days" / "guaranteed response". Current state probed clean:

```
$ grep -nE 'same business day|same.business|within.*hours|within.*business day|guarantee' src/app/thank-you/page.tsx
(no matches)
$ grep -rnE 'same business day' src/ public/
(no matches)
```

Current thank-you copy:

> "Your inquiry has been received. Mia will respond personally — confidentially — when she has the time to give it the attention it deserves."

This honors the honesty contract. Mia packet §7 confirms the stance for post-GHL cutover.

## 4. Private-inventory / off-market / "exclusive inventory" claims

Audits `audit-stale-terms.ts` and `audit-no-fabrications.ts` cover this. Both PASS at baseline.

```
$ bun run audit:stale       → ✓ clean across out/
$ bun run audit:no-fabrications → 0 hits
```

No on-site claims of off-market inventory, MLS-private access, or exclusivity-of-pipeline. miaQuote strings use the word "exclusive" but in the *descriptive-of-place* sense (e.g., "exclusive nautical enclave") not the *inventory-promise* sense — still queued to Mia in §2 for taste.

## 5. Footer consistency

Footer trust set (license + LPT logo + REALTOR® R + EHO) audited at 51/51 sources (HTML + PDFs). No drift.

```
$ bun run audit:trust-row
audit-trust-row — 51/51 sources clean (HTML routes + PDFs)
```

`audit-completeness` footer-trust fan from Cycle 21 promotion runs across 48 built routes and confirms all carry the full set. No footer edits needed this cycle.

## 6. CTA clarity

CTA labels across hubs/markets/insights pass `audit-completeness` and `audit-qa-gate`. No P0/P1 CTA defects.

| Surface | Primary CTA | Status |
|---|---|---|
| Hero (home) | "Begin a Private Conversation" → `/contact/` | OK |
| Hero (home) secondary | "Request Home Valuation" → `/valuation/` | OK |
| `/buyers/` | "Begin a Private Buyer Brief" → `/contact/` | OK (intent param queued to GHL) |
| `/sellers/` | "Request a Listing Conversation" → `/contact/` | OK (intent param queued to GHL) |
| `/markets/[slug]/` footer | "Begin a Private Conversation" → `/contact/` | OK (market param queued to GHL) |
| `/insights/[slug]/` soft CTA | "Begin a Private Conversation" → `/contact/` | OK (topic param queued to GHL) |
| IdxEmbed handoff (Cycle 21 A8) | "Open the property search in a new tab" + "Begin a Private Conversation" + "Request Home Valuation" | OK |

## 7. Items confirmed safe-now in Cycle 22 (but still not shipped, by mission rule)

- **R-031 / ISS-018 FL title length 62 chars.** SEO audit currently reports `0 warning(s)` — the cycle-20 finding may have already been resolved. Re-verify by reading current FL `metaTitle` in `src/lib/markets.ts` and the FL page metadata. If still 62, a 2-char trim is trivially safe but bundled into next coding cycle.
- **R-049 audit-mobile-readability cycle-id hardcode.** Tech-debt parameterization; safe but not strictly required this cycle. Bundled into next.

Neither qualifies as "must ship now" since both can be deferred without launch impact.

## 8. Anti-criteria probes — regression guards

- Anti: no new "exclusive", "absolute pinnacle", "perfectly captures", "same business day", "guaranteed", "private inventory" strings added — confirmed by re-running `audit:stale` and `audit:no-fabrications` after every BUILD edit (planned: zero source edits this cycle, so guards remain trivially satisfied).
- Anti: homepage H1 NOT changed without principal approval — confirmed: `src/app/page.tsx:84` untouched.

## 9. Summary

| Category | Open items | Shipped this cycle | Queued to packet |
|---|---|---|---|
| miaQuote rewrites | 5 | 0 | 5 (Mia §2) |
| Homepage H1 | 1 | 0 | 1 (Mia §1) |
| Response-time | 0 | n/a | n/a |
| Off-market/private claims | 0 | n/a | n/a |
| Footer consistency | 0 | n/a | n/a |
| CTA clarity | 0 | n/a | n/a |
| Title length / tech-debt | 2 | 0 | 2 (next coding cycle) |
| **Total** | **8** | **0** | **8** |
