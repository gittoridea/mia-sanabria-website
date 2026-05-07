import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail } from "lucide-react";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream-300 bg-navy-800 text-cream-100" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-2xl tracking-[0.2em]">MIA SANABRIA</div>
          <div className="mt-1 text-xs uppercase tracking-[0.3em] text-brass-300">
            {SITE.positioning}
          </div>
          <p className="mt-5 text-sm text-cream-200/90 max-w-xs">
            {SITE.tagline}. Curating luxury waterfront estates across Boca Raton, Fort Lauderdale, and Palm Beach with discretion and rigor.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <FooterSocial href={MIA.social.facebook} label="Facebook">
              <Facebook className="h-4 w-4" aria-hidden />
            </FooterSocial>
            <FooterSocial href={MIA.social.instagram} label="Instagram">
              <Instagram className="h-4 w-4" aria-hidden />
            </FooterSocial>
            <FooterSocial href={MIA.social.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" aria-hidden />
            </FooterSocial>
            <FooterSocial href={MIA.social.youtube} label="YouTube">
              <Youtube className="h-4 w-4" aria-hidden />
            </FooterSocial>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.25em] text-brass-200">EXPLORE</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_NAV.explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brass-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.25em] text-brass-200">ABOUT</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_NAV.about.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brass-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={`tel:${MIA.contact.phoneTel}`}
                className="inline-flex items-center gap-2 hover:text-brass-300"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {MIA.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${MIA.contact.email}`}
                className="inline-flex items-center gap-2 hover:text-brass-300"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {MIA.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.25em] text-brass-200">BROKERAGE</h3>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            {MIA.name.legal}
            <br />
            {MIA.title}, {MIA.brokerage.display}
            <br />
            {MIA.contact.serviceCore.city}, {MIA.contact.serviceCore.region}{" "}
            {MIA.contact.serviceCore.postalCode}
          </address>
          {MIA.unverified.licenseNumber ? (
            <p className="mt-3 text-xs text-cream-200/80">
              FL License #{MIA.unverified.licenseNumber}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-cream-200/80">
            All information is deemed reliable but not guaranteed. Equal Housing Opportunity.
          </p>
        </div>
      </div>

      <div className="border-t border-cream-300/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-cream-200/80 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            © {year} {MIA.name.marketing}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {FOOTER_NAV.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brass-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterSocial({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream-200/30 transition-colors hover:border-brass-400 hover:text-brass-300"
    >
      {children}
    </a>
  );
}
