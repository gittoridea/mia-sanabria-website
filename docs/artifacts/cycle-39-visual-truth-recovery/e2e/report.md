# Home Search → Bridge E2E

base: https://miasanabriarealtor.trueidea.com
target: https://miasanabriarealtor.trueidea.com/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_mode: demo
passed: 11/11 | failed: 0

| Check | Result | Detail |
|-------|:------:|--------|
| home.form.action | PASS | homepage form action must be /home-search/ |
| home.form.source | PASS | hidden source=home-hero input must be present |
| home.form.city | PASS | homepage form must have city input |
| home.form.minPrice | PASS | homepage form must have minPrice input |
| home.form.beds | PASS | homepage form must have beds input |
| home.form.floating | PASS | homepage form must carry floating-card marker for layout-regression detection |
| search.bridge-mode-marker | PASS | data-bridge-runtime-mode must be live|demo|fallback|error (got demo) |
| search.no-old-idx-runtime | PASS | no old IDX runtime in rendered DOM |
| search.results-region-rendered | PASS | search results / demo banner / loading / error must render after JS executes |
| search.bridge-surface-present | PASS | BridgeSearch form must be rendered on /home-search/ |
| search.idx-disclosure-rendered | PASS | IDX/MLS disclosure copy must render under fixture or live results |