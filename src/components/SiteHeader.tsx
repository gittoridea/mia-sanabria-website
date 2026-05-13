"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, Search } from "lucide-react";
import { NAV, SEARCH_ICON_HREF } from "@/lib/site";
import { MIA } from "@/lib/mia";
import { cn } from "@/lib/cn";
import { NavLink } from "./NavLink";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      drawerRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
    const first = focusables()?.[0];
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (!list || list.length === 0) return;
      const head = list[0];
      const tail = list[list.length - 1];
      if (event.shiftKey && document.activeElement === head) {
        tail?.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === tail) {
        head?.focus();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-lpt.png"
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full bg-navy-800 p-1"
            priority
          />
          <div className="leading-tight">
            <div className="font-display text-base tracking-[0.2em] text-navy-800">
              MIA SANABRIA
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass-700">
              REALTOR® · LPT Realty
            </div>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  matchPrefix
                  className="text-sm tracking-wide text-navy-800 transition-colors hover:text-brass-700 aria-[current=page]:text-brass-700 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                href={SEARCH_ICON_HREF}
                aria-label="Home Search"
                title="Home Search"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-800 text-navy-800 transition-colors hover:bg-navy-800 hover:text-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
              >
                <Search className="h-4 w-4" aria-hidden />
              </Link>
            </li>
            <li>
              <a
                href={`tel:${MIA.contact.phoneTel}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-800 px-4 py-2 text-sm tracking-wide text-navy-800 transition-colors hover:bg-navy-800 hover:text-cream-100"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {MIA.contact.phone}
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-full border border-navy-800 text-navy-800"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      <nav
        ref={drawerRef}
        id="mobile-nav"
        aria-label="Mobile primary"
        aria-hidden={!open}
        aria-modal={open ? true : undefined}
        role={open ? "dialog" : undefined}
        className={cn(
          "lg:hidden border-t border-cream-300 bg-cream-50",
          open ? "block" : "hidden",
        )}
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 lg:px-8">
          {NAV.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                matchPrefix
                onNavigate={() => setOpen(false)}
                className="block min-h-[44px] py-3 text-base text-navy-800 hover:text-brass-700 aria-[current=page]:text-brass-700 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href={SEARCH_ICON_HREF}
              aria-label="Home Search"
              title="Home Search"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-800 px-4 py-2 text-sm tracking-wide text-navy-800"
            >
              <Search className="h-4 w-4" aria-hidden />
              Home Search
            </Link>
          </li>
          <li className="pt-2">
            <a
              href={`tel:${MIA.contact.phoneTel}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-800 px-4 py-2 text-sm tracking-wide text-navy-800"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {MIA.contact.phone}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
