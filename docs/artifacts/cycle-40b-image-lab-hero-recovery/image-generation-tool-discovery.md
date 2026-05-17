# Cycle 40B — Image Generation Tool Discovery

```yaml
date: 2026-05-17T00:00Z

available_image_tools_on_host:
  gemini_api_via_google:
    endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
    auth: GEMINI_API_KEY (present) + GOOGLE_API_KEY (present, used as fallback)
    proven: yes — used by v2 generator in Cycle 38 and 39
    cost: ~$0.039 per generation (gemini-2.5-flash-image, billed per image)
    pros:
      - fast (~6s per candidate)
      - already wired in v2 generator
      - keys present in process env (no source needed)
      - returns inline PNG data (no separate fetch)
    cons:
      - returns square 1024x1024, not native 4:5 portrait (smart-crop on export)
      - sometimes returns painted compositions when prompt is ambiguous about
        "photograph"
      - safety filters occasionally block on overly specific prompts

  gemini_cli:
    binary: present at /home/torrey/.local/bin/gemini
    proven: no — not used for image generation in this project (text-only CLI)
    decision: not invoked; API path is more controllable

  openai_image_api:
    binary: openai CLI missing
    env: OPENAI_API_KEY missing
    decision: NOT AVAILABLE this cycle — only Gemini path

  artist_skill_agent:
    location: ~/.claude/skills/Art/Tools/Generate.ts
    proven: yes
    issue: feedback_artist_agent_batch_unreliable.md — Artist agent hallucinates
      completion on batches ≥3 images. Direct CLI Promise.all pattern is the
      memory's recommendation.
    decision: NOT used — v3 generator calls Gemini API directly in-process
      per the memory's direct-CLI recommendation, scaled to multi-candidate.

  imagen_3_4_via_vertex:
    auth: would require GCP project + service account
    decision: deferred — Gemini 2.5 flash image is the proven, cost-effective
      path; switching tools mid-cycle adds risk without need

decision: gemini-2.5-flash-image via direct API in v3 generator (in-process
  Promise.all-style concurrency pool, no Artist agent dispatch)
```

## Probe evidence

```text
$ command -v codex; codex --version
present
codex-cli 0.x

$ command -v gemini
/home/torrey/.local/bin/gemini

$ node -e 'console.log("GEMINI_API_KEY",
    process.env.GEMINI_API_KEY ? "present" : "missing")'
GEMINI_API_KEY present

$ bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json
{
  "schema_version": "1.0.0",
  "available": ["forge","cato","perplexity"],
  "missing": ["anvil"],
  ...
}
```

## Why not the Artist agent

Per `feedback_artist_agent_batch_unreliable.md` (2026-05-08 observed
behavior): when the Artist subagent is asked to handle ≥3 images in a batch,
it loses thread mid-run — emits "now launching N generations" then writes
nothing. The 7-image Mia batch case took 126s + 31 tool uses for zero
files written; a direct `bun` script invoking `Generate.ts` in `Promise.all`
wrote the same 7 in 29.5s.

Cycle 40B's v3 generator follows the memory: direct in-process Gemini API
calls, simple concurrency pool, no subagent dispatch for the generation
step. 21 candidates fit comfortably in a single bun process.
