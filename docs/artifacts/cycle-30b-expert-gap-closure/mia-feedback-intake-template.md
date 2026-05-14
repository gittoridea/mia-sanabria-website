# Mia Feedback Intake Template

> When Mia's response comes back, paste her raw feedback into one new file at `docs/mia-client-decision-record.md` → §"Mia Cycle 30 review decisions" using the fields below. This template's only job is to make the next cycle (Cycle 31 — Mia Review Decisions Application) deterministic: each row maps directly to a code/copy action.

## Header

```yaml
received_at: YYYY-MM-DD HH:MM    # convert to absolute date even if she said "yesterday"
received_via: telegram | sms | email | voice_note | call_summary | other
raw_evidence_path: <path-saved-off-repo>  # screenshot or text dump; not committed if it contains personal info
captured_by: torrey
canonical_confirmed_miasanabria_dot_com: yes | no | unconfirmed
mia_neighborhood_roster_confirmed: yes | no | partial
```

## Per-decision rows

For every distinct piece of feedback Mia gives, fill one row:

| Row template | Required values |
|---|---|
| `id` | `MIA-DEC-NNNN` (zero-pad 4) |
| `surface` | `home` / `markets-hub` / `market-{slug}` / `buyers` / `sellers` / `insights` / `about` / `contact` / `nav` / `footer` / `testimonials` / `photos` / `domain` / `other` |
| `quote` | exact wording from Mia (or your closest paraphrase if she said it verbally — flag with `paraphrase: true`) |
| `bucket` | `must-change` / `prefer-change` / `okay-for-v1` / `post-launch` |
| `action_class` | `copy-edit` / `nav-label` / `route-add` / `route-remove` / `image-swap` / `testimonial-add` / `data-add` / `data-remove` / `decision-record-only` / `clarification-needed` |
| `target_file` | exact file path if known; `?` if Claude must investigate |
| `claude_local_closable` | yes / no / requires-decision |
| `external_dependency` | none / mia-asset / mia-permission / counsel / ghl / google / dns / bridge |
| `notes` | one short line of context |

## Example filled row

```yaml
- id: MIA-DEC-0007
  surface: market-weston
  quote: "The intro sentence reads too generic — say something like 'Weston is where families with horses and equestrian centers go' instead."
  paraphrase: false
  bucket: prefer-change
  action_class: copy-edit
  target_file: src/lib/markets.ts  # weston intro field
  claude_local_closable: yes
  external_dependency: none
  notes: Adjust intro field; must not invent stats; one-sentence swap.
```

## Quick-classification cheat sheet

| If Mia says... | Bucket | Action class |
|---|---|---|
| "I don't like the headline / change to ___" | must-change | copy-edit |
| "Drop the photo of X" | must-change (if photo is hers) / prefer-change (if licensed stock placeholder) | image-swap |
| "Don't use that testimonial" | must-change | testimonial-add (negative) — remove or never add |
| "Use this exact review from Sarah on Facebook" + sends screenshot | must-change-include | testimonial-add (positive) — requires permission evidence |
| "Add a Boca Raton page" | requires-decision (scope expansion) | route-add |
| "I prefer 'Blog' everywhere" | must-change | nav-label (footer + section eyebrow + section H2) |
| "Looks great, ship it" | okay-for-v1 across the board | decision-record-only |
| "Hmm, I'm not sure about ___" | clarification-needed | clarification-needed |
| "Maybe later, but not for launch" | post-launch | decision-record-only |
| "Why does the footer say Insights but the top says Blog?" | requires-decision | nav-label (resolve in single direction) |

## What never gets recorded as a decision

- Mia consenting to GHL endpoint URLs, Bridge IDX credentials, Google analytics IDs — those are Torrey + platform decisions, not Mia decisions. If she asks, surface them; don't paste values.
- Implicit "she didn't object so it's approved." If she didn't speak to a thing, it's `okay-for-v1` only if everything else is clean and `audit:no-fabrications` + `audit:legal` are green.
- Anything she said while not authenticated as Mia (e.g. via a third party). Record source-of-truth carefully.

## Output of this template

The completed intake becomes the **only** input to Cycle 31 Mia Review Decisions Application. Cycle 31's job is to walk every `MIA-DEC-NNNN` row, decide closable-now vs deferred, apply the closable-now edits, and emit one commit. No code is changed in Cycle 31 unless it has a `MIA-DEC-NNNN` backing it.

## Where this lives long-term

After Cycle 31 closes, the per-row table is preserved in `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions" as the audit trail. This intake template (the form) lives at `docs/artifacts/cycle-30b-expert-gap-closure/mia-feedback-intake-template.md` as a reusable shape for future review rounds.
