# Audit About Report
**Generated:** 2026-05-10T20:58:59.763Z
**Summary:** 12 PASS · 0 WARN · 0 FAIL · 0 SKIP

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `about.forbidden.deliberately_small_client_list` | ✅ | About page does not contain forbidden phrase "deliberately small client list" | phrase absent |
| `about.forbidden.global_distribution` | ✅ | About page does not contain forbidden phrase "global distribution" | phrase absent |
| `about.forbidden.Klein_Morgan` | ✅ | About page does not contain forbidden phrase "Klein Morgan" | phrase absent |
| `about.forbidden.sunandbreeze` | ✅ | About page does not contain forbidden phrase "sunandbreeze" | phrase absent |
| `about.serviceArea.canonical` | ✅ | About page renders the three canonical service-area entries | Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach |
| `about.no.designations` | ✅ | No unverified NAR designation names rendered | pattern not found |
| `about.no.yearsLicensed` | ✅ | No unverified 'practicing since YYYY' rendered (experience.since is null) | pattern not found |
| `about.no.salesVolume` | ✅ | No unverified sales-volume claim rendered | pattern not found |
| `about.no.awardClaims` | ✅ | No unverified awards/ranking claim rendered | pattern not found |
| `about.no.testimonials` | ✅ | No unverified testimonials section rendered | pattern not found |
| `about.license.notOnAbout` | ✅ | License # does not appear inside About <main> | license # absent from body (correctly lives on Footer + Terms) |
| `about.brokerage.lpt` | ✅ | About page attributes Mia to LPT Realty | LPT Realty present |