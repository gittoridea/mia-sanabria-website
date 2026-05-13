# Audit About Report
**Generated:** 2026-05-13T20:42:08.865Z
**Summary:** 12 PASS · 0 WARN · 0 FAIL · 0 SKIP

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `about.forbidden.deliberately_small_client_list` | ✅ | Sitewide service pages do not contain forbidden phrase "deliberately small client list" | phrase absent across 5 routes |
| `about.forbidden.global_distribution` | ✅ | Sitewide service pages do not contain forbidden phrase "global distribution" | phrase absent across 5 routes |
| `about.forbidden.Klein_Morgan` | ✅ | Sitewide service pages do not contain forbidden phrase "Klein Morgan" | phrase absent across 5 routes |
| `about.forbidden.sunandbreeze` | ✅ | Sitewide service pages do not contain forbidden phrase "sunandbreeze" | phrase absent across 5 routes |
| `about.serviceArea.canonical` | ✅ | About page renders the three canonical service-area entries | Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach |
| `about.no.designations` | ✅ | No unverified NAR designation names rendered | pattern not found |
| `about.no.yearsLicensed` | ✅ | No unverified 'practicing since YYYY' rendered (experience.since is null) | pattern not found |
| `about.no.salesVolume` | ✅ | No unverified sales-volume claim rendered | pattern not found |
| `about.no.awardClaims` | ✅ | No unverified awards/ranking claim rendered | pattern not found |
| `about.no.testimonials` | ✅ | No unverified testimonials section rendered | pattern not found |
| `about.license.notOnAbout` | ✅ | License # does not appear inside About <main> | license # absent from body (correctly lives on Footer + Terms) |
| `about.brokerage.lpt` | ✅ | About page attributes Mia to LPT Realty | LPT Realty present |