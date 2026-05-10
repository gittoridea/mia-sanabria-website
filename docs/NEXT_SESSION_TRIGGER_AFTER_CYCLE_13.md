# Next Session Trigger — After Cycle 13 (Bay Colony + Bermuda Riviera Featured Market Expansion)

**Cycle 13 close state:** PASS · Bay Colony + Bermuda Riviera shipped as full first-class market entities · Featured Markets 6 → 8 · audit chain green at parity with Cycle 12 close · 9 external blockers from Cycle 12 still untouched (none re-opened by this cycle).

The next session has THREE realistic shapes. Option A remains the highest-leverage move (principal-decision unblocking from Cycle 12). Option B is a reverse-internal-link curation cycle if the principal wants the new markets to feel even more native. Option C is the GHL wiring cycle from Cycle 12's trigger (unchanged).

---

## Option A — Principal-decision-gathering session (RECOMMENDED — highest leverage, unchanged from Cycle 12 trigger)

If the principal has bandwidth for ~60-90 minutes of decisions, this remains the highest-leverage next move. It unblocks 4 of the 9 external gates without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Scorecard External Blockers (Post-Cycle-13)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 9 external blockers from Cycle 12's production-readiness scorecard (still open as of Cycle 13 close) and capture decisions on the 4 that are principal-decision-only (not GHL or legal-counsel). The 4 axes are:

1. License rendering (PRINCIPAL_DECISION_REGISTER Card 1) — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag.
2. Analytics provider — pick GA4 vs Plausible vs Umami; provide measurement ID. ~15 min to ship.
3. Branded email — pick provider (Google Workspace / Zoho / Fastmail); provide MX record + initial inbox provisioning.
4. .com cutover sign-off — DNS swap from current Direct Axess host to staging URL; 301 redirect plan.

After capturing decisions, ship the 1-2 quick wins:
- Update src/lib/mia.ts licenseNumber per principal decision.
- Insert analytics tag into src/app/layout.tsx per principal choice.
- Document branded-email + DNS cutover as scheduled engineering work.

Mission boundaries (DO NOT):
- Touch GHL wiring or TCPA mechanics (separate cycle, blocked by legal-counsel).
- Implement DNS cutover without explicit principal sign-off + scheduled date.
- Modify REALTOR® mark usage (Cards 4+5; legal review pending).
- Reopen Cycle 13 design work (Bay Colony + Bermuda Riviera markets — verified PASS).

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_13_FEATURED_MARKET_EXPANSION_2026-05-10.md
3. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes; sections 14-18 enumerate external blockers)
4. docs/CYCLE_13_PRODUCTION_READINESS_SCORECARD_UPDATE.md (Cycle 13 deltas)
5. docs/PRINCIPAL_DECISION_REGISTER.md (Cards 1, 2, 3, 4, 5, 6 — Card 1 OPEN; Cards 2/4/5 RECOMMENDATION_PENDING)
6. src/lib/mia.ts (licenseNumber + email config)
7. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Reverse internal-link curation + market-system DRY refactor (NEW CYCLE 13 RESIDUAL)

Cycle 13's new markets (Bay Colony + Bermuda Riviera) have outbound internal links to peer markets (Harbor Beach, Las Olas Isles, Coral Ridge, Fort Lauderdale) but peer markets do not yet link back. Reverse-link curation is a small targeted cycle. Pair with the audit-script DRY refactor (`MARKET_SLUGS` constant import) to collapse 5 hardcoded arrays to 1.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Reverse Internal-Link Curation + Market-System DRY Refactor

Start in:

~/code/mia-sanabria-website/

Primary objective:
Two narrow improvements to the market system:

1. Add reverse internal links from peer markets back to Bay Colony and Bermuda Riviera (Harbor Beach, Las Olas Isles, Coral Ridge → bidirectional cluster A links).
2. Refactor audit scripts (audit-completeness, audit-images, audit-rendered-visual, audit-hero-pixel-contrast, capture-baseline) to import MARKET_SLUGS from src/lib/mia.ts rather than hardcoding slug arrays. Reduces market-add touch surface from 10 to ~6.

Mission boundaries (DO NOT):
- Add new markets.
- Reopen Cycle 12 production-readiness gates.
- Touch GHL wiring, TCPA, license, REALTOR® marks.
- Modify hero copy on Bay Colony or Bermuda Riviera (Cycle 13 closed PASS).

READ FIRST:
1. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_13_FEATURED_MARKET_EXPANSION_2026-05-10.md
2. docs/CYCLE_13_PROCESS_UPGRADE_REPORT.md (limitations §)
3. src/lib/markets.ts (look at internalLinks fields on Harbor Beach, Las Olas Isles, Coral Ridge — these don't yet point to bay-colony or bermuda-riviera)
4. scripts/audit-{completeness,images,rendered-visual,hero-pixel-contrast,capture-baseline}.ts

Estimate: 60-90 min. Pure refactor + content additions, no new design work, no deploy gates beyond audit:all.
```

---

## Option C — GHL form wiring engineering cycle (unchanged from Cycle 12 trigger)

If the principal has authorized the GHL workflow webhook URL + TCPA approach, this is the engineering cycle to wire the forms. Unchanged from Cycle 12's NEXT_SESSION_TRIGGER Option B.

See `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_12.md` Option B for the full paste-ready trigger.

---

## Cycle 13 residuals worth flagging

1. **Bermuda Riviera intro tightening was caught by audit:rendered, not pre-build lint.** Adding a `Market.intro.length <= 370` lint pre-commit would catch this BEFORE build. Cycle 13 didn't add the lint (scope: market additions). Future market adds should respect the 370-char soft cap until/unless the lint is added.
2. **Reverse internal links to Bay Colony / Bermuda Riviera not yet added** (Option B above). Outbound links from new markets are populated; inbound from peer markets is pending case-by-case curation.
3. **5 audit scripts still hardcode slug arrays.** A `MARKET_SLUGS` import refactor (Option B above) collapses to 1 source.
4. **Coral Ridge `_1440,900.png` headless-capture timing artifact** was flagged by Forge but is not a real defect (`audit:rendered.images.allRendered` confirms 0 broken). `--virtual-time-budget` flag for next baseline capture would eliminate the artifact.
5. **Phase 1 architecture-decision doc Bay Colony boundary inconsistency** — fixed inline before commit (live copy is correct; doc text reconciled).

## Recommendation

**Option A.** The site is production-ready as a design surface; the bottleneck is principal-side decisions that 90 minutes of focused walkthrough can move. Cycle 13 added depth (markets + featured rhythm) without moving the launch-blocker count. Option B and Option C are good follow-on work but neither moves the .com cutover date.
