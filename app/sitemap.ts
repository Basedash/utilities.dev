import type { MetadataRoute } from "next";
import { utilities } from "@/lib/generated/utilities-index";
import { getSiteUrl } from "@/lib/utilities/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...utilities.map((utility) => ({
      url: `${siteUrl}/${utility.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
