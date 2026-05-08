"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV } from "@/lib/site";
import { MIA } from "@/lib/mia";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/85">
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
                <Link
                  href={item.href}
                  className="text-sm tracking-wide text-navy-800 transition-colors hover:text-brass-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`tel:${MIA.contact.phoneTel}`}
                className="inline-flex items-center gap-2 rounded-full border border-navy-800 px-4 py-2 text-sm tracking-wide text-navy-800 transition-colors hover:bg-navy-800 hover:text-cream-100"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {MIA.contact.phone}
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-800 text-navy-800"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile primary"
        aria-hidden={!open}
        className={cn(
          "lg:hidden border-t border-cream-300 bg-cream-50",
          open ? "block" : "hidden",
        )}
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 lg:px-8">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base text-navy-800 hover:text-brass-700"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a
              href={`tel:${MIA.contact.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-full border border-navy-800 px-4 py-2 text-sm tracking-wide text-navy-800"
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
