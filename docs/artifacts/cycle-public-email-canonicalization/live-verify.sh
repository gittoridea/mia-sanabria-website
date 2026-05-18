#!/usr/bin/env bash
# Live verification — public email canonicalization
# Cache-busted body GET (not just HEAD/ETag) per CLAUDE.md operational rule.
set -euo pipefail
BASE="https://miasanabriarealtor.trueidea.com"
ROUTES=(
  /
  /about/
  /contact/
  /buyers/
  /sellers/
  /valuation/
  /markets/
  /insights/
  /privacy/
  /terms/
  /accessibility/
  /dmca/
)
CANONICAL="mia@miasanabria.com"
LEGACY="msanabriarea@gmail.com"
BRANDED="mia@miasanabriarealtor.com"
A3K="accessibility@agent3000.com"
SUN="sunandbreeze"
KMM="Klein Morgan"
FHM="Family Homes Where Memories"

printf "%-25s | %-6s | %-4s | %-6s | %-7s | %-6s | %-3s | %-3s | %-3s\n" "route" "status" "can" "legacy" "branded" "a3kcom" "sun" "klm" "fhm"
echo "------------------------------------------------------------------------------------------------------------"

for r in "${ROUTES[@]}"; do
  cb=$(node -e "console.log(require('crypto').randomBytes(8).toString('hex'))")
  url="${BASE}${r}?cb=${cb}"
  resp=$(curl -sS -o /tmp/page_body.html -w "%{http_code}" -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' "$url" || echo "ERR")
  bytes=$(wc -c < /tmp/page_body.html | tr -d ' ')
  has_canon=$(grep -c -F "$CANONICAL" /tmp/page_body.html || true)
  has_legacy=$(grep -c -F "$LEGACY" /tmp/page_body.html || true)
  has_branded=$(grep -c -F "$BRANDED" /tmp/page_body.html || true)
  has_a3k=$(grep -c -F "$A3K" /tmp/page_body.html || true)
  has_sun=$(grep -c -F "$SUN" /tmp/page_body.html || true)
  has_klm=$(grep -c -F "$KMM" /tmp/page_body.html || true)
  has_fhm=$(grep -c -F "$FHM" /tmp/page_body.html || true)
  printf "%-25s | %-6s | %-4s | %-6s | %-7s | %-6s | %-3s | %-3s | %-3s\n" "$r" "$resp" "$has_canon" "$has_legacy" "$has_branded" "$has_a3k" "$has_sun" "$has_klm" "$has_fhm"
done

echo ""
echo "--- /sitemap.xml + /robots.txt status ---"
for r in /sitemap.xml /robots.txt; do
  cb=$(node -e "console.log(require('crypto').randomBytes(8).toString('hex'))")
  resp=$(curl -sS -o /tmp/page_body.html -w "%{http_code}" -H 'Cache-Control: no-cache' "${BASE}${r}?cb=${cb}" || echo "ERR")
  bytes=$(wc -c < /tmp/page_body.html | tr -d ' ')
  printf "%-25s | %s | %s bytes\n" "$r" "$resp" "$bytes"
done

echo ""
echo "--- production / miasanabria.com check ---"
cb=$(node -e "console.log(require('crypto').randomBytes(8).toString('hex'))")
prod_resp=$(curl -sS -o /tmp/prod_body.html -w "%{http_code}" -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' "https://miasanabria.com/?cb=${cb}" || echo "ERR")
prod_canon=$(grep -c -F "$CANONICAL" /tmp/prod_body.html || true)
prod_legacy=$(grep -c -F "$LEGACY" /tmp/prod_body.html || true)
prod_branded=$(grep -c -F "$BRANDED" /tmp/prod_body.html || true)
prod_react=$(grep -c -F "<div id=\"root\">" /tmp/prod_body.html || true)
prod_next=$(grep -c -F "/_next/" /tmp/prod_body.html || true)
echo "https://miasanabria.com/ : status=${prod_resp}"
echo "  canonical present: ${prod_canon}"
echo "  legacy present:    ${prod_legacy}"
echo "  branded present:   ${prod_branded}"
echo "  React-SPA marker (div#root): ${prod_react}"
echo "  Next.js marker (/_next/):    ${prod_next}"
