import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, SearchCheck, Wrench } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOgImageUrl, getSiteUrl } from "@/lib/utilities/site";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/about`;
const title = "About utilities.dev | Developer Tools, Built for Trust";
const description =
  "Learn how utilities.dev builds fast developer tools with clear privacy boundaries, browser-local processing, and practical quality standards.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "about utilities.dev",
    "developer tools",
    "privacy-first developer tools",
    "browser local processing",
    "online coding utilities",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "utilities.dev",
    url: pageUrl,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "utilities.dev about page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [getOgImageUrl()],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About utilities.dev",
  description,
  url: pageUrl,
  mainEntity: {
    "@type": "Organization",
    name: "utilities.dev",
    url: siteUrl,
    parentOrganization: {
      "@type": "Organization",
      name: "Basedash",
      url: "https://www.basedash.com",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <JsonLd data={aboutJsonLd} />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Badge variant="outline">About utilities.dev</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Practical developer tools with explicit trust boundaries
          </h1>
          <p className="text-lg text-muted-foreground">
            utilities.dev is a collection of focused tools for day-to-day coding
            tasks. We prioritize speed, clarity, and transparent handling of your
            data.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Trust and privacy approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Most tools run directly in your browser so your input does not need
              to be submitted to our servers. When a tool has limits or important
              caveats, those boundaries are stated on that utility page.
            </p>
            <p>
              We avoid security theater. For example, decoding, formatting, or
              parsing output is not presented as verification or cryptographic
              proof.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchCheck className="h-5 w-5 text-primary" />
              What people should expect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Every utility is designed to be straightforward: clear input,
              predictable output, and direct feedback when something is invalid.
            </p>
            <p>
              We focus on useful defaults and practical workflows for developers,
              including API debugging, data transformation, encoding, decoding,
              and formatting tasks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintained by developers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              utilities.dev is maintained by the team at{" "}
              <Link
                href="https://www.basedash.com?ref=utilities.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Basedash
              </Link>{" "}
              and kept free to use. We continuously improve utility coverage and
              content quality so the site stays genuinely helpful for developer
              search intent.
            </p>
            <p>
              Browse all tools on the{" "}
              <Link href="/" className="text-primary hover:underline">
                homepage
              </Link>{" "}
              or review the{" "}
              <Link
                href="https://github.com/Basedash/utilities.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                open-source repository
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
