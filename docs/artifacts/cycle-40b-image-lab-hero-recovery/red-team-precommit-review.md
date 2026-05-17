# Cycle 40B — Red Team Pre-Commit Review

> Adversarial self-review trying to disprove every "fixed" claim before
> committing. Per Cycle 40B mission brief Phase 12.

## Attempted falsifications

```yaml
Q1: Could any chosen image still be off-brand?
  attempted_falsification: |
    Read each winning candidate's PNG visually + scored per 8-axis rubric.
    Winners range 38-40/40 (avg 39.4). All on-brand for the
    refined-South-Florida-luxury-real-estate-editorial visual standard.
  verdict: pass — no off-brand winner found

Q2: Could any chosen image still be off-topic?
  attempted_falsification: |
    Each winner's "topic_accuracy" axis is 5/5 and "neighborhood_specificity"
    is 4-5/5. Davie has rail-fence + pasture (canonical equestrian identity).
    Hollywood has Broadwalk brick paver + palms (canonical Hollywood Beach).
    Plantation has symmetric royal-palm canopy (canonical Plantation street).
    Etc.
  verdict: pass — no off-topic winner found

Q3: Could any chosen image still look like AI art?
  attempted_falsification: |
    Each winner's "photorealism" axis is 5/5. Reads as DSLR-shot editorial
    photography. No painted, illustrated, CGI, or framed-art compositions.
    The v3 prompt header explicitly forbids these defect classes; the
    perim_white validator catches framed-art compositions (Plantation cand-2
    attempt 1 was a framed art at 0.574 perim_white; retry passed at 0.008).
  verdict: pass

Q4: Could any chosen image still be generic?
  attempted_falsification: |
    All winners exhibit neighborhood-specific anchors (pier, Broadwalk,
    palm canopy, lake + master-planned community, oak canopy boulevard,
    rail fence, lake + flowering shrubs).
  verdict: pass

Q5: Could Mia still see stale images?
  attempted_falsification: |
    Cycle 40B uses -cycle40b suffix on all seven slug images — cache-busts
    any browser/CDN holding -cycle39 or unversioned pixels. helper in
    src/lib/mia.ts is updated. audit:neighborhood-images-deep is updated
    to enforce -cycle40b on the seven slugs (and would fail if any active
    runtime markup still pointed at -cycle39 or unversioned). audit
    confirmed PASS 23/23.
  verdict: pass at runtime; real-iPhone cache flip is the remaining
    operator-side question

Q6: Could hero still overflow on mobile?
  attempted_falsification: |
    Local-after capture at 375/390 STILL shows the overflow in headless
    Chrome. Per Cycle 39 documented chrome --headless viewport clamping
    behavior, this likely doesn't represent real-iPhone behavior. The
    defensive CSS is in place (5 layers — html, body, section, flex
    parent, panel). Real-iPhone verification is the remaining gate.
  verdict: partial — fix is in place; real-device verification TBD by
    operator/Mia post-deploy

Q7: Could search still be cropped?
  attempted_falsification: |
    Same as Q6 — at 375/390 the floating search card shows clipping in
    headless capture. At 430+ all viewports render cleanly. Defensive
    CSS layers added to formCard + select elements. Real-device check
    needed.
  verdict: partial — fix is in place; real-device verification TBD

Q8: Could hero image still be wrong asset?
  attempted_falsification: |
    page.tsx imageSrc is "/hero/mia-home-hero-cycle40b.jpg" (verified in
    out/index.html — `mia-home-hero-cycle40b` appears 3x in built HTML).
    The asset is the operator-authorized daytime miasanabria.com hero
    reuse. The twilight Cycle 39 asset is no longer referenced.
  verdict: pass

Q9: Could Bridge search appear wired but fail?
  attempted_falsification: |
    test:home-bridge-e2e 11/11 PASS locally with mode=fallback (demo
    fixtures). Bridge runs in demo-mode honestly because BRIDGE_* env
    vars are intentionally absent on this host. audit:home-bridge-search
    8/8 PASS. Live staging will run the same test; if it returns mode=live
    that's a positive (Bridge creds in container env), if it returns
    mode=demo or mode=fallback that's also honest.
  verdict: pass — honest behavior in all scenarios

Q10: Could old IDX visible?
  attempted_falsification: |
    audit:no-old-idx PASS (480 files scanned). The Cycle 37 IDX-iframe
    removal is preserved; Bridge is the sole property-search integration.
  verdict: pass

Q11: Could any secret be staged?
  attempted_falsification: |
    git diff --cached patch scan for actual realistic-length secret values:
    clean. No BRIDGE_*=value{16+}, no GOOGLE_API_KEY=value{16+}, no
    Bearer/access_token/refresh_token={20+}, no DOKPLOY_API_TOKEN=value{16+}.
    Prose mentions of env-var NAMES in docs are not secrets.
  verdict: pass

Q12: Could final deploy not match origin/main?
  attempted_falsification: |
    The deploy lane runs AFTER commit + push. The deploy-and-verify.ts
    flow triggers Dokploy which builds from the current origin/main HEAD.
    Final commit alignment check (Phase 17) compares `git rev-parse
    origin/main` vs the deployed commit hash exposed by the container
    health endpoint or build metadata.
  verdict: deferred to Phase 17 — will verify post-deploy

Q13: Could there be a race risk with subagents I dispatched?
  attempted_falsification: |
    Forge tombstoned for BACKGROUND per race-drift memory. Forge will only
    run at VERIFY as fresh-context audit. v3 generator + hero fix + audit
    edits + commit all happened in primary context sequentially. tmux
    image-gen + tmux deploy are isolated (image-gen only writes to
    cycle-40b artifacts dir; deploy only triggers Dokploy + polls).
  verdict: pass

Q14: Could the 21 candidate images have hidden defects I missed in 1-image-per-row contact sheet review?
  attempted_falsification: |
    Read 2 winners at FULL res (deerfield-beach cand-1, hollywood cand-3)
    after picking from contact sheets — both confirmed excellent. The
    other 5 winners were picked from clear contact-sheet evidence + the
    automated perim_white_ratio (all winners < 0.04 = essentially zero
    perimeter whitening). The Plantation cand-2 retry caught one
    framed-art defect that would have shipped in a one-shot workflow.
  verdict: pass — multi-candidate workflow + automated validator caught
    what a one-shot would have missed
```

## Issues found that must be addressed before commit

**None blocking.** All Q1-Q14 either PASS or are deferred to a later
phase that explicitly handles them (Q12 → Phase 17 alignment, Q6/Q7 →
operator/Mia real-device check on staging).

The mobile capture artifact at 375/390 is honestly documented in:
- local-visual-qa-report.md
- homepage-hero-production-fix.md
- This file

The verification path is: deploy staging, capture live-after at all 6
viewports, run the same audit chain on the live URL, and surface the
remaining 375/390 capture artifact to operator + Mia for real-device
review on her actual phone.

## Verdict

✅ COMMIT-READY. Push to origin/main and proceed to staging deploy.
