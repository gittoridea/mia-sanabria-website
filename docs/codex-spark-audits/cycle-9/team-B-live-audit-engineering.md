AUDIT_START

## Verdict
recommended_solution: live_reverse_proxy_css_injection
safe_to_implement_now: yes

## Root cause analysis
`--live` skips the Bun static server entirely:

- `isLive` currently sets `baseUrl = LIVE_BASE` and no server is started.
- Both captures (`auditMode=normal` and `auditMode=hide`) are sent to the same staging URL.
- The live app does not implement `auditMode` handling, so the injected audit stylesheet is never applied.
- Since screenshot1 and screenshot2 are visually identical, `sampleContrast` yields `glyphN=0`/`edgeN=0` and all rows become `WARN low samples`.
- Mutation mode also depends on the same injected stylesheet; in live mode it is effectively ineffective today.

## Solution options analyzed
1. Local DevTools Protocol injection with Chrome debugging
- Pros: exact real-site rendering path, no HTTP proxy layer, no HTML/content rewrites.
- Cons: requires new dependency (`chrome-remote-interface`/Playwright), additional connection lifecycle, higher blast radius for Bun-only baseline.

2. Pre-fetch + serve through local proxy (recommended)
- Pros: no new dependency, compatible with current Bun runtime and no live-host changes, preserves two-pass capture design exactly by serving a mutated HTML variant locally while proxying all other assets to live host, low operational risk.
- Cons: adds a network-forwarding path and introduces local server overhead for every request; still must handle upstream failures cleanly.

3. User profile `--user-data-dir` CSS (`Custom.css`) override
- Pros: pure browser startup approach, no per-asset proxy implementation.
- Cons: profile churn/state risk on shared runners, timing/order races, less deterministic in concurrent or repeated CI runs.

4. Capture-then-mask post-processing without hidden capture
- Pros: avoids hidden rendering entirely.
- Cons: does not preserve required hidden-vs-normal diff workflow; would change audit semantics and thresholds interpretation.

5. Extension injection via `--user-data-dir`
- Pros: deterministic runtime injection point.
- Cons: extra files/packaging for extension, longer setup, heavier CI footprint, not ideal for one-purpose script.

## Recommended solution — full TypeScript spec
Use the existing Bun static server for `--live` as a reverse proxy to `LIVE_BASE`; when the fetched upstream response is HTML, inject the same audit CSS rules (`[data-hero-heading]{visibility:hidden!important;}` and existing mutation CSS) before responding. Keep the existing `captureScreenshot` flow unchanged (`normal` then `hide`, image diff, glyph mask, thresholds).

```diff
*** Update File: scripts/audit-hero-pixel-contrast.ts
@@
 type Status = "PASS" | "WARN" | "FAIL" | "SKIP";
@@
-type StaticServer = { close: () => void; port: number };
-
-async function startStaticServer(port: number, mutation: boolean): Promise<StaticServer> {
+type StaticServer = { close: () => void; port: number };
+
+function contentTypeFromPath(filePath: string): string {
+  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) return "text/html; charset=utf-8";
+  if (filePath.endsWith(".js")) return "application/javascript";
+  if (filePath.endsWith(".css")) return "text/css";
+  if (filePath.endsWith(".json")) return "application/json";
+  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
+  if (filePath.endsWith(".png")) return "image/png";
+  if (filePath.endsWith(".webp")) return "image/webp";
+  if (filePath.endsWith(".svg")) return "image/svg+xml";
+  if (filePath.endsWith(".ico")) return "image/x-icon";
+  if (filePath.endsWith(".woff2")) return "font/woff2";
+  return "application/octet-stream";
+}
+
+function buildAuditCss(hideHeading: boolean, mutate: boolean): string {
+  const parts: string[] = [];
+  if (hideHeading) {
+    parts.push("[data-hero-heading]{visibility:hidden!important;}");
+  }
+  if (mutate) {
+    parts.push("[data-hero-overlay='content-scrim']{opacity:0.10!important;}");
+    parts.push("[data-hero-copy-panel]{background:transparent!important;border:none!important;box-shadow:none!important;}");
+  }
+  if (parts.length === 0) return "";
+  return `<style data-audit-cycle8>${parts.join("")}</style>`;
+}
+
+function injectAuditCss(html: string, hideHeading: boolean, mutate: boolean): string {
+  const css = buildAuditCss(hideHeading, mutate);
+  if (!css) return html;
+  if (!html.includes("</head>")) return html;
+  return html.replace("</head>", `${css}</head>`);
+}
+
+async function startStaticServer(port: number, mutation: boolean, liveBase?: string): Promise<StaticServer> {
   const indexFor = (urlPath: string): string => {
@@
-  const auditCss = (hideHeading: boolean, mutate: boolean): string => {
-    const parts: string[] = [];
-    if (hideHeading) {
-      parts.push("[data-hero-heading]{visibility:hidden!important;}");
-    }
-    if (mutate) {
-      parts.push("[data-hero-overlay='content-scrim']{opacity:0.10!important;}");
-      parts.push("[data-hero-copy-panel]{background:transparent!important;border:none!important;box-shadow:none!important;}");
-    }
-    if (parts.length === 0) return "";
-    return `<style data-audit-cycle8>${parts.join("")}</style>`;
-  };
-
   const server = Bun.serve({
     port,
     async fetch(req: Request): Promise<Response> {
       const url = new URL(req.url);
       const auditMode = url.searchParams.get("auditMode") || "normal";
       const mutate = (url.searchParams.get("mutation") || "").toLowerCase() === "true" || mutation;
       const path = decodeURIComponent(url.pathname);
+
+      if (liveBase) {
+        const upstream = `${liveBase.replace(/\/$/, "")}${path}${url.search}`;
+        const upstreamResp = await fetch(upstream);
+        if (!upstreamResp.ok) {
+          const body = await upstreamResp.text();
+          return new Response(body, { status: upstreamResp.status, headers: { "cache-control": "no-cache" } });
+        }
+
+        const upstreamType = upstreamResp.headers.get("content-type") || contentTypeFromPath(path);
+        const isHtml =
+          upstreamType.includes("text/html") ||
+          upstreamType.includes("application/xhtml+xml") ||
+          path.endsWith("/") ||
+          path.endsWith(".html") ||
+          path.endsWith(".htm");
+
+        if (isHtml) {
+          const rawHtml = await upstreamResp.text();
+          const html = injectAuditCss(rawHtml, auditMode === "hide", mutate);
+          return new Response(html, {
+            headers: {
+              "content-type": upstreamType || "text/html; charset=utf-8",
+              "cache-control": "no-cache",
+            },
+          });
+        }
+
+        const data = new Uint8Array(await upstreamResp.arrayBuffer());
+        return new Response(data, {
+          headers: {
+            "content-type": upstreamType || "application/octet-stream",
+            "cache-control": "no-cache",
+          },
+        });
+      }
 
       // Resolve to file
       let filePath = join(OUT_DIR, indexFor(path));
@@
-      const contentType = filePath.endsWith(".html")
-        ? "text/html; charset=utf-8"
-        : filePath.endsWith(".js")
-          ? "application/javascript"
-          : filePath.endsWith(".css")
-            ? "text/css"
-            : filePath.endsWith(".json")
-              ? "application/json"
-              : filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
-                ? "image/jpeg"
-                : filePath.endsWith(".png")
-                  ? "image/png"
-                  : filePath.endsWith(".webp")
-                    ? "image/webp"
-                    : filePath.endsWith(".svg")
-                      ? "image/svg+xml"
-                      : filePath.endsWith(".ico")
-                        ? "image/x-icon"
-                        : filePath.endsWith(".woff2")
-                          ? "font/woff2"
-                          : "application/octet-stream";
+      const contentType = contentTypeFromPath(filePath);
 
       if (filePath.endsWith(".html")) {
         let html = await readFile(filePath, "utf8");
-        const inj = auditCss(auditMode === "hide", mutate);
-        if (inj && html.includes("</head>")) {
-          html = html.replace("</head>", inj + "</head>");
-        }
+        html = injectAuditCss(html, auditMode === "hide", mutate);
         return new Response(html, { headers: { "content-type": contentType, "cache-control": "no-cache" } });
       }
 
       const data = await readFile(filePath);
       return new Response(data, { headers: { "content-type": contentType, "cache-control": "no-cache" } });
@@
 async function main(): Promise<void> {
   await mkdir(REPORTS_DIR, { recursive: true });
   await mkdir(SHOTS_DIR, { recursive: true });
 
   let server: StaticServer | null = null;
   let baseUrl: string;
   if (isLive) {
-    baseUrl = LIVE_BASE.replace(/\/$/, "");
+    server = await startStaticServer(PORT, isMutation, LIVE_BASE);
+    baseUrl = `http://127.0.0.1:${server.port}`;
   } else {
     server = await startStaticServer(PORT, isMutation);
     baseUrl = `http://127.0.0.1:${server.port}`;
   }
*** End Patch
```

Implementation details to keep:
- Do not alter `captureScreenshot`, `sampleContrast`, `statusFor`, or threshold constants.
- Keep local-mode path resolution and `--mutation` route-level behavior unchanged.
- Keep report schema, `counts`, exit code semantics, and markdown output unchanged.
- Keep `google-chrome --headless=new` as the render backend.
- Route discovery logic remains unchanged.
- For `--live`, all route screenshots now go through `127.0.0.1:<port>` where the local server forwards all resources from `LIVE_BASE` while applying audit CSS to HTML responses only.

## Acceptance criteria for this implementation
1. `bun run scripts/audit-hero-pixel-contrast.ts --live --routes=/ --base=https://miasanabriarealtor.trueidea.com` produces non-zero glyph sampling in at least one `Route × Viewport` row and exits with a summary that is not `0 PASS · 95 WARN · 0 FAIL · 0 SKIP`.
2. `bun run scripts/audit-hero-pixel-contrast.ts --mutation --live --routes=/ --base=https://miasanabriarealtor.trueidea.com` returns exit code `1` and includes at least one `FAIL` for route `/` because mutation must lower contrast.
3. `bun run scripts/audit-hero-pixel-contrast.ts --routes=/ --mutation` remains operational with local output `mode: local` in JSON and no new `mode`/server-type behavior regressions relative to current local behavior.
4. `bun run scripts/audit-hero-pixel-contrast.ts --live --routes=/ --base=https://miasanabriarealtor.trueidea.com` repeatedly twice back-to-back completes without intermittent `low samples` for both runs on the same route set (sampling reproducibility under fixed thresholds).

## Verification plan
1. Implement the Bun proxy patch and run a baseline live audit on `"/"` only to confirm normal/hide captures are different enough to yield positive glyph samples and realistic contrast values.
2. Compare `reports/audit-hero-pixel-contrast.json` rows for `/` and one desktop viewport before/after to verify `glyphSamples > 0` and `edgeSamples > 0` while thresholds remain `3.0/2.5` and status transitions reflect contrast results.
3. Run the mutation command in the same live run path and verify `FAIL` appears only due contrast degradation (not due fetch/render transport errors), satisfying the mutation sentinel.
4. Re-run local command with and without `--mutation` to verify behavior parity in local mode (route-skip handling, report format, and same status logic).
5. Expand to full route set once smoke is clean, then archive both markdown/JSON artifacts as the cycle 9 pass evidence.

## Closing JSON
{"team":"B","verdict":"pass","model_used":"gpt-5.3-codex-spark","reasoning_effort":"xhigh","approach":"live_reverse_proxy_css_injection","safe_to_implement_now":true,"completeness":"full"}
AUDIT_END
