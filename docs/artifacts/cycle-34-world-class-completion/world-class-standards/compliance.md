# Compliance Standard

> Cycle 34 Phase 6. Consolidates Fair Housing, FREC, MLS/IDX, and brokerage attribution rules already enforced across `audit:legal`, `audit:about`, `audit:no-fabrications`, and `audit:stale`.

## Brokerage attribution (FREC + REALTOR® Code)

- Every public-facing page footer attributes `Mia Sanabria, LPT Realty, LLC`.
- License number `SL3405877` displays in footer + Terms page only, not in body copy (per `audit:about`).
- REALTOR® R logo display requires NAR/Florida Realtors/Broward, Palm Beaches & St. Lucie membership (already cited in repo ledger).
- Equal Housing Opportunity logo displays in footer.

## MLS / IDX disclosure

- Any page rendering an IDX widget (Bridge `<BridgeSearch />`, SEF MLS Matrix iframe, `IdxEmbed.tsx`) must include the standard IDX/MLS attribution at point-of-use.
- The Bridge demo banner stays visible whenever demo data is displayed; it must not be styled to read as "real listings".
- The brief explicitly forbids:
  - Hiding Bridge demo mode while demo data appears.
  - Calling demo / test listings real listings.
  - Claiming real SEF MLS feed is active when it is not.

## Fair Housing (FHA + Florida § 760)

Body copy must not target or steer based on protected classes:

- race, color, national origin, ancestry
- religion
- sex, gender identity, sexual orientation
- familial status (banned phrases: `family-friendly`, `kid-friendly`, `most families`, `for families with children`)
- disability
- pregnancy
- military status (where applicable)

Banned proxy phrases that imply protected-class targeting:

```
bachelor pad   young professionals   for retirees   55+ community (only allowed where the community is legally HOPA-certified and that fact is explicitly stated)
safe neighborhood   safest   most secure
best schools   good schools   top schools   highly-rated schools
```

## FREC superlative rules

Bans:

- `#1 realtor`, `top realtor`, `best realtor`, `Florida's leading realtor`, etc.
- `guaranteed sale`, `guaranteed price`, `we'll sell your home in N days or...`

`audit:no-fabrications` enforces this (current result: 0 hits).

## Photography / image rights

- No unlicensed third-party photography.
- No hotlinking.
- Every image must have provenance (`image-system.md`).
- AI-generated illustrative imagery never presented as documentary.

## ADA / WCAG

- Alt text on every meaningful image.
- Color contrast ≥ AA on body text + AAA on hero CTAs.
- Mobile readability passes at 320, 375, 414 viewports.

## Cycle 34 compliance scan result

`git grep` site-wide for the banned-phrase set returned 2 hits, both in guard-comments, none user-facing. See `compliance-review.md` for the full report.
