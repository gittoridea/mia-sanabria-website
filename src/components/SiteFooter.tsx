import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail } from "lucide-react";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";
import { NavLink } from "./NavLink";

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
            {SITE.tagline}. Real estate guidance for luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach buyers and sellers, delivered with discretion and rigor.
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
                <NavLink
                  href={item.href}
                  matchPrefix
                  className="block min-h-[44px] py-2 hover:text-brass-300 aria-[current=page]:text-brass-300 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.25em] text-brass-200">ABOUT</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_NAV.about.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  matchPrefix
                  className="block min-h-[44px] py-2 hover:text-brass-300 aria-[current=page]:text-brass-300 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </NavLink>
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
            {MIA.title}, {MIA.brokerage.legal}
            <br />
            {MIA.contact.serviceCore.city}, {MIA.contact.serviceCore.region}{" "}
            {MIA.contact.serviceCore.postalCode}
          </address>
          {MIA.unverified.licenseNumber ? (
            <p className="mt-3 text-xs text-cream-200/80">
              FL Sales Associate License #{MIA.unverified.licenseNumber}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-cream-200/80">
            All information is deemed reliable but not guaranteed. IDX listings provided
            for consumers&rsquo; personal, non-commercial use; not for redistribution.
          </p>
        </div>
      </div>

      <div className="border-t border-cream-300/15">
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-4 py-10 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:px-8"
          aria-label="Industry affiliations"
        >
          {/* Cycle 11 — uniform monochrome white-on-transparent treatment.
              The three trust-mark assets (LPT white-on-transparent, REALTOR®+MLS dark-on-transparent,
              EHO black-on-transparent) presented three different visibility outcomes on the navy footer
              when rendered as-is. Applying `brightness-0 invert opacity-90` normalizes all three to
              discreet white silhouettes — compliance-permitted monochrome variants for NAR REALTOR®
              + HUD EHO marks, brand-aligned for LPT (canonical white-on-navy). LPT's prior
              `bg-white/95 p-1` tile rendered the white-on-transparent logo invisible; tile removed.
              Heights balanced by visual weight: square LPT + portrait EHO at h-10; the wide 2.18:1
              REALTOR®+MLS combined mark at h-7 lg:h-8 keeps the row visually balanced. Card 5 (asset
              swap) remains principal-decision-gated in PRINCIPAL_DECISION_REGISTER; no semantic change. */}
          <FooterTrustMark
            src="/logos/lpt-realty.png"
            alt=""
            width={40}
            height={40}
            imageClassName="h-10 w-10 brightness-0 invert opacity-90"
            label="LPT Realty"
          />
          <FooterTrustMark
            src="/logos/realtor-r.png"
            alt=""
            width={64}
            height={30}
            imageClassName="h-7 w-auto brightness-0 invert opacity-90 lg:h-8"
            label="REALTOR®"
          />
          <FooterTrustMark
            src="/logos/equal-housing.png"
            alt=""
            width={36}
            height={40}
            imageClassName="h-10 w-auto brightness-0 invert opacity-90"
            label="Equal Housing Opportunity"
          />
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
                <NavLink
                  href={item.href}
                  className="inline-flex min-h-[28px] items-center hover:text-brass-300 aria-[current=page]:text-brass-300 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterTrustMark({
  src,
  alt,
  width,
  height,
  imageClassName,
  label,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  imageClassName: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:text-left">
      <Image src={src} alt={alt} width={width} height={height} className={imageClassName} />
      <span className="max-w-[12rem] break-words font-display text-[10px] uppercase tracking-[0.18em] text-cream-200/80 [overflow-wrap:anywhere] min-[360px]:tracking-[0.22em] min-[375px]:max-w-none min-[375px]:tracking-[0.3em]">
        {label}
      </span>
    </div>
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/30 transition-colors hover:border-brass-400 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
    >
      {children}
    </a>
  );
}
