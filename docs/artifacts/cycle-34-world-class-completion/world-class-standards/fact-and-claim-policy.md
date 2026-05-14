# Fact & Claim Policy

> Cycle 34 Phase 6.

Every factual claim on the site must trace to a source. Three valid states:

1. **Sourced** — claim cites an official / repo-approved source ledger entry.
2. **Non-factual positioning** — claim is rewritten so it reads as the practice's perspective, not a verifiable assertion ("the practice centers on the deepwater finger isles" — perspective, not metric).
3. **Removed** — claim cannot be sourced and cannot be honestly recast.

## Source hierarchy

1. Official city pages (e.g., `fortlauderdale.gov`).
2. Broward County / municipal sources.
3. Official parks/recreation pages.
4. Official neighborhood association pages (only if public and stable).
5. Repo-approved Mia context (`~/.claude/PAI/USER/PROJECTS/MiaSanabria/` ledger v2).
6. Reputable local context sources only when official sources are insufficient.

## Banned phrases (auto-fail `audit:no-fabrications`)

```
best realtor   top realtor   #1 realtor   number one realtor
guaranteed sale   guaranteed price
luxury concierge   white-glove   bespoke
exclusive clientele   high-net-worth
off-market access   off-market listings (unless paired with appropriate disclaimer)
best schools   good schools   top schools   highest-rated schools
safe neighborhood   safest area   most family-friendly
kid-friendly   family-friendly   bachelor pad   young professionals
since 2017   within two hours
bilingual   hablo español   Spanish-speaking   (until Mia confirms language)
placeholder testimonial   lorem ipsum
Updated MONTH YYYY   (in visible body copy — schema dateModified is fine)
```

Some phrases may be allowed *only* in legal disclaimer text where they are unavoidable.

## Allowed factual claim shape

```
<concrete entity> + <verifiable attribute> + <(source: <citation>)>
```

Examples that pass:

- "Fort Lauderdale is in Broward County, Florida" — verifiable, doesn't need explicit citation.
- "Las Olas Boulevard runs east-west between Andrews Avenue and A1A" — geographic fact.
- "Mia Sanabria is licensed as a Florida Sales Associate" — confirmed by Mia + repo ledger.

Examples that fail without sourcing:

- "Coral Springs has the best schools in Broward" — banned absolute + Fair Housing risk.
- "Hollywood is the safest beach town in South Florida" — banned safety claim.
- "Mia has closed over $50M in transactions" — needs Mia attestation + source.

## When in doubt

Recast as positioning ("the practice centers on...", "buyers in this market typically...") or remove. Never invent.
