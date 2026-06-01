import { ChevronDown } from "lucide-react";

type ScrollCueProps = {
  /** ID of the section to scroll to (omit the leading "#"). */
  targetId: string;
  /** Visible, accessible label naming the destination section. */
  label: string;
};

/**
 * Subtle "there's more below" affordance for the hero → content transition.
 *
 * Server-safe and JS-free: a plain in-page anchor relies on the global
 * `scroll-behavior: smooth` + `scroll-padding-top` already defined in
 * globals.css (which the global `prefers-reduced-motion` block also disables).
 * The chevron nudge uses the `animate-scroll-cue` token and is likewise
 * neutralized under reduced motion by that same global block. Focus styling is
 * inherited from the global `:focus-visible` rule, and the chevron is
 * decorative (`aria-hidden`) so the link text carries the meaning.
 */
export function ScrollCue({ targetId, label }: ScrollCueProps) {
  return (
    <div className="flex justify-center py-4 sm:py-5">
      <a
        href={`#${targetId}`}
        className="group inline-flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-navy-700 transition-colors hover:text-navy-900"
      >
        <span>{label}</span>
        <ChevronDown aria-hidden className="h-4 w-4 text-brass-500 animate-scroll-cue" />
      </a>
    </div>
  );
}
