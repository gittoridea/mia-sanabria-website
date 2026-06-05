"use client";

import { useEffect } from "react";

/**
 * Reads `?source=...` from the URL on hydration and stamps it into hidden lead
 * source inputs. Also emits a no-PII GA4 `lead_submit` event when a stamped
 * lead form submits. Preserves mailto fallback and drops silently if GA is not
 * loaded.
 */

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: Record<string, string>) => void;
  }
}

export function LeadSourceStamp() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("source");
      const sanitized = source?.replace(/[^a-z0-9_-]/gi, "").slice(0, 32) || "direct";

      for (const el of document.querySelectorAll<HTMLInputElement>('input[name="source"]')) {
        el.value = sanitized;
      }

      const forms = Array.from(document.querySelectorAll<HTMLFormElement>("form[data-lead-form]"));
      const listeners = forms.map((form) => {
        const onSubmit = () => {
          const formId = form.dataset.leadForm || "lead";
          const leadSource = form.querySelector<HTMLInputElement>('input[name="source"]')?.value || "direct";
          window.gtag?.("event", "lead_submit", {
            form_id: formId,
            lead_source: leadSource,
          });
        };
        form.addEventListener("submit", onSubmit);
        return () => form.removeEventListener("submit", onSubmit);
      });

      return () => listeners.forEach((remove) => remove());
    } catch {
      // No-op — never break the page if URL parse fails.
    }
  }, []);
  return null;
}
