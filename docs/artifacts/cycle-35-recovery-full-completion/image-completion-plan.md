# Image Completion Plan — Cycle 35B

date: 2026-05-14
purpose: Decide whether any neighborhood image needs replacement, generation, or operator action this cycle.

## Decision

**No images will be generated, no images will be replaced.** Existing repo assets are adequate for staging. Per user rule "If existing images are adequate, do not generate new images merely to satisfy the prompt", AI image generation is not a real need here.

## Evidence supporting the decision

- **Photographic heroes (existing-approved):** `fort-lauderdale.jpg` (245KB modern waterfront residence + yacht at sunset), `pompano-beach.jpg` (281KB aerial Pompano pier + beach corridor), `boca-raton.jpg` (362KB), `delray-beach.jpg` (455KB). All four read as accurate, real, on-topic — verified by direct PNG read inside this audit.
- **Brand-tone editorial cards (existing-approved):** `deerfield-beach.jpg` (65KB), `coral-springs.jpg` (63KB), `plantation.jpg` (59KB), `weston.jpg` (58KB), `hollywood.jpg` (60KB), `davie.jpg` (56KB), `sunrise.jpg` (57KB). Each renders a navy gradient with brass rule, large city name, one-sentence factual subhead, MIA SANABRIA REALTOR® · LPT REALTY masthead, SOUTHEAST FLORIDA · Broward County footer.
  - These cards are not "placeholder" in the lorem-ipsum sense. They are deliberate, brand-consistent typographic hero artwork.
  - They do not misrepresent any place. They do not show people, license plates, gates, "private" anything, or unlicensed third-party content.
  - They eliminate the risk that an AI-generated "Plantation, Florida hero image" depicts a place that doesn't exist or is not legally clearable.

- **Cycle 34 noted "Cycle 34 noted 7 Broward cities may have brand-tone placeholder hero images; verify visually before accepting."** Visual verification (this cycle) accepts them.

- **Staging renders (verified):** `/markets/plantation/` 1280x800 renders with clear cream-on-navy H1 and CTAs. Hero contrast is strong. Mobile-readability passed on staging (84/84). Visual issue: none.

## Image-generation one-sample checkpoint: not invoked

Conditions for triggering the one-sample checkpoint per the user spec:
- "Pick highest-priority missing/off-topic/placeholder image" — none qualify (brand-tone cards are deliberate, not off-topic).
- "Before generating any batch, perform one-sample checkpoint" — no batch is planned.

Gemini/image-generation tools are therefore **not used** this cycle. Result is recorded in `image-generation-log.md` (empty log; classification = not-needed).

## Operator-needed (not AI-closeable)

For a future cycle, Mia could provide licensed photographic hero images of the 7 Broward cities (Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise) — taken by her, by a contracted photographer with explicit license to use, or sourced from a licensed stock provider with documented terms. Until then the brand-tone cards stay.

## Counter-argument considered and rejected

> "Wouldn't AI-generated illustrative cityscape images make the seven Broward cities look more polished?"

Rejected because:

1. The brand-tone cards already render polished — they're navy editorial cards, consistent with the rest of the site brand vocabulary.
2. Even AI-illustrative images carry residual risks: misrepresenting a specific city's character, generating content that looks like a real-but-fake address, or unintentionally inserting a recognizable landmark that wasn't intended.
3. The site's audit gates would flag any switch from the existing-approved cohort to AI-generated content as a provenance event requiring review.
4. The user explicitly said "If existing images are adequate, do not generate new images merely to satisfy the prompt."

If Mia later prefers AI-illustrative imagery for the 7 cities, a future cycle can invoke the one-sample checkpoint properly. Cycle 35B will not.
