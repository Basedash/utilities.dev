import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Viewer - Preview, Format, and Analyze Markdown Files | Utilities.dev",
  description:
    "View, format, and analyze Markdown files with real-time HTML preview. Validate Markdown syntax, extract metadata, and count words, characters, and reading time. Free online Markdown viewer and editor tool.",
  keywords: [
    "markdown viewer",
    "markdown editor",
    "markdown formatter",
    "markdown preview",
    "markdown parser",
    "markdown to HTML",
    "md viewer",
    "markdown analyzer",
    "markdown validator",
    "markdown statistics",
  ],
  openGraph: {
    title: "Markdown Viewer - Preview, Format, and Analyze Markdown Files",
    description:
      "View, format, and analyze Markdown files with real-time HTML preview. Validate Markdown syntax and extract statistics.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Viewer - Preview, Format, and Analyze Markdown Files",
    description:
      "View, format, and analyze Markdown files with real-time HTML preview. Validate Markdown syntax and extract statistics.",
  },
};

export default function MarkdownViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
