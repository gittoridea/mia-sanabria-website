"use client";

import { useEffect } from "react";

/**
 * Reads `?source=…` from the URL on hydration and stamps it into the hidden
 * `<input id="lead-source">` on the active form. Preserves mailto fallback —
 * the stamped value surfaces in the mailto body via `encType="text/plain"`.
 * No CRM dependency, no analytics, no network call. Drops silently if the
 * URL param is absent or the form is not on the page.
 */
export function LeadSourceStamp() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("source");
      if (!source) return;
      const sanitized = source.replace(/[^a-z0-9_-]/gi, "").slice(0, 32);
      if (!sanitized) return;
      const el = document.getElementById("lead-source");
      if (el && el instanceof HTMLInputElement) {
        el.value = sanitized;
      }
    } catch {
      // No-op — never break the page if URL parse fails.
    }
  }, []);
  return null;
}
