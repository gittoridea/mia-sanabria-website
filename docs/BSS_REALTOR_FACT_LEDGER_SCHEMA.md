# BSS Realtor — Fact Ledger Schema

> The discipline that prevents BSS from accidentally publishing unverified claims about a real human.
> Based on `~/.claude/PAI/USER/PROJECTS/MiaSanabria/PUBLIC_FACT_LEDGER.md` v2 (the empirical source).
> Every BSS realtor client gets a ledger keyed to this schema **before** any code is written.

## Why a ledger

Realtors live in a regulated ad surface (FREC for Florida, equivalent state regulators elsewhere) and a high-stakes brand surface — a fabricated designation, a "top agent" claim with no source, or a stale brokerage attribution can produce real legal exposure or instant brand erosion. The fact ledger separates **what the operator can claim** from **what the operator cannot claim** at the data layer, so the codebase has nothing unverified to leak.

## Sections (fixed order)

```markdown
# <CLIENT_NAME> — Public Fact Ledger v<X.Y>

## §1. Verified
## §2. Candidate (provisional, not for production)
## §3. Refuted
## §4. Not Found
## §5. Historical (true at a point in time, not currently)
## §6. Do Not Publish
## §7. Defects on existing surfaces
## §8. Brand implications (derived, not factual)
## §9. Copy-safe fact bank (derived, ready-to-quote)
## §10. Update log
```

## Section contracts

### §1 Verified

Every entry has: `fact`, `verified-at`, `source` (URL, public record reference, or "client-confirmed in writing — <date>"), and `where-it-renders` (which `<Schema>` component or page-spec consumes it).

A fact is allowed in §1 only if **at least one** of these is true:
- It is on a stable public-record source (FL DBPR for FL realtors, county tax roll for property history, MLS sold transactions with the client as agent of record).
- The client has confirmed it in writing (text, email, signed copy approval).
- It is a primary identifier the client has explicitly authorized for marketing use (name, brokerage, contact phone, public email).

### §2 Candidate

Anything plausibly true but not yet meeting the §1 bar. Renders in code as **null** in production (see "unverified-block doctrine" below). Common entries:
- License number (until DBPR or written confirm)
- Designations (AHWD, SFR, PSA, RENE, ABR, etc.)
- Languages beyond English
- Years licensed
- Display office address (versus brokerage HQ)

### §3 Refuted

Things that **looked true** but evidence disproved. Keep entries here, not delete — they prevent re-introduction by a future research run. Each row: `claim`, `refuted-by`, `refuted-at`.

### §4 Not Found

Things checked and not found in any public source. Distinct from §3 because the absence is interesting (e.g., "GBP not found in public search → either unclaimed or doesn't exist → onboarding question").

### §5 Historical

True at a point in time, not currently. Most common: prior-brokerage transactions where the client was agent of record. Allowed in copy ONLY when explicitly framed as historical (e.g. "career history" not "current listings").

### §6 Do Not Publish

Things the operator may know (client confirmed off the record, or research surfaced) but must not appear in public copy. Personal details, inactive entities, family information.

### §7 Defects on existing surfaces

Bugs/residue/legal exposure on the client's current site, GBP, brokerage profile, social. Each row: `defect`, `where`, `severity (HIGH/MED/LOW)`, `est-fix-time`, `gating-question`. This is the fix-list the new build replaces.

### §8 Brand implications

Editorial conclusions drawn from §1–§7 — NOT facts about the client. Examples: "voice register: warm-concierge first-person", "strongest documented market: Coral Ridge". These influence copy direction, not claims.

### §9 Copy-safe fact bank

Pre-cleared phrases ready to quote in copy with no further check. Updated whenever a §1 entry is added. Saves time at copy-write phase.

### §10 Update log

Every change to the ledger logged with timestamp + delta + reason. Retains audit trail across iterations.

## Unverified-block doctrine (codebase contract)

The data file (`src/lib/<client>.ts`) MUST expose unverified fields under a single `unverified` block where every field defaults to `null` (or empty array for collections). Schema components MUST runtime-guard each access:

```typescript
// src/lib/<client>.ts
export const CLIENT = {
  name: { legal: "...", marketing: "..." },
  brokerage: { legal: "...", display: "..." },
  contact: { phone: "...", phoneTel: "...", email: "..." },
  // ↑ verified §1 — direct access OK
  unverified: {
    licenseNumber: null as string | null,
    designations: [] as string[],
    languages: ["English"] as ReadonlyArray<string>,
    yearsLicensed: null as string | null,
    displayOffice: null as string | null,
  },
} as const;

// PersonSchema.tsx
const license = CLIENT.unverified.licenseNumber;
return {
  "@type": "RealEstateAgent",
  name: CLIENT.name.legal,
  ...(license ? { knowsAbout: license } : {}),  // null-guard
};
```

The guard means: zero unverified fields ever land in production HTML or JSON-LD. The `audit:stale` script reinforces this by failing the build on any forbidden-string hit.

## Ledger lifecycle

| Phase | Owner | Action |
|-------|-------|--------|
| Onboarding research | AI | Crawl public surfaces (DBPR, MLS, brokerage profile, social) → first-pass §1/§2/§3/§4 |
| Discovery call | Operator + Client | Walk §2 → §1 (or §3) for everything client willing to confirm |
| Build phase | AI | Read §1 only; everything else stays null in code |
| Pre-launch review | Operator | Read §7 with client, schedule fixes on existing surfaces |
| Launch | Operator | Confirm §1 has every gate-blocking field; if not → block cutover |
| Post-launch | AI | Update §10 log on every fact change; never silently rewrite §1 entries |

## Anti-patterns (DO NOT)

- **Do not** flag an entry §1 because "it's on the client's old site". Old sites are §5 or §7, not §1.
- **Do not** auto-promote §2 → §1 from a single research source. The bar is at least two independent sources OR client written confirmation.
- **Do not** delete §3 entries. They're the firewall against re-introducing refuted claims.
- **Do not** infer designations from initials in a profile photo or signature. Designations require issuing-body confirmation OR client confirmation.
- **Do not** publish a license number found via Google cache without DBPR confirmation — caches go stale and licenses lapse.

## Empirical anchor (Mia Sanabria, 2026-05-04 → 2026-05-07)

- Original research run: 16 candidate facts across §2.
- Post-iteration: 4 confirmed §1 (name, brokerage, phone, public email), 8 refuted (designations, Spanish, several listing attributions), 2 still §2 awaiting written confirmation, 11 newly enumerated §7 defects on existing surfaces.
- Net effect on this codebase: 5 unverified fields kept null in production despite operator's "deploy-permission lift" — preserved client risk surface during autonomous build.
