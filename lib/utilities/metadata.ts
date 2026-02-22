import type { Metadata } from "next";
import type { UtilityManifest } from "@/lib/utilities/types";
import { getSiteUrl, SITE_NAME } from "@/lib/utilities/site";

export function buildUtilityMetadata(manifest: UtilityManifest): Metadata {
  const canonicalPath = `/${manifest.slug}`;
  const title = manifest.seo?.title ?? `${manifest.title} | ${SITE_NAME}`;
  const description = manifest.seo?.description ?? manifest.description;
  const keywords = manifest.seo?.keywords ?? manifest.tags;
  const fullUrl = `${getSiteUrl()}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
