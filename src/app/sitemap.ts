import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { MARKETS } from "@/lib/markets";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/buyers/`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/sellers/`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/valuation/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/markets/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/insights/`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/accessibility/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  const marketRoutes: MetadataRoute.Sitemap = MARKETS.map((m) => ({
    url: `${base}/markets/${m.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));
  return [...staticRoutes, ...marketRoutes];
}
