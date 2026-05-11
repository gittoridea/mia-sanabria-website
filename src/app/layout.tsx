import type { Metadata, Viewport } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { WebSiteSchema } from "@/components/schema/WebSiteSchema";
import { SITE, IS_STAGING } from "@/lib/site";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-cinzel",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.fullName }],
  keywords: [
    "Southeast Florida real estate",
    "Fort Lauderdale REALTOR®",
    "Boca Raton waterfront homes",
    "Delray Beach REALTOR®",
    "luxury waterfront homes",
    "Eastern Fort Lauderdale luxury",
    "REALTOR®",
    "LPT Realty",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.jpg`, width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [`${SITE.url}/og-default.jpg`],
  },
  alternates: {
    canonical: SITE.url,
    languages: { "en-US": SITE.url, "x-default": SITE.url },
  },
  robots: IS_STAGING
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: true, address: true, email: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${cinzel.variable} ${montserrat.variable}`}>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="alternate" hrefLang="en-US" href={SITE.url} />
        <link rel="alternate" hrefLang="x-default" href={SITE.url} />
      </head>
      <body>
        <OrganizationSchema />
        <WebSiteSchema />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
