import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

