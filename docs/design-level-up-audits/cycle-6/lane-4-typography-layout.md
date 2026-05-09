=== AUDIT_START ===
# Lane 4 — Typography & Layout Specialist — Cycle 6 Findings

## Finding 1 — Normalize Hero H1 weight across variants
- **Severity:** high
- **Page/Component:** [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx:70-74)
- **Observation:** The `h1` class switches between `font-semibold` and `font-bold` depending on hero variant, so identical title hierarchy can render with different optical weight between routes.
- **Recommended fix:** Standardize one brand-approved H1 weight token for the same `hero` intent; keep `tracking-tight` and `leading-[1.05]` identical across variants.
- **Validation:** Visual diff against `/`, `/about/`, and at least one `/markets/[slug]/` route; confirm no unexpected heading raster weight shifts.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Tim Elmes — unified serif display weight across all hero states.

## Finding 2 — Track primary eyebrow discipline is inconsistent in shared components
- **Severity:** medium
- **Page/Component:** [src/components/SectionHeading.tsx](/home/torrey/code/mia-sanabria-website/src/components/SectionHeading.tsx:25), [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx:62), [src/components/MeetMia.tsx](/home/torrey/code/mia-sanabria-website/src/components/MeetMia.tsx:27)
- **Observation:** Primary page eyebrow usage and reusable section eyebrow usage do not share the same spacing tier; shared eyebrow component sits at a lower tracking tier than some section-level eyebrow instances, which flattens hierarchy.
- **Recommended fix:** Establish one reusable eyebrow utility behavior (e.g., 0.4em on true section eyebrow, 0.3em only on card micro-eyebrows) and apply it consistently in `SectionHeading`.
- **Validation:** Lint-style search for `tracking-[0.4em]` and `tracking-[0.3em]` usage frequency with route review snapshots.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — strict eyebrow scale mapping across sections, not mixed by chance.

## Finding 3 — Missing `[text-wrap:balance]` on reusable section headings
- **Severity:** medium
- **Page/Component:** [src/components/SectionHeading.tsx](/home/torrey/code/mia-sanabria-website/src/components/SectionHeading.tsx:25), [src/components/Faq.tsx](/home/torrey/code/mia-sanabria-website/src/components/Faq.tsx:17)
- **Observation:** Balanced wrapping is applied to hero H1 but not the main reusable section headings, causing long titles to wrap less intentionally on medium screen widths.
- **Recommended fix:** Add `[text-wrap:balance]` to section-level `h2` outputs in `SectionHeading` and `Faq` to enforce editorial line cadence.
- **Validation:** Compare `/markets/fort-lauderdale/` and `/about/` heading wraps before/after at 768/1024/1440 widths.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — deliberate headline balancing for publication-like rhythm.

## Finding 4 — `[text-wrap:pretty]` and hyphenation discipline is not applied broadly
- **Severity:** medium
- **Page/Component:** [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx:102), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx:133), [src/components/Faq.tsx](/home/torrey/code/mia-sanabria-website/src/components/Faq.tsx:33), [src/components/AnswerFirst.tsx](/home/torrey/code/mia-sanabria-website/src/components/AnswerFirst.tsx:46)
- **Observation:** Long-form prose and answer blocks rely on default wrapping; only a subset of text (hero subtext) has wrap-quality utilities, increasing inconsistent rag quality in paragraph-heavy sections.
- **Recommended fix:** Add `[text-wrap:pretty]` (and optional `hyphens-auto` where language supports it) to long body containers in answer/market/about prose blocks.
- **Validation:** Typography review in long paragraphs of `/about/` and one `/markets/[slug]/` route with high-density copy at 16:9 desktop and narrow tablet widths.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem — controlled text wrapping to preserve luxury editorial polish.

## Finding 5 — Section width choreography breaks the 7xl rhythm in shared blocks
- **Severity:** medium
- **Page/Component:** [src/components/Faq.tsx](/home/torrey/code/mia-sanabria-website/src/components/Faq.tsx:16), [src/components/AnswerFirst.tsx](/home/torrey/code/mia-sanabria-website/src/components/AnswerFirst.tsx:39)
- **Observation:** Most routes keep `max-w-7xl` while `Faq` (`max-w-4xl`) and `AnswerFirst` (`max-w-3xl`) introduce abrupt width contractions that are visually inconsistent with the global 7xl grid lane.
- **Recommended fix:** Introduce a predictable width ladder (7xl shell + deliberate nested widths with utility class comments) and use it only where narrative density requires a narrow inset.
- **Validation:** Visual walkthrough for `/about/`, `/buyers/`, `/markets/[slug]/` ensuring section gutters and line-length transitions feel intentional, not accidental.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Ryan Serhant — disciplined width systems across homepage and long-form routes.

## Finding 6 — Local typography block uses off-cycle vertical tokens
- **Severity:** medium
- **Page/Component:** [src/components/AnswerFirst.tsx](/home/torrey/code/mia-sanabria-website/src/components/AnswerFirst.tsx:37)
- **Observation:** `AnswerFirst` uses `py-14 lg:py-20` while the established primary and secondary cadence in this lane is `py-20 lg:py-28` and `py-16 lg:py-20`, creating abrupt breath-loss before/after transitions.
- **Recommended fix:** Move to approved cadence (`py-16 lg:py-20` if meant secondary, else `py-20 lg:py-28`) and keep it consistent by route family.
- **Validation:** Diff capture of adjacent sections where `AnswerFirst` wraps the main content (`/buyers/`, `/sellers/`) to verify stable vertical cadence.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — section cadence consistency across editorial story modules.

## Finding 7 — Hero shadow stack is over-strong on the cream-on-image path
- **Severity:** high
- **Page/Component:** [src/components/Hero.tsx](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx:73-74)
- **Observation:** The light variant composes multiple high-alpha shadows (`0.8` / `0.95`) plus opaque offsets that can flatten thin glyphs and reduce readability on textured backdrops, especially at smaller viewport scales.
- **Recommended fix:** Reduce to a single soft lift shadow or tuned dual-layer stack and test against the darkest hero photos.
- **Validation:** Contrast sampling on rendered hero text at 375/768/1280 widths; confirm legibility under motion/no-motion frame capture.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — subtler shadow usage that preserves serif rendering sharpness.

## Finding 8 — Dense card sequencing in market template compresses narrative rhythm
- **Severity:** high
- **Page/Component:** [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx:195-300)
- **Observation:** Property cards, then buyer/seller guidance cards, then related-markets cards appear in near-consecutive sequences without enough editorial interstitial prose, producing “card after card” fatigue.
- **Recommended fix:** Insert narrative separators or asymmetrical layout breaks (offset quote, pull quote, or bordered text block) between card modules.
- **Validation:** UX review of `/markets/[slug]/` around the property/FAQ/related segments for pacing; confirm no section appears as flat card blocks.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** Senada Adzem — asymmetry and narrative spacing to avoid block-grid monotony.

## Finding 9 — Card title spacing micro-adjustment looks mechanical at current scale
- **Severity:** medium
- **Page/Component:** [src/components/MarketCard.tsx](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx:27)
- **Observation:** `h3` applies `tracking-[0.05em]` at `font-display text-2xl`, which reads as compressed/engineered rather than editorial at this size and conflicts with the rest of the display scale.
- **Recommended fix:** Remove custom 0.05 tracking on this heading and rely on `font-display` default spacing; keep tighter tracking only for true micro-eyebrow tokens.
- **Validation:** Compare Market card title rendering across `/markets/` grid cards at mobile and desktop.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** One Sotheby’s — restrained serif display spacing in card headings.

## Finding 10 — Asymmetric grid potential is underused in service/value blocks
- **Severity:** low
- **Page/Component:** [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx:136)
- **Observation:** The three-value cards use symmetric `lg:grid-cols-3` with equal prominence, which reads as template-block architecture rather than editorial luxury hierarchy.
- **Recommended fix:** Introduce asymmetric rhythm (e.g., 1.5fr/1fr/1fr or 2fr/1fr/1fr pattern with alternating rhythm) while preserving tokenized spacing.
- **Validation:** Compare `/about/` on 1024+ widths for a publication-style emphasis ladder, and ensure no card overcrowding.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — asymmetric arrangement for editorial hierarchy and prestige framing.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"lane-4-typography-layout-specialist","verdict":"concerns","completeness":"full","top_concerns":["Normalize heading/eyebrow/weight system across shared typography components","Reduce card-cluster pacing in market and utility blocks and reinforce asymmetric rhythm"],"findings_count":10,"high_severity_count":2,"safe_now_count":10,"benchmark_references":10}
=== AUDIT_END ===
