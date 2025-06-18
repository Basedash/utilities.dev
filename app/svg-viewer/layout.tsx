import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Viewer - View, Format, and Analyze SVG Files | Utilities.dev",
  description:
    "View, format, minify, and analyze SVG files with real-time preview. Validate SVG syntax, extract metadata, and sanitize potentially dangerous elements. Free online SVG viewer and editor tool.",
  keywords: [
    "SVG viewer",
    "SVG editor",
    "SVG formatter",
    "SVG validator",
    "SVG minifier",
    "SVG sanitizer",
    "vector graphics",
    "XML viewer",
    "SVG analyzer",
    "scalable vector graphics",
  ],
  openGraph: {
    title: "SVG Viewer - View, Format, and Analyze SVG Files",
    description:
      "View, format, minify, and analyze SVG files with real-time preview. Validate SVG syntax and extract metadata.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG Viewer - View, Format, and Analyze SVG Files",
    description:
      "View, format, minify, and analyze SVG files with real-time preview. Validate SVG syntax and extract metadata.",
  },
};

export default function SvgViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
