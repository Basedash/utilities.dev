import type { Metadata } from "next";
import type { UtilityManifest } from "@/lib/utilities/types";
import { getOgImageUrl, getSiteUrl, SITE_NAME } from "@/lib/utilities/site";

export function buildUtilityMetadata(manifest: UtilityManifest): Metadata {
  const canonicalPath = `/${manifest.slug}`;
  const title = manifest.seo?.title ?? `${manifest.title} | ${SITE_NAME}`;
  const description = manifest.seo?.description ?? manifest.description;
  const keywords = manifest.seo?.keywords ?? manifest.tags;
  const fullUrl = `${getSiteUrl()}${canonicalPath}`;
  const imageUrl = getOgImageUrl(manifest.slug);

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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${manifest.title} OG image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description:
      "A collection of essential developer utilities for everyday coding tasks.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function buildUtilityJsonLd(manifest: UtilityManifest) {
  const siteUrl = getSiteUrl();
  const utilityUrl = `${siteUrl}/${manifest.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: manifest.title,
    applicationCategory: manifest.category,
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description: manifest.description,
    url: utilityUrl,
    keywords: manifest.tags.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}
