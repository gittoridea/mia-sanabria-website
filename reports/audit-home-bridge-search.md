# audit-home-bridge-search PASS

base: local:out/

- PASS `home_form_action_home_search` — homepage contains <form action="/home-search/">
- PASS `home_form_source_hidden` — hidden input source=home-hero found
- PASS `home_form_filter_inputs` — city=true minPrice=true beds=true
- PASS `home_form_legacy_action_absent` — no legacy /markets/#property-search action on homepage
- PASS `home_no_old_idx` — homepage clean of old IDX markers
- PASS `home_floating_marker` — homepage contains floating-search-card marker
- PASS `home_search_bridge_form` — /home-search/ exposes BridgeSearch surface
- PASS `home_search_no_old_idx` — /home-search/ clean of old IDX markers
