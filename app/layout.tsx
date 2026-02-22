import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebsiteJsonLd } from "@/lib/utilities/metadata";
import { getOgImageUrl, getSiteUrl } from "@/lib/utilities/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "utilities.dev - Essential Developer Tools",
  description:
    "A collection of essential developer utilities including Base64 encoding, JSON formatting, regex testing, and more. Simple, fast, and free online tools.",
  keywords: [
    "developer tools",
    "utilities",
    "base64",
    "json formatter",
    "regex tester",
    "online tools",
    "free tools",
  ],
  authors: [{ name: "utilities.dev" }],
  openGraph: {
    title: "utilities.dev - Essential Developer Tools",
    description:
      "A collection of essential developer utilities including Base64 encoding, JSON formatting, regex testing, and more. Simple, fast, and free online tools.",
    siteName: "utilities.dev",
    type: "website",
    url: getSiteUrl(),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "utilities.dev OG image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "utilities.dev - Essential Developer Tools",
    description:
      "A collection of essential developer utilities including Base64 encoding, JSON formatting, regex testing, and more.",
    images: [getOgImageUrl()],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JsonLd data={buildWebsiteJsonLd()} />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
